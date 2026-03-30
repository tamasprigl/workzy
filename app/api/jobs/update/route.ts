import { NextResponse } from "next/server";
import Airtable from "airtable";

export async function POST(request: Request) {
  try {
    const body: any = await request.json();

    if (!body.recordId) {
      console.error("❌ Validációs hiba: Hiányzó recordId a módosításhoz.");
      return NextResponse.json(
        { success: false, message: "A Rekord azonosító megadása kötelező!" },
        { status: 400 }
      );
    }

    if (!body.title || !body.slug || !body.company) {
      console.error("❌ Validációs hiba: Hiányzó kötelező mezők (title, slug vagy company).");
      return NextResponse.json(
        { success: false, message: "A Cím, Slug és Cég megadása kötelező!" },
        { status: 400 }
      );
    }

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
      "Facebook Post Text": body.facebookPostText || ""
    };

    console.log(`⏳ Állás módosítása az Airtable-ben (${body.recordId})...`);

    const payload = Object.fromEntries(
      Object.entries(recordFields).filter(([_, v]) => v !== "" && v !== null)
    );

    await base(tableName).update([
      {
        id: body.recordId,
        fields: payload as any
      }
    ]);

    console.log("✅ Állás sikeresen módosítva az Airtable-ben!");

    return NextResponse.json({
      success: true,
      message: "Az állás módosítása sikeres.",
      data: {
        slug: body.slug,
        jobId: body.recordId,
      }
    });

  } catch (error: any) {
    const isDev = process.env.NODE_ENV === "development";
    
    console.error("❌ Hiba történt az állás módosításakor (Airtable API Hiba):");
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
