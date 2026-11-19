import Link from "next/link";
import { CraftIcon } from "@/components/craft-icon";
import { ArrowRightIcon, LeafIcon } from "@/components/icons";
import { ModuleList } from "@/components/module-list";
import { PosterGallery } from "@/components/poster-gallery";
import { getAllModules, toSummary } from "@/lib/modules";

export default function HomePage() {
  const modules = getAllModules().map(toSummary);
  const firstModule = modules[0];
  const posters = modules
    .filter((module) => module.poster)
    .map((module) => ({
      src: module.poster,
      alt: module.posterAlt,
      title: module.title,
      order: module.order,
    }));

  return (
    <>
      <div className="border-b border-line bg-gradient-to-b from-brand-soft to-canvas">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
            <LeafIcon className="h-4 w-4" />
            Micro-learning · 2–3 menit
          </p>

          <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
            Sampah di kelas{" "}
            <span className="text-brand">tidak perlu bercampur.</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Banyak siswa masih mencampur sampah karena belum terbiasa memilah.
            Lewat pelajaran singkat dan kuis, kamu bisa langsung mempraktikkan
            cara memilah dan mendaur ulang di kelas.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`/modul/${firstModule.slug}`}
              className="btn btn-primary w-full sm:w-auto"
            >
              Mulai Belajar
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <p className="text-sm text-muted sm:ml-2">
              {modules.length} modul · kuis langsung · tanpa login
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <section aria-labelledby="prakarya-heading" className="mt-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-brand-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface text-brand">
                <CraftIcon name="Recycle" className="h-6 w-6" />
              </span>
              <div>
                <h2
                  id="prakarya-heading"
                  className="text-lg font-extrabold leading-snug"
                >
                  Dari sampah jadi karya
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                  Botol, kemasan snack, kardus, dan kaleng bisa diubah jadi
                  barang berguna. Pilih ide prakarya, ikuti langkahnya, lalu
                  rapikan sisa bahannya.
                </p>
              </div>
            </div>
            <Link
              href="/prakarya"
              className="btn btn-secondary w-full shrink-0 sm:w-auto"
            >
              Lihat Ide Prakarya
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </section>

        <ModuleList modules={modules} />

        {posters.length > 0 ? <PosterGallery posters={posters} /> : null}
      </div>
    </>
  );
}
