import Link from "next/link";
import { isActiveStatus, mapJobRecord } from "@/lib/airtable";
import AutoCampaignCard from "@/components/ai/AutoCampaignCard";
import { ScrollToCampaign } from "@/components/ai/ScrollToCampaign";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken, getCurrentUser, getEmployerAccess } from "@/lib/auth";
import Airtable from "airtable";

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
      return "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";
    case "draft":
    case "piszkozat":
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20";
    case "paused":
    case "szüneteltetve":
      return "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-600/20";
    case "closed":
    case "lezárt":
      return "bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-600/20";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20";
  }
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) redirect("/admin/login");

  const authUser = await verifyAuthToken(token);
  if (!authUser?.email) redirect("/admin/login");

  const user = await getCurrentUser(authUser.email);
  const employerId = user?.employerId;

  let access = { plan: "Free", applicantLimit: 5, accessStatus: "Active" };
  if (employerId) {
    access = await getEmployerAccess(employerId);
  }

  if (access.accessStatus !== "Active") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Hozzáférés felfüggesztve</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            A fiókodhoz tartozó munkáltatói hozzáférés jelenleg nem aktív. Kérjük, vedd fel a kapcsolatot az ügyfélszolgálattal a probléma megoldása érdekében.
          </p>
          <a href="mailto:support@workzy.hu" className="inline-flex w-full justify-center rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98]">
            Kapcsolatfelvétel
          </a>
        </div>
      </div>
    );
  }

  function getVisibleApplicantLimit(access: {
    plan: string;
    applicantLimit: number;
    accessStatus: string;
  }) {
    if (access.accessStatus === "Locked") return 5;

    if (access.plan === "Premium" || access.plan === "Partner") {
      return Infinity;
    }

    if (Number.isFinite(access.applicantLimit) && access.applicantLimit > 0) {
      return access.applicantLimit;
    }

    return 5;
  }

  const visibleLimit = getVisibleApplicantLimit(access);

  let jobs: any[] = [];
  let errorMsg = null;

  try {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE_ID!);
    
    let rawJobs: any[] = [];
    const employerEmail = authUser.email;

    const filterFormula = `{Owner} = "${employerEmail}"`;
    
    console.log("--- JOB FILTER DEBUG ---");
    console.log("employerEmail:", employerEmail);
    console.log("filterByFormula:", filterFormula);

    if (employerEmail) {
      rawJobs = await base(process.env.AIRTABLE_JOBS_TABLE_NAME!)
        .select({
          filterByFormula: filterFormula,
        })
        .all();
    }

    console.log("number of jobs returned:", rawJobs.length);
    console.log("------------------------");

    const baseJobs = rawJobs.map(mapJobRecord);
    const jobIds = baseJobs.map(j => j.id);

    let applications: any[] = [];
    if (jobIds.length > 0) {
      applications = await base(process.env.AIRTABLE_APPLICATIONS_TABLE_NAME!)
        .select()
        .all();
    }

    const applicationsByJob = jobIds.reduce((acc, jobId) => {
      acc[jobId] = applications.filter((a) => a.fields.Job?.includes(jobId));
      return acc;
    }, {} as Record<string, any[]>);

    function isJobUnlocked(job: any) {
      return (
        job.manualUnlock === true ||
        job.paymentStatus === "Paid" ||
        job.paymentStatus === "Manual" ||
        job.campaignStatus === "Active"
      );
    }

    jobs = baseJobs.map(job => {
      const apps = applicationsByJob[job.id] || [];
      const unlocked = isJobUnlocked(job);
      const visibleApps = unlocked ? apps : apps.slice(0, visibleLimit);
      const hiddenCount = unlocked ? 0 : Math.max(apps.length - visibleLimit, 0);

      return {
        ...job,
        applicantsCount: apps.length,
        visibleApps,
        hiddenCount
      };
    });

  } catch (err: any) {
    console.error("Hiba a dashboard adatok betöltésekor:", err);
    errorMsg = err?.message || "Ismeretlen hiba történt az adatok betöltésekor.";
  }

  console.log("--- EMPLOYER ACCESS DEBUG ---");
  console.log("Current Employer Email:", authUser.email);
  console.log("Employer ID:", employerId);
  console.log("Access Record:", access);
  console.log("Number of Jobs Fetched:", jobs.length);
  console.log("-----------------------------");

  const totalJobs = jobs.length;
  const totalApplications = jobs.reduce((acc, job) => acc + job.applicantsCount, 0);
  const activeJobs = jobs.filter((job) => isActiveStatus(job.status || "")).length;
  const avgApplicants = totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : "0.0";
  
  const hasZeroApplicants = jobs.some(job => isActiveStatus(job.status || "") && job.applicantsCount === 0);

  type AiRecommendation = {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    ctaHref: string;
    ctaLabel: string;
    priority: number;
    accent: string;
  };

  const rawRecommendations: AiRecommendation[] = [];
  let urgentJob = null;

  jobs.forEach(job => {
    const isActive = isActiveStatus(job.status || "");
    const applicants = job.applicantsCount || 0;

    if (isActive && applicants === 0) {
      if (!urgentJob) urgentJob = job;
      
      rawRecommendations.push({
        id: `ai-rec-${job.id}`,
        icon: <svg className="w-5 h-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2h4"/><path d="m21 21-3-3"/><path d="M12 21v-4"/><path d="M12 14a5 5 0 1 0-5-5"/></svg>,
        title: "Figyelmet igényel",
        description: `Jelenleg nem érkeznek jelentkezők a(z) ${job.title} pozícióra. A pozíció jelenleg láthatatlan.`,
        ctaHref: `/admin/jobs/${job.id}/campaign`,
        ctaLabel: "Kampány indítása → Szerezz jelentkezőket",
        priority: 1,
        accent: "orange"
      });
    } else if (isActive && applicants > 0 && applicants < 5) {
      rawRecommendations.push({
        id: `ai-rec-${job.id}`,
        icon: <svg className="w-5 h-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
        title: "Növeld az elérést",
        description: `A(z) ${job.title} elindult, de gyenge a volumen. Érdemes erősíteni a megjelenésen.`,
        ctaHref: `/admin/jobs/${job.id}/campaign`,
        ctaLabel: "Elérés növelése →",
        priority: 2,
        accent: "cyan"
      });
    } else if (isActive && applicants >= 5) {
      rawRecommendations.push({
        id: `ai-rec-${job.id}`,
        icon: <svg className="w-5 h-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
        title: "Optimalizálási javaslat",
        description: `A(z) ${job.title} kiválóan fut. Rendszerezd a beérkezett jelölteket.`,
        ctaHref: `/admin/jobs/${job.id}/applications`,
        ctaLabel: "Jelentkezők átnézése →",
        priority: 3,
        accent: "emerald"
      });
    }
  });

  const aiRecommendations = rawRecommendations
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  // Sort jobs so urgent job is first
  const sortedJobs = [...jobs].sort((a, b) => {
    if (urgentJob && a.id === urgentJob.id) return -1;
    if (urgentJob && b.id === urgentJob.id) return 1;
    return 0;
  });

  return (
    <div className="relative min-h-screen text-slate-900 font-sans pb-32">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
      `}} />

      {/* 1. FULL PAGE BACKGROUND */}
      <div className="fixed inset-0 -z-50 bg-[#f4f7f9]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.12),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(16,185,129,0.10),transparent_40%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-12 flex flex-col gap-12 relative z-10">
        
        {/* 2. HERO CARD - COMMAND CENTER */}
        <section className="relative w-full rounded-[36px] bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/60 ring-1 ring-cyan-100/40 shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden before:absolute before:inset-0 before:rounded-[36px] before:bg-white/40 before:opacity-30 before:pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.7),transparent_70%)] pointer-events-none" />
          
          <div className="relative flex flex-col lg:flex-row p-8 sm:p-10 gap-10 items-stretch">
            {/* Left Side */}
            <div className="flex-1 flex flex-col justify-center lg:border-r lg:border-slate-200/60 lg:pr-10">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-3">Üdv újra, Tamás 👋</h1>
              <p className="text-lg text-slate-600 font-medium tracking-wide mb-2">
                Ma {activeJobs} aktív pozíciód fut. Nézd át a kampányokat és indítsd el a következő állást.
              </p>
              
              {/* Dynamic Action Direction */}
              <div className="mb-6">
                {hasZeroApplicants ? (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[15px] text-red-600 font-semibold flex items-center gap-2">
                      <span className="text-lg">🚨</span>
                      Nincs jelentkeződ – naponta akár 20–50 jelöltet veszítesz.
                    </p>
                    <p className="text-[14px] text-slate-600 font-medium pl-7">
                      Egyetlen betöltött pozíció már visszahozhatja a kampány árát.
                    </p>
                    <div className="pl-7 mt-1.5">
                      <ScrollToCampaign />
                    </div>
                  </div>
                ) : (
                  <p className="text-[15px] text-emerald-600 font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    A kampányaid folyamatosan hozzák a jelölteket – folytasd az optimalizálást.
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3 opacity-50 transition-opacity duration-300 hover:opacity-100">
                <span className="inline-flex rounded-full px-4 py-1.5 text-xs font-bold bg-white/90 text-slate-600 shadow-sm ring-1 ring-slate-200">
                  {activeJobs} aktív állás
                </span>
                <span className="inline-flex rounded-full px-4 py-1.5 text-xs font-bold bg-white/90 text-slate-600 shadow-sm ring-1 ring-slate-200">
                  {totalApplications} jelentkező
                </span>
                <span className="inline-flex rounded-full px-4 py-1.5 text-xs font-bold bg-white/90 text-slate-600 shadow-sm ring-1 ring-slate-200">
                  <span className="text-indigo-500 mr-1.5">✦</span> {aiRecommendations.length} javaslat
                </span>
              </div>
            </div>

            {/* Right Side - CTAs */}
            <div className="flex flex-col gap-4 justify-center lg:w-72 shrink-0 relative">
              <Link href="/admin/jobs/new" className="cursor-pointer flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-[15px] font-bold text-white shadow-md transition-all duration-200 ease-out hover:-translate-y-[2px] hover:bg-slate-800 hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)] active:scale-[0.97] focus:outline-none">
                + Új állás indítása
              </Link>
              <Link href="/admin/jobs" className="cursor-pointer flex w-full items-center justify-center rounded-2xl bg-white/40 backdrop-blur-md border border-slate-200/40 shadow-sm px-6 py-4 text-[15px] font-semibold text-slate-600 transition-all duration-200 ease-out hover:-translate-y-[2px] hover:bg-white/80 hover:shadow-md hover:text-slate-900 active:scale-[0.97] focus:outline-none">
                Jelentkezők átnézése
              </Link>
            </div>
          </div>
        </section>

        {/* 3. KPI STRIP */}
        {!errorMsg && (
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 animate-fade-in-up">
             <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg group cursor-default before:absolute before:top-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-cyan-400 before:via-blue-400 before:to-emerald-400 before:opacity-70">
               <div className="flex justify-between items-start mb-4 relative">
                 <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-2">Összes állás</p>
                 <div className="w-10 h-10 rounded-xl bg-cyan-50 ring-1 ring-cyan-100 flex items-center justify-center text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.25)] group-hover:scale-110 transition-transform duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6"/><path d="M2 13 4 20h16l2-7"/></svg>
                 </div>
               </div>
               <p className="text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{totalJobs}</p>
               <div className="border-t border-slate-100 mt-3 pt-3">
                 <p className="text-xs font-semibold text-slate-400">Aktív toborzási pozíciók</p>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                   <div className="bg-cyan-400 h-full rounded-full" style={{ width: '100%' }}></div>
                 </div>
               </div>
             </div>
             
             <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg group cursor-default before:absolute before:top-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-emerald-400 before:via-teal-400 before:to-cyan-400 before:opacity-70">
               <div className="flex justify-between items-start mb-4 relative">
                 <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-2">Aktív állások</p>
                 <div className="w-10 h-10 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)] group-hover:scale-110 transition-transform duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                 </div>
               </div>
               <p className="text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{activeJobs}</p>
               <div className="border-t border-slate-100 mt-3 pt-3">
                 <p className="text-xs font-semibold text-slate-400">Jelenleg is nyitva</p>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                   <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${totalJobs > 0 ? (activeJobs / totalJobs) * 100 : 0}%` }}></div>
                 </div>
               </div>
             </div>

             <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg group cursor-default before:absolute before:top-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-violet-400 before:via-purple-400 before:to-fuchsia-400 before:opacity-70">
               <div className="flex justify-between items-start mb-4 relative">
                 <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-2">Jelentkezések</p>
                 <div className="w-10 h-10 rounded-xl bg-violet-50 ring-1 ring-violet-100 flex items-center justify-center text-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.25)] group-hover:scale-110 transition-transform duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                 </div>
               </div>
               <p className="text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.3s' }}>{totalApplications}</p>
               <div className="border-t border-slate-100 mt-3 pt-3">
                 {totalApplications === 0 ? (
                   <p className="text-[13px] font-bold text-orange-600">0 → kampány nélkül nincs jelölt</p>
                 ) : (
                   <p className="text-xs font-semibold text-emerald-500">+{totalApplications} jelentkező az elmúlt 7 napban</p>
                 )}
                 <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                   <div className={`h-full rounded-full transition-all duration-1000 ${totalApplications === 0 ? 'bg-orange-400' : 'bg-violet-400'}`} style={{ width: totalApplications === 0 ? '5%' : '65%' }}></div>
                 </div>
               </div>
             </div>

             <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg group cursor-default before:absolute before:top-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-indigo-400 before:via-blue-400 before:to-sky-400 before:opacity-70">
               <div className="flex justify-between items-start mb-4 relative">
                 <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-2">Átlag / Állás</p>
                 <div className="w-10 h-10 rounded-xl bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center text-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.25)] group-hover:scale-110 transition-transform duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                 </div>
               </div>
               <p className="text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.4s' }}>{avgApplicants}</p>
               <div className="border-t border-slate-100 mt-3 pt-3">
                 <p className="text-xs font-bold text-orange-600">Optimalizálás szükséges</p>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                   <div className="bg-indigo-400 h-full rounded-full" style={{ width: '15%' }}></div>
                 </div>
               </div>
             </div>
          </section>
        )}

        {/* 4. AI JAVASLATOK */}
        {!errorMsg && aiRecommendations.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                 AI Javaslatok
              </h2>
              <p className="text-sm text-slate-600 font-bold tracking-wide mt-1">Automatikus ajánlások a pozícióid teljesítménye alapján</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
              {aiRecommendations.map((rec, index) => {
                let cardBgClass = "bg-white/90";
                if (index === 1) cardBgClass = "bg-slate-50/80";
                if (index === 2) cardBgClass = "bg-white/95";

                let iconContainerClass = "text-slate-500 bg-slate-50 ring-1 ring-slate-200";
                let leftBarGradient = "from-slate-400 to-slate-500";
                let hoverRing = "hover:ring-slate-200";
                
                if (rec.accent === "orange") {
                  iconContainerClass = "text-orange-600 bg-orange-50 ring-1 ring-orange-100";
                  leftBarGradient = "from-orange-400 to-orange-500";
                  hoverRing = "hover:ring-orange-200";
                }
                if (rec.accent === "cyan") {
                  iconContainerClass = "text-cyan-600 bg-cyan-50 ring-1 ring-cyan-100";
                  leftBarGradient = "from-cyan-400 to-cyan-500";
                  hoverRing = "hover:ring-cyan-200";
                }
                if (rec.accent === "emerald") {
                  iconContainerClass = "text-emerald-600 bg-emerald-50 ring-1 ring-emerald-100";
                  leftBarGradient = "from-emerald-400 to-emerald-500";
                  hoverRing = "hover:ring-emerald-200";
                }

                return (
                  <div key={rec.id} className={`group relative overflow-hidden flex flex-col justify-between ${cardBgClass} rounded-[30px] border border-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:ring-1 ${hoverRing}`}>
                    <div className={`absolute top-0 left-0 bottom-0 w-[4px] rounded-full bg-gradient-to-b ${leftBarGradient}`} />
                    
                    <div className="pl-2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2.5 rounded-xl shrink-0 ${iconContainerClass} transition-all duration-300 group-hover:scale-110`}>
                          {rec.icon}
                        </div>
                        <h3 className="font-black text-slate-900 text-[16px]">{rec.title}</h3>
                      </div>
                      <p className="text-[14px] text-slate-600 font-medium leading-relaxed mb-6">
                        {rec.description}
                      </p>
                    </div>
                    
                    <div className="mt-auto pl-2">
                      <Link href={rec.ctaHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 outline-none transition-all duration-300 hover:text-blue-600 group-hover:translate-x-1 hover:underline underline-offset-4">
                        {rec.ctaLabel}
                      </Link>
                      {rec.accent === "orange" && (
                        <div className="mt-1">
                          <span className="block text-[13px] text-slate-500 font-semibold mb-0.5">Várható eredmény: 20–50 jelentkező 3–5 napon belül</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. FUTÓ KAMPÁNYOK / EMPTY STATE */}
        {!errorMsg && (
          <section>
            
            {/* NEXT BEST ACTION STRIP (DOMINANT CTA) */}
            {urgentJob && (
              <>
                <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-blue-50 to-white ring-1 ring-blue-200 shadow-[0_20px_60px_rgba(59,130,246,0.15)] rounded-[36px] p-8 border-l-4 border-l-blue-500 gap-6 relative overflow-hidden">
                  <div className="flex items-start md:items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 ring-4 ring-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">
                        Teendő most: Indíts kampányt a(z) '{urgentJob.title}' pozícióra
                      </h3>
                      <p className="text-[15px] text-slate-500 font-medium mt-1">
                        <span className="font-bold text-orange-500">0 jelentkező (még)</span> → a pozíció jelenleg nem ér el jelölteket
                      </p>
                      <p className="text-[14px] text-blue-600 font-semibold mt-1.5 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        Ez a leggyorsabb módja annak, hogy új jelentkezőket szerezz.
                      </p>
                      <p className="text-sm text-slate-500 mt-2 pl-6">
                        👉 A legtöbb cég ezen a ponton indít kampányt. Ne maradj le a jelöltekről.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end w-full md:w-auto mt-2 md:mt-0 relative z-10">
                    <Link href={`/admin/jobs/${urgentJob.id}/campaign`} className="cursor-pointer flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 text-lg font-semibold tracking-wide shadow-[0_15px_35px_rgba(37,99,235,0.35)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)] active:scale-[0.97] animate-pulse-slow">
                      🚀 Jelentkezők szerzése most
                    </Link>
                    <span className="block text-[13px] text-purple-600 font-bold mt-2 text-center md:text-right">
                      ⏱ 2 perc alatt elindítható
                    </span>
                    <span className="block text-emerald-600 font-bold text-lg mt-2 text-center md:text-right">
                      20–50 jelentkező 3–5 nap alatt
                    </span>
                    <span className="block text-[12px] text-slate-400 font-semibold mt-1 text-center md:text-right">
                      Nincs szerződés, azonnal indítható
                    </span>
                  </div>
                </div>

                {/* AI CAMPAIGN ENGINE */}
                <AutoCampaignCard job={urgentJob} />
              </>
            )}

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Futó kampányok</h2>
                <p className="text-sm text-slate-600 font-bold mt-1">Kezeld az aktív pozíciókat és kövesd a jelentkezőket.</p>
              </div>
              <Link href="/admin/jobs" className="inline-flex items-center gap-2 group text-[15px] font-bold text-blue-600 hover:text-blue-800 transition-all hover:bg-blue-50 px-4 py-2 rounded-xl">
                Minden állás kezelése <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>

            {sortedJobs.length === 0 ? (
              <div className="w-full bg-white/80 backdrop-blur-xl border border-white border-dashed rounded-[32px] p-16 flex flex-col items-center justify-center text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 mb-6 shadow-[0_0_20px_rgba(56,189,248,0.25)] border border-sky-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">Indítsd el az első kampányod</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-sm">
                  Jelenleg nincs egyetlen regisztrált pozíciód sem. Hozd létre az első állást, és találd meg a legjobb jelölteket!
                </p>
                <Link href="/admin/jobs/new" className="cursor-pointer relative overflow-hidden group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-8 py-4 text-[16px] font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.3)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)] active:scale-[0.97]">
                  <span className="relative z-10">+ Új állás indítása</span>
                  <div className="absolute inset-0 rounded-[inherit] bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                {sortedJobs.map((job) => {
                  const thumbnail = job.generatedImageUrl ?? job.position_banner_file ?? null;
                  const isZero = job.applicantsCount === 0;
                  const isPriority = urgentJob && job.id === urgentJob.id;
                  
                  return (
                    <div key={job.id} className={`group flex flex-col backdrop-blur-xl rounded-[30px] border shadow-[0_22px_70px_rgba(15,23,42,0.08)] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_35px_85px_rgba(15,23,42,0.14)] hover:ring-1 hover:ring-cyan-100 ${isZero ? 'bg-red-50/40 border-red-200' : 'bg-gradient-to-br from-white to-slate-50/80 border-white/80'}`}>
                      
                      {/* TOP: Thumbnail & Title */}
                      <div className="relative h-32 w-full bg-slate-50 overflow-hidden flex-shrink-0 rounded-t-[28px]">
                        {thumbnail ? (
                          <img src={thumbnail} alt={job.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 opacity-40 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Preview</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-40 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                        
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          {isPriority && (
                            <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm bg-blue-500 text-white ring-1 ring-inset ring-blue-600">
                              Prioritás
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-5 right-5 flex justify-between items-end">
                          <h3 className="text-[20px] font-bold text-white leading-tight pr-2 [text-shadow:0_2px_10px_rgba(0,0,0,0.4)] truncate">
                            {job.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-col p-5 flex-1">
                        {/* MIDDLE: Info & Number */}
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex items-center text-[13px] text-slate-600 font-bold gap-2">
                            <span className="truncate">{job.company || "Workzy"}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                            <span className="truncate">{job.location || "Nincs megadva"}</span>
                          </div>
                          {job.salary && (
                            <span className="inline-flex w-fit items-center rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-600/20 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                              {job.salary}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col mt-auto pb-4 border-b border-slate-100/80">
                          {isZero ? (
                            <div className="flex flex-col gap-1 items-start">
                              <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold bg-red-50 text-red-700 border border-red-200 animate-pulse-slow">
                                🚨 Ez a pozíció napi bevételkiesést okoz
                              </span>
                              <span className="text-xs font-bold text-red-500 px-1 mt-0.5">
                                👉 Indíts kampányt és állítsd meg a veszteséget
                              </span>
                              <span className="text-6xl font-bold text-orange-500 tracking-tight leading-none mt-2">
                                0
                              </span>
                              <span className="text-[11px] uppercase tracking-widest text-slate-400 mt-1 font-bold">
                                Jelentkező érkezett
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col mt-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm uppercase tracking-widest text-slate-400 font-bold">
                                  Legutóbbi jelentkezők
                                </span>
                                <span className="text-2xl font-black text-cyan-600 leading-none">
                                  {job.applicantsCount}
                                </span>
                              </div>
                              <div className="flex flex-col gap-2">
                                {job.visibleApps?.map((app: any) => (
                                  <div key={app.id} className="flex flex-col bg-white border border-slate-100 rounded-lg p-3 shadow-sm hover:border-blue-200 transition-colors">
                                    <span className="text-[13px] font-bold text-slate-800">{app.fields.Name || "Ismeretlen"}</span>
                                    <span className="text-[12px] text-slate-500">{app.fields.Email || "Nincs megadva"}</span>
                                  </div>
                                ))}
                              </div>
                              
                              {job.hiddenCount > 0 && (
                                <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-center">
                                  <div className="text-lg font-bold text-slate-900">
                                    🔒 {job.hiddenCount} további jelentkező elrejtve
                                  </div>
                                  <p className="mt-2 text-sm text-slate-600">
                                    A további jelentkezők megtekintéséhez aktiváld a kampányt.
                                  </p>
                                  <Link href={`/admin/billing`} className="mt-4 inline-block w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]">
                                    Kampány aktiválása
                                  </Link>
                                </div>
                              )}

                              {job.freeCampaign && job.campaignStatus === "Paused" && job.campaignStopReason === "Reached 5 applicants" && (
                                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left">
                                  <h3 className="font-bold text-slate-900">
                                    Megvan az első 5 jelentkeződ 🎉
                                  </h3>
                                  <p className="mt-2 text-sm text-slate-600">
                                    A kampányt ideiglenesen megállítottuk. Ha szeretnéd folytatni és további jelentkezőket szerezni, aktiváld a kampányt.
                                  </p>
                                  <Link
                                    href="/admin/billing"
                                    className="mt-4 inline-flex w-full justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
                                  >
                                    Kampány folytatása
                                  </Link>
                                </div>
                              )}

                              {job.freeCampaign && job.campaignStatus === "Paused" && job.campaignStopReason === "Budget limit" && (
                                <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-left">
                                  <h3 className="font-bold text-slate-900">
                                    A tesztkampány elérte a költségkeretet
                                  </h3>
                                  <p className="mt-2 text-sm text-slate-600">
                                    A hirdetést megállítottuk, hogy ne legyen kontrollálatlan költés.
                                  </p>
                                  <Link
                                    href="/admin/billing"
                                    className="mt-4 inline-flex w-full justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
                                  >
                                    Kampány folytatása
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* BOTTOM: Actions */}
                        <div className={`flex items-center pt-4 gap-3 ${isZero ? 'justify-end' : 'justify-between'}`}>
                          {!isZero && (
                            <Link href={`/admin/jobs/${job.id}`} className="cursor-pointer relative overflow-hidden inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-5 py-2 text-[12px] font-semibold text-slate-700 shadow-sm transition-all duration-200 ease-out hover:-translate-y-[2px] hover:bg-slate-50 hover:shadow-md active:scale-[0.97] group/btn">
                               Részletek
                            </Link>
                          )}
                          
                          <div className="flex gap-4">
                             {isZero ? (
                                <ScrollToCampaign variant="link" />
                             ) : (
                                <>
                                  <Link href={`/admin/jobs/${job.id}/applications`} className="cursor-pointer text-[12px] font-bold text-slate-400 hover:text-slate-700 transition-all duration-200 hover:underline underline-offset-4 active:scale-[0.97]">
                                    Összes jelentkező
                                  </Link>
                                </>
                             )}
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}