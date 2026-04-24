import Airtable from "airtable";

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";
const applicationsTableName = process.env.AIRTABLE_APPLICATIONS_TABLE_NAME || "Applications";

if (!airtableToken) {
  throw new Error("Missing AIRTABLE_TOKEN environment variable.");
}

if (!airtableBaseId) {
  throw new Error("Missing AIRTABLE_BASE_ID environment variable.");
}

const base = new Airtable({
  apiKey: airtableToken,
}).base(airtableBaseId);

export type Job = {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  shortDescription: string;
  description: string;
  status: string;
  generatedImageUrl: string | null;
};

function getText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function getFirstNonEmpty(...values: unknown[]): string {
  for (const value of values) {
    const text = getText(value);
    if (text) return text;
  }
  return "";
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

export function isActiveStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase();

  return (
    normalized === "active" ||
    normalized === "aktív" ||
    normalized === "aktiv"
  );
}

function escapeAirtableFormulaValue(value: string): string {
  return value.replace(/'/g, "\\'");
}

export function mapJobRecord(record: Airtable.Record<any>): Job {
  const slug = getFirstNonEmpty(record.get("Slug"));

  const title = getFirstNonEmpty(
    record.get("Title"),
    record.get("Job Title"),
    record.get("Position"),
    record.get("Pozíció")
  );

  const company = getFirstNonEmpty(
    record.get("Company"),
    record.get("Cég")
  );

  const location = getFirstNonEmpty(
    record.get("Location"),
    record.get("Helyszín"),
    record.get("City")
  );

  const salary = getFirstNonEmpty(
    record.get("Salary"),
    record.get("Bér"),
    record.get("Salary Range")
  );

  const shortDescription = getFirstNonEmpty(
    record.get("Short Description"),
    record.get("shortDescription"),
    record.get("Summary"),
    record.get("Rövid leírás")
  );

  const description = getFirstNonEmpty(
    record.get("Description"),
    record.get("description"),
    record.get("Job Description"),
    record.get("Leírás")
  );

  const status = getFirstNonEmpty(
    record.get("Status"),
    record.get("Státusz")
  );

  const generatedImageUrl = getAttachmentUrl(
    record.get("Generated Image")
  );

  return {
    id: record.id,
    slug,
    title,
    company,
    location,
    salary,
    shortDescription,
    description,
    status,
    generatedImageUrl,
  };
}

export async function getAllJobs(): Promise<Job[]> {
  try {
    const records = await base(jobsTableName)
      .select({ maxRecords: 50 })
      .all();

    return records.map(mapJobRecord);
  } catch (error: any) {
    console.error("AIRTABLE getAllJobs ERROR:", {
      message: error?.message,
      statusCode: error?.statusCode,
      error: error?.error,
      jobsTableName,
    });

    throw error;
  }
}

export async function getActiveJobs(): Promise<Job[]> {
  const allJobs = await getAllJobs();

  return allJobs.filter(
    (job) => job.slug && job.title && isActiveStatus(job.status)
  );
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  try {
    const safeSlug = escapeAirtableFormulaValue(slug);

    const records = await base(jobsTableName)
      .select({
        filterByFormula: `{Slug}='${safeSlug}'`,
        maxRecords: 1,
      })
      .all();

    if (!records.length) {
      return null;
    }

    return mapJobRecord(records[0]);
  } catch (error: any) {
    console.error("AIRTABLE getJobBySlug ERROR:", {
      message: error?.message,
      statusCode: error?.statusCode,
      error: error?.error,
      jobsTableName,
      slug,
    });

    throw error;
  }
}

export type JobWithApplications = Job & {
  applicantsCount: number;
};

export async function getJobsWithApplications(): Promise<JobWithApplications[]> {
  const jobs = await getAllJobs();

  let appsRecords: readonly any[] = [];
  try {
    appsRecords = await base(applicationsTableName).select().all();
  } catch (error: any) {
    console.error("AIRTABLE getJobsWithApplications ERROR fetching apps:", {
      message: error?.message,
      statusCode: error?.statusCode,
      error: error?.error,
    });
  }

  const appsByJobId: Record<string, number> = {};
  for (const record of appsRecords) {
    const jobLinks = record.get("Job");
    if (Array.isArray(jobLinks)) {
      for (const jobId of jobLinks) {
        if (typeof jobId === "string") {
          appsByJobId[jobId] = (appsByJobId[jobId] || 0) + 1;
        }
      }
    }
  }

  return jobs.map((job) => ({
    ...job,
    applicantsCount: appsByJobId[job.id] || 0,
  }));
}