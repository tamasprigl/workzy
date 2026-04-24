import Link from "next/link";
import Airtable from "airtable";
import { redirect } from "next/navigation";
import { getCurrentAirtableUser } from "@/lib/current-airtable-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AirtableFieldValue =
  | string
  | number
  | boolean
  | string[]
  | null
  | undefined;

type JobItem = {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  applicationsCount: number;
  href: string;
};

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function normalizeLower(value: unknown): string {
  return normalizeString(value).toLowerCase();
}

function getFirstString(value: unknown): string {
  if (typeof value === "string") return value.trim();

  if (Array.isArray(value)) {
    const firstString = value.find((item) => typeof item === "string");
    return typeof firstString === "string" ? firstString.trim() : "";
  }

  return "";
}

function getStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function formatDate(value: unknown): string {
  const raw = normalizeString(value);
  if (!raw) return "";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getStatusLabel(status: string): string {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "active":
    case "aktív":
    case "aktiv":
      return "Aktív";
    case "draft":
    case "piszkozat":
      return "Piszkozat";
    case "paused":
    case "szüneteltetve":
      return "Szüneteltetve";
    case "closed":
    case "lezárt":
      return "Lezárt";
    default:
      return status || "Ismeretlen";
  }
}

function getStatusClasses(status: string): string {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "active":
    case "aktív":
    case "aktiv":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";
    case "draft":
    case "piszkozat":
      return "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-500/20";
    case "paused":
    case "szüneteltetve":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
    case "closed":
    case "lezárt":
      return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20";
    default:
      return "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-500/20";
  }
}

function matchesCurrentUser(userField: unknown, currentEmail: string): boolean {
  if (!currentEmail) return false;

  if (typeof userField === "string") {
    return normalizeLower(userField) === currentEmail;
  }

  if (Array.isArray(userField)) {
    return userField.some((item) => normalizeLower(item) === currentEmail);
  }

  return false;
}

