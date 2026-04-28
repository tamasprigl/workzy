import { NextResponse } from "next/server";
import Airtable from "airtable";
import {
  type ApplicationAnswer,
  safeParseApplicationQuestions,
  validateApplicationAnswers,
} from "@/lib/applicationQuestions";
import { put } from "@vercel/blob";

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
    const formData = await request.formData();
    console.log("APPLICATION POST FORMDATA keys:", Array.from(formData.keys()));

    const jobId = normalizeString(formData.get("jobId"));
    const jobSlug = normalizeString(formData.get("jobSlug"));
    const jobTitle = normalizeString(formData.get("jobTitle"));
    const fullName = normalizeString(formData.get("fullName") || formData.get("name"));
    const email = normalizeString(formData.get("email"));
    const phone = normalizeString(formData.get("phone"));
    const city = normalizeString(formData.get("city"));
    const message = normalizeString(formData.get("message"));

    const cvFile = formData.get("cv") as File | null;

    let parsedAnswers: any = [];
    try {
      const answersStr = formData.get("answers");
      if (answersStr && typeof answersStr === "string") {
        parsedAnswers = JSON.parse(answersStr);
      }
    } catch (e) {
      console.warn("Failed to parse answers JSON");
    }

    const answers: ApplicationAnswer[] = Array.isArray(parsedAnswers)
      ? parsedAnswers.map((answer: any) => ({
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

    if (!cvFile || cvFile.size === 0) {
      return NextResponse.json(
        {
          success: false,
          ok: false,
          error: "Missing CV file",
          missing: ["cv"],
          message: "Az önéletrajz feltöltése kötelező.",
        },
        { status: 400 }
      );
    }

    if (cvFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          ok: false,
          error: "File too large",
          message: "Az önéletrajz mérete nem haladhatja meg az 5MB-ot.",
        },
        { status: 400 }
      );
    }

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(cvFile.type) && !cvFile.name.match(/\.(pdf|doc|docx)$/i)) {
      return NextResponse.json(
        {
          success: false,
          ok: false,
          error: "Invalid file type",
          message: "Kérlek PDF vagy Word formátumban töltsd fel az önéletrajzod.",
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
    let applicationQuestions: any[] = [];

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

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (!blobToken) {
      console.error("Vercel Blob token is missing");
      return NextResponse.json(
        {
          success: false,
          ok: false,
          error: "Vercel Blob token is missing",
          message: "Rendszerhiba: hiányzó feltöltési konfiguráció.",
        },
        { status: 500 }
      );
    }

    let cvUrl = "";
    try {
      const safeFilename = cvFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const blob = await put(`cvs/${Date.now()}-${safeFilename}`, cvFile, {
        access: "public",
      });
      cvUrl = blob.url;
    } catch (error) {
      console.error("Vercel Blob upload error:", error);
      return NextResponse.json(
        {
          success: false,
          ok: false,
          error: error instanceof Error ? error.message : "Unknown upload error",
          message: "Hiba történt az önéletrajz feltöltése során.",
        },
        { status: 500 }
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
      CV: cvUrl
        ? [
            {
              url: cvUrl,
              filename: cvFile.name,
            },
          ]
        : [],
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
      cvUrl,
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