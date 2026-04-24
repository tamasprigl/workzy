import Airtable from "airtable";
import Link from "next/link";
import PipelineBoard from "./PipelineBoard";
import { getCurrentAirtableUser } from "@/lib/current-airtable-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/78 px-4 py-2 text-sm font-medium text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] backdrop-blur-md">
      <span className="inline-block h-2 w-2 rounded-full bg-cyan-400/80" />
      {children}
    </div>
  );
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; job?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const selectedStatus = resolvedSearchParams.status || "Összes";
  const selectedJob = resolvedSearchParams.job || "Összes";

  let allRecords: any[] = [];
  let fetchError = false;
  let errorMessage = "";

  try {
    const userId = await getCurrentAirtableUser();

    if (userId) {
      const token = process.env.AIRTABLE_TOKEN;
      const baseId = process.env.AIRTABLE_BASE_ID;
      const tableName = process.env.AIRTABLE_APPLICATIONS_TABLE_NAME;

      if (!token || !baseId || !tableName) {
        throw new Error("Missing Airtable configuration.");
      }

      const base = new Airtable({ apiKey: token }).base(baseId);

      let airtableRecords: any[] = [];

      try {
        airtableRecords = [
          ...(await base(tableName)
            .select({
              filterByFormula: `FIND("${userId}", ARRAYJOIN({User}))`,
              sort: [{ field: "Created", direction: "desc" }],
            })
            .all()),
        ];
      } catch {
        airtableRecords = [
          ...(await base(tableName)
            .select({
              filterByFormula: `FIND("${userId}", ARRAYJOIN({User}))`,
            })
            .all()),
        ];
      }

      allRecords = airtableRecords.map((record: any) => {
        const rawDate = record.get("Created") || record._rawJson?.createdTime || Date.now();
        const createdDate = new Intl.DateTimeFormat("hu-HU", { month: "2-digit", day: "2-digit" }).format(new Date(rawDate));
        
        return {
          id: record.id,
          jobTitle: record.get("Job Title") || "Ismeretlen pozíció",
          fullName: record.get("Full Name") || "Névtelen",
          email: record.get("Email") || "",
          phone: record.get("Phone") || "",
          status: record.get("Status") || "Új",
          access: record.get("Access") || "Visible",
          cv: record.get("CV") || null,
          createdDate,
        }
      });
    }
  } catch (err: any) {
    console.error("❌ Airtable hiba:", err);
    fetchError = true;
    errorMessage = err?.message || "Ismeretlen hiba történt.";
  }

  const visibleRecords = allRecords.filter((r) => r.access !== "Locked");
  const lockedRecords = allRecords.filter((r) => r.access === "Locked");

  let filteredRecords = visibleRecords;

  if (selectedStatus !== "Összes") {
    filteredRecords = filteredRecords.filter((r) => r.status === selectedStatus);
  }

  if (selectedJob !== "Összes") {
    filteredRecords = filteredRecords.filter((r) => r.jobTitle === selectedJob);
  }

  const uniqueJobs = Array.from(new Set(visibleRecords.map((r) => r.jobTitle))).sort();
  const statuses = ["Összes", "Új", "Feldolgozás alatt", "Felvéve", "Elutasítva"];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f7f9] text-slate-900">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#f4f7f9]" />
        <div className="absolute left-[-120px] top-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-200/34 blur-[110px]" />
        <div className="absolute right-[-120px] top-[40px] h-[340px] w-[340px] rounded-full bg-sky-200/28 blur-[120px]" />
        <div className="absolute bottom-[-140px] left-[35%] h-[320px] w-[320px] rounded-full bg-emerald-100/28 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.70))]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <SectionTag>Jelentkezők csővezetéke</SectionTag>
            <h1 className="mt-6 text-[42px] font-black tracking-[-0.05em] text-slate-950 lg:text-[56px]">
              Jelentkezések
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-500">
              Kezeld a jelentkezőket egy modern drag-and-drop felületen.
            </p>
          </div>

          <Link
            href="/admin/jobs"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/90 bg-white/86 px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-md transition hover:bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Vissza az állásokhoz
          </Link>
        </header>

        {lockedRecords.length > 0 && (
          <div className="mb-6 rounded-[28px] border border-amber-200 bg-[linear-gradient(180deg,rgba(255,251,235,0.98),rgba(254,243,199,0.75))] p-6 shadow-[0_16px_34px_rgba(251,191,36,0.08)]">
            <h2 className="text-xl font-semibold text-slate-900">
              További jelentkezők érkeztek
            </h2>
            <p className="mt-2 text-slate-600">
              Jelenleg{" "}
              <span className="font-semibold text-amber-700">{lockedRecords.length}</span>{" "}
              zárolt jelentkeződ van, akik csak fizetős csomaggal tekinthetők meg.
            </p>
            <button className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(14,165,233,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(14,165,233,0.32)]">
              Előfizetés aktiválása
            </button>
          </div>
        )}

        <form
          method="GET"
          className="mb-6 rounded-[28px] border border-white/85 bg-white/82 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md"
        >
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Státusz
              </label>
              <select
                name="status"
                defaultValue={selectedStatus}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Állás
              </label>
              <select
                name="job"
                defaultValue={selectedJob}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
              >
                <option value="Összes">Összes állás</option>
                {uniqueJobs.map((job) => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(14,165,233,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(14,165,233,0.32)]"
              >
                Szűrés
              </button>

              <Link
                href="/admin/applications"
                className="inline-flex rounded-2xl border border-white/90 bg-white/86 px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:bg-white"
              >
                Törlés
              </Link>
            </div>
          </div>
        </form>

        {fetchError ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center shadow-[0_16px_34px_rgba(239,68,68,0.06)]">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">Adatelérési hiba</h2>
            <p className="mx-auto max-w-md text-red-600">
              Nem sikerült betölteni a jelentkezéseket az Airtable rendszerből.
            </p>
            <p className="mt-2 text-sm text-slate-500">{errorMessage}</p>
          </div>
        ) : (
          <PipelineBoard initialRecords={filteredRecords} />
        )}
      </div>
    </main>
  );
}