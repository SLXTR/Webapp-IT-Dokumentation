import { redirect } from "next/navigation";
import { isInitialized } from "@/lib/setup";

export default async function IndexPage() {
  const initialized = await isInitialized();
  redirect(initialized ? "/dashboard" : "/setup");
}
