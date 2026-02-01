import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isInitialized } from "../../lib/setup";

export default async function SetupLayout({ children }: { children: ReactNode }) {
  const initialized = await isInitialized();
  if (initialized) {
    redirect("/login");
  }
  return <div className="min-h-screen bg-surface">{children}</div>;
}
