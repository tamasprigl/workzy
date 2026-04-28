import { cookies } from "next/headers";
import { verifyAuthToken } from "./auth";
import Airtable from "airtable";
import { cache } from "react";

function escapeAirtableString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function normalizeEmail(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

export const getCurrentAirtableUser = cache(async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;

  const session = await verifyAuthToken(token);

  const sessionEmail =
    normalizeEmail(session?.username) ||
    normalizeEmail(session?.email) ||
    normalizeEmail(session?.userEmail);

  if (!sessionEmail) return null;

  const airtableToken = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const usersTable = process.env.AIRTABLE_USERS_TABLE_NAME || "Users";
  const employersTable =
    process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";

  if (!airtableToken || !baseId) {
    console.error("Missing Airtable config");
    return sessionEmail;
  }

  try {
    const base = new Airtable({ apiKey: airtableToken }).base(baseId);
    const safeEmail = escapeAirtableString(sessionEmail);

    const userRecords = await base(usersTable)
      .select({
        filterByFormula: `LOWER({Email}) = "${safeEmail}"`,
        maxRecords: 1,
      })
      .firstPage();

    if (userRecords.length > 0) {
      return normalizeEmail(userRecords[0].fields.Email) || sessionEmail;
    }

    const employerRecords = await base(employersTable)
      .select({
        filterByFormula: `LOWER({Email}) = "${safeEmail}"`,
        maxRecords: 1,
      })
      .firstPage();

    if (employerRecords.length > 0) {
      return normalizeEmail(employerRecords[0].fields.Email) || sessionEmail;
    }
  } catch (err) {
    console.error("Current Airtable user lookup error:", err);
  }

  return sessionEmail;
});