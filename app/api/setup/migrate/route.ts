import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { assertSetupAllowed } from "@/lib/setup-guard";

export async function POST(request: Request) {
  try {
    await assertSetupAllowed();
    const body = await request.json();
    const databaseUrl = body.databaseUrl as string;
    if (!databaseUrl) {
      return NextResponse.json({ ok: false, error: "DATABASE_URL fehlt." }, { status: 400 });
    }

    const env = { ...process.env, DATABASE_URL: databaseUrl };
    execSync("npx prisma migrate deploy", { stdio: "inherit", env });
    execSync("npx prisma generate", { stdio: "inherit", env });
    execSync("npx ts-node --transpile-only prisma/seed.ts", { stdio: "inherit", env });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
