import Airtable from "airtable";
import Link from "next/link";
import StatusUpdater from "./StatusUpdater";
import { getCurrentAirtableUser } from "@/lib/current-airtable-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        airtableRecords = await base(tableName)
          .select({
            filterByFormula: `FIND("${userId}", ARRAYJOIN({User}))`,
            sort: [{ field: "Created", direction: "desc" }],
          })
          .all();
      } catch {
        airtableRecords = await base(tableName).select({
          filterByFormula: `FIND("${userId}", ARRAYJOIN({User}))`
        }).all();
      }

      allRecords = airtableRecords.map((record: any) => ({
        id: record.id,
        jobTitle: record.get("Job Title") || "Ismeretlen pozíció",
        fullName: record.get("Full Name") || "Névtelen",
        email: record.get("Email") || "",
        phone: record.get("Phone") || "",
        status: record.get("Status") || "Új",
        access: record.get("Access") || "Visible",
        cv: record.get("CV") || null,
      }));
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
    <>
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mt-4">
            Jelentkezések
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Az összes beérkezett jelentkezés áttekintése és kezelése.
          </p>
        </div>

        <Link
          href="/admin/jobs"
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Vissza az állásokhoz
        </Link>
      </header>

      {lockedRecords.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            További jelentkezők érkeztek
          </h2>
          <p className="text-gray-300 mb-4">
            Jelenleg <span className="font-semibold text-amber-300">{lockedRecords.length}</span> zárolt jelentkeződ van,
            akik csak fizetős csomaggal tekinthetők meg.
          </p>
          <button className="bg-white text-black px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition">
            Előfizetés aktiválása
          </button>
        </div>
      )}

      <form
        method="GET"
        className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-end"
      >
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-2">Státusz</label>
          <select
            name="status"
            defaultValue={selectedStatus}
            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-xl outline-none"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-2">Állás</label>
          <select
            name="job"
            defaultValue={selectedJob}
            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-xl outline-none"
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
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Szűrés
          </button>

          <Link
            href="/admin/applications"
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Törlés
          </Link>
        </div>
      </form>

      {fetchError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-white mb-2">Adatelérési hiba</h2>
          <p className="text-red-400/80 max-w-md mx-auto">
            Nem sikerült betölteni a jelentkezéseket az Airtable rendszerből.
          </p>
          <p className="text-gray-500 text-sm mt-2">{errorMessage}</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-16 text-center flex flex-col items-center justify-center mt-8">
          <h2 className="text-xl font-semibold text-white mb-2">Nincs találat</h2>
          <p className="text-gray-500">
            A kiválasztott szűrőkkel nincs megjeleníthető jelentkezés.
          </p>
        </div>
      ) : (
        <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800/80 bg-gray-900/30 text-gray-400 text-sm font-medium">
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Jelentkező</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Pozíció</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Elérhetőség</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Önéletrajz</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Státusz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-800/20 transition-colors group">
                    <td className="px-6 py-5">
                      <Link href={`/admin/applications/${record.id}`} className="group/link flex items-center gap-2 w-max">
                        <div className="font-semibold text-gray-100 text-base group-hover/link:text-blue-400 transition-colors">
                          {record.fullName}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover/link:text-blue-400 transition-all opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Link>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-blue-400 font-medium inline-flex items-center gap-1.5">
                        {record.jobTitle}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        {record.email ? (
                          <div className="text-sm text-gray-300">
                            <a href={`mailto:${record.email}`} className="hover:text-blue-400 transition-colors">
                              {record.email}
                            </a>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">Nincs e-mail</div>
                        )}

                        {record.phone ? (
                          <div className="text-sm text-gray-300">
                            <a href={`tel:${record.phone}`} className="hover:text-amber-400 transition-colors">
                              {record.phone}
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {record.cv && Array.isArray(record.cv) && record.cv.length > 0 ? (
                        <a
                          href={record.cv[0].url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-colors border border-gray-700"
                        >
                          Megtekintés
                        </a>
                      ) : (
                        <span className="text-gray-600 text-sm italic">Nincs megadva</span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <StatusUpdater recordId={record.id} initialStatus={record.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}