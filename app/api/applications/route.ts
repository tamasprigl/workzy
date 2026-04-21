import { NextResponse } from "next/server";
import Airtable from "airtable";

const FREE_VISIBLE_LIMIT = 5;

function escapeAirtableValue(value: string) {
  return value.replace(/"/g, '\\"');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobSlug, jobTitle, fullName, email, phone, message } = body;

    if (!jobSlug || !jobTitle || !fullName || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "A kötelező mezők hiányoznak.",
        },
        { status: 400 }
      );
    }

    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_APPLICATIONS_TABLE_NAME;

    if (!token || !baseId || !tableName) {
      return NextResponse.json(
        {
          success: false,
          message: "Hiányzó Airtable konfiguráció.",
        },
        { status: 500 }
      );
    }

    const base = new Airtable({ apiKey: token }).base(baseId);
    const safeJobSlug = escapeAirtableValue(jobSlug);

    // Megnézzük, az adott álláshoz hány LÁTHATÓ jelentkezés van már
    const visibleApplications = await base(tableName)
      .select({
        filterByFormula: `AND({Job Slug} = "${safeJobSlug}", {Access} = "Visible")`,
      })
      .all();

    const visibleCount = visibleApplications.length;
    const access = visibleCount < FREE_VISIBLE_LIMIT ? "Visible" : "Locked";

    const records = await base(tableName).create([
      {
        fields: {
          "Job Slug": jobSlug,
          "Job Title": jobTitle,
          "Full Name": fullName,
          Email: email,
          Phone: phone || "",
          Message: message || "",
          Status: "Új",
          Access: access,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      recordId: records[0].id,
      access,
      visibleCountAfterCreate: access === "Visible" ? visibleCount + 1 : visibleCount,
      limit: FREE_VISIBLE_LIMIT,
      message:
        access === "Locked"
          ? "A jelentkezés sikeresen beérkezett, de ez a jelentkező már a fizetős csomaghoz tartozó zárolt jelentkezések közé került."
          : "A jelentkezés sikeresen beérkezett.",
    });
  } catch (error) {
    console.error("Hiba jelentkezés leadásakor:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Hiba történt a jelentkezés elküldése során.",
      },
      { status: 500 }
    );
  }
}