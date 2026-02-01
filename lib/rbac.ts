export type Role = "SUPER_ADMIN" | "CUSTOMER_ADMIN" | "TECHNICIAN" | "READ_ONLY";

export function canRead(role: Role) {
  return ["SUPER_ADMIN", "CUSTOMER_ADMIN", "TECHNICIAN", "READ_ONLY"].includes(role);
}

export function canWrite(role: Role) {
  return ["SUPER_ADMIN", "CUSTOMER_ADMIN", "TECHNICIAN"].includes(role);
}

export function canAdmin(role: Role) {
  return ["SUPER_ADMIN", "CUSTOMER_ADMIN"].includes(role);
}

export function requireRole<T extends Role>(role: Role, allowed: T[]) {
  return allowed.includes(role as T);
}
