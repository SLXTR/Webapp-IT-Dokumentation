import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireSession } from "../../../lib/guards";

export async function GET() {
  const session = await requireSession();
  const customers = session.isSuperAdmin
    ? await prisma.customer.findMany()
    : await prisma.customer.findMany({
        where: { roles: { some: { userId: session.id } } }
      });
  return NextResponse.json({ ok: true, customers });
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.isSuperAdmin) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await request.json();
  const customer = await prisma.customer.create({
    data: {
      name: body.name,
      notes: body.notes ?? null
    }
  });
  return NextResponse.json({ ok: true, customer });
}
