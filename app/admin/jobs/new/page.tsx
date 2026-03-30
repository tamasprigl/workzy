"use client";

import { useState } from "react";
import NewJobForm from "./NewJobForm";
import JobPreview from "./JobPreview";
import { JobFormData } from "./types";

export default function NewJobPage() {
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    slug: "",
    company: "",
    location: "",
    jobType: "",
    employmentType: "",
    shift: "",
    salary: "",
    shortDescription: "",
    fullDescription: "",
    requirements: "",
    benefits: "",
    ctaText: "",
    channels: "Mindkettő",
    budget: "",
    platform: "facebook",
    campaignLocation: "",
    objective: "Jelentkezők gyűjtése",
  });

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">Új állás meghirdetése</h1>
        <p className="text-gray-400 mt-2 text-base lg:text-lg">Töltsd ki az űrlapot bal oldalon, és nézd meg az élő előnézetet jobb oldalon.</p>
      </header>

      <div className="flex flex-col xl:flex-row gap-8 pb-20">
        
        {/* Left Column: Form */}
        <div className="w-full xl:w-1/2 flex flex-col">
          <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-6 md:p-8 relative isolate flex-1">
             <div className="absolute top-0 right-0 p-8 opacity-5 text-gray-500 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
             </div>
             
             <NewJobForm formData={formData} setFormData={setFormData} />
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="w-full xl:w-1/2 flex flex-col lg:h-[calc(100vh-12rem)] sticky top-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
             Élő Előnézet
          </div>
          <JobPreview data={formData} />
        </div>

      </div>
    </>
  );
}
