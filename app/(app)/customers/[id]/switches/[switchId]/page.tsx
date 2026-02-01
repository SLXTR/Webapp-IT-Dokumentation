import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SwitchDetailPage({
  params
}: {
  params: { id: string; switchId: string };
}) {
  const switchItem = await prisma.switch.findFirst({
    where: { id: params.switchId, customerId: params.id },
    include: {
      ports: {
        include: {
          portLink: {
            include: { device: true }
          }
        },
        orderBy: { portNumber: "asc" }
      }
    }
  });
  type SwitchWithPorts = NonNullable<typeof switchItem>;
  type SwitchPort = SwitchWithPorts["ports"][number];

  if (!switchItem) {
    return <div className="notion-card p-6">Switch nicht gefunden.</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">{switchItem.name}</h1>
        <p className="text-neutral-500">{switchItem.mgmtIp ?? "Keine Mgmt-IP"}</p>
      </header>
      <div className="notion-card p-6">
        <h2 className="text-lg font-semibold">Port-Grid</h2>
        <div className="grid grid-cols-6 gap-3 mt-4">
          {switchItem.ports.map((port: SwitchPort) => {
            const linkedDevice = port.portLink?.device;
            return (
              <div
                key={port.id}
                className={`rounded-lg border px-2 py-3 text-center text-xs ${
                  linkedDevice ? "bg-black text-white" : "bg-white"
                }`}
              >
                <div className="font-semibold">Port {port.portNumber}</div>
                {linkedDevice ? (
                  <Link
                    className="mt-1 block text-[10px] underline"
                    href={`/customers/${params.id}/devices/${linkedDevice.id}`}
                  >
                    {linkedDevice.name}
                  </Link>
                ) : (
                  <span className="text-[10px] text-neutral-500">Frei</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
