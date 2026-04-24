"use client";

import React from "react";

export function ScrollToCampaign({ variant = "badge" }: { variant?: "badge" | "link" }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("ai-campaign-card");
    if (element) {
      // Scroll smoothly to the center of the viewport
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (variant === "link") {
    return (
      <button 
        onClick={handleClick}
        className="text-[13px] text-blue-600 font-medium hover:underline cursor-pointer transition-all active:scale-[0.97]"
      >
        🚀 Kampány indítása
      </button>
    );
  }

  return (
    <button 
      onClick={handleClick}
      className="inline-flex rounded-full bg-orange-100 text-orange-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm ring-1 ring-inset ring-orange-500/20 transition-all hover:bg-orange-200 cursor-pointer active:scale-95"
    >
      ⚡ Gyors megoldás elérhető lent
    </button>
  );
}
