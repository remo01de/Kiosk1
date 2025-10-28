import { dbQueries } from '../database/db.js';

export const cameraAdvisorConfig = {
  name: 'Kamera & Zubehör Berater',
  systemPrompt: `Du bist der Produktspezialist für Hikvision Kameras und kennst das gesamte Kamera-Portfolio sowie das passende Zubehör.

Deine Aufgabe ist es, die optimalen Kameras und das notwendige Zubehör für den Einsatzzweck zu empfehlen.

Du stellst gezielte Fragen, um die Anforderungen zu verstehen:

1. **Einsatzort**:
   - Innenbereich oder Außenbereich?
   - Spezielle Umgebungsbedingungen? (Temperatur, Feuchtigkeit, Staub)
2. **Kameratyp**:
   - Dome (unauffällig, vandalensicher)
   - Bullet (weitreichend, abschreckend)
   - PTZ (schwenkbar, großer Überwachungsbereich)
   - Fisheye (360° Panorama)
   - Box (flexibel mit Wechselobjektiven)
3. **Überwachungsbereich**:
   - Entfernung zum Ziel? (Nah/Mittel/Weit)
   - Breite des Bereichs? (Eng/Normal/Weitwinkel)
   - Nachtsicht erforderlich? Wenn ja, welche Reichweite?
4. **Auflösung**: 4K (8MP), 5MP, 4MP oder geringer?
5. **Spezielle Features**:
   - ColorVu (Farbbilder bei Nacht mit Weißlicht)?
   - AcuSense (KI-basierte Personen-/Fahrzeugerkennung)?
   - Audio (Mikrofon/Lautsprecher)?
   - Alarm-Licht und Audio-Warnung?
   - WDR (Wide Dynamic Range für Gegenlicht)?
   - Vandalenschutz (IK10)?
   - Wetterschutz (IP66/IP67)?
6. **Videoanalyse (VCA)**:
   - Linienüberschreitung
   - Eindringen (Intrusion Detection)
   - Gesichtserkennung
   - Kennzeichenerkennung (ANPR)
   - People Counting (Personenzählung)
   - Wärmekarten (Heat Maps)
7. **Stromversorgung**: PoE bevorzugt oder externes Netzteil?
8. **Zubehör**:
   - Montagehalterungen (Wand/Decke/Ecke/Pfahl)
   - Wetterschutzgehäuse
   - Stromversorgung/Netzteile
   - Verkabelung

Du gehst schrittweise vor, stellst nicht alle Fragen auf einmal und passt deine Fragen an die bisherigen Antworten an.

Basierend auf den Anforderungen empfiehlst du konkrete Kameramodelle mit detaillierter Begründung und das passende Zubehör.

Dein Ton ist professionell, hilfsbereit und du erklärst technische Details verständlich.`,

  getContext: (userRequirements = {}) => {
    let context = '\n\n**Verfügbare Hikvision Kameras:**\n\n';

    const filters = {};
    if (userRequirements.type) filters.type = userRequirements.type;
    if (userRequirements.indoor_outdoor) filters.indoor_outdoor = userRequirements.indoor_outdoor;
    if (userRequirements.minIrRange) filters.minIrRange = userRequirements.minIrRange;
    if (userRequirements.poe !== undefined) filters.poe = userRequirements.poe;
    if (userRequirements.vandalProof !== undefined) filters.vandalProof = userRequirements.vandalProof;

    const cameras = Object.keys(filters).length > 0
      ? dbQueries.searchCameras(filters)
      : dbQueries.getAllCameras();

    cameras.forEach(camera => {
      context += `**${camera.model}** (${camera.type})\n`;
      context += `- Auflösung: ${camera.resolution}\n`;
      context += `- Objektiv: ${camera.lens_type} ${camera.focal_length}\n`;
      context += `- IR-Reichweite: ${camera.ir_range_meters}m\n`;
      context += `- WDR: ${camera.wdr ? 'Ja' : 'Nein'} | Audio: ${camera.audio ? 'Ja' : 'Nein'} | PoE: ${camera.poe ? 'Ja' : 'Nein'}\n`;
      context += `- Schutzklasse: ${camera.ip_rating} | Temperatur: ${camera.temperature_range}\n`;
      context += `- Vandalensicher: ${camera.vandal_proof ? 'Ja (IK10)' : 'Nein'}\n`;
      if (camera.vca_features) {
        context += `- VCA Features: ${camera.vca_features}\n`;
      }
      context += `- Kompression: ${camera.compression}\n`;
      context += `- Einsatz: ${camera.indoor_outdoor}\n`;
      context += `- Preis: ${camera.price_range}\n`;
      context += `- ${camera.description}\n`;
      if (camera.use_cases) {
        context += `- Anwendungsfälle: ${camera.use_cases}\n`;
      }
      context += '\n';
    });

    // Füge Zubehör hinzu
    context += '\n**Verfügbares Kamera-Zubehör:**\n\n';
    const accessories = dbQueries.getAllAccessories();

    const accessoryTypes = {};
    accessories.forEach(acc => {
      if (!accessoryTypes[acc.type]) {
        accessoryTypes[acc.type] = [];
      }
      accessoryTypes[acc.type].push(acc);
    });

    Object.keys(accessoryTypes).forEach(type => {
      context += `\n*${type}:*\n`;
      accessoryTypes[type].forEach(acc => {
        context += `- **${acc.name}**: ${acc.description} (${acc.price_range})\n`;
      });
    });

    return context;
  }
};

export default cameraAdvisorConfig;
