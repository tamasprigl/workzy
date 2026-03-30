import { NextResponse } from "next/server";
import Airtable from "airtable";

export async function POST(request: Request) {
  try {
    const body: any = await request.json();

    if (!body.recordId || !body.status) {
      console.error("❌ Validációs hiba: Hiányzó kötelező mezők (recordId, status).", body);
      return NextResponse.json(
        { success: false, message: "A Rekord azonosító és az új státusz megadása kötelező!" },
        { status: 400 }
      );
    }

    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_APPLICATIONS_TABLE_NAME;

    if (!token || !baseId || !tableName) {
      console.error("❌ Rendszer hiba: Hiányzó Airtable környezeti változók.", {
        hasToken: !!token,
        hasBaseId: !!baseId,
        hasApplicationsTable: !!tableName
      });
      return NextResponse.json(
        { 
          success: false, 
          message: "A rendszer nincs megfelelően konfigurálva."
        },
        { status: 500 }
      );
    }

    const base = new Airtable({ apiKey: token }).base(baseId);

    console.log(`⏳ Jelentkezés státuszának frissítése az Airtable-ben (${body.recordId})...`);

    // Frissítjük a konkrét Airtable Application "Status" mezőjét
    await base(tableName).update([
      {
        id: body.recordId,
        fields: {
          "Status": body.status
        }
      }
    ]);

    console.log("✅ Jelentkezés státusza frissítve (ID: " + body.recordId + ", Új: " + body.status + ")");

    return NextResponse.json({
      success: true,
      message: "Státusz sikeresen frissítve."
    });

  } catch (error: any) {
    const isDev = process.env.NODE_ENV === "development";
    
    console.error("❌ Hiba történt egy jelentkezés frissítésekor (Airtable API Hiba):");
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
