"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StatusUpdaterProps {
  recordId: string;
  initialStatus: string;
}

export default function StatusUpdater({ recordId, initialStatus }: StatusUpdaterProps) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return; // Nincs változás

    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    setUpdatingStatus(newStatus);

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
      // Újratöltjük az Server Component adatait a legfrissebb adat végett
      router.refresh();

    } catch (err: any) {
      console.error(err);
      setCurrentStatus(previousStatus); // Revert on failure
      alert(err.message || "Hálózati hiba történt a státusz módosításakor.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const isUpdating = updatingStatus !== null;
  const isFelveveActive = currentStatus === "Felvéve";
  const isElutasitvaActive = currentStatus === "Elutasítva";
  const isFeldolgozasActive = currentStatus === "Feldolgozás alatt";

  const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="flex flex-wrap gap-4 w-full">
      <button
        onClick={() => handleStatusChange("Felvéve")}
        disabled={isUpdating}
        className={`rounded-xl px-4 py-2 transition-all duration-150 active:scale-95 active:brightness-110 text-white disabled:opacity-50 text-sm ${isFelveveActive ? "font-semibold scale-105 bg-emerald-600 ring-2 ring-offset-1 ring-emerald-400/40 shadow-sm" : "font-medium bg-emerald-600 saturate-50 shadow-sm opacity-70 hover:opacity-100 hover:saturate-100 hover:bg-emerald-500"}`}
      >
        {updatingStatus === "Felvéve" && <Spinner />}
        Felvéve
      </button>
      <button
        onClick={() => handleStatusChange("Elutasítva")}
        disabled={isUpdating}
        className={`rounded-xl px-4 py-2 transition-all duration-150 active:scale-95 active:brightness-110 text-white disabled:opacity-50 text-sm ${isElutasitvaActive ? "font-semibold scale-105 bg-rose-600 ring-2 ring-offset-1 ring-rose-400/40 shadow-sm" : "font-medium bg-rose-600 saturate-50 shadow-sm opacity-70 hover:opacity-100 hover:saturate-100 hover:bg-rose-500"}`}
      >
        {updatingStatus === "Elutasítva" && <Spinner />}
        Elutasítva
      </button>
      <button
        onClick={() => handleStatusChange("Feldolgozás alatt")}
        disabled={isUpdating}
        className={`rounded-xl px-4 py-2 transition-all duration-150 active:scale-95 active:brightness-110 text-white disabled:opacity-50 text-sm ${isFeldolgozasActive ? "font-semibold scale-105 bg-amber-500 ring-2 ring-offset-1 ring-amber-400/40 shadow-sm" : "font-medium bg-amber-500 saturate-50 shadow-sm opacity-70 hover:opacity-100 hover:saturate-100 hover:bg-amber-400"}`}
      >
        {updatingStatus === "Feldolgozás alatt" && <Spinner />}
        Feldolgozás alatt
      </button>
    </div>
  );
}
