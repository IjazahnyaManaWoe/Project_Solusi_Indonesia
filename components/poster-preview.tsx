"use client";

import Image from "next/image";
import { useRef } from "react";
import { Download, Maximize2, X } from "lucide-react";

export function PosterPreview({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const downloadName = src.split("/").pop() ?? "poster";

  return (
    <section
      aria-labelledby="poster-heading"
      className="mt-7 rounded-2xl border border-line bg-surface p-4 sm:p-5"
    >
      <h2 id="poster-heading" className="text-xl font-extrabold">
        Ringkasan Visual
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Satu gambar untuk mengingatkan poin utama modul ini. Simpan atau bagikan
        ke teman sekelas.
      </p>

      <figure className="mt-4">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[480px] overflow-hidden rounded-xl border border-line bg-canvas">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-contain"
          />
        </div>
        <figcaption className="mx-auto mt-2 max-w-[480px] text-center text-sm text-muted">
          {caption}
        </figcaption>
      </figure>

      <div className="mx-auto mt-4 flex max-w-[480px] flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="btn btn-secondary w-full sm:flex-1"
        >
          <Maximize2 className="h-5 w-5" aria-hidden="true" />
          Lihat ukuran penuh
        </button>
        <a
          href={src}
          download={downloadName}
          className="btn btn-primary w-full sm:flex-1"
        >
          <Download className="h-5 w-5" aria-hidden="true" />
          Unduh poster
        </a>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="poster-dialog-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
        className="m-auto max-h-[92vh] w-[min(94vw,760px)] overflow-y-auto rounded-2xl border border-line bg-surface p-4 backdrop:bg-black/70 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id="poster-dialog-title"
            className="text-lg font-extrabold leading-snug"
          >
            Poster modul
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-canvas text-ink hover:border-brand hover:text-brand"
            aria-label="Tutup pratinjau poster"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative mx-auto mt-3 h-[min(70vh,900px)] w-full max-w-[560px]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 560px, 94vw"
            className="object-contain"
          />
        </div>
      </dialog>
    </section>
  );
}
