import Airtable from "airtable";
import Link from "next/link";
import JobEditorClient from "./JobEditorClient";
import { JobFormData } from "../../../jobs/new/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminJobEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  let record: any = null;
  let fetchError = false;

  try {
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_JOBS_TABLE_NAME;

    if (!token || !baseId || !tableName) {
      throw new Error("Missing Airtable variables.");
    }

    const base = new Airtable({ apiKey: token }).base(baseId);

    const airtableRecord = await base(tableName).find(id);
    
    if (airtableRecord) {
      record = {
        title: airtableRecord.get("Title") || "",
        slug: airtableRecord.get("Slug") || "",
        company: airtableRecord.get("Company") || "",
        location: airtableRecord.get("Location") || "",
        jobType: airtableRecord.get("Type") || "",
        employmentType: airtableRecord.get("Employment Type") || "",
        shift: airtableRecord.get("Schedule") || "",
        salary: airtableRecord.get("Salary") || "",
        shortDescription: airtableRecord.get("Short Description") || "",
        fullDescription: airtableRecord.get("Description") || "",
        requirements: airtableRecord.get("Requirements") || "",
        benefits: airtableRecord.get("Benefits") || "",
        ctaText: airtableRecord.get("CTA Text") || "",
        platform: airtableRecord.get("Campaign Platform") || "facebook",
        campaignLocation: airtableRecord.get("Campaign Target Location") || "",
        objective: airtableRecord.get("Campaign Goal") || "Jelentkezők gyűjtése",
        budget: airtableRecord.get("Campaign Budget Daily") 
          ? String(airtableRecord.get("Campaign Budget Daily")) 
          : "",
        facebookPostText: airtableRecord.get("Facebook Post Text") || "", 
      } as JobFormData;
    }

  } catch (err: any) {
    console.error("❌ Hiba a szerkesztendő állás letöltésekor:", err.message || err);
    fetchError = true;
  }

  if (fetchError || !record) {
    return (
      <>
        <header className="mb-10 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Adatlap szerkesztése</h1>
            <Link href="/admin/jobs" className="text-gray-400 hover:text-white inline-flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Vissza az állásokhoz
            </Link>
        </header>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-4 opacity-80"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <h2 className="text-xl font-semibold text-white mb-2">Hiba a betöltéskor</h2>
          <p className="text-red-400/80 max-w-md mx-auto">A keresett álláskiírás nem található, vagy rendszerhiba lépett fel.</p>
        </div>
      </>
    );
  }

  return <JobEditorClient initialData={record} jobId={id} />;
}
