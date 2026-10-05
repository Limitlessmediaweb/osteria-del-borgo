import type { PhotoKey } from "./images";

export type Dish = { name: string; desc: string; price: string; tag?: string };
export type MenuCategory = { id: string; label: string; photo: PhotoKey; note?: string; dishes: Dish[] };

export const MENU: MenuCategory[] = [
  {
    id: "antipasti",
    label: "Antipasti",
    photo: "salumi",
    dishes: [
      { name: "Tagliere del Borgo", desc: "Salame di Varzi, coppa, pancetta arrotolata, lardo alle erbe, giardiniera della casa", price: "16", tag: "Da dividere" },
      { name: "Salame di Varzi tagliato al coltello", desc: "Con pane di casa e burro di montagna", price: "12" },
      { name: "Nervetti in insalata", desc: "Cipolla rossa, prezzemolo e aceto di vino", price: "10" },
      { name: "Frittata alle erbette", desc: "Erbe dell'orto e cipolle dorate, servita tiepida", price: "9" },
      { name: "Peperoni in bagna", desc: "Arrostiti nel camino, con acciughe e aglio dolce", price: "10" },
    ],
  },
  {
    id: "primi",
    label: "Primi",
    photo: "risotto",
    note: "La pasta è tirata a mano ogni mattina. I risotti sono per minimo due persone.",
    dishes: [
      { name: "Agnolotti di stufato", desc: "Ripieni di stufato di manzo al Bonarda, conditi con il suo sugo", price: "14", tag: "Della casa" },
      { name: "Agnolotti burro e salvia", desc: "Gli stessi agnolotti, in bianco, con formaggio stagionato", price: "13" },
      { name: "Risotto al Bonarda e salame", desc: "Mantecato con salame di Varzi sgranato e vino delle nostre colline", price: "14" },
      { name: "Risotto alla zucca e Pinot nero", desc: "Zucca mantovana, riduzione di Pinot nero, nocciole tostate", price: "14", tag: "D'autunno" },
      { name: "Tagliatelle ai funghi", desc: "Porcini e finferli dell'Appennino, quando ci sono", price: "15" },
      { name: "Zuppa alla pavese", desc: "Brodo di gallina, pane tostato, uovo e grana", price: "10" },
    ],
  },
  {
    id: "secondi",
    label: "Secondi",
    photo: "camino",
    dishes: [
      { name: "Brasato al Buttafuoco", desc: "Cotto per sei ore, con polenta di mais otto file", price: "20", tag: "Della casa" },
      { name: "Coniglio arrosto", desc: "Con rosmarino, olive taggiasche e patate al forno", price: "17" },
      { name: "Costata alla brace", desc: "Cotta nel camino della sala, sale grosso e verdure dell'orto (al kg)", price: "55" },
      { name: "Rane fritte", desc: "Come si fanno in Lomellina, con limone e insalatina", price: "16" },
      { name: "Formaggi delle valli", desc: "Selezione di formaggi dell'Oltrepò con mostarda di frutta", price: "12" },
    ],
  },
  {
    id: "dolci",
    label: "Dolci",
    photo: "crostata",
    dishes: [
      { name: "Torta di mandorle", desc: "Ricetta di Varzi, croccante fuori e morbida dentro", price: "6" },
      { name: "Crostata di confettura d'uva", desc: "Frolla al burro e confettura di uva della vendemmia", price: "6" },
      { name: "Panna cotta al Moscato", desc: "Con fragole e sciroppo di Moscato dolce", price: "6" },
      { name: "Torta Paradiso", desc: "Con crema calda alla vaniglia", price: "6" },
    ],
  },
  {
    id: "vini",
    label: "Vini",
    photo: "vino",
    note: "Solo vini dell'Oltrepò Pavese, scelti da piccole cantine della valle. Prezzi a calice / bottiglia.",
    dishes: [
      { name: "Bonarda dell'Oltrepò Pavese DOC", desc: "Frizzante, rossa e viva: il vino della tavola di casa", price: "5 / 18" },
      { name: "Buttafuoco dell'Oltrepò Pavese DOC", desc: "Fermo, profondo, da carni e brasati", price: "7 / 28" },
      { name: "Pinot nero Metodo Classico DOCG", desc: "Bollicina fine delle nostre colline", price: "8 / 36" },
      { name: "Riesling dell'Oltrepò Pavese DOC", desc: "Bianco fresco, agrumato, da antipasti e risotti", price: "5 / 22" },
      { name: "Sangue di Giuda DOC", desc: "Dolce e frizzante, per chiudere con la crostata", price: "5 / 20" },
    ],
  },
];

