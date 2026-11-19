"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  AwardIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import {
  countCompleted,
  hasEarnedBadge,
  PASSING_SCORE,
} from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";
import type { ModuleSummary } from "@/lib/modules";

export function ModuleList({ modules }: { modules: ModuleSummary[] }) {
  const progress = useProgress();
  const slugs = modules.map((module) => module.slug);
  const completed = countCompleted(slugs, progress);
  const percent = modules.length
    ? Math.round((completed / modules.length) * 100)
    : 0;
  const badge = hasEarnedBadge(slugs, progress);

  return (
    <>
      <section
        aria-labelledby="progres-heading"
        className="mt-8 scroll-mt-24"
      >
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id="progres-heading" className="text-lg font-extrabold">
              Progres belajarmu
            </h2>
            <p className="text-sm font-bold text-brand">
              {completed} dari {modules.length} modul selesai
            </p>
          </div>

          <div
            className="mt-3 h-3 w-full overflow-hidden rounded-full bg-brand-soft"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-valuetext={`${completed} dari ${modules.length} modul selesai`}
          >
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${percent}%` }}
            />
          </div>

          {badge ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent bg-accent-soft p-4">
              <AwardIcon className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
              <div>
                <h3 className="font-extrabold text-accent">
                  Lencana terbuka: Kolektor Hijau
                </h3>
                <p className="mt-1 text-sm leading-relaxed">
                  Semua modul sudah selesai dengan skor minimal{" "}
                  {PASSING_SCORE}%. Ilmu pilah sampahmu sudah lengkap.
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Selesaikan semua modul dengan skor minimal {PASSING_SCORE}% untuk
              membuka lencana Kolektor Hijau.
            </p>
          )}
        </div>
      </section>

      <section
        id="daftar-modul"
        aria-labelledby="daftar-modul-heading"
        className="mt-10 scroll-mt-24"
      >
        <h2
          id="daftar-modul-heading"
          className="text-2xl font-extrabold tracking-tight"
        >
          Daftar modul
        </h2>
        <p className="mt-1 text-sm text-muted">
          Mulai dari modul pertama, atau pilih topik yang paling kamu butuhkan.
        </p>

        <ol className="mt-5 grid gap-4 sm:grid-cols-2">
          {modules.map((module) => {
            const entry = progress[module.slug];
            const isCompleted = entry?.completed === true;

            return (
              <li key={module.slug} className="h-full">
                <Link
                  href={`/modul/${module.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
                >
                  <div className="flex items-center justify-between gap-3">
                    <TypeBadge type={module.type} />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      Modul {module.order}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold leading-snug group-hover:text-brand">
                    {module.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {module.summary}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-xs">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1.5 font-medium text-muted">
                        <ClockIcon className="h-4 w-4" />
                        {module.duration}
                      </span>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-success">
                          <CheckCircleIcon className="h-4 w-4" />
                          Selesai · skor {entry.bestScore}%
                        </span>
                      ) : (
                        <span className="font-medium text-muted">
                          Belum dikerjakan
                        </span>
                      )}
                    </div>
                    <ArrowRightIcon className="h-5 w-5 shrink-0 text-brand" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
