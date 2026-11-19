import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  CRAFT_ICON_NAMES,
  isCraftIconName,
  type CraftIconName,
} from "@/components/craft-icon";
import {
  DIFFICULTIES,
  difficultyRank,
  isDifficulty,
  type Craft,
  type CraftSummary,
  type Difficulty,
} from "@/lib/craft-types";

export type { Craft, CraftSummary, Difficulty } from "@/lib/craft-types";

export interface WasteType {
  slug: string;
  name: string;
  icon: CraftIconName;
  description: string;
}

export interface WasteTypeWithCount extends WasteType {
  craftCount: number;
}

const CRAFTS_DIR = path.join(process.cwd(), "content", "crafts");
const TYPES_FILE = path.join(CRAFTS_DIR, "_types.json");
const TYPES_LABEL = path.join("content", "crafts", "_types.json");
const AFTERCARE_PATTERN = /^##[ \t]+Rapikan setelahnya[ \t]*$/im;

function fail(fileLabel: string, message: string): never {
  throw new Error(
    `\n[Konten Prakarya] Data tidak valid pada "${fileLabel}".\n` +
      `Penyebab: ${message}\n` +
      `Periksa kembali file tersebut, lalu jalankan ulang build.\n`,
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readStringArray(
  value: unknown,
  field: string,
  fileLabel: string,
): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(fileLabel, `field \`${field}\` wajib berisi minimal satu item.`);
  }

  return value.map((item, index) => {
    if (!isNonEmptyString(item)) {
      fail(
        fileLabel,
        `item ke-${index + 1} pada \`${field}\` wajib berupa teks yang tidak kosong.`,
      );
    }
    return item.trim();
  });
}

export function getAllWasteTypes(): WasteType[] {
  if (!fs.existsSync(TYPES_FILE)) {
    fail(TYPES_LABEL, "file daftar jenis sampah tidak ditemukan.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(TYPES_FILE, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(TYPES_LABEL, `format JSON gagal dibaca (${message}).`);
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    fail(TYPES_LABEL, "isi file wajib berupa array dengan minimal satu jenis.");
  }

  const seen = new Set<string>();

  return parsed.map((item, index) => {
    const label = `${TYPES_LABEL} (entri ke-${index + 1})`;

    if (!item || typeof item !== "object" || Array.isArray(item)) {
      fail(label, "setiap entri wajib berupa objek.");
    }

    const entry = item as Record<string, unknown>;

    if (
      !isNonEmptyString(entry.slug) ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug.trim())
    ) {
      fail(
        label,
        "field `slug` wajib diisi huruf kecil, angka, dan tanda hubung, misalnya \"botol-plastik\".",
      );
    }
    const slug = entry.slug.trim();
    if (seen.has(slug)) {
      fail(label, `slug "${slug}" dipakai lebih dari sekali.`);
    }
    seen.add(slug);

    if (!isNonEmptyString(entry.name)) {
      fail(label, "field `name` wajib diisi dengan nama tampilan.");
    }
    if (!isNonEmptyString(entry.icon) || !isCraftIconName(entry.icon)) {
      fail(
        label,
        `field \`icon\` wajib berisi nama ikon lucide-react yang tersedia. Pilihan saat ini: ${CRAFT_ICON_NAMES.join(", ")}.`,
      );
    }
    if (!isNonEmptyString(entry.description)) {
      fail(label, "field `description` wajib diisi dengan satu kalimat.");
    }

    return {
      slug,
      name: entry.name.trim(),
      icon: entry.icon,
      description: entry.description.trim(),
    };
  });
}

