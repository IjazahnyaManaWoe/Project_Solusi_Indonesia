import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
} from "@/components/icons";
import { LessonMarkdown } from "@/components/lesson-markdown";
import { PosterPreview } from "@/components/poster-preview";
import { Quiz } from "@/components/quiz";
import { TypeBadge } from "@/components/type-badge";
import { VideoEmbed } from "@/components/video-embed";
import { getAllModules, getModuleBySlug } from "@/lib/modules";

interface ModulePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllModules().map((module) => ({ slug: module.slug }));
}

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const { slug } = await params;
  const module = getModuleBySlug(slug);

  if (!module) {
    return { title: "Modul tidak ditemukan" };
  }

  return {
    title: module.title,
    description: module.summary,
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  const modules = getAllModules();
  const moduleIndex = modules.findIndex((item) => item.slug === slug);
  const module = modules[moduleIndex];

  if (!module) {
    notFound();
  }

  const previous = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const next =
    moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;

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
        <span aria-current="page">Modul {module.order}</span>
      </nav>

      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
            Modul {module.order}
          </span>
          <TypeBadge type={module.type} />
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
            <ClockIcon className="h-4 w-4" />
            {module.duration}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {module.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          {module.summary}
        </p>
      </header>

      {module.type === "video" && module.videoEmbedUrl ? (
        <div className="mt-7">
          <VideoEmbed embedUrl={module.videoEmbedUrl} title={module.title} />
        </div>
      ) : null}

      <div className="mt-7">
        <LessonMarkdown content={module.content} />
      </div>

      {module.poster ? (
        <PosterPreview
          src={module.poster}
          alt={module.posterAlt}
          caption={`Poster pengingat Modul ${module.order}: ${module.title}.`}
        />
      ) : null}

      <Quiz
        slug={module.slug}
        questions={module.quiz}
        nextModule={next ? { slug: next.slug, title: next.title } : null}
      />

      <nav
        aria-label="Navigasi antar modul"
        className="mt-10 border-t border-line pt-6"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/modul/${previous.slug}`}
              className="group rounded-xl border border-line bg-surface p-4 transition-colors hover:border-brand"
              aria-label={`Modul sebelumnya: ${previous.title}`}
            >
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                <ArrowLeftIcon className="h-4 w-4" />
                Modul sebelumnya
              </span>
              <span className="mt-1.5 block font-bold leading-snug group-hover:text-brand">
                {previous.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" aria-hidden="true" />
          )}

          {next ? (
            <Link
              href={`/modul/${next.slug}`}
              className="group rounded-xl border border-line bg-surface p-4 transition-colors hover:border-brand sm:text-right"
              aria-label={`Modul berikutnya: ${next.title}`}
            >
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted sm:justify-end">
                Modul berikutnya
                <ArrowRightIcon className="h-4 w-4" />
              </span>
              <span className="mt-1.5 block font-bold leading-snug group-hover:text-brand">
                {next.title}
              </span>
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