export default async function AdminJobsPage() {
  const currentUser = await getCurrentAirtableUser();

  const currentEmail =
    normalizeLower(
      typeof currentUser === "string"
        ? currentUser
        : currentUser && typeof currentUser === "object" && "email" in currentUser
        ? (currentUser as { email?: string }).email
        : ""
    ) || "";

  if (!currentEmail) {
    redirect("/admin/login");
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-rose-900">Állások</h1>
            <p className="mt-2 text-sm text-rose-700">
              Hiányzik az Airtable konfiguráció. Ellenőrizd a következő env
              változókat:
            </p>
            <div className="mt-4 space-y-2 text-sm font-mono text-rose-800 bg-rose-100/50 p-3 rounded-lg inline-block">
              <div>AIRTABLE_TOKEN</div>
              <div>AIRTABLE_BASE_ID</div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  Airtable.configure({ apiKey: token });
  const base = Airtable.base(baseId);

  let jobs: JobItem[] = [];
  let fetchError = "";

  try {
    const records = await base("Jobs")
      .select({
        sort: [{ field: "Created", direction: "desc" }],
      })
      .all();

    const filteredRecords = records.filter((record) =>
      matchesCurrentUser(record.get("User"), currentEmail)
    );

    jobs = filteredRecords.map((record) => {
      const title =
        getFirstString(record.get("Title")) ||
        getFirstString(record.get("Job Title")) ||
        "Névtelen állás";

      const company =
        getFirstString(record.get("Company")) ||
        getFirstString(record.get("Company Name")) ||
        "Nincs megadva";

      const location =
        getFirstString(record.get("Campaign Target Location")) ||
        getFirstString(record.get("Location")) ||
        "Nincs megadva";

      const status = getFirstString(record.get("Status")) || "draft";

      const applications = getStringArray(record.get("Applications"));

      return {
        id: record.id,
        title,
        company,
        location,
        status,
        createdAt: formatDate(record.get("Created")),
        updatedAt: formatDate(record.get("Updated time")),
        applicationsCount: applications.length,
        href: `/admin/jobs/${record.id}`,
      };
    });
  } catch (error) {
    console.error("Hiba az admin állások betöltésekor:", error);
    fetchError = "Nem sikerült betölteni az állásokat az Airtable-ből.";
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Állások</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Kezeld a toborzási kampányaidat
            </p>
            <p className="mt-1 text-xs text-slate-400">
             {currentEmail}
            </p>
          </div>

          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5"
          >
            + Új állás meghirdetése
          </Link>
        </div>

        {fetchError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-rose-900">Hiba történt</h2>
            <p className="mt-2 text-sm text-rose-700">{fetchError}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto max-w-md flex flex-col items-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Még nincs állásod</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 font-medium">
                Indíts el egy kampányt 1 perc alatt, és találd meg a legjobb jelentkezőket könnyedén.
              </p>

              <div className="mt-8">
                <Link
                  href="/admin/jobs/new"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5"
                >
                  + Új állás létrehozása
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <div key={job.id} className="group relative flex flex-col bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
                
                <div className="flex justify-between items-start mb-6 gap-4 relative z-0">
                  <h3 className="text-2xl font-semibold text-slate-900 leading-tight group-hover:text-sky-600 transition-colors pt-0.5">
                    <Link href={job.href} className="focus:outline-none before:absolute before:-inset-7 before:z-0 before:rounded-3xl">
                      {job.title}
                    </Link>
                  </h3>
                  <div className="flex flex-col items-end gap-2 shrink-0 relative z-10 pointer-events-none">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 shadow-sm ${getStatusClasses(job.status)}`}>
                      {getStatusLabel(job.status)}
                    </span>
                    {job.applicationsCount >= 5 && (
                      <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                        🔥 pörög
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-10 relative z-10 pointer-events-none">
                  <div className="flex items-center text-sm text-slate-500 gap-3">
                    <svg className="w-4 h-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span className="truncate font-medium">{job.company}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500 gap-3">
                    <svg className="w-4 h-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="truncate font-medium">{job.location}</span>
                  </div>
                </div>

                <div className="flex flex-col mb-10 relative z-10 pointer-events-none">
                  <span className="text-5xl font-bold text-sky-600 leading-none drop-shadow-sm">{job.applicationsCount}</span>
                  <span className="text-xs uppercase tracking-widest text-slate-400 mt-1">{job.applicationsCount === 1 ? 'Jelentkező' : 'Jelentkezők'}</span>
                </div>

                <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 font-medium tracking-wide mb-8 relative z-10 pointer-events-none">
                  {job.createdAt && <div>Létrehozva: <span className="text-slate-500">{job.createdAt}</span></div>}
                  {job.updatedAt && job.updatedAt !== job.createdAt && <div>Utolsó frissítés: <span className="text-slate-500">{job.updatedAt}</span></div>}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3 relative z-10">
                  <div className="flex gap-3">
                    <Link href={`/admin/jobs/${job.id}/applications`} className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-4 py-2.5 text-[13px] font-bold transition duration-200 hover:bg-blue-700 shadow-sm active:scale-95 focus:outline-none flex-1">
                       Jelentkezők kezelése
                    </Link>
                    <Link href={`/admin/jobs/${job.id}/edit`} className="inline-flex items-center justify-center rounded-xl bg-transparent text-slate-500 hover:text-slate-900 px-4 py-2.5 text-[13px] font-bold transition duration-200 hover:bg-slate-100 active:scale-95 focus:outline-none">
                      Szerkesztés
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href={`/admin/jobs/${job.id}/campaign`} className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-700 px-4 py-2 text-[13px] font-bold transition duration-200 hover:bg-sky-100 active:scale-95 focus:outline-none">
                      Kampány indítás ✨
                    </Link>
                    <span className="text-sm font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none pr-1">
                      Megnyitás →
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}