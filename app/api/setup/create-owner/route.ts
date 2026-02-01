import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { assertSetupAllowed } from "@/lib/setup-guard";
import { hashPassword } from "@/lib/auth";
import { markInitialized } from "@/lib/setup";
import { writeAuditLog } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    await assertSetupAllowed();
    const body = await request.json();
    const { name, email, password } = body as {
      name: string;
      email: string;
      password: string;
    };

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "E-Mail und Passwort erforderlich." }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        isActive: true,
        isSuperAdmin: true
      }
    });

    await prisma.userCustomerRole.create({
      data: {
        userId: user.id,
        customerId: (await prisma.customer.create({ data: { name: "Owner Workspace" } })).id,
        role: Role.CUSTOMER_ADMIN
      }
    });

    await markInitialized();
    await writeAuditLog({
      userId: user.id,
      action: "setup_completed",
      entityType: "system",
      entityId: null,
      meta: { ownerEmail: email }
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
