import { createAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const formData = await request.formData();

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    throw new Error("Missing ADMIN credentials in env");
  }

  if (username !== adminUsername || password !== adminPassword) {
    redirect("/admin/login?error=invalid_credentials");
  }

  const token = await createAuthToken({
    username,
    role: "admin",
  });

  const cookieStore = await cookies();

  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}
