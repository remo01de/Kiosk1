import { initDatabase } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

try {
  console.log('Starte Datenbankinitialisierung...');
  initDatabase();
  console.log('✓ Datenbank wurde erfolgreich eingerichtet!');
  process.exit(0);
} catch (error) {
  console.error('✗ Fehler bei der Datenbankinitialisierung:', error);
  process.exit(1);
}
