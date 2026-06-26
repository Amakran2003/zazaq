"use client";

import { useState, useMemo } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassButton } from "@/components/ui/GlassButton";
import { Navbar } from "@/components/landing/Navbar";
import { AmbientBackground } from "@/components/landing/AmbientBackground";
import { Footer } from "@/components/landing/Footer";

const SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = [];
  const day = new Date(startDate);
  const dow = day.getDay();
  const diff = dow === 0 ? 1 : dow === 6 ? 2 : 0;
  day.setDate(day.getDate() + diff);
  for (let i = 0; i < 5; i++) {
    const d = new Date(day);
    d.setDate(day.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(d);
  }
  return days;
}

function formatFull(date: Date) {
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

export default function BookingPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const baseDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const days = useMemo(() => getWeekDays(baseDate), [baseDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedSlot) return;
    await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, date: selectedDay.toISOString(), slot: selectedSlot }),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <AmbientBackground />
        <Navbar />
        <main className="pt-[clamp(4rem,10vw,7rem)] pb-12 px-4 max-w-[700px] mx-auto text-center">
          <GlassPanel variant="strong" className="p-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-cyan/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-cyan"><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h1 className="[font-family:var(--font-display)] text-2xl font-bold text-slate-900 mb-3">Demande envoyée !</h1>
            <p className="text-slate-500 mb-2">{selectedDay && `${formatFull(selectedDay)} à ${selectedSlot}`}</p>
            <p className="text-sm text-slate-400">Vous recevrez une confirmation à <strong className="text-slate-600">{email}</strong> sous 24h.</p>
          </GlassPanel>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main className="pt-[clamp(3rem,8vw,5rem)] pb-12 px-4 max-w-[900px] mx-auto">
        <div className="text-center mb-10">
          <p className="inline-block mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-accent-cyan">Réservation</p>
          <h1 className="[font-family:var(--font-display)] text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-slate-900 mb-2">
            Choisissez un créneau pour votre diagnostic
          </h1>
          <p className="text-slate-500">30 minutes · gratuit · en visio</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] items-start">
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-5">
              <button type="button" onClick={() => setWeekOffset((w) => Math.max(0, w - 1))} disabled={weekOffset === 0} className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" aria-label="Semaine précédente">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4L6 8l4 4" /></svg>
              </button>
              <span className="text-sm font-medium text-slate-700">{days[0]?.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span>
              <button type="button" onClick={() => setWeekOffset((w) => Math.min(3, w + 1))} disabled={weekOffset >= 3} className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" aria-label="Semaine suivante">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4l4 4-4 4" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-5">
              {days.map((day) => {
                const isSelected = selectedDay?.toDateString() === day.toDateString();
                const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                return (
                  <button key={day.toISOString()} type="button" disabled={isPast} onClick={() => { setSelectedDay(day); setSelectedSlot(null); }} className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-center transition-all duration-200 ${isSelected ? "bg-slate-900 text-white shadow-md" : isPast ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100"}`}>
                    <span className="text-[0.6875rem] font-medium uppercase">{day.toLocaleDateString("fr-FR", { weekday: "short" })}</span>
                    <span className="text-lg font-semibold">{day.getDate()}</span>
                  </button>
                );
              })}
            </div>
            {selectedDay && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Créneaux disponibles</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {SLOTS.map((slot) => (
                    <button key={slot} type="button" onClick={() => setSelectedSlot(slot)} className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSlot === slot ? "bg-accent-cyan text-white shadow-sm" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100"}`}>{slot}</button>
                  ))}
                </div>
              </div>
            )}
            {!selectedDay && <p className="text-center text-sm text-slate-400 py-6">Sélectionnez un jour pour voir les créneaux.</p>}
          </GlassPanel>

          <GlassPanel variant="strong" className="p-6">
            <h2 className="font-semibold text-slate-900 mb-1">Vos coordonnées</h2>
            <p className="text-sm text-slate-400 mb-5">{selectedDay && selectedSlot ? `${formatFull(selectedDay)} à ${selectedSlot}` : "Choisissez un créneau"}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
                Nom complet
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" className="min-h-[44px] px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/30 focus-visible:border-accent-cyan transition-colors" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
                Email
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@entreprise.fr" autoComplete="email" className="min-h-[44px] px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/30 focus-visible:border-accent-cyan transition-colors" />
              </label>
              <button type="submit" disabled={!selectedDay || !selectedSlot} className={`min-h-[44px] px-6 py-3 text-[0.9375rem] font-semibold rounded-full bg-slate-900 text-white shadow-[0_2px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none mt-2`}>
                Confirmer le créneau
              </button>
            </form>
            <p className="text-xs text-slate-400 text-center mt-4">Vous recevrez un lien visio par email après confirmation.</p>
          </GlassPanel>
        </div>
      </main>
      <Footer />
    </>
  );
}
