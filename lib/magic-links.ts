import Airtable from "airtable";

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;

const magicLinksTableName =
  process.env.AIRTABLE_MAGIC_LINKS_TABLE_NAME || "MagicLinks";

const employersTableName =
  process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";

if (!airtableToken || !airtableBaseId) {
  throw new Error("Missing Airtable configuration");
}

const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

/**
 * EMPLOYER létrehozása vagy visszaadása email alapján
 */
export async function ensureEmployer(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await base(employersTableName)
    .select({
      maxRecords: 1,
      filterByFormula: `LOWER({Email}) = '${normalizedEmail.replace(/'/g, "\\'")}'`,
    })
    .firstPage();

  if (existing.length > 0) {
    return existing[0];
  }

  const created = await base(employersTableName).create([
    {
      fields: {
        Email: normalizedEmail,
        "Email Verified": false,
      },
    },
  ]);

  return created[0];
}

/**
 * Magic link létrehozása
 */
export async function createMagicLink({
  token,
  email,
  jobId,
  purpose = "job_activation",
  expiresAt,
}: {
  token: string;
  email: string;
  jobId: string;
  purpose?: string;
  expiresAt: string;
}) {
  const records = await base(magicLinksTableName).create([
    {
      fields: {
        Token: token,
        Email: email.toLowerCase().trim(),
        Purpose: purpose,
        "Expires At": expiresAt,

        // ⚠️ FONTOS: ha linked field
        Job: [jobId],
      },
    },
  ]);

  return records[0];
}

/**
 * Magic link lekérése token alapján
 */
export async function getMagicLinkByToken(token: string) {
  const records = await base(magicLinksTableName)
    .select({
      maxRecords: 1,
      filterByFormula: `{Token} = '${token}'`,
    })
    .firstPage();

  return records[0] || null;
}

/**
 * Magic link lejárat ellenőrzés
 */
export function isMagicLinkExpired(expiresAt?: string) {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() < Date.now();
}

/**
 * Magic link felhasználtnak jelölése
 */
export async function markMagicLinkUsed(recordId: string) {
  await base(magicLinksTableName).update([
    {
      id: recordId,
      fields: {
        "Used At": new Date().toISOString(),
      },
    },
  ]);
}