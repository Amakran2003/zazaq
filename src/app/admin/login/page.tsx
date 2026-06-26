"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="[font-family:var(--font-display)] text-2xl font-bold text-slate-900">Zazaq Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Connectez-vous pour accéder au dashboard.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-[44px] px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
            Mot de passe
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="min-h-[44px] px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan" />
          </label>
          <button type="submit" disabled={loading} className="w-full min-h-[44px] px-6 py-3 text-sm font-semibold bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 transition-colors">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
