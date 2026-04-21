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
      return "Aktív";
    case "draft":
      return "Piszkozat";
    case "paused":
      return "Szüneteltetve";
    case "closed":
      return "Lezárt";
    default:
      return status || "Ismeretlen";
  }
}

function getStatusClasses(status: string): string {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "active":
      return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30";
    case "draft":
      return "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30";
    case "paused":
      return "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30";
    case "closed":
      return "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30";
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
      <main className="min-h-screen bg-[#020817] text-white p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h1 className="text-2xl font-semibold">Állások</h1>
            <p className="mt-3 text-sm text-red-200">
              Hiányzik az Airtable konfiguráció. Ellenőrizd a következő env
              változókat:
            </p>
            <div className="mt-4 space-y-2 text-sm text-red-100">
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
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="mx-auto max-w-6xl p-6 md:p-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Állások</h1>
            <p className="mt-2 text-sm text-slate-400">
              A bejelentkezett felhasználóhoz tartozó álláshirdetések.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Bejelentkezett email: {currentEmail}
            </p>
          </div>

          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            + Új állás meghirdetése
          </Link>
        </div>

        {fetchError ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h2 className="text-lg font-semibold text-red-200">Hiba történt</h2>
            <p className="mt-2 text-sm text-red-100">{fetchError}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#06101f] px-6 py-14 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80 text-2xl">
                📄
              </div>
              <h2 className="text-2xl font-semibold">Nincsenek állások</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Ehhez az email címhez jelenleg nincs hozzárendelt álláshirdetés.
              </p>
              <p className="mt-2 text-xs text-slate-500">{currentEmail}</p>

              <div className="mt-6">
                <Link
                  href="/admin/jobs/new"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-600"
                >
                  Első állás létrehozása
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#06101f]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-900/40">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Pozíció
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Cég
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Helyszín
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Státusz
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Jelentkezések
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Létrehozva
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Frissítve
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Művelet
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-900/30">
                      <td className="px-5 py-4">
                        <div className="font-medium text-white">{job.title}</div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        {job.company}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        {job.location}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            job.status
                          )}`}
                        >
                          {getStatusLabel(job.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        {job.applicationsCount}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {job.createdAt || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {job.updatedAt || "-"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={job.href}
                          className="inline-flex rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                        >
                          Megnyitás
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}