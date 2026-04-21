import Airtable from "airtable";
import Image from "next/image";
import { notFound } from "next/navigation";
import ApplicationForm from "./ApplicationForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const FALLBACK_IMAGE = "/placeholder-job.png";

function splitLines(value?: string | null) {
  if (!value) return [];
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getAttachmentUrl(value: unknown): string | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const first = value[0];
  if (!first || typeof first !== "object") return null;

  if ("url" in first && typeof first.url === "string" && first.url.trim()) {
    return first.url;
  }

  return null;
}

function InfoPill({
  children,
  icon,
  highlight = false,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium backdrop-blur",
        highlight
          ? "border-sky-200 bg-sky-50 text-sky-700"
          : "border-slate-200 bg-white/80 text-slate-600",
      ].join(" ")}
    >
      {icon}
      {children}
    </span>
  );
}

function SectionCard({
  title,
  icon,
  content,
  asList = false,
}: {
  title: string;
  icon: React.ReactNode;
  content?: string;
  asList?: boolean;
}) {
  if (!content) return null;

  const items = splitLines(content);

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
          {icon}
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
      </div>

      {asList && items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="flex items-start gap-3 text-[15px] leading-7 text-slate-600"
            >
              <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="whitespace-pre-wrap text-[15px] leading-7 text-slate-600">
          {content}
        </div>
      )}
    </section>
  );
}

export default async function PublicJobPage({ params }: PageProps) {
  const { slug } = await params;

  let jobRecord: Airtable.Record<any> | null = null;

  try {
    const airtableToken = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const jobsTable = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";

    if (!airtableToken || !baseId) {
      throw new Error("Missing Airtable configuration variables.");
    }

    const base = new Airtable({ apiKey: airtableToken }).base(baseId);
    const safeSlug = slug.replace(/'/g, "\\'");

    const records = await base(jobsTable)
      .select({
        filterByFormula: `{Slug} = '${safeSlug}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length > 0) {
      jobRecord = records[0];
    }
  } catch (error) {
    console.error("Hiba az állás betöltésekor:", error);
  }

  if (!jobRecord) {
    notFound();
  }

  const status = String(jobRecord.get("Status") || "").trim().toLowerCase();
  const isActive =
    status === "active" || status === "aktív" || status === "aktiv";

  if (!isActive) {
    notFound();
  }

  const jobId = jobRecord.id;

  const jobTitle =
    (jobRecord.get("Title") as string) ||
    (jobRecord.get("Job Title") as string) ||
    "Pozíció";

  const company =
    (jobRecord.get("Company") as string) ||
    (jobRecord.get("Cég") as string) ||
    "";

  const location =
    (jobRecord.get("Location") as string) ||
    (jobRecord.get("Helyszín") as string) ||
    "";

  const type = (jobRecord.get("Type") as string) || "";
  const employmentType = (jobRecord.get("Employment Type") as string) || "";
  const schedule = (jobRecord.get("Schedule") as string) || "";

  const salary =
    (jobRecord.get("Salary") as string) ||
    (jobRecord.get("Bér") as string) ||
    "";

  const shortDescription =
    (jobRecord.get("Short Description") as string) ||
    (jobRecord.get("Rövid leírás") as string) ||
    "";

  const description =
    (jobRecord.get("Description") as string) ||
    (jobRecord.get("Leírás") as string) ||
    "";

  const requirements = (jobRecord.get("Requirements") as string) || "";
  const benefits = (jobRecord.get("Benefits") as string) || "";

  const ctaText =
    (jobRecord.get("CTA Text") as string) || "Jelentkezés az állásra";

  const generatedImageUrl = getAttachmentUrl(jobRecord.get("Generated Image"));
  const jobImage = generatedImageUrl || FALLBACK_IMAGE;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_30%)]" />
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-4 shadow-[0_20px_80px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-5">
              <div className="relative aspect-square w-full bg-slate-100 rounded-[24px] overflow-hidden">
                <Image
                  src={jobImage}
                  alt={jobTitle}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 700px"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[32px] border border-white/70 bg-white/85 p-7 shadow-[0_20px_80px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="mb-4 inline-flex items-center rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700">
                  Aktív pozíció
                </div>

                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  {jobTitle}
                </h1>

                {company && (
                  <div className="mt-4 text-lg font-medium text-slate-500">
                    {company}
                  </div>
                )}

                {shortDescription && (
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                    {shortDescription}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  {location && (
                    <InfoPill
                      icon={
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
                          className="text-sky-600"
                        >
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      }
                    >
                      {location}
                    </InfoPill>
                  )}

                  {(type || employmentType) && (
                    <InfoPill
                      icon={
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
                          className="text-sky-600"
                        >
                          <rect width="16" height="13" x="4" y="8" rx="2" ry="2" />
                          <path d="M16 4V2a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2" />
                        </svg>
                      }
                    >
                      {[type, employmentType].filter(Boolean).join(" • ")}
                    </InfoPill>
                  )}

                  {schedule && (
                    <InfoPill
                      icon={
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
                          className="text-sky-600"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      }
                    >
                      {schedule}
                    </InfoPill>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-[32px] border border-sky-100 bg-white/90 p-6 shadow-[0_20px_80px_rgba(14,165,233,0.10)] backdrop-blur-xl sm:p-7">
                <div className="rounded-[26px] border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
                    Bér
                  </div>

                  <div className="mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                    {salary || "Versenyképes bér"}
                  </div>

                  <div className="mt-5 h-px w-full bg-gradient-to-r from-sky-200 via-slate-200 to-transparent" />

                  <p className="mt-5 text-sm leading-6 text-slate-600">
                    Gyors jelentkezési folyamat, átlátható állásoldal és azonnali
                    továbbítás a rendszerbe.
                  </p>

                  <a
                    href="#jelentkezes"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                  >
                    {ctaText}
                  </a>
                </div>

                <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                  <div className="text-sm font-semibold text-slate-900">
                    Mi történik jelentkezés után?
                  </div>

                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    <li className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
                      <span>A jelentkezés azonnal bekerül a rendszerbe.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
                      <span>Az admin felületen azonnal láthatóvá válik.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
                      <span>Gyorsabb és átláthatóbb toborzási folyamat indul.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6">
            <SectionCard
              title="Feladatok és részletek"
              content={description}
              asList={false}
              icon={
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
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                  <line x1="10" x2="8" y1="9" y2="9" />
                </svg>
              }
            />

            <SectionCard
              title="Elvárások"
              content={requirements}
              asList
              icon={
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
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              }
            />

            <SectionCard
              title="Amit kínálunk"
              content={benefits}
              asList
              icon={
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
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />
          </div>

          <div id="jelentkezes" className="scroll-mt-24 mt-10">
            <div className="mb-6">
              <div className="inline-flex items-center rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700">
                Jelentkezés
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Jelentkezz erre a pozícióra
              </h2>

              <p className="mt-2 text-slate-600">
                Töltsd ki az adatokat, és a jelentkezés azonnal bekerül a
                rendszerbe.
              </p>
            </div>

            <ApplicationForm jobId={jobId} />
          </div>
        </div>
      </section>
    </main>
  );
}