function validateCraft(
  fileLabel: string,
  typeSlug: string,
  data: Record<string, unknown>,
  content: string,
): Omit<Craft, "slug"> {
  if (!isNonEmptyString(data.title)) {
    fail(fileLabel, "field `title` wajib diisi dengan teks.");
  }
  if (!isNonEmptyString(data.wasteType)) {
    fail(fileLabel, "field `wasteType` wajib diisi.");
  }
  if (data.wasteType.trim() !== typeSlug) {
    fail(
      fileLabel,
      `\`wasteType\` bernilai "${data.wasteType.trim()}", padahal file ini berada di folder "${typeSlug}". Samakan keduanya.`,
    );
  }
  if (!isDifficulty(data.difficulty)) {
    fail(
      fileLabel,
      `field \`difficulty\` wajib bernilai salah satu dari: ${DIFFICULTIES.join(", ")}.`,
    );
  }
  if (!isNonEmptyString(data.duration)) {
    fail(fileLabel, "field `duration` wajib diisi, misalnya \"30 menit\".");
  }
  if (!isNonEmptyString(data.summary)) {
    fail(fileLabel, "field `summary` wajib berisi satu kalimat ringkasan.");
  }

  const materials = readStringArray(data.materials, "materials", fileLabel);
  const tools = readStringArray(data.tools, "tools", fileLabel);

  if (!isNonEmptyString(data.safety)) {
    fail(fileLabel, "field `safety` wajib berisi minimal satu tips keamanan.");
  }

  const match = AFTERCARE_PATTERN.exec(content);
  if (!match || match.index === undefined) {
    fail(
      fileLabel,
      'isi Markdown wajib punya heading "## Rapikan setelahnya" untuk bagian membereskan sisa bahan.',
    );
  }

  const steps = content.slice(0, match.index).trim();
  const aftercare = content.slice(match.index + match[0].length).trim();

  if (!steps) {
    fail(
      fileLabel,
      'langkah pembuatan masih kosong. Tulis daftar bernomor sebelum heading "## Rapikan setelahnya".',
    );
  }
  if (!aftercare) {
    fail(
      fileLabel,
      'bagian "## Rapikan setelahnya" masih kosong. Isi cara membereskan sisa bahan dan menyimpan karya.',
    );
  }

  return {
    wasteType: typeSlug,
    title: data.title.trim(),
    difficulty: data.difficulty,
    duration: data.duration.trim(),
    summary: data.summary.trim(),
    materials,
    tools,
    safety: data.safety.trim(),
    steps,
    aftercare,
  };
}

export function getCraftsByType(typeSlug: string): Craft[] {
  const type = getAllWasteTypes().find((item) => item.slug === typeSlug);
  if (!type) return [];

  const dir = path.join(CRAFTS_DIR, typeSlug);
  const dirLabel = path.join("content", "crafts", typeSlug);

  if (!fs.existsSync(dir)) {
    fail(
      TYPES_LABEL,
      `folder "${dirLabel}" untuk jenis "${typeSlug}" tidak ditemukan. Buat foldernya atau hapus entri dari daftar jenis.`,
    );
  }

  const fileNames = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"));

  const crafts = fileNames.map((fileName) => {
    const fileLabel = path.join(dirLabel, fileName);
    const filePath = path.join(dir, fileName);
    const raw = fs.readFileSync(filePath, "utf8");

    let parsed: ReturnType<typeof matter>;
    try {
      parsed = matter(raw);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      fail(fileLabel, `format YAML gagal dibaca (${message}).`);
    }

    const validated = validateCraft(
      fileLabel,
      typeSlug,
      parsed.data as Record<string, unknown>,
      parsed.content,
    );

    return {
      ...validated,
      slug: fileName.replace(/\.md$/, ""),
    } satisfies Craft;
  });

  return crafts.sort(
    (a, b) =>
      difficultyRank(a.difficulty) - difficultyRank(b.difficulty) ||
      a.title.localeCompare(b.title, "id"),
  );
}

export function getAllWasteTypesWithCounts(): WasteTypeWithCount[] {
  return getAllWasteTypes().map((type) => ({
    ...type,
    craftCount: getCraftsByType(type.slug).length,
  }));
}

export function getWasteTypeBySlug(slug: string): WasteType | undefined {
  return getAllWasteTypes().find((type) => type.slug === slug);
}

export function getCraft(typeSlug: string, craftSlug: string): Craft | undefined {
  return getCraftsByType(typeSlug).find((craft) => craft.slug === craftSlug);
}

export function toCraftSummary(craft: Craft): CraftSummary {
  return {
    slug: craft.slug,
    wasteType: craft.wasteType,
    title: craft.title,
    difficulty: craft.difficulty,
    duration: craft.duration,
    summary: craft.summary,
  };
}
