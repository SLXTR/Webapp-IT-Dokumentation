import Link from "next/link";
import { SessionUser } from "../lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/customers", label: "Kunden" },
  { href: "/admin", label: "Admin" }
];

export default function Sidebar({ user }: { user: SessionUser }) {
  return (
    <aside className="w-64 bg-sidebar border-r border-neutral-200 p-6 flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Workspace</p>
        <h1 className="text-lg font-semibold">IT-Dokumentation</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm hover:bg-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto text-sm text-neutral-600">
        <p>{user.name ?? "Unbekannt"}</p>
        <p className="text-xs text-neutral-400">{user.email}</p>
      </div>
    </aside>
  );
}
