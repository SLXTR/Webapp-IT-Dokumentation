import { headers } from "next/headers";
import { isInitialized, getSetupToken } from "./setup";

export async function assertSetupAllowed() {
  const initialized = await isInitialized();
  if (initialized) {
    throw new Error("SETUP_BLOCKED");
  }
  const token = headers().get("x-setup-token");
  const expected = await getSetupToken();
  if (!token || token !== expected) {
    throw new Error("SETUP_TOKEN_INVALID");
  }
}
