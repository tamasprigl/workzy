import { cookies } from "next/headers";
import { verifyAuthToken } from "./auth";
import Airtable from "airtable";
import { cache } from "react";

export const getCurrentAirtableUser = cache(async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;

  const session = await verifyAuthToken(token);
  if (!session || !session.username) return null;

  const airtableToken = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const usersTable = process.env.AIRTABLE_USERS_TABLE_NAME || "Users";

  if (!airtableToken || !baseId) {
    console.error("Missing Airtable config");
    return null;
  }

  try {
    const base = new Airtable({ apiKey: airtableToken }).base(baseId);

    const records = await base(usersTable)
      .select({
        filterByFormula: `{email} = "${session.username}"`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length > 0) {
      return records[0].id;
    }
  } catch (err) {
    console.error("User lookup error:", err);
  }

  return null;
});
