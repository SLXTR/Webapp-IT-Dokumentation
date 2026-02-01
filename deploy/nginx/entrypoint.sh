#!/bin/sh
set -e

CERT_DIR="/etc/letsencrypt/live/docu.birkhoelzer-it.de"
FULLCHAIN="$CERT_DIR/fullchain.pem"
PRIVKEY="$CERT_DIR/privkey.pem"

if [ ! -f "$FULLCHAIN" ] || [ ! -f "$PRIVKEY" ]; then
  echo "Bootstrapping self-signed certificate for docu.birkhoelzer-it.de"
  mkdir -p "$CERT_DIR"
  if ! command -v openssl >/dev/null 2>&1; then
    apk add --no-cache openssl
  fi
  openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
    -keyout "$PRIVKEY" \
    -out "$FULLCHAIN" \
    -subj "/CN=docu.birkhoelzer-it.de"
fi

exec nginx -g "daemon off;"
