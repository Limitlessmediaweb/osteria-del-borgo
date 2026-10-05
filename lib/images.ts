/** Foto royalty-free da Unsplash (licenza Unsplash), scaricate in /public/img in tre larghezze (640, 1200, 2400). */
export type Photo = {
  file: string;
  w: number;
  h: number;
  alt: string;
  author: string;
  url: string;
};

const p = (file: string, w: number, h: number, alt: string, author: string, url: string): Photo => ({ file, w, h, alt, author, url });

export const PHOTOS = {
  heroSala: p("hero-sala", 2400, 3600, "Sala dell'osteria con muro in pietra, travi in legno e lunga tavola apparecchiata", "Elist Nguyen", "https://unsplash.com/photos/hSLneq694ls"),
  heroSalaWide: p("hero-sala-wide", 2400, 1600, "Sala in penombra con tavoli in legno, lampade calde e porta finestra sul cortile", "Elist Nguyen", "https://unsplash.com/photos/j0VoSmZLjc4"),
  borgoCasa: p("borgo-casa", 2400, 3600, "Casa in pietra del borgo con tetto in lose e legna accatastata", "Denis Gorbuleac", "https://unsplash.com/photos/RCpAmLW_xT4"),
  maniPasta: p("mani-pasta", 2400, 1600, "Mani che chiudono la pasta fresca su un tavolo infarinato", "laura novara", "https://unsplash.com/photos/4Sa9-oblZyE"),
  colline: p("colline", 2400, 1600, "Colline coperte di vigneti al tramonto, con una strada bianca che sale al crinale", "Johny Goerend", "https://unsplash.com/photos/pnigODapPek"),
  colline2: p("colline-2", 2400, 1600, "Vigneti e campi in collina con un paese sulla sommità", "kastriot cupi", "https://unsplash.com/photos/z0XEoBQXqiU"),
  risotto: p("risotto", 2400, 3544, "Risotto mantecato in un piatto fondo di ceramica bianca", "Hanna", "https://unsplash.com/photos/99snZGfYGn8"),
  salumi: p("salumi", 2400, 1600, "Salumi affettati a mano su un tagliere di legno, con un calice di vino", "Alex Guillaume", "https://unsplash.com/photos/lAZqUCAOvOk"),
  agnolottiCrudi: p("agnolotti-crudi", 2400, 3200, "Agnolotti fatti a mano appena chiusi sul piano di lavoro", "Yoav Aziz", "https://unsplash.com/photos/YPqAyTBl6Ck"),
  agnolotti: p("agnolotti", 2400, 3200, "Piatto di agnolotti al burro e salvia", "Yoav Aziz", "https://unsplash.com/photos/EGRJe6BHG9I"),
  crostata: p("crostata", 2400, 3600, "Crostata con confettura e grata di pasta frolla, una fetta già tagliata", "Hugo Aitken", "https://unsplash.com/photos/PqYvDBwpXpU"),
  pannaCotta: p("panna-cotta", 2400, 1600, "Panna cotta con fragole fresche e foglie di basilico", "Adél Grőber", "https://unsplash.com/photos/eKEBV50VeZs"),
  vino: p("vino", 2400, 3600, "Vino rosso versato nel calice su una tavola apparecchiata", "Jessie Maxwell", "https://unsplash.com/photos/jLIMiw4w_WY"),
  camino: p("camino", 2400, 3200, "Il cuoco davanti alla griglia nel grande camino in pietra della sala", "Paráj Richárd", "https://unsplash.com/photos/VZ85eoOluNY"),
  cantina: p("cantina", 2400, 1600, "Cantina con muri in pietra e botti di rovere", "Tamara Malaniy", "https://unsplash.com/photos/jyii09cghJE"),
  tagliere: p("tagliere", 2400, 1601, "Grande tagliere di salumi con olive e pane", "Michael Fousert", "https://unsplash.com/photos/rFvTCqHvLbo"),
  tagliatelle: p("tagliatelle", 2400, 3538, "Tagliatelle fresche che escono dalla macchina per la pasta", "Vincent Dörig", "https://unsplash.com/photos/mciRIMaxiAM"),
  focaccia: p("focaccia", 2400, 1602, "Focaccia appena sfornata con rosmarino", "Diego Arenas de Rodrigo", "https://unsplash.com/photos/kOU7kMox_2Y"),
  formaggio: p("formaggio", 2400, 3600, "Forme di formaggio stagionato impilate su un fondo di legno", "Elio Santos", "https://unsplash.com/photos/rwK9YtNqHCY"),
  borgo: p("borgo", 2400, 1800, "Chiesa in pietra e case su una strada acciottolata del borgo", "Andrea Pasquali", "https://unsplash.com/photos/W1UwMOOU-Xc"),
  dehors: p("dehors", 2400, 1601, "Tavolata apparecchiata sotto il pergolato in ferro del dehors", "Steffen Lemmerzahl", "https://unsplash.com/photos/z9MAxYlXv3s"),
  dehorsSera: p("dehors-sera", 2400, 3600, "Terrazza con tavoli in legno e lucine al tramonto sulle colline", "Anastasia Saldatava", "https://unsplash.com/photos/dIVulJiD1Sk"),
  tavoloGiardino: p("tavolo-giardino", 2400, 3600, "Tavolino con calici sotto gli alberi nella luce della sera", "Gina Spinelli", "https://unsplash.com/photos/psuR7nIZBYg"),
  porta: p("porta", 2400, 3300, "Vecchia porta in legno su un vicolo acciottolato", "Donald Merrill", "https://unsplash.com/photos/X84MRQGyKNw"),
  salame: p("salame", 2400, 1542, "Salame tagliato a fette con pane e bottiglia di vino", "Ilona Frey", "https://unsplash.com/photos/aZ3B7Upp7aQ"),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;
