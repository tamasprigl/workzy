import Airtable from "airtable";
import Link from "next/link";
import StatusUpdater from "../StatusUpdater";

// Next.js Server Component options
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  let record: any = null;
  let fetchError = false;
  let notFound = false;

  try {
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_APPLICATIONS_TABLE_NAME;

    if (!token || !baseId || !tableName) {
      throw new Error("Missing exact Airtable configuration variables.");
    }

    const base = new Airtable({ apiKey: token }).base(baseId);

    // Fetch single record
    const airtableRecord = await base(tableName).find(id);
    
    if (!airtableRecord) {
      notFound = true;
    } else {
      record = {
        id: airtableRecord.id,
        jobTitle: airtableRecord.get("Job Title") || "Ismeretlen pozíció",
        fullName: airtableRecord.get("Full Name") || "Névtelen Jelentkező",
        email: airtableRecord.get("Email") || "",
        phone: airtableRecord.get("Phone") || "",
        message: airtableRecord.get("Message") || "",
        status: airtableRecord.get("Status") || "Új",
        cv: airtableRecord.get("CV") || null,
      };
    }

  } catch (err: any) {
    if (err.statusCode === 404) {
      notFound = true;
    } else {
      console.error("❌ Hiba az Airtable Jelentkező letöltésekor:", err.message || err);
      fetchError = true;
    }
  }

  // --- RENDERING ERROR STATES ---
  if (fetchError) {
    return (
      <>
        <header className="mb-10">
          <Link href="/admin/applications" className="text-gray-400 hover:text-white inline-flex items-center gap-2 mb-6 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Vissza a jelentkezőkhöz
          </Link>
        </header>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-4 opacity-80"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <h2 className="text-xl font-semibold text-white mb-2">Adatelérési hiba</h2>
          <p className="text-red-400/80 max-w-md mx-auto">Nem sikerült letölteni a kért rekordot az Airtable rendszerből. Lehet, hogy hálózati probléma lépett fel.</p>
        </div>
      </>
    );
  }

  if (notFound || !record) {
    return (
      <>
        <header className="mb-10">
          <Link href="/admin/applications" className="text-gray-400 hover:text-white inline-flex items-center gap-2 mb-6 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Vissza a listához
          </Link>
        </header>
        <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-16 text-center flex flex-col items-center justify-center mt-8">
          <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Rekord nem található</h2>
          <p className="text-gray-500 max-w-sm mb-6">A keresett jelentkezői adatlap időközben törlésre került az adatbázisból, vagy hibás volt a hivatkozás.</p>
          <Link href="/admin/applications" className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors">
            Vissza az áttekintéshez
          </Link>
        </div>
      </>
    );
  }

  // --- MAIN DETAIL RENDER ---
  return (
    <>
      <header className="mb-8">
        <Link href="/admin/applications" className="text-gray-400 hover:text-white inline-flex items-center gap-2 mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Összes jelentkező
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
               {record.jobTitle}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">{record.fullName}</h1>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex flex-col gap-2 min-w-[200px]">
             <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Státusz Módosítása</p>
             <StatusUpdater recordId={record.id} initialStatus={record.status} />
          </div>
        </div>
      </header>

      {/* Részletek Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bal Oszlop - Fő adatok */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Üzenet kártya */}
           <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl overflow-hidden p-6 sm:p-8">
             <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Motiváció / Üzenet
             </h2>
             {record.message ? (
                <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-5 text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {record.message}
                </div>
             ) : (
                <p className="text-gray-500 italic px-2">Nem hagyott üzenetet a jelentkező.</p>
             )}
           </div>

        </div>

        {/* Jobb Oszlop - Meta adatok */}
        <div className="space-y-6">
          
           {/* Elérhetőségek Kártya */}
           <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl overflow-hidden p-6">
             <h2 className="text-lg font-semibold text-white mb-6">Elérhetőség</h2>
             
             <div className="space-y-6">
                <div>
                   <p className="text-sm text-gray-500 mb-1.5 font-medium">E-mail cím</p>
                   {record.email ? (
                      <a href={`mailto:${record.email}`} className="group flex items-center gap-3 bg-gray-900/60 border border-gray-800 hover:border-blue-500/50 p-3.5 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <span className="text-gray-200 group-hover:text-white transition-colors break-all">{record.email}</span>
                      </a>
                   ) : (
                      <div className="text-gray-600 italic px-2">Nincs e-mail megadva</div>
                   )}
                </div>

                <div>
                   <p className="text-sm text-gray-500 mb-1.5 font-medium">Telefonszám</p>
                   {record.phone ? (
                      <a href={`tel:${record.phone}`} className="group flex items-center gap-3 bg-gray-900/60 border border-gray-800 hover:border-amber-500/50 p-3.5 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                        </div>
                        <span className="text-gray-200 group-hover:text-white transition-colors">{record.phone}</span>
                      </a>
                   ) : (
                      <div className="text-gray-600 italic px-2">Nincs telefon megadva</div>
                   )}
                </div>
             </div>
           </div>

           {/* CV Kártya */}
           <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl overflow-hidden p-6">
             <h2 className="text-lg font-semibold text-white mb-6">Önéletrajz</h2>
             
             {record.cv && Array.isArray(record.cv) && record.cv.length > 0 ? (
                <a 
                  href={record.cv[0].url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex flex-col items-center justify-center gap-3 bg-gray-900/60 border border-gray-800 hover:border-green-500/50 p-6 rounded-xl transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="text-green-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
                  </div>
                  <div className="text-center">
                    <span className="block text-gray-200 group-hover:text-white font-medium transition-colors mb-1">Dokumentum Megnyitása</span>
                    <span className="text-xs text-gray-500">Kattintson az önéletrajz letöltéséhez</span>
                  </div>
                </a>
             ) : (
                <div className="bg-gray-900/30 border border-gray-800/50 border-dashed rounded-xl p-8 text-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mx-auto mb-3"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9" x2="15" y1="15" y2="9"/></svg>
                   <span className="block text-gray-500 font-medium">Nincs megadva CV</span>
                </div>
             )}
           </div>

        </div>

      </div>
    </>
  );
}
