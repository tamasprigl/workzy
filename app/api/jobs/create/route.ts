import { NextResponse } from "next/server";
import { JobFormData } from "../../../admin/jobs/new/types";
import Airtable from "airtable";

export async function POST(request: Request) {
  try {
    const body: any = await request.json();

    // 1. Minimal Validation
    if (!body.title || !body.slug || !body.company) {
      console.error("❌ Validációs hiba: Hiányzó kötelező mezők (title, slug vagy company).");
      return NextResponse.json(
        { success: false, message: "A Cím, Slug és Cég megadása kötelező!" },
        { status: 400 }
      );
    }

    // 2. Setup Airtable
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_JOBS_TABLE_NAME;

    if (!token || !baseId || !tableName) {
      console.error("❌ Rendszer hiba: Hiányzó Airtable környezeti változók.", {
        hasToken: !!token,
        hasBaseId: !!baseId,
        hasJobsTable: !!tableName
      });
      return NextResponse.json(
        { 
          success: false, 
          message: "A rendszer nincs megfelelően konfigurálva.",
          _debug: process.env.NODE_ENV === "development" ? {
            envStatus: {
              hasToken: !!token,
              hasBaseId: !!baseId,
              hasJobsTable: !!tableName
            }
          } : undefined
        },
        { status: 500 }
      );
    }

    const base = new Airtable({ apiKey: token }).base(baseId);

    // 3. Map to Airtable Record
    const recordFields = {
      "Title": body.title,
      "Slug": body.slug,
      "Company": body.company,
      "Location": body.location || "",
      "Type": body.type || "",
      "Employment Type": body.employmentType || "",
      "Schedule": body.schedule || "",
      "Salary": body.salary || "",
      "Short Description": body.shortDescription || "",
      "Description": body.description || "",
      "Requirements": body.requirements || "",
      "Benefits": body.benefits || "",
      "CTA Text": body.ctaText || "",
      "Campaign Platform": body.campaign?.platform || "",
      "Campaign Budget Daily": body.campaign?.budget != null ? Number(body.campaign.budget) : null,
      "Campaign Target Location": body.campaign?.location || "",
      "Campaign Goal": body.campaign?.goal || "",
      "Facebook Post Text": body.facebookPostText || "",
      "Status": "draft"
    };

    console.log(`⏳ Állás mentése az Airtable-be (${tableName} tábla)...`);

    // 4. Save to Airtable
    const payload = Object.fromEntries(
      Object.entries(recordFields).filter(([_, v]) => v !== "" && v !== null)
    );

    const records: any = await base(tableName).create([
      { fields: payload as any }
    ]);

    const createdRecord = records[0];

    console.log("✅ Új állás sikeresen rögzítve az Airtable-ben!");
    console.log(`📌 Pozíció: ${body.title} (Airtable ID: ${createdRecord.id})`);

    return NextResponse.json({
      success: true,
      message: "Az állás rögzítése és a kampány előkészítése sikeres.",
      data: {
        slug: body.slug,
        jobId: createdRecord.id,
      }
    });

  } catch (error: any) {
    const isDev = process.env.NODE_ENV === "development";
    
    console.error("❌ Hiba történt az állás rögzítésekor (Airtable API Hiba):");
    console.error(JSON.stringify({
      message: error.message,
      statusCode: error.statusCode,
      error: error.error,
      stack: isDev ? error.stack : undefined
    }, null, 2));
    
    return NextResponse.json(
      {
        success: false,
        message: isDev ? (error.message || "Airtable API hiba történt.") : "Szerver hiba történt az adatok feldolgozása során.",
        details: isDev ? {
          statusCode: error.statusCode,
          type: error.type || error.error
        } : undefined
      },
      { status: error.statusCode || 500 }
    );
  }
}
