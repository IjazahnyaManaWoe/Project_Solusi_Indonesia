import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { CraftChecklist } from "@/components/craft-checklist";
import { CraftIcon } from "@/components/craft-icon";
import { DifficultyBadge } from "@/components/difficulty-badge";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
} from "@/components/icons";
import { LessonMarkdown } from "@/components/lesson-markdown";
import {
  getAllWasteTypes,
  getCraft,
  getCraftsByType,
  getWasteTypeBySlug,
} from "@/lib/crafts";

interface CraftPageProps {
  params: Promise<{ jenis: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllWasteTypes().flatMap((type) =>
    getCraftsByType(type.slug).map((craft) => ({
      jenis: type.slug,
      slug: craft.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: CraftPageProps): Promise<Metadata> {
  const { jenis, slug } = await params;
  const craft = getCraft(jenis, slug);

  if (!craft) {
    return { title: "Ide prakarya tidak ditemukan" };
  }

  return {
    title: craft.title,
    description: craft.summary,
  };
}

export default async function CraftPage({ params }: CraftPageProps) {
  const { jenis, slug } = await params;
  const type = getWasteTypeBySlug(jenis);
  const craft = getCraft(jenis, slug);

  if (!type || !craft) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
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
        <Link
          href={`/prakarya/${jenis}`}
          className="rounded font-semibold text-brand hover:underline"
        >
          {type.name}
        </Link>
      </nav>

      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <DifficultyBadge difficulty={craft.difficulty} />
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted">
            <ClockIcon className="h-4 w-4" />
            {craft.duration}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
            <CraftIcon name={type.icon} className="h-4 w-4" />
            {type.name}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {craft.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          {craft.summary}
        </p>
      </header>

      <div className="mt-7 space-y-5">
        <section
          aria-labelledby="bahan-heading"
          className="rounded-2xl border border-line bg-surface p-5"
        >
          <h2
            id="bahan-heading"
            className="flex items-center gap-2 text-lg font-extrabold"
          >
            <Sparkles className="h-5 w-5 text-brand" aria-hidden="true" />
            Bahan yang dipakai
          </h2>
          <p className="mt-1 text-sm text-muted">
            Siapkan bahan utama ini, lalu cuci dan keringkan sampahnya sebelum
            dipakai.
          </p>
          <ul className="mt-3 space-y-2">
            {craft.materials.map((material) => (
              <li
                key={material}
                className="flex gap-2.5 text-[0.95rem] leading-relaxed"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                  aria-hidden="true"
                />
                {material}
              </li>
            ))}
          </ul>
        </section>

        <CraftChecklist
          craftKey={`${jenis}/${slug}`}
          items={craft.tools}
        />

        <section aria-labelledby="langkah-heading">
          <h2
            id="langkah-heading"
            className="flex items-center gap-2 text-xl font-extrabold"
          >
            <Wrench className="h-5 w-5 text-brand" aria-hidden="true" />
            Langkah pembuatan
          </h2>
          <div className="mt-2">
            <LessonMarkdown content={craft.steps} />
          </div>
        </section>

        <section
          aria-labelledby="keamanan-heading"
          className="rounded-2xl border border-accent bg-accent-soft p-5"
        >
          <h2
            id="keamanan-heading"
            className="flex items-center gap-2 text-lg font-extrabold text-accent"
          >
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            Tips keamanan
          </h2>
          <p className="mt-2 text-[0.95rem] leading-relaxed">{craft.safety}</p>
        </section>

        <section
          aria-labelledby="rapikan-heading"
          className="rounded-2xl border border-line bg-brand-soft p-5"
        >
          <h2 id="rapikan-heading" className="text-lg font-extrabold">
            Rapikan setelahnya
          </h2>
          <div className="mt-1">
            <LessonMarkdown content={craft.aftercare} />
          </div>
        </section>
      </div>

      <nav
        aria-label="Navigasi ide prakarya"
        className="mt-10 border-t border-line pt-6"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/prakarya/${jenis}`}
            className="group rounded-xl border border-line bg-surface p-4 transition-colors hover:border-brand"
            aria-label={`Kembali ke daftar ide ${type.name}`}
          >
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
              <ArrowLeftIcon className="h-4 w-4" />
              Semua ide
            </span>
            <span className="mt-1.5 block font-bold leading-snug group-hover:text-brand">
              {type.name}
            </span>
          </Link>

          <Link
            href="/prakarya"
            className="group rounded-xl border border-line bg-surface p-4 transition-colors hover:border-brand sm:text-right"
          >
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted sm:justify-end">
              Pilih jenis sampah lain
              <ArrowRightIcon className="h-4 w-4" />
            </span>
            <span className="mt-1.5 block font-bold leading-snug group-hover:text-brand">
              Ide Prakarya
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
