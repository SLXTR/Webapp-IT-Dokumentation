import { describe, expect, it } from "vitest";
import { canAdmin, canRead, canWrite } from "../lib/rbac";

describe("rbac", () => {
  it("allows read for all roles", () => {
    expect(canRead("SUPER_ADMIN")).toBe(true);
    expect(canRead("CUSTOMER_ADMIN")).toBe(true);
    expect(canRead("TECHNICIAN")).toBe(true);
    expect(canRead("READ_ONLY")).toBe(true);
  });

  it("allows write for admin and technician", () => {
    expect(canWrite("SUPER_ADMIN")).toBe(true);
    expect(canWrite("CUSTOMER_ADMIN")).toBe(true);
    expect(canWrite("TECHNICIAN")).toBe(true);
    expect(canWrite("READ_ONLY")).toBe(false);
  });

  it("allows admin for customer and super admins", () => {
    expect(canAdmin("SUPER_ADMIN")).toBe(true);
    expect(canAdmin("CUSTOMER_ADMIN")).toBe(true);
    expect(canAdmin("TECHNICIAN")).toBe(false);
  });
});
