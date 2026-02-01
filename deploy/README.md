# Production Deployment (Ubuntu + Docker)

Diese Anleitung beschreibt ein Produktions-Setup mit Docker Compose, lokalem Postgres-Container und Nginx Reverse Proxy inkl. HTTPS.

## Voraussetzungen
- Ubuntu VM
- Docker + Docker Compose installiert
- Domain zeigt auf die VM (A/AAAA Record) für `docu.birkhoelzer-it.de`
- Ports 80 und 443 sind erreichbar (Ingress/Firewall)

## Verzeichnisstruktur
```
/deploy
  docker-compose.yml
  /nginx
    nginx.conf
    /conf.d/itdocs.conf
    /certs/live/docu.birkhoelzer-it.de/fullchain.pem
    /certs/live/docu.birkhoelzer-it.de/privkey.pem
```

## Setup-Schritte

### 1) Repo auf die VM kopieren
```bash
git clone <repo>
cd Webapp-IT-Dokumentation/deploy
```

### 2) Domain konfigurieren
Passe in `deploy/nginx/conf.d/itdocs.conf` die `server_name` auf `docu.birkhoelzer-it.de` an (bereits gesetzt).

### 3) JWT_SECRET setzen
Passe in `deploy/docker-compose.yml` den Wert für `JWT_SECRET` an (zufälliger String).

### 4) Container starten
```bash
docker compose up -d --build
```

### 5) Let’s Encrypt Zertifikat holen (Certbot im Container)
Die Konfiguration nutzt den ACME Webroot unter `/var/www/certbot`.

```bash
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d docu.birkhoelzer-it.de \
  --email admin@birkhoelzer-it.de \
  --agree-tos \
  --no-eff-email
```

Danach Nginx neu laden:
```bash
docker compose exec nginx nginx -s reload
```

### 6) Nginx TLS-Paths prüfen
Die Nginx-Konfiguration nutzt:
```
/etc/letsencrypt/live/docu.birkhoelzer-it.de/fullchain.pem
/etc/letsencrypt/live/docu.birkhoelzer-it.de/privkey.pem
```
Diese Pfade werden automatisch durch den `certbot` Container unter `deploy/nginx/certs` bereitgestellt.

### 7) Setup Wizard ausführen
Rufe `https://docu.birkhoelzer-it.de/setup` auf und führe den Setup-Prozess aus.

## Hinweise
- `ENABLE_DOCKER_SETUP` ist in Production auf `false` gesetzt.
- Postgres läuft im Container, Daten liegen in `postgres_data` Volume.
- Backup/Restore erfolgt über `pg_dump` innerhalb des Containers.
- Zertifikats-Renewal kann per Cron erfolgen, z.B.:
  ```bash
  docker compose run --rm certbot renew
  docker compose exec nginx nginx -s reload
  ```
