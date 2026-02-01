import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireSession } from "../../../lib/guards";

export async function GET() {
  await requireSession();
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, todos });
}

export async function POST(request: Request) {
  await requireSession();
  const body = await request.json();
  const todo = await prisma.todo.create({
    data: {
      customerId: body.customerId,
      title: body.title,
      done: body.done ?? false
    }
  });
  return NextResponse.json({ ok: true, todo });
}
