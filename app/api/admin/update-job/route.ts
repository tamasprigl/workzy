import { NextResponse } from "next/server";
import Airtable from "airtable";
import { cookies } from "next/headers";
import { verifyAuthToken, getCurrentUser } from "@/lib/auth";

const LINKED_RECORD_FIELDS = ["Owner", "Company Record"];
const CHECKBOX_FIELDS = [
  "Manual Unlock",
  "Free Eligible",
  "Free Campaign",
];

const NUMBER_FIELDS = [
  "Ad Spend",
  "Max Free Spend",
  "Applicants Count",
  "Quality Score",
];

export async function POST(req: Request) {
  // 1. Verify Superadmin auth
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const authUser = await verifyAuthToken(token);
  if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getCurrentUser(authUser.email);
  if (!user || user.role?.trim() !== "Superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Process update
  const { jobId, field, value } = await req.json();

  if (!jobId || !field) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let airtableValue: any = value;

  if (LINKED_RECORD_FIELDS.includes(field)) {
    airtableValue = value ? [value] : [];
  }

  if (CHECKBOX_FIELDS.includes(field)) {
    airtableValue = Boolean(value);
  }

  if (NUMBER_FIELDS.includes(field)) {
    airtableValue = Number(value || 0);
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN })
    .base(process.env.AIRTABLE_BASE_ID!);

  try {
    await base(process.env.AIRTABLE_JOBS_TABLE_NAME!).update([
      {
        id: jobId,
        fields: {
          [field]: airtableValue,
        },
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Airtable update failed:", error);
    return NextResponse.json({ error: "Failed to update Airtable" }, { status: 500 });
  }
}
