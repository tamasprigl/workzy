import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import { createAuthToken } from "@/lib/auth";

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const magicLinksTableName = process.env.AIRTABLE_MAGIC_LINKS_TABLE_NAME || "MagicLinks";
const employersTableName = process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";

// Ensure Airtable is configured
if (!airtableToken || !airtableBaseId) {
  throw new Error("Missing Airtable config");
}

const base = new Airtable({ apiKey: airtableToken as string }).base(airtableBaseId as string);

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // 1. Query Airtable for the specific token using a formula
    // We strictly search for an exact token match
    const records = await base(magicLinksTableName)
      .select({
        filterByFormula: `{Token} = '${token}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
    }

    const record = records[0];
    const usedAt = record.fields["Used At"];
    const expiresAtStr = record.fields["Expires At"];
    const email = record.fields["Email"];

    // 2. Validate token state
    if (usedAt) {
      return NextResponse.json({ error: "This link has already been used" }, { status: 400 });
    }

    if (!expiresAtStr || typeof expiresAtStr !== "string") {
      return NextResponse.json({ error: "Invalid token data" }, { status: 500 });
    }

    const expiresAt = new Date(expiresAtStr);
    const now = new Date();

    if (expiresAt < now) {
      return NextResponse.json({ error: "This link has expired" }, { status: 400 });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid token data: missing email" }, { status: 500 });
    }

    // 3. Mark token as used
    await base(magicLinksTableName).update([
      {
        id: record.id,
        fields: {
          "Used At": now.toISOString(),
        },
      },
    ]);

    // 4. Mark employer email as verified
    const employers = await base(employersTableName)
      .select({
        filterByFormula: `{Email} = '${email}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (employers.length > 0) {
      await base(employersTableName).update([
        {
          id: employers[0].id,
          fields: {
            "Email Verified": true,
          },
        },
      ]);
    }

    // 5. Create the JWT Session
    // Matches the payload signature expected by verifyAuthToken in lib/auth.ts
    const sessionToken = await createAuthToken({ username: email });

    // 6. Create redirect response and set cookie
    // Redirect to /admin so the user lands in the dashboard (or onboarding layout later)
    const baseUrl = process.env.APP_URL || request.nextUrl.origin;
    const response = NextResponse.redirect(new URL("/admin", baseUrl));

    // Cookie configuration identical to existing Workzy login practices
    response.cookies.set({
      name: "admin_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days matching the JWT expiration
    });

    return response;
  } catch (error) {
    console.error("Magic link verification error:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying the magic link" },
      { status: 500 }
    );
  }
}
