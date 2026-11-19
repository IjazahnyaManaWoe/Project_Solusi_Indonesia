"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/icons";
import {
  readCraftChecklist,
  saveCraftChecklist,
} from "@/lib/craft-checklist";

export function CraftChecklist({
  craftKey,
  items,
}: {
  craftKey: string;
  items: string[];
}) {
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setChecked(readCraftChecklist(craftKey));
  }, [craftKey]);

  const doneCount = items.filter((item) => checked.includes(item)).length;

  function toggle(item: string) {
    const next = checked.includes(item)
      ? checked.filter((value) => value !== item)
      : [...checked, item];

    setChecked(next);
    saveCraftChecklist(craftKey, next);
  }

  return (
    <section
      aria-labelledby="sebelum-mulai-heading"
      className="rounded-2xl border border-line bg-surface p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="sebelum-mulai-heading" className="text-lg font-extrabold">
          Sebelum mulai
        </h2>
        <p aria-live="polite" className="text-sm font-bold text-brand">
          {doneCount} dari {items.length} siap
        </p>
      </div>
      <p className="mt-1 text-sm text-muted">
        Centang alat dan bahan tambahan setelah kamu menyiapkannya. Statusnya
        tersimpan di perangkat ini.
      </p>

      <ul className="mt-4 space-y-1">
        {items.map((item) => {
          const isChecked = checked.includes(item);
          const id = `${craftKey}-${item}`
            .replace(/[^a-zA-Z0-9_-]+/g, "-")
            .toLowerCase();

          return (
            <li key={item}>
              <label
                htmlFor={id}
                className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-brand-soft"
              >
                <span
                  className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 ${
                    isChecked
                      ? "border-brand bg-brand text-on-brand"
                      : "border-line bg-canvas text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  <CheckIcon className="h-4 w-4" />
                </span>
                <input
                  id={id}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(item)}
                  className="sr-only"
                />
                <span
                  className={`text-[0.95rem] leading-relaxed ${
                    isChecked ? "text-muted line-through" : "text-ink"
                  }`}
                >
                  {item}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
