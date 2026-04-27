import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import crypto from "crypto";
import { createAuthToken } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;

const magicLinksTableName =
  process.env.AIRTABLE_MAGIC_LINKS_TABLE_NAME || "MagicLinks";

const appUrl =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

if (!airtableToken || !airtableBaseId) {
  throw new Error("Missing Airtable config");
}

const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function createExpiryDate() {
  return new Date(Date.now() + 15 * 60 * 1000).toISOString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = normalizeEmail(String(body.email || ""));
    const purpose = String(body.purpose || "login");
    const jobId = body.jobId ? String(body.jobId) : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Érvénytelen email cím." },
        { status: 400 }
      );
    }

    const token = createToken();
    const expiresAt = createExpiryDate();

    const fields: Record<string, any> = {
      Token: token,
      Email: email,
      Purpose: purpose,
      "Expires At": expiresAt,
    };

    if (jobId) {
      fields.Job = [jobId];
    }

    await base(magicLinksTableName).create([{ fields }]);

    const magicLink = `${appUrl}/api/auth/magic-link?token=${token}`;

    await sendMagicLinkEmail({
      email,
      link: magicLink,
    });

    return NextResponse.json({
      success: true,
      message: "Magic link sikeresen kiküldve.",
    });
  } catch (error: any) {
    console.error("Magic link küldési hiba:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Nem sikerült kiküldeni a magic linket.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const records = await base(magicLinksTableName)
      .select({
        maxRecords: 1,
        filterByFormula: `{Token} = "${token}"`,
      })
      .firstPage();

    const magicLinkRecord = records[0];

    if (!magicLinkRecord) {
      return NextResponse.redirect(
        new URL("/admin/login?error=invalid-link", request.url)
      );
    }

    const fields = magicLinkRecord.fields;

    const email = normalizeEmail(String(fields.Email || ""));
    const expiresAt = String(fields["Expires At"] || "");

    if (!email) {
      return NextResponse.redirect(
        new URL("/admin/login?error=missing-email", request.url)
      );
    }

    if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
      return NextResponse.redirect(
        new URL("/admin/login?error=expired-link", request.url)
      );
    }

    const authToken = await createAuthToken({
      email,
      role: "employer",
    });

    const response = NextResponse.redirect(new URL("/admin", request.url));

    response.cookies.set("admin_session", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    await base(magicLinksTableName).destroy(magicLinkRecord.id);

    return response;
  } catch (error) {
    console.error("Magic link belépési hiba:", error);

    return NextResponse.redirect(
      new URL("/admin/login?error=magic-link-error", request.url)
    );
  }
}