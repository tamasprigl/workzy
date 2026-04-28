import { saveAccountOnboarding } from "./actions";

type PageProps = {
  searchParams: Promise<{
    jobId?: string;
    purpose?: string;
  }>;
};

export default async function AccountOnboardingPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="mb-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-sky-500">
            Workzy fiók aktiválása
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Add meg a neved és állíts be jelszót
          </h1>
          <p className="mt-3 text-slate-500">
            Ezután azonnal tudod szerkeszteni az álláshirdetésedet.
          </p>
        </div>

        <form action={saveAccountOnboarding} className="space-y-5">
          <input type="hidden" name="jobId" value={params.jobId || ""} />
          <input type="hidden" name="purpose" value={params.purpose || ""} />

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Név
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="pl. Kovács Péter"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Jelszó
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Legalább 6 karakter"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-4 font-bold text-white shadow-[0_20px_45px_rgba(14,165,233,0.28)] transition hover:scale-[1.01] active:scale-[0.99]"
          >
            Fiók aktiválása és állás szerkesztése
          </button>
        </form>
      </div>
    </div>
  );
}
