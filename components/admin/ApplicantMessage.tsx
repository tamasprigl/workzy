"use client";

import { useState } from "react";

export function ApplicantMessage({ message }: { message?: string | null }) {
  const [expanded, setExpanded] = useState(false);

  const text = message?.trim() || "-";
  const hasMessage = text !== "-";
  const shouldShowToggle = hasMessage && text.length > 90;

  return (
    <div className="h-auto rounded-2xl bg-slate-50 px-4 py-3 overflow-visible">
      <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        Üzenet
      </div>

      <p
        className={[
          "mt-2 whitespace-pre-wrap break-words text-sm font-semibold leading-relaxed text-slate-700",
          expanded ? "" : "line-clamp-2",
        ].join(" ")}
      >
        {text}
      </p>

      {shouldShowToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          {expanded ? "Kevesebb" : "Teljes üzenet"}
        </button>
      )}
    </div>
  );
}
