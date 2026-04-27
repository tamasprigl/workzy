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

function escapeAirtableFormulaValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function createSlug(title: string, location?: string): string {
  return `${title}-${location || ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ő/g, "o")
    .replace(/ű/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function createMagicToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function createExpiryDate(): string {
  return new Date(Date.now() + 15 * 60 * 1000).toISOString();
}

async function getCurrentEmployer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;

  const payload = await verifyAuthToken(token);

  const email =
    typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";

  if (!email) return null;

  const safeEmail = escapeAirtableFormulaValue(email);

  const employers = await base(employersTableName)
    .select({
      maxRecords: 1,
      filterByFormula: `LOWER({Email}) = "${safeEmail}"`,
    })
    .firstPage();

  const employer = employers[0];
  if (!employer) return null;

  return {
    id: employer.id,
    email: getText(employer.get("Email")) || email,
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

  await base(magicLinksTableName).create({
    Token: token,
    Email: email,
    Purpose: "job_activation",
    "Expires At": expiresAt,
    JobId: jobId,
  } as any);

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
    const companyName = getText(body.company || body.Company);
    const location = getText(body.location || body.Location);

    if (!title) {
      return NextResponse.json(
        { success: false, error: "A pozíció kötelező." },
        { status: 400 }
      );
    }

    const currentEmployer = await getCurrentEmployer();

    if (!currentEmployer) {
      return NextResponse.json(
        { success: false, error: "Nincs bejelentkezett user." },
        { status: 401 }
      );
    }

    const slug = createSlug(title, location);

    const fields = {
      Title: title,
      Slug: slug,
      Status: "Aktív",
      Company: companyName,
      Location: location,
      User: currentEmployer.email,
      Owner: currentEmployer.email,
    };

    // 🔥 EZ A LÉNYEG - FIX
    const createdRecords = await base(jobsTableName).create([
      { fields },
    ] as any);

    const jobId = createdRecords[0].id;

    await createAndSendMagicLink({
      email: currentEmployer.email,
      jobId,
      jobTitle: title,
    });

    return NextResponse.json({
      success: true,
      jobId,
      slug,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Hiba történt." },
      { status: 500 }
    );
  }
}