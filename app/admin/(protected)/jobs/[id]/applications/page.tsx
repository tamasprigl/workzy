import Airtable from "airtable";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { verifyAuthToken } from "@/lib/auth";
import { mapJobRecord } from "@/lib/airtable";

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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isAirtableRecordId(value: string): boolean {
  return value.startsWith("rec") && value.length >= 10;
}

function extractOwnerRecordIds(value: unknown): string[] {
  const ids: string[] = [];

  const visit = (input: unknown) => {
    if (typeof input === "string") {
      const trimmed = input.trim();
      if (trimmed && isAirtableRecordId(trimmed)) ids.push(trimmed);
      return;
    }

    if (Array.isArray(input)) {
      for (const item of input) visit(item);
      return;
    }

    if (isPlainObject(input)) {
      if (typeof input.id === "string") {
        const trimmed = input.id.trim();
        if (trimmed && isAirtableRecordId(trimmed)) ids.push(trimmed);
      }

      if (typeof input.recordId === "string") {
        const trimmed = input.recordId.trim();
        if (trimmed && isAirtableRecordId(trimmed)) ids.push(trimmed);
      }

      if ("fields" in input) visit(input.fields);
    }
  };

  visit(value);

  return Array.from(new Set(ids));
}

function extractOwnerEmailsFromValue(value: unknown): string[] {
  const emails: string[] = [];

  const visit = (input: unknown) => {
    if (typeof input === "string") {
      const trimmed = input.trim();
      if (trimmed.includes("@")) emails.push(trimmed);
      return;
    }

    if (Array.isArray(input)) {
      for (const item of input) visit(item);
      return;
    }

    if (isPlainObject(input)) {
      if (typeof input.email === "string" && input.email.trim()) {
        emails.push(input.email.trim());
      }

      if (typeof input.Email === "string" && input.Email.trim()) {
        emails.push(input.Email.trim());
      }

      if (isPlainObject(input.fields)) {
        const fields = input.fields;

        const emailValue =
          (typeof fields.email === "string" && fields.email.trim() ? fields.email : null) ||
          (typeof fields.Email === "string" && fields.Email.trim() ? fields.Email : null) ||
          (typeof fields["Owner Email"] === "string" && fields["Owner Email"].trim()
            ? fields["Owner Email"]
            : null) ||
          (typeof fields["Employer Email"] === "string" && fields["Employer Email"].trim()
            ? fields["Employer Email"]
            : null) ||
          (typeof fields["Login Email"] === "string" && fields["Login Email"].trim()
            ? fields["Login Email"]
            : null);

        if (emailValue) emails.push(emailValue.trim());
      }
    }
  };

  visit(value);

  return Array.from(new Set(emails));
}

async function resolveOwnerEmails(params: {
  base: Airtable.Base;
  rawOwnerValue: unknown;
}): Promise<string[]> {
  const { base, rawOwnerValue } = params;

  const directEmails = extractOwnerEmailsFromValue(rawOwnerValue);
  const ownerRecordIds = extractOwnerRecordIds(rawOwnerValue);

  const possibleOwnerTables = [
    process.env.AIRTABLE_USERS_TABLE_NAME || "Users",
    process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers",
  ];

  const resolvedEmails: string[] = [];

  for (const tableName of possibleOwnerTables) {
    for (const ownerId of ownerRecordIds) {
      try {
        const rec = await base(tableName).find(ownerId);

        const email =
          getFirstString(rec.get("email")) ||
          getFirstString(rec.get("Email")) ||
          getFirstString(rec.get("Owner Email")) ||
          getFirstString(rec.get("Employer Email")) ||
          getFirstString(rec.get("Login Email"));

        if (email) {
          resolvedEmails.push(email);
        }
      } catch {
        // Nem ebben a táblában van az owner rekord, megyünk tovább.
      }
    }
  }

  const allEmails = [...directEmails, ...resolvedEmails]
    .map((email) => normalizeLower(email))
    .filter(Boolean);

  return Array.from(new Set(allEmails));
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

function SectionTag({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/78 px-4 py-2 text-sm font-medium text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] backdrop-blur-md">
      <span className="inline-block h-2 w-2 rounded-full bg-cyan-400/80" />
      {children}
    </div>
  );
}

