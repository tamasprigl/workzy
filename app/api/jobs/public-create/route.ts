import { NextResponse } from "next/server";
import Airtable from "airtable";
import { createMagicLink, ensureEmployer } from "@/lib/magic-links";
import crypto from "crypto";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[áäàãâ]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[íìîï]/g, "i")
    .replace(/[óöőòôõ]/g, "o")
    .replace(/[úüűùû]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type PublicCreateJobBody = {
  title: string;
  location: string;
  salary: string;
  email: string;
  shortDescription?: string;
  campaign?: {
    platform?: string;
    budget?: number;
    location?: string;
    goal?: string;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PublicCreateJobBody;

    if (!body.title || !body.location || !body.salary || !body.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, location, salary, and email are required.",
        },
        { status: 400 }
      );
    }

    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_JOBS_TABLE_NAME;

    if (!token || !baseId || !tableName) {
      console.error("❌ Missing Airtable config.");
      return NextResponse.json(
        { success: false, message: "Server misconfiguration." },
        { status: 500 }
      );
    }

    const base = new Airtable({ apiKey: token }).base(baseId);

    // Ensure employer exists
    const employer = await ensureEmployer(body.email);

    // Auto-generate slug and default company (if empty)
    const slug = slugify(body.title) + "-" + Math.random().toString(36).substring(2, 6);
    
    // Create draft job
    const recordFields: Record<string, unknown> = {
      Title: body.title,
      Slug: slug,
      Location: body.location,
      Salary: body.salary,
      "Short Description": body.shortDescription || "",
      "Campaign Platform": body.campaign?.platform || "",
      "Campaign Budget Daily":
        body.campaign?.budget != null && !Number.isNaN(Number(body.campaign.budget))
          ? Number(body.campaign.budget)
          : null,
      "Campaign Target Location": body.campaign?.location || "",
      "Campaign Goal": body.campaign?.goal || "",
      Status: "Inaktív", // Or Draft
      Employer: [employer.id],
      Company: body.email.split("@")[0], // Placeholder company
    };

    const payload = Object.fromEntries(
      Object.entries(recordFields).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    console.log(`⏳ Creating draft job in Airtable...`);
    const records = await base(tableName).create([
      { fields: payload as any },
    ]);

    const createdRecord = records[0];
    console.log("✅ Draft job created:", createdRecord.id);

    // Generate magic link
    const magicToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await createMagicLink({
      token: magicToken,
      email: body.email.toLowerCase().trim(),
      jobId: createdRecord.id,
      purpose: "job_activation",
      expiresAt: expiresAt.toISOString(),
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const loginUrl = `${baseUrl}/api/auth/verify?token=${magicToken}`;

    console.log("\n==============================================");
    console.log(`📧 MAGIC LINK GENERATED FOR DRAFT JOB`);
    console.log(`To: ${body.email}`);
    console.log(`Purpose: job_activation`);
    console.log(`Job ID: ${createdRecord.id}`);
    console.log(`Link: ${loginUrl}`);
    console.log("==============================================\n");

    return NextResponse.json({
      success: true,
      message: "Job drafted successfully. Magic link sent.",
      data: {
        jobId: createdRecord.id,
      },
    });
  } catch (error: any) {
    console.error("❌ Error in public job creation:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process job creation request.",
      },
      { status: 500 }
    );
  }
}
