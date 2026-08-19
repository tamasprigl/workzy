import { NextResponse } from "next/server";
import {
  isV1ReadOnly,
  readOnlyPayload,
  READ_ONLY_HTTP_STATUS,
} from "@/lib/read-only";

/**
 * Legacy stub endpoint.
 *
 * ## Read this before assuming it is harmless
 *
 * This handler never wrote to Airtable — it logs the body and returns
 * `{ success: true, message: "Jelentkezés sikeresen fogadva." }`. So it does not
 * create a split-brain record.
 *
 * It does something arguably worse: it **tells the caller their application was
 * received** when nothing was stored anywhere, in either system. The C9 brief
 * is explicit that v1 must not "silently accept and discard submissions", and
 * this endpoint has been doing exactly that for as long as it has existed.
 *
 * In read-only mode it now refuses honestly, like every other write path. The
 * original behaviour is left untouched below so that nothing about non
 * read-only environments changes with this wave.
 */
export async function POST(request: Request) {
  if (isV1ReadOnly()) {
    return NextResponse.json(readOnlyPayload(), {
      status: READ_ONLY_HTTP_STATUS,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  try {
    const body = await request.json();

    console.log("Új jelentkezés érkezett:", body);

    return NextResponse.json({
      success: true,
      message: "Jelentkezés sikeresen fogadva.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Hiba történt.",
      },
      { status: 500 }
    );
  }
}
