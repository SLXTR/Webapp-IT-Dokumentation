import { NextResponse } from "next/server";
import { isInitialized, getSetupToken } from "../../../../lib/setup";
import { execSync } from "child_process";
import fs from "fs";

export async function GET() {
  const initialized = await isInitialized();
  const setupToken = await getSetupToken();
  let dockerAvailable = false;

  try {
    execSync("docker --version", { stdio: "ignore" });
    dockerAvailable = true;
  } catch {
    dockerAvailable = false;
  }

  const canWriteEnv = (() => {
    try {
      fs.accessSync(process.cwd(), fs.constants.W_OK);
      return true;
    } catch {
      return false;
    }
  })();

  return NextResponse.json({ initialized, dockerAvailable, canWriteEnv, setupToken });
}
