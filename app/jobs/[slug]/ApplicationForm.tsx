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

    // 🔥 CV kötelező frontend check
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

      if (!response.ok || result?.success === false) {
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
      <div className="space-y-6">
        <input
          type="text"
          required
          placeholder="Teljes név"
          value={formData.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

        <input
          type="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

        <input
          type="tel"
          required
          placeholder="Telefonszám"
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

        <input
          type="text"
          required
          placeholder="Lakhely"
          value={formData.city}
          onChange={(e) => updateField("city", e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

        {/* 🔥 CV FILE INPUT */}
        <div>
          <label className="block mb-2 font-medium">
            CV feltöltése *
          </label>
          <input
            type="file"
            required
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setCvFile(e.target.files?.[0] || null)
            }
            className="w-full"
          />
        </div>

        <textarea
          placeholder="Üzenet (opcionális)"
          value={formData.message}
          onChange={(e) => updateField("message", e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

        {errorMessage && (
          <div className="text-red-500">{errorMessage}</div>
        )}

        {successMessage && (
          <div className="text-green-600">{successMessage}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white p-4 rounded-xl"
        >
          {isSubmitting ? "Küldés..." : "Jelentkezés"}
        </button>
      </div>
    </form>
  );
}