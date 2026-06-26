"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/client";

type ColumnMapping = Record<string, string>;

const FIELDS = [
  { key: "email", label: "Email", required: true },
  { key: "first_name", label: "Prénom" },
  { key: "last_name", label: "Nom" },
  { key: "phone", label: "Téléphone" },
  { key: "company", label: "Entreprise" },
  { key: "status", label: "Statut" },
  { key: "source", label: "Source" },
  { key: "notes", label: "Notes" },
  { key: "__skip", label: "— Ignorer —" },
];

const HEURISTICS: Record<string, string[]> = {
  email: ["email", "mail", "e-mail", "courriel", "adresse mail"],
  first_name: ["prenom", "prénom", "firstname", "first_name", "first name"],
  last_name: ["nom", "lastname", "last_name", "last name", "nom de famille"],
  phone: ["telephone", "téléphone", "tel", "phone", "mobile", "portable"],
  company: ["entreprise", "company", "société", "societe", "organisation"],
  status: ["statut", "status"],
  source: ["source", "origine", "canal"],
  notes: ["notes", "commentaire", "remarque"],
};

function autoMap(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  headers.forEach((h) => {
    const normalized = h.toLowerCase().trim();
    for (const [field, keywords] of Object.entries(HEURISTICS)) {
      if (keywords.some((k) => normalized.includes(k))) {
        if (!Object.values(mapping).includes(field)) {
          mapping[h] = field;
          return;
        }
      }
    }
    mapping[h] = "__skip";
  });
  return mapping;
}

export default function ImportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Chargement...</div>}>
      <ImportPageInner />
    </Suspense>
  );
}

function ImportPageInner() {
  const searchParams = useSearchParams();
  const existingListId = searchParams.get("list");

  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: number; listId: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [listName, setListName] = useState("");
  const [existingListName, setExistingListName] = useState("");

  const supabase = createClient();

  useEffect(() => {
    if (existingListId) {
      supabase.from("contact_lists").select("name").eq("id", existingListId).single().then(({ data }) => {
        if (data) setExistingListName(data.name);
      });
    }
  }, [existingListId]);

  const processFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });
      if (json.length === 0) return;
      const hdrs = Object.keys(json[0]);
      setHeaders(hdrs);
      setRows(json);
      setMapping(autoMap(hdrs));
    };
    reader.readAsArrayBuffer(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const handleImport = async () => {
    setImporting(true);
    const mapped = rows.map((row) => {
      const contact: Record<string, string> = {};
      for (const [col, field] of Object.entries(mapping)) {
        if (field !== "__skip" && row[col]) {
          contact[field] = String(row[col]).trim();
        }
      }
      return contact;
    }).filter((c) => c.email);

    try {
      const res = await fetch("/api/contacts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contacts: mapped,
          list_id: existingListId || undefined,
          new_list_name: !existingListId ? listName.trim() : undefined,
        }),
      });
      const data = await res.json();
      setResult({ imported: data.imported || 0, errors: data.errors || 0, listId: data.listId || "" });
    } catch {
      setResult({ imported: 0, errors: mapped.length, listId: "" });
    }
    setImporting(false);
  };

  if (result) {
    return (
      <>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900 mb-8">Import terminé</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <p className="text-lg font-semibold text-slate-900 mb-2">{result.imported} contacts importés</p>
          {result.errors > 0 && <p className="text-sm text-red-500 mb-2">{result.errors} erreurs</p>}
          <div className="flex justify-center gap-3 mt-6">
            {result.listId && <a href={`/admin/contacts/${result.listId}`} className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800">Voir la liste</a>}
            <a href="/admin/contacts" className="px-4 py-2 text-sm font-medium border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50">Toutes les listes</a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900 mb-8">Importer des contacts</h1>

      {/* List name */}
      {!existingListId && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <label className="text-sm font-medium text-slate-700 mb-2 block">Nom de la liste</label>
          <input value={listName} onChange={(e) => setListName(e.target.value)} placeholder="Ex: Experts comptables Q3" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" />
          <p className="text-xs text-slate-400 mt-1.5">Les contacts importés seront ajoutés à cette liste.</p>
        </div>
      )}
      {existingListId && existingListName && (
        <div className="bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl px-5 py-3 mb-6 text-sm text-accent-cyan">
          Import dans la liste : <strong>{existingListName}</strong>
        </div>
      )}

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`bg-white rounded-xl border-2 border-dashed p-12 text-center transition-colors ${dragOver ? "border-accent-cyan bg-accent-cyan/5" : "border-slate-200"}`}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-slate-400"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <p className="text-slate-600 font-medium mb-2">Glissez un fichier Excel ou CSV ici</p>
          <p className="text-sm text-slate-400 mb-4">ou</p>
          <label className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer">
            Choisir un fichier
            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
          </label>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-400">{rows.length} lignes détectées</p>
              </div>
              <button onClick={() => { setFile(null); setHeaders([]); setRows([]); }} className="text-sm text-slate-500 hover:text-slate-900">Changer</button>
            </div>
            <h2 className="font-semibold text-slate-900 mb-3">Mapping des colonnes</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {headers.map((h) => (
                <div key={h} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 min-w-[120px] truncate" title={h}>{h}</span>
                  <select value={mapping[h] || "__skip"} onChange={(e) => setMapping({ ...mapping, [h]: e.target.value })} className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan/30">
                    {FIELDS.map((f) => <option key={f.key} value={f.key}>{f.label}{f.required ? " *" : ""}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 overflow-x-auto">
            <h2 className="font-semibold text-slate-900 mb-3">Aperçu</h2>
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>{headers.filter((h) => mapping[h] !== "__skip").map((h) => <th key={h} className="px-3 py-2 text-left font-medium text-slate-500">{mapping[h]}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i}>{headers.filter((h) => mapping[h] !== "__skip").map((h) => <td key={h} className="px-3 py-2 text-slate-700">{row[h]}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={handleImport} disabled={importing || !Object.values(mapping).includes("email") || (!existingListId && !listName.trim())} className="px-6 py-3 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors">
            {importing ? "Import en cours..." : `Importer ${rows.length} contacts`}
          </button>
          {!Object.values(mapping).includes("email") && <p className="mt-2 text-sm text-red-500">Mappez au moins une colonne vers &quot;Email&quot;.</p>}
          {!existingListId && !listName.trim() && <p className="mt-2 text-sm text-amber-600">Donnez un nom à la liste avant d&apos;importer.</p>}
        </>
      )}
    </>
  );
}
