import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Storia, Colline, Dehors, Recensioni, Orari } from "@/components/Sections";
import { Menu } from "@/components/Menu";
import { Galleria } from "@/components/Galleria";
import { Prenota } from "@/components/Prenota";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsApp";
import { Motion } from "@/components/Motion";
import { CONTACT, DESCRIPTION, NAME, SITE_URL } from "@/lib/site";
import { FAQ, WEEK } from "@/lib/content";

const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: NAME,
    description: DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/img/hero-sala-wide-1200.webp`,
    telephone: CONTACT.phoneHref.replace("tel:", ""),
    servesCuisine: ["Italiana", "Cucina tipica dell'Oltrepò Pavese"],
    priceRange: "€€",
    acceptsReservations: true,
    menu: `${SITE_URL}/#menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.street,
      postalCode: CONTACT.zip,
      addressLocality: CONTACT.city,
      addressRegion: CONTACT.province,
      addressCountry: "IT",
    },
    geo: { "@type": "GeoCoordinates", latitude: CONTACT.lat, longitude: CONTACT.lon },
    openingHoursSpecification: WEEK.flatMap((d, i) => d.slots.map((s) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DAYS_EN[i], opens: s.from, closes: s.to }))),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Header />
      <main id="contenuto">
        <Hero />
        <Storia />
        <Colline />
        <Menu />
        <Dehors />
        <Galleria />
        <Recensioni />
        <Prenota />
        <Orari />
        <Faq />
      </main>
      <Footer />
      <WhatsAppButton />
      <Motion />
    </>
  );
}
