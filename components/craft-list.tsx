"use client";

import Link from "next/link";
import { useState } from "react";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";
import {
  DIFFICULTIES,
  type CraftSummary,
  type Difficulty,
} from "@/lib/craft-types";

type Filter = "Semua" | Difficulty;

const FILTERS: Filter[] = ["Semua", ...DIFFICULTIES];

export function CraftList({
  wasteType,
  crafts,
}: {
  wasteType: string;
  crafts: CraftSummary[];
}) {
  const [filter, setFilter] = useState<Filter>("Semua");
  const visible =
    filter === "Semua"
      ? crafts
      : crafts.filter((craft) => craft.difficulty === filter);

  return (
    <>
      <div
        role="group"
        aria-label="Filter tingkat kesulitan"
        className="mt-6 flex flex-wrap gap-2"
      >
        {FILTERS.map((option) => {
          const active = filter === option;
          const count =
            option === "Semua"
              ? crafts.length
              : crafts.filter((craft) => craft.difficulty === option).length;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option)}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors ${
                active
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-surface text-ink hover:border-brand hover:text-brand"
              }`}
            >
              {option}
              <span
                className={`text-xs font-bold ${
                  active ? "text-on-brand/80" : "text-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-muted">
        {visible.length} ide
        {filter === "Semua" ? "" : ` tingkat ${filter.toLowerCase()}`} untuk
        jenis sampah ini.
      </p>

      {visible.length > 0 ? (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {visible.map((craft) => (
            <li key={craft.slug} className="h-full">
              <Link
                href={`/prakarya/${wasteType}/${craft.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
              >
                <div className="flex items-center justify-between gap-3">
                  <DifficultyBadge difficulty={craft.difficulty} />
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                    <ClockIcon className="h-4 w-4" />
                    {craft.duration}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold leading-snug group-hover:text-brand">
                  {craft.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {craft.summary}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 border-t border-line pt-3 text-sm font-bold text-brand">
                  Lihat langkahnya
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-2xl border border-line bg-surface p-5 text-sm text-muted">
          Belum ada ide dengan tingkat kesulitan ini. Coba pilih tingkat lain.
        </p>
      )}
    </>
  );
}
