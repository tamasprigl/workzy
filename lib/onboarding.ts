"use server";

import Airtable from "airtable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken } from "@/lib/auth";

const usersTableName = process.env.AIRTABLE_USERS_TABLE_NAME || "Users";
const employersTableName =
  process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";
const companiesTableName =
  process.env.AIRTABLE_COMPANIES_TABLE_NAME || "Companies";
const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";

function getBase() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    throw new Error("Missing Airtable configuration");
  }

  return new Airtable({ apiKey: token }).base(baseId);
}

function getText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function escapeAirtable(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function getLinkedIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.startsWith("rec"));
}

function assertRecordId(value: string, label: string) {
  if (!value || !value.startsWith("rec")) {
    throw new Error(`Invalid ${label}: ${value || "missing"}`);
  }
}

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;

  return verifyAuthToken(token);
}

async function getSessionEmail(): Promise<string> {
  const session = await getSession();

  const email =
    getText(session?.email) ||
    getText(session?.username) ||
    getText(session?.userEmail);

  return email.includes("@") ? email.toLowerCase().trim() : "";
}

async function findOrCreateEmployer(base: Airtable.Base, email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const records = await base(employersTableName)
    .select({
      maxRecords: 1,
      filterByFormula: `LOWER({Email}) = '${escapeAirtable(normalizedEmail)}'`,
    })
    .firstPage();

  if (records[0]) return records[0];

  const created = await base(employersTableName).create([
    {
      fields: {
        Email: normalizedEmail,
      },
    },
  ]);

  return created[0];
}

async function findUserByEmail(base: Airtable.Base, email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const records = await base(usersTableName)
    .select({
      maxRecords: 1,
      filterByFormula: `LOWER({email}) = '${escapeAirtable(normalizedEmail)}'`,
    })
    .firstPage();

  return records[0] || null;
}

async function createOrUpdateCompany({
  base,
  employer,
  name,
  website,
  description,
}: {
  base: Airtable.Base;
  employer: any;
  name: string;
  website: string;
  description: string;
}) {
  const existingCompanyIds = getLinkedIds(employer.get("Company"));

  const companyFields: Airtable.FieldSet = {
    Name: name,
    "Profile Complete": true,
  };

  if (website) companyFields.Website = website;
  if (description) companyFields.Description = description;

  if (existingCompanyIds.length > 0) {
    const companyId = existingCompanyIds[0];
    assertRecordId(companyId, "existing companyId");

    await base(companiesTableName).update(companyId, companyFields);
    return companyId;
  }

  const created = await base(companiesTableName).create([
    {
      fields: companyFields,
    },
  ]);

  const companyId = created[0]?.id;
  assertRecordId(companyId, "created companyId");

  await base(employersTableName).update(employer.id, {
    Company: [companyId],
  });

  return companyId;
}

export async function checkOnboardingStatus() {
  const email = await getSessionEmail();

  if (!email) {
    return { isComplete: false };
  }

  try {
    const base = getBase();
    const employer = await findOrCreateEmployer(base, email);

    const companyIds = getLinkedIds(employer.get("Company"));

    if (!companyIds.length) {
      return { isComplete: false };
    }

    const company = await base(companiesTableName).find(companyIds[0]);

    return {
      isComplete: company.get("Profile Complete") === true,
    };
  } catch (error) {
    console.error("Failed to check onboarding:", error);
    return { isComplete: false };
  }
}

export async function submitOnboarding(formData: FormData) {
  const email = await getSessionEmail();

  if (!email) {
    redirect("/admin/login");
  }

  const companyName = getText(formData.get("name"));
  const website = getText(formData.get("website"));
  const description = getText(formData.get("description"));

  if (!companyName) {
    throw new Error("Company name is required");
  }

  const base = getBase();
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const employer = await findOrCreateEmployer(base, normalizedEmail);

    const companyId = await createOrUpdateCompany({
      base,
      employer,
      name: companyName,
      website,
      description,
    });

    assertRecordId(companyId, "companyId before job update");

    const user = await findUserByEmail(base, normalizedEmail);

    if (user) {
      await base(usersTableName).update(user.id, {
        "Employer Record": [employer.id],
        "Onboarding Complete": true,
      });
    }

    const pendingJobs = await base(jobsTableName)
      .select({
        filterByFormula: `OR(
          LOWER({Submitted Email}) = '${escapeAirtable(normalizedEmail)}',
          LOWER({User}) = '${escapeAirtable(normalizedEmail)}',
          LOWER({Owner}) = '${escapeAirtable(normalizedEmail)}'
        )`,
      })
      .all();

    console.log("ONBOARDING_DEBUG", {
      email: normalizedEmail,
      employerId: employer.id,
      companyId,
      pendingJobsCount: pendingJobs.length,
    });

    const updates = pendingJobs.map((job) => ({
      id: job.id,
      fields: {
        Owner: normalizedEmail,
        User: normalizedEmail,
        Company: companyName,
        "Company Record": [companyId],
        Status: "Aktív",
      } as Airtable.FieldSet,
    }));

    for (let i = 0; i < updates.length; i += 10) {
      await base(jobsTableName).update(updates.slice(i, i + 10));
    }
  } catch (error) {
    console.error("Onboarding error full:", JSON.stringify(error, null, 2));
    throw error;
  }

  redirect("/admin");
}