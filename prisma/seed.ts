import { PrismaClient, Role, DeviceType, SwitchPortStatus } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) return;

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash: await hashPassword("ChangeMe123!"),
      name: "System Admin",
      isActive: true,
      isSuperAdmin: true
    }
  });

  const customer = await prisma.customer.create({
    data: {
      name: "Demo GmbH",
      notes: "Seed-Daten für das MVP."
    }
  });

  await prisma.userCustomerRole.create({
    data: {
      userId: admin.id,
      customerId: customer.id,
      role: Role.CUSTOMER_ADMIN
    }
  });

  const switchEntity = await prisma.switch.create({
    data: {
      customerId: customer.id,
      name: "Core-Switch-01",
      vendor: "Netgear",
      model: "GS724",
      mgmtIp: "10.0.0.2"
    }
  });

  const ports = Array.from({ length: 24 }).map((_, index) => ({
    switchId: switchEntity.id,
    portNumber: String(index + 1),
    poeCapable: index < 12,
    status: SwitchPortStatus.FREE
  }));

  await prisma.switchPort.createMany({ data: ports });

  const devices = await prisma.device.createMany({
    data: [
      {
        customerId: customer.id,
        name: "Firewall-01",
        type: DeviceType.FIREWALL,
        vendor: "Fortinet",
        model: "FG-60F",
        hostname: "fw-01",
        ip: "10.0.0.1"
      },
      {
        customerId: customer.id,
        name: "AP-Office-1",
        type: DeviceType.AP,
        vendor: "Ubiquiti",
        model: "U6-LR",
        hostname: "ap-office-1",
        ip: "10.0.10.10"
      },
      {
        customerId: customer.id,
        name: "NAS-01",
        type: DeviceType.NAS,
        vendor: "Synology",
        model: "DS920+",
        hostname: "nas-01",
        ip: "10.0.20.10"
      }
    ]
  });

  const port12 = await prisma.switchPort.findFirst({
    where: { switchId: switchEntity.id, portNumber: "12" }
  });

  const apDevice = await prisma.device.findFirst({
    where: { customerId: customer.id, name: "AP-Office-1" }
  });

  if (port12 && apDevice) {
    await prisma.portLink.create({
      data: {
        customerId: customer.id,
        switchPortId: port12.id,
        deviceId: apDevice.id
      }
    });

    await prisma.switchPort.update({
      where: { id: port12.id },
      data: { status: SwitchPortStatus.OCCUPIED }
    });
  }

  await prisma.systemSetting.upsert({
    where: { key: "initialized" },
    update: { value: "false" },
    create: { key: "initialized", value: "false" }
  });

  console.log("Seed abgeschlossen:", { adminEmail, devices, customerId: customer.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
