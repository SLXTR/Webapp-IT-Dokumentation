import crypto from "crypto";
import { prisma } from "./prisma";

let cachedToken: string | null = null;

export async function getSetupToken() {
  if (cachedToken) return cachedToken;
  try {
    const existing = await prisma.systemSetting.findUnique({
      where: { key: "setup_token" }
    });
    if (existing?.value) {
      cachedToken = existing.value;
      return existing.value;
    }
    const token = crypto.randomBytes(16).toString("hex");
    await prisma.systemSetting.upsert({
      where: { key: "setup_token" },
      update: { value: token },
      create: { key: "setup_token", value: token }
    });
    cachedToken = token;
    return token;
  } catch {
    const token = crypto.randomBytes(16).toString("hex");
    cachedToken = token;
    return token;
  }
}

export async function isInitialized() {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "initialized" }
    });
    return setting?.value === "true";
  } catch {
    return false;
  }
}

export async function markInitialized() {
  await prisma.systemSetting.upsert({
    where: { key: "initialized" },
    update: { value: "true" },
    create: { key: "initialized", value: "true" }
  });
  await prisma.systemSetting.upsert({
    where: { key: "setup_completed_at" },
    update: { value: new Date().toISOString() },
    create: { key: "setup_completed_at", value: new Date().toISOString() }
  });
  await prisma.systemSetting.deleteMany({ where: { key: "setup_token" } });
  cachedToken = null;
}
