'use server';

import Airtable from "airtable";

export async function submitApplicationAction(prevState: any, formData: FormData) {
  try {
    const airtableToken = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const appsTable = process.env.AIRTABLE_APPLICATIONS_TABLE_NAME || "Applications";
    const jobsTable = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";

    if (!airtableToken || !baseId) {
      return { success: false, error: "Rendszerhiba: hiányzó adatbázis konfiguráció." };
    }

    const base = new Airtable({ apiKey: airtableToken }).base(baseId);

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;
    const jobId = formData.get("jobId") as string;

    if (!fullName || !email || !phone || !jobId) {
      return { success: false, error: "Kérjük, töltse ki az összes kötelező mezőt!" };
    }

    let jobRecord: any = null;
    try {
      jobRecord = await base(jobsTable).find(jobId);
    } catch (err) {
      console.error("Hiba az állás ellenőrzésekor:", err);
    }

    if (!jobRecord) {
      return { success: false, error: "Hiba: A jelentkezéshez tartozó állás nem található." };
    }

    const jobSlug = (jobRecord.get("Slug") as string) || "";
    const jobTitle = (jobRecord.get("Title") as string) || "";

    const newApp = await base(appsTable).create([
      {
        fields: {
          "Job Slug": jobSlug,
          "Job Title": jobTitle,
          "Full Name": fullName,
          "Email": email,
          "Phone": phone,
          "Message": message || "",
          "Status": "Új",
          "Job": [jobId],
        },
      },
    ]);

    try {
      // 1. Count how many applications belong to the same Job
      const allApps = await base(appsTable).select({ fields: ["Job"] }).all();
      const count = allApps.filter(app => {
        const linkedJobs = app.get("Job");
        const jobLinks = Array.isArray(linkedJobs) ? linkedJobs.map(String) : [];
        return jobLinks.includes(jobId);
      }).length;

      // 2. and 3. Set Access based on count and applicants_unlocked
      const isUnlocked = jobRecord.get("applicants_unlocked") === true;
      const accessValue = (isUnlocked || count <= 5) ? "Visible" : "Locked";

      await base(appsTable).update(newApp[0].id, {
        "Access": accessValue
      });
    } catch (accessErr) {
      console.error("Hiba az Access mező frissítésekor:", accessErr);
    }

    return { success: true, error: "" };
  } catch (error: any) {
    console.error("Hiba a jelentkezés beküldésekor:", error);
    return { success: false, error: "Hiba történt a beküldés során. Kérjük, próbálja újra." };
  }
}
