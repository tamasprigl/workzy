import { createAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Airtable from "airtable";

export const dynamic = "force-dynamic";

function escapeAirtableString(value: string) {
  return value.replace(/'/g, "\\'");
}

function getBase() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    throw new Error("Missing Airtable config");
  }

  return new Airtable({ apiKey: token }).base(baseId);
}

export async function GET() {
  redirect("/admin/login");
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = String(
    formData.get("email") ?? formData.get("username") ?? ""
  )
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect("/admin/login?error=missing_credentials");
  }

  const employersTable =
    process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";

  const base = getBase();

  const safeEmail = escapeAirtableString(email);

  const records = await base(employersTable)
    .select({
      filterByFormula: `LOWER({Email}) = '${safeEmail}'`,
      maxRecords: 1,
    })
    .firstPage();

  if (!records.length) {
    redirect("/admin/login?error=invalid_credentials");
  }

  const employer = records[0];

  const storedPassword = String(employer.fields.Password || "").trim();

  if (!storedPassword || storedPassword !== password) {
    redirect("/admin/login?error=invalid_credentials");
  }

  const role = String(employer.fields.Role || "employer").toLowerCase();

  const companyField = employer.fields.Company;
  const companyId = Array.isArray(companyField) ? companyField[0] : null;

  const token = await createAuthToken({
    username: email,
    email,
    role: role as any,
    employerId: employer.id,
    companyId,
  });

  const cookieStore = await cookies();

  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}