import Link from "next/link";
import { LeafIcon } from "@/components/icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-full py-1 pr-2"
          aria-label="Pilah Pintar, kembali ke beranda"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-on-brand">
            <LeafIcon className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight">
              Pilah Pintar
            </span>
            <span className="hidden text-xs text-muted sm:block">
              Belajar pilah sampah, 3 menit
            </span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama">
          <ul className="flex items-center gap-0.5 sm:gap-1">
            <li>
              <Link
                href="/"
                className="flex min-h-11 items-center rounded-full px-2.5 text-[0.8125rem] font-semibold text-ink hover:bg-brand-soft hover:text-brand sm:px-3.5 sm:text-sm"
              >
                Belajar
              </Link>
            </li>
            <li>
              <Link
                href="/prakarya"
                className="flex min-h-11 items-center rounded-full px-2.5 text-[0.8125rem] font-semibold text-ink hover:bg-brand-soft hover:text-brand sm:px-3.5 sm:text-sm"
              >
                <span className="sm:hidden">Prakarya</span>
                <span className="hidden sm:inline">Ide Prakarya</span>
              </Link>
            </li>
            <li>
              <Link
                href="/tentang"
                className="flex min-h-11 items-center rounded-full px-2.5 text-[0.8125rem] font-semibold text-ink hover:bg-brand-soft hover:text-brand sm:px-3.5 sm:text-sm"
              >
                Tentang
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
