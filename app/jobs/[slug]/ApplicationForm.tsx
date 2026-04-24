"use client";

import { FormEvent, useState } from "react";

type ApplicationFormProps = {
  jobId: string;
  jobSlug: string;
  jobTitle: string;
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
};

export default function ApplicationForm({ jobId, jobSlug, jobTitle }: ApplicationFormProps) {
  const [formData, setFormData] = useState<FormState>(initialFormState);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

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
          message: formData.message.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "A jelentkezés küldése nem sikerült. Kérlek, próbáld újra."
        );
      }

      setSuccessMessage(
        "A jelentkezés sikeresen elküldve. Hamarosan felvesszük veled a kapcsolatot."
      );
      setFormData(initialFormState);
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