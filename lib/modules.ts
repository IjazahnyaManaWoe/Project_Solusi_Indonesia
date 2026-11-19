import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ModuleType = "text" | "video";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface LearningModule {
  slug: string;
  title: string;
  summary: string;
  order: number;
  duration: string;
  type: ModuleType;
  videoUrl: string;
  videoEmbedUrl: string | null;
  poster: string;
  posterAlt: string;
  quiz: QuizQuestion[];
  content: string;
}

export type ModuleSummary = Omit<LearningModule, "content" | "quiz">;

const MODULES_DIR = path.join(process.cwd(), "content", "modules");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function fail(fileLabel: string, message: string): never {
  throw new Error(
    `\n[Konten] Frontmatter tidak valid pada "${fileLabel}".\n` +
      `Penyebab: ${message}\n` +
      `Periksa kembali frontmatter di file tersebut, lalu jalankan ulang build.\n`,
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function getYouTubeEmbedUrl(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  let videoId: string | null = null;

  if (host === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      videoId = url.searchParams.get("v");
    } else {
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0] ?? "")) {
        videoId = parts[1] ?? null;
      }
    }
  }

  if (!videoId || !/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) {
    return null;
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

function validateModule(
  fileLabel: string,
  data: Record<string, unknown>,
): Omit<LearningModule, "slug" | "content"> {
  if (!isNonEmptyString(data.title)) {
    fail(fileLabel, "field `title` wajib diisi dengan teks.");
  }
  if (!isNonEmptyString(data.summary)) {
    fail(fileLabel, "field `summary` wajib diisi dengan teks.");
  }
  if (
    typeof data.order !== "number" ||
    !Number.isInteger(data.order) ||
    data.order < 1
  ) {
    fail(fileLabel, "field `order` wajib berupa angka bulat minimal 1.");
  }
  if (!isNonEmptyString(data.duration)) {
    fail(fileLabel, "field `duration` wajib diisi, misalnya \"3 menit\".");
  }
  if (data.type !== "text" && data.type !== "video") {
    fail(fileLabel, "field `type` wajib bernilai \"text\" atau \"video\".");
  }

  const type = data.type;
  const videoUrl = isNonEmptyString(data.videoUrl) ? data.videoUrl.trim() : "";
  let videoEmbedUrl: string | null = null;

  if (type === "video") {
    if (!videoUrl) {
      fail(
        fileLabel,
        "modul bertipe video wajib mengisi `videoUrl` dengan tautan YouTube.",
      );
    }
    videoEmbedUrl = getYouTubeEmbedUrl(videoUrl);
    if (!videoEmbedUrl) {
      fail(
        fileLabel,
        `videoUrl "${videoUrl}" tidak dikenali. Gunakan tautan YouTube biasa, misalnya https://www.youtube.com/watch?v=ID atau https://youtu.be/ID.`,
      );
    }
  }

  const poster = isNonEmptyString(data.poster) ? data.poster.trim() : "";
  const posterAlt = isNonEmptyString(data.posterAlt)
    ? data.posterAlt.trim()
    : "";

  if (poster) {
    if (!poster.startsWith("/")) {
      fail(
        fileLabel,
        `field \`poster\` harus diawali garis miring, misalnya \"/images/poster-pemilahan.png\". Nilai saat ini: "${poster}".`,
      );
    }
    if (!posterAlt) {
      fail(
        fileLabel,
        "field `posterAlt` wajib diisi jika `poster` diisi. Tuliskan deskripsi singkat isi poster untuk pembaca layar.",
      );
    }

    const posterPath = path.join(PUBLIC_DIR, poster);
    const relativePath = path.relative(PUBLIC_DIR, posterPath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      fail(
        fileLabel,
        `path poster "${poster}" keluar dari folder "public". Gunakan path di dalam public, misalnya \"/images/poster.png\".`,
      );
    }
    if (!fs.existsSync(posterPath) || !fs.statSync(posterPath).isFile()) {
      fail(
        fileLabel,
        `file poster "${poster}" tidak ditemukan di folder "public". Simpan gambarnya di public${poster} atau perbaiki path di frontmatter.`,
      );
    }
  } else if (posterAlt) {
    fail(
      fileLabel,
      "field `posterAlt` diisi tetapi `poster` kosong. Isi path gambarnya atau hapus `posterAlt`.",
    );
  }

  if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
    fail(fileLabel, "field `quiz` wajib berisi minimal satu soal.");
  }

  const quiz: QuizQuestion[] = data.quiz.map((item: unknown, index: number) => {
    const nomor = index + 1;
    if (!item || typeof item !== "object") {
      fail(fileLabel, `soal kuis nomor ${nomor} tidak berbentuk objek.`);
    }
    const soal = item as Record<string, unknown>;

    if (!isNonEmptyString(soal.question)) {
      fail(fileLabel, `soal kuis nomor ${nomor} belum punya \`question\`.`);
    }
    if (!Array.isArray(soal.options) || soal.options.length < 2) {
      fail(
        fileLabel,
        `soal kuis nomor ${nomor} wajib punya minimal dua \`options\`.`,
      );
    }
    const options = soal.options.map((option, optionIndex) => {
      if (!isNonEmptyString(option)) {
        fail(
          fileLabel,
          `opsi jawaban nomor ${optionIndex + 1} pada soal ${nomor} wajib berupa teks.`,
        );
      }
      return option.trim();
    });

    if (
      typeof soal.answer !== "number" ||
      !Number.isInteger(soal.answer) ||
      soal.answer < 0 ||
      soal.answer >= options.length
    ) {
      fail(
        fileLabel,
        `\`answer\` pada soal ${nomor} wajib berupa index angka 0-${options.length - 1} sesuai jumlah opsi.`,
      );
    }
    if (!isNonEmptyString(soal.explanation)) {
      fail(fileLabel, `soal kuis nomor ${nomor} belum punya \`explanation\`.`);
    }

    return {
      question: soal.question.trim(),
      options,
      answer: soal.answer,
      explanation: soal.explanation.trim(),
    };
  });

  return {
    title: data.title.trim(),
    summary: data.summary.trim(),
    order: data.order,
    duration: data.duration.trim(),
    type,
    videoUrl,
    videoEmbedUrl,
    poster,
    posterAlt,
    quiz,
  };
}

