import { NextResponse } from "next/server";
import Airtable from "airtable";
import {
  type ApplicationAnswer,
  safeParseApplicationQuestions,
  validateApplicationAnswers,
} from "@/lib/applicationQuestions";

export const dynamic = "force-dynamic";

const FREE_VISIBLE_LIMIT = 5;

function escapeAirtableValue(value: string) {
  return value.replace(/"/g, '\\"');
}

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("APPLICATION POST BODY:", body);

    const jobId = normalizeString(body.jobId);
    const jobSlug = normalizeString(body.jobSlug);
    const jobTitle = normalizeString(body.jobTitle);
    const fullName = normalizeString(body.fullName || body.name);
    const email = normalizeString(body.email);
    const phone = normalizeString(body.phone);
    const city = normalizeString(body.city);
    const cv = normalizeString(body.cv);
    const message = normalizeString(body.message);

    const answers: ApplicationAnswer[] = Array.isArray(body.answers)
      ? body.answers.map((answer: any) => ({
          questionId: normalizeString(answer.questionId),
          question: normalizeString(answer.question),
          answer: normalizeString(answer.answer),
        }))
      : [];

    const missing: string[] = [];

    if (!jobSlug) missing.push("jobSlug");
    if (!jobTitle) missing.push("jobTitle");
    if (!fullName) missing.push("fullName");
    if (!email) missing.push("email");
    if (!phone) missing.push("phone");
    if (!city) missing.push("city");

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          ok: false,
          error: "Missing required fields",
          missing,
          message: "A kötelező mezők hiányoznak.",
        },
        { status: 400 }
      );
    }

    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const applicationsTableName =
      process.env.AIRTABLE_APPLICATIONS_TABLE_NAME || "Applications";
    const jobsTableName = process.env.AIRTABLE_JOBS_TABLE_NAME || "Jobs";

    if (!token || !baseId || !applicationsTableName) {
      return NextResponse.json(
        {
          success: false,
          ok: false,
          message: "Hiányzó Airtable konfiguráció.",
        },
        { status: 500 }
      );
    }

    const base = new Airtable({ apiKey: token }).base(baseId);
    const safeJobSlug = escapeAirtableValue(jobSlug);

    let finalJobId = jobId;
    let applicationQuestions = [];

    if (!finalJobId) {
      const jobRecords = await base(jobsTableName)
        .select({
          maxRecords: 1,
          filterByFormula: `{Slug} = "${safeJobSlug}"`,
        })
        .firstPage();

      if (jobRecords[0]) {
        finalJobId = jobRecords[0].id;

        applicationQuestions = safeParseApplicationQuestions(
          jobRecords[0].fields["Application Questions"]
        );
      }
    } else {
      try {
        const jobRecord = await base(jobsTableName).find(finalJobId);

        applicationQuestions = safeParseApplicationQuestions(
          jobRecord.fields["Application Questions"]
        );
      } catch {
        applicationQuestions = [];
      }
    }

    const validationError = validateApplicationAnswers(
      applicationQuestions,
      answers
    );

    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          ok: false,
          error: validationError,
          message: validationError,
        },
        { status: 400 }
      );
    }

    const visibleApplications = await base(applicationsTableName)
      .select({
        filterByFormula: `AND({Job Slug} = "${safeJobSlug}", {Access} = "Visible")`,
      })
      .all();

    const visibleCount = visibleApplications.length;
    const access = visibleCount < FREE_VISIBLE_LIMIT ? "Visible" : "Locked";

    const recordFields: any = {
      "Job Slug": jobSlug,
      "Job Title": jobTitle,
      "Full Name": fullName,
      Email: email,
      Phone: phone,
      City: city,
      Message: message,
      CV: cv,
      Status: "Új",
      Access: access,
      Answers: JSON.stringify(answers),
    };

    if (finalJobId) {
      recordFields["Job"] = [finalJobId];
    }

    const records = await base(applicationsTableName).create([
      {
        fields: recordFields,
      },
    ]);

    return NextResponse.json({
      success: true,
      ok: true,
      recordId: records[0].id,
      applicationId: records[0].id,
      access,
      visibleCountAfterCreate:
        access === "Visible" ? visibleCount + 1 : visibleCount,
      limit: FREE_VISIBLE_LIMIT,
      message:
        access === "Locked"
          ? "A jelentkezés sikeresen beérkezett, de ez a jelentkező már a fizetős csomaghoz tartozó zárolt jelentkezések közé került."
          : "A jelentkezés sikeresen beérkezett.",
    });
  } catch (error) {
    console.error("Hiba jelentkezés leadásakor:", error);

    return NextResponse.json(
      {
        success: false,
        ok: false,
        message: "Hiba történt a jelentkezés elküldése során.",
      },
      { status: 500 }
    );
  }
}