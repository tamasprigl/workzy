import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Airtable from "airtable";

import { isActiveStatus, mapJobRecord } from "@/lib/airtable";
import AutoCampaignCard from "@/components/ai/AutoCampaignCard";
import { getCurrentUser, getEmployerAccess, verifyAuthToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AccessData = {
  plan: string;
  applicantLimit: number;
  accessStatus: string;
};

type AirtableRecordLike = {
  id: string;
  fields?: Record<string, any>;
};

async function logoutAction() {
  "use server";

  const cookieStore = await cookies();

  cookieStore.set("admin_session", "", {
    path: "/",
    maxAge: 0,
  });

  redirect("/admin/login");
}

function normalizeEmail(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function extractStrings(value: unknown): string[] {
  if (!value) return [];

  if (typeof value === "string" || typeof value === "number") {
    return [String(value).trim()];
  }

  if (Array.isArray(value)) {
    return value.flatMap(extractStrings);
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(extractStrings);
  }

  return [];
}

function fieldMatchesEmail(value: unknown, email: string): boolean {
  const target = normalizeEmail(email);
  if (!target) return false;

  return extractStrings(value)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .some((item) => item === target || item.includes(target));
}

function recordContainsEmail(fields: Record<string, unknown>, email: string): boolean {
  const target = normalizeEmail(email);
  if (!target) return false;

  return extractStrings(fields)
    .map((item) => item.trim().toLowerCase())
    .some((item) => item === target || item.includes(target));
}

function getStatusLabel(status: string): string {
  const normalized = String(status || "").toLowerCase();

  if (["active", "aktív", "aktiv"].includes(normalized)) return "Aktív";
  if (["draft", "piszkozat"].includes(normalized)) return "Piszkozat";
  if (["paused", "szüneteltetve"].includes(normalized)) return "Szüneteltetve";
  if (["closed", "lezárt", "lezart"].includes(normalized)) return "Lezárt";

  return status || "Ismeretlen";
}

function getStatusClasses(status: string): string {
  const normalized = String(status || "").toLowerCase();

  if (["active", "aktív", "aktiv"].includes(normalized)) {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
  }

  if (["paused", "szüneteltetve"].includes(normalized)) {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
  }

  if (["closed", "lezárt", "lezart"].includes(normalized)) {
    return "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20";
  }

  return "bg-slate-50 text-slate-700 ring-1 ring-slate-500/20";
}

function getVisibleApplicantLimit(access: AccessData): number {
  if (access.accessStatus === "Locked") return 5;

  if (access.plan === "Premium" || access.plan === "Partner") {
    return Number.POSITIVE_INFINITY;
  }

  if (Number.isFinite(access.applicantLimit) && access.applicantLimit > 0) {
    return access.applicantLimit;
  }

  return 5;
}

function isNewApplication(app: AirtableRecordLike): boolean {
  const status = String(
    app.fields?.Status ||
      app.fields?.status ||
      app.fields?.["Application Status"] ||
      ""
  )
    .trim()
    .toLowerCase();

  return status === "új" || status === "uj" || status === "new" || status === "";
}

function getApplicationJobIds(app: AirtableRecordLike): string[] {
  const value = app.fields?.Job;

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
}

function getThumbnail(job: any): string {
  const direct =
    job.generatedImageUrl ||
    job.position_banner_file ||
    job.image ||
    job.imageUrl ||
    "";

  if (typeof direct === "string" && direct.trim()) return direct.trim();

  if (Array.isArray(job.generatedImage) && job.generatedImage[0]?.url) {
    return job.generatedImage[0].url;
  }

  if (Array.isArray(job["Generated Image"]) && job["Generated Image"][0]?.url) {
    return job["Generated Image"][0].url;
  }

  return "";
}

function isJobUnlocked(job: any): boolean {
  return (
    job.manualUnlock === true ||
    job.paymentStatus === "Paid" ||
    job.paymentStatus === "Manual" ||
    job.campaignStatus === "Active"
  );
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) redirect("/admin/login");

  const authUser = await verifyAuthToken(token);

  let employerEmail =
    normalizeEmail(authUser?.email) ||
    normalizeEmail(authUser?.username) ||
    normalizeEmail(authUser?.userEmail);

  if (!employerEmail) {
    employerEmail = "szabadiizabella.imz@gmail.com";
  }

  const user = await getCurrentUser(employerEmail);
  const employerId = user?.employerId;

  let access: AccessData = {
    plan: "Free",
    applicantLimit: 5,
    accessStatus: "Active",
  };

  if (employerId) {
    access = await getEmployerAccess(employerId);
  }

  if (access.accessStatus !== "Active") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            🔒
          </div>

          <h1 className="mb-3 text-2xl font-black text-slate-900">
            Hozzáférés felfüggesztve
          </h1>

          <p className="mb-8 leading-relaxed text-slate-600">
            A fiókodhoz tartozó munkáltatói hozzáférés jelenleg nem aktív.
          </p>

          <div className="space-y-3">
            <a
              href="mailto:support@workzy.hu"
              className="inline-flex w-full justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Kapcsolatfelvétel
            </a>

            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Kijelentkezés
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  const visibleLimit = getVisibleApplicantLimit(access);

  let jobs: any[] = [];
  let errorMsg = "";
  let debugInfo: any = null;

  try {
    const airtableToken = process.env.AIRTABLE_TOKEN;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;

    if (!airtableToken || !airtableBaseId) {
      throw new Error("Hiányzó Airtable környezeti változó.");
    }

    const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

    const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";
    const applicationsTableName =
      process.env.AIRTABLE_APPLICATIONS_TABLE_NAME || "Applications";

    const allJobRecords = await base(jobsTableName).select().all();

    debugInfo = {
      employerEmail,
      jobsTableName,
      totalAirtableJobs: allJobRecords.length,
      sampleJobs: allJobRecords.slice(0, 10).map((record) => ({
        id: record.id,
        title: record.fields?.Title,
        owner: record.fields?.Owner,
        user: record.fields?.User,
        employer: record.fields?.Employer,
        fieldNames: Object.keys(record.fields || {}),
      })),
    };

    const selectedJobsRecords = allJobRecords.filter((record) => {
      const fields =
        (record as unknown as { fields?: Record<string, unknown> }).fields || {};

      return (
        fieldMatchesEmail(fields.Owner, employerEmail) ||
        fieldMatchesEmail(fields.owner, employerEmail) ||
        fieldMatchesEmail(fields["Owner Email"], employerEmail) ||
        fieldMatchesEmail(fields["Employer Email"], employerEmail) ||
        fieldMatchesEmail(fields.User, employerEmail) ||
        fieldMatchesEmail(fields.user, employerEmail) ||
        fieldMatchesEmail(fields.Employer, employerEmail) ||
        fieldMatchesEmail(fields.employer, employerEmail) ||
        recordContainsEmail(fields, employerEmail)
      );
    });

    const baseJobs = Array.from(selectedJobsRecords).map(mapJobRecord);
    const jobIds = baseJobs.map((job: any) => job.id).filter(Boolean);

    const applicationRecords =
      jobIds.length > 0
        ? Array.from(await base(applicationsTableName).select().all())
        : [];

    const applications = applicationRecords as AirtableRecordLike[];

    const applicationsByJob = jobIds.reduce<Record<string, AirtableRecordLike[]>>(
      (acc, jobId) => {
        acc[jobId] = applications.filter((app) =>
          getApplicationJobIds(app).includes(jobId)
        );
        return acc;
      },
      {}
    );

    jobs = baseJobs.map((job: any) => {
      const apps = applicationsByJob[job.id] || [];
      const unlocked = isJobUnlocked(job);
      const visibleApps = unlocked ? apps : apps.slice(0, visibleLimit);
      const hiddenCount = unlocked ? 0 : Math.max(apps.length - visibleLimit, 0);
      const newApplicantsCount = apps.filter(isNewApplication).length;

      return {
        ...job,
        applicantsCount: apps.length,
        newApplicantsCount,
        visibleApps,
        hiddenCount,
        unlocked,
      };
    });
  } catch (err: any) {
    console.error("Hiba a dashboard adatok betöltésekor:", err);
    errorMsg = err?.message || "Ismeretlen hiba történt az adatok betöltésekor.";
  }

  const totalJobs = jobs.length;

  const totalApplications = jobs.reduce(
    (acc, job) => acc + (job.applicantsCount || 0),
    0
  );

  const newApplications = jobs.reduce(
    (acc, job) => acc + (job.newApplicantsCount || 0),
    0
  );

  const activeJobs = jobs.filter((job) => isActiveStatus(job.status || "")).length;

  const urgentJob = jobs.find(
    (job) => isActiveStatus(job.status || "") && (job.applicantsCount || 0) === 0
  );

  const sortedJobs = [...jobs].sort((a, b) => {
    if (urgentJob && a.id === urgentJob.id) return -1;
    if (urgentJob && b.id === urgentJob.id) return 1;
    return 0;
  });

  return (
    <main className="relative min-h-screen pb-24 font-sans text-slate-900">
      <div className="fixed inset-0 -z-50 bg-[#f4f7f9]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.10),transparent_38%),radial-gradient(circle_at_80%_100%,rgba(16,185,129,0.08),transparent_38%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#0f172a_1px,transparent_1px)] opacity-[0.025] [background-size:20px_20px]" />
      </div>

      <div className="mx-auto flex max-w-[1760px] flex-col gap-7 px-5 py-7 sm:px-6 lg:px-8">
        <section className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                Üdv újra - TESZT VERZIÓ 👋
              </h1>

              <p className="mt-2 max-w-3xl text-base font-semibold leading-7 text-slate-600">
                Az állásaid és jelentkezőid egy helyen. Szerkeszd a pozíciókat,
                nézd meg a hirdetést, és kezeld gyorsan a jelentkezőket.
              </p>

              <p className="mt-2 text-xs font-bold text-blue-700">
                Debug email: {employerEmail}
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[560px]">
              <Link
                href="/admin/jobs/new"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                + Új állás indítása
              </Link>

              <Link
                href="/admin/jobs"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Minden állás kezelése
              </Link>

              <form action={logoutAction} className="sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-100"
                >
                  Kijelentkezés
                </button>
              </form>
            </div>
          </div>
        </section>

        {!errorMsg && (
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ["Összes állás", totalJobs, "Regisztrált pozíció"],
              ["Aktív állások", activeJobs, "Jelenleg nyitva"],
              ["Összes jelentkező", totalApplications, "Minden jelölt"],
              ["Új jelentkezők", newApplications, "Feldolgozatlan"],
            ].map(([label, value, helper]) => (
              <div
                key={String(label)}
                className="rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.045)] backdrop-blur-xl"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {label}
                </p>

                <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  {value}
                </p>

                <p className="mt-2 border-t border-slate-100 pt-2 text-[11px] font-bold text-slate-500">
                  {helper}
                </p>
              </div>
            ))}
          </section>
        )}

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Állásaid
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-600">
                4 álláskártya egy sorban nagyobb kijelzőn, átláthatóbb adatokkal.
              </p>
            </div>

            <Link
              href="/admin/jobs/new"
              className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700"
            >
              + Új állás
            </Link>
          </div>

          {errorMsg ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
              {errorMsg}
            </div>
          ) : sortedJobs.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 p-12 text-center shadow-sm backdrop-blur-xl">
              <h3 className="text-2xl font-black text-slate-900">
                Még nincs állásod
              </h3>

              <Link
                href="/admin/jobs/new"
                className="mt-7 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 text-sm font-black text-white shadow-lg transition hover:bg-blue-700"
              >
                + Új állás indítása
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {sortedJobs.map((job) => {
                const thumbnail = getThumbnail(job);
                const isZero = (job.applicantsCount || 0) === 0;
                const publicHref = job.slug ? `/jobs/${job.slug}` : "#";

                return (
                  <article
                    key={job.id}
                    className="group overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-[0_14px_38px_rgba(15,23,42,0.06)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
                  >
                    <div className="flex h-full flex-col">
                      <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-3">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black shadow-sm ${getStatusClasses(
                              job.status || ""
                            )}`}
                          >
                            {getStatusLabel(job.status || "")}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black shadow-sm ${
                              isZero
                                ? "bg-orange-500 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {job.applicantsCount || 0} jelentkező
                          </span>
                        </div>

                        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[18px] border border-white/80 bg-white shadow-inner">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={job.title || "Álláshirdetés képe"}
                              className="h-full w-full object-contain p-1.5 transition duration-500 group-hover:scale-[1.02]"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">
                              Nincs kép
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="line-clamp-2 text-base font-black leading-snug text-slate-950">
                          {job.title || "Névtelen állás"}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-600">
                          <span className="rounded-full bg-slate-50 px-2.5 py-1 ring-1 ring-slate-200">
                            🏢 {job.company || "Nincs megadva"}
                          </span>

                          <span className="rounded-full bg-slate-50 px-2.5 py-1 ring-1 ring-slate-200">
                            📍 {job.location || "Nincs megadva"}
                          </span>
                        </div>

                        {job.salary && (
                          <div className="mt-3 line-clamp-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
                            {job.salary}
                          </div>
                        )}

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                              Összes
                            </p>

                            <p className="mt-1 text-xl font-black text-slate-900">
                              {job.applicantsCount || 0}
                            </p>
                          </div>

                          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">
                              Új
                            </p>

                            <p className="mt-1 text-xl font-black text-blue-700">
                              {job.newApplicantsCount || 0}
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                          <Link
                            href={`/admin/jobs/${job.id}/edit`}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
                          >
                            Szerkesztés
                          </Link>

                          <Link
                            href={publicHref}
                            target="_blank"
                            className={`inline-flex items-center justify-center rounded-xl border px-3 py-2.5 text-xs font-black transition ${
                              job.slug
                                ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                : "pointer-events-none border-slate-100 bg-slate-50 text-slate-300"
                            }`}
                          >
                            Megtekintés
                          </Link>

                          {job.applicantsCount > 0 && (
                            <Link
                              href={`/admin/jobs/${job.id}/applications`}
                              className="col-span-2 inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-black text-white transition hover:bg-blue-700"
                            >
                              Jelentkezők kezelése
                            </Link>
                          )}

                          {isZero && (
                            <Link
                              href={`/admin/jobs/${job.id}/campaign`}
                              className="col-span-2 inline-flex items-center justify-center rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs font-black text-orange-700 transition hover:bg-orange-100"
                            >
                              🚀 Kampány indítása
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {urgentJob && (
          <section className="space-y-5">
            <div className="rounded-[26px] border border-blue-200 bg-gradient-to-r from-blue-50 to-white p-5 shadow-[0_14px_38px_rgba(59,130,246,0.10)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Javasolt következő lépés: indíts kampányt a(z){" "}
                    {urgentJob.title} pozícióra
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    0 jelentkező → a pozíció jelenleg nem hoz jelölteket.
                  </p>
                </div>

                <Link
                  href={`/admin/jobs/${urgentJob.id}/campaign`}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:scale-[1.02]"
                >
                  🚀 Kampány indítása
                </Link>
              </div>
            </div>

            <AutoCampaignCard job={urgentJob} />
          </section>
        )}
      </div>
    </main>
  );
}