import { NextResponse } from "next/server";
import Airtable from "airtable";
import crypto from "crypto";
import { ensureEmployer, createMagicLink } from "@/lib/magic-links";

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";

if (!airtableToken || !airtableBaseId) {
  throw new Error("Missing Airtable config");
}

const base = new Airtable({ apiKey: airtableToken as string }).base(airtableBaseId as string);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, title, location, salary, shortDescription } = body;

    // Validate requirements
    if (!email || typeof email !== "string" || !email.includes("@") || !title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "A valid email and title are required" },
        { status: 400 }
      );
    }

    // 1. Normalize input securely
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedTitle = title.trim();

    // 2. Ensure Employer exists
    const employer = await ensureEmployer(normalizedEmail);

    // 3. Create Job in Airtable
    const jobFields: Record<string, unknown> = {
      Title: normalizedTitle,
      "Submitted Email": normalizedEmail,
      Owner: [employer.id],
      Status: "Awaiting Profile",
    };

    if (location && typeof location === "string" && location.trim()) {
      jobFields["Location"] = location.trim();
    }
    if (salary && typeof salary === "string" && salary.trim()) {
      jobFields["Salary"] = salary.trim();
    }
    if (shortDescription && typeof shortDescription === "string" && shortDescription.trim()) {
      jobFields["Short Description"] = shortDescription.trim();
    }

    // The Job model usually requires a Slug. Generating a fallback URL-friendly slug based on title.
    const titleSlug = normalizedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    jobFields["Slug"] = `${titleSlug}-${crypto.randomBytes(3).toString("hex")}`;

    const jobRecords = await base(jobsTableName).create([
      { fields: jobFields as Airtable.FieldSet },
    ]);
    
    if (!jobRecords || jobRecords.length === 0) {
      throw new Error("Failed to create job record");
    }

    const jobId = jobRecords[0].id;

    // 4. Trigger Magic Link
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await createMagicLink({
      token,
      email: normalizedEmail,
      jobId,
      purpose: "job_activation",
      expiresAt: expiresAt.toISOString(),
    });

    // Logging simulated email dispatch
    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    console.log("\n==============================================");
    console.log(`📧 MAGIC LINK GENERATED (Job Quick-Create)`);
    console.log(`To: ${normalizedEmail}`);
    console.log(`Job ID: ${jobId}`);
    console.log(`Link: ${baseUrl}/api/auth/verify?token=${token}`);
    console.log("==============================================\n");

    // 5. Return Response
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Job quick-create error:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
