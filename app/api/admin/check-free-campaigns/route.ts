import { NextResponse } from "next/server";
import Airtable from "airtable";

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

  const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN })
    .base(process.env.AIRTABLE_BASE_ID!);

  try {
    const jobs = await base(process.env.AIRTABLE_JOBS_TABLE_NAME!).select().all();

    const updates = [];

    for (const job of jobs) {
      const qStatusRaw = job.fields["Quality Status"];
      const qStatusNormalized = String(qStatusRaw || "").trim();
      const freeCampRaw = job.fields["Free Campaign"];
      const isFreeCamp = freeCampRaw === true || freeCampRaw === "true" || freeCampRaw === 1 || freeCampRaw === "1";
      const currentCampaignStatus = job.fields["Campaign Status"];
      
      let computedStatus = "Paused";
      
      if (qStatusNormalized !== "Approved") {
        computedStatus = "Paused"; // corresponds to LOCKED
      } else if (isFreeCamp) {
        computedStatus = "Active"; // corresponds to RUNNING
      } else {
        computedStatus = "Paused"; // corresponds to LOCKED
      }

      const updatePayload = {
        "Campaign Status": computedStatus,
      };

      console.log("JOB DEBUG", {
        id: job.id,
        title: job.fields.Title,
        qStatusRaw,
        qStatusNormalized,
        freeCampRaw,
        freeCampType: typeof freeCampRaw,
        isFreeCamp,
        computedStatus,
        updatePayload
      });

      if (currentCampaignStatus !== computedStatus) {
        updates.push({
          id: job.id,
          fields: updatePayload,
        });
      }
    }

    // Process updates in batches of 10 for Airtable API
    for (let i = 0; i < updates.length; i += 10) {
      await base(process.env.AIRTABLE_JOBS_TABLE_NAME!).update(updates.slice(i, i + 10));
    }

    const url = new URL(req.url);
    return NextResponse.redirect(new URL("/admin/superadmin", url.origin), 303);
  } catch (error) {
    console.error("Failed to check free campaigns:", error);
    const url = new URL(req.url);
    return NextResponse.redirect(new URL("/admin/superadmin?error=failed", url.origin), 303);
  }
}
