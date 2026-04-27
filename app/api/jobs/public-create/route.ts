import { NextResponse } from "next/server";
import Airtable from "airtable";
import crypto from "crypto";
import { createMagicLink } from "@/lib/magic-links";
import { sendMagicLinkEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ő/g, "o")
    .replace(/ű/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

type PublicCreateJobBody = {
  title?: string;
  location?: string;
  salary?: string;
  email?: string;
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

    const title = getText(body.title);
    const location = getText(body.location);
    const salary = getText(body.salary);
    const email = getText(body.email).toLowerCase();
    const shortDescription = getText(body.shortDescription);

    if (!title || !location || !salary || !email) {
      return NextResponse.json(
        { success: false, message: "Hiányzó kötelező mezők." },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Érvénytelen email cím." },
        { status: 400 }
      );
    }

    const airtableToken = process.env.AIRTABLE_TOKEN;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";

    if (!airtableToken || !airtableBaseId) {
      return NextResponse.json(
        { success: false, message: "Hiányzó Airtable konfiguráció." },
        { status: 500 }
      );
    }

    const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

    const slug = `${slugify(title)}-${Math.random()
      .toString(36)
      .substring(2, 7)}`;

    const jobFields: Record<string, unknown> = {
      Title: title,
      Slug: slug,
      Status: "Piszkozat",
      Company: email.split("@")[0],
      Location: location,
      Salary: salary,
      "Short Description": shortDescription,
      User: email,
      Owner: email,
      "Submitted Email": email,
    };

    if (body.campaign?.platform) {
      jobFields["Campaign Platform"] = getText(body.campaign.platform);
    }

    if (body.campaign?.location) {
      jobFields["Campaign Target Location"] = getText(body.campaign.location);
    }

    if (body.campaign?.goal) {
      jobFields["Campaign Goal"] = getText(body.campaign.goal);
    }

    if (
      body.campaign?.budget !== undefined &&
      body.campaign?.budget !== null &&
      !Number.isNaN(Number(body.campaign.budget))
    ) {
      jobFields["Campaign Budget Daily"] = Number(body.campaign.budget);
    }

    const cleanedJobFields = Object.fromEntries(
      Object.entries(jobFields).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    const createdJobs = await base(jobsTableName).create([
      {
        fields: cleanedJobFields as any,
      },
    ]);

    const createdJob = createdJobs[0];

    const magicToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await createMagicLink({
      token: magicToken,
      email,
      jobId: createdJob.id,
      purpose: "job_activation",
      expiresAt,
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      "http://localhost:3000";

    const magicLink = `${baseUrl}/api/auth/verify?token=${magicToken}`;

    await sendMagicLinkEmail({
      email,
      link: magicLink,
      subject: "Véglegesítsd az álláshirdetésed a Workzy-ban",
    });

    return NextResponse.json({
      success: true,
      message:
        "Az állás piszkozatként létrejött, a belépési linket elküldtük emailben.",
      data: {
        jobId: createdJob.id,
        slug,
        email,
      },
      magicLinkEmailSent: true,
    });
  } catch (error: any) {
    console.error("PUBLIC JOB CREATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Hiba történt az állás létrehozása közben. Kérlek próbáld újra.",
      },
      { status: error?.statusCode || 500 }
    );
  }
}