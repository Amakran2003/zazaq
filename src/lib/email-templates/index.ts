export type TemplateId = "welcome" | "relance" | "promo" | "newsletter";

export type TemplateVars = {
  prenom?: string;
  nom?: string;
  entreprise?: string;
  lien_tracking?: string;
  sujet?: string;
  contenu?: string;
};

export const TEMPLATES: Record<TemplateId, { name: string; subject: string; html: string }> = {
  welcome: {
    name: "Bienvenue",
    subject: "Bienvenue chez Zazaq, {{prenom}} !",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#1e293b;">
<div style="text-align:center;margin-bottom:32px;"><h1 style="font-size:24px;font-weight:700;color:#0d9488;margin:0;">Zazaq</h1></div>
<h2 style="font-size:20px;font-weight:600;margin-bottom:16px;">Bonjour {{prenom}},</h2>
<p style="font-size:16px;line-height:1.6;color:#475569;">Merci de nous avoir contactés. Nous allons regarder ensemble comment automatiser les tâches répétitives de votre entreprise <strong>{{entreprise}}</strong>.</p>
<p style="font-size:16px;line-height:1.6;color:#475569;">Lors de notre diagnostic gratuit de 30 minutes, nous identifierons précisément ce qui peut être automatisé.</p>
<div style="text-align:center;margin:32px 0;"><a href="{{lien_tracking}}" style="display:inline-block;padding:14px 28px;background:#0f172a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">Réserver mon créneau</a></div>
<p style="font-size:14px;color:#94a3b8;">À bientôt,<br/>L'équipe Zazaq</p>
<img src="{{pixel_url}}" width="1" height="1" style="display:none;" alt="" />
</body></html>`,
  },
  relance: {
    name: "Relance",
    subject: "{{prenom}}, on n'a pas eu de vos nouvelles",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#1e293b;">
<div style="text-align:center;margin-bottom:32px;"><h1 style="font-size:24px;font-weight:700;color:#0d9488;margin:0;">Zazaq</h1></div>
<h2 style="font-size:20px;font-weight:600;margin-bottom:16px;">Bonjour {{prenom}},</h2>
<p style="font-size:16px;line-height:1.6;color:#475569;">Je me permets de revenir vers vous. Avez-vous eu le temps de réfléchir à notre échange ?</p>
<p style="font-size:16px;line-height:1.6;color:#475569;">Si vous avez des questions ou souhaitez avancer, je suis disponible pour un point rapide.</p>
<div style="text-align:center;margin:32px 0;"><a href="{{lien_tracking}}" style="display:inline-block;padding:14px 28px;background:#0f172a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">Reprendre contact</a></div>
<p style="font-size:14px;color:#94a3b8;">Cordialement,<br/>L'équipe Zazaq</p>
<img src="{{pixel_url}}" width="1" height="1" style="display:none;" alt="" />
</body></html>`,
  },
  promo: {
    name: "Offre spéciale",
    subject: "{{prenom}}, une offre pour {{entreprise}}",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#1e293b;">
<div style="text-align:center;margin-bottom:32px;"><h1 style="font-size:24px;font-weight:700;color:#0d9488;margin:0;">Zazaq</h1></div>
<h2 style="font-size:20px;font-weight:600;margin-bottom:16px;">Bonjour {{prenom}},</h2>
<p style="font-size:16px;line-height:1.6;color:#475569;">{{contenu}}</p>
<div style="text-align:center;margin:32px 0;"><a href="{{lien_tracking}}" style="display:inline-block;padding:14px 28px;background:#0f172a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">En savoir plus</a></div>
<p style="font-size:14px;color:#94a3b8;">L'équipe Zazaq</p>
<img src="{{pixel_url}}" width="1" height="1" style="display:none;" alt="" />
</body></html>`,
  },
  newsletter: {
    name: "Newsletter",
    subject: "Les nouvelles de Zazaq",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#1e293b;">
<div style="text-align:center;margin-bottom:32px;"><h1 style="font-size:24px;font-weight:700;color:#0d9488;margin:0;">Zazaq</h1></div>
<h2 style="font-size:20px;font-weight:600;margin-bottom:16px;">Bonjour {{prenom}},</h2>
<p style="font-size:16px;line-height:1.6;color:#475569;">{{contenu}}</p>
<div style="text-align:center;margin:32px 0;"><a href="{{lien_tracking}}" style="display:inline-block;padding:14px 28px;background:#0f172a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">Lire la suite</a></div>
<p style="font-size:14px;color:#94a3b8;">L'équipe Zazaq</p>
<img src="{{pixel_url}}" width="1" height="1" style="display:none;" alt="" />
</body></html>`,
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
