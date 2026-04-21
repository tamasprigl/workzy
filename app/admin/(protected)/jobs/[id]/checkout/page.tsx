import Link from "next/link";
import Airtable from "airtable";
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

function getNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value.trim());
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function formatCurrencyHu(value: number): string {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 0,
  }).format(value);
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

export default async function AdminCheckoutPage({ params }: PageProps) {
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
      <main className="min-h-screen bg-[#020817] text-white">
        <div className="mx-auto max-w-6xl p-6 md:p-8">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h1 className="text-2xl font-semibold">Tovább a fizetéshez</h1>
            <p className="mt-3 text-sm text-red-100">
              Hiányzik az Airtable konfiguráció. Ellenőrizd az env változókat.
            </p>
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

  const title = getFirstString(record.get("Title")) || "Névtelen állás";
  const company = getFirstString(record.get("Company")) || "Nincs megadva";
  const location =
    getFirstString(record.get("Campaign Target Location")) ||
    getFirstString(record.get("Location")) ||
    "Nincs megadva";
  const status = getFirstString(record.get("Status")) || "draft";
  const applications = getStringArray(record.get("Applications"));
  const applicationsCount = applications.length;
  const applicantsUnlocked = getBoolean(record.get("applicants_unlocked"));
  const isLocked = applicationsCount >= 5 && !applicantsUnlocked;

  const baseUnlockFee = 19990;
  let campaignBudget = getNumber(record.get("Campaign Budget Daily"));
  if (campaignBudget === 0) {
    campaignBudget = 25000;
  }

  const totalPrice = baseUnlockFee + campaignBudget;

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-8">
          <Link
            href={`/admin/jobs/${id}`}
            className="inline-flex items-center rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/70 hover:text-white"
          >
            ← Vissza az álláshoz
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Jelentkezők feloldása
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-[#06101f] p-6 lg:p-8">
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Csomag részletezése
                </p>
                <h2 className="text-xl font-semibold">Jelentkező feloldás + hirdetési keret</h2>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-white">Feloldási díj</p>
                    <p className="text-sm text-slate-400">Jelenlegi hozzáférés feloldása az álláshoz</p>
                  </div>
                  <p className="text-lg font-medium text-white">{formatCurrencyHu(baseUnlockFee)}</p>
                </div>

                <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-white">Kampány keret</p>
                    <p className="text-sm text-slate-400">
                      A kampány keret nem napi költség, hanem a teljes kampányra szánt összeg.
                    </p>
                  </div>
                  <p className="text-lg font-medium text-white">{formatCurrencyHu(campaignBudget)}</p>
                </div>
              </div>

              <div className="my-6 border-t border-slate-800"></div>

              <div className="flex items-center justify-between rounded-xl bg-slate-900 px-6 py-5 ring-1 ring-slate-800">
                <p className="text-lg font-medium text-slate-300">Fizetendő összesen</p>
                <p className="text-3xl font-bold tracking-tight text-white">{formatCurrencyHu(totalPrice)}</p>
              </div>

              <div className="mt-8">
                {applicantsUnlocked ? (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center">
                    <h3 className="text-lg font-medium text-emerald-200">
                      Már fel van oldva
                    </h3>
                    <p className="mt-2 text-sm text-emerald-100">
                      Ehhez az álláshoz a jelentkezők már elérhetők.
                    </p>
                    <div className="mt-4">
                      <Link
                        href={`/admin/jobs/${id}/applications`}
                        className="inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
                      >
                        Jelentkezők megtekintése
                      </Link>
                    </div>
                  </div>
                ) : isLocked ? (
                  <div className="space-y-3">
                    <Link
                      href={`/admin/jobs/${id}?payment=demo`}
                      className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-blue-500"
                    >
                      Tovább a fizetéshez
                    </Link>
                    <p className="text-center text-xs text-slate-500">
                      Stripe fizetés később kerül bekötésre
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-5 text-center">
                    <h3 className="text-lg font-medium text-blue-200">
                      Fizetés még nem szükséges
                    </h3>
                    <p className="mt-2 text-sm text-blue-100">
                      Az első 5 jelentkezés ingyenesen elérhető. A fizetés csak további jelentkezők esetén szükséges.
                    </p>
                    <div className="mt-4">
                      <Link
                        href={`/admin/jobs/${id}/applications`}
                        className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                      >
                        Jelentkezők megtekintése
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-[#06101f] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Állás részletek
              </p>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">Név</p>
                  <p className="mt-1 text-sm font-medium text-white">{title}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">Cég</p>
                  <p className="mt-1 text-sm font-medium text-white">{company}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">Helyszín</p>
                  <p className="mt-1 text-sm font-medium text-white">{location}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">Jelentkezők</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {applicationsCount} db
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">Státusz</p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                        status,
                      )}`}
                    >
                      {getStatusLabel(status)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">Jelenlegi hozzáférés</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {applicantsUnlocked ? "Feloldva" : isLocked ? "Zárolva" : "Ingyenesen Elérhető"}
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
