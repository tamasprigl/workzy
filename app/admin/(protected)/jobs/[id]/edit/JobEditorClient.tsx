"use client";

import { useState } from "react";
import Link from "next/link";
import NewJobForm from "../../new/NewJobForm";
import JobPreview from "../../new/JobPreview";
import { JobFormData } from "../../new/types";

export default function JobEditorClient({ initialData, jobId }: { initialData: JobFormData, jobId: string }) {
  const [formData, setFormData] = useState<JobFormData>(initialData);

  return (
    <>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <Link href="/admin/jobs" className="text-gray-400 hover:text-white inline-flex items-center gap-2 mb-2 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             Vissza az állásokhoz
           </Link>
           <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">Állás szerkesztése</h1>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-8 pb-20">
        
        {/* Left Column: Form */}
        <div className="w-full xl:w-1/2 flex flex-col">
          <div className="bg-gray-950/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-6 md:p-8 relative isolate flex-1">
             <div className="absolute top-0 right-0 p-8 opacity-5 text-gray-500 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
             </div>
             
             <NewJobForm formData={formData} setFormData={setFormData} jobId={jobId} />
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
