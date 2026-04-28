import Link from "next/link";
import Airtable from "airtable";
import { redirect } from "next/navigation";
import { getCurrentAirtableUser } from "@/lib/current-airtable-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type JobItem = {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  applicationsCount: number;
  href: string;
};

function text(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function lower(value: unknown): string {
  return text(value).toLowerCase();
}

function extractStrings(value: unknown): string[] {
  if (!value) return [];

  if (typeof value === "string" || typeof value === "number") {
    return [text(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap(extractStrings);
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(extractStrings);
  }

  return [];
}

function fieldMatches(value: unknown, targets: string[]) {
  const haystack = extractStrings(value)
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  const needles = targets
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  return haystack.some((item) =>
    needles.some((target) => item === target || item.includes(target))
  );
}

function firstString(value: unknown): string {
  return extractStrings(value)[0] || "";
}

function getStatusLabel(status: string): string {
  const normalized = status.toLowerCase();

  if (["active", "aktív", "aktiv"].includes(normalized)) return "Aktív";
  if (["draft", "piszkozat"].includes(normalized)) return "Piszkozat";
  if (["paused", "szüneteltetve"].includes(normalized)) return "Szüneteltetve";
  if (["closed", "lezárt"].includes(normalized)) return "Lezárt";

  return status || "Ismeretlen";
}

function getStatusClasses(status: string): string {
  const normalized = status.toLowerCase();

  if (["active", "aktív", "aktiv"].includes(normalized)) {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";
  }

  if (["paused", "szüneteltetve"].includes(normalized)) {
    return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
  }

  if (["closed", "lezárt"].includes(normalized)) {
    return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20";
  }

  return "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-500/20";
}

async function getEmailFromRecord(
  base: Airtable.Base,
  tableName: string,
  recordId: string
) {
  try {
    const record = await base(tableName).find(recordId);
    const fields =
      (record as unknown as { fields?: Record<string, unknown> }).fields || {};

    return (
      lower(fields.Email) ||
      lower(fields["E-mail"]) ||
      lower(fields["Email Address"]) ||
      lower(fields.User) ||
      lower(fields.Owner)
    );
  } catch {
    return "";
  }
}

export default async function AdminJobsPage() {
  const currentUser = await getCurrentAirtableUser();

  const currentUserObject =
    currentUser && typeof currentUser === "object"
      ? (currentUser as Record<string, unknown>)
      : {};

  const currentUserRaw =
    typeof currentUser === "string"
      ? currentUser
      : text(currentUserObject.email) ||
        text(currentUserObject.id) ||
        text(currentUserObject.recordId) ||
        "";

  if (!currentUserRaw) {
    redirect("/admin/login");
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";
  const employersTableName =
    process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";
  const usersTableName = process.env.AIRTABLE_USERS_TABLE_NAME || "Users";

  if (!token || !baseId) {
    return <main>Hiányzik az Airtable konfiguráció.</main>;
  }

  const base = new Airtable({ apiKey: token }).base(baseId);

  let jobs: JobItem[] = [];
  let errorMessage = "";

  const currentRecordId = currentUserRaw.startsWith("rec") ? currentUserRaw : "";

  let currentEmail = currentUserRaw.includes("@") ? lower(currentUserRaw) : "";

  if (!currentEmail && currentRecordId) {
    currentEmail =
      (await getEmailFromRecord(base, usersTableName, currentRecordId)) ||
      (await getEmailFromRecord(base, employersTableName, currentRecordId));
  }

  const targets = [currentUserRaw, currentRecordId, currentEmail].filter(Boolean);

  try {
    const records = await base(jobsTableName).select().all();

    const filteredRecords = records.filter((record) => {
      const fields =
        (record as unknown as { fields?: Record<string, unknown> }).fields || {};

      return (
        fieldMatches(fields.Owner, targets) ||
        fieldMatches(fields.User, targets) ||
        fieldMatches(fields.Employer, targets) ||
        fieldMatches(fields["Created By"], targets) ||
        fieldMatches(fields["Company Record"], targets) ||
        fieldMatches(fields.Magiclinks, targets)
      );
    });

    jobs = filteredRecords.map((record) => {
      const fields =
        (record as unknown as { fields?: Record<string, unknown> }).fields || {};

      return {
        id: record.id,
        title: firstString(fields.Title) || "Névtelen állás",
        company:
          firstString(fields.Company) ||
          firstString(fields["Company Name"]) ||
          "Nincs megadva",
        location:
          firstString(fields["Campaign Target Location"]) ||
          firstString(fields.Location) ||
          "Nincs megadva",
        status: firstString(fields.Status) || "draft",
        applicationsCount: extractStrings(fields.Applications).length,
        href: `/admin/jobs/${record.id}/edit`,
      };
    });
  } catch (error) {
    console.error("Admin jobs load error:", error);
    errorMessage =
      error instanceof Error
        ? error.message
        : "Nem sikerült betölteni az állásokat.";
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Állások
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Kezeld a toborzási kampányaidat
            </p>
          </div>

          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Új állás meghirdetése
          </Link>
        </div>

        {errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-red-700">Hiba történt</h2>
            <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Még nincs állásod
            </h2>

            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
              Indíts el egy kampányt 1 perc alatt, és találd meg a legjobb
              jelentkezőket könnyedén.
            </p>

            <Link
              href="/admin/jobs/new"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              + Új állás létrehozása
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={job.href}
                className="group relative flex min-h-[360px] cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-semibold leading-tight text-slate-900 group-hover:text-sky-600">
                    {job.title}
                  </h3>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium shadow-sm ${getStatusClasses(
                      job.status
                    )}`}
                  >
                    {getStatusLabel(job.status)}
                  </span>
                </div>

                <div className="mb-10 flex flex-col gap-3">
                  <div className="text-sm text-slate-500">🏢 {job.company}</div>
                  <div className="text-sm text-slate-500">📍 {job.location}</div>
                </div>

                <div className="mb-10 flex flex-col">
                  <span className="text-5xl font-bold leading-none text-sky-600">
                    {job.applicationsCount}
                  </span>
                  <span className="mt-1 text-xs uppercase tracking-widest text-slate-400">
                    Jelentkezők
                  </span>
                </div>

                <div className="mt-auto border-t border-slate-100 pt-6">
                  <div className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition group-hover:bg-blue-700">
                    Állás szerkesztése
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}