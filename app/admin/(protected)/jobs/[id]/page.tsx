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
      return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30";
    case "draft":
      return "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30";
    case "paused":
      return "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30";
    case "closed":
      return "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30";
  }
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
      <main className="min-h-screen bg-[#020817] text-white">
        <div className="mx-auto max-w-6xl p-6 md:p-8">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h1 className="text-2xl font-semibold">Állás részletek</h1>
            <p className="mt-3 text-sm text-red-100">
              Hiányzik az Airtable konfiguráció. Ellenőrizd az env változókat:
            </p>
            <div className="mt-4 space-y-2 text-sm text-red-200">
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
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-8">
          <Link
            href="/admin/jobs"
            className="inline-flex items-center rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/70 hover:text-white"
          >
            ← Vissza az állásokhoz
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-[#06101f] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Állás részletek
                  </p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    {title}
                  </h1>
                  <p className="mt-3 text-sm text-slate-400">
                    Tulajdonos: saját fiók
                  </p>
                </div>

                <span
                  className={`inline-flex h-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    status,
                  )}`}
                >
                  {getStatusLabel(status)}
                </span>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-[#06101f] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Cég
                </p>
                <p className="mt-3 text-base font-medium text-white">{company}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#06101f] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Helyszín
                </p>
                <p className="mt-3 text-base font-medium text-white">{location}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#06101f] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Kampány cél
                </p>
                <p className="mt-3 text-base font-medium text-white">
                  {campaignGoal}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#06101f] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Jelentkezők állapota
                </p>
                <p className="mt-3 text-base font-medium text-white">
                  {applicantsUnlocked ? "Feloldva" : "Zárolva"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#06101f] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Létrehozva
                </p>
                <p className="mt-3 text-base font-medium text-white">{createdAt}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#06101f] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Frissítve
                </p>
                <p className="mt-3 text-base font-medium text-white">{updatedAt}</p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-[#06101f] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Facebook poszt szöveg
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">Hirdetési szöveg</h2>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
                  {facebookPostText}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-[#06101f] p-6">
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Jelentkezők és paywall
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Jelentkezések kezelése
                  </h2>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-right">
                  <p className="text-xs text-slate-500">Jelenlegi jelentkezések</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {applicationsCount}
                  </p>
                </div>
              </div>

              {isLocked ? (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5">
                  <h3 className="text-lg font-semibold text-rose-200">
                    Elérted az 5 jelentkezős limitet
                  </h3>
                  <p className="mt-2 mb-5 text-sm leading-6 text-rose-100">
                    Ennél az állásnál már legalább 5 jelentkező beérkezett, ezért a
                    jelentkezők megtekintése jelenleg zárolva van. A további
                    hozzáférés fizetés után oldható fel.
                  </p>
                  <Link
                    href={`/admin/jobs/${id}/checkout`}
                    className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                  >
                    Tovább a fizetéshez
                  </Link>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                  <h3 className="text-lg font-semibold text-emerald-200">
                    A jelentkezők elérhetők
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-100">
                    Ennél az állásnál a jelentkezők jelenleg megtekinthetők. A
                    zárolás csak akkor aktiválódik, ha legalább 5 jelentkező érkezik
                    be és az állás nincs feloldva.
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-[#06101f] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Gyors műveletek
              </p>

              <div className="mt-4 space-y-3">
                {isLocked ? (
                  <div className="space-y-3">
                    <Link
                      href={`/admin/jobs/${id}/checkout`}
                      className="block w-full text-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                      Tovább a fizetéshez
                    </Link>
                    <button
                      type="button"
                      disabled
                      className="w-full cursor-not-allowed rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-slate-500"
                    >
                      Jelentkezők megtekintése
                    </button>
                  </div>
                ) : (
                  <Link
                    href={`/admin/jobs/${id}/applications`}
                    className="block w-full text-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
                  >
                    Jelentkezők megtekintése
                  </Link>
                )}

                <Link
                  href="/admin/jobs"
                  className="block w-full rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                >
                  Állásokhoz vissza
                </Link>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-[#06101f] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Állapot összegzés
              </p>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">Státusz</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {getStatusLabel(status)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">Jelentkezők száma</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {applicationsCount} db
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">Feloldás</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {applicantsUnlocked ? "Igen" : "Nem"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">Paywall állapot</p>
                  <p className="mt-1 text-sm font-medium text-white">
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