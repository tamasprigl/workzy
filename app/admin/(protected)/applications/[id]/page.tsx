import Airtable from "airtable";
import Link from "next/link";
import StatusUpdater from "../StatusUpdater";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let record: any = null;
  let fetchError = false;

  try {
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_APPLICATIONS_TABLE_NAME;

    if (!token || !baseId || !tableName) {
      throw new Error("Missing exact Airtable configuration variables.");
    }

    const base = new Airtable({ apiKey: token }).base(baseId);

    record = await base(tableName).find(id);
  } catch (err: any) {
    console.error("❌ Hiba a jelentkezés betöltésekor:", err.message || err);
    fetchError = true;
  }

  if (fetchError || !record) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center max-w-2xl mx-auto mt-12">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-4 opacity-80"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        <h2 className="text-xl font-semibold text-white mb-2">Hiba történt</h2>
        <p className="text-red-400/80 mb-6 max-w-md">
          A keresett jelentkezés nem található, vagy az adatbázis jelenleg nem elérhető.
        </p>
        <Link
          href="/admin/applications"
          className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Vissza a jelentkezésekhez
        </Link>
      </div>
    );
  }

  const jobTitle = record.get("Job Title") || "Ismeretlen pozíció";
  const fullName = record.get("Full Name") || "Névtelen Jelentkező";
  const email = record.get("Email") || "";
  const phone = record.get("Phone") || "";
  const status = record.get("Status") || "Új";
  const message = record.get("Message") || "";
  const cv = record.get("CV") || null;
  const jobSlug = record.get("Job Slug") || "";

  return (
    <>
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mt-4">{fullName}</h1>
          <p className="text-gray-400 mt-2 text-lg">
            Jelentkezett pozíció: <span className="text-blue-400 font-medium">{jobTitle}</span>
          </p>
          {jobSlug ? (
            <p className="text-sm text-gray-500 mt-2">Állás azonosító: {jobSlug}</p>
          ) : null}
        </div>

        <Link
          href="/admin/applications"
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700/50 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Vissza a listához
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Jelentkező adatai</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-400">E-mail cím</span>
                  {email ? (
                    <div className="flex items-center gap-2 text-lg text-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      <a href={`mailto:${email}`} className="hover:text-blue-400 transition-colors">{email}</a>
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">Nincs megadva e-mail</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-gray-400">Telefonszám</span>
                  {phone ? (
                    <div className="flex items-center gap-2 text-lg text-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                      <a href={`tel:${phone}`} className="hover:text-amber-400 transition-colors">{phone}</a>
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">Nincs megadva telefonszám</p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-800/60 pt-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Kísérőlevél / Üzenet</h3>
                {message ? (
                  <div className="bg-gray-900/50 rounded-xl p-5 text-gray-300 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap border border-gray-800/40">
                    {message}
                  </div>
                ) : (
                  <p className="text-gray-600 italic">A jelentkező nem hagyott üzenetet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Jelentkezés állapota</h3>

            <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800/50 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Jelenlegi státusz:</span>
                <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${status === "Új" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-gray-800 text-gray-400 border border-gray-700/50"}`}>
                  {status}
                </span>
              </div>
              <div className="border-t border-gray-800/60 pt-4">
                <label className="text-sm text-gray-400 mb-2 block">Állapot módosítása</label>
                <StatusUpdater recordId={record.id} initialStatus={status} />
              </div>
            </div>
          </div>

          <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              Csatolt dokumentumok
            </h3>

            {cv && Array.isArray(cv) && cv.length > 0 ? (
              <div className="flex flex-col gap-3">
                {cv.map((attachment: any, index: number) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:bg-gray-800 hover:border-gray-700 transition-colors group"
                  >
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-200 truncate">{attachment.filename || `Önéletrajz ${index + 1}`}</p>
                      <p className="text-xs text-gray-500">Megtekintés új lapon →</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900/30 border border-dashed border-gray-800 rounded-xl p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-600 mb-2"><path d="M12 2v20"/><path d="M2 12h20"/></svg>
                <p className="text-sm text-gray-500">A jelentkező nem csatolt önéletrajzot.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}