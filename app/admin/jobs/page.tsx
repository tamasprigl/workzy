import Link from "next/link";
import Airtable from "airtable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminJobsPage() {
  let jobsList: any[] = [];
  let fetchError = false;

  try {
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_JOBS_TABLE_NAME;

    if (!token || !baseId || !tableName) {
      throw new Error("Hiányzó Airtable konfiguráció");
    }

    const base = new Airtable({ apiKey: token }).base(baseId);
    
    // Lekérdezzük az állásokat csökkenő sorrendben a készítés ideje szerint
    const records = await base(tableName).select({
       sort: [{ field: "Created", direction: "desc" }]
    }).all().catch(async () => {
       return await base(tableName).select().all();
    });

    jobsList = records.map((record: any) => ({
      id: record.id,
      title: record.get("Title") || "Ismeretlen pozíció",
      slug: record.get("Slug") || "n-a",
      company: record.get("Company") || "Nincs cég",
      location: record.get("Location") || "Nincs megadva",
      status: record.get("Status") || "draft",
    }));
    
  } catch (err: any) {
    console.error("❌ Hiba az Airtable Állások letöltésekor:", err.message || err);
    fetchError = true;
  }

  return (
    <>
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mt-4">Állások</h1>
          <p className="text-gray-400 mt-2 text-lg">Kezelje a meghirdetett pozíciókat az Airtable-ben.</p>
        </div>
        
        <Link href="/admin/jobs/new" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shrink-0 shadow-lg shadow-blue-500/20">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
           Új állás meghirdetése
        </Link>
      </header>

      {fetchError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-4 opacity-80"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <h2 className="text-xl font-semibold text-white mb-2">Adatelérési hiba</h2>
          <p className="text-red-400/80 max-w-md mx-auto">Nem sikerült betölteni a munkalehetőségeket az Airtable rendszerből.</p>
        </div>
      ) : jobsList.length === 0 ? (
        <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-16 text-center flex flex-col items-center justify-center mt-8">
          <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Nincsenek aktív állások</h2>
          <p className="text-gray-500 mb-6">Még nincs megjeleníthető hirdetés az Airtable tábládban.</p>
          <Link href="/admin/jobs/new" className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors">
            Első állás létrehozása
          </Link>
        </div>
      ) : (
        <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800/80 bg-gray-900/30 text-gray-400 text-sm font-medium">
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Pozíció neve</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Cég</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Helyszín</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Státusz</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {jobsList.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-100">{job.title}</div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">{job.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        {job.company}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {job.location}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        job.status === "active" || job.status === "Aktív" || job.status === "aktiv"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : job.status === "closed" || job.status === "Lezárt"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-gray-800/50 text-gray-400 border-gray-700"
                      }`}>
                        {(job.status === "active" || job.status === "Aktív" || job.status === "aktiv") && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/jobs/${job.id}/edit`} className="text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                        Módosítás
                      </Link>
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
