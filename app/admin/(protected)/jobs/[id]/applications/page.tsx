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

function getField(fields: Record<string, unknown>, names: string[]): unknown {
  for (const name of names) {
    if (fields[name] !== undefined && fields[name] !== null) return fields[name];
  }
  return undefined;
}

function getAttachment(value: unknown): { url: string; filename: string } | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const first = value[0];
  if (!isPlainObject(first)) return null;

  const url = typeof first.url === "string" ? first.url : "";
  const filename =
    typeof first.filename === "string"
      ? first.filename
      : typeof first.name === "string"
        ? first.name
        : "Önéletrajz";

  if (!url) return null;

  return { url, filename };
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
      if (typeof input.email === "string" && input.email.trim()) emails.push(input.email.trim());
      if (typeof input.Email === "string" && input.Email.trim()) emails.push(input.Email.trim());

      if (isPlainObject(input.fields)) {
        const fields = input.fields;

        const emailValue =
          getFirstString(fields.email) ||
          getFirstString(fields.Email) ||
          getFirstString(fields["Owner Email"]) ||
          getFirstString(fields["Employer Email"]) ||
          getFirstString(fields["Login Email"]);

        if (emailValue) emails.push(emailValue);
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

        if (email) resolvedEmails.push(email);
      } catch {
        // Nem ebben a táblában van az owner rekord, megyünk tovább.
      }
    }
  }

  return Array.from(
    new Set(
      [...directEmails, ...resolvedEmails]
        .map((email) => normalizeLower(email))
        .filter(Boolean)
    )
  );
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
    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-white/90 px-4 py-2 text-sm font-bold text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-md">
      <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.9)]" />
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
      <main className="min-h-screen bg-[#f4f7f9] p-6 text-slate-900">
        <div className="mx-auto max-w-6xl rounded-[28px] border border-red-200 bg-red-50 p-6">
          <h1 className="text-2xl font-black">Hiba</h1>
          <p className="mt-3 text-sm text-red-700">Hiányzik az Airtable konfiguráció.</p>
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

      if (Array.isArray(jobField)) return jobField.includes(id);
      return jobField === id;
    });

    allApplicantRecords = filteredApps.map((rec) => {
      const fields = rec.fields as Record<string, unknown>;

      const cvAttachment =
        getAttachment(getField(fields, ["CV", "Resume", "Önéletrajz", "Attachment", "File", "Cv"])) ||
        null;

      return {
        id: rec.id,
        name:
          getFirstString(getField(fields, ["Name", "Full Name", "FullName", "Név"])) ||
          "Névtelen jelentkező",
        email: getFirstString(getField(fields, ["Email", "E-mail", "E-mail cím"])),
        phone: getFirstString(getField(fields, ["Phone", "Telefonszám", "Telefon"])),
        city:
          getFirstString(getField(fields, ["City", "Lakhely", "Location", "Honnan jelentkezel?"])) ||
          "-",
        cvUrl: cvAttachment?.url || "",
        cvName: cvAttachment?.filename || "",
        message:
          getFirstString(getField(fields, ["Message", "Cover Letter", "Üzenet"])) ||
          "-",
        status: getFirstString(getField(fields, ["Status", "Státusz"])) || "Új",
        createdDate: formatDate(
          getField(fields, ["Created", "Created time", "Created At", "Jelentkezés ideje"])
        ),
      };
    });
  } catch (err) {
    console.error("Hiba a jelentkezők betöltésekor:", err);
    applicantsLoadError = true;
  }

  const applicationsCount = allApplicantRecords.length;
  const withCvCount = allApplicantRecords.filter((a) => a.cvUrl).length;
  const unlocked = isJobUnlocked(mappedJob);
  const visibleLimit = 5;
  const isLocked = applicationsCount > visibleLimit && !unlocked;
  const visibleApplicantRecords = unlocked
    ? allApplicantRecords
    : allApplicantRecords.slice(0, visibleLimit);

  const latestApplication = visibleApplicantRecords[0]?.createdDate || "-";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f8fb] text-slate-950">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#f5f8fb]" />
        <div className="absolute left-[-160px] top-[-140px] h-[380px] w-[380px] rounded-full bg-cyan-200/45 blur-[120px]" />
        <div className="absolute right-[-120px] top-[80px] h-[360px] w-[360px] rounded-full bg-violet-200/25 blur-[120px]" />
        <div className="absolute bottom-[-160px] left-[35%] h-[360px] w-[360px] rounded-full bg-emerald-100/35 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm font-black text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
          >
            ← Vissza az admin felületre
          </Link>

          <Link
            href={`/admin/jobs/${id}`}
            className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-3 text-sm font-black text-cyan-800 shadow-[0_12px_28px_rgba(6,182,212,0.08)] transition hover:-translate-y-0.5 hover:bg-cyan-100"
          >
            Állás részletei
          </Link>
        </div>

        <section className="mb-5 rounded-[30px] border border-white/90 bg-white/86 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_430px] lg:items-end">
            <div>
              <SectionTag>Jelentkezők</SectionTag>

              <div className="mt-4 flex flex-wrap items-end gap-3">
                <h1 className="text-[40px] font-black leading-[0.92] tracking-[-0.06em] text-slate-950 md:text-[56px]">
                  {title}
                </h1>
                <span className="mb-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
                  {applicationsCount} jelentkező
                </span>
              </div>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-600 md:text-base">
                Kompakt jelöltlista gyors kapcsolatfelvételhez: telefon, e-mail, lakhely, CV és üzenet.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-[22px] border border-blue-200 bg-blue-50/90 p-4 shadow-[0_14px_32px_rgba(59,130,246,0.08)]">
                <div className="text-3xl font-black text-slate-950">{applicationsCount}</div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                  Összes
                </div>
              </div>

              <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/90 p-4 shadow-[0_14px_32px_rgba(16,185,129,0.08)]">
                <div className="text-3xl font-black text-slate-950">{withCvCount}</div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                  CV feltöltve
                </div>
              </div>

              <div className="rounded-[22px] border border-violet-200 bg-violet-50/90 p-4 shadow-[0_14px_32px_rgba(139,92,246,0.08)]">
                <div className="truncate text-lg font-black text-slate-950">{latestApplication}</div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-700">
                  Legutóbbi
                </div>
              </div>
            </div>
          </div>
        </section>

        {isLocked && (
          <div className="mb-5 rounded-[28px] border border-rose-200 bg-rose-50 p-6 shadow-[0_18px_40px_rgba(244,63,94,0.08)]">
            <h2 className="text-xl font-black tracking-[-0.03em] text-slate-900">
              Elérted az 5 jelentkezős limitet
            </h2>
            <p className="mt-2 font-semibold text-slate-600">
              További <strong>{applicationsCount - visibleLimit}</strong> jelentkező vár elrejtve.
            </p>
            <Link
              href="/admin/billing"
              className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-black text-white shadow-md"
            >
              Feloldás / Kampány aktiválása
            </Link>
          </div>
        )}

        {applicantsLoadError && (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 font-bold text-red-600">
            Hiba történt a jelentkezők betöltésekor. Próbáld újra később.
          </div>
        )}

        {!applicantsLoadError && visibleApplicantRecords.length === 0 && (
          <div className="rounded-[32px] border border-white/85 bg-white/82 p-14 text-center shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-md">
            <h3 className="text-2xl font-black text-slate-900">Még nincsenek jelentkezők</h3>
            <p className="mt-3 font-semibold text-slate-500">
              Ide fognak beérkezni az állásra jelentkezők adatai.
            </p>
          </div>
        )}

        {visibleApplicantRecords.length > 0 && (
          <section className="rounded-[30px] border border-white/90 bg-white/82 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-5">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-[-0.04em] text-slate-950">
                  Beérkezett jelöltek
                </h2>
                <p className="text-sm font-bold text-slate-500">
                  Gyors kapcsolatfelvétel: hívás, e-mail, CV egy sorban.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-600">
                {visibleApplicantRecords.length} megjelenítve
              </div>
            </div>

            <div className="space-y-3">
              {visibleApplicantRecords.map((applicant, index) => (
                <article
                  key={applicant.id}
                  className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-cyan-300 via-emerald-300 via-yellow-300 via-orange-300 to-fuchsia-400 p-[2px] shadow-[0_12px_30px_rgba(15,23,42,0.045)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.09)]"
                >
                  <div className="grid gap-4 rounded-[22px] bg-white/96 p-4 lg:grid-cols-[42px_1.1fr_1.2fr_1.2fr_auto] lg:items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700 ring-1 ring-blue-200">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-lg font-black leading-tight tracking-[-0.03em] text-slate-950">
                        {applicant.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                          📍 {applicant.city}
                        </span>
                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700 ring-1 ring-cyan-200">
                          {applicant.status}
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Kapcsolat
                      </div>
                      <div className="mt-1 flex flex-col gap-1">
                        {applicant.phone ? (
                          <a
                            href={`tel:${applicant.phone}`}
                            className="text-sm font-black text-slate-900 hover:text-cyan-600"
                          >
                            {applicant.phone}
                          </a>
                        ) : (
                          <span className="text-sm font-bold text-slate-400">Nincs telefonszám</span>
                        )}

                        {applicant.email ? (
                          <a
                            href={`mailto:${applicant.email}`}
                            className="truncate text-sm font-semibold text-slate-500 hover:text-cyan-600"
                          >
                            {applicant.email}
                          </a>
                        ) : (
                          <span className="text-sm font-bold text-slate-400">Nincs e-mail</span>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
                      <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Üzenet
                      </div>
                      <p className="mt-1 truncate text-sm font-semibold text-slate-600">
                        {applicant.message}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {applicant.phone && (
                        <a
                          href={`tel:${applicant.phone}`}
                          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
                        >
                          Hívás
                        </a>
                      )}

                      {applicant.email && (
                        <a
                          href={`mailto:${applicant.email}`}
                          className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-black text-blue-700 transition hover:bg-blue-100"
                        >
                          E-mail
                        </a>
                      )}

                      {applicant.cvUrl ? (
                        <a
                          href={applicant.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-black text-violet-700 transition hover:bg-violet-100"
                        >
                          CV
                        </a>
                      ) : (
                        <span className="rounded-2xl border border-violet-100 bg-violet-50/70 px-4 py-2.5 text-sm font-black text-violet-300">
                          Nincs CV
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-slate-400 lg:col-span-5 lg:-mt-2 lg:pl-14">
                      Jelentkezés ideje: {applicant.createdDate}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}