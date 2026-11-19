export const CRAFT_CHECKLIST_STORAGE_KEY =
  "pilah-pintar-craft-checklist-v1";

type ChecklistMap = Record<string, string[]>;

function readAll(): ChecklistMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(CRAFT_CHECKLIST_STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const result: ChecklistMap = {};
    for (const [key, value] of Object.entries(
      parsed as Record<string, unknown>,
    )) {
      if (!Array.isArray(value)) continue;
      result[key] = value.filter(
        (item): item is string => typeof item === "string",
      );
    }
    return result;
  } catch {
    return {};
  }
}

export function readCraftChecklist(craftKey: string): string[] {
  return readAll()[craftKey] ?? [];
}

export function saveCraftChecklist(craftKey: string, items: string[]): void {
  if (typeof window === "undefined") return;

  try {
    const all = readAll();
    all[craftKey] = items;
    window.localStorage.setItem(
      CRAFT_CHECKLIST_STORAGE_KEY,
      JSON.stringify(all),
    );
  } catch {
    // localStorage bisa gagal (mode privat, kuota penuh). Checklist tetap
    // berfungsi di halaman selama sesi ini.
  }
}
