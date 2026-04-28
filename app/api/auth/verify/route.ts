import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import { createAuthToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;

const magicLinksTableName =
  process.env.AIRTABLE_MAGIC_LINKS_TABLE_NAME || "MagicLinks";
const employersTableName =
  process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";
const usersTableName =
  process.env.AIRTABLE_USERS_TABLE_NAME || "Users";

if (!airtableToken || !airtableBaseId) {
  throw new Error("Missing Airtable config");
}

const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

function text(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function escapeAirtable(value: string): string {
  return value.replace(/'/g, "\\'");
}

async function findOrCreateEmployer(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const employers = await base(employersTableName)
    .select({
      maxRecords: 1,
      filterByFormula: `LOWER({Email}) = '${escapeAirtable(normalizedEmail)}'`,
    })
    .firstPage();

  if (employers[0]) return employers[0];

  const created = await base(employersTableName).create([
    {
      fields: {
        Email: normalizedEmail,
        Role: "employer",
      },
    },
  ]);

  return created[0];
}

async function findOrCreateUser(email: string, employerId: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const users = await base(usersTableName)
    .select({
      maxRecords: 1,
      filterByFormula: `LOWER({email}) = '${escapeAirtable(normalizedEmail)}'`,
    })
    .firstPage();

  if (users[0]) return users[0];

  const created = await base(usersTableName).create([
    {
      fields: {
        email: normalizedEmail,
        Role: "employer",
        "Employer Record": [employerId],
      },
    },
  ]);

  return created[0];
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const records = await base(magicLinksTableName)
      .select({
        maxRecords: 1,
        filterByFormula: `{Token} = '${escapeAirtable(token)}'`,
      })
      .firstPage();

    const magicLink = records[0];

    if (!magicLink) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const email = text(magicLink.get("Email")).toLowerCase();
    const purpose = text(magicLink.get("Purpose"));

    const job = Array.isArray(magicLink.get("Job"))
      ? (magicLink.get("Job") as string[])
      : [];

    if (!email) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const employer = await findOrCreateEmployer(email);
    const user = await findOrCreateUser(email, employer.id);

    const role = String(user.fields.Role || "employer").toLowerCase();
    const name = text(user.fields.Name);
    const password = text(user.fields.Password);

    const authToken = await createAuthToken({
      email,
      username: email,
      userEmail: email,
      id: user.id,
      recordId: user.id,
      userId: user.id,
      employerId: employer.id,
      sub: user.id,
      role: role as any,
    });

    let redirectPath = "/admin/jobs";

    if (!name || !password) {
      const params = new URLSearchParams();

      if (job[0]) params.set("jobId", job[0]);
      if (purpose) params.set("purpose", purpose);

      redirectPath = `/admin/onboarding/account${
        params.toString() ? `?${params.toString()}` : ""
      }`;
    } else if (purpose === "job_activation" && job[0]) {
      redirectPath = `/admin/jobs/${job[0]}/edit`;
    }

    const response = NextResponse.redirect(new URL(redirectPath, request.url));

    response.cookies.set("admin_session", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Magic link verify error:", error);
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}