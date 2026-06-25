export type TemplateId = "cabinets" | "welcome" | "relance" | "diagnostic" | "newsletter";

export type TemplateVars = {
  prenom?: string;
  nom?: string;
  entreprise?: string;
  lien_tracking?: string;
  sujet?: string;
  contenu?: string;
};

const WRAPPER_START = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Instrument Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;border:1px solid rgba(0,0,0,0.06);overflow:hidden;">
<!-- Header -->
<tr><td style="padding:32px 40px 24px;border-bottom:1px solid #f1f5f9;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td><span style="font-family:'Syne',system-ui,sans-serif;font-size:20px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;">Zazaq</span></td>
<td align="right"><span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#0d9488;background:#f0fdfa;padding:4px 10px;border-radius:20px;">Automatisation</span></td>
</tr></table>
</td></tr>
<!-- Body -->
<tr><td style="padding:32px 40px;">`;

const WRAPPER_END = `</td></tr>
<!-- Footer -->
<tr><td style="padding:24px 40px 32px;border-top:1px solid #f1f5f9;background:#fafbfc;">
<p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">Zazaq — Automatisation sur mesure pour les PME et indépendants.</p>
<p style="margin:8px 0 0;font-size:12px;color:#cbd5e1;">Vous recevez cet email car vous êtes inscrit chez Zazaq. <a href="{{lien_tracking}}" style="color:#64748b;">Se désinscrire</a></p>
</td></tr>
</table>
</td></tr></table>
<img src="{{pixel_url}}" width="1" height="1" style="display:none;" alt="" />
</body></html>`;

const CTA_BUTTON = (text: string) =>
  `<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;"><tr><td align="center">
<a href="{{lien_tracking}}" style="display:inline-block;padding:14px 32px;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:50px;font-weight:600;font-size:14px;letter-spacing:0.01em;">${text}</a>
</td></tr></table>`;

const p = (text: string) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#475569;">${text}</p>`;
const h2 = (text: string) => `<h2 style="margin:0 0 20px;font-size:18px;font-weight:600;color:#0f172a;line-height:1.4;">${text}</h2>`;
const divider = `<div style="height:1px;background:#f1f5f9;margin:24px 0;"></div>`;
const bullet = (text: string) => `<table cellpadding="0" cellspacing="0" style="margin:0 0 8px;"><tr><td style="width:20px;vertical-align:top;padding-top:7px;"><div style="width:6px;height:6px;border-radius:50%;background:#0d9488;"></div></td><td style="font-size:15px;line-height:1.6;color:#475569;">${text}</td></tr></table>`;

