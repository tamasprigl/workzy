import { NextResponse } from "next/server";
import Airtable from "airtable";
import crypto from "crypto";
import { ensureEmployer, createMagicLink } from "@/lib/magic-links";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";

if (!airtableToken || !airtableBaseId) {
  throw new Error("Missing Airtable config");
}

const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ő/g, "o")
    .replace(/ű/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.toLowerCase().trim() : "";

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const location =
      typeof body.location === "string" ? body.location.trim() : "";
    const salary = typeof body.salary === "string" ? body.salary.trim() : "";
    const shortDescription =
      typeof body.shortDescription === "string"
        ? body.shortDescription.trim()
        : "";

    if (!email || !email.includes("@") || !title) {
      return NextResponse.json(
        { error: "A valid email and title are required" },
        { status: 400 }
      );
    }

    const employer = await ensureEmployer(email);
    const employerId = (employer as any).id;

    if (!employerId) {
      throw new Error("Employer ID not found");
    }

    const jobFields: Record<string, any> = {
      Title: title,
      "Submitted Email": email,
      Owner: [employerId],
      Status: "Awaiting Profile",
      Slug: `${createSlug(title)}-${crypto.randomBytes(3).toString("hex")}`,
    };

    if (location) jobFields.Location = location;
    if (salary) jobFields.Salary = salary;
    if (shortDescription) {
      jobFields["Short Description"] = shortDescription;
    }

    const jobRecord = await base(jobsTableName).create(jobFields as any);
    const jobId = (jobRecord as any).id;

    if (!jobId) {
      throw new Error("Job ID not found");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await createMagicLink({
      token,
      email,
      jobId,
      purpose: "job_activation",
      expiresAt,
    });

    const baseUrl = process.env.APP_URL || "http://localhost:3000";

    console.log("\n==============================================");
    console.log("📧 MAGIC LINK GENERATED (Job Quick-Create)");
    console.log(`To: ${email}`);
    console.log(`Job ID: ${jobId}`);
    console.log(`Link: ${baseUrl}/api/auth/magic-link?token=${token}`);
    console.log("==============================================\n");

    return NextResponse.json(
      {
        success: true,
        jobId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Job quick-create error:", error);

    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}