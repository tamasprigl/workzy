import { JobFormData } from "./types";

function PreviewPill({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "highlight" | "success";
}) {
  const classes =
    variant === "highlight"
      ? "border-sky-200 bg-sky-50 text-sky-700"
      : variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-slate-200 bg-white text-slate-600";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${classes}`}
    >
      {children}
    </span>
  );
}

function SkeletonLine({ width }: { width: string }) {
  return (
    <div
      className={`h-4 rounded-full bg-slate-200 ${width}`}
    />
  );
}

export default function JobPreview({ data }: { data: JobFormData }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      {/* Browser-like header */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-300" />
            <div className="h-3 w-3 rounded-full bg-amber-300" />
            <div className="h-3 w-3 rounded-full bg-emerald-300" />
          </div>

          <div className="mx-auto flex-1">
            <div className="mx-auto max-w-sm truncate rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center font-mono text-xs text-slate-500 shadow-sm">
              workzy.hu/jobs/{data.slug || "uj-allas"}
            </div>
          </div>
        </div>
      </div>

      {/* Preview content */}
      <div className="bg-gradient-to-b from-white to-slate-50 p-6 md:p-8">
        <div className="inline-flex items-center rounded-full bg-sky-100 px-4 py-1.5 text-xs font-medium text-sky-700">
          Állás részletei (Előnézet)
        </div>

        <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl">
          {data.title || (
            <span className="italic text-slate-400">Írd be az állás nevét...</span>
          )}
        </h1>

        <div className="mt-5 flex flex-wrap gap-3">
          {data.location ? (
            <PreviewPill>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-sky-600"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {data.location}
            </PreviewPill>
          ) : (
            <div className="h-9 w-28 rounded-full bg-slate-200" />
          )}

          {data.company && <PreviewPill>{data.company}</PreviewPill>}

          {data.employmentType && (
            <PreviewPill variant="highlight">{data.employmentType}</PreviewPill>
          )}

          {data.salary && <PreviewPill variant="success">{data.salary}</PreviewPill>}
        </div>

        <div className="mt-8 rounded-[24px] border border-slate-200 bg-white/80 p-6 shadow-sm md:p-7">
          <h2 className="text-xl font-semibold text-slate-900">Leírás</h2>

          <div className="mt-4">
            {data.fullDescription ? (
              <div className="whitespace-pre-wrap text-base leading-7 text-slate-600">
                {data.fullDescription}
              </div>
            ) : (
              <div className="space-y-3">
                <SkeletonLine width="w-full" />
                <SkeletonLine width="w-11/12" />
                <SkeletonLine width="w-4/5" />
              </div>
            )}
          </div>

          {data.requirements && (
            <div className="mt-8">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Elvárások
              </h3>
              <div className="whitespace-pre-wrap text-base leading-7 text-slate-600">
                {data.requirements}
              </div>
            </div>
          )}

          {data.benefits && (
            <div className="mt-8">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Amit kínálunk
              </h3>
              <div className="whitespace-pre-wrap text-base leading-7 text-slate-600">
                {data.benefits}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8">
          <button
            disabled
            className="w-full rounded-xl bg-slate-900 px-8 py-3.5 font-semibold text-white opacity-90 sm:w-auto"
          >
            {data.ctaText || "Jelentkezem"}
          </button>
        </div>
      </div>
    </div>
  );
}