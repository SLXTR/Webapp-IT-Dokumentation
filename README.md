# IT-Dokumentation Suite

Diese Webapp ist eine umfangreichere, lokale Oberfläche zur Dokumentation der Netzwerkinfrastruktur als IT-Dienstleister. Sie deckt Kunden, Standorte, Geräte, Switches, Switchport-Zuordnungen, Netzsegmente, Admin-Zugangsdaten sowie Rollen und Techniker ab.

## Funktionen

- Mandantenfähig: mehrere Kunden mit eigenen Standorten
- Geräte, Switches und Netzwerksegmente dokumentieren
- Switchport-Zuordnung für exakte Verkabelungsinfos
- Admin-Zugangsdaten lokal hinterlegen
- Rollen & Techniker mit Kunde verknüpfen
- Software- und Lizenzübersicht pro Gerät
- Globale Suche in Geräten

> Hinweis: Die Daten werden im lokalen Browser-Speicher gespeichert. Für produktive Nutzung sollten Backend, Verschlüsselung und Audit-Logging ergänzt werden.

## Nutzung

1. Repository öffnen.
2. `index.html` im Browser öffnen.
3. Einträge über die Formulare hinzufügen.

## Struktur

- `index.html` – Layout, Navigation, Formulare
- `styles.css` – Notion-ähnliches, modernes Design
- `app.js` – Logik für Speicherung, Listen, Verknüpfungen
