import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CustomerDetailPage({
  params
}: {
  params: { id: string };
}) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      switches: true,
      devices: true
    }
  });

  if (!customer) {
    return <div className="notion-card p-6">Kunde nicht gefunden.</div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{customer.name}</h1>
          <p className="text-neutral-500">{customer.notes ?? "Keine Notizen"}</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg bg-black text-white px-4 py-2 text-sm">Gerät anlegen</button>
          <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm">Switch anlegen</button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="notion-card p-5">
          <h2 className="text-lg font-semibold">Switches</h2>
          <div className="mt-3 space-y-2">
            {customer.switches.map((switchItem) => (
              <Link
                key={switchItem.id}
                href={`/customers/${customer.id}/switches/${switchItem.id}`}
                className="block rounded-lg border border-neutral-200 px-3 py-2 hover:bg-surface"
              >
                <div className="text-sm font-medium">{switchItem.name}</div>
                <div className="text-xs text-neutral-500">{switchItem.mgmtIp ?? "Keine Mgmt-IP"}</div>
              </Link>
            ))}
            {customer.switches.length === 0 && (
              <p className="text-sm text-neutral-500">Noch keine Switches.</p>
            )}
          </div>
        </div>
        <div className="notion-card p-5">
          <h2 className="text-lg font-semibold">Geräte</h2>
          <div className="mt-3 space-y-2">
            {customer.devices.map((device) => (
              <Link
                key={device.id}
                href={`/customers/${customer.id}/devices/${device.id}`}
                className="block rounded-lg border border-neutral-200 px-3 py-2 hover:bg-surface"
              >
                <div className="text-sm font-medium">{device.name}</div>
                <div className="text-xs text-neutral-500">{device.ip ?? "Keine IP"}</div>
              </Link>
            ))}
            {customer.devices.length === 0 && (
              <p className="text-sm text-neutral-500">Noch keine Geräte.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
