# 🚀 Quickstart Guide

## Schnelleinstieg in 5 Minuten

### 1. Repository klonen (falls noch nicht geschehen)

```bash
git clone <your-repo-url>
cd Kiosk1
```

### 2. Backend Setup

```bash
# In das Backend-Verzeichnis wechseln
cd backend

# Dependencies installieren
npm install

# .env Datei erstellen
cp .env.example .env

# Wichtig: Bearbeiten Sie .env und fügen Sie Ihren Anthropic API Key ein
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# Datenbank initialisieren
npm run init-db

# Server starten
npm start
```

Der Backend-Server läuft jetzt auf `http://localhost:3000`

### 3. Frontend öffnen

Öffnen Sie ein neues Terminal:

```bash
cd frontend
python3 -m http.server 8080
```

Öffnen Sie dann Ihren Browser und gehen Sie zu: `http://localhost:8080`

**Alternative**: Öffnen Sie `frontend/index.html` direkt im Browser (funktioniert auch ohne Webserver).

### 4. Chatbot verwenden

1. Wählen Sie ein Beratungsmodul aus (z.B. "NVR/DVR Rekorder Berater")
2. Beschreiben Sie Ihr Projekt oder stellen Sie Fragen
3. Der Chatbot stellt gezielte Fragen und empfiehlt passende Produkte

## Beispiel-Dialoge

### NVR Rekorder-Beratung

**User**: "Ich möchte ein Videoüberwachungssystem für mein Bürogebäude installieren. Ich benötige 12 Kameras."

**Chatbot**: "Gerne helfe ich Ihnen bei der Auswahl des passenden Rekorders! Einige Fragen zur Klärung:

1. Handelt es sich um IP-Kameras (NVR) oder analoge/HD-TVI Kameras (DVR)?
2. Welche Auflösung sollen die Kameras haben? (z.B. 4K, 5MP, 4MP)
3. Wie lange sollen die Aufnahmen gespeichert werden?"

### Kamera-Beratung

**User**: "Ich brauche Außenkameras für einen Parkplatz mit 80m Reichweite bei Nacht."

**Chatbot**: "Für einen Parkplatz mit 80m Nachtsicht-Reichweite empfehle ich folgende Kameras:

**DS-2CD2T85G1-I8** (Bullet 4K)
- 80m IR-Reichweite
- 8MP (4K) Auflösung
- IP67 wetterfest
- Preis: 200-280 EUR

Diese Kamera ist ideal für weitläufige Außenbereiche..."

## API Testen mit curl

### Module abrufen

```bash
curl http://localhost:3000/api/chat/modules
```

### Sitzung starten und Chat

```bash
# Sitzung starten
curl -X POST http://localhost:3000/api/chat/session/start \
  -H "Content-Type: application/json" \
  -d '{"moduleId":"nvr"}'

# Response: {"success":true,"sessionId":"session_xxx","module":"NVR/DVR Rekorder Berater"}

# Nachricht senden
curl -X POST http://localhost:3000/api/chat/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"session_xxx",
    "message":"Ich benötige einen NVR für 8 Kameras mit 4K Auflösung"
  }'
```

## Troubleshooting

### Backend startet nicht

**Problem**: `Error: ANTHROPIC_API_KEY not found`

**Lösung**: Überprüfen Sie, dass die `.env` Datei existiert und Ihren API Key enthält.

### Frontend kann nicht mit Backend kommunizieren

**Problem**: CORS-Fehler in der Browser-Konsole

**Lösung**: Stellen Sie sicher, dass:
1. Das Backend auf Port 3000 läuft
2. Das Frontend die richtige API URL verwendet (siehe `apiBaseUrl` in `frontend/index.html`)

### Datenbank-Fehler

**Problem**: `Error: SQLITE_ERROR: no such table: recorders`

**Lösung**: Führen Sie `npm run init-db` im Backend-Verzeichnis aus.

## Nächste Schritte

- Passen Sie die Systemprompts in `backend/modules/` an Ihre Bedürfnisse an
- Erweitern Sie die Datenbank mit echten Hikvision-Produktdaten
- Implementieren Sie zusätzliche Module (z.B. Zutrittskontrolle)
- Deployen Sie die Anwendung auf einem Server

Viel Erfolg! 🎉
