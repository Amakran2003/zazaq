export default function SettingsPage() {
  return (
    <>
      <h1 className="[font-family:var(--font-display)] text-2xl font-bold text-slate-900 mb-8">Paramètres</h1>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Équipe</h2>
        <p className="text-sm text-slate-500 mb-6">Gérez les membres de votre équipe et leurs rôles.</p>
        <div className="border border-dashed border-slate-200 rounded-lg p-8 text-center">
          <p className="text-sm text-slate-400">Fonctionnalité disponible après la configuration de Supabase Auth.</p>
        </div>
      </div>
    </>
  );
}
