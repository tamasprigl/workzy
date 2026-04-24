import Airtable from "airtable";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentAirtableUser } from "@/lib/current-airtable-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function normalizeLower(value: unknown): string {
  return normalizeString(value).toLowerCase();
}

function getFirstString(value: unknown): string {
  if (typeof value === "string") return value.trim();

  if (Array.isArray(value)) {
    const firstString = value.find((item) => typeof item === "string");
    return typeof firstString === "string" ? firstString.trim() : "";
  }

  return "";
}

function getStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function getBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
}

function formatDate(value: unknown): string {
  const raw = normalizeString(value);
  if (!raw) return "-";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function matchesCurrentUser(userField: unknown, currentEmail: string): boolean {
  if (!currentEmail) return false;

  if (typeof userField === "string") {
    return normalizeLower(userField) === currentEmail;
  }

  if (Array.isArray(userField)) {
    return userField.some((item) => normalizeLower(item) === currentEmail);
  }

  return false;
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/78 px-4 py-2 text-sm font-medium text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] backdrop-blur-md">
      <span className="inline-block h-2 w-2 rounded-full bg-cyan-400/80" />
      {children}
    </div>
  );
}

export default async function AdminJobApplicationsPage({ params }: PageProps) {
  const { id } = await params;

  const currentUser = await getCurrentAirtableUser();
  const currentEmail =
    normalizeLower(
      typeof currentUser === "string"
        ? currentUser
        : currentUser && typeof currentUser === "object" && "email" in currentUser
          ? (currentUser as { email?: string }).email
          : "",
    ) || "";

  if (!currentEmail) {
    redirect("/admin/login");
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f4f7f9] text-slate-900">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[#f4f7f9]" />
          <div className="absolute left-[-120px] top-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-200/34 blur-[110px]" />
          <div className="absolute right-[-120px] top-[40px] h-[340px] w-[340px] rounded-full bg-sky-200/28 blur-[120px]" />
          <div className="absolute bottom-[-140px] left-[35%] h-[320px] w-[320px] rounded-full bg-emerald-100/28 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl p-6 md:p-8">
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-[0_14px_36px_rgba(239,68,68,0.08)]">
            <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-900">Hiba</h1>
            <p className="mt-3 text-sm text-red-700">
              Hiányzik az Airtable konfiguráció.
            </p>
          </div>
        </div>
      </main>
    );
  }

  Airtable.configure({ apiKey: token });
  const base = Airtable.base(baseId);

  let jobRecord: Airtable.Record<Airtable.FieldSet>;

  try {
    jobRecord = await base("Jobs").find(id);
  } catch (error) {
    console.error("Nem található az állás rekord:", error);
    notFound();
  }

  if (!matchesCurrentUser(jobRecord.get("User"), currentEmail)) {
    notFound();
  }

  const title =
    getFirstString(jobRecord.get("Title")) ||
    getFirstString(jobRecord.get("Job Title")) ||
    "Névtelen állás";

  const applications = getStringArray(jobRecord.get("Applications"));
  const applicantsUnlocked = getBoolean(jobRecord.get("applicants_unlocked"));

  const applicationsCount = applications.length;
  const isLocked = applicationsCount >= 5 && !applicantsUnlocked;

  let applicantRecords: any[] = [];
  let applicantsLoadError = false;

  if (!isLocked && applicationsCount > 0) {
    try {
      const formula = `OR(${applications
        .map((appId) => `RECORD_ID() = '${appId}'`)
        .join(",")})`;

      const records = await base("Applications")
        .select({
          filterByFormula: formula,
        })
        .all();

      applicantRecords = records.map((rec) => ({
        id: rec.id,
        name: getFirstString(rec.get("Name")),
        email: getFirstString(rec.get("Email")),
        phone: getFirstString(rec.get("Phone")),
        createdDate: formatDate(rec.get("Created")),
      }));
    } catch (err) {
      console.error("Hiba a jelentkezők betöltésekor:", err);
      applicantsLoadError = true;
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f7f9] text-slate-900">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#f4f7f9]" />
        <div className="absolute left-[-120px] top-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-200/34 blur-[110px]" />
        <div className="absolute right-[-120px] top-[40px] h-[340px] w-[340px] rounded-full bg-sky-200/28 blur-[120px]" />
        <div className="absolute bottom-[-140px] left-[35%] h-[320px] w-[320px] rounded-full bg-emerald-100/28 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.70))]" />
      </div>

      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-8">
          <Link
            href={`/admin/jobs/${id}`}
            className="inline-flex items-center rounded-2xl border border-white/90 bg-white/82 px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.05)] backdrop-blur-md transition hover:bg-white"
          >
            ← Vissza az állás adatapjához
          </Link>
        </div>

        <div className="mb-8">
          <SectionTag>Jelentkezők</SectionTag>
          <h1 className="mt-6 text-[42px] font-black tracking-[-0.05em] text-slate-950 lg:text-[56px]">
            {title}
          </h1>
        </div>

        {isLocked ? (
          <div className="rounded-[30px] border border-rose-200 bg-[linear-gradient(180deg,rgba(255,241,242,0.98),rgba(255,228,230,0.78))] p-8 text-center shadow-[0_18px_40px_rgba(244,63,94,0.08)] md:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 ring-1 ring-rose-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-rose-500"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h2 className="mb-4 text-2xl font-black tracking-[-0.03em] text-slate-900">
              Elérted az 5 jelentkezős limitet
            </h2>

            <p className="mx-auto mb-8 max-w-xl text-lg leading-8 text-slate-600">
              Jelenleg <strong>{applicationsCount}</strong> jelentkező várja, hogy
              megnézd az adatait. A korlátlan hozzáférés érdekében oldd fel a
              jelentkezőket fizetéssel.
            </p>

            <div className="mx-auto max-w-sm">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-6 py-4 text-base font-semibold text-white shadow-[0_18px_42px_rgba(14,165,233,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(14,165,233,0.32)]"
              >
                Feloldás fizetéssel
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
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {!applicantsLoadError && applicantRecords.length === 0 && (
              <div className="rounded-[28px] border border-white/85 bg-white/82 p-12 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
                Még nincsenek jelentkezők erre az állásra.
              </div>
            )}

            {applicantsLoadError && (
              <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-600 shadow-[0_16px_34px_rgba(239,68,68,0.06)]">
                Hiba történt a jelentkezők betöltésekor. Próbáld újra később.
              </div>
            )}

            {applicantRecords.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {applicantRecords.map((applicant) => (
                  <Link
                    key={applicant.id}
                    href={`/admin/applications/${applicant.id}`}
                    className="flex flex-col rounded-[24px] border border-white/85 bg-white/82 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_18px_44px_rgba(15,23,42,0.08)] cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3
                        className="truncate text-xl font-black tracking-[-0.03em] text-slate-900"
                        title={applicant.name}
                      >
                        {applicant.name || "Névtelen jelentkező"}
                      </h3>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3 text-slate-600">
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
                            className="flex-shrink-0 text-slate-400"
                          >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          <span className="truncate" title={applicant.email}>
                            {applicant.email || "-"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-600">
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
                            className="flex-shrink-0 text-slate-400"
                          >
                            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                            <path d="M12 18h.01" />
                          </svg>
                          <span className="truncate" title={applicant.phone}>
                            {applicant.phone || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs uppercase tracking-wider text-slate-400">
                        Jelentkezés ideje
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {applicant.createdDate}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}