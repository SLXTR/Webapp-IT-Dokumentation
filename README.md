# Webapp-IT-Dokumentation (MVP)

Moderne, mandantenfähige IT-Dokumentation im Notion-Look. Die MVP-Version enthält Multi-Tenancy, Auth, RBAC, Switchport-Verknüpfung, Setup-Wizard sowie ein erweiterbares Datenmodell.

## Tech-Stack
- **Frontend/Backend:** Next.js (App Router) + TypeScript
- **DB:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT (httpOnly Cookie)
- **UI:** Tailwind CSS

## Features (MVP)
- Multi-Tenant Workspaces (Kunden)
- Rollen (SUPER_ADMIN, CUSTOMER_ADMIN, TECHNICIAN, READ_ONLY)
- Switches + Ports + Port-Linking
- Geräteverwaltung
- Setup Wizard für Erst-Initialisierung
- Audit Logging (Basis)

## Setup

### 1) Abhängigkeiten installieren
```bash
npm install
```

### 2) ENV konfigurieren
Kopiere `.env.example` nach `.env.local` und trage deine Datenbank-URL ein:
```bash
cp .env.example .env.local
```

### 3) Datenbank via Setup Wizard
Starte die App und folge `/setup`:
```bash
npm run dev
```

**Managed DB:**
- Im Setup Wizard `DATABASE_URL` eintragen
- Verbindung testen
- Migration + Seed ausführen
- Owner-Account anlegen

**Docker (lokal):**
- `ENABLE_DOCKER_SETUP=true` in `.env.local`
- Setup Wizard kann dann einen Postgres-Container erstellen

### 4) Standard Seed-Daten
Seed erzeugt:
- `admin@example.com` / `ChangeMe123!`
- Kunde `Demo GmbH`
- `Core-Switch-01` (24 Ports)
- Geräte: `Firewall-01`, `AP-Office-1`, `NAS-01`
- Port-Link: Port 12 → `AP-Office-1`

> **Wichtig:** Passwort nach dem ersten Login ändern.

## Scripts
```bash
npm run dev           # Dev-Server
npm run build         # Build
npm run start         # Production Start
npm run prisma:deploy # Migration in Prod
npm run seed          # Seeds ausführen
npm run test          # Tests (Vitest)
```

## Produktion (Ubuntu VM + Docker + HTTPS)
Siehe `deploy/README.md` für ein vollständiges Produktions-Setup mit Docker Compose, lokalem Postgres-Container und Nginx (HTTPS).

## Tests
- `tests/rbac.test.ts`: Unit-Tests für RBAC-Regeln
- `tests/port-link.test.ts`: DB-Integrationstest (läuft nur wenn DATABASE_URL gesetzt ist)

## Projektstruktur
```
app/
  (setup)/setup/page.tsx    # Setup Wizard
  (app)/dashboard/page.tsx  # Dashboard
  (app)/customers/...       # Kunden- und Detailseiten
  (app)/admin/page.tsx      # Admin UI
  api/...                   # REST Endpoints
components/
  sidebar.tsx
lib/
  auth.ts
  rbac.ts
  guards.ts
  setup.ts
  setup-guard.ts
prisma/
  schema.prisma
  seed.ts
tests/
  rbac.test.ts
  port-link.test.ts
```

## Hinweise
- Setup-Endpoints sind nur aktiv, solange `system_settings.initialized = false`.
- Nach Abschluss ist `/setup` gesperrt.
- RBAC wird serverseitig in API-Handlern geprüft.

## Roadmap (Ausbau)
- Vollständige Notion-Style Pages (Editor)
- Command Palette & globale Suche im UI
- Switchport-Drawer für Live-Linking
- Audit Log UI
- RBAC UI/Workflow
