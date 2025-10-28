import { dbQueries } from '../database/db.js';

export const nvrAdvisorConfig = {
  name: 'NVR/DVR Rekorder Berater',
  systemPrompt: `Du bist der Produktmanager von Hikvision und kennst alle NVR und DVR von Hikvision perfekt.

Deine Aufgabe ist es, den passenden Rekorder für die angeforderte Aufgabe herauszusuchen.

Du stellst gezielte Fragen, um die Anforderungen zu verstehen:

1. **Anzahl der Kameras**: Wie viele Kameras sollen angeschlossen werden? (aktuell und zukünftige Erweiterung)
2. **Kameratyp**: IP-Kameras (NVR) oder analoge/HD-TVI Kameras (DVR)?
3. **Auflösung**: Welche maximale Auflösung wird benötigt? (z.B. 4K/8MP, 5MP, 4MP)
4. **Aufzeichnungsdauer**: Wie lange sollen die Aufnahmen gespeichert werden? (Tage/Wochen)
5. **Aufzeichnungsart**:
   - Permanent (24/7)
   - Motion Detection (Bewegungserkennung)
   - Kontakt (Alarm-Eingang)
   - Videoanalyse (VCA)
6. **VCA/Videoanalyse**: Wird intelligente Videoanalyse benötigt? (Linienüberschreitung, Eindringen, etc.)
7. **Alarme**: Werden Alarmeingänge/-ausgänge benötigt?
8. **Benachrichtigungen**:
   - APP-Benachrichtigungen (Hik-Connect)
   - Anbindung an Wachzentrale/Leitstelle
9. **PoE**: Sollen die Kameras über den Rekorder mit Strom versorgt werden? (PoE)
10. **Speicherkapazität**: Gibt es spezielle Anforderungen an die Speichergröße?

Du gehst schrittweise vor und stellst nicht alle Fragen auf einmal. Basierend auf den Antworten empfiehlst du konkrete Hikvision-Modelle aus der Produktdatenbank mit Begründung.

Dein Ton ist professionell, hilfsbereit und beratend. Du erklärst technische Begriffe verständlich.`,

  // Kontext für Claude mit Produktinformationen
  getContext: (userRequirements = {}) => {
    let context = '\n\n**Verfügbare Hikvision Rekorder in der Datenbank:**\n\n';

    // Hole relevante Rekorder basierend auf Anforderungen
    const filters = {};
    if (userRequirements.type) filters.type = userRequirements.type;
    if (userRequirements.minChannels) filters.minChannels = userRequirements.minChannels;
    if (userRequirements.vcaSupport) filters.vcaSupport = userRequirements.vcaSupport;
    if (userRequirements.poeRequired) filters.poeRequired = userRequirements.poeRequired;

    const recorders = Object.keys(filters).length > 0
      ? dbQueries.searchRecorders(filters)
      : dbQueries.getAllRecorders();

    recorders.forEach(recorder => {
      context += `**${recorder.model}** (${recorder.type})\n`;
      context += `- Kanäle: ${recorder.max_channels}\n`;
      context += `- Max. Auflösung: ${recorder.max_resolution}\n`;
      context += `- Festplatten: ${recorder.storage_bays} Bay(s), bis ${recorder.max_storage_tb}TB\n`;
      context += `- Aufzeichnungsmodi: ${recorder.recording_modes}\n`;
      context += `- VCA Support: ${recorder.vca_support ? 'Ja' : 'Nein'}\n`;
      if (recorder.poe_ports > 0) {
        context += `- PoE Ports: ${recorder.poe_ports}\n`;
      }
      context += `- Alarm I/O: ${recorder.alarm_input} Eingänge, ${recorder.alarm_output} Ausgänge\n`;
      context += `- APP/Wachzentrale: ${recorder.app_notification ? 'Hik-Connect' : 'Nein'} / ${recorder.control_center_integration ? 'Ja' : 'Nein'}\n`;
      context += `- Preis: ${recorder.price_range}\n`;
      context += `- ${recorder.description}\n`;
      if (recorder.features) {
        context += `- Features: ${recorder.features}\n`;
      }
      context += '\n';
    });

    return context;
  }
};

export default nvrAdvisorConfig;
