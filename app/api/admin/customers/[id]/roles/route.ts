import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRole, requireSession } from "@/lib/guards";
import { canAdmin } from "@/lib/rbac";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session.isSuperAdmin) {
    const role = await getUserRole(params.id);
    if (!canAdmin(role)) {
      return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
    }
  }

  const roles = await prisma.userCustomerRole.findMany({
    where: { customerId: params.id },
    include: { user: true }
  });
  return NextResponse.json({ ok: true, roles });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session.isSuperAdmin) {
    const role = await getUserRole(params.id);
    if (!canAdmin(role)) {
      return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
    }
  }

  const body = await request.json();
  const assigned = await prisma.userCustomerRole.upsert({
    where: { userId_customerId: { userId: body.userId, customerId: params.id } },
    update: { role: body.role },
    create: {
      userId: body.userId,
      customerId: params.id,
      role: body.role
    }
  });

  return NextResponse.json({ ok: true, role: assigned });
}
