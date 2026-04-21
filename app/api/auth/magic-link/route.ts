import { NextResponse } from "next/server";
import crypto from "crypto";
import { createMagicLink, ensureEmployer } from "@/lib/magic-links";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, jobId } = body;

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Ensure employer exists
    await ensureEmployer(normalizedEmail);

    // Generate a secure 64-character hex token using crypto
    const token = crypto.randomBytes(32).toString("hex");

    // Set expiration to 15 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Save token securely in Airtable MagicLinks table
    await createMagicLink({
      token,
      email: normalizedEmail,
      jobId, // May be undefined if just a standard login request
      purpose: jobId ? "job_activation" : "login",
      expiresAt: expiresAt.toISOString(),
    });

    // Generate login URL containing ONLY the token natively
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const loginUrl = `${baseUrl}/api/auth/verify?token=${token}`;

    // IMPORTANT: Logging for development placeholder. 
    // In production, insert active email service integration here (Resend, SendGrid, etc).
    console.log("\n==============================================");
    console.log(`📧 MAGIC LINK GENERATED`);
    console.log(`To: ${email}`);
    console.log(`Purpose: ${jobId ? "job_activation" : "login"}`);
    console.log(`Link: ${loginUrl}`);
    console.log("==============================================\n");

    return NextResponse.json({ 
      success: true, 
      message: "If the email is valid, a login link will be sent." 
    }, { status: 200 });

  } catch (error) {
    console.error("Magic Link generation error:", error);
    // Generic error message for security, keeping specifics in server logs
    return NextResponse.json(
      { error: "Failed to process magic link request" },
      { status: 500 }
    );
  }
}
