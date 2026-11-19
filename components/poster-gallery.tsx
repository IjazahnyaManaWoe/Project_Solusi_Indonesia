"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";

export interface PosterItem {
  src: string;
  alt: string;
  title: string;
  order: number;
}

export function PosterGallery({ posters }: { posters: PosterItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<PosterItem | null>(null);

  useEffect(() => {
    if (active && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [active]);

  return (
    <section aria-labelledby="poster-galeri-heading" className="mt-10">
      <h2
        id="poster-galeri-heading"
        className="text-2xl font-extrabold tracking-tight"
      >
        Poster Pengingat
      </h2>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
        Rangkuman bergambar dari modul yang sudah kamu pelajari. Klik poster
        untuk membukanya dalam ukuran penuh.
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {posters.map((poster) => (
          <li key={poster.src}>
            <button
              type="button"
              onClick={() => setActive(poster)}
              aria-label={`Lihat poster ${poster.title} ukuran penuh`}
              className="group block w-full rounded-xl text-left"
            >
              <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-xl border border-line bg-canvas transition-colors group-hover:border-brand">
                <Image
                  src={poster.src}
                  alt={poster.alt}
                  fill
                  sizes="(min-width: 640px) 30vw, 45vw"
                  className="object-cover"
                />
                <span className="absolute right-2 bottom-2 grid h-8 w-8 place-items-center rounded-full bg-surface/95 text-brand shadow-sm">
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                </span>
              </span>
              <span className="mt-2 block text-xs font-bold uppercase tracking-wider text-muted">
                Modul {poster.order}
              </span>
              <span className="mt-0.5 block text-sm font-bold leading-snug group-hover:text-brand">
                {poster.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby="poster-galeri-dialog-title"
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
        className="m-auto max-h-[92vh] w-[min(94vw,820px)] overflow-y-auto rounded-2xl border border-line bg-surface p-4 backdrop:bg-black/70 sm:p-5"
      >
        {active ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  Modul {active.order}
                </p>
                <h2
                  id="poster-galeri-dialog-title"
                  className="text-lg font-extrabold leading-snug"
                >
                  {active.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-canvas text-ink hover:border-brand hover:text-brand"
                aria-label="Tutup pratinjau poster"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative mx-auto mt-3 h-[min(70vh,900px)] w-full max-w-[600px]">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="(min-width: 768px) 600px, 94vw"
                className="object-contain"
              />
            </div>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
