import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database/db.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Datenbank initialisieren
try {
  initDatabase();
  console.log('✓ Datenbank initialisiert');
} catch (error) {
  console.error('✗ Datenbankfehler:', error);
  process.exit(1);
}

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Hikvision Chatbot API'
  });
});

// API Routen
app.use('/api/chat', chatRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpunkt nicht gefunden'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Fehler:', err);
  res.status(500).json({
    success: false,
    error: 'Interner Serverfehler',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎥 Hikvision Videoüberwachungs-Beratungs-Chatbot      ║
║                                                           ║
║   Server läuft auf: http://localhost:${PORT}               ║
║   API Endpunkt: http://localhost:${PORT}/api/chat         ║
║                                                           ║
║   Verfügbare Module:                                      ║
║   • NVR/DVR Rekorder Berater                            ║
║   • Kamera & Zubehör Berater                            ║
║   • VMS Berater                                          ║
║   • Netzwerktechnik Berater                             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
