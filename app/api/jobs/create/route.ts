import { NextResponse } from "next/server";
import Airtable from "airtable";

type CreateJobRequestBody = {
  title?: string;
  slug?: string;
  company?: string;
  location?: string;
  type?: string;
  employmentType?: string;
  schedule?: string;
  salary?: string;
  shortDescription?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  ctaText?: string;
  status?: string;
  facebookPostText?: string;
  image?: string | null;
  campaign?: {
    platform?: string;
    budget?: number;
    location?: string;
    goal?: string;
  };
};

function normalizeStatus(status?: string) {
  if (!status) return "Aktív";

  const normalized = status.trim().toLowerCase();

  if (normalized === "aktív" || normalized === "aktiv" || normalized === "active") {
    return "Aktív";
  }

  if (normalized === "inaktív" || normalized === "inaktiv" || normalized === "inactive") {
    return "Inaktív";
  }

  return status;
}

function isHttpUrl(value?: string | null) {
  if (!value) return false;
  return value.startsWith("http://") || value.startsWith("https://");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateJobRequestBody;

    if (!body.title || !body.slug || !body.company) {
      return NextResponse.json(
        {
          success: false,
          message: "A pozíció neve, a slug és a cég neve kötelező.",
        },
        { status: 400 }
      );
    }

    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_JOBS_TABLE_NAME;

    if (!token || !baseId || !tableName) {
      console.error("❌ Hiányzó Airtable környezeti változók.", {
        hasToken: !!token,
        hasBaseId: !!baseId,
        hasJobsTable: !!tableName,
      });

      return NextResponse.json(
        {
          success: false,
          message: "A rendszer nincs megfelelően konfigurálva.",
        },
        { status: 500 }
      );
    }

    const base = new Airtable({ apiKey: token }).base(baseId);

    const normalizedStatus = normalizeStatus(body.status);

    const recordFields: Record<string, unknown> = {
      Title: body.title,
      Slug: body.slug,
      Company: body.company,
      Location: body.location || "",
      Type: body.type || "",
      "Employment Type": body.employmentType || "",
      Schedule: body.schedule || "",
      Salary: body.salary || "",
      "Short Description": body.shortDescription || "",
      Description: body.description || "",
      Requirements: body.requirements || "",
      Benefits: body.benefits || "",
      "CTA Text": body.ctaText || "Jelentkezés az állásra",
      "Campaign Platform": body.campaign?.platform || "",
      "Campaign Budget Daily":
        body.campaign?.budget != null && !Number.isNaN(Number(body.campaign.budget))
          ? Number(body.campaign.budget)
          : null,
      "Campaign Target Location": body.campaign?.location || "",
      "Campaign Goal": body.campaign?.goal || "",
      "Facebook Post Text": body.facebookPostText || "",
      Status: normalizedStatus,
    };

    /**
     * FONTOS:
     * A mostani AI route data:image/png;base64,... stringet küld vissza.
     * Ezt az Airtable attachment mezőbe nem érdemes közvetlenül menteni.
     *
     * Ha később publikus URL-t kapsz vissza (pl. Vercel Blob / Cloudinary),
     * akkor ide be lehet kötni az attachment mezőt is.
     */
    if (isHttpUrl(body.image)) {
      // Ha létrehozol az Airtable-ben egy attachment mezőt pl. "Generated Image" néven,
      // akkor ezt később használhatod:
      // recordFields["Generated Image"] = [{ url: body.image }];
      //
      // Most biztonságosan egy sima URL mezőhöz kötjük, ha van ilyen.
      recordFields["Generated Image URL"] = body.image;
    }

    const payload = Object.fromEntries(
      Object.entries(recordFields).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    console.log(`⏳ Állás mentése az Airtable-be (${tableName})...`);
    console.log("📦 Mentett mezők:", Object.keys(payload));

    const records = await base(tableName).create([
      {
        fields: payload as any,
      },
    ]);

    const createdRecord = records[0];

    console.log("✅ Új állás sikeresen rögzítve az Airtable-ben.");
    console.log(`📌 Pozíció: ${body.title} | Airtable ID: ${createdRecord.id}`);

    return NextResponse.json({
      success: true,
      message: "Az állás sikeresen létrejött.",
      data: {
        jobId: createdRecord.id,
        slug: body.slug,
        imageStoredAsUrl: isHttpUrl(body.image),
        imageRequiresUpload:
          !!body.image && !isHttpUrl(body.image),
      },
    });
  } catch (error: any) {
    const isDev = process.env.NODE_ENV === "development";

    console.error("❌ Hiba történt az állás mentésekor:");
    console.error(
      JSON.stringify(
        {
          message: error?.message,
          statusCode: error?.statusCode,
          error: error?.error,
          stack: isDev ? error?.stack : undefined,
        },
        null,
        2
      )
    );

    return NextResponse.json(
      {
        success: false,
        message: isDev
          ? error?.message || "Airtable API hiba történt."
          : "Szerver hiba történt az adatok feldolgozása során.",
        details: isDev
          ? {
              statusCode: error?.statusCode,
              type: error?.type || error?.error,
            }
          : undefined,
      },
      { status: error?.statusCode || 500 }
    );
  }
}