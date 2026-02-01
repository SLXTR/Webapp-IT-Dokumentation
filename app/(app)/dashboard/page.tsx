import { prisma } from "../../../lib/prisma";

export default async function DashboardPage() {
  const [deviceCount, switchCount, portCount, customerCount] = await Promise.all([
    prisma.device.count(),
    prisma.switch.count(),
    prisma.switchPort.count(),
    prisma.customer.count()
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-neutral-500">Überblick über alle Workspaces.</p>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Kunden", value: customerCount },
          { label: "Geräte", value: deviceCount },
          { label: "Switches", value: switchCount },
          { label: "Ports", value: portCount }
        ].map((item) => (
          <div key={item.label} className="notion-card p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">{item.label}</p>
            <p className="text-2xl font-semibold mt-2">{item.value}</p>
          </div>
        ))}
      </section>
      <section className="notion-card p-6">
        <h2 className="text-lg font-semibold">Schnellaktionen</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          <button className="rounded-lg bg-black text-white px-4 py-2 text-sm">Gerät anlegen</button>
          <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm">Switch anlegen</button>
          <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm">Dokumentation hinzufügen</button>
        </div>
      </section>
    </div>
  );
}
