# 🎥 Hikvision Videoüberwachungs-Beratungs-Chatbot

Ein KI-gestützter Chatbot für die Produktberatung von Hikvision-Videoüberwachungsanlagen, powered by Anthropic Claude.

## 📋 Übersicht

Dieser Chatbot hilft bei der Auswahl der richtigen Videoüberwachungskomponenten durch spezialisierte Beratungsmodule:

- **NVR/DVR Rekorder-Berater**: Hilft bei der Auswahl des passenden Netzwerk- oder Digital-Videorekorders
- **Kamera & Zubehör-Berater**: Empfiehlt geeignete Kameras und notwendiges Zubehör
- **VMS-Berater**: Berät zu Videomanagement-Systemen (von kostenlos bis Enterprise)
- **Netzwerktechnik-Berater**: Unterstützt bei der Auswahl von Switches und Netzwerkkomponenten

Jedes Modul verfügt über:
- Eigenen spezialisierten Systemprompt
- Zugriff auf dedizierte Produktdatenbank
- Intelligente Fragenstrategie zur Bedarfsermittlung
- Konkrete Produktempfehlungen mit Begründung

## 🏗️ Architektur

```
├── backend/
│   ├── server.js              # Express Server
│   ├── config/
│   │   └── anthropic.js       # Anthropic API Integration
│   ├── modules/               # Spezialisierte Berater
│   │   ├── nvr-advisor.js
│   │   ├── camera-advisor.js
│   │   ├── vms-advisor.js
│   │   └── network-advisor.js
│   ├── database/
│   │   ├── db.js              # Datenbank-Wrapper
│   │   ├── schema.sql         # Datenbankschema mit Beispieldaten
│   │   └── init-db.js         # DB-Initialisierung
│   ├── routes/
│   │   └── chat.js            # Chat-API Endpunkte
│   └── package.json
│
├── frontend/
│   └── index.html             # Vue 3 + Quasar Chat-Interface
│
└── README.md
```

## 🚀 Installation & Setup

### Voraussetzungen