export function getAllModules(): LearningModule[] {
  if (!fs.existsSync(MODULES_DIR)) {
    throw new Error(
      `\n[Konten] Folder "${path.join("content", "modules")}" tidak ditemukan.\n`,
    );
  }

  const fileNames = fs
    .readdirSync(MODULES_DIR)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"));

  if (fileNames.length === 0) {
    throw new Error(
      `\n[Konten] Tidak ada file .md di "${path.join("content", "modules")}".\n`,
    );
  }

  const modules = fileNames.map((fileName) => {
    const fileLabel = path.join("content", "modules", fileName);
    const filePath = path.join(MODULES_DIR, fileName);
    const raw = fs.readFileSync(filePath, "utf8");

    let parsed: ReturnType<typeof matter>;
    try {
      parsed = matter(raw);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      fail(fileLabel, `format YAML gagal dibaca (${message}).`);
    }

    const data = parsed.data as Record<string, unknown>;
    const validated = validateModule(fileLabel, data);

    return {
      ...validated,
      slug: fileName.replace(/\.md$/, ""),
      content: parsed.content.trim(),
    } satisfies LearningModule;
  });

  return modules.sort((a, b) => a.order - b.order);
}

export function getModuleBySlug(slug: string): LearningModule | undefined {
  return getAllModules().find((module) => module.slug === slug);
}

export function toSummary(module: LearningModule): ModuleSummary {
  const { content: _content, quiz: _quiz, ...summary } = module;
  return summary;
}
