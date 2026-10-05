import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "Crediti fotografici",
  description: "Autori delle fotografie royalty-free usate sul sito dell'Osteria del Borgo.",
  alternates: { canonical: "/crediti" },
};

export default function Crediti() {
  return (
    <LegalPage title="Crediti fotografici" intro="Tutte le foto sono reali e royalty-free, con licenza Unsplash (uso gratuito anche commerciale). Grazie agli autori.">
      <ul className="!mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
        {Object.values(PHOTOS).map((p) => (
          <li key={p.file} className="!ml-0 !list-none text-[0.95rem]">
            <span className="text-inchiostro/65">{p.alt}</span>
            <br />
            Foto di{" "}
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              {p.author}
            </a>{" "}
            su Unsplash
          </li>
        ))}
      </ul>
    </LegalPage>
  );
}
