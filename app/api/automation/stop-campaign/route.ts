import { NextResponse } from "next/server";
import Airtable from "airtable";

export async function POST(req: Request) {
  const secret = req.headers.get("x-workzy-secret");

  if (secret !== process.env.AIRTABLE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
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

  const jobsTable = base(process.env.AIRTABLE_JOBS_TABLE_NAME!);
  const job = await jobsTable.find(jobId);

  const fields = job.fields;

  const stopStatus = fields["Stop Status"];
  const stopReason = fields["Campaign Stop Reason"] || "Campaign stopped";

  if (stopStatus !== "STOP") {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "Campaign is not in STOP state",
    });
  }

  await jobsTable.update([
    {
      id: jobId,
      fields: {
        "Campaign Status": "Paused",
      },
    },
  ]);

  return NextResponse.json({
    success: true,
    action: "campaign_stopped",
    jobId,
    stopReason,
  });
}
