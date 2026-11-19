"use client";

export interface ModuleProgress {
  completed: boolean;
  bestScore: number;
}

export type ProgressMap = Record<string, ModuleProgress>;

export const PROGRESS_STORAGE_KEY = "pilah-pintar-progress-v1";
export const PROGRESS_EVENT = "pilah-pintar:progress-updated";
export const PASSING_SCORE = 70;

export function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const result: ProgressMap = {};
    for (const [slug, value] of Object.entries(
      parsed as Record<string, unknown>,
    )) {
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      const entry = value as Record<string, unknown>;
      if (typeof entry.bestScore !== "number") continue;

      const bestScore = Math.min(100, Math.max(0, Math.round(entry.bestScore)));
      result[slug] = {
        completed: entry.completed === true,
        bestScore,
      };
    }
    return result;
  } catch {
    return {};
  }
}

export function saveQuizResult(slug: string, scorePercent: number): void {
  if (typeof window === "undefined") return;

  try {
    const progress = readProgress();
    const previous = progress[slug];
    const score = Math.min(100, Math.max(0, Math.round(scorePercent)));
    const bestScore = Math.max(previous?.bestScore ?? 0, score);

    progress[slug] = { completed: true, bestScore };

    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify(progress),
    );
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch {
    // localStorage bisa gagal (mode privat, kuota penuh). Progres tetap
    // berjalan di memori halaman, jadi kuis tidak perlu terganggu.
  }
}

export function countCompleted(
  slugs: string[],
  progress: ProgressMap,
): number {
  return slugs.filter((slug) => progress[slug]?.completed).length;
}

export function hasEarnedBadge(
  slugs: string[],
  progress: ProgressMap,
): boolean {
  return (
    slugs.length > 0 &&
    slugs.every((slug) => {
      const entry = progress[slug];
      return entry?.completed === true && entry.bestScore >= PASSING_SCORE;
    })
  );
}
