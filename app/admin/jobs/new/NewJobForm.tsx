"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JobFormData } from "./types";

interface NewJobFormProps {
  formData: JobFormData;
  setFormData: React.Dispatch<React.SetStateAction<JobFormData>>;
  jobId?: string;
}

function generateFacebookPost(job: JobFormData): string {
  if (!job.title) return "Írd be az állás nevét az előnézethez...";
  
  const salaryText = job.salary ? `💰 Kiemelt bérezés: ${job.salary}\n` : "";
  const locationText = job.location ? `\n📍 Munkavégzés helye: ${job.location}` : "";
  
  return `📢 ÚJ ÁLLÁSLEHETŐSÉG: ${job.title.toUpperCase()}! 🚀\n
Keresünk téged csapatunkba! ${job.company ? 'A ' + job.company + ' bővül! ' : ''}${job.shortDescription ? '👉 ' + job.shortDescription : ''}
${locationText}
${salaryText}
Jelentkezz 1 perc alatt regisztráció nélkül az alábbi linken! 👇
workzy.hu/jobs/${job.slug || "uj-allas"}

#állás #munka #${job.location ? job.location.replace(/[\s,]+/g, '') : 'karrier'} #${job.title.replace(/[\s,]+/g, '')}`;
}

export default function NewJobForm({ formData, setFormData, jobId }: NewJobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlugify = () => {
    if (formData.title) {
       const slug = formData.title
          .toLowerCase()
          .replace(/[áäàãâ]/g, 'a')
          .replace(/[éèêë]/g, 'e')
          .replace(/[íìîï]/g, 'i')
          .replace(/[óöőòôõ]/g, 'o')
          .replace(/[úüűùû]/g, 'u')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
       setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const fbPreviewText = generateFacebookPost(formData);
      
      const payload = {
        title: formData.title,
        slug: formData.slug,
        company: formData.company,
        location: formData.location,
        type: formData.jobType,
        employmentType: formData.employmentType,
        schedule: formData.shift,
        salary: formData.salary,
        shortDescription: formData.shortDescription,
        description: formData.fullDescription,
        requirements: formData.requirements,
        benefits: formData.benefits,
        ctaText: formData.ctaText,
        facebookPostText: fbPreviewText,
        campaign: {
          platform: formData.platform,
          budget: formData.budget ? Number(formData.budget) : undefined,
          location: formData.campaignLocation,
          goal: formData.objective
        }
      };
      
      const apiUrl = jobId ? '/api/jobs/update' : '/api/jobs/create';
      const bodyPayload = jobId ? { recordId: jobId, ...payload } : payload;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });
      
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result?.message || result?.error?.message || result?.error || "API hiba történt a mentés során");
      }
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push("/admin/jobs");
      }, 2500);
      
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      alert(err.message || "Hiba történt a mentés során. Ellenőrizd a konzolt.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500 h-full text-center">
        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Állás sikeresen közzétéve!</h2>
        <p className="text-gray-400 max-w-sm mx-auto">Az új pozíció rögzítésre került a rendszerben és a kampány előkészítve. Gyere vissza a listázó oldalra...</p>
      </div>
    );
  }

  const fbPreviewText = generateFacebookPost(formData);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
      
      {/* Alapadatok */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Alapadatok
        </h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Pozíció neve <span className="text-red-500">*</span></label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} onBlur={handleSlugify}
              className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600" 
              placeholder="pl. Vezető szoftverfejlesztő" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">URL azonosító (Slug) <span className="text-red-500">*</span></label>
              <input required type="text" name="slug" value={formData.slug} onChange={handleChange}
                className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600 font-mono text-sm" 
                placeholder="vezeto-szoftverfejleszto" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Cég neve <span className="text-red-500">*</span></label>
              <input required type="text" name="company" value={formData.company} onChange={handleChange}
                className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600" 
                placeholder="Workzy Kft." />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Munkavégzés helye <span className="text-red-500">*</span></label>
              <input required type="text" name="location" value={formData.location} onChange={handleChange}
                className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600" 
                placeholder="Budapest, 1134" />
            </div>
          </div>
        </div>
      </div>

      {/* Részletek */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
           Pozíció Részletek
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Munkatípus</label>
            <select name="jobType" value={formData.jobType} onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer">
              <option value="">Válasszon...</option>
              <option value="Szellemi">Szellemi</option>
              <option value="Fizikai">Fizikai</option>
              <option value="Egyéb">Egyéb</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Foglalkoztatás</label>
            <select name="employmentType" value={formData.employmentType} onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer">
              <option value="">Válasszon...</option>
              <option value="Teljes munkaidő">Teljes munkaidő</option>
              <option value="Részmunkaidő">Részmunkaidő</option>
              <option value="Alkalmi">Alkalmi</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Műszak</label>
            <input type="text" name="shift" value={formData.shift} onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600" 
              placeholder="pl. 1 műszak" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Bérsáv</label>
            <input type="text" name="salary" value={formData.salary} onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600" 
              placeholder="Nettó 450e Hz" />
          </div>
        </div>
      </div>

      {/* Leírás */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
           Hirdetés Szövegezése
        </h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Rövid leírás (Kivonat) <span className="text-red-500">*</span></label>
            <textarea required name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2}
              className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder:text-gray-600 resize-y" 
              placeholder="Röviden, figyelemfelkeltően az állásról..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Teljes leírás <span className="text-red-500">*</span></label>
            <textarea required name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows={6}
              className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder:text-gray-600 resize-y" 
              placeholder="Részletes bemutatása a munkakörnek és feladatoknak..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Elvárások</label>
              <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={4}
                className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder:text-gray-600 resize-y" 
                placeholder="Mit várunk el a jelölttől?" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Előnyök / Amit Kínálunk</label>
              <textarea name="benefits" value={formData.benefits} onChange={handleChange} rows={4}
                className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder:text-gray-600 resize-y" 
                placeholder="Miért érdemes nálunk dolgozni?" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Gomb (CTA) Szövege</label>
            <input type="text" name="ctaText" value={formData.ctaText} onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder:text-gray-600" 
              placeholder="Jelentkezem most!" />
          </div>
        </div>
      </div>

      {/* Kampány beállítások - ÚJ SZEKCIÓ */}
      <div className="mt-14 pt-8 border-t border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
           Kampány Előkészítése
        </h2>
        
        <p className="text-sm text-gray-400 mb-6">Mielőtt elküldöd, konfiguráld a hirdetési kampány automatikus elemeit.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Platform</label>
            <select name="platform" value={formData.platform} onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all appearance-none cursor-pointer">
              <option value="facebook">Facebook & Instagram</option>
              <option value="google">Google Ads</option>
              <option value="both">Mindkettő</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Költségkeret / Nap (Ft)</label>
            <input type="number" name="budget" value={formData.budget} onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-gray-600" 
              placeholder="pl. 5000" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Célzás helyszíne (Regió)</label>
            <input type="text" name="campaignLocation" value={formData.campaignLocation} onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-gray-600" 
              placeholder="pl. Budapest + 20km" />
          </div>
          
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-300">Kampánycél</label>
             <input type="text" name="objective" value={formData.objective} onChange={handleChange}
               className="w-full bg-black/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-gray-600" 
               placeholder="Jelentkezők gyűjtése" />
          </div>
        </div>

        {/* Facebook AI Generált Előnézet */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
           <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Automatikusan generált Facebook poszt szöveg
           </h3>
           <div className="bg-black/40 border border-gray-800/80 rounded-lg p-4 font-mono text-xs md:text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">
             {fbPreviewText}
           </div>
           <p className="text-xs text-gray-500 mt-2 text-right">A szöveg a fenti adatok alapján élőben frissül.</p>
        </div>
      </div>

      <div className="pt-10 flex justify-end gap-4 border-t border-gray-800">
         <button 
           type="button" 
           onClick={() => router.push("/admin/jobs")}
           className="px-6 py-3 rounded-xl font-medium text-gray-300 hover:text-white border border-gray-700 hover:bg-gray-800 transition-colors"
         >
           Mégse
         </button>
         
         <button 
           type="submit" 
           disabled={isSubmitting}
           className="px-8 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform active:scale-95"
         >
           {isSubmitting ? (
             <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Mentés folyamatban...
             </>
           ) : (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
               {jobId ? "Állás módosítása" : "Mentés & Kampány Indítása"}
             </>
           )}
         </button>
      </div>
    </form>
  );
}
