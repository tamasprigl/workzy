"use server";

import Airtable from "airtable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken } from "@/lib/auth";

function getBase() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    throw new Error("Missing Airtable config");
  }

  return new Airtable({ apiKey: token }).base(baseId);
}

function getText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function buildAccountUrl(jobId?: string) {
  return `/admin/onboarding/account${jobId ? `?jobId=${encodeURIComponent(jobId)}` : ""}`;
}

export async function saveAccountOnboarding(formData: FormData) {
  const name = getText(formData.get("name"));
  const password = getText(formData.get("password"));
  const jobId = getText(formData.get("jobId"));

  if (!name || password.length < 6) {
    redirect(buildAccountUrl(jobId));
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;

  if (!sessionCookie) {
    redirect("/admin/login");
  }

  const session = await verifyAuthToken(sessionCookie);

  if (!session?.email) {
    redirect("/admin/login");
  }

  const userId =
    getText(session.userId) ||
    getText(session.id) ||
    getText(session.recordId) ||
    getText(session.sub);

  if (!userId || !userId.startsWith("rec")) {
    throw new Error(`Invalid userId in session: ${userId || "missing"}`);
  }

  const usersTable = process.env.AIRTABLE_USERS_TABLE_NAME || "Users";
  const base = getBase();

  await base(usersTable).update(userId, {
    Name: name,
    Password: password,
    "Onboarding Complete": true,
  });

  if (jobId && jobId.startsWith("rec")) {
    redirect(`/admin/jobs/${jobId}/edit`);
  }

  redirect("/admin/onboarding");
}