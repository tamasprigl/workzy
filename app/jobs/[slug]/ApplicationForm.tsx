"use client";

import { FormEvent, useState } from "react";
import type { ApplicationQuestion } from "@/lib/applicationQuestions";

type ApplicationFormProps = {
  jobId: string;
  jobSlug: string;
  jobTitle: string;
  questions?: ApplicationQuestion[];
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  cv: string;
  message: string;
};

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  cv: "",
  message: "",
};

export default function ApplicationForm({
  jobId,
  jobSlug,
  jobTitle,
  questions = [],
}: ApplicationFormProps) {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const formattedAnswers = questions.map((question) => ({
      questionId: question.id,
      question: question.label,
      answer: answers[question.id]?.trim() || "",
    }));

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          jobSlug,
          jobTitle,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          city: formData.city.trim(),
          cv: formData.cv.trim(),
          message: formData.message.trim(),
          answers: formattedAnswers,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false || result?.ok === false) {
        throw new Error(
          result?.message ||
            result?.error ||
            "A jelentkezés küldése nem sikerült. Kérlek, próbáld újra."
        );
      }

      setSuccessMessage(
        "A jelentkezés sikeresen elküldve. Hamarosan felvesszük veled a kapcsolatot."
      );
      setFormData(initialFormState);
      setAnswers({});
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Valami hiba történt. Kérlek, próbáld újra.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-slate-200 bg-white/92 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-8"
    >
      <div className="mb-8">
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          Töltsd ki az alábbi adatokat, és a jelentkezés azonnal bekerül a
          rendszerbe. A csillaggal jelölt mezők kitöltése kötelező.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Teljes név *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Kovács János"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-600"
            >
              E-mail cím *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="pelda@email.hu"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-slate-600"
            >
              Telefonszám *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+36 30 123 4567"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Honnan jelentkezel? / Lakhely *
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            autoComplete="address-level2"
            value={formData.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="pl. Győr, Vaja, Kecskemét"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div>
          <label
            htmlFor="cv"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Önéletrajz link *
          </label>
          <input
            id="cv"
            name="cv"
            type="url"
            required
            value={formData.cv}
            onChange={(e) => updateField("cv", e.target.value)}
            placeholder="pl. Google Drive / Dropbox link"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Add meg az önéletrajzod elérhető linkjét.
          </p>
        </div>

        {questions.length > 0 && (
          <div className="rounded-[24px] border border-sky-100 bg-sky-50/40 p-5 md:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Előszűrő kérdések
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Ezek a kérdések segítenek gyorsabban feldolgozni a jelentkezésedet.
              </p>
            </div>

            <div className="space-y-5">
              {questions.map((question) => (
                <div key={question.id}>
                  <label
                    htmlFor={question.id}
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    {question.label} {question.required ? "*" : ""}
                  </label>

                  {question.type === "text" && (
                    <input
                      id={question.id}
                      type="text"
                      required={question.required}
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        updateAnswer(question.id, e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  )}

                  {question.type === "yes_no" && (
                    <div className="flex flex-wrap gap-3">
                      {["Igen", "Nem"].map((option) => (
                        <label
                          key={option}
                          className={[
                            "flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition",
                            answers[question.id] === option
                              ? "border-sky-300 bg-sky-100 text-sky-800"
                              : "border-slate-200 bg-white text-slate-600 hover:border-sky-200",
                          ].join(" ")}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            required={question.required}
                            checked={answers[question.id] === option}
                            onChange={(e) =>
                              updateAnswer(question.id, e.target.value)
                            }
                            className="h-4 w-4"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "single_choice" && (
                    <select
                      id={question.id}
                      required={question.required}
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        updateAnswer(question.id, e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    >
                      <option value="">Válassz...</option>
                      {(question.options || []).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Üzenet (opcionális)
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder="Írhatsz pár szót magadról, tapasztalatodról vagy arról, mikor tudsz kezdeni."
            className="min-h-[160px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {(successMessage || errorMessage) && (
          <div
            className={[
              "rounded-2xl border px-4 py-3 text-sm font-medium",
              successMessage
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700",
            ].join(" ")}
          >
            {successMessage || errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-6 pt-4">
          <p className="text-sm leading-6 text-slate-500">
            A jelentkezés elküldésével hozzájárulsz ahhoz, hogy az adataid a
            kiválasztási folyamatban felhasználásra kerüljenek.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[240px]"
          >
            {isSubmitting ? "Küldés folyamatban..." : "Jelentkezés elküldése"}
          </button>
        </div>
      </div>
    </form>
  );
}