import { JobFormData } from "./types";

export default function JobPreview({ data }: { data: JobFormData }) {
  return (
    <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-full relative isolate">
      {/* Browser-like header */}
      <div className="bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
        <div className="mx-auto bg-gray-900 border border-gray-800 rounded-md px-3 py-1 text-xs text-gray-500 font-mono flex-1 max-w-sm text-center truncate">
          workzy.hu/jobs/{data.slug || "uj-allas"}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-black">
        <p className="text-sm text-gray-500 mb-4">Állás részletei (Előnézet)</p>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          {data.title || <span className="text-gray-700 italic">Írd be az állás nevét...</span>}
        </h1>

        <div className="flex flex-wrap gap-3 mb-8">
          {data.location ? (
             <span className="text-gray-400 bg-gray-900 px-3 py-1 rounded-full text-sm flex items-center gap-1.5 border border-gray-800">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
               {data.location}
             </span>
          ) : (
             <span className="w-24 h-6 bg-gray-900 rounded-full animate-pulse"></span>
          )}

          {data.company && (
             <span className="text-gray-400 bg-gray-900 px-3 py-1 rounded-full text-sm border border-gray-800">
               {data.company}
             </span>
          )}
          
          {data.employmentType && (
             <span className="text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full text-sm border border-indigo-500/20">
               {data.employmentType}
             </span>
          )}

          {data.salary && (
            <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-sm border border-emerald-500/20">
              {data.salary}
            </span>
          )}
        </div>

        {/* Content Card */}
        <div className="bg-gray-900/50 border border-gray-800/80 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Leírás</h2>
          
          {data.fullDescription ? (
             <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
               {data.fullDescription}
             </div>
          ) : (
             <div className="space-y-3">
               <div className="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
               <div className="h-4 bg-gray-800 rounded w-11/12 animate-pulse"></div>
               <div className="h-4 bg-gray-800 rounded w-4/5 animate-pulse"></div>
             </div>
          )}

          {data.requirements && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-white mb-3">Elvárások</h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {data.requirements}
              </div>
            </div>
          )}

          {data.benefits && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-white mb-3">Amit kínálunk</h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {data.benefits}
              </div>
            </div>
          )}
        </div>

        {/* Apply Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <button disabled className="bg-white text-black px-8 py-3.5 rounded-xl font-semibold w-full sm:w-auto opacity-50 cursor-not-allowed">
            {data.ctaText || "Jelentkezem"}
          </button>
        </div>
      </div>
    </div>
  );
}
