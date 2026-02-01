import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/guards";
import { canRead } from "@/lib/rbac";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const role = await getUserRole(params.id);
  if (!canRead(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const customer = await prisma.customer.findUnique({
    where: { id: params.id }
  });
  return NextResponse.json({ ok: true, customer });
}
