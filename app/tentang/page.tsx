import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, LeafIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Latar belakang dan tujuan Pilah Pintar, media micro-learning pemilahan sampah untuk siswa SMA.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
        <LeafIcon className="h-4 w-4" />
        Tentang
      </p>

      <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
        Kenapa Pilah Pintar dibuat?
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Pilah Pintar adalah media belajar singkat untuk siswa SMA. Satu modul
        bisa diselesaikan dalam 2–3 menit, lalu ditutup dengan kuis yang
        langsung memberi umpan balik.
      </p>

      <div className="mt-9 space-y-8 text-[1.0625rem] leading-8">
        <section>
          <h2 className="text-xl font-extrabold">Latar belakang</h2>
          <p className="mt-2 text-muted">
            Di SMAN 19 Bandung, sampah sering tercampur meski siswa sudah diberi
            tahu. Akibatnya, sampah yang seharusnya bisa didaur ulang menjadi
            kotor dan bercampur. Karya daur ulang juga mudah rusak, sementara
            sisa bahan sering tertinggal dan mengotori kelas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold">Tujuan website</h2>
          <ul className="mt-3 space-y-2 text-muted">
            <li className="flex gap-2.5">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              Membantu siswa mengenali jenis sampah yang sering ada di sekolah.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              Membiasakan membersihkan kemasan sebelum dipilah.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              Mengajak siswa membuat karya daur ulang yang berguna, lalu
              merawatnya dan membereskan sisa bahan.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-extrabold">Cara belajar di sini</h2>
          <ol className="mt-3 space-y-3 text-muted">
            <li className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                1
              </span>
              Baca atau tonton satu modul singkat.
            </li>
            <li className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                2
              </span>
              Kerjakan kuis dan baca penjelasan setiap jawaban.
            </li>
            <li className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                3
              </span>
              Progres dan skor terbaikmu tersimpan di perangkat ini. Tidak perlu
              daftar akun.
            </li>
          </ol>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-lg font-extrabold">Catatan</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Website ini dikembangkan sebagai proyek pembelajaran. Teks di
            halaman ini masih berupa draf awal dan dapat diperbarui sesuai
            kebutuhan sekolah.
          </p>
        </section>
      </div>

      <div className="mt-9">
        <Link href="/" className="btn btn-primary w-full sm:w-auto">
          Mulai Belajar
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
