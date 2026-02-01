import { redirect } from "next/navigation";
import { isInitialized } from "@/lib/setup";

export default async function LoginPage() {
  const initialized = await isInitialized();
  if (!initialized) {
    redirect("/setup");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="notion-card w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold mb-2">Login</h1>
        <p className="text-sm text-neutral-500 mb-6">Willkommen zurück.</p>
        <form action="/api/auth/login" method="post" className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-neutral-500">E-Mail</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-neutral-500">Passwort</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-black text-white py-2"
          >
            Einloggen
          </button>
        </form>
      </div>
    </div>
  );
}
