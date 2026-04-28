import { NextResponse } from "next/server";
import Airtable from "airtable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json();

    if (!body.recordId) {
      return NextResponse.json(
        { success: false, message: "A Rekord azonosító megadása kötelező!" },
        { status: 400 }
      );
    }

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { success: false, message: "A Cím és Slug megadása kötelező!" },
        { status: 400 }
      );
    }

    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";

    if (!token || !baseId) {
      return NextResponse.json(
        { success: false, message: "A rendszer nincs megfelelően konfigurálva." },
        { status: 500 }
      );
    }

    const base = new Airtable({ apiKey: token }).base(baseId);

    const recordFields: Record<string, unknown> = {
      Title: getText(body.title),
      Slug: getText(body.slug),

      // FONTOS:
      // A "Company" mezőt direkt NEM küldjük,
      // mert nálad Airtable-ben linked record mezőként viselkedik.
      // A cég kapcsolatot a "Company Record" kezeli.

      Location: getText(body.location),
      Type: getText(body.type),
      "Employment Type": getText(body.employmentType),
      Schedule: getText(body.schedule),
      Salary: getText(body.salary),
      "Short Description": getText(body.shortDescription),
      Description: getText(body.description),
      Requirements: getText(body.requirements),
      Benefits: getText(body.benefits),
      "CTA Text": getText(body.ctaText),
      "Campaign Platform": getText(body.campaign?.platform),
      "Campaign Target Location": getText(body.campaign?.location),
      "Campaign Goal": getText(body.campaign?.goal),
      "Facebook Post Text": getText(body.facebookPostText),
    };

    if (
      body.campaign?.budget !== undefined &&
      body.campaign?.budget !== null &&
      !Number.isNaN(Number(body.campaign.budget))
    ) {
      recordFields["Campaign Budget Daily"] = Number(body.campaign.budget);
    }

    if (Array.isArray(body.applicationQuestions)) {
      recordFields["Application Questions"] = JSON.stringify(
        body.applicationQuestions
      );
    }

    const payload = Object.fromEntries(
      Object.entries(recordFields).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    console.log(`⏳ Állás módosítása az Airtable-ben (${body.recordId})...`, {
      fields: Object.keys(payload),
    });

    await base(tableName).update([
      {
        id: body.recordId,
        fields: payload as Airtable.FieldSet,
      },
    ]);

    console.log("✅ Állás sikeresen módosítva az Airtable-ben!");

    return NextResponse.json({
      success: true,
      message: "Az állás módosítása sikeres.",
      data: {
        slug: body.slug,
        jobId: body.recordId,
      },
    });
  } catch (error: any) {
    console.error("❌ Hiba történt az állás módosításakor:");
    console.error(
      JSON.stringify(
        {
          message: error?.message,
          statusCode: error?.statusCode,
          error: error?.error,
        },
        null,
        2
      )
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Szerver hiba történt az adatok feldolgozása során.",
      },
      { status: error?.statusCode || 500 }
    );
  }
}