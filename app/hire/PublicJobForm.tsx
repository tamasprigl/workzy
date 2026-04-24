"use client";

import { useMemo, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormDataState = {
  title: string;
  location: string;
  salary: string;
  shortDescription: string;
  email: string;
  platform: string;
  budget: string;
  campaignLocation: string;
  objective: string;
  highlights: boolean;
};

type TouchedState = Partial<Record<keyof FormDataState, boolean>>;

function getFieldError(name: keyof FormDataState, value: string) {
  if (name === "title" && !value.trim()) return "Add meg a pozíció nevét";
  if (name === "location" && !value.trim()) return "Add meg a helyszínt";
  if (name === "salary" && !value.trim()) return "Add meg a bérsávot";
  if (name === "email") {
    if (!value.trim() || !EMAIL_REGEX.test(value)) {
      return "Adj meg egy érvényes e-mail címet";
    }
  }
  return "";
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 animate-in fade-in slide-in-from-top-1 text-sm text-red-500">
      {message}
    </p>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-transform duration-300 ${open ? "rotate-180" : ""
        }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-400"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function PreviewCard({
  title,
  location,
  salary,
  description,
}: {
  title: string;
  location: string;
  salary: string;
  description: string;
}) {
  return (
    <div className="group relative w-full transition-all duration-300 lg:sticky lg:top-8">
      <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-b from-sky-200/50 to-sky-50/20 opacity-60 blur-xl transition duration-500 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-[32px] border border-white bg-white p-5 shadow-2xl shadow-sky-100/50 transition-all duration-500 group-hover:shadow-[0_30px_70px_rgba(14,165,233,0.15)] sm:p-6">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Élő előnézet
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500">
              <span className="text-sky-500">📍</span>
              {location}
            </div>

            <h3 className="line-clamp-2 text-2xl font-black leading-tight tracking-tight text-slate-900 transition-all duration-200 sm:text-3xl">
              {title}
            </h3>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 p-4 shadow-sm shadow-sky-100 transition-all duration-200">
            <div className="mb-1 text-[11px] font-black uppercase tracking-[0.15em] text-sky-600/80">
              Kiemelt bérezés
            </div>
            <div className="truncate text-2xl font-black text-sky-700">{salary}</div>
          </div>

          <div className="min-h-[60px] text-sm leading-relaxed text-slate-600 transition-all duration-200">
            {description}
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
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
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              A teljes állásoldalt a mentés után szerkesztheted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicJobForm() {
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    location: "",
    salary: "",
    shortDescription: "",
    email: "",
    platform: "facebook",
    budget: "",
    campaignLocation: "",
    objective: "Jelentkezők gyűjtése",
    highlights: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormDataState, string>>>({});
  const [touched, setTouched] = useState<TouchedState>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showCampaign, setShowCampaign] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const setFieldError = (name: keyof FormDataState, value: string) => {
    const error = getFieldError(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
    return error;
  };

  const validateAllRequiredFields = () => {
    const nextErrors: Partial<Record<keyof FormDataState, string>> = {
      title: getFieldError("title", formData.title),
      location: getFieldError("location", formData.location),
      salary: getFieldError("salary", formData.salary),
      email: getFieldError("email", formData.email),
    };

    setErrors((prev) => ({
      ...prev,
      ...nextErrors,
    }));

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name as keyof FormDataState;
    const value = target.value;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (name === "title" || name === "location" || name === "salary" || name === "email") {
      setFieldError(name, value);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name as keyof FormDataState;
    const value = target.value;
    const isCheckbox = target instanceof HTMLInputElement && target.type === "checkbox";
    const checked = target instanceof HTMLInputElement ? target.checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));

    if (hasSubmitted || touched[name]) {
      if (name === "title" || name === "location" || name === "salary" || name === "email") {
        setFieldError(name, isCheckbox ? String(checked) : value);
      }
    }
  };

  const visibleError = (name: keyof FormDataState) => {
    if (!hasSubmitted && !touched[name]) return "";
    return errors[name] || "";
  };

  const isSubmitDisabled = useMemo(() => {
    return (
      isSubmitting ||
      !formData.title.trim() ||
      !formData.location.trim() ||
      !formData.salary.trim() ||
      !EMAIL_REGEX.test(formData.email)
    );
  }, [formData.email, formData.location, formData.salary, formData.title, isSubmitting]);

  const previewTitle = formData.title || "Targoncavezető";
  const previewLocation = formData.location || "Győr";
  const previewSalary = formData.salary || "Nettó 400.000 Ft";
  const previewDesc =
    formData.shortDescription || "Figyelemfelkeltő 1-2 mondatos összefoglaló...";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setSubmitError("");

    const allValid = validateAllRequiredFields();

    if (!allValid) {
      setTouched((prev) => ({
        ...prev,
        title: true,
        location: true,
        salary: true,
        email: true,
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        salary: formData.salary.trim(),
        email: formData.email.trim(),
        shortDescription: formData.shortDescription.trim(),
        campaign: showCampaign
          ? {
            platform: formData.platform,
            budget: formData.budget ? Number(formData.budget) : undefined,
            location: formData.campaignLocation.trim(),
            goal: formData.objective.trim(),
          }
          : undefined,
        highlights: showHighlights
          ? {
            premiumListing: formData.highlights,
          }
          : undefined,
      };

      const response = await fetch("/api/jobs/public-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message || "Hiba történt a mentés során.");
      }

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitError(
        err instanceof Error ? err.message : "Ismeretlen hiba történt."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="animate-in zoom-in fade-in flex flex-col items-center justify-center rounded-[32px] border border-slate-200 bg-white px-6 py-12 sm:py-16 text-center shadow-xl shadow-slate-200/50 duration-500">
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

        <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Az állásod már majdnem él
        </h2>

        <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-slate-600">
          Elküldtük a belépési linkedet e-mailben. A linkre kattintva azonnal véglegesítheted és elindíthatod a hirdetést.
        </p>

        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
              A linket ide küldtük:
            </div>
            <div className="text-xl font-black text-slate-900">
              {formData.email}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Nem érkezett meg? Nézd meg a Spam vagy Promóciók mappát is.
            </div>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-6 text-left">
            <h3 className="font-bold text-slate-900 mb-4 text-center">Mi történik most?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">1</div>
                <div className="text-sm font-medium text-slate-700 mt-0.5">Nyisd meg az emailedet</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">2</div>
                <div className="text-sm font-medium text-slate-700 mt-0.5">Kattints a belépési linkre</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">3</div>
                <div className="text-sm font-medium text-slate-700 mt-0.5">Véglegesítsd és publikáld az állást</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
              }}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              E-mail cím javítása
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: "",
                  location: "",
                  salary: "",
                  shortDescription: "",
                  email: "",
                  platform: "facebook",
                  budget: "",
                  campaignLocation: "",
                  objective: "Jelentkezők gyűjtése",
                  highlights: false,
                });
                setErrors({});
                setTouched({});
                setHasSubmitted(false);
                setShowCampaign(false);
                setShowHighlights(false);
                setSubmitError("");
                setIsSuccess(false);
              }}
              className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2"
            >
              Új állás rögzítése
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 lg:p-10">
        <form noValidate onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Pozíció neve <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="pl. Targoncavezető"
                className={`w-full rounded-2xl border bg-white px-5 py-4 text-slate-900 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${visibleError("title")
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
                  }`}
              />
              <FieldError message={visibleError("title")} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Helyszín <span className="text-red-500">*</span>
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="pl. Győr"
                  className={`w-full rounded-2xl border bg-white px-5 py-4 text-slate-900 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${visibleError("location")
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
                    }`}
                />
                <FieldError message={visibleError("location")} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Bérsáv <span className="text-red-500">*</span>
                </label>
                <input
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="pl. Nettó 400.000 Ft"
                  className={`w-full rounded-2xl border bg-white px-5 py-4 text-slate-900 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${visibleError("salary")
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
                    }`}
                />
                <FieldError message={visibleError("salary")} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Rövid leírás</span>
                <span className="text-xs font-normal text-slate-400">Opcionális</span>
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={2}
                placeholder="Figyelemfelkeltő 1-2 mondatos összefoglaló..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                E-mail címed <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="ide küldjük a belépési linket"
                className={`w-full rounded-2xl border bg-white px-5 py-4 text-slate-900 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${visibleError("email")
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
                  }`}
              />
              {visibleError("email") ? (
                <FieldError message={visibleError("email")} />
              ) : (
                <p className="mt-1.5 text-sm font-medium text-slate-500">
                  Nem kell regisztráció – belépési linket küldünk
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50/50 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm">
              <button
                type="button"
                onClick={() => setShowCampaign((prev) => !prev)}
                className="group flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-100/50"
              >
                <div>
                  <span className="flex items-center gap-2 font-bold text-slate-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-sky-500"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                    </svg>
                    + Kampány indítása (opcionális)
                  </span>
                  <p className="mt-1 pl-6 text-xs text-slate-500">
                    Több jelentkező eléréséhez
                  </p>
                </div>
                <Chevron open={showCampaign} />
              </button>

              {showCampaign && (
                <div className="animate-in slide-in-from-top-2 fade-in space-y-4 border-t border-slate-200/60 bg-white/50 px-5 pb-6 pt-2 duration-300">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
                        Platform
                      </label>
                      <select
                        name="platform"
                        value={formData.platform}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      >
                        <option value="facebook">Facebook &amp; Instagram</option>
                        <option value="google">Google Ads</option>
                        <option value="both">Mindkettő</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
                        Költségkeret / nap (Ft)
                      </label>
                      <input
                        name="budget"
                        type="number"
                        value={formData.budget}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="pl. 5000"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
                        Célzás helyszíne
                      </label>
                      <input
                        name="campaignLocation"
                        value={formData.campaignLocation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="pl. Győr + 20 km"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
                        Kampánycél
                      </label>
                      <input
                        name="objective"
                        value={formData.objective}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Jelentkezők gyűjtése"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50/50 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm">
              <button
                type="button"
                onClick={() => setShowHighlights((prev) => !prev)}
                className="group flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-100/50"
              >
                <div>
                  <span className="flex items-center gap-2 font-bold text-slate-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    + Kiemelések (opcionális)
                  </span>
                  <p className="mt-1 pl-6 text-xs text-slate-500">
                    Kiemeltebb megjelenés
                  </p>
                </div>
                <Chevron open={showHighlights} />
              </button>

              {showHighlights && (
                <div className="animate-in slide-in-from-top-2 fade-in border-t border-slate-200/60 bg-white/50 px-5 pb-5 pt-2 duration-300">
                  <label className="flex cursor-pointer items-start gap-4 rounded-[16px] border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm">
                    <div className="mt-0.5 flex items-center">
                      <input
                        type="checkbox"
                        name="highlights"
                        checked={formData.highlights}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="h-5 w-5 rounded-md border-slate-300 text-sky-600 shadow-sm focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        Prémium kiemelés a találatok között
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-slate-500">
                        Az állásod az első oldalakon jelenik meg 7 napig, hogy több
                        emberhez érjen el.
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          {submitError && (
            <div className="flex items-start gap-3 rounded-[16px] border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {submitError}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-blue-900/20"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <svg
                      className="-ml-1 h-5 w-5 animate-spin text-white"
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
                    Állás meghirdetése azonnal
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>

      <PreviewCard
        title={previewTitle}
        location={previewLocation}
        salary={previewSalary}
        description={previewDesc}
      />
    </div>
  );
}