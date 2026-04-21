import Airtable from "airtable";

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const magicLinksTableName = process.env.AIRTABLE_MAGIC_LINKS_TABLE_NAME || "MagicLinks";
const employersTableName = process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";

if (!airtableToken || !airtableBaseId) {
  throw new Error("Missing Airtable config");
}

const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

export type CreateMagicLinkParams = {
  token: string;
  email: string;
  jobId?: string;
  purpose: "login" | "job_activation";
  expiresAt: string; // ISO string Date
};

/**
 * Creates a new Magic Link record in Airtable.
 */
export async function createMagicLink({
  token,
  email,
  jobId,
  purpose,
  expiresAt,
}: CreateMagicLinkParams) {
  const fields: Record<string, unknown> = {
    Token: token,
    Email: email,
    Purpose: purpose,
    "Expires At": expiresAt,
  };

  if (jobId) {
    if (!jobId.startsWith("rec")) {
      throw new Error("jobId must be a valid Airtable record ID");
    }
    // Airtable linked records expect an array of record IDs
    fields["Job"] = [jobId];
  }

  try {
    const records = await base(magicLinksTableName).create([
      { fields: fields as Airtable.FieldSet }
    ]);
    
    if (!records.length) {
      throw new Error("Failed to create magic link record");
    }
    
    return records[0];
  } catch (err) {
    console.error("Airtable createMagicLink ERROR:", {
      err,
      email,
      jobId,
      purpose,
      expiresAt,
    });
    throw err;
  }
}

/**
 * Ensures an employer record exists for the given email.
 * Creates one if it does not exist.
 */
export async function ensureEmployer(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existing = await base(employersTableName)
      .select({
        filterByFormula: `{Email} = '${normalizedEmail}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (existing.length > 0) {
      return existing[0];
    }

    const created = await base(employersTableName).create([
      { fields: { Email: normalizedEmail } as Airtable.FieldSet }
    ]);
    
    return created[0];
  } catch (err) {
    console.error("Airtable ensureEmployer ERROR:", err);
    throw err;
  }
}
