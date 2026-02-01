# Production Deployment (Ubuntu + Docker)

Diese Anleitung beschreibt ein Produktions-Setup mit Docker Compose, lokalem Postgres-Container und Nginx Reverse Proxy inkl. HTTPS.

## Voraussetzungen
- Ubuntu VM
- Docker + Docker Compose installiert
- Domain zeigt auf die VM
- TLS-Zertifikate (z.B. Let’s Encrypt) als PEM-Dateien vorhanden

## Verzeichnisstruktur
```
/deploy
  docker-compose.yml
  /nginx
    nginx.conf
    /conf.d/itdocs.conf
    /certs/fullchain.pem
    /certs/privkey.pem
```

## Setup-Schritte

### 1) Repo auf die VM kopieren
```bash
git clone <repo>
cd Webapp-IT-Dokumentation/deploy
```

### 2) Zertifikate hinterlegen
Kopiere die Zertifikate nach:
```
deploy/nginx/certs/fullchain.pem
deploy/nginx/certs/privkey.pem
```

### 3) Domain konfigurieren
Passe in `deploy/nginx/conf.d/itdocs.conf` die `server_name` an deine Domain an.

### 4) JWT_SECRET setzen
Passe in `deploy/docker-compose.yml` den Wert für `JWT_SECRET` an (zufälliger String).

### 5) Container starten
```bash
docker compose up -d --build
```

### 6) Setup Wizard ausführen
Rufe `https://<deine-domain>/setup` auf und führe den Setup-Prozess aus.

## Hinweise
- `ENABLE_DOCKER_SETUP` ist in Production auf `false` gesetzt.
- Postgres läuft im Container, Daten liegen in `postgres_data` Volume.
- Backup/Restore erfolgt über `pg_dump` innerhalb des Containers.
