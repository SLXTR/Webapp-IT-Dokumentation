import Link from "next/link";
import { prisma } from "../../../../../../lib/prisma";

export default async function DeviceDetailPage({
  params
}: {
  params: { id: string; deviceId: string };
}) {
  const device = await prisma.device.findFirst({
    where: { id: params.deviceId, customerId: params.id },
    include: {
      portLinks: {
        include: {
          switchPort: { include: { switch: true } }
        }
      }
    }
  });

  if (!device) {
    return <div className="notion-card p-6">Gerät nicht gefunden.</div>;
  }

  const portLink = device.portLinks[0];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">{device.name}</h1>
        <p className="text-neutral-500">{device.hostname ?? "Kein Hostname"}</p>
      </header>
      <section className="notion-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase text-neutral-500">Typ</p>
            <p>{device.type}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-neutral-500">IP</p>
            <p>{device.ip ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-neutral-500">Vendor</p>
            <p>{device.vendor ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-neutral-500">Modell</p>
            <p>{device.model ?? "-"}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase text-neutral-500">Switchport-Verknüpfung</p>
          {portLink ? (
            <Link
              href={`/customers/${params.id}/switches/${portLink.switchPort.switchId}`}
              className="text-sm underline"
            >
              {portLink.switchPort.switch.name} / Port {portLink.switchPort.portNumber}
            </Link>
          ) : (
            <p className="text-sm text-neutral-500">Kein Port verknüpft.</p>
          )}
        </div>
      </section>
    </div>
  );
}
