"use client";

import { useEffect, useState } from "react";

type SetupStatus = {
  initialized: boolean;
  dockerAvailable: boolean;
  canWriteEnv: boolean;
  setupToken: string;
};

export default function SetupPage() {
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [owner, setOwner] = useState({ name: "", email: "", password: "" });
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/setup/status")
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => setLog((prev) => [...prev, "Status konnte nicht geladen werden."]));
  }, []);

  const run = async (path: string, body: Record<string, unknown>) => {
    if (!status) return;
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-setup-token": status.setupToken
      },
      body: JSON.stringify(body)
    });
    const json = await response.json();
    setLog((prev) => [...prev, `${path}: ${JSON.stringify(json)}`]);
  };

  if (!status) {
    return <div className="p-8">Setup wird geladen...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Erst-Setup</h1>
        <p className="text-neutral-500">Führe die Einrichtung in wenigen Schritten durch.</p>
      </header>

      <section className="notion-card p-6 space-y-3">
        <h2 className="text-lg font-semibold">Systemcheck</h2>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>Docker verfügbar: {status.dockerAvailable ? "Ja" : "Nein"}</li>
          <li>.env Schreibzugriff: {status.canWriteEnv ? "Ja" : "Nein"}</li>
        </ul>
      </section>

      <section className="notion-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Schritt 1: Datenbank verbinden</h2>
        <input
          value={databaseUrl}
          onChange={(event) => setDatabaseUrl(event.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2"
          placeholder="postgresql://user:pass@host:5432/dbname?schema=public"
        />
        <div className="flex gap-2">
          <button
            onClick={() => run("/api/setup/test-db", { databaseUrl })}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm"
          >
            Verbindung testen
          </button>
          <button
            onClick={() => run("/api/setup/migrate", { databaseUrl })}
            className="rounded-lg bg-black text-white px-4 py-2 text-sm"
          >
            Migration + Seed
          </button>
        </div>
      </section>

      <section className="notion-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Schritt 2: Owner anlegen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={owner.name}
            onChange={(event) => setOwner({ ...owner, name: event.target.value })}
            className="rounded-lg border border-neutral-200 px-3 py-2"
            placeholder="Name"
          />
          <input
            value={owner.email}
            onChange={(event) => setOwner({ ...owner, email: event.target.value })}
            className="rounded-lg border border-neutral-200 px-3 py-2"
            placeholder="E-Mail"
          />
          <input
            value={owner.password}
            onChange={(event) => setOwner({ ...owner, password: event.target.value })}
            className="rounded-lg border border-neutral-200 px-3 py-2"
            placeholder="Passwort"
            type="password"
          />
        </div>
        <button
          onClick={() => run("/api/setup/create-owner", owner)}
          className="rounded-lg bg-black text-white px-4 py-2 text-sm"
        >
          Owner erstellen
        </button>
      </section>

      <section className="notion-card p-6">
        <h2 className="text-lg font-semibold">Setup-Log</h2>
        <div className="mt-3 text-xs text-neutral-500 space-y-1">
          {log.map((entry: string, index: number) => (
            <div key={index}>{entry}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
