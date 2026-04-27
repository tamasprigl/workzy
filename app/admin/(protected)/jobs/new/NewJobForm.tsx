"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { JobFormData } from "./types";
import {
  PRESET_APPLICATION_QUESTIONS,
  type ApplicationQuestion,
  type ApplicationQuestionType,
} from "@/lib/applicationQuestions";

interface NewJobFormProps {
  formData: JobFormData;
  setFormData: React.Dispatch<React.SetStateAction<JobFormData>>;
  jobId?: string;
}

function safeQuestions(formData: JobFormData): ApplicationQuestion[] {
  return Array.isArray(formData.applicationQuestions)
    ? formData.applicationQuestions
    : [];
}

function generateFacebookPost(job: JobFormData): string {
  if (!job.title) return "Írd be az állás nevét az előnézethez...";

  const salaryText = job.salary ? `💰 Kiemelt bérezés: ${job.salary}\n` : "";
  const locationText = job.location
    ? `📍 Munkavégzés helye: ${job.location}\n`
    : "";
  const companyText = job.company
    ? `${job.company} bővül, új kollégát keresünk.`
    : "Új munkatársat keresünk.";
  const shortText = job.shortDescription ? `👉 ${job.shortDescription}\n` : "";

  return `📢 ÚJ ÁLLÁSLEHETŐSÉG: ${job.title.toUpperCase()}! 🚀

${companyText}
${shortText}${locationText}${salaryText}
Jelentkezz gyorsan és egyszerűen az alábbi linken! 👇
workzy.hu/jobs/${job.slug || "uj-allas"}

#állás #munka #${
    job.location ? job.location.replace(/[\s,]+/g, "") : "karrier"
  } #${job.title.replace(/[\s,]+/g, "")}`;
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      value={value || ""}
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <textarea
      required={required}
      name={name}
      value={value || ""}
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      value={value || ""}
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

  const questions = safeQuestions(formData);

  const canGenerateImage = useMemo(() => {
    return (
      (formData.title || "").trim().length > 0 &&
      (formData.location || "").trim().length > 0 &&
      (formData.salary || "").trim().length > 0
    );
  }, [formData.title, formData.location, formData.salary]);

  const selectedPresetCount = questions.filter((item) =>
    PRESET_APPLICATION_QUESTIONS.some((preset) => preset.id === item.id)
  ).length;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlugify = () => {
    if (!formData.title) return;
    setFormData((prev) => ({ ...prev, slug: slugify(formData.title) }));
  };

  const handleGenerateImage = async () => {
    if (!canGenerateImage) return;

    setImageError("");
    setIsGeneratingImage(true);

    try {
      const response = await fetch("/api/generate-job-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setImageError(
        error instanceof Error
          ? error.message
          : "Hiba történt a képgenerálás során."
      );
    } finally {
      setIsGeneratingImage(false);
    }
  };

  function togglePresetQuestion(question: ApplicationQuestion, checked: boolean) {
    setFormData((prev) => {
      const prevQuestions = Array.isArray(prev.applicationQuestions)
        ? prev.applicationQuestions
        : [];

      return {
        ...prev,
        applicationQuestions: checked
          ? [...prevQuestions, question]
          : prevQuestions.filter((item) => item.id !== question.id),
      };
    });
  }

  function addCustomQuestion() {
    const customQuestion: ApplicationQuestion = {
      id: "custom_1",
      label: "",
      type: "text",
      required: false,
    };

    setFormData((prev) => {
      const prevQuestions = Array.isArray(prev.applicationQuestions)
        ? prev.applicationQuestions
        : [];

      return {
        ...prev,
        applicationQuestions: [...prevQuestions, customQuestion],
      };
    });
  }

  function updateCustomQuestion(update: Partial<ApplicationQuestion>) {
    setFormData((prev) => {
      const prevQuestions = Array.isArray(prev.applicationQuestions)
        ? prev.applicationQuestions
        : [];

      return {
        ...prev,
        applicationQuestions: prevQuestions.map((item) =>
          item.id === "custom_1" ? { ...item, ...update } : item
        ),
      };
    });
  }

  function removeCustomQuestion() {
    setFormData((prev) => {
      const prevQuestions = Array.isArray(prev.applicationQuestions)
        ? prev.applicationQuestions
        : [];

      return {
        ...prev,
        applicationQuestions: prevQuestions.filter(
          (item) => item.id !== "custom_1"
        ),
      };
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const fbPreviewText = generateFacebookPost(formData);

      const cleanedQuestions = questions.filter((question) => {
        if (question.id === "custom_1") {
          return question.label.trim().length > 0;
        }

        return true;
      });

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
        applicationQuestions: cleanedQuestions,
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
        headers: { "Content-Type": "application/json" },
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
      }, 1200);
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
          ✓
        </div>

        <h2 className="mb-2 text-3xl font-bold text-slate-900">
          Állás sikeresen mentve!
        </h2>

        <p className="mx-auto max-w-sm text-slate-600">
          Átirányítás az állások oldalára...
        </p>
      </div>
    );
  }

  const fbPreviewText = generateFacebookPost(formData);
  const customQuestion = questions.find((question) => question.id === "custom_1");

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div>
        <SectionTitle title="Alapadatok" icon="📄" />

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
                URL azonosító / Slug <span className="text-red-500">*</span>
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
        <SectionTitle title="Pozíció részletek" icon="ℹ️" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Munkatípus
            </label>
            <Select name="jobType" value={formData.jobType} onChange={handleChange}>
              <option value="">Válasszon...</option>
              <option value="Szellemi">Szellemi</option>
              <option value="Fizikai">Fizikai</option>
              <option value="Egyéb">Egyéb</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Foglalkoztatás
            </label>
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
        <SectionTitle title="Hirdetés szövegezése" icon="✍️" />

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
              <label className="text-sm font-medium text-slate-700">
                Elvárások
              </label>
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
            <label className="text-sm font-medium text-slate-700">
              Gomb szövege
            </label>
            <Input
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              placeholder="Jelentkezem most!"
            />
          </div>
        </div>
      </div>

      <div>
        <SectionTitle title="Jelentkezési űrlap kérdései" icon="✅" />

        <div className="rounded-[28px] border border-sky-100 bg-sky-50/60 p-5">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Előszűrő kérdések
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Maximum 2 gyakori kérdést választhatsz, plusz 1 egyedi kérdést
              adhatsz hozzá.
            </p>

            <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
              Kiválasztva: {selectedPresetCount}/2 gyakori kérdés
            </div>
          </div>

          <div className="space-y-3">
            {PRESET_APPLICATION_QUESTIONS.map((question) => {
              const selected = questions.some((item) => item.id === question.id);
              const disabled = !selected && selectedPresetCount >= 2;

              return (
                <label
                  key={question.id}
                  className={[
                    "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                    selected
                      ? "border-sky-300 bg-white text-slate-900 shadow-sm"
                      : "border-slate-200 bg-white/70 text-slate-600 hover:border-sky-200",
                    disabled ? "cursor-not-allowed opacity-50" : "",
                  ].join(" ")}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={disabled}
                    onChange={(e) =>
                      togglePresetQuestion(question, e.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />

                  <div>
                    <div className="text-sm font-semibold">{question.label}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      Típus:{" "}
                      {question.type === "yes_no"
                        ? "Igen / Nem"
                        : question.type === "single_choice"
                          ? "Választós"
                          : "Szöveges"}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold text-slate-900">
              Egyedi kérdés
            </h4>

            {customQuestion ? (
              <div className="mt-4 space-y-4">
                <Input
                  name="customQuestionLabel"
                  value={customQuestion.label}
                  onChange={(e) =>
                    updateCustomQuestion({ label: e.target.value })
                  }
                  placeholder="pl. Melyik műszakot tudod vállalni?"
                />

                <Select
                  name="customQuestionType"
                  value={customQuestion.type}
                  onChange={(e) => {
                    const nextType = e.target.value as ApplicationQuestionType;

                    updateCustomQuestion({
                      type: nextType,
                      options:
                        nextType === "single_choice"
                          ? customQuestion.options?.length
                            ? customQuestion.options
                            : ["Opció 1", "Opció 2"]
                          : nextType === "yes_no"
                            ? ["Igen", "Nem"]
                            : undefined,
                    });
                  }}
                >
                  <option value="text">Szöveges válasz</option>
                  <option value="yes_no">Igen / Nem</option>
                  <option value="single_choice">Választós kérdés</option>
                </Select>

                {customQuestion.type === "single_choice" && (
                  <Input
                    name="customQuestionOptions"
                    value={(customQuestion.options || []).join(", ")}
                    onChange={(e) => {
                      const options = e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean);

                      updateCustomQuestion({ options });
                    }}
                    placeholder="Opciók vesszővel elválasztva"
                  />
                )}

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={customQuestion.required}
                    onChange={(e) =>
                      updateCustomQuestion({ required: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Kötelező kérdés
                </label>

                <button
                  type="button"
                  onClick={removeCustomQuestion}
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Egyedi kérdés törlése
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={addCustomQuestion}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                + Egyedi kérdés hozzáadása
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-sky-100 bg-sky-50/70 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              AI képgenerálás
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              A kép a pozíció, helyszín és bér mezők alapján készül.
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
        <SectionTitle title="Kampány előkészítése" icon="🚀" />

        <p className="mb-6 text-sm text-slate-600">
          A kampány szövegezése automatikusan frissül a fenti adatok alapján.
        </p>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Platform</label>
            <Select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
            >
              <option value="facebook">Facebook & Instagram</option>
              <option value="google">Google Ads</option>
              <option value="both">Mindkettő</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Költségkeret / nap
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
            <label className="text-sm font-medium text-slate-700">
              Kampánycél
            </label>
            <Input
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              placeholder="Jelentkezők gyűjtése"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="mb-3 text-sm font-medium text-slate-700">
            Automatikusan generált Facebook poszt szöveg
          </h3>

          <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-4 font-mono text-xs leading-relaxed text-slate-600 shadow-sm md:text-sm">
            {fbPreviewText}
          </div>
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
          {isSubmitting
            ? "Mentés folyamatban..."
            : jobId
              ? "Állás módosítása"
              : "Mentés & Kampány Indítása"}
        </button>
      </div>
    </form>
  );
}