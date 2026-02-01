import { describe, expect, it } from "vitest";
import { PrismaClient, DeviceType, SwitchPortStatus } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;
const prisma = databaseUrl ? new PrismaClient() : null;

describe("port-link integration", () => {
  it.skipIf(!databaseUrl)("links and unlinks a device to a port", async () => {
    if (!prisma) return;
    const customer = await prisma.customer.create({ data: { name: "Test Customer" } });
    const switchItem = await prisma.switch.create({
      data: { customerId: customer.id, name: "Test Switch" }
    });
    const port = await prisma.switchPort.create({
      data: { switchId: switchItem.id, portNumber: "1", status: SwitchPortStatus.FREE }
    });
    const device = await prisma.device.create({
      data: { customerId: customer.id, name: "Test Device", type: DeviceType.SERVER }
    });

    const link = await prisma.portLink.create({
      data: { customerId: customer.id, switchPortId: port.id, deviceId: device.id }
    });
    expect(link.deviceId).toBe(device.id);

    await prisma.switchPort.update({
      where: { id: port.id },
      data: { status: SwitchPortStatus.OCCUPIED }
    });

    const linked = await prisma.portLink.findUnique({ where: { switchPortId: port.id } });
    expect(linked?.deviceId).toBe(device.id);

    await prisma.portLink.delete({ where: { id: link.id } });
    await prisma.switchPort.update({
      where: { id: port.id },
      data: { status: SwitchPortStatus.FREE }
    });

    const removed = await prisma.portLink.findUnique({ where: { switchPortId: port.id } });
    expect(removed).toBeNull();

    await prisma.device.delete({ where: { id: device.id } });
    await prisma.switchPort.delete({ where: { id: port.id } });
    await prisma.switch.delete({ where: { id: switchItem.id } });
    await prisma.customer.delete({ where: { id: customer.id } });
  });
});
