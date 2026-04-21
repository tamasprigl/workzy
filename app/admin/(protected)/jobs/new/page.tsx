"use client";

import { useState } from "react";
import Link from "next/link";
import NewJobForm from "./NewJobForm";
import JobPreview from "./JobPreview";
import { JobFormData } from "./types";

const initialFormData: JobFormData = {
  title: "",
  slug: "",
  company: "",
  location: "",
  jobType: "",
  employmentType: "",
  shift: "",
  salary: "",
  shortDescription: "",
  fullDescription: "",
  requirements: "",
  benefits: "",
  ctaText: "Jelentkezés az állásra",
  channels: "Mindkettő",
  budget: "",
  platform: "facebook",
  campaignLocation: "",
  objective: "Jelentkezők gyűjtése",
};

export default function NewJobPage() {
  const [formData, setFormData] = useState<JobFormData>(initialFormData);

  return (
    <main className="min-h-[calc(100vh-96px)]">
      <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/70 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%)]" />

        <div className="relative">
          <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <Link
                href="/admin/jobs"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-sky-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Állások
              </Link>

              <div className="mt-4 inline-flex items-center rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700">
                Új állás létrehozása
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                Új állás meghirdetése
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                Töltsd ki az állás adatait, generálj hozzá AI képet, és nézd meg
                az élő előnézetet azonnal a jobb oldalon.
              </p>
            </div>

            <div className="hidden items-center gap-3 xl:flex">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              >
                Súgó
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(14,165,233,0.24)] transition hover:bg-sky-500"
              >
                Mentés és kampány indítása
              </button>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <section className="min-w-0">
              <div className="rounded-[32px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Állás adatai
                    </h2>
                    <p className="text-sm text-slate-500">
                      Töltsd ki a mezőket, az előnézet automatikusan frissül.
                    </p>
                  </div>
                </div>

                <NewJobForm formData={formData} setFormData={setFormData} />
              </div>
            </section>

            <aside className="min-w-0 xl:sticky xl:top-6 xl:self-start">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Élő előnézet
              </div>

              <div className="rounded-[32px] border border-white/80 bg-white/88 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                <JobPreview data={formData} />
              </div>

              <div className="mt-5 rounded-[24px] border border-sky-100 bg-sky-50/70 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>

                  <div>
                    <div className="font-semibold text-sky-700">
                      Az előnézet automatikusan frissül
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      A bal oldali mezők módosításával az előnézet valós időben
                      változik.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}