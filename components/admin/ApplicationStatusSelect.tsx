'use client';

import { useState, useTransition } from 'react';
import { updateApplicationStatus } from '@/app/admin/(protected)/jobs/[id]/applications/actions';

const statuses = ['Új', 'Feldolgozás alatt', 'Interjú', 'Elutasítva', 'Felvéve'];

interface ApplicationStatusSelectProps {
  recordId: string;
  currentStatus: string;
}

export default function ApplicationStatusSelect({ recordId, currentStatus }: ApplicationStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    const previousStatus = status;
    setStatus(newStatus);
    setIsSaving(true);

    startTransition(async () => {
      try {
        await updateApplicationStatus(recordId, newStatus);
      } catch (error) {
        console.error('Failed to update status:', error);
        setStatus(previousStatus);
        alert('Hiba történt a státusz mentésekor. Próbáld újra.');
      } finally {
        setIsSaving(false);
      }
    });
  };

  return (
    <div className="relative h-10">
      <select
        value={status}
        onChange={handleChange}
        disabled={isPending || isSaving}
        className="h-full w-full appearance-none rounded-2xl border border-cyan-200 bg-white/98 px-3 pr-8 py-2 text-xs font-bold text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg
          className="h-4 w-4 text-slate-500 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}