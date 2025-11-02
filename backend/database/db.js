import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DB_PATH || join(__dirname, 'hikvision.db');
const db = new Database(dbPath);

// Datenbankinitialisierung
export function initDatabase() {
  const schemaPath = join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // SQL-Statements aufteilen und ausführen
  const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

  db.exec('BEGIN TRANSACTION');
  try {
    statements.forEach(statement => {
      db.exec(statement);
    });
    db.exec('COMMIT');
    console.log('✓ Datenbank erfolgreich initialisiert');
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('✗ Fehler bei Datenbankinitialisierung:', error);
    throw error;
  }
}

// Hilfsfunktionen für Datenbankabfragen
export const dbQueries = {
  // NVR/DVR Abfragen
  getAllRecorders: () => {
    return db.prepare('SELECT * FROM recorders').all();
  },

  searchRecorders: (filters) => {
    let query = 'SELECT * FROM recorders WHERE 1=1';
    const params = [];

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters.minChannels) {
      query += ' AND max_channels >= ?';
      params.push(filters.minChannels);
    }
    if (filters.maxChannels) {
      query += ' AND max_channels <= ?';
      params.push(filters.maxChannels);
    }
    if (filters.vcaSupport !== undefined) {
      query += ' AND vca_support = ?';
      params.push(filters.vcaSupport ? 1 : 0);
    }
    if (filters.poeRequired !== undefined && filters.poeRequired) {
      query += ' AND poe_ports > 0';
    }

    return db.prepare(query).all(...params);
  },

  getRecorderById: (id) => {
    return db.prepare('SELECT * FROM recorders WHERE id = ?').get(id);
  },

  // Kamera Abfragen
  getAllCameras: () => {
    return db.prepare('SELECT * FROM cameras').all();
  },

  searchCameras: (filters) => {
    let query = 'SELECT * FROM cameras WHERE 1=1';
    const params = [];

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters.indoor_outdoor) {
      query += ' AND (indoor_outdoor = ? OR indoor_outdoor = "Indoor/Outdoor")';
      params.push(filters.indoor_outdoor);
    }
    if (filters.minIrRange) {
      query += ' AND ir_range_meters >= ?';
      params.push(filters.minIrRange);
    }
    if (filters.poe !== undefined) {
      query += ' AND poe = ?';
      params.push(filters.poe ? 1 : 0);
    }
    if (filters.vandalProof !== undefined) {
      query += ' AND vandal_proof = ?';
      params.push(filters.vandalProof ? 1 : 0);
    }

    return db.prepare(query).all(...params);
  },

  getCameraById: (id) => {
    return db.prepare('SELECT * FROM cameras WHERE id = ?').get(id);
  },

  // Zubehör Abfragen
  getAllAccessories: () => {
    return db.prepare('SELECT * FROM camera_accessories').all();
  },

  searchAccessories: (type) => {
    if (type) {
      return db.prepare('SELECT * FROM camera_accessories WHERE type = ?').all(type);
    }
    return db.prepare('SELECT * FROM camera_accessories').all();
  },

  // VMS Abfragen
  getAllVMS: () => {
    return db.prepare('SELECT * FROM vms_systems').all();
  },

  searchVMS: (filters) => {
    let query = 'SELECT * FROM vms_systems WHERE 1=1';
    const params = [];

    if (filters.minCameras) {
      query += ' AND max_cameras >= ?';
      params.push(filters.minCameras);
    }
    if (filters.cloudSupport !== undefined) {
      query += ' AND cloud_support = ?';
      params.push(filters.cloudSupport ? 1 : 0);
    }

    return db.prepare(query).all(...params);
  },

  // Netzwerktechnik Abfragen
  getAllNetworkEquipment: () => {
    return db.prepare('SELECT * FROM network_equipment').all();
  },

  searchNetworkEquipment: (filters) => {
    let query = 'SELECT * FROM network_equipment WHERE 1=1';
    const params = [];

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters.minPoePorts) {
      query += ' AND poe_ports >= ?';
      params.push(filters.minPoePorts);
    }
    if (filters.minPoeBudget) {
      query += ' AND poe_budget_watts >= ?';
      params.push(filters.minPoeBudget);
    }

    return db.prepare(query).all(...params);
  }
};

export default db;
