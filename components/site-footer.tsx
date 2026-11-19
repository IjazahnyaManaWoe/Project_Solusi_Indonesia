import Link from "next/link";
import { LeafIcon } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2">
          <LeafIcon className="h-4 w-4 text-brand" />
          <span>Pilah Pintar · media belajar untuk siswa SMA</span>
        </p>
        <p>
          Progres belajarmu tersimpan di perangkat ini.{" "}
          <Link
            href="/tentang"
            className="font-semibold text-brand underline underline-offset-4"
          >
            Tentang website
          </Link>
        </p>
      </div>
    </footer>
  );
}
