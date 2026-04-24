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

  const shouldStart = fields["Should Start Campaign"];
  const stopStatus = fields["Stop Status"];

  if (!shouldStart || stopStatus === "RUN") {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "Campaign should not start or already running",
    });
  }

  await jobsTable.update([
    {
      id: jobId,
      fields: {
        "Campaign Status": "Active",
      },
    },
  ]);

  return NextResponse.json({
    success: true,
    action: "campaign_started",
    jobId,
  });
}
