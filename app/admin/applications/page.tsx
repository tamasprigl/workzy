import Airtable from "airtable";
import Link from "next/link";
import StatusUpdater from "./StatusUpdater";
// Next.js Server Component options to make sure it runs dynamically and avoids stale data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminApplicationsPage() {
  let records: any[] = [];
  let fetchError = false;

  try {
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_APPLICATIONS_TABLE_NAME;

    if (!token || !baseId || !tableName) {
      throw new Error("Missing exact Airtable configuration variables.");
    }

    const base = new Airtable({ apiKey: token }).base(baseId);

    // Fetch records, mapping all records back
    const airtableRecords = await base(tableName).select({
      sort: [{ field: "Created", direction: "desc" }] // Typically created time, if this fails it will just fall back smoothly below.
    }).all().catch(async () => {
      // If "Created" sort fails because field doesn't exist, fetch without sorting
      return await base(tableName).select().all();
    });

    // Clean up mapping
    records = airtableRecords.map((record: any) => ({
      id: record.id,
      jobTitle: record.get("Job Title") || "Ismeretlen pozíció",
      fullName: record.get("Full Name") || "Névtelen Jelentkező",
      email: record.get("Email") || "",
      phone: record.get("Phone") || "",
      status: record.get("Status") || "Új",
      cv: record.get("CV") || null, // Expecting Airtable Attachment array
    }));

  } catch (err: any) {
    console.error("❌ Hiba az Airtable Jelentkezések letöltésekor:", err.message || err);
    fetchError = true;
  }

  return (
    <>
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mt-4">Jelentkezések</h1>
          <p className="text-gray-400 mt-2 text-lg">Az összes beérkezett jelentkezés áttekintése és kezelése.</p>
        </div>
        
        <Link href="/admin/jobs" className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shrink-0">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           Vissza az állásokhoz
        </Link>
      </header>

      {fetchError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-4 opacity-80"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <h2 className="text-xl font-semibold text-white mb-2">Adatelérési hiba</h2>
          <p className="text-red-400/80 max-w-md mx-auto">Nem sikerült betölteni a jelentkezéseket az Airtable rendszerből. Kérlek, ellenőrizd a beállításokat, vagy próbáld újra később.</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-16 text-center flex flex-col items-center justify-center mt-8">
          <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Nincsenek jelentkezők</h2>
          <p className="text-gray-500">Jelenleg egyetlen jelentkezés sem található az adatbázisban.</p>
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
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-800/20 transition-colors group">
                    <td className="px-6 py-5">
                      <Link href={`/admin/applications/${record.id}`} className="group/link flex items-center gap-2 w-max">
                        <div className="font-semibold text-gray-100 text-base group-hover/link:text-blue-400 transition-colors">{record.fullName}</div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover/link:text-blue-400 transition-all opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-blue-400 font-medium inline-flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        {record.jobTitle}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        {record.email ? (
                          <div className="text-sm text-gray-300 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                             <a href={`mailto:${record.email}`} className="hover:text-blue-400 transition-colors">{record.email}</a>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                             Nincs e-mail
                          </div>
                        )}
                        {record.phone ? (
                          <div className="text-sm text-gray-300 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                             <a href={`tel:${record.phone}`} className="hover:text-amber-400 transition-colors">{record.phone}</a>
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
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
