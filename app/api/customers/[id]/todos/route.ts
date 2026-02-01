import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getUserRole } from "../../../../../lib/guards";
import { canRead, canWrite } from "../../../../../lib/rbac";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const role = await getUserRole(params.id);
  if (!canRead(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const todos = await prisma.todo.findMany({
    where: { customerId: params.id },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ ok: true, todos });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const role = await getUserRole(params.id);
  if (!canWrite(role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await request.json();
  const todo = await prisma.todo.create({
    data: {
      customerId: params.id,
      title: body.title,
      done: body.done ?? false
    }
  });
  return NextResponse.json({ ok: true, todo });
}
