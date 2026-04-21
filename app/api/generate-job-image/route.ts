import { NextRequest, NextResponse } from "next/server";

type PlanType = "free" | "pro";
type AspectType = "square" | "portrait";

function normalizePlan(value: unknown): PlanType {
  return value === "pro" ? "pro" : "free";
}

function normalizeAspect(value: unknown): AspectType {
  return value === "portrait" ? "portrait" : "square";
}

function getSizeFromAspect(aspect: AspectType) {
  return aspect === "portrait" ? "1024x1536" : "1024x1024";
}

function getQualityFromPlan(plan: PlanType) {
  return plan === "pro" ? "high" : "low";
}

function getModelFromPlan(_: PlanType) {
  return "gpt-image-1";
}

function cleanText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

function buildPrompt({
  title,
  location,
  salary,
  aspect,
  plan,
}: {
  title: string;
  location: string;
  salary: string;
  aspect: AspectType;
  plan: PlanType;
}) {
  return `
You are the world's best marketing expert and creative advertising designer.

Create a HIGH-CONVERTING job advertisement image for Facebook campaigns.

GOAL:
The image must be eye-catching, creative, modern, and designed to drive job applications.
It should instantly grab attention while scrolling and make people want to click and apply.

MAIN JOB INFORMATION TO USE IN THE CREATIVE:
- Job title: ${title}
- Location: ${location}
- Salary: ${salary}

IMPORTANT VISUAL PRIORITIES:
- The JOB TITLE must be very visible
- The SALARY must be the MOST highlighted and most dominant element
- The overall design must feel like a strong Facebook recruitment campaign creative
- The image must feel premium, modern, and attention-grabbing
- The design should encourage application / conversion

STYLE:
- modern recruitment marketing creative
- scroll-stopping
- bold composition
- high contrast
- professional advertising quality
- visually strong
- creative but clear
- suitable for paid Facebook / Instagram campaigns
- not boring
- not generic
- not stock photo style

SCENE:
- realistic worker related to the job role
- workplace environment that matches the position
- strong composition
- clean but visually impactful advertising look

TEXT ON IMAGE:
The creative should include these main elements:
- ${title}
- Location: ${location}
- Salary: ${salary}

VERY IMPORTANT:
- salary should be strongly highlighted
- the image should feel conversion-focused
- the design should look like a recruitment ad made by a top marketer
- no logos
- no watermark
- no brand names

FORMAT:
${
  aspect === "portrait"
    ? "Create it in a vertical, mobile-first 9:16 style layout."
    : "Create it in a square 1:1 layout."
}

QUALITY TARGET:
${
  plan === "pro"
    ? "Premium quality, stronger detail, more polished advertising creative."
    : "Simple but still attractive and effective advertising creative."
}
`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const title = cleanText(body.title);
    const location = cleanText(body.location);
    const salary = cleanText(body.salary);

    const plan = normalizePlan(body.plan);
    const aspect = normalizeAspect(body.aspect);

    if (!title || !location || !salary) {
      return NextResponse.json(
        {
          error: "A pozíció, helyszín és bér megadása kötelező.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Hiányzik az OPENAI_API_KEY a .env.local fájlból.",
        },
        { status: 500 }
      );
    }

    const model = getModelFromPlan(plan);
    const quality = getQualityFromPlan(plan);
    const size = getSizeFromAspect(aspect);

    const prompt = buildPrompt({
      title,
      location,
      salary,
      aspect,
      plan,
    });

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt,
        size,
        quality,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("OPENAI IMAGE ERROR:", result);

      return NextResponse.json(
        {
          error: result?.error?.message || "A képgenerálás nem sikerült.",
        },
        { status: response.status }
      );
    }

    const base64 = result?.data?.[0]?.b64_json;

    if (!base64) {
      return NextResponse.json(
        {
          error: "Nem érkezett vissza kép.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${base64}`,
      meta: {
        plan,
        aspect,
        model,
        quality,
        size,
      },
    });
  } catch (error) {
    console.error("IMAGE ROUTE ERROR:", error);

    return NextResponse.json(
      {
        error: "Szerverhiba történt a képgenerálás során.",
      },
      { status: 500 }
    );
  }
}