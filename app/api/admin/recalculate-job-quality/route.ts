import { NextResponse } from "next/server";
import Airtable from "airtable";
import {
  calculateJobQualityScore,
  getQualityStatus,
} from "@/lib/jobQuality";
import { cookies } from "next/headers";
import { verifyAuthToken, getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  // Verify Superadmin auth
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const authUser = await verifyAuthToken(token);
  if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getCurrentUser(authUser.email);
  if (!user || user.role?.trim() !== "Superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { jobId } = await req.json();

  if (!jobId) {
    return NextResponse.json(
      { success: false, error: "Missing jobId" },
      { status: 400 }
    );
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN })
    .base(process.env.AIRTABLE_BASE_ID!);

  try {
    const job = await base(process.env.AIRTABLE_JOBS_TABLE_NAME!).find(jobId);

    const score = calculateJobQualityScore(job.fields);
    const status = getQualityStatus(score);

    await base(process.env.AIRTABLE_JOBS_TABLE_NAME!).update([
      {
        id: jobId,
        fields: {
          "Quality Score": score,
          "Quality Status": status,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      score,
      status,
    });
  } catch (error) {
    console.error("Failed to recalculate job quality:", error);
    return NextResponse.json({ error: "Failed to recalculate quality" }, { status: 500 });
  }
}
