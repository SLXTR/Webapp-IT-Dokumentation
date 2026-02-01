import { prisma } from "./prisma";
import { getSession } from "./auth";
import { Role } from "./rbac";

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function getUserRole(customerId: string) {
  const session = await requireSession();
  if (session.isSuperAdmin) {
    return "SUPER_ADMIN" as Role;
  }
  const role = await prisma.userCustomerRole.findFirst({
    where: { userId: session.id, customerId }
  });
  if (!role) {
    throw new Error("FORBIDDEN");
  }
  return role.role as Role;
}