export const TEMPLATES: Record<TemplateId, { name: string; subject: string; html: string }> = {
  cabinets: {
    name: "Cabinets comptables",
    subject: "Automatisation + données sensibles — compatible ?",
    html: `${WRAPPER_START}
${h2("Bonjour,")}
${p("Une question directe : est-ce que vous avez déjà bloqué sur l'automatisation parce que vos documents contiennent des <strong>données clients sensibles</strong> ?")}
${p("C'est le cas de la plupart des cabinets que je rencontre.")}
${divider}
${p("<strong style=\"color:#0f172a;\">Ce que je mets en place :</strong>")}
${bullet("Les tâches répétitives (classer, renommer, extraire, router) sont gérées par des <strong>règles fixes</strong>")}
${bullet("L'IA n'intervient que sur les étapes qui le nécessitent vraiment")}
${bullet("Les données sensibles sont <strong>anonymisées</strong> avant tout traitement IA — elles ne sortent jamais brutes")}
${divider}
${p("<strong style=\"color:#0d9488;\">Résultat :</strong> vous réduisez les manipulations manuelles, sans jamais exposer vos données clients.")}
${p("Est-ce que ça vaut 15 minutes cette semaine pour voir si c'est applicable chez vous ?")}
${CTA_BUTTON("Réserver 15 min")}
${p("Bonne journée,<br/><strong style=\"color:#0f172a;\">{{prenom}}</strong>")}
${WRAPPER_END}`,
  },
  welcome: {
    name: "Bienvenue",
    subject: "{{prenom}}, bienvenue chez Zazaq",
    html: `${WRAPPER_START}
${h2("Bonjour {{prenom}},")}
${p("Merci de nous avoir contactés. Nous allons regarder ensemble comment automatiser les tâches répétitives de votre entreprise <strong>{{entreprise}}</strong>.")}
${p("Lors de notre diagnostic gratuit de 30 minutes, nous identifierons précisément :")}
${bullet("Quelles tâches peuvent être automatisées")}
${bullet("Le temps potentiellement récupérable")}
${bullet("Une proposition de solution adaptée")}
${CTA_BUTTON("Réserver mon créneau")}
${p("À très bientôt,<br/><strong style=\"color:#0f172a;\">L'équipe Zazaq</strong>")}
${WRAPPER_END}`,
  },
  relance: {
    name: "Relance",
    subject: "{{prenom}}, toujours intéressé(e) ?",
    html: `${WRAPPER_START}
${h2("Bonjour {{prenom}},")}
${p("Je me permets de revenir vers vous suite à notre dernier échange.")}
${p("Je sais que le temps passe vite — si le sujet de l'automatisation est toujours d'actualité pour <strong>{{entreprise}}</strong>, je suis disponible pour un point rapide de 15 minutes.")}
${p("Pas d'engagement, pas de présentation commerciale — juste un regard concret sur ce qui peut être simplifié chez vous.")}
${CTA_BUTTON("Reprendre contact")}
${p("Bonne journée,<br/><strong style=\"color:#0f172a;\">L'équipe Zazaq</strong>")}
${WRAPPER_END}`,
  },
  diagnostic: {
    name: "Post-diagnostic",
    subject: "{{prenom}}, votre récapitulatif Zazaq",
    html: `${WRAPPER_START}
${h2("Bonjour {{prenom}},")}
${p("Merci pour notre échange ! Voici un récapitulatif de ce que nous avons identifié ensemble pour <strong>{{entreprise}}</strong> :")}
${p("{{contenu}}")}
${divider}
${p("Si vous souhaitez avancer sur la mise en place, la prochaine étape est simple :")}
${bullet("Je vous envoie une proposition détaillée")}
${bullet("Vous validez le périmètre")}
${bullet("On démarre la mise en place")}
${CTA_BUTTON("Voir la proposition")}
${p("À bientôt,<br/><strong style=\"color:#0f172a;\">L'équipe Zazaq</strong>")}
${WRAPPER_END}`,
  },
  newsletter: {
    name: "Newsletter",
    subject: "Zazaq — {{sujet}}",
    html: `${WRAPPER_START}
${h2("Bonjour {{prenom}},")}
${p("{{contenu}}")}
${CTA_BUTTON("Lire la suite")}
${p("Bonne lecture,<br/><strong style=\"color:#0f172a;\">L'équipe Zazaq</strong>")}
${WRAPPER_END}`,
  },
};

export function renderTemplate(templateId: TemplateId, vars: TemplateVars & { pixel_url?: string }): { subject: string; html: string } {
  const template = TEMPLATES[templateId];
  let html = template.html;
  let subject = template.subject;

  const replacements: Record<string, string> = {
    "{{prenom}}": vars.prenom || "",
    "{{nom}}": vars.nom || "",
    "{{entreprise}}": vars.entreprise || "",
    "{{lien_tracking}}": vars.lien_tracking || "#",
    "{{sujet}}": vars.sujet || "",
    "{{contenu}}": vars.contenu || "",
    "{{pixel_url}}": vars.pixel_url || "",
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(key, value);
    subject = subject.replaceAll(key, value);
  }

  return { subject, html };
}
