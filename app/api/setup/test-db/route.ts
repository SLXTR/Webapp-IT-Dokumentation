import { NextResponse } from "next/server";
import { Client } from "pg";
import { assertSetupAllowed } from "../../../../lib/setup-guard";

export async function POST(request: Request) {
  try {
    await assertSetupAllowed();
    const body = await request.json();
    const databaseUrl = body.databaseUrl as string;
    if (!databaseUrl) {
      return NextResponse.json({ ok: false, error: "DATABASE_URL fehlt." }, { status: 400 });
    }
    const client = new Client({ connectionString: databaseUrl, statement_timeout: 5000 });
    await client.connect();
    const result = await client.query("SELECT 1 as ok");
    await client.end();
    return NextResponse.json({ ok: true, result: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
