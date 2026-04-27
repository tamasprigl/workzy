"use server";

import Airtable from "airtable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken } from "@/lib/auth";

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;

const usersTableName = process.env.AIRTABLE_USERS_TABLE_NAME || "Users";
const employersTableName =
  process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";
const companiesTableName =
  process.env.AIRTABLE_COMPANIES_TABLE_NAME || "Companies";
const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";

function getText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function escapeAirtable(value: string): string {
  return value.replace(/'/g, "\\'");
}

function getLinkedIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getBase() {
  if (!airtableToken || !airtableBaseId) {
    throw new Error("Missing Airtable configuration");
  }

  return new Airtable({ apiKey: airtableToken }).base(airtableBaseId);
}

function getSessionData(session: unknown): {
  email: string;
  recordId: string;
} {
  if (!session || typeof session !== "object") {
    return { email: "", recordId: "" };
  }

  const data = session as Record<string, unknown>;

  const rawEmail =
    getText(data.email) ||
    getText(data.username) ||
    getText(data.userEmail);

  const rawRecordId =
    getText(data.id) ||
    getText(data.recordId) ||
    getText(data.employerId) ||
    getText(data.userId) ||
    getText(data.sub);

  return {
    email: rawEmail.includes("@") ? rawEmail.toLowerCase().trim() : "",
    recordId: rawRecordId.startsWith("rec") ? rawRecordId.trim() : "",
  };
}

async function findEmailFromTable(
  base: Airtable.Base,
  tableName: string,
  recordId: string
): Promise<string> {
  try {
    const record = await base(tableName).find(recordId);

    return (
      getText(record.get("Email")) ||
      getText(record.get("E-mail")) ||
      getText(record.get("Email Address")) ||
      getText(record.get("User")) ||
      getText(record.get("Owner"))
    )
      .toLowerCase()
      .trim();
  } catch {
    return "";
  }
}

async function resolveSessionEmail(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return "";

  try {
    const session = await verifyAuthToken(token);
    const sessionData = getSessionData(session);

    if (sessionData.email) {
      return sessionData.email;
    }

    if (!sessionData.recordId) {
      console.log("Invalid onboarding session payload:", session);
      return "";
    }

    const base = getBase();

    const emailFromUsers = await findEmailFromTable(
      base,
      usersTableName,
      sessionData.recordId
    );

    if (emailFromUsers) {
      return emailFromUsers;
    }

    const emailFromEmployers = await findEmailFromTable(
      base,
      employersTableName,
      sessionData.recordId
    );

    return emailFromEmployers;
  } catch (error) {
    console.error("Failed to resolve session email:", error);
    return "";
  }
}

async function resolveSessionEmailWithDevFallback(): Promise<string> {
  const email = await resolveSessionEmail();

  if (email) {
    return email;
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Onboarding email resolve failed. Using dev fallback.");
    return "tamas.prigl@gmail.com";
  }

  return "";
}

async function findOrCreateEmployer(base: Airtable.Base, email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const employers = await base(employersTableName)
    .select({
      maxRecords: 1,
      filterByFormula: `LOWER({Email}) = '${escapeAirtable(normalizedEmail)}'`,
    })
    .firstPage();

  if (employers[0]) {
    return employers[0];
  }

  const created = await base(employersTableName).create([
    {
      fields: {
        Email: normalizedEmail,
      },
    },
  ]);

  return created[0];
}

export async function checkOnboardingStatus() {
  const email = await resolveSessionEmailWithDevFallback();

  if (!email) {
    return { isComplete: false };
  }

  try {
    const base = getBase();
    const employer = await findOrCreateEmployer(base, email);

    const companyIds = getLinkedIds(employer.get("Company"));

    if (companyIds.length === 0) {
      return { isComplete: false };
    }

    const company = await base(companiesTableName).find(companyIds[0]);

    const isProfileComplete =
      company.get("Profile Complete") === true ||
      getText(company.get("Profile Complete")).toLowerCase() === "true";

    return {
      isComplete: isProfileComplete,
    };
  } catch (error) {
    console.error("Failed to check onboarding:", error);
    return { isComplete: false };
  }
}

export async function submitOnboarding(formData: FormData) {
  const email = await resolveSessionEmailWithDevFallback();

  if (!email) {
    throw new Error("Invalid session");
  }

  const name = getText(formData.get("name"));
  const website = getText(formData.get("website"));
  const description = getText(formData.get("description"));

  if (!name) {
    throw new Error("Company name is required");
  }

  const base = getBase();

  try {
    const employer = await findOrCreateEmployer(base, email);
    const existingCompanyIds = getLinkedIds(employer.get("Company"));

    const companyFields: Airtable.FieldSet = {
      Name: name,
      "Profile Complete": true,
    };

    if (website) {
      companyFields.Website = website;
    }

    if (description) {
      companyFields.Description = description;
    }

    let companyId = "";

    if (existingCompanyIds.length > 0) {
      companyId = existingCompanyIds[0];

      await base(companiesTableName).update([
        {
          id: companyId,
          fields: companyFields,
        },
      ]);
    } else {
      const createdCompany = await base(companiesTableName).create([
        {
          fields: companyFields,
        },
      ]);

      companyId = createdCompany[0].id;

      await base(employersTableName).update([
        {
          id: employer.id,
          fields: {
            Company: [companyId],
          },
        },
      ]);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const pendingJobs = await base(jobsTableName)
      .select({
        filterByFormula: `OR(
          LOWER({Submitted Email}) = '${escapeAirtable(normalizedEmail)}',
          LOWER({User}) = '${escapeAirtable(normalizedEmail)}',
          LOWER({Owner}) = '${escapeAirtable(normalizedEmail)}'
        )`,
      })
      .all();

    const updates = pendingJobs.map((job) => ({
      id: job.id,
      fields: {
        Owner: normalizedEmail,
        User: normalizedEmail,
        "Company Record": [companyId],
        Status: "Aktív",
      } as Airtable.FieldSet,
    }));

    for (let i = 0; i < updates.length; i += 10) {
      await base(jobsTableName).update(updates.slice(i, i + 10));
    }
  } catch (error) {
    console.error("Onboarding error full:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(`Failed to save profile: ${String(error)}`);
  }

  redirect("/admin/jobs");
}