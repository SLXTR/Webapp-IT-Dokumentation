import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { assertSetupAllowed } from "@/lib/setup-guard";

export async function POST(request: Request) {
  try {
    await assertSetupAllowed();
    if (process.env.ENABLE_DOCKER_SETUP !== "true") {
      return NextResponse.json(
        { ok: false, error: "Docker-Setup ist deaktiviert." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { dbName, dbUser, dbPassword, dbPort } = body as {
      dbName: string;
      dbUser: string;
      dbPassword: string;
      dbPort: number;
    };

    const containerName = `itdocs-postgres-${Date.now()}`;
    execSync(
      `docker run -d --name ${containerName} -e POSTGRES_DB=${dbName} -e POSTGRES_USER=${dbUser} -e POSTGRES_PASSWORD=${dbPassword} -p ${dbPort}:5432 postgres:16-alpine`,
      { stdio: "inherit" }
    );

    const databaseUrl = `postgresql://${dbUser}:${dbPassword}@localhost:${dbPort}/${dbName}?schema=public`;
    return NextResponse.json({ ok: true, databaseUrl, containerName });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