- Node.js (v18 oder höher)
- npm oder yarn
- Anthropic API Key ([hier erhalten](https://console.anthropic.com/))

### Backend Setup

1. **Dependencies installieren**

```bash
cd backend
npm install
```

2. **Umgebungsvariablen konfigurieren**

Erstellen Sie eine `.env` Datei im `backend/` Verzeichnis:

```bash
cp .env.example .env
```

Bearbeiten Sie `.env` und fügen Sie Ihren Anthropic API Key ein:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3000
NODE_ENV=development
DB_PATH=./database/hikvision.db
```

3. **Datenbank initialisieren**

```bash
npm run init-db
```

Dies erstellt die SQLite-Datenbank mit allen Beispieldaten für Hikvision-Produkte.

4. **Server starten**

```bash
npm start
```

Für Entwicklung mit Auto-Reload:

```bash
npm run dev
```

Der Server läuft nun auf `http://localhost:3000`

### Frontend Setup

Das Frontend ist eine standalone HTML-Datei und benötigt keine Installation.

1. **Öffnen Sie das Frontend**

Öffnen Sie `frontend/index.html` in Ihrem Browser oder starten Sie einen lokalen Webserver:

```bash
cd frontend
python3 -m http.server 8080
```

Dann öffnen Sie `http://localhost:8080` im Browser.

**Wichtig**: Stellen Sie sicher, dass das Backend läuft, bevor Sie das Frontend verwenden.

## 📡 API Endpunkte

### Module abrufen

```
GET /api/chat/modules
```

Gibt alle verfügbaren Beratungsmodule zurück.

### Chat-Sitzung starten

```
POST /api/chat/session/start
Content-Type: application/json

{
  "moduleId": "nvr"
}
```

Startet eine neue Chat-Sitzung für das gewählte Modul.

### Nachricht senden

```
POST /api/chat/chat
Content-Type: application/json

{
  "sessionId": "session_xxx",
  "message": "Ich benötige einen NVR für 8 Kameras",
  "userRequirements": {
    "minChannels": 8
  }
}
```

### Chat-Historie abrufen

```
GET /api/chat/session/:sessionId/history
```

### Sitzung beenden

```
DELETE /api/chat/session/:sessionId
```

### Streaming (Optional)

```
POST /api/chat/chat/stream
```

Verwendet Server-Sent Events (SSE) für Echtzeit-Antworten.

## 🗄️ Datenbank

Die SQLite-Datenbank enthält Beispieldaten für:

### Rekorder (NVR/DVR)
- 8 verschiedene Modelle (4 bis 32 Kanäle)
- Spezifikationen: PoE, VCA, Speicher, Alarm-I/O
- Preiskategorien von 100-3000 EUR

### Kameras
- 13 verschiedene Modelle (Dome, Bullet, PTZ, Fisheye)
- Features: 4K, ColorVu, AcuSense, VCA
- Indoor/Outdoor, verschiedene IR-Reichweiten

### Kamera-Zubehör
- Halterungen (Wand, Decke, Ecke, Pfahl)
- Gehäuse und Wetterschutz
- Stromversorgung und Kabel

### VMS-Systeme
- Von kostenlos (iVMS-4200) bis Enterprise (HikCentral)
- Cloud und On-Premise Lösungen

### Netzwerktechnik
- PoE Switches (4 bis 24 Ports)
- Verschiedene PoE-Standards (af/at/bt)
- Managed und Unmanaged

## 🔧 Erweiterung & Anpassung

### Neue Module hinzufügen

1. Erstellen Sie eine neue Datei in `backend/modules/`, z.B. `access-control-advisor.js`:

```javascript
import { dbQueries } from '../database/db.js';

export const accessControlAdvisorConfig = {
  name: 'Zutrittskontrolle Berater',
  systemPrompt: `Ihr Systemprompt hier...`,

  getContext: (userRequirements = {}) => {
    // Kontext aus Datenbank laden
    return 'Kontext hier...';
  }
};

export default accessControlAdvisorConfig;
```

2. Registrieren Sie das Modul in `backend/routes/chat.js`:

```javascript
import accessControlAdvisorConfig from '../modules/access-control-advisor.js';

const modules = {
  nvr: nvrAdvisorConfig,
  camera: cameraAdvisorConfig,
  vms: vmsAdvisorConfig,
  network: networkAdvisorConfig,
  accesscontrol: accessControlAdvisorConfig  // Neu
};
```

### Datenbank erweitern

1. Bearbeiten Sie `backend/database/schema.sql`
2. Fügen Sie neue Tabellen oder Daten hinzu
3. Führen Sie aus: `npm run init-db`

### Systemprompts anpassen

Die Systemprompts befinden sich in den jeweiligen Modul-Dateien unter `backend/modules/`.

## 🎨 Frontend-Anpassung

Das Frontend ist in einer einzelnen HTML-Datei implementiert. Für eine vollständige Quasar-App:

```bash
npm install -g @quasar/cli
quasar create frontend-app
```

Dann können Sie die Vue-Komponenten aus `frontend/index.html` in ein vollständiges Quasar-Projekt migrieren.

## 🔐 Sicherheit

Für Produktionsumgebungen:

1. **API Key schützen**: Verwenden Sie Umgebungsvariablen, nie hardcoded
2. **CORS konfigurieren**: Beschränken Sie in `server.js` die erlaubten Origins
3. **Rate Limiting**: Implementieren Sie Rate Limiting für API-Endpunkte
4. **Session Management**: Verwenden Sie Redis oder eine Datenbank statt In-Memory
5. **HTTPS**: Verwenden Sie HTTPS in Produktion
6. **Input Validation**: Validieren Sie alle Benutzereingaben

## 📊 Monitoring & Logging

Empfohlene Tools für Produktion:

- **Winston** oder **Pino** für strukturiertes Logging
- **PM2** für Prozessmanagement
- **Sentry** für Error Tracking

## 🚢 Deployment

### Docker (Empfohlen)

Erstellen Sie eine `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./
EXPOSE 3000
CMD ["node", "server.js"]
```

### Traditionelles Hosting

1. Backend auf Server deployen (z.B. via PM2)
2. Frontend auf Webserver oder CDN
3. Reverse Proxy (nginx) für HTTPS

## 📝 Lizenz

MIT License

## 👥 Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository.

## 🎯 Roadmap

- [ ] Vollständiges Quasar-Projekt mit TypeScript
- [ ] Benutzerauthentifizierung
- [ ] Chat-Historie in Datenbank persistieren
- [ ] Export von Empfehlungen als PDF
- [ ] Multi-Language Support
- [ ] Integration mit Hikvision-API für Live-Produktdaten
- [ ] Admin-Dashboard für Produktverwaltung

## 🙏 Credits

- **Frontend**: Vue 3, Quasar Framework
- **Backend**: Node.js, Express
- **AI**: Anthropic Claude
- **Datenbank**: SQLite

---

Made with ❤️ for Hikvision Integration

---

**Autor**: Can Koca
