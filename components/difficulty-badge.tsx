import type { Difficulty } from "@/lib/craft-types";

const STYLES: Record<Difficulty, string> = {
  Mudah: "bg-success-soft text-success",
  Sedang: "bg-accent-soft text-accent",
  Sulit: "bg-danger-soft text-danger",
};

export function DifficultyBadge({
  difficulty,
  className = "",
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${STYLES[difficulty]} ${className}`}
    >
      {difficulty}
    </span>
  );
}