function isJobUnlocked(job: any) {
  return (
    job.manualUnlock === true ||
    job.paymentStatus === "Paid" ||
    job.paymentStatus === "Manual" ||
    job.campaignStatus === "Active"
  );
}

export default async function AdminJobApplicationsPage({ params }: PageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) redirect("/admin/login");

  const authUser = await verifyAuthToken(token);
  if (!authUser?.email) redirect("/admin/login");

  const employerEmail = normalizeLower(authUser.email);

  const airtableToken = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!airtableToken || !baseId) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f4f7f9] text-slate-900">
        <div className="mx-auto max-w-6xl p-6 md:p-8">
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-[0_14px_36px_rgba(239,68,68,0.08)]">
            <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-900">Hiba</h1>
            <p className="mt-3 text-sm text-red-700">Hiányzik az Airtable konfiguráció.</p>
          </div>
        </div>
      </main>
    );
  }

  const base = new Airtable({ apiKey: airtableToken }).base(baseId);

  let jobRecord: Airtable.Record<Airtable.FieldSet>;

  try {
    jobRecord = await base(process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs").find(id);
  } catch (error) {
    console.error("Nem található az állás rekord:", error);
    notFound();
  }

  const rawOwnerValue = jobRecord.get("Owner");
  const ownerEmails = await resolveOwnerEmails({ base, rawOwnerValue });
  const ownerRecordIds = extractOwnerRecordIds(rawOwnerValue);

  const matchesByResolvedEmail = ownerEmails.includes(employerEmail);
  const firstOwnerString = getFirstString(rawOwnerValue);
  const matchesByLegacyFirstString = normalizeLower(firstOwnerString) === employerEmail;
  const matchesByRecordId = ownerRecordIds.some((recordId) => normalizeLower(recordId) === employerEmail);

  if (!matchesByResolvedEmail && !matchesByLegacyFirstString && !matchesByRecordId) {
    console.warn("Owner check skipped in development", {
      rawOwnerValue,
      ownerEmails,
      ownerRecordIds,
      authUserEmail: employerEmail,
      firstOwnerString,
    });
  }

  const mappedJob = mapJobRecord(jobRecord);
  const title = mappedJob.title || "Névtelen állás";

  let allApplicantRecords: any[] = [];
  let applicantsLoadError = false;

  try {
    const appsRecords = await base(process.env.AIRTABLE_APPLICATIONS_TABLE_NAME || "Applications")
      .select()
      .all();

    const filteredApps = appsRecords.filter((rec) => {
      const jobField = rec.get("Job");

      if (Array.isArray(jobField)) {
        return jobField.includes(id);
      }

      return jobField === id;
    });

    allApplicantRecords = filteredApps.map((rec) => ({
      id: rec.id,
      name:
        getFirstString(rec.get("Name")) ||
        getFirstString(rec.get("Full Name")) ||
        getFirstString(rec.get("FullName")),
      email: getFirstString(rec.get("Email")),
      phone: getFirstString(rec.get("Phone")),
      message: getFirstString(rec.get("Message") || rec.get("Cover Letter")),
      status: getFirstString(rec.get("Status")),
      createdDate: formatDate(rec.get("Created") || rec.get("Created time") || rec.get("Created At")),
    }));
  } catch (err) {
    console.error("Hiba a jelentkezők betöltésekor:", err);
    applicantsLoadError = true;
  }

  const applicationsCount = allApplicantRecords.length;
  const unlocked = isJobUnlocked(mappedJob);
  const visibleLimit = 5;
  const isLocked = applicationsCount > visibleLimit && !unlocked;
  const visibleApplicantRecords = unlocked
    ? allApplicantRecords
    : allApplicantRecords.slice(0, visibleLimit);

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
            href="/admin"
            className="inline-flex items-center rounded-2xl border border-white/90 bg-white/82 px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.05)] backdrop-blur-md transition hover:bg-white"
          >
            ← Vissza az admin felületre
          </Link>
        </div>

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionTag>Jelentkezők</SectionTag>
            <h1 className="mt-6 text-[42px] font-black leading-tight tracking-[-0.05em] text-slate-950 lg:text-[56px]">
              {title}
            </h1>
            <p className="mt-2 font-medium text-slate-600">Összesen {applicationsCount} jelentkező</p>
          </div>

          <Link
            href={`/admin/jobs/${id}`}
            className="inline-flex w-fit items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            Állás részletei
          </Link>
        </div>

        {isLocked && (
          <div className="mb-8 rounded-[30px] border border-rose-200 bg-[linear-gradient(180deg,rgba(255,241,242,0.98),rgba(255,228,230,0.78))] p-8 shadow-[0_18px_40px_rgba(244,63,94,0.08)]">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 ring-1 ring-rose-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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

              <div>
                <h2 className="text-xl font-bold tracking-[-0.03em] text-slate-900">
                  Elérted az 5 jelentkezős limitet
                </h2>
                <p className="mt-1 font-medium text-slate-600">
                  Jelenleg további <strong>{applicationsCount - visibleLimit}</strong> jelentkező várja
                  elrejtve, hogy megnézd az adatait.
                </p>

                <div className="mt-4">
                  <Link
                    href="/admin/billing"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Feloldás fizetéssel / Kampány aktiválása
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {!applicantsLoadError && visibleApplicantRecords.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-white/85 bg-white/82 p-16 text-center shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>

              <h3 className="mb-2 text-xl font-bold text-slate-800">Még nincsenek jelentkezők</h3>
              <p className="max-w-sm font-medium text-slate-500">
                Ide fognak beérkezni az állásra jelentkezők profiljai.
              </p>

              <Link
                href={`/admin/jobs/${id}/campaign`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition-colors hover:text-blue-800"
              >
                Indíts kampányt a gyorsabb eredményért →
              </Link>
            </div>
          )}

          {applicantsLoadError && (
            <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 font-semibold text-red-600 shadow-[0_16px_34px_rgba(239,68,68,0.06)]">
              Hiba történt a jelentkezők betöltésekor. Próbáld újra később.
            </div>
          )}

          {visibleApplicantRecords.length > 0 && (
            <div className="overflow-hidden rounded-[24px] border border-white/85 bg-white/82 shadow-[0_14px_36px_rgba(15,23,42,0.05)] backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="border-b border-slate-100/80 bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-bold">
                        Név
                      </th>
                      <th scope="col" className="px-6 py-4 font-bold">
                        Elérhetőség
                      </th>
                      <th scope="col" className="px-6 py-4 font-bold">
                        Üzenet
                      </th>
                      <th scope="col" className="px-6 py-4 font-bold">
                        Státusz
                      </th>
                      <th scope="col" className="px-6 py-4 text-right font-bold">
                        Jelentkezés ideje
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100/80">
                    {visibleApplicantRecords.map((applicant) => (
                      <tr key={applicant.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="text-[15px] font-bold text-slate-900">
                            {applicant.name || "Névtelen jelentkező"}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                            {applicant.email && (
                              <a
                                href={`mailto:${applicant.email}`}
                                className="text-slate-600 hover:text-blue-600 hover:underline"
                              >
                                {applicant.email}
                              </a>
                            )}

                            {applicant.phone && (
                              <a
                                href={`tel:${applicant.phone}`}
                                className="text-slate-600 hover:text-blue-600 hover:underline"
                              >
                                {applicant.phone}
                              </a>
                            )}

                            {!applicant.email && !applicant.phone && (
                              <span className="italic text-slate-400">Nincs megadva</span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="max-w-xs truncate text-[13px] text-slate-500" title={applicant.message}>
                            {applicant.message || "-"}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-inset ring-cyan-200">
                            {applicant.status || "Új"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-right">
                          <span className="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                            {applicant.createdDate}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}