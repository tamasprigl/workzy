"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StatusUpdaterProps {
  recordId: string;
  initialStatus: string;
}

const statusOptions = [
  "Új",
  "Feldolgozás alatt",
  "Interjú",
  "Elutasítva",
  "Felvéve",
];

export default function StatusUpdater({ recordId, initialStatus }: StatusUpdaterProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === initialStatus) return; // Nincs változás

    setIsUpdating(true);

    try {
      const response = await fetch("/api/applications/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recordId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result?.message || result?.error || "A szerver nem tudta frissíteni a státuszt.");
      }

      // Sikerült a frissítés!
      // Újratöltjük az Server Component adatait a legfrissebb adat végett (Next router revalidate kliens oldalon)
      router.refresh();

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Hálózati hiba történt a státusz módosításakor.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Szin badgék határozzák meg a kártya alapszínét dinamikusan. A drop downt is az alapján formázzuk.
  let colorTheme = "bg-gray-800/50 text-gray-400 border-gray-700";
  let dotTheme = null;

  switch (initialStatus) {
    case "Új":
      colorTheme = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      dotTheme = "bg-emerald-500 animate-pulse";
      break;
    case "Feldolgozás alatt":
      colorTheme = "bg-blue-500/10 text-blue-400 border-blue-500/20";
      break;
    case "Interjú":
      colorTheme = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      break;
    case "Elutasítva":
      colorTheme = "bg-red-500/10 text-red-400 border-red-500/20";
      break;
    case "Felvéve":
      colorTheme = "bg-green-500/20 text-green-300 border-green-500/30 font-bold";
      break;
  }

  // Ha épp frissítjük kiírhatjuk hogy 'Frissítés...'
  if (isUpdating) {
     return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-800/50 text-gray-400 border-gray-700">
          <svg className="animate-spin -ml-0.5 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Mentés...
        </span>
     )
  }

  return (
    <div className="relative inline-block text-left w-full max-w-[150px]">
      <select
        value={initialStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isUpdating}
        className={`appearance-none cursor-pointer w-full inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border shadow-sm outline-none transition-colors pr-6 ${colorTheme}`}
      >
        {!statusOptions.includes(initialStatus) && (
           <option value={initialStatus} disabled>{initialStatus}</option>
        )}
        {statusOptions.map((opt) => (
          <option key={opt} value={opt} className="bg-gray-900 text-gray-200">
            {opt}
          </option>
        ))}
      </select>
      
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>

      {/* Dinamikus vizuális dot ikon megjelenítése absoluttal, ha extra hangsúly van (Új) */}
      {dotTheme && (
        <span className={`pointer-events-none absolute left-2.5 top-[8px] w-1.5 h-1.5 rounded-full ${dotTheme}`}></span>
      )}
    </div>
  );
}
