import { NextResponse } from "next/server";
import Airtable from "airtable";
import crypto from "crypto";
import { createMagicLink } from "@/lib/magic-links";
import { sendMagicLinkEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function getText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function escapeAirtable(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
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

function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "https://www.workzy.hu"
  ).replace(/\/$/, "");
}

function getBase() {
  const airtableToken = process.env.AIRTABLE_TOKEN;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;

  if (!airtableToken || !airtableBaseId) {
    throw new Error("Hiányzó Airtable konfiguráció.");
  }

  return new Airtable({ apiKey: airtableToken }).base(airtableBaseId);
}

async function findOrCreateCompany(base: Airtable.Base, companyName: string) {
  const companiesTableName =
    process.env.AIRTABLE_COMPANIES_TABLE_NAME || "Companies";

  const safeName = escapeAirtable(companyName);

  const existingCompanies = await base(companiesTableName)
    .select({
      maxRecords: 1,
      filterByFormula: `LOWER({Name}) = '${safeName.toLowerCase()}'`,
    })
    .firstPage();

  if (existingCompanies[0]) {
    return existingCompanies[0].id;
  }

  const createdCompanies = await base(companiesTableName).create([
    {
      fields: {
        Name: companyName,
      },
    },
  ]);

  const companyId = createdCompanies[0]?.id;

  if (!companyId || !companyId.startsWith("rec")) {
    throw new Error("Érvénytelen Company rekord azonosító.");
  }

  return companyId;
}

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

    const base = getBase();
    const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";

    const slug = `${slugify(title)}-${Math.random()
      .toString(36)
      .substring(2, 7)}`;

    const companyName = email.split("@")[0] || "Új cég";
    const companyId = await findOrCreateCompany(base, companyName);

    if (!companyId.startsWith("rec")) {
      throw new Error(`Érvénytelen companyId: ${companyId}`);
    }

    const jobFields: Record<string, unknown> = {
      Title: title,
      Slug: slug,
      Status: "Piszkozat",
      Location: location,
      Salary: salary,
      "Short Description": shortDescription,
      User: email,
      Owner: email,
      "Submitted Email": email,

      // Fontos: ez Airtable linked record mező, ezért ARRAY kell.
      "Company Record": [companyId],
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
        fields: cleanedJobFields as Airtable.FieldSet,
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

    const magicLink = `${getSiteUrl()}/api/auth/verify?token=${magicToken}`;

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