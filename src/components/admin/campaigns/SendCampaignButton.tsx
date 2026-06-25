"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SendCampaignButton({ campaignId }: { campaignId: string }) {
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!confirm("Envoyer cette campagne à tous les contacts du segment ?")) return;
    setSending(true);
    await fetch("/api/campaigns/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId }),
    });
    router.refresh();
    setSending(false);
  };

  return (
    <button
      onClick={handleSend}
      disabled={sending}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 disabled:opacity-50 transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
      {sending ? "Envoi en cours..." : "Envoyer la campagne"}
    </button>
  );
}
