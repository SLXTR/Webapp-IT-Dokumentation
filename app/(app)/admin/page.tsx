import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const users: Prisma.UserGetPayload<{
    include: { roles: { include: { customer: true } } };
  }>[] = await prisma.user.findMany({
    include: { roles: { include: { customer: true } } }
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Admin</h1>
        <p className="text-neutral-500">User- und Rollenverwaltung.</p>
      </header>
      <div className="notion-card p-6">
        <h2 className="text-lg font-semibold mb-4">Benutzer</h2>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="rounded-lg border border-neutral-200 p-4">
              <p className="font-medium">{user.name ?? "Ohne Namen"}</p>
              <p className="text-sm text-neutral-500">{user.email}</p>
              <div className="mt-2 text-xs text-neutral-500">
                {user.roles.map((role) => (
                  <div key={role.id}>
                    {role.customer.name}: {role.role}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
