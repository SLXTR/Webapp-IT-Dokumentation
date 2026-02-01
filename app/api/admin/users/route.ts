import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/guards";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  const session = await requireSession();
  if (!session.isSuperAdmin) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const users = await prisma.user.findMany({ include: { roles: true } });
  return NextResponse.json({ ok: true, users });
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.isSuperAdmin) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await request.json();
  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      passwordHash: await hashPassword(body.password),
      isActive: true
    }
  });
  return NextResponse.json({ ok: true, user });
}
