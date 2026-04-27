import Airtable from "airtable";

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const magicLinksTableName =
  process.env.AIRTABLE_MAGIC_LINKS_TABLE_NAME || "MagicLinks";

if (!airtableToken || !airtableBaseId) {
  throw new Error("Missing Airtable configuration");
}

const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

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
        JobId: jobId,
      },
    },
  ]);

  return records[0];
}