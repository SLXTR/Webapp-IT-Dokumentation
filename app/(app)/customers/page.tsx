import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" }
  });
  type CustomerListItem = Awaited<typeof customers>[number];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Kunden</h1>
          <p className="text-neutral-500">Ihre Workspaces und Mandanten.</p>
        </div>
        <button className="rounded-lg bg-black text-white px-4 py-2 text-sm">Kunde anlegen</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customers.map((customer: CustomerListItem) => (
          <Link
            key={customer.id}
            href={`/customers/${customer.id}`}
            className="notion-card p-5 hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{customer.name}</h2>
            <p className="text-sm text-neutral-500">{customer.notes ?? "Keine Notizen"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
