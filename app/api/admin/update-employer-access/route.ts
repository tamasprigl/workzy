import { NextResponse } from "next/server";
import Airtable from "airtable";
import { cookies } from "next/headers";
import { verifyAuthToken, getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  // Verify auth
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const authUser = await verifyAuthToken(token);
  if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getCurrentUser(authUser.email);
  if (!user || user.role?.trim() !== "Superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { employerId, plan, applicantLimit, accessStatus } = await req.json();

  if (!employerId) {
    return NextResponse.json(
      { success: false, error: "Missing employerId" },
      { status: 400 }
    );
  }

  const fields: Record<string, any> = {};

  if (plan !== undefined) fields.Plan = plan;
  if (applicantLimit !== undefined) {
    fields["Applicant Limit"] = Number(applicantLimit);
  }
  if (accessStatus !== undefined) {
    fields["Access Status"] = accessStatus;
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN })
    .base(process.env.AIRTABLE_BASE_ID!);

  try {
    await base(process.env.AIRTABLE_EMPLOYERS_TABLE_NAME!).update([
      {
        id: employerId,
        fields,
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Airtable update failed:", error);
    return NextResponse.json({ error: "Failed to update employer" }, { status: 500 });
  }
}
