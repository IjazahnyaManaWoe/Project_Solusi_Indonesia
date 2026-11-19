"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  RefreshIcon,
  XCircleIcon,
} from "@/components/icons";
import { saveQuizResult } from "@/lib/progress";
import type { QuizQuestion } from "@/lib/modules";

interface QuizProps {
  slug: string;
  questions: QuizQuestion[];
  nextModule: { slug: string; title: string } | null;
}

export function Quiz({ slug, questions, nextModule }: QuizProps) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[current];
  const isAnswered = selected !== null;
  const isCorrect = selected === question.answer;
  const isLast = current === questions.length - 1;

  function startQuiz() {
    setStarted(true);
    setFinished(false);
    setCurrent(0);
    setSelected(null);
    setCorrectCount(0);
    setScore(0);
  }

  function chooseOption(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.answer) {
      setCorrectCount((count) => count + 1);
    }
  }

  function goNext() {
    if (!isLast) {
      setCurrent((index) => index + 1);
      setSelected(null);
      return;
    }

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setFinished(true);
    saveQuizResult(slug, finalScore);
  }

  if (!started) {
    return (
      <section
        id="kuis"
        aria-labelledby="kuis-heading"
        className="mt-10 scroll-mt-24"
      >
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">
            Kuis
          </p>
          <h2
            id="kuis-heading"
            className="mt-1 text-2xl font-extrabold tracking-tight"
          >
            Uji pemahamanmu
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            {questions.length} soal singkat. Setelah memilih jawaban, kamu
            langsung tahu benar atau salah beserta alasannya.
          </p>
          <button
            type="button"
            onClick={startQuiz}
            className="btn btn-primary mt-5 w-full sm:w-auto"
          >
            Mulai Kuis
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </section>
    );
  }

  if (finished) {
    const passed = score >= 70;

    return (
      <section
        id="kuis"
        aria-labelledby="kuis-heading"
        className="mt-10 scroll-mt-24"
      >
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">
            Kuis selesai
          </p>
          <h2
            id="kuis-heading"
            className="mt-1 text-2xl font-extrabold tracking-tight"
          >
            Hasil kuis
          </h2>

          <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
            <span className="text-6xl font-extrabold leading-none text-brand">
              {score}%
            </span>
            <span className="pb-1 font-medium text-muted">
              {correctCount} dari {questions.length} jawaban benar
            </span>
          </div>

          <div
            className={`mt-5 rounded-xl border p-4 ${
              passed
                ? "border-success bg-success-soft"
                : "border-line bg-brand-soft"
            }`}
          >
            <p className="font-bold">
              {passed ? "Kerja bagus!" : "Belum mencapai 70%, tidak apa-apa."}
            </p>
            <p className="mt-1 text-sm leading-relaxed">
              {passed
                ? "Kamu sudah cukup paham. Coba praktikkan langsung saat memilah sampah di kelas."
                : "Baca ulang bagian yang masih membingungkan, lalu ulangi kuisnya. Kamu bisa mencoba sebanyak yang kamu mau."}
            </p>
          </div>

          <p className="mt-3 text-sm text-muted">
            Skor terbaikmu tersimpan otomatis di perangkat ini.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={startQuiz}
              className="btn btn-secondary w-full sm:w-auto"
            >
              <RefreshIcon className="h-5 w-5" />
              Ulangi Kuis
            </button>
            {nextModule ? (
              <Link
                href={`/modul/${nextModule.slug}`}
                className="btn btn-primary w-full sm:w-auto"
              >
                Modul Berikutnya
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            ) : (
              <Link href="/" className="btn btn-primary w-full sm:w-auto">
                Kembali ke Beranda
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="kuis"
      aria-labelledby="kuis-heading"
      className="mt-10 scroll-mt-24"
    >
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="kuis-heading"
            className="text-xs font-bold uppercase tracking-widest text-brand"
          >
            Kuis
          </h2>
          <p className="text-sm font-semibold text-muted">
            Soal {current + 1} dari {questions.length}
          </p>
        </div>

        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-soft"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        <fieldset className="mt-6 min-w-0">
          <legend className="text-xl font-bold leading-snug sm:text-2xl">
            {question.question}
          </legend>

          <div className="mt-5 flex flex-col gap-2.5">
            {question.options.map((option, index) => {
              const isRight = index === question.answer;
              const isPicked = index === selected;

              let optionClass = "border-line bg-surface hover:border-brand hover:bg-brand-soft";
              let letterClass = "bg-brand-soft text-brand";

              if (isAnswered && isRight) {
                optionClass = "border-success bg-success-soft";
                letterClass = "bg-success text-canvas";
              } else if (isAnswered && isPicked) {
                optionClass = "border-danger bg-danger-soft";
                letterClass = "bg-danger text-canvas";
              } else if (isAnswered) {
                optionClass = "border-line bg-surface opacity-60";
              }

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => chooseOption(index)}
                  disabled={isAnswered}
                  aria-pressed={isPicked}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 px-3.5 py-3.5 text-left text-base font-medium transition-colors ${optionClass}`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${letterClass}`}
                    aria-hidden="true"
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {isAnswered && isRight ? (
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-success" />
                  ) : null}
                  {isAnswered && isPicked && !isRight ? (
                    <XCircleIcon className="h-5 w-5 shrink-0 text-danger" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div role="status" aria-live="polite">
          {isAnswered ? (
            <div
              className={`mt-4 rounded-xl border-2 p-4 ${
                isCorrect
                  ? "border-success bg-success-soft"
                  : "border-danger bg-danger-soft"
              }`}
            >
              <p className="flex items-center gap-2 font-bold">
                {isCorrect ? (
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-success" />
                ) : (
                  <XCircleIcon className="h-5 w-5 shrink-0 text-danger" />
                )}
                {isCorrect ? "Benar!" : "Belum tepat."}
              </p>
              {!isCorrect ? (
                <p className="mt-2 text-sm font-semibold">
                  Jawaban yang benar: {question.options[question.answer]}
                </p>
              ) : null}
              <p className="mt-1.5 text-sm leading-relaxed">
                {question.explanation}
              </p>
            </div>
          ) : null}
        </div>

        {isAnswered ? (
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={goNext}
              className="btn btn-primary w-full sm:w-auto"
            >
              {isLast ? "Lihat Hasil" : "Soal Berikutnya"}
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
