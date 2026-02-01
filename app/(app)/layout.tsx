import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { isInitialized } from "../../lib/setup";
import Sidebar from "../../components/sidebar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const initialized = await isInitialized();
  if (!initialized) {
    redirect("/setup");
  }
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar user={session} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
