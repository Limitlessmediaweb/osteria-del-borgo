import { PHOTOS, type PhotoKey } from "@/lib/images";

type Props = {
  photo: PhotoKey;
  sizes: string;
  className?: string;
  priority?: boolean;
  alt?: string;
  decorative?: boolean;
};

export function srcSet(file: string) {
  return `/img/${file}-640.webp 640w, /img/${file}-1200.webp 1200w, /img/${file}-2400.webp 2400w`;
}

/** Immagine responsive con le tre larghezze pre-generate in /public/img. */
export function Img({ photo, sizes, className, priority, alt, decorative }: Props) {
  const p = PHOTOS[photo];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/img/${p.file}-1200.webp`}
      srcSet={srcSet(p.file)}
      sizes={sizes}
      width={p.w}
      height={p.h}
      alt={decorative ? "" : (alt ?? p.alt)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
