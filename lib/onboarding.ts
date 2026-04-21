"use server";

import Airtable from "airtable";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";

const airtableToken = process.env.AIRTABLE_TOKEN;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const employersTableName = process.env.AIRTABLE_EMPLOYERS_TABLE_NAME || "Employers";
const companiesTableName = process.env.AIRTABLE_COMPANIES_TABLE_NAME || "Companies";
const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";

export async function checkOnboardingStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return { isComplete: false };

  const session = await verifyAuthToken(token);
  if (!session || !session.username) return { isComplete: false };

  if (!airtableToken || !airtableBaseId) return { isComplete: false };

  const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

  try {
    const employers = await base(employersTableName)
      .select({ filterByFormula: `{Email} = '${session.username}'`, maxRecords: 1 })
      .firstPage();

    if (employers.length === 0) return { isComplete: false };
    
    const employer = employers[0];
    const companyIds = employer.fields["Company"] as string[] | undefined;

    if (!companyIds || companyIds.length === 0) return { isComplete: false };

    const company = await base(companiesTableName).find(companyIds[0]);
    if (!company || !company.fields["Profile Complete"]) {
      return { isComplete: false };
    }

    return { isComplete: true };
  } catch (err) {
    console.error("Failed to check onboarding:", err);
    return { isComplete: false }; // Fail closed
  }
}

export async function submitOnboarding(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) throw new Error("Not logged in");

  const session = await verifyAuthToken(token);
  if (!session || !session.username) throw new Error("Invalid session");

  const email = session.username;
  const name = formData.get("name") as string;
  const website = formData.get("website") as string;
  const description = formData.get("description") as string;

  if (!name || !name.trim()) throw new Error("Company name is required");

  if (!airtableToken || !airtableBaseId) throw new Error("Configuration error");
  const base = new Airtable({ apiKey: airtableToken }).base(airtableBaseId);

  try {
    // 1. Find Employer by Email
    const employers = await base(employersTableName)
      .select({ filterByFormula: `{Email} = '${email}'`, maxRecords: 1 })
      .firstPage();

    if (employers.length === 0) {
      throw new Error("Employer not found");
    }

    const employer = employers[0];
    const companyIds = employer.fields["Company"] as string[] | undefined;
    
    let companyId: string;

    // 2. Create or Update Company
    const companyFields: Record<string, unknown> = {
      Name: name.trim(),
      "Profile Complete": true,
    };

    if (website && website.trim()) companyFields["Website"] = website.trim();
    if (description && description.trim()) companyFields["Description"] = description.trim();

    if (companyIds && companyIds.length > 0) {
      companyId = companyIds[0];
      await base(companiesTableName).update([
        { id: companyId, fields: companyFields as Airtable.FieldSet }
      ]);
    } else {
      const newCompany = await base(companiesTableName).create([
        { fields: companyFields as Airtable.FieldSet }
      ]);
      companyId = newCompany[0].id;

      // Link Employer to new Company without overwriting email
      await base(employersTableName).update([
        { id: employer.id, fields: { Company: [companyId] } }
      ]);
    }

    // 3. Update pending jobs safely
    const pendingJobs = await base(jobsTableName)
      .select({
        filterByFormula: `AND({Submitted Email} = '${email}', {Status} = 'Awaiting Profile')`
      })
      .all();

    if (pendingJobs.length > 0) {
      const updates = pendingJobs.map(job => ({
        id: job.id,
        fields: { Status: "Ready" }
      }));
      
      // Update in batches of up to 10 records as per Airtable SDK limits
      for (let i = 0; i < updates.length; i += 10) {
        await base(jobsTableName).update(updates.slice(i, i + 10));
      }
    }
  } catch (error) {
    console.error("Onboarding error:", error);
    throw new Error("Failed to save profile");
  }

  // Redirect on success
  redirect("/admin");
}
