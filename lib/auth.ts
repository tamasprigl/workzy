import { SignJWT, jwtVerify } from "jose";
import Airtable from "airtable";

export type UserRole = "superadmin" | "admin" | "employer";

export type AdminSession = {
  username: string;
  email: string;
  role: UserRole;
  employerId?: string;
  companyId?: string | null;
  [key: string]: any;
};

const secretKey = process.env.AUTH_SECRET;

if (!secretKey) {
  throw new Error("AUTH_SECRET environment variable is not set");
}

const key = new TextEncoder().encode(secretKey);

function getBase() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    throw new Error("Missing Airtable config");
  }

  return new Airtable({ apiKey: token }).base(baseId);
}

function escapeAirtableString(value: string) {
  return value.replace(/'/g, "\\'");
}

export async function createAuthToken(payload: AdminSession) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyAuthToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    if (!payload || typeof payload.email !== "string") {
      return null;
    }

    return {
      username: String(payload.username || payload.email),
      email: String(payload.email),
      role: (payload.role as UserRole) || "employer",
      employerId: payload.employerId ? String(payload.employerId) : undefined,
      companyId: payload.companyId ? String(payload.companyId) : null,
      ...payload,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(email: string) {
  const employersTable =
    process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";

  const base = getBase();
  const safeEmail = escapeAirtableString(email.toLowerCase().trim());

  const records = await base(employersTable)
    .select({
      filterByFormula: `LOWER({Email}) = '${safeEmail}'`,
      maxRecords: 1,
    })
    .firstPage();

  if (!records.length) {
    return null;
  }

  const record = records[0];

  const companyField = record.fields.Company;

  return {
    id: record.id,
    email: String(record.fields.Email || ""),
    role: String(record.fields.Role || "employer") as UserRole,
    employerId: record.id,
    companyId: Array.isArray(companyField) ? companyField[0] : null,
    plan: String(record.fields.Plan || "Free"),
    accessStatus: String(record.fields["Access Status"] || "Active"),
    applicantLimit: Number(record.fields["Applicant Limit"] || 5),
  };
}

export async function getEmployerAccess(employerId: string) {
  const employersTable =
    process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";

  const base = getBase();

  const employer = await base(employersTable).find(employerId);

  return {
    id: employer.id,
    plan: String(employer.fields.Plan || "Free"),
    applicantLimit: Number(employer.fields["Applicant Limit"] || 5),
    accessStatus: String(employer.fields["Access Status"] || "Active"),
    role: String(employer.fields.Role || "employer"),
  };
}