import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;

const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";
const employersTableName =
  process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";
const companiesTableName =
  process.env.AIRTABLE_COMPANIES_TABLE_NAME || "Companies";
const magicLinksTableName =
  process.env.AIRTABLE_MAGIC_LINKS_TABLE_NAME || "MagicLinks";

const appUrl =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

if (!airtableToken || !airtableBaseId) {
  throw new Error("Missing Airtable configuration");
}

const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

function getText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function createSlug(title: string, location?: string) {
  const raw = `${title}-${location || ""}`;

  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ő/g, "o")
    .replace(/ű/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function createMagicToken() {
  return crypto.randomBytes(32).toString("hex");
}

function createExpiryDate() {
  return new Date(Date.now() + 15 * 60 * 1000).toISOString();
}

async function getCurrentEmployer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;

  const payload = await verifyAuthToken(token);

  const email =
    typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";

  const employerId =
    typeof payload?.employerId === "string"
      ? payload.employerId
      : typeof payload?.userId === "string"
        ? payload.userId
        : typeof payload?.sub === "string"
          ? payload.sub
          : "";

  if (employerId) {
    try {
      const employer = await base(employersTableName).find(employerId);

      return {
        id: employer.id,
        email:
          getText(employer.get("Email")) ||
          getText(employer.get("E-mail")) ||
          email,
        company: Array.isArray(employer.get("Company"))
          ? (employer.get("Company") as string[])
          : [],
      };
    } catch {
      // fallback email keresésre
    }
  }

  if (!email) return null;

  const employers = await base(employersTableName)
    .select({
      maxRecords: 1,
      filterByFormula: `LOWER({Email}) = '${email.replace(/'/g, "\\'")}'`,
    })
    .firstPage();

  const employer = employers[0];

  if (!employer) return null;

  return {
    id: employer.id,
    email: getText(employer.get("Email")) || email,
    company: Array.isArray(employer.get("Company"))
      ? (employer.get("Company") as string[])
      : [],
  };
}

async function createAndSendMagicLink({
  email,
  jobId,
  jobTitle,
}: {
  email: string;
  jobId: string;
  jobTitle: string;
}) {
  const token = createMagicToken();
  const expiresAt = createExpiryDate();

  await base(magicLinksTableName).create([
    {
      fields: {
        Token: token,
        Email: email,
        Purpose: "job_activation",
        "Expires At": expiresAt,
        JobId: jobId,
      },
    },
  ]);

  const magicLink = `${appUrl}/api/auth/magic-link?token=${token}`;

  await sendMagicLinkEmail({
    email,
    link: magicLink,
    subject: `Folytasd a(z) "${jobTitle}" hirdetésed`,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const title = getText(body.title || body.Title);
    const companyName = getText(body.company || body.companyName || body.Company);
    const location = getText(body.location || body.Location);
    const type = getText(body.type || body.jobType || body.Type);
    const employmentType = getText(body.employmentType || body["Employment Type"]);
    const schedule = getText(body.schedule || body.shift || body.Schedule);
    const salary = getText(body.salary || body.Salary);
    const shortDescription = getText(
      body.shortDescription || body["Short Description"]
    );
    const description = getText(
      body.description || body.fullDescription || body.Description
    );
    const requirements = getText(body.requirements || body.Requirements);
    const benefits = getText(body.benefits || body.Benefits);
    const ctaText = getText(body.ctaText || body["CTA Text"]) || "Jelentkezem";

    if (!title) {
      return NextResponse.json(
        { success: false, error: "A pozíció megadása kötelező." },
        { status: 400 }
      );
    }

    const currentEmployer = await getCurrentEmployer();

    if (!currentEmployer) {
      return NextResponse.json(
        {
          success: false,
          error: "Nem található bejelentkezett employer/user.",
        },
        { status: 401 }
      );
    }

    const slug = createSlug(title, location);

    const fields: Record<string, unknown> = {
      Title: title,
      Slug: slug,
      Status: "Aktív",

      Company: companyName,
      Location: location,
      Type: type,
      "Employment Type": employmentType,
      Schedule: schedule,
      Salary: salary,
      "Short Description": shortDescription,
      Description: description,
      Requirements: requirements,
      Benefits: benefits,
      "CTA Text": ctaText,

      User: currentEmployer.email,
      Owner: currentEmployer.email,
    };

    const createdJob = await base(jobsTableName).create([{ fields }]);
    const jobId = createdJob[0].id;

    try {
      await createAndSendMagicLink({
        email: currentEmployer.email,
        jobId,
        jobTitle: title,
      });
    } catch (emailError) {
      console.error("Magic link email hiba:", emailError);
    }

    return NextResponse.json({
      success: true,
      jobId,
      slug,
      employerId: currentEmployer.id,
      employerEmail: currentEmployer.email,
      magicLinkEmailSent: true,
    });
  } catch (error) {
    console.error("Job create error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Ismeretlen hiba történt.",
      },
      { status: 500 }
    );
  }
}