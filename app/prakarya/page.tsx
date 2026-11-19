import type { Metadata } from "next";
import Link from "next/link";
import { CraftIcon } from "@/components/craft-icon";
import { ArrowRightIcon, LeafIcon } from "@/components/icons";
import { getAllWasteTypesWithCounts } from "@/lib/crafts";

export const metadata: Metadata = {
  title: "Ide Prakarya",
  description:
    "Kumpulan ide prakarya dari sampah botol plastik, kemasan snack, kardus, dan kaleng untuk siswa SMA.",
};

export default function CraftTypesPage() {
  const types = getAllWasteTypesWithCounts();
  const totalCrafts = types.reduce((sum, type) => sum + type.craftCount, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link
          href="/"
          className="rounded font-semibold text-brand hover:underline"
        >
          Beranda
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span aria-current="page">Ide Prakarya</span>
      </nav>

      <header className="mt-5">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
          <LeafIcon className="h-4 w-4" />
          Ide Prakarya
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Sampah yang sudah dipilah bisa jadi karya.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Pilih jenis sampah yang paling mudah kamu temukan, lalu ikuti langkah
          pembuatannya. Semua ide memakai alat sederhana dan diakhiri dengan
          bagian membereskan sisa bahan.
        </p>
        <p className="mt-3 text-sm font-semibold text-brand">
          {types.length} jenis sampah · {totalCrafts} ide prakarya
        </p>
      </header>

      <ul className="mt-7 grid gap-4 sm:grid-cols-2">
        {types.map((type) => (
          <li key={type.slug} className="h-full">
            <Link
              href={`/prakarya/${type.slug}`}
              className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand sm:p-6"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                <CraftIcon name={type.icon} className="h-7 w-7" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold leading-snug group-hover:text-brand">
                  {type.name}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">
                  {type.description}
                </span>
                <span className="mt-3 flex items-center justify-between gap-3 text-sm font-bold text-brand">
                  {type.craftCount} ide
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