export type Slot = { label: string; from: string; to: string; lastBooking: string };
const PRANZO: Slot = { label: "Pranzo", from: "12:15", to: "14:30", lastBooking: "13:45" };
const CENA: Slot = { label: "Cena", from: "19:30", to: "22:30", lastBooking: "21:30" };

/** Indice = giorno della settimana JS (0 domenica … 6 sabato). */
export const WEEK: { day: string; slots: Slot[] }[] = [
  { day: "Domenica", slots: [PRANZO, CENA] },
  { day: "Lunedì", slots: [] },
  { day: "Martedì", slots: [PRANZO] },
  { day: "Mercoledì", slots: [PRANZO] },
  { day: "Giovedì", slots: [PRANZO, CENA] },
  { day: "Venerdì", slots: [PRANZO, CENA] },
  { day: "Sabato", slots: [PRANZO, CENA] },
];

/** Orari prenotabili ogni 15 minuti tra apertura e ultima prenotazione. */
export function bookingTimes(slot: Slot) {
  const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
  const out: string[] = [];
  for (let m = toMin(slot.from); m <= toMin(slot.lastBooking); m += 15) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
}

export const REVIEWS = [
  { text: "Agnolotti come quelli della nonna e una Bonarda che non dimentico. Siamo tornati la settimana dopo con tutta la famiglia.", author: "Giulia", place: "Pavia", rating: 5 },
  { text: "Sala in pietra bellissima, servizio alla mano e porzioni oneste. Il brasato al Buttafuoco vale il viaggio in collina.", author: "Marco", place: "Milano", rating: 5 },
  { text: "Pranzo della domenica sotto il pergolato, con vista sui vigneti. Prezzi giusti, si sente che è cucina di casa.", author: "Elena", place: "Voghera", rating: 5 },
  { text: "Il tagliere con il salame di Varzi da solo è un motivo per fermarsi. Consiglio di prenotare nel weekend.", author: "Luca", place: "Piacenza", rating: 4 },
];

export const FAQ = [
  { q: "Serve prenotare?", a: "Nel fine settimana sì, consigliamo sempre di prenotare: la sala ha 40 coperti e d'estate il dehors altri 30. In settimana a pranzo spesso c'è posto, ma una telefonata evita attese." },
  { q: "Avete piatti vegetariani?", a: "Sì: ogni giorno ci sono almeno un antipasto, un primo e un secondo vegetariani, come la frittata alle erbette, gli agnolotti burro e salvia (su richiesta con ripieno di magro) e il risotto alla zucca." },
  { q: "Potete gestire allergie e intolleranze?", a: "Avvisateci quando prenotate e ricordatelo in sala. L'elenco degli allergeni di ogni piatto è disponibile su richiesta. Non abbiamo una cucina separata senza glutine, quindi non possiamo garantire l'assenza di contaminazioni." },
  { q: "Si può mangiare all'aperto?", a: "Da maggio a settembre, tempo permettendo, apriamo il dehors sotto il pergolato. Se volete un tavolo fuori scrivetelo nelle note della prenotazione." },
  { q: "C'è parcheggio?", a: "Sì, c'è un parcheggio pubblico gratuito in piazza, a due minuti a piedi dall'osteria." },
  { q: "Accettate cani?", a: "Sì, i cani educati sono benvenuti sia in sala sia nel dehors. Una ciotola d'acqua la troviamo sempre." },
  { q: "Organizzate pranzi per gruppi e feste?", a: "Sì, per gruppi da 12 a 40 persone prepariamo menù concordati: compleanni, battesimi, pranzi di lavoro. Chiamateci o scriveteci su WhatsApp per un preventivo." },
  { q: "Si può comprare il vino da portare a casa?", a: "Sì, tutte le bottiglie della carta si possono acquistare a prezzo di enoteca, da portare via." },
  { q: "Quali pagamenti accettate?", a: "Contanti, bancomat e tutte le principali carte di credito." },
];

export const GALLERY: { key: PhotoKey; caption: string; span?: "tall" | "wide" }[] = [
  { key: "camino", caption: "Il camino della sala grande", span: "tall" },
  { key: "tagliere", caption: "Il tagliere del Borgo" },
  { key: "cantina", caption: "La cantina sotto la sala", span: "wide" },
  { key: "tagliatelle", caption: "La pasta, ogni mattina", span: "tall" },
  { key: "focaccia", caption: "Pane e focaccia del nostro forno" },
  { key: "dehors", caption: "Il dehors sotto il pergolato", span: "wide" },
  { key: "formaggio", caption: "Formaggi delle valli", span: "tall" },
  { key: "borgo", caption: "Il borgo, a due passi dall'osteria" },
  { key: "pannaCotta", caption: "Panna cotta al Moscato" },
];
