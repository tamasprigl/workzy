import { checkOnboardingStatus } from "@/lib/onboarding";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const status = await checkOnboardingStatus();
  
  if (!status.isComplete) {
    redirect("/admin/onboarding");
  }

  return <>{children}</>;
}
