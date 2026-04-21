"use server";

import Airtable from "airtable";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifyAuthToken } from "@/lib/auth";
import { getCurrentAirtableUser } from "@/lib/current-airtable-user";

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function normalizeLower(value: unknown): string {
  return normalizeString(value).toLowerCase();
}

function matchesCurrentUser(userField: unknown, currentEmail: string): boolean {
  if (!currentEmail) return false;
  if (typeof userField === "string") return normalizeLower(userField) === currentEmail;
  if (Array.isArray(userField)) return userField.some((item) => normalizeLower(item) === currentEmail);
  return false;
}

export async function unlockApplicants(jobId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return { success: false, error: "Unauthorized" };
  }

  const payload = await verifyAuthToken(token);
  if (!payload || !payload.username) {
    return { success: false, error: "Invalid token" };
  }

  const currentUser = await getCurrentAirtableUser();
  const currentEmail = normalizeLower(
    typeof currentUser === "string"
      ? currentUser
      : currentUser && typeof currentUser === "object" && "email" in (currentUser as any)
        ? (currentUser as any).email
        : ""
  );

  if (!currentEmail) {
    return { success: false, error: "Airtable user not found" };
  }

  const airtableToken = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const jobsTable = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";
  const appsTable = process.env.AIRTABLE_APPLICATIONS_TABLE_NAME || "Applications";

  if (!airtableToken || !baseId) {
    return { success: false, error: "Missing Airtable configuration" };
  }

  try {
    const base = new Airtable({ apiKey: airtableToken }).base(baseId);

    // Verify job ownership
    const jobRecord = await base(jobsTable).find(jobId);
    if (!jobRecord) {
      return { success: false, error: "Job not found" };
    }

    if (!matchesCurrentUser(jobRecord.get("User"), currentEmail)) {
      return { success: false, error: "Permission denied: You do not own this job." };
    }

    // Update applicants_unlocked
    await base(jobsTable).update(jobId, {
      applicants_unlocked: true,
    });

    // Attempt to update locked applications to Visible natively as previous logic did
    let allApps: readonly any[] = [];
    try {
      allApps = await base(appsTable)
        .select({
          filterByFormula: `AND(FIND("${jobId}", ARRAYJOIN({Job})) > 0, {Access} = 'Locked')`
        })
        .all();
    } catch {
      allApps = await base(appsTable).select().all();
      allApps = allApps.filter((req) => {
        const linkedJobs = req.get("Job") || req.get("job");
        const jobLinks = Array.isArray(linkedJobs) ? linkedJobs.map(String) : [];
        return jobLinks.includes(jobId) && req.get("Access") === "Locked";
      });
    }

    const updates = allApps.map(app => ({
      id: app.id,
      fields: { Access: "Visible" }
    }));

    for (let i = 0; i < updates.length; i += 10) {
      await base(appsTable).update(updates.slice(i, i + 10));
    }

    revalidatePath(`/admin/jobs/${jobId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Error unlocking applicants:", err);
    return { success: false, error: "Airtable update failed" };
  }
}
