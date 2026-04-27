"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface AutoCampaignCardProps {
  job: {
    id: string;
    title: string;
    location?: string | null;
    salary?: string | null;
  };
}

export default function AutoCampaignCard({ job }: AutoCampaignCardProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [isAiSectionVisible, setIsAiSectionVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAiSectionVisible(entry.isIntersecting);
      },
      { rootMargin: "0px", threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!job) return null;

  return (
    <>
    <div ref={cardRef} className="w-full rounded-[32px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 flex flex-col mb-10">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-[15px] tracking-tight">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          AI Kampány javaslat
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-orange-100 text-orange-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm ring-1 ring-inset ring-orange-500/20">
            ⚠ Ajánlott most (kevés jelentkező a piacon)
          </div>
          <div className="hidden sm:inline-flex rounded-full bg-blue-100 text-blue-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm ring-1 ring-inset ring-blue-500/20">
            Automatikusan generálva
          </div>
        </div>
      </div>

      {/* JOB INFO */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 mb-8 border border-white shadow-sm flex flex-col">
        <p className="text-[13px] text-blue-600 font-bold mb-1.5">
          ✔ Ez a kampány már működő beállításokra épül
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">{job.title}</h3>
            <p className="text-[14px] text-slate-500 font-semibold mt-1.5 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {job.location || "Országos"}
            </p>
          </div>
          {job.salary && (
            <div className="shrink-0 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3.5 py-2 rounded-xl text-[14px] font-bold shadow-sm">
              {job.salary}
            </div>
          )}
        </div>
      </div>

      {/* CAMPAIGN DETAILS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Platform</span>
          <span className="text-[15px] font-bold text-slate-800">Facebook + Instagram</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Célközönség</span>
          <span className="text-[15px] font-bold text-slate-800">25–55 éves munkavállalók</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Célzási terület</span>
          <span className="text-[15px] font-bold text-slate-800">{job.location || "Országos"} + 30 km</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Napi keret</span>
          <span className="text-[15px] font-bold text-slate-800">8.000 Ft / nap</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Becsült elérés</span>
          <span className="text-[15px] font-bold text-slate-800">15.000 – 30.000 fő / nap</span>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 shadow-sm flex flex-col justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-1">Várható jelentkezők</span>
          <span className="text-[15px] font-bold text-emerald-800">20–50 jelentkező 3–5 nap alatt</span>
        </div>
      </div>
      
      <p className="text-[13px] text-slate-500 font-semibold text-center mb-6 flex items-center justify-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M20 6 9 17l-5-5"/></svg>
        Más cégek hasonló pozíciókkal már eredményesen használják
      </p>

      {/* CTAs */}
      <div className="flex flex-col items-center justify-center mt-2">
        <p className="text-[13px] font-bold text-orange-600 mb-1">
          ⚡ Kevés jelentkező van jelenleg a piacon – most érdemes indítani.
        </p>
        <p className="text-[13px] text-slate-500 font-medium mb-3">
          👉 Több mint 120 hasonló kampány fut jelenleg a rendszerben
        </p>
        <Link 
          href={`/admin/jobs/${job.id}/campaign?autoStart=true`}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl py-4 px-10 text-[16px] font-bold shadow-[0_12px_25px_rgba(79,70,229,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(79,70,229,0.45)] active:scale-[0.97] flex justify-center items-center"
        >
          🚀 Kampány indítása most – jelentkezők szerzése
        </Link>
        
        <div className="mt-4 text-center">
          <p className="text-[13px] font-bold text-emerald-600 mb-2">
            Várható eredmény: 20–50 jelentkező 3–5 nap alatt
          </p>
          <p className="text-[13px] font-semibold text-slate-600">
            Egy sikeres felvétel többszörösen visszahozza a kampány árát.
          </p>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Átlagosan 1–2 megfelelő jelölt már fedezi a teljes költséget.
          </p>
          <p className="text-[12px] text-slate-400 mt-2.5 flex items-center justify-center gap-1.5">
            <span className="text-sm">🛡️</span> Nincs kockázat – bármikor módosítható vagy leállítható.
          </p>
          <p className="text-[12px] text-slate-400 font-semibold mt-1">
            Nincs szerződés, azonnal indítható
          </p>
        </div>

        <Link href={`/admin/jobs/${job.id}/campaign`} className="mt-5 text-[13px] font-bold text-slate-500 hover:text-indigo-600 transition-colors underline underline-offset-4">
          Szerkesztés
        </Link>
      </div>

    </div>

    {mounted && !isAiSectionVisible && createPortal(
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-white/50 text-slate-800 px-4 py-2 rounded-full shadow-[0_15px_35px_rgba(79,70,229,0.2)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(79,70,229,0.3)]">
          <span className="text-[13px] font-bold whitespace-nowrap hidden sm:inline-block pl-2">
            🚀 Indíts kampányt most és szerezz jelentkezőket
          </span>
          <span className="text-[13px] font-bold whitespace-nowrap sm:hidden pl-2">
            🚀 Szerezz jelentkezőket
          </span>
          <Link 
            href={`/admin/jobs/${job.id}/campaign`} 
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-[13px] font-bold shadow-sm transition-all duration-300 hover:scale-105 active:scale-[0.97] hover:shadow-md whitespace-nowrap"
          >
            Kampány indítása
          </Link>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
