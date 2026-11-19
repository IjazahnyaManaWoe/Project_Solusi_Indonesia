export const DIFFICULTIES = ["Mudah", "Sedang", "Sulit"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export interface CraftSummary {
  slug: string;
  wasteType: string;
  title: string;
  difficulty: Difficulty;
  duration: string;
  summary: string;
}

export interface Craft extends CraftSummary {
  materials: string[];
  tools: string[];
  safety: string;
  steps: string;
  aftercare: string;
}

export function isDifficulty(value: unknown): value is Difficulty {
  return (
    typeof value === "string" &&
    (DIFFICULTIES as readonly string[]).includes(value)
  );
}

export function difficultyRank(difficulty: Difficulty): number {
  return DIFFICULTIES.indexOf(difficulty);
}
