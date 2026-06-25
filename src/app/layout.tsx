import type { Metadata } from "next";
import { Instrument_Sans, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Zazaq — Récupérez du temps en automatisant vos tâches",
  description:
    "Découvrez ce qui peut être automatisé dans votre entreprise. Diagnostic gratuit de 30 minutes pour estimer le temps récupérable. CRM, relances, documents, workflows sur mesure.",
  keywords: "automatisation, PME, gain de temps, CRM, relances automatiques, workflows, IA, productivité, diagnostic gratuit",
  authors: [{ name: "Zazaq" }],
  robots: "index, follow",
  metadataBase: new URL("https://zazaq.fr"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://zazaq.fr",
    title: "Zazaq — Récupérez du temps en automatisant vos tâches",
    description: "Transformez les tâches manuelles en processus automatiques. Diagnostic gratuit de 30 minutes.",
    siteName: "Zazaq",
    locale: "fr_FR",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zazaq — Récupérez du temps en automatisant vos tâches",
    description: "Découvrez ce qui peut être automatisé dans votre entreprise. Diagnostic gratuit 30 min.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${instrumentSans.variable} ${syne.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Zazaq",
              description: "Automatisation sur mesure pour les PME et indépendants.",
              url: "https://zazaq.fr",
              logo: "https://zazaq.fr/favicon.svg",
              priceRange: "€€",
              areaServed: "FR",
              serviceType: "Automatisation des processus",
              offers: {
                "@type": "Offer",
                name: "Diagnostic gratuit",
                price: "0",
                priceCurrency: "EUR",
                description: "30 minutes pour identifier ce qui peut être automatisé.",
              },
            }),
          }}
        />
      </head>
      <body className="bg-white text-slate-900 antialiased overflow-x-hidden min-h-dvh">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
