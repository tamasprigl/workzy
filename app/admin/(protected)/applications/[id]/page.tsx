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
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center max-w-2xl mx-auto mt-12 shadow-[0_10px_30px_rgba(239,68,68,0.06)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-4 opacity-80"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Hiba történt</h2>
        <p className="text-red-600 mb-6 max-w-md">
          A keresett jelentkezés nem található, vagy az adatbázis jelenleg nem elérhető.
        </p>
        <Link
          href="/admin/applications"
          className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 font-medium shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Vissza a listához
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

  const createdDateRaw = record.get("Created") || record._rawJson?.createdTime || new Date().toISOString();
  const createdDateFormatted = new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdDateRaw));

  let headerBadge = "bg-slate-500/10 text-slate-600 ring-1 ring-inset ring-slate-500/20";
  if (status === "Új") headerBadge = "bg-sky-500/10 text-sky-600 ring-1 ring-inset ring-sky-500/20";
  else if (status === "Feldolgozás alatt") headerBadge = "bg-amber-500/10 text-amber-600 ring-1 ring-inset ring-amber-500/20";
  else if (status === "Felvéve") headerBadge = "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20";
  else if (status === "Elutasítva") headerBadge = "bg-rose-500/10 text-rose-600 ring-1 ring-inset ring-rose-500/20";

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 text-slate-900 min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mt-4 flex items-center gap-4">
            {fullName}
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${headerBadge}`}>
              {status}
            </span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Jelentkezett pozíció: <span className="text-cyan-600 font-medium">{jobTitle}</span>
          </p>
          {jobSlug ? (
            <p className="text-sm text-slate-400 mt-2">Állás azonosító: {jobSlug}</p>
          ) : null}
        </div>

        <Link
          href="/admin/jobs"
          className="bg-slate-800 hover:bg-slate-700 shadow-sm text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Vissza az állásokhoz
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 border border-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-all duration-200 rounded-[24px] p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Jelentkező adatai</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-500">E-mail cím</span>
                  {email ? (
                    <div className="flex items-center gap-2 text-lg text-slate-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      <a href={`mailto:${email}`} className="hover:text-cyan-600 transition-colors">{email}</a>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">Nincs megadva e-mail</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-500">Telefonszám</span>
                  {phone ? (
                    <div className="flex items-center gap-2 text-lg text-slate-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                      <a href={`tel:${phone}`} className="hover:text-cyan-600 transition-colors">{phone}</a>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">Nincs megadva telefonszám</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-slate-500 border-t border-slate-100 pt-6">
                <span>Jelentkezés ideje</span>
                <span className="font-medium text-slate-700">{createdDateFormatted}</span>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-medium text-slate-500 mb-3">Kísérőlevél / Üzenet</h3>
                {message ? (
                  <div className="bg-white rounded-xl p-5 text-slate-700 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap border border-slate-200">
                    {message}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">A jelentkező nem hagyott üzenetet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-all duration-200 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Jelentkezés állapota</h3>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-sm text-slate-500 mb-3 block">Állapot módosítása</label>
              <StatusUpdater recordId={record.id} initialStatus={status} />
            </div>
          </div>

          <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-all duration-200 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
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
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all duration-200 w-max shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
                    <span className="font-medium text-sm">Önéletrajz megnyitása</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-300 mb-2"><path d="M12 2v20"/><path d="M2 12h20"/></svg>
                <p className="text-sm">Nincs feltöltött önéletrajz</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}