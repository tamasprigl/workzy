"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type JobItem = {
  slug: string;
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  schedule?: string;
  shortDescription?: string;
  benefits?: string[] | string;
  generatedImageUrl?: string | null;
};

type JobsClientProps = {
  jobsList: JobItem[];
};

const FALLBACK_IMAGE = "/placeholder-job.png";

function normalizeBenefits(benefits: JobItem["benefits"]) {
  if (Array.isArray(benefits)) return benefits.filter(Boolean);

  if (typeof benefits === "string") {
    return benefits
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function SearchIcon() {
  return (
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
      className="text-slate-400"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-sky-600"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-sky-600"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-sky-500"
    >
      <path d="M12 2l1.7 4.8L18.5 8l-4 2.7L16 16l-4-2.6L8 16l1.5-5.3L5.5 8l4.8-1.2L12 2z" />
    </svg>
  );
}

export default function JobsClient({ jobsList }: JobsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Összes");

  const locations = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(
        jobsList
          .map((job) => job.location?.trim())
          .filter((location): location is string => Boolean(location))
      )
    ).sort((a, b) => a.localeCompare(b, "hu"));

    return ["Összes", ...uniqueLocations];
  }, [jobsList]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobsList.filter((job) => {
      const matchesLocation =
        selectedLocation === "Összes" || job.location === selectedLocation;

      const haystack = [
        job.title,
        job.company,
        job.location,
        job.salary,
        job.schedule,
        job.shortDescription,
        ...normalizeBenefits(job.benefits),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || haystack.includes(query);

      return matchesLocation && matchesSearch;
    });
  }, [jobsList, search, selectedLocation]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_28%)]" />
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700">
              Aktív állások
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-[56px] lg:leading-[1.02]">
              Találd meg a következő munkád
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Böngéssz az aktuális pozíciók között, szűrj helyszín szerint, és
              jelentkezz gyorsan a számodra megfelelő állásra.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl">
              <div className="text-sm font-medium text-slate-500">
                Aktív pozíciók
              </div>
              <div className="mt-2 text-3xl font-black text-slate-900">
                {jobsList.length}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl">
              <div className="text-sm font-medium text-slate-500">
                Elérhető helyszínek
              </div>
              <div className="mt-2 text-3xl font-black text-slate-900">
                {locations.length - 1}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl">
              <div className="text-sm font-medium text-slate-500">
                Jelentkezés ideje
              </div>
              <div className="mt-2 text-3xl font-black text-slate-900">
                1 perc
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[32px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-6 lg:p-8">
            <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
              <div>
                <label
                  htmlFor="job-search"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Keresés pozíció, helyszín vagy kulcsszó alapján
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100">
                  <SearchIcon />
                  <input
                    id="job-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Például: raktáros, gépkezelő, Győr..."
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location-filter"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Szűrés helyszín szerint
                </label>

                <select
                  id="location-filter"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {locations.slice(0, 7).map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => setSelectedLocation(location)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    selectedLocation === location
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-700",
                  ].join(" ")}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Elérhető pozíciók
              </h2>
              <p className="mt-1 text-slate-600">
                {filteredJobs.length} találat a jelenlegi szűrés alapján
              </p>
            </div>

            {(search || selectedLocation !== "Összes") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedLocation("Összes");
                }}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              >
                Szűrés törlése
              </button>
            )}
          </div>

          {filteredJobs.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((job) => {
                const benefits = normalizeBenefits(job.benefits).slice(0, 3);

                return (
                  <article
                    key={job.slug}
                    className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_24px_70px_rgba(14,165,233,0.10)]"
                  >
                    <div className="relative h-52 w-full bg-slate-100">
                      <Image
                        src={job.generatedImageUrl || FALLBACK_IMAGE}
                        alt={job.title || "Álláskép"}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
                    </div>

                    <div className="flex h-full flex-col p-6">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                          Aktív
                        </div>

                        {job.company && (
                          <div className="text-xs font-medium text-slate-400">
                            {job.company}
                          </div>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold leading-tight text-slate-900">
                        {job.title || "Pozíció"}
                      </h3>

                      <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/90 p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">
                          Bér
                        </div>
                        <div className="mt-1 text-2xl font-black leading-tight text-sky-700">
                          {job.salary || "Versenyképes"}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.location && (
                          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
                            <PinIcon />
                            {job.location}
                          </span>
                        )}

                        {job.schedule && (
                          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
                            <ClockIcon />
                            {job.schedule}
                          </span>
                        )}
                      </div>

                      {job.shortDescription && (
                        <p className="mt-4 text-sm leading-6 text-slate-600">
                          {job.shortDescription}
                        </p>
                      )}

                      {benefits.length > 0 && (
                        <div className="mt-5">
                          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Főbb előnyök
                          </div>

                          <ul className="space-y-2">
                            {benefits.map((benefit, index) => (
                              <li
                                key={`${job.slug}-${index}`}
                                className="flex items-start gap-2 text-sm text-slate-600"
                              >
                                <SparkIcon />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-auto pt-6">
                        <Link
                          href={`/jobs/${job.slug}`}
                          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                        >
                          Megnézem
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-[28px] border border-slate-200 bg-white/90 p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <SearchIcon />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-slate-900">
                Nincs találat
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-slate-600">
                A megadott keresésre vagy szűrésre most nem találtunk állást.
                Próbálj meg másik kulcsszót, vagy válaszd az összes helyszínt.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedLocation("Összes");
                }}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                Összes állás megjelenítése
              </button>
            </div>
          )}

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-8">
              <div className="inline-flex items-center rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700">
                Hogyan működik?
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
                Egyszerű és gyors jelentkezési folyamat
              </h2>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                A Workzy-val az álláskereső gyorsan átlátja a pozíciókat,
                egyszerűen jelentkezik, a rendszer pedig azonnal továbbítja az
                adatokat.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-sky-700">01</div>
                  <div className="mt-2 font-bold text-slate-900">
                    Válassz állást
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Nézd át az aktuális pozíciókat és nyisd meg a részleteket.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-sky-700">02</div>
                  <div className="mt-2 font-bold text-slate-900">
                    Küldd el az adataid
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Töltsd ki az űrlapot néhány mezővel, gyorsan és egyszerűen.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-sky-700">03</div>
                  <div className="mt-2 font-bold text-slate-900">
                    Azonnali továbbítás
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    A jelentkezés rögtön bekerül a rendszerbe és látszik az adminban.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a,#111827)] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.14)] md:p-8">
              <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-sky-200">
                Workzy
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight">
                Nem találtad meg elsőre a megfelelőt?
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-300">
                Nézd végig az összes aktív pozíciót, vagy térj vissza később. A
                Workzy oldalai gyors jelentkezésre és átlátható bemutatásra
                készültek.
              </p>

              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-200"
                >
                  Vissza a főoldalra
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}