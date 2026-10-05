import { Header } from "./Header";
import { Footer } from "./Footer";

export function LegalPage({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <>
      <Header home={false} />
      <main id="contenuto" className="pb-24 pt-[calc(var(--header-h)+4rem)]">
        <article className="wrap max-w-[820px]">
          <h1 className="display text-[clamp(2.6rem,2rem+3vw,4.2rem)]">{title}</h1>
          {intro && <p className="mt-6 rounded-[6px] border-l-2 border-oro bg-carta-2 px-4 py-3 text-sm text-inchiostro/75">{intro}</p>}
          <div className="mt-10 space-y-6 leading-relaxed text-inchiostro/80 [&_a]:text-vino [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-inchiostro [&_li]:ml-5 [&_li]:list-disc">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
