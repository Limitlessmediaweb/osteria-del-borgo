export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://osteriadelborgo.example.com").replace(/\/$/, "");
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
export const LIMITLESS_URL = process.env.NEXT_PUBLIC_LIMITLESS_URL || "https://limitlessmedia.it";

export const NAME = "Osteria del Borgo";
export const DESCRIPTION =
  "Trattoria di paese nell'Oltrepò Pavese: risotti, agnolotti fatti a mano, salame di Varzi e vini delle nostre colline. Sala in pietra con travi a vista e dehors estivo.";

// TODO: dati di contatto reali del locale (concept: numeri dimostrativi)
export const CONTACT = {
  street: "Via del Borgo 7",
  zip: "27047",
  city: "Santa Maria della Versa",
  province: "PV",
  phoneDisplay: "0385 000 000",
  phoneHref: "tel:+39385000000",
  whatsapp: "390000000000",
  whatsappDisplay: "+39 000 000 0000",
  email: "info@osteriadelborgo.example.com",
  lat: 44.9887,
  lon: 9.2986,
};

export const ADDRESS_LINE = `${CONTACT.street}, ${CONTACT.zip} ${CONTACT.city} (${CONTACT.province})`;
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CONTACT.city} ${CONTACT.province}`)}`;

export function whatsappUrl(text?: string) {
  return `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
