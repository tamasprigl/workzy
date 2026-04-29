"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("workzy_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("workzy_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("workzy_cookie_consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:flex sm:items-center sm:justify-between">
      <div className="mb-6 sm:mb-0 sm:pr-8">
        <h3 className="mb-2 text-lg font-bold text-slate-900">Cookie-kat használunk</h3>
        <p className="text-sm text-slate-600">
          A weboldal működéséhez elengedhetetlen sütik mellett statisztikai és marketing célú sütiket is használunk a legjobb felhasználói élmény érdekében. Részletek a{" "}
          <Link href="/cookie-tajekoztato" className="font-semibold text-sky-600 underline">
            Cookie tájékoztatóban
          </Link>.
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
        <button
          onClick={() => {}}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Beállítások
        </button>
        <button
          onClick={rejectCookies}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Elutasít
        </button>
        <button
          onClick={acceptCookies}
          className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:scale-105"
        >
          Elfogadom
        </button>
      </div>
    </div>
  );
}
