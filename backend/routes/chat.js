import express from 'express';
import { createChatCompletion, streamChatCompletion } from '../config/anthropic.js';
import nvrAdvisorConfig from '../modules/nvr-advisor.js';
import cameraAdvisorConfig from '../modules/camera-advisor.js';
import vmsAdvisorConfig from '../modules/vms-advisor.js';
import networkAdvisorConfig from '../modules/network-advisor.js';

const router = express.Router();

// Verfügbare Module
const modules = {
  nvr: nvrAdvisorConfig,
  camera: cameraAdvisorConfig,
  vms: vmsAdvisorConfig,
  network: networkAdvisorConfig
};

// Chat-Sitzungen im Speicher (für Produktion: Redis oder Datenbank verwenden)
const sessions = new Map();

// Liste aller verfügbaren Module abrufen
router.get('/modules', (req, res) => {
  const moduleList = Object.keys(modules).map(key => ({
    id: key,
    name: modules[key].name
  }));

  res.json({
    success: true,
    modules: moduleList
  });
});

// Neue Chat-Sitzung starten
router.post('/session/start', (req, res) => {
  const { moduleId } = req.body;

  if (!moduleId || !modules[moduleId]) {
    return res.status(400).json({
      success: false,
      error: 'Ungültiges Modul'
    });
  }

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  sessions.set(sessionId, {
    moduleId,
    messages: [],
    userRequirements: {},
    createdAt: new Date()
  });

  res.json({
    success: true,
    sessionId,
    module: modules[moduleId].name
  });
});

// Nachricht an Chatbot senden
router.post('/chat', async (req, res) => {
  const { sessionId, message, userRequirements } = req.body;

  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(400).json({
      success: false,
      error: 'Ungültige Sitzung'
    });
  }

  if (!message) {
    return res.status(400).json({
      success: false,
      error: 'Nachricht erforderlich'
    });
  }

  const session = sessions.get(sessionId);
  const module = modules[session.moduleId];

  // User-Anforderungen aktualisieren falls vorhanden
  if (userRequirements) {
    session.userRequirements = { ...session.userRequirements, ...userRequirements };
  }

  // Nachricht zur Historie hinzufügen
  session.messages.push({
    role: 'user',
    content: message
  });

  // Kontext aus Datenbank laden
  const context = module.getContext(session.userRequirements);
  const systemPrompt = module.systemPrompt + context;

  // API-Aufruf an Anthropic
  const result = await createChatCompletion(session.messages, systemPrompt);

  if (result.success) {
    // Antwort zur Historie hinzufügen
    session.messages.push({
      role: 'assistant',
      content: result.message
    });

    sessions.set(sessionId, session);

    res.json({
      success: true,
      response: result.message,
      usage: result.usage
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error
    });
  }
});

// Chat-Historie abrufen
router.get('/session/:sessionId/history', (req, res) => {
  const { sessionId } = req.params;

  if (!sessions.has(sessionId)) {
    return res.status(404).json({
      success: false,
      error: 'Sitzung nicht gefunden'
    });
  }

  const session = sessions.get(sessionId);

  res.json({
    success: true,
    messages: session.messages,
    module: modules[session.moduleId].name
  });
});

// Sitzung beenden
router.delete('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  if (!sessions.has(sessionId)) {
    return res.status(404).json({
      success: false,
      error: 'Sitzung nicht gefunden'
    });
  }

  sessions.delete(sessionId);

  res.json({
    success: true,
    message: 'Sitzung beendet'
  });
});

// Streaming-Endpunkt (optional, für Echtzeit-Antworten)
router.post('/chat/stream', async (req, res) => {
  const { sessionId, message, userRequirements } = req.body;

  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(400).json({
      success: false,
      error: 'Ungültige Sitzung'
    });
  }

  const session = sessions.get(sessionId);
  const module = modules[session.moduleId];

  if (userRequirements) {
    session.userRequirements = { ...session.userRequirements, ...userRequirements };
  }

  session.messages.push({
    role: 'user',
    content: message
  });

  const context = module.getContext(session.userRequirements);
  const systemPrompt = module.systemPrompt + context;

  // SSE (Server-Sent Events) Setup
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let fullResponse = '';

  const result = await streamChatCompletion(
    session.messages,
    systemPrompt,
    (chunk) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }
  );

  if (result.success) {
    session.messages.push({
      role: 'assistant',
      content: fullResponse
    });
    sessions.set(sessionId, session);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } else {
    res.write(`data: ${JSON.stringify({ error: result.error })}\n\n`);
  }

  res.end();
});

export default router;
