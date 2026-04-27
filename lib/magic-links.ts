import Airtable from "airtable";
import crypto from "crypto";

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;

const employersTableName =
  process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";

const magicLinksTableName =
  process.env.AIRTABLE_MAGIC_LINKS_TABLE_NAME || "MagicLinks";

if (!airtableToken || !airtableBaseId) {
  throw new Error("Missing Airtable config");
}

const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

function escapeAirtableFormulaValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export async function ensureEmployer(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const safeEmail = escapeAirtableFormulaValue(normalizedEmail);

  const existing = await base(employersTableName)
    .select({
      maxRecords: 1,
      filterByFormula: `LOWER({Email}) = "${safeEmail}"`,
    })
    .all();

  if (existing[0]) {
    return existing[0];
  }

  return await base(employersTableName).create({
    Email: normalizedEmail,
    "Email Verified": false,
  } as any);
}

export async function createMagicLink(params: {
  email: string;
  token?: string;
  purpose?: string;
  jobId?: string;
  expiresAt?: string;
}) {
  const normalizedEmail = params.email.toLowerCase().trim();

  const token = params.token || crypto.randomBytes(32).toString("hex");

  const expiresAt =
    params.expiresAt || new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const fields: Record<string, any> = {
    Token: token,
    Email: normalizedEmail,
    Purpose: params.purpose || "login",
    "Expires At": expiresAt,
    Used: false,
  };

  if (params.jobId) {
    fields.JobId = params.jobId;
    fields.Job = [params.jobId];
  }

  await base(magicLinksTableName).create(fields as any);

  return {
    token,
    email: normalizedEmail,
    expiresAt,
    loginUrl: `/api/auth/magic-link?token=${token}`,
  };
}