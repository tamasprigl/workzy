"use client";

import { useMemo, useState } from "react";
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
  const locationText = job.location ? `📍 Munkavégzés helye: ${job.location}\n` : "";
  const companyText = job.company ? `${job.company} bővül, új kollégát keresünk.` : "Új munkatársat keresünk.";
  const shortText = job.shortDescription ? `👉 ${job.shortDescription}\n` : "";

  return `📢 ÚJ ÁLLÁSLEHETŐSÉG: ${job.title.toUpperCase()}! 🚀

${companyText}
${shortText}${locationText}${salaryText}
Jelentkezz gyorsan és egyszerűen az alábbi linken! 👇
workzy.hu/jobs/${job.slug || "uj-allas"}

#állás #munka #${job.location ? job.location.replace(/[\s,]+/g, "") : "karrier"} #${job.title.replace(/[\s,]+/g, "")}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[áäàãâ]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[íìîï]/g, "i")
    .replace(/[óöőòôõ]/g, "o")
    .replace(/[úüűùû]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h2 className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-3 text-xl font-semibold text-slate-900">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
        {icon}
      </span>
      {title}
    </h2>
  );
}

function Input({
  name,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <input
      required={required}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
      placeholder={placeholder}
    />
  );
}

function TextArea({
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}: {
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <textarea
      required={required}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
      placeholder={placeholder}
    />
  );
}

function Select({
  name,
  value,
  onChange,
  children,
}: {
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
    >
      {children}
    </select>
  );
}

export default function NewJobForm({
  formData,
  setFormData,
  jobId,
}: NewJobFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const canGenerateImage = useMemo(() => {
    return (
      formData.title.trim().length > 0 &&
      formData.location.trim().length > 0 &&
      formData.salary.trim().length > 0
    );
  }, [formData.title, formData.location, formData.salary]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlugify = () => {
    if (!formData.title) return;
    const slug = slugify(formData.title);
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleGenerateImage = async () => {
    if (!canGenerateImage) return;

    setImageError("");
    setIsGeneratingImage(true);

    try {
      const response = await fetch("/api/generate-job-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          location: formData.location.trim(),
          salary: formData.salary.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "A képgenerálás nem sikerült.");
      }

      if (!result?.image) {
        throw new Error("Nem érkezett vissza generált kép.");
      }

      setGeneratedImage(result.image);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Hiba történt a képgenerálás során.";

      setImageError(message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

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
        image: generatedImage,
        campaign: {
          platform: formData.platform,
          budget: formData.budget ? Number(formData.budget) : undefined,
          location: formData.campaignLocation,
          goal: formData.objective,
        },
      };

      const apiUrl = jobId ? "/api/jobs/update" : "/api/jobs/create";
      const bodyPayload = jobId ? { recordId: jobId, ...payload } : payload;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result?.message ||
            result?.error?.message ||
            result?.error ||
            "API hiba történt a mentés során"
        );
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/admin/jobs");
      }, 2200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Hiba történt a mentés során. Ellenőrizd a konzolt."
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="flex h-full animate-in zoom-in flex-col items-center justify-center py-20 text-center fade-in duration-500">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.18)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h2 className="mb-2 text-3xl font-bold text-slate-900">
          Állás sikeresen közzétéve!
        </h2>

        <p className="mx-auto max-w-sm text-slate-600">
          Az új pozíció rögzítésre került a rendszerben. Átirányítás az állások
          oldalára...
        </p>
      </div>
    );
  }

  const fbPreviewText = generateFacebookPost(formData);

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div>
        <SectionTitle
          title="Alapadatok"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          }
        />

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Pozíció neve <span className="text-red-500">*</span>
            </label>
            <Input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="pl. Targoncavezető"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                URL azonosító (Slug) <span className="text-red-500">*</span>
              </label>
              <Input
                required
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="targoncavezeto"
              />
              <button
                type="button"
                onClick={handleSlugify}
                className="text-xs font-medium text-sky-600 transition hover:text-sky-700"
              >
                Slug generálása a cím alapján
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Cég neve <span className="text-red-500">*</span>
              </label>
              <Input
                required
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Partner Kft."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Munkavégzés helye <span className="text-red-500">*</span>
              </label>
              <Input
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="pl. Győr"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionTitle
          title="Pozíció részletek"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          }
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Munkatípus</label>
            <Select name="jobType" value={formData.jobType} onChange={handleChange}>
              <option value="">Válasszon...</option>
              <option value="Szellemi">Szellemi</option>
              <option value="Fizikai">Fizikai</option>
              <option value="Egyéb">Egyéb</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Foglalkoztatás</label>
            <Select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
            >
              <option value="">Válasszon...</option>
              <option value="Teljes munkaidő">Teljes munkaidő</option>
              <option value="Részmunkaidő">Részmunkaidő</option>
              <option value="Alkalmi">Alkalmi</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Műszak</label>
            <Input
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              placeholder="pl. 2 műszak"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Bérsáv</label>
            <Input
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="pl. Nettó 450.000 - 515.000 Ft"
            />
          </div>
        </div>
      </div>

      <div>
        <SectionTitle
          title="Hirdetés szövegezése"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          }
        />

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Rövid leírás <span className="text-red-500">*</span>
            </label>
            <TextArea
              required
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={2}
              placeholder="Rövid, figyelemfelkeltő összefoglaló..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Teljes leírás <span className="text-red-500">*</span>
            </label>
            <TextArea
              required
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              rows={6}
              placeholder="Részletes bemutatása a pozíciónak..."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Elvárások</label>
              <TextArea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                placeholder="Mit várunk el a jelentkezőtől?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Előnyök / Amit kínálunk
              </label>
              <TextArea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={4}
                placeholder="Miért érdemes nálatok dolgozni?"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Gomb (CTA) szövege</label>
            <Input
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              placeholder="Jelentkezem most!"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-sky-100 bg-sky-50/70 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">AI képgenerálás</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              A kép a pozíció, helyszín és bér mezők alapján készül. Az ügyfél ezt
              már feltöltéskor láthatja.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateImage}
            disabled={!canGenerateImage || isGeneratingImage}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGeneratingImage ? "Kép generálása..." : "AI kép generálása"}
          </button>
        </div>

        {!canGenerateImage && (
          <p className="mt-3 text-sm text-amber-700">
            A képgeneráláshoz töltsd ki a pozíció, helyszín és bér mezőket.
          </p>
        )}

        {imageError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {imageError}
          </div>
        )}

        {generatedImage && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-medium text-slate-700">
              Generált kép előnézet
            </p>
            <img
              src={generatedImage}
              alt="AI generált álláshirdetés kép"
              className="max-w-full rounded-2xl border border-slate-200 bg-white shadow-md md:max-w-md"
            />
          </div>
        )}
      </div>

      <div>
        <SectionTitle
          title="Kampány előkészítése"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
          }
        />

        <p className="mb-6 text-sm text-slate-600">
          A kampány szövegezése automatikusan frissül a fenti adatok alapján.
        </p>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Platform</label>
            <Select name="platform" value={formData.platform} onChange={handleChange}>
              <option value="facebook">Facebook & Instagram</option>
              <option value="google">Google Ads</option>
              <option value="both">Mindkettő</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Költségkeret / nap (Ft)
            </label>
            <Input
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="pl. 5000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Célzás helyszíne
            </label>
            <Input
              name="campaignLocation"
              value={formData.campaignLocation}
              onChange={handleChange}
              placeholder="pl. Győr + 20 km"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Kampánycél</label>
            <Input
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              placeholder="Jelentkezők gyűjtése"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-sky-600"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            Automatikusan generált Facebook poszt szöveg
          </h3>

          <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-4 font-mono text-xs leading-relaxed text-slate-600 shadow-sm md:text-sm">
            {fbPreviewText}
          </div>

          <p className="mt-2 text-right text-xs text-slate-500">
            A szöveg a fenti adatok alapján élőben frissül.
          </p>
        </div>
      </div>

      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-slate-200 pt-10 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/jobs")}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Mégse
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-sky-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg
                className="-ml-1 mr-2 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647Z"
                />
              </svg>
              Mentés folyamatban...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              {jobId ? "Állás módosítása" : "Mentés & Kampány Indítása"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}