import Link from "next/link";
import Airtable from "airtable";
import { notFound, redirect } from "next/navigation";
import { getCurrentAirtableUser } from "@/lib/current-airtable-user";
import { unlockApplicants } from "./unlock";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

function getStatusLabel(status: string): string {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "active":
    case "aktív":
    case "aktiv":
      return "Aktív";
    case "draft":
      return "Piszkozat";
    case "paused":
      return "Szüneteltetve";
    case "closed":
      return "Lezárt";
    default:
      return status || "Ismeretlen";
  }
}

function getStatusClasses(status: string): string {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "active":
    case "aktív":
    case "aktiv":
      return "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-500/20";
    case "draft":
      return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20";
    case "paused":
      return "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-500/20";
    case "closed":
      return "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-500/20";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20";
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{children}</p>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/85 bg-white/82 p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] backdrop-blur-md">
      <SectionLabel>{label}</SectionLabel>
      <p className="mt-3 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default async function AdminJobDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;

  if (query.payment === "demo") {
    try {
      await unlockApplicants(id);
    } catch (error) {
      // ignore silently
    }
    redirect(`/admin/jobs/${id}`);
  }

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
      <main className="min-h-screen bg-[#f4f7f9] text-slate-900">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[#f4f7f9]" />
          <div className="absolute left-[-120px] top-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-200/34 blur-[110px]" />
          <div className="absolute right-[-120px] top-[40px] h-[340px] w-[340px] rounded-full bg-sky-200/28 blur-[120px]" />
          <div className="absolute bottom-[-140px] left-[35%] h-[320px] w-[320px] rounded-full bg-emerald-100/28 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl p-6 md:p-8">
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-[0_14px_36px_rgba(239,68,68,0.08)]">
            <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-900">
              Állás részletek
            </h1>
            <p className="mt-3 text-sm text-red-700">
              Hiányzik az Airtable konfiguráció. Ellenőrizd az env változókat:
            </p>
            <div className="mt-4 space-y-2 text-sm text-red-600">
              <div>AIRTABLE_TOKEN</div>
              <div>AIRTABLE_BASE_ID</div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  Airtable.configure({ apiKey: token });
  const base = Airtable.base(baseId);

  let record: Airtable.Record<Airtable.FieldSet>;

  try {
    record = await base("Jobs").find(id);
  } catch (error) {
    console.error("Nem található az állás rekord:", error);
    notFound();
  }

  if (!matchesCurrentUser(record.get("User"), currentEmail)) {
    notFound();
  }

  const title =
    getFirstString(record.get("Title")) ||
    getFirstString(record.get("Job Title")) ||
    "Névtelen állás";

  const company =
    getFirstString(record.get("Company")) ||
    getFirstString(record.get("Company Name")) ||
    "Nincs megadva";

  const location =
    getFirstString(record.get("Campaign Target Location")) ||
    getFirstString(record.get("Location")) ||
    "Nincs megadva";

  const campaignGoal =
    getFirstString(record.get("Campaign Goal")) || "Nincs megadva";

  const facebookPostText =
    getFirstString(record.get("Facebook Post Text")) || "Nincs megadva";

  const status = getFirstString(record.get("Status")) || "draft";
  const applications = getStringArray(record.get("Applications"));
  const applicationsCount = applications.length;

  const applicantsUnlocked = getBoolean(record.get("applicants_unlocked"));
  const isLocked = applicationsCount >= 5 && !applicantsUnlocked;

  const createdAt = formatDate(record.get("Created"));
  const updatedAt = formatDate(record.get("Updated time"));

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
            href="/admin/jobs"
            className="inline-flex items-center rounded-2xl border border-white/90 bg-white/82 px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.05)] backdrop-blur-md transition hover:bg-white"
          >
            ← Vissza az állásokhoz
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="rounded-[30px] border border-white/85 bg-white/82 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <SectionLabel>Állás részletek</SectionLabel>
                  <h1 className="mt-2 text-[46px] font-black leading-[0.95] tracking-[-0.05em] text-slate-900">
                    {title}
                  </h1>
                  <p className="mt-3 text-sm text-slate-500">Tulajdonos: saját fiók</p>
                </div>

                <span
                  className={`inline-flex h-fit rounded-full px-3 py-1.5 text-sm font-semibold ${getStatusClasses(
                    status,
                  )}`}
                >
                  {getStatusLabel(status)}
                </span>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <InfoCard label="Cég" value={company} />
              <InfoCard label="Helyszín" value={location} />
              <InfoCard label="Kampány cél" value={campaignGoal} />
              <InfoCard
                label="Jelentkezők állapota"
                value={applicantsUnlocked ? "Feloldva" : "Zárolva"}
              />
              <InfoCard label="Létrehozva" value={createdAt} />
              <InfoCard label="Frissítve" value={updatedAt} />
            </section>

            <section className="rounded-[30px] border border-white/85 bg-white/82 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <SectionLabel>Facebook poszt szöveg</SectionLabel>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900">
                    Hirdetési szöveg
                  </h2>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-100 bg-slate-50/90 p-5">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                  {facebookPostText}
                </p>
              </div>
            </section>

            <section className="rounded-[30px] border border-white/85 bg-white/82 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <SectionLabel>Jelentkezők és paywall</SectionLabel>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900">
                    Jelentkezések kezelése
                  </h2>
                </div>

                <div className="rounded-[20px] border border-white/85 bg-white/84 px-4 py-3 text-right shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  <p className="text-xs text-slate-500">Jelenlegi jelentkezések</p>
                  <p className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-900">
                    {applicationsCount}
                  </p>
                </div>
              </div>

              {isLocked ? (
                <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-5">
                  <h3 className="text-lg font-semibold text-rose-700">
                    Elérted az 5 jelentkezős limitet
                  </h3>
                  <p className="mb-5 mt-2 text-sm leading-6 text-rose-600">
                    Ennél az állásnál már legalább 5 jelentkező beérkezett, ezért a
                    jelentkezők megtekintése jelenleg zárolva van. A további
                    hozzáférés fizetés után oldható fel.
                  </p>
                  <Link
                    href={`/admin/jobs/${id}/checkout`}
                    className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(14,165,233,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(14,165,233,0.32)]"
                  >
                    Tovább a fizetéshez
                  </Link>
                </div>
              ) : (
                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-semibold text-emerald-700">
                    A jelentkezők elérhetők
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-600">
                    Ennél az állásnál a jelentkezők jelenleg megtekinthetők. A
                    zárolás csak akkor aktiválódik, ha legalább 5 jelentkező érkezik
                    be és az állás nincs feloldva.
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[30px] border border-white/85 bg-white/82 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
              <SectionLabel>Gyors műveletek</SectionLabel>

              <div className="mt-4 space-y-3">
                {isLocked ? (
                  <div className="space-y-3">
                    <Link
                      href={`/admin/jobs/${id}/checkout`}
                      className="block w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_16px_36px_rgba(14,165,233,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(14,165,233,0.32)]"
                    >
                      Tovább a fizetéshez
                    </Link>
                    <button
                      type="button"
                      disabled
                      className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400"
                    >
                      Jelentkezők megtekintése
                    </button>
                  </div>
                ) : (
                  <Link
                    href={`/admin/jobs/${id}/applications`}
                    className="block w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_16px_36px_rgba(14,165,233,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(14,165,233,0.32)]"
                  >
                    Jelentkezők megtekintése
                  </Link>
                )}

                <Link
                  href="/admin/jobs"
                  className="block w-full rounded-2xl border border-white/90 bg-white/86 px-4 py-3 text-center text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:bg-white"
                >
                  Állásokhoz vissza
                </Link>
              </div>
            </section>

            <section className="rounded-[30px] border border-white/85 bg-white/82 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
              <SectionLabel>Állapot összegzés</SectionLabel>

              <div className="mt-4 space-y-4">
                <div className="rounded-[20px] border border-slate-100 bg-slate-50/90 p-4">
                  <p className="text-xs text-slate-500">Státusz</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {getStatusLabel(status)}
                  </p>
                </div>

                <div className="rounded-[20px] border border-slate-100 bg-slate-50/90 p-4">
                  <p className="text-xs text-slate-500">Jelentkezők száma</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {applicationsCount} db
                  </p>
                </div>

                <div className="rounded-[20px] border border-slate-100 bg-slate-50/90 p-4">
                  <p className="text-xs text-slate-500">Feloldás</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {applicantsUnlocked ? "Igen" : "Nem"}
                  </p>
                </div>

                <div className="rounded-[20px] border border-slate-100 bg-slate-50/90 p-4">
                  <p className="text-xs text-slate-500">Paywall állapot</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {isLocked ? "Aktív zárolás" : "Nincs zárolás"}
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}