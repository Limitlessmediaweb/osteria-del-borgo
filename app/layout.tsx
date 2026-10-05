import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { ALLOW_INDEXING, DESCRIPTION, NAME, SITE_URL } from "@/lib/site";

const display = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
const body = localFont({ src: "./fonts/figtree-latin-wght-normal.woff2", weight: "300 900", variable: "--font-body", display: "swap", fallback: ["system-ui", "sans-serif"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Osteria del Borgo | Trattoria nell'Oltrepò Pavese", template: "%s | Osteria del Borgo" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  robots: ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: NAME,
    title: "Osteria del Borgo · Trattoria nell'Oltrepò Pavese",
    description: DESCRIPTION,
    images: [{ url: "/img/hero-sala-wide-1200.webp", width: 1200, height: 800, alt: "La sala dell'Osteria del Borgo" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#1e1915",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#contenuto" className="sr-only z-[100] rounded bg-inchiostro px-4 py-2 text-carta focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Vai al contenuto
        </a>
        {children}
        {plausible && <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="afterInteractive" />}
      </body>
    </html>
  );
}
