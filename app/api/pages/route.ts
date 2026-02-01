import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/guards";

export async function GET() {
  await requireSession();
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ ok: true, pages });
}

export async function POST(request: Request) {
  await requireSession();
  const body = await request.json();
  const page = await prisma.page.create({
    data: {
      customerId: body.customerId,
      title: body.title,
      content: body.content ?? {}
    }
  });
  return NextResponse.json({ ok: true, page });
}
