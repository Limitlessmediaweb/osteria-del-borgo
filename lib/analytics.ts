"use client";

type PlausibleFn = (event: string, opts?: { props?: Record<string, string | number> }) => void;

/** Eventi senza dati personali. Plausible si carica solo se NEXT_PUBLIC_PLAUSIBLE_DOMAIN è impostata. */
export function track(event: "cta_click" | "booking_submit" | "whatsapp_click" | "menu_tab" | "phone_click", props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const plausible = (window as unknown as { plausible?: PlausibleFn }).plausible;
  plausible?.(event, props ? { props } : undefined);
}
