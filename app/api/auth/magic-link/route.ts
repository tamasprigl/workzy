import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import { createAuthToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const magicLinksTableName =
  process.env.AIRTABLE_MAGIC_LINKS_TABLE_NAME || "MagicLinks";

if (!airtableToken || !airtableBaseId) {
  throw new Error("Missing Airtable config");
}

const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

function escapeAirtableFormulaValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function getFieldString(fields: Record<string, any>, names: string[]): string {
  for (const name of names) {
    const value = fields[name];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return "";
}

function isExpired(value: string): boolean {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  return date.getTime() < Date.now();
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")?.trim();

    if (!token) {
      return NextResponse.redirect(
        new URL("/admin/login?error=missing-token", request.url)
      );
    }

    const safeToken = escapeAirtableFormulaValue(token);

    const records = await base(magicLinksTableName)
      .select({
        maxRecords: 1,
        filterByFormula: `{Token} = "${safeToken}"`, // ← EZ FONTOS JAVÍTÁS
      })
      .all();

    const magicLinkRecord = records[0];

    if (!magicLinkRecord) {
      return NextResponse.redirect(
        new URL("/admin/login?error=invalid-token", request.url)
      );
    }

    const fields = magicLinkRecord.fields as Record<string, any>;

    const email = getFieldString(fields, ["Email", "email"]).toLowerCase();

    const expiresAt = getFieldString(fields, [
      "Expires At",
      "ExpiresAt",
      "expiresAt",
      "Expiry",
    ]);

    if (!email) {
      return NextResponse.redirect(
        new URL("/admin/login?error=missing-email", request.url)
      );
    }

    if (isExpired(expiresAt)) {
      return NextResponse.redirect(
        new URL("/admin/login?error=expired-token", request.url)
      );
    }

    const authToken = await createAuthToken({
      email,
      username: email,
      role: "employer",
    });

    await base(magicLinksTableName).update(magicLinkRecord.id, {
      Used: true,
      "Used At": new Date().toISOString(),
    });

    const response = NextResponse.redirect(
      new URL("/admin", request.url)
    );

    response.cookies.set("admin_session", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Magic link login error:", error);

    return NextResponse.redirect(
      new URL("/admin/login?error=magic-link-failed", request.url)
    );
  }
}