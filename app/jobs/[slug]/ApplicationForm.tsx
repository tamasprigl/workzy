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
  message: string;
};

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
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
  const [cvFile, setCvFile] = useState<File | null>(null);

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

    // 🔥 CV kötelező
    if (!cvFile) {
      setErrorMessage("A CV feltöltése kötelező.");
      setIsSubmitting(false);
      return;
    }

    const formattedAnswers = questions.map((question) => ({
      questionId: question.id,
      question: question.label,
      answer: answers[question.id]?.trim() || "",
    }));

    try {
      const form = new FormData();

      form.append("jobId", jobId);
      form.append("jobSlug", jobSlug);
      form.append("jobTitle", jobTitle);

      form.append("fullName", formData.fullName.trim());
      form.append("email", formData.email.trim());
      form.append("phone", formData.phone.trim());
      form.append("city", formData.city.trim());
      form.append("message", formData.message.trim());

      form.append("cv", cvFile);
      form.append("answers", JSON.stringify(formattedAnswers));

      const response = await fetch("/api/applications", {
        method: "POST",
        body: form,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false || result?.ok === false) {
        throw new Error(
          result?.message ||
            result?.error ||
            "A jelentkezés küldése nem sikerült."
        );
      }

      setSuccessMessage(
        "A jelentkezés sikeresen elküldve. Hamarosan felvesszük veled a kapcsolatot."
      );

      setFormData(initialFormState);
      setAnswers({});
      setCvFile(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Valami hiba történt.";

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

        {/* --- MEZŐK változatlanul --- */}

        {/* 🔥 CV RÉSZ JAVÍTVA */}
        <div>
          <label
            htmlFor="cv"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            CV feltöltése *
          </label>

          <input
            id="cv"
            type="file"
            required
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setCvFile(e.target.files?.[0] || null)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />

          <p className="mt-2 text-xs text-slate-500">
            PDF, DOC vagy DOCX formátum.
          </p>
        </div>

        {/* --- questions + message + UI marad --- */}

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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white"
        >
          {isSubmitting ? "Küldés..." : "Jelentkezés elküldése"}
        </button>
      </div>
    </form>
  );
}