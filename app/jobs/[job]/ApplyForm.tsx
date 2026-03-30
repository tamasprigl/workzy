"use client";

import { useState } from "react";

type ApplyFormProps = {
  jobSlug: string;
  jobTitle: string;
};

export default function ApplyForm({ jobSlug, jobTitle }: ApplyFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobSlug,
          jobTitle,
          fullName,
          email,
          phone,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Sikertelen beküldés");
      }

      setStatus("success");
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          {isOpen ? "Űrlap bezárása" : "Jelentkezem"}
        </button>

        <a
          href="/jobs"
          className="border border-gray-700 px-6 py-3 rounded-xl hover:bg-gray-900 transition"
        >
          Vissza az állásokhoz
        </a>
      </div>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-gray-900 rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-2xl font-semibold">Jelentkezés erre az állásra</h3>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Teljes név</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Telefonszám</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Üzenet</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-60"
          >
            {status === "loading" ? "Küldés..." : "Jelentkezés elküldése"}
          </button>

          {status === "success" && (
            <p className="text-green-400">Sikeres jelentkezés.</p>
          )}

          {status === "error" && (
            <p className="text-red-400">Hiba történt a küldés során.</p>
          )}
        </form>
      )}
    </div>
  );
}