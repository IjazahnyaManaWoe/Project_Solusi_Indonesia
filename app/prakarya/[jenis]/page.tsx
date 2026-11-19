import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CraftIcon } from "@/components/craft-icon";
import { CraftList } from "@/components/craft-list";
import {
  getAllWasteTypes,
  getCraftsByType,
  getWasteTypeBySlug,
  toCraftSummary,
} from "@/lib/crafts";

interface CraftTypePageProps {
  params: Promise<{ jenis: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllWasteTypes().map((type) => ({ jenis: type.slug }));
}

export async function generateMetadata({
  params,
}: CraftTypePageProps): Promise<Metadata> {
  const { jenis } = await params;
  const type = getWasteTypeBySlug(jenis);

  if (!type) {
    return { title: "Jenis sampah tidak ditemukan" };
  }

  return {
    title: `Ide Prakarya ${type.name}`,
    description: type.description,
  };
}

export default async function CraftTypePage({ params }: CraftTypePageProps) {
  const { jenis } = await params;
  const type = getWasteTypeBySlug(jenis);

  if (!type) {
    notFound();
  }

  const crafts = getCraftsByType(jenis).map(toCraftSummary);

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
        <Link
          href="/prakarya"
          className="rounded font-semibold text-brand hover:underline"
        >
          Ide Prakarya
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span aria-current="page">{type.name}</span>
      </nav>

      <header className="mt-5 flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
          <CraftIcon name={type.icon} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Ide dari {type.name}
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
            {type.description}
          </p>
          <p className="mt-2 text-sm font-semibold text-brand">
            {crafts.length} ide prakarya
          </p>
        </div>
      </header>

      {crafts.length > 0 ? (
        <CraftList wasteType={jenis} crafts={crafts} />
      ) : (
        <p className="mt-6 rounded-2xl border border-line bg-surface p-5 text-sm text-muted">
          Belum ada ide untuk jenis sampah ini. Tambahkan file Markdown di
          folder jenisnya untuk mulai mengisi.
        </p>
      )}
    </div>
  );
}
