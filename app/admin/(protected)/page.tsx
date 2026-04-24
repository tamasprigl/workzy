import Link from "next/link";
import { getJobsWithApplications, isActiveStatus } from "@/lib/airtable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function AdminDashboardPage() {
  let jobs: any[] = [];
  let errorMsg = null;

  try {
    jobs = await getJobsWithApplications();
  } catch (err: any) {
    console.error("Hiba a dashboard adatok betöltésekor:", err);
    errorMsg = err?.message || "Ismeretlen hiba történt az adatok betöltésekor.";
  }

  const totalJobs = jobs.length;
  const totalApplications = jobs.reduce((acc, job) => acc + job.applicantsCount, 0);
  const activeJobs = jobs.filter((job) => isActiveStatus(job.status || "")).length;
  
  const inactiveJobs = totalJobs - activeJobs;
  const hasInactives = inactiveJobs > 0;
  const hasApplicants = totalApplications > 0;

  type AiRecommendation = {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    ctaHref: string;
    ctaLabel: string;
    priority: number;
  };

  const rawRecommendations: AiRecommendation[] = [];

  jobs.forEach(job => {
    const isActive = isActiveStatus(job.status || "");
    const applicants = job.applicantsCount || 0;

    if (isActive && applicants >= 5) {
      rawRecommendations.push({
        id: `ai-rec-${job.id}`,
        icon: <svg className="w-5 h-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
        title: "Kiváló teljesítmény",
        description: `Ez a kampány (${job.title}) jól teljesít. Nézd át a jelentkezőket.`,
        ctaHref: `/admin/jobs/${job.id}/applications`,
        ctaLabel: "Jelentkezők megnyitása",
        priority: 1
      });
    } else if (isActive && applicants === 0) {
      rawRecommendations.push({
        id: `ai-rec-${job.id}`,
        icon: <svg className="w-5 h-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2h4"/><path d="m21 21-3-3"/><path d="M12 21v-4"/><path d="M12 14a5 5 0 1 0-5-5"/></svg>,
        title: "Nincsenek jelentkezők",
        description: `Ehhez az aktív álláshoz (${job.title}) még nem érkezett jelentkező. Érdemes kampányt indítani vagy a kreatívot frissíteni.`,
        ctaHref: `/admin/jobs/${job.id}/campaign`,
        ctaLabel: "Kampány indítása",
        priority: 2
      });
    } else if (!isActive) {
      rawRecommendations.push({
        id: `ai-rec-${job.id}`,
        icon: <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/></svg>,
        title: "Inaktív állás",
        description: `Ez az állás (${job.title}) jelenleg nem aktív. Aktiváld, ha új jelentkezőket szeretnél.`,
        ctaHref: `/admin/jobs/${job.id}`,
        ctaLabel: "Állás megnyitása",
        priority: 3
      });
    } else if (isActive && applicants > 0 && applicants < 5) {
      rawRecommendations.push({
        id: `ai-rec-${job.id}`,
        icon: <svg className="w-5 h-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
        title: "Alacsony volumen",
        description: `A kampány elindult (${job.title}), de még gyenge a volumen. Érdemes lehet erősíteni.`,
        ctaHref: `/admin/jobs/${job.id}/campaign`,
        ctaLabel: "Kampány indítása",
        priority: 4
      });
    }
  });

  const aiRecommendations = rawRecommendations
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-32">
      <div className="mx-auto max-w-7xl px-6 pt-8 md:pt-10 pb-20 flex flex-col gap-10 md:gap-12">
        
        <div className="flex flex-col gap-6">
          {/* HERO SECTION */}
          <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white px-8 py-10 rounded-2xl border border-slate-200 shadow-sm">
            <div>
               <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Üdv újra, Tamás 👋</h1>
               <p className="text-[17px] text-slate-500 font-medium tracking-wide">
                 <strong className="text-slate-900">{activeJobs}</strong> aktív kampány <span className="text-slate-300 mx-2">•</span> <strong className="text-slate-900">{totalApplications}</strong> jelentkező
               </p>
            </div>
            <div className="flex gap-3 items-center shrink-0">
               <Link href="/admin/jobs" className="inline-flex items-center justify-center rounded-xl bg-transparent text-slate-600 px-5 py-3.5 text-[15px] font-bold transition duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 focus:outline-none">
                 Jelentkezők megtekintése
               </Link>
               <Link href="/admin/jobs/new" className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-7 py-3.5 text-[15px] font-bold transition duration-200 hover:bg-blue-700 shadow-sm active:scale-95 focus:outline-none ring-1 ring-inset ring-blue-700/20">
                 + Új állás indítása
               </Link>
            </div>
          </section>

          {/* AI AJÁNLÁSOK SECTION */}
          {!errorMsg && (
            <section className="space-y-5 pt-2">
              <div className="mb-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                   AI javaslatok
                </h2>
                <p className="text-[13px] text-slate-500 font-bold uppercase tracking-wider mt-1">Ajánlások a kampányaid teljesítménye alapján</p>
              </div>

              {aiRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {aiRecommendations.map((rec) => (
                    <div key={rec.id} className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm shrink-0">
                            {rec.icon}
                          </div>
                          <h3 className="font-bold text-slate-900 text-[15px]">{rec.title}</h3>
                        </div>
                        <p className="text-[14px] text-slate-600 font-medium leading-normal mb-6">
                          {rec.description}
                        </p>
                      </div>
                      <Link href={rec.ctaHref} className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 outline-none hover:text-blue-800 transition-colors mt-auto w-fit group-hover:underline underline-offset-4">
                        {rec.ctaLabel} <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 border border-emerald-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-emerald-900 text-[15px]">Minden rendben!</span>
                    <span className="text-[14px] text-emerald-700 font-medium">Jelenleg nincs kiemelt teendő vagy AI javaslat.</span>
                  </div>
                </div>
              )}
            </section>
          )}

          {errorMsg && (
            <div className="bg-rose-50 text-rose-700 p-6 rounded-2xl border border-rose-200 shadow-sm">
              <p className="font-bold text-lg mb-2">Hiba történt az adatok betöltésekor</p>
              <p className="font-medium text-sm">{errorMsg}</p>
            </div>
          )}

          {/* TEENDŐK SECTION */}
          {!errorMsg && (hasInactives || hasApplicants) && (
            <section className="space-y-4">
              <h2 className="text-[16px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
                 Teendők
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {hasApplicants && (
                   <Link href="/admin/jobs" className="group flex items-center justify-between gap-4 rounded-[24px] bg-amber-50/70 border border-transparent ring-1 ring-amber-200 hover:ring-amber-300 shadow-sm p-6 hover:bg-amber-50 transition-all duration-200 hover:-translate-y-[2px] hover:shadow-lg cursor-pointer focus:outline-none">
                     <div className="flex items-center gap-5">
                       <div className="shrink-0 bg-white p-3.5 rounded-[16px] text-amber-500 shadow-sm border border-amber-200/60 group-hover:scale-105 transition-transform duration-200 group-hover:bg-amber-50">
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                       </div>
                       <div className="flex flex-col">
                         <span className="text-amber-900 font-bold text-[17px] mb-0.5">Új jelentkezők várnak értékelésre</span>
                         <span className="text-amber-700/90 text-[13px] font-semibold">Nézd át és rendszerezd a tehetségeket.</span>
                       </div>
                     </div>
                     <span className="text-sm font-bold text-amber-600 opacity-80 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-200 shrink-0">
                       Megnyitás →
                     </span>
                   </Link>
                 )}
                 {hasInactives && (
                   <Link href="/admin/jobs" className="group flex items-center justify-between gap-4 rounded-[24px] bg-orange-50/70 border border-transparent ring-1 ring-orange-200 hover:ring-orange-300 shadow-sm p-6 hover:bg-orange-50 transition-all duration-200 hover:-translate-y-[2px] hover:shadow-lg cursor-pointer focus:outline-none">
                     <div className="flex items-center gap-5">
                       <div className="shrink-0 bg-white p-3.5 rounded-[16px] text-orange-500 shadow-sm border border-orange-200/60 group-hover:scale-105 transition-transform duration-200 group-hover:bg-orange-50">
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2h4"/><path d="m21 21-3-3"/><path d="M12 21v-4"/><path d="M12 14a5 5 0 1 0-5-5"/></svg>
                       </div>
                       <div className="flex flex-col">
                         <span className="text-orange-900 font-bold text-[17px] mb-0.5">{inactiveJobs} inaktív kampány</span>
                         <span className="text-orange-700/90 text-[13px] font-semibold">Aktiváld újra, hogy új jelentkezők érkezzenek.</span>
                       </div>
                     </div>
                     <span className="text-sm font-bold text-orange-600 opacity-80 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-200 shrink-0">
                       Megnyitás →
                     </span>
                   </Link>
                 )}
              </div>
            </section>
          )}
        </div>

        {/* METRICS / STAT CARDS */}
        {!errorMsg && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white px-8 py-9 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group cursor-default">
               <div className="absolute right-8 top-8 text-sky-400 group-hover:text-sky-500 transition-colors duration-200">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:opacity-60"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6"/><path d="M2 13 4 20h16l2-7"/></svg>
               </div>
               <p className="mb-3 text-xs uppercase tracking-wide text-slate-400 font-bold">Összes állás</p>
               <p className="text-4xl font-bold tracking-tight text-slate-900 leading-none transition-all duration-200 group-hover:scale-[1.02] origin-left">{totalJobs}</p>
             </div>
             
             <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white px-8 py-9 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group cursor-default">
               <div className="absolute right-8 top-8 text-violet-400 group-hover:text-violet-500 transition-colors duration-200">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:opacity-60"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
               </div>
               <p className="mb-3 text-xs uppercase tracking-wide text-slate-400 font-bold">Jelentkezések</p>
               <p className="text-4xl font-bold tracking-tight text-slate-900 leading-none transition-all duration-200 group-hover:scale-[1.02] origin-left">{totalApplications}</p>
             </div>

             <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white px-8 py-9 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group cursor-default">
               <div className="absolute right-8 top-8 text-emerald-400 group-hover:text-emerald-500 transition-colors duration-200">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:opacity-60"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
               </div>
               <p className="mb-3 text-xs uppercase tracking-wide text-slate-400 font-bold">Aktív állások</p>
               <p className="text-4xl font-bold tracking-tight text-slate-900 leading-none transition-all duration-200 group-hover:scale-[1.02] origin-left">{activeJobs}</p>
             </div>
          </section>
        )}

        {/* CAMPAIGN CARDS SECTION */}
        {!errorMsg && jobs.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-8 text-slate-900">
              <h2 className="text-2xl font-semibold tracking-tight">Futó kampányok</h2>
               <Link href="/admin/jobs" className="inline-flex items-center gap-1 hover:gap-2 group text-sm font-medium text-blue-600 hover:text-blue-800 transition-all hover:underline underline-offset-4">
                 Minden állás kezelése <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <div key={job.id} className="group relative flex flex-col bg-white rounded-[28px] border border-slate-200 p-7 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-300 hover:scale-[1.02] cursor-pointer">
                  
                  <div className="flex justify-between items-start mb-6 gap-4 relative z-0">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors pt-0.5">
                      <Link href={`/admin/jobs/${job.id}`} className="focus:outline-none before:absolute before:-inset-7 before:z-0 before:rounded-[28px]">
                        {job.title}
                      </Link>
                    </h3>
                    <div className="flex flex-col items-end gap-2 shrink-0 relative z-10 pointer-events-none">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 shadow-sm ${getStatusClasses(job.status || "")}`}>
                        {getStatusLabel(job.status || "")}
                      </span>
                      {job.applicantsCount >= 5 && (
                        <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                          🔥 pörög
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5 mb-10 relative z-10 pointer-events-none">
                    <div className="flex items-center text-[13px] text-slate-500 gap-3">
                      <svg className="w-4 h-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      <span className="truncate font-medium">{job.company || "Workzy"}</span>
                    </div>
                    <div className="flex items-center text-[13px] text-slate-500 gap-3">
                      <svg className="w-4 h-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span className="truncate font-medium">{job.location || "Nincs megadva"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col mb-10 relative z-10 pointer-events-none">
                    <span className="text-[3.5rem] font-bold text-sky-600 leading-none drop-shadow-sm tracking-tight">{job.applicantsCount}</span>
                    <span className="text-[11px] uppercase tracking-widest text-slate-400 mt-2 font-bold">{job.applicantsCount === 1 ? 'Jelentkező' : 'Jelentkezők'}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-3 relative z-10">
                    <div className="flex gap-3">
                      <Link href={`/admin/jobs/${job.id}/applications`} className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-4 py-2.5 text-[13px] font-bold transition duration-200 hover:bg-blue-700 shadow-sm active:scale-95 focus:outline-none flex-1">
                         Jelentkezők kezelése
                      </Link>
                    </div>
                    <div className="flex items-center justify-between">
                      <Link href={`/admin/jobs/${job.id}/campaign`} className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-700 px-4 py-2 text-[13px] font-bold transition duration-200 hover:bg-sky-100 active:scale-95 focus:outline-none">
                        Kampány indítás ✨
                      </Link>
                      <span className="text-[13px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none pr-1 flex items-center gap-1">
                        Megnyitás <span className="text-blue-500">→</span>
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}