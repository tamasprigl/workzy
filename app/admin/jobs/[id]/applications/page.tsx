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

// --- Helper Functions ---

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

// --- Page Component ---

export default async function AdminJobApplicationsPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Get logged in user (email)
  const currentUser = await getCurrentAirtableUser();
  const currentEmail =
    normalizeLower(
      typeof currentUser === "string"
        ? currentUser
        : currentUser && typeof currentUser === "object" && "email" in currentUser
          ? (currentUser as { email?: string }).email
          : "",
    ) || "";

  // 2. If no email -> redirect to /admin/login
  if (!currentEmail) {
    redirect("/admin/login");
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    return (
      <main className="min-h-screen bg-[#020817] text-white">
        <div className="mx-auto max-w-6xl p-6 md:p-8">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h1 className="text-2xl font-semibold">Hiba</h1>
            <p className="mt-3 text-sm text-red-100">
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

  // 3. Load job from Airtable (Jobs table) using params.id
  try {
    jobRecord = await base("Jobs").find(id);
  } catch (error) {
    console.error("Nem található az állás rekord:", error);
    notFound();
  }

  // 4. Check ownership using "User" field (email match)
  // 5. If not owner -> notFound()
  if (!matchesCurrentUser(jobRecord.get("User"), currentEmail)) {
    notFound();
  }

  // 6. Read: Applications (linked records), applicants_unlocked, Title
  const title =
    getFirstString(jobRecord.get("Title")) ||
    getFirstString(jobRecord.get("Job Title")) ||
    "Névtelen állás";

  const applications = getStringArray(jobRecord.get("Applications"));
  const applicantsUnlocked = getBoolean(jobRecord.get("applicants_unlocked"));

  // 7. Compute: applicationsCount, isLocked = applicationsCount >= 5 && !applicantsUnlocked
  const applicationsCount = applications.length;
  const isLocked = applicationsCount >= 5 && !applicantsUnlocked;

  // 8 & 9. Load Applicants if NOT locked
  let applicantRecords: any[] = [];
  let applicantsLoadError = false;

  if (!isLocked && applicationsCount > 0) {
    try {
      // Chunking if there are many applications, or simply fetching them via formula if possible.
      // Easiest is to fetch them one by one if not too many, or use a formula matching RECORD_ID()
      // To be safe and efficient, we will use filterByFormula with OR
      const formula = `OR(${applications.map(appId => `RECORD_ID() = '${appId}'`).join(',')})`;
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
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/admin/jobs/${id}`}
            className="inline-flex items-center rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/70 hover:text-white"
          >
            ← Vissza az állás adatapjához
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Jelentkezők
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>
        </div>

        {isLocked ? (
          /* 8. IF LOCKED: Show a full paywall UI */
          <div className="rounded-2xl border border-rose-500/20 bg-[#06101f] p-8 md:p-12 text-center shadow-lg">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/20 ring-1 ring-rose-500/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Elérted az 5 jelentkezős limitet
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8 text-lg">
              Jelenleg <strong>{applicationsCount}</strong> jelentkező várja, hogy megnézd az adatait. A korlátlan hozzáférés érdekében oldd fel a jelentkezőket fizetéssel.
            </p>
            <div className="mx-auto max-w-sm space-y-4">
              <button
                type="button"
                className="w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-500 flex items-center justify-center gap-2"
              >
                Feloldás fizetéssel
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        ) : (
          /* 9. IF NOT LOCKED: Show list */
          <div className="space-y-6">
            {!applicantsLoadError && applicantRecords.length === 0 && (
              <div className="rounded-2xl border border-slate-800 bg-[#06101f] p-12 text-center text-slate-400">
                Még nincsenek jelentkezők erre az állásra.
              </div>
            )}

            {applicantsLoadError && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-200">
                Hiba történt a jelentkezők betöltésekor. Próbáld újra később.
              </div>
            )}

            {applicantRecords.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {applicantRecords.map((applicant) => (
                  <div key={applicant.id} className="rounded-2xl border border-slate-800 bg-[#06101f] p-6 shadow-sm flex flex-col transition hover:border-slate-700">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white truncate" title={applicant.name}>
                        {applicant.name || "Névtelen jelentkező"}
                      </h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3 text-slate-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 flex-shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                          <span className="truncate" title={applicant.email}>{applicant.email || "-"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 flex-shrink-0"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                          <span className="truncate" title={applicant.phone}>{applicant.phone || "-"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-slate-500">Jelentkezés ideje</span>
                      <span className="text-xs font-medium text-slate-400">{applicant.createdDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
