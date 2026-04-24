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
  type?: "fizikai" | "szellemi" | "Fizikai" | "Szellemi";
  shortDescription?: string;
  benefits?: string[] | string;
  generatedImageUrl?: string | null;
};

type JobsClientProps = {
  jobsList: JobItem[];
};

type JobTypeFilter = "Összes" | "Fizikai" | "Szellemi";
type SortOption = "Legújabb" | "Bér szerint" | "A-Z";

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

function getJobType(job: JobItem): "Fizikai" | "Szellemi" {
  if (job.type === "Fizikai" || job.type === "fizikai") return "Fizikai";
  if (job.type === "Szellemi" || job.type === "szellemi") return "Szellemi";

  const text = [
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

  const intellectualKeywords = [
    "mérnök",
    "agronómus",
    "irodai",
    "adminisztrátor",
    "asszisztens",
    "manager",
    "koordinátor",
    "értékesítő",
    "könyvelő",
    "hr",
    "marketing",
    "informatikus",
    "fejlesztő",
    "projekt",
  ];

  return intellectualKeywords.some((keyword) => text.includes(keyword))
    ? "Szellemi"
    : "Fizikai";
}

function extractSalaryNumber(salary?: string) {
  if (!salary) return 0;

  const numbers = salary.match(/\d[\d.\s]*/g);
  if (!numbers?.length) return 0;

  return Math.max(
    ...numbers.map((number) => Number(number.replace(/[.\s]/g, "")) || 0)
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-400">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type SelectOption = {
  value: string;
  label: string;
};

function CustomSelect({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className={`relative ${isOpen ? "z-[999]" : "z-[100]"}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-full items-center justify-between rounded-2xl border border-slate-200/90 bg-white px-4 text-sm font-black text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] outline-none transition hover:border-sky-200 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
        aria-label={label}
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-[9999] mt-3 max-h-[260px] w-full overflow-y-auto rounded-2xl border border-sky-100/80 bg-white/95 shadow-[0_28px_80px_rgba(15,23,42,0.18)] ring-1 ring-sky-100/70 backdrop-blur-xl">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-sky-50/80 ${
                  value === option.value
                    ? "bg-sky-50 font-black text-sky-700"
                    : "font-bold text-slate-700"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {value === option.value && (
                  <span className="text-sky-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function JobCard({ job, featured = false }: { job: JobItem; featured?: boolean }) {
  const image = job.generatedImageUrl || FALLBACK_IMAGE;
  const jobType = getJobType(job);
  const benefits = normalizeBenefits(job.benefits).slice(0, 2);

  return (
    <div className="group relative h-full">
      <div className="absolute -inset-[1px] rounded-[30px] bg-gradient-to-r from-sky-400/45 via-cyan-300/35 to-blue-500/45 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

      <Link
        href={`/jobs/${job.slug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_30px_80px_rgba(14,165,233,0.16)]"
      >
        <div className="relative flex h-[200px] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 p-3">
          <Image
            src={image}
            alt={job.title || "Állás"}
            fill
            className="object-contain p-3 transition duration-500 group-hover:scale-[1.035]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          <div className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-600 shadow-[0_8px_20px_rgba(15,23,42,0.10)] backdrop-blur">
            Aktív
          </div>

          <div className="absolute right-4 top-4 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.10)] backdrop-blur">
            {jobType}
          </div>

          {featured && (
            <div className="absolute bottom-4 left-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(14,165,233,0.28)]">
              Kiemelt
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="inline-flex min-w-0 items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700">
              <span>📍</span>
              <span className="truncate">{job.location || "Helyszín egyeztetés szerint"}</span>
            </div>

            {job.company && (
              <div className="max-w-[120px] truncate text-xs font-semibold text-slate-400">
                {job.company}
              </div>
            )}
          </div>

          <h2 className="line-clamp-2 text-[21px] font-black leading-tight tracking-[-0.035em] text-slate-900">
            {job.title || "Nyitott pozíció"}
          </h2>

          {job.salary && (
            <div className="mt-4 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50 px-4 py-3">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-600/80">
                Bér
              </div>
              <div className="mt-1 truncate text-[19px] font-black text-sky-700">
                {job.salary}
              </div>
            </div>
          )}

          {job.shortDescription && (
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
              {job.shortDescription}
            </p>
          )}

          {benefits.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {benefit}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-5">
            <div className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-500">
              Részletek megtekintése →
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-3xl">
        🔎
      </div>
      <h2 className="mt-5 text-2xl font-black text-slate-900">Nincs találat</h2>
      <p className="mx-auto mt-2 max-w-md text-slate-500">
        Próbálj más kulcsszót, helyszínt vagy munkatípust megadni.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
      >
        Szűrők törlése
      </button>
    </div>
  );
}

export default function JobsClient({ jobsList }: JobsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Összes");
  const [selectedJobType, setSelectedJobType] = useState<JobTypeFilter>("Összes");
  const [sortBy, setSortBy] = useState<SortOption>("Legújabb");

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

    const filtered = jobsList.filter((job) => {
      const matchesLocation =
        selectedLocation === "Összes" || job.location === selectedLocation;

      const jobType = getJobType(job);
      const matchesType = selectedJobType === "Összes" || jobType === selectedJobType;

      const haystack = [
        job.title,
        job.company,
        job.location,
        job.salary,
        job.schedule,
        job.shortDescription,
        jobType,
        ...normalizeBenefits(job.benefits),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || haystack.includes(query);

      return matchesLocation && matchesType && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "A-Z") {
        return (a.title || "").localeCompare(b.title || "", "hu");
      }

      if (sortBy === "Bér szerint") {
        return extractSalaryNumber(b.salary) - extractSalaryNumber(a.salary);
      }

      return 0;
    });
  }, [jobsList, search, selectedLocation, selectedJobType, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setSelectedLocation("Összes");
    setSelectedJobType("Összes");
    setSortBy("Legújabb");
  };

  return (
    <main className="min-h-screen bg-[#f4f7f9] text-slate-900">
      <section className="relative overflow-visible z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_30%)] pointer-events-none" />
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-200/35 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10 z-40">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full border border-sky-100 bg-white/86 px-4 py-2 text-sm font-bold text-sky-700 shadow-[0_10px_26px_rgba(15,23,42,0.08)] backdrop-blur">
              Aktív állások
            </div>

            <h1 className="mt-4 text-[36px] font-black tracking-[-0.05em] text-slate-900 sm:text-5xl lg:text-[58px] lg:leading-[1.02]">
              Találd meg a következő munkád
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Szűrj helyszín, munkatípus és kulcsszó szerint, majd jelentkezz gyorsan.
            </p>
          </div>

          <div className="relative mx-auto mb-10 mt-6 max-w-6xl z-50 overflow-visible lg:mb-16">
            <div className="group relative">
              <div className="absolute -inset-[3px] rounded-[38px] bg-gradient-to-r from-cyan-400/50 via-sky-300/40 to-blue-500/50 blur-[24px] transition-all duration-500 group-hover:opacity-100 opacity-60" />
              <div className="absolute -inset-[1px] rounded-[36px] bg-gradient-to-r from-cyan-300/70 via-white/80 to-blue-400/70 transition-all duration-500 group-hover:opacity-100 opacity-80" />

              <div className="relative rounded-[34px] border border-white/95 bg-white/95 p-4 shadow-[0_34px_100px_rgba(14,165,233,0.22)] backdrop-blur-2xl sm:p-5">
                <div className="grid gap-3 lg:grid-cols-[1fr_210px_210px_170px_115px]">
                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                      <SearchIcon />
                    </div>
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Keresés pozíció, cég vagy bér alapján..."
                      className="h-14 w-full rounded-2xl border border-slate-200/90 bg-white pl-12 pr-4 text-sm font-semibold text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-slate-400 hover:border-sky-200 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <CustomSelect
                    label="Munkatípus"
                    value={selectedJobType}
                    onChange={(value) => setSelectedJobType(value as JobTypeFilter)}
                    options={[
                      { value: "Összes", label: "Fizikai / szellemi" },
                      { value: "Fizikai", label: "Fizikai munka" },
                      { value: "Szellemi", label: "Szellemi munka" },
                    ]}
                  />

                  <CustomSelect
                    label="Helyszín"
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    options={locations.map((loc) => ({ value: loc, label: loc }))}
                  />

                  <CustomSelect
                    label="Rendezés"
                    value={sortBy}
                    onChange={(value) => setSortBy(value as SortOption)}
                    options={[
                      { value: "Legújabb", label: "Legújabb" },
                      { value: "Bér szerint", label: "Bér szerint" },
                      { value: "A-Z", label: "A-Z" },
                    ]}
                  />

                  <div className="flex h-14 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]">
                    {filteredJobs.length} állás
                  </div>
                </div>

                {(search ||
                  selectedLocation !== "Összes" ||
                  selectedJobType !== "Összes" ||
                  sortBy !== "Legújabb") && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="text-sm font-medium text-slate-500">
                      Aktív szűrés:{" "}
                      <span className="font-bold text-slate-800">
                        {filteredJobs.length} találat
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:text-slate-900"
                    >
                      Szűrők törlése
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        {filteredJobs.length > 0 ? (
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black tracking-[-0.03em] text-slate-900">
                Elérhető pozíciók
              </h2>
              <div className="hidden text-sm font-medium text-slate-500 sm:block">
                {filteredJobs.length} találat
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredJobs.map((job, index) => (
                <JobCard key={job.slug} job={job} featured={index === 0} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState onReset={resetFilters} />
        )}
      </section>
    </main>
  );
}