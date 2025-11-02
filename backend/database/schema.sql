-- Tabelle für NVR/DVR Rekorder
CREATE TABLE IF NOT EXISTS recorders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK(type IN ('NVR', 'DVR')),
    max_channels INTEGER NOT NULL,
    max_resolution VARCHAR(50),
    storage_bays INTEGER,
    max_storage_tb INTEGER,
    recording_modes TEXT, -- JSON: permanent, motion, contact, analytics
    vca_support BOOLEAN DEFAULT 0,
    alarm_output INTEGER DEFAULT 0,
    alarm_input INTEGER DEFAULT 0,
    network_bandwidth_mbps INTEGER,
    app_notification BOOLEAN DEFAULT 0,
    control_center_integration BOOLEAN DEFAULT 0,
    poe_ports INTEGER DEFAULT 0,
    price_range VARCHAR(50),
    description TEXT,
    features TEXT -- JSON array
);

-- Tabelle für Kameras
CREATE TABLE IF NOT EXISTS cameras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50), -- Dome, Bullet, PTZ, Fisheye, Box
    resolution VARCHAR(50),
    sensor_type VARCHAR(50),
    lens_type VARCHAR(50), -- Fixed, Varifocal, Motorized
    focal_length VARCHAR(50),
    ir_range_meters INTEGER,
    wdr BOOLEAN DEFAULT 0,
    audio BOOLEAN DEFAULT 0,
    poe BOOLEAN DEFAULT 0,
    ip_rating VARCHAR(10),
    temperature_range VARCHAR(50),
    vandal_proof BOOLEAN DEFAULT 0,
    vca_features TEXT, -- JSON: line crossing, intrusion, face detection, ANPR
    compression VARCHAR(50), -- H.265+, H.264+
    price_range VARCHAR(50),
    indoor_outdoor VARCHAR(20),
    description TEXT,
    use_cases TEXT -- JSON array
);

-- Tabelle für Kamera-Zubehör
CREATE TABLE IF NOT EXISTS camera_accessories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50), -- Mount, Housing, Power, Cable
    compatible_cameras TEXT, -- JSON array oder 'universal'
    price_range VARCHAR(50),
    description TEXT
);

-- Tabelle für VMS (Video Management System)
CREATE TABLE IF NOT EXISTS vms_systems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50), -- HikCentral, iVMS, Free Software
    max_cameras INTEGER,
    max_storage_tb INTEGER,
    features TEXT, -- JSON: analytics, access control, alarm management
    cloud_support BOOLEAN DEFAULT 0,
    mobile_app BOOLEAN DEFAULT 0,
    price_range VARCHAR(50),
    license_model VARCHAR(100),
    description TEXT
);

-- Tabelle für Netzwerktechnik
CREATE TABLE IF NOT EXISTS network_equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50), -- Switch, Router, Firewall, Access Point
    port_count INTEGER,
    poe_ports INTEGER DEFAULT 0,
    poe_budget_watts INTEGER,
    poe_standard VARCHAR(50), -- 802.3af, 802.3at, 802.3bt
    managed BOOLEAN DEFAULT 0,
    throughput_gbps DECIMAL(10,2),
    price_range VARCHAR(50),
    description TEXT,
    features TEXT -- JSON
);

-- Beispieldaten für NVR/DVR
INSERT INTO recorders (model, type, max_channels, max_resolution, storage_bays, max_storage_tb, recording_modes, vca_support, alarm_output, alarm_input, network_bandwidth_mbps, app_notification, control_center_integration, poe_ports, price_range, description, features) VALUES
('DS-7604NI-K1/4P', 'NVR', 4, '8MP (4K)', 1, 6, '["permanent", "motion", "contact", "analytics"]', 1, 1, 1, 80, 1, 1, 4, '200-300 EUR', '4-Kanal NVR mit PoE, ideal für kleine Installationen', '["4K Recording", "PoE", "VCA", "Hik-Connect"]'),
('DS-7608NI-K2/8P', 'NVR', 8, '8MP (4K)', 2, 12, '["permanent", "motion", "contact", "analytics"]', 1, 2, 2, 160, 1, 1, 8, '400-600 EUR', '8-Kanal NVR mit PoE für mittlere Systeme', '["4K Recording", "8x PoE", "VCA", "Dual HDD", "HDMI 4K"]'),
('DS-7616NI-K2/16P', 'NVR', 16, '8MP (4K)', 2, 20, '["permanent", "motion", "contact", "analytics"]', 1, 4, 4, 256, 1, 1, 16, '700-1000 EUR', '16-Kanal NVR mit PoE für größere Installationen', '["4K Recording", "16x PoE", "VCA", "Dual HDD", "Alarm I/O"]'),
('DS-7732NI-K4', 'NVR', 32, '12MP', 4, 40, '["permanent", "motion", "contact", "analytics"]', 1, 4, 16, 320, 1, 1, 0, '1500-2000 EUR', 'High-End 32-Kanal NVR für große Systeme', '["12MP Recording", "VCA", "4x HDD", "Redundant Power", "RAID"]'),
('iDS-7716NXI-I4/16P/S', 'NVR', 16, '12MP', 4, 40, '["permanent", "motion", "contact", "analytics"]', 1, 4, 4, 320, 1, 1, 16, '2000-3000 EUR', 'DeepinMind NVR mit KI-basierter Videoanalyse', '["Deep Learning", "Face Recognition", "ANPR", "16x PoE", "4x HDD"]'),
('DS-7204HQHI-K1', 'DVR', 4, '4MP Lite', 1, 6, '["permanent", "motion", "contact"]', 0, 1, 1, 0, 1, 1, 0, '100-200 EUR', '4-Kanal HD-TVI DVR für analoge Kameras', '["HD-TVI", "AHD", "Analog", "IP Support"]'),
('DS-7208HQHI-K1', 'DVR', 8, '4MP Lite', 1, 10, '["permanent", "motion", "contact"]', 0, 1, 1, 0, 1, 1, 0, '200-300 EUR', '8-Kanal HD-TVI DVR', '["HD-TVI", "AHD", "Analog", "IP Support", "Smart Search"]'),
('DS-7216HQHI-K2', 'DVR', 16, '4MP Lite', 2, 20, '["permanent", "motion", "contact", "analytics"]', 1, 2, 4, 0, 1, 1, 0, '400-600 EUR', '16-Kanal Turbo HD DVR', '["HD-TVI", "VCA", "Dual HDD", "Smart Playback"]');

-- Beispieldaten für Kameras
INSERT INTO cameras (model, type, resolution, sensor_type, lens_type, focal_length, ir_range_meters, wdr, audio, poe, ip_rating, temperature_range, vandal_proof, vca_features, compression, price_range, indoor_outdoor, description, use_cases) VALUES
('DS-2CD2385G1-I', 'Dome', '8MP (4K)', '1/2.5" CMOS', 'Fixed', '2.8mm, 4mm, 6mm', 30, 1, 0, 1, 'IP67', '-30°C bis +60°C', 1, '["line crossing", "intrusion", "region entrance/exit"]', 'H.265+', '150-200 EUR', 'Outdoor', 'Turret Dome 4K Kamera mit IR, ideal für Außenbereich', '["Eingangsbereiche", "Parkplätze", "Gebäudeaußenseiten"]'),
('DS-2CD2385FWD-I', 'Dome', '8MP (4K)', '1/2.5" CMOS', 'Fixed', '2.8mm, 4mm', 30, 1, 0, 1, 'IP67', '-30°C bis +60°C', 1, '["line crossing", "intrusion"]', 'H.265+', '120-180 EUR', 'Outdoor', 'Kompakte 4K Turret Dome', '["Allgemeine Überwachung", "Retail", "Büros"]'),
('DS-2CD2T85G1-I8', 'Bullet', '8MP (4K)', '1/2.5" CMOS', 'Fixed', '2.8mm, 4mm', 80, 1, 0, 1, 'IP67', '-30°C bis +60°C', 0, '["line crossing", "intrusion", "region entrance/exit"]', 'H.265+', '200-280 EUR', 'Outdoor', 'Bullet 4K mit 80m IR-Reichweite', '["Weitläufige Bereiche", "Parkplätze", "Perimeter"]'),
('DS-2DE4425IW-DE', 'PTZ', '4MP', '1/2.8" CMOS', 'Motorized', '4.8-120mm (25x)', 100, 1, 1, 1, 'IP66', '-30°C bis +65°C', 1, '["auto tracking", "intrusion", "line crossing"]', 'H.265+', '800-1200 EUR', 'Outdoor', 'PTZ Dome mit 25x Zoom und Auto-Tracking', '["Große Flächen", "Bahnhöfe", "Stadien", "Industrieanlagen"]'),
('DS-2DE3304W-DE', 'PTZ', '3MP', '1/3" CMOS', 'Motorized', '2.8-12mm (4x)', 30, 1, 1, 1, 'IP66', '-30°C bis +60°C', 1, '["intrusion", "line crossing"]', 'H.265', '400-600 EUR', 'Outdoor', 'Kompakte Mini PTZ mit 4x Zoom', '["Eingänge", "Rezeptionen", "Kleinere Flächen"]'),
('DS-2CD2386G2-ISU/SL', 'Dome', '8MP (4K)', '1/2.8" CMOS', 'Fixed', '2.8mm, 4mm', 30, 1, 1, 1, 'IP67', '-30°C bis +60°C', 1, '["face detection", "intrusion", "line crossing", "strobe light", "audio alarm"]', 'H.265+', '250-350 EUR', 'Outdoor', 'AcuSense Dome mit Alarm-Licht und Audio', '["Abschreckung", "Perimeter", "Kritische Bereiche"]'),
('DS-2CD2387G2-LSU/SL', 'Dome', '8MP (4K)', '1/2.8" CMOS', 'Fixed', '2.8mm, 4mm', 40, 1, 1, 1, 'IP67', '-30°C bis +60°C', 1, '["person detection", "vehicle detection", "strobe light", "audio alarm"]', 'ColorVu H.265+', '350-450 EUR', 'Outdoor', 'ColorVu Dome mit Farbbildern bei Nacht', '["Nachtsicht in Farbe", "Perimeter", "Parkplätze"]'),
('DS-2CD2347G2-LU', 'Dome', '4MP', '1/2.8" CMOS', 'Fixed', '2.8mm, 4mm', 40, 1, 1, 1, 'IP67', '-30°C bis +60°C', 1, '["person detection", "vehicle detection"]', 'ColorVu H.265+', '200-280 EUR', 'Outdoor', 'ColorVu Turret 4MP mit weißem Licht', '["Parkplätze", "Eingänge mit Nachtbetrieb"]'),
('DS-2CD2185G1-IS', 'Dome', '8MP (4K)', '1/2.5" CMOS', 'Fixed', '2.8mm, 4mm', 30, 1, 1, 1, 'IP67', '-30°C bis +60°C', 1, '["intrusion", "line crossing", "audio exception"]', 'H.265+', '180-250 EUR', 'Outdoor', 'Turret mit Audio und erweiterten VCA', '["Gebäudeüberwachung", "Kritische Zonen"]'),
('DS-2CD2T87G2-L', 'Bullet', '8MP (4K)', '1/2.8" CMOS', 'Fixed', '4mm', 60, 1, 1, 1, 'IP67', '-30°C bis +60°C', 0, '["person detection", "vehicle detection"]', 'ColorVu H.265+', '300-400 EUR', 'Outdoor', 'ColorVu Bullet mit 60m Reichweite', '["Große Parkplätze", "Straßenüberwachung"]'),
('DS-2CD6365G0E-IVS', 'Fisheye', '6MP', '1/2.7" CMOS', 'Fisheye', '1.27mm', 15, 0, 1, 1, 'IP67', '-30°C bis +60°C', 1, '["people counting", "heat map", "intrusion"]', 'H.265+', '400-600 EUR', 'Indoor/Outdoor', '360° Fisheye mit People Counting', '["Retail Analytics", "Große Hallen", "360° Übersicht"]'),
('DS-2CD2T46G2-4I', 'Bullet', '4MP', '1/2.8" CMOS', 'Fixed', '2.8mm, 4mm', 80, 1, 0, 1, 'IP67', '-30°C bis +60°C', 0, '["person detection", "vehicle detection"]', 'AcuSense H.265+', '180-250 EUR', 'Outdoor', 'AcuSense Bullet mit 80m IR', '["Perimeter", "Weitläufige Bereiche"]'),
('DS-2CD2386G2-IU', 'Dome', '8MP (4K)', '1/2.8" CMOS', 'Fixed', '2.8mm', 30, 1, 1, 1, 'IP67', '-30°C bis +60°C', 1, '["person detection", "vehicle detection"]', 'AcuSense H.265+', '220-300 EUR', 'Outdoor', 'AcuSense Turret mit integriertem Mikrofon', '["Büros", "Retail", "Industrie"]');

-- Beispieldaten für Kamera-Zubehör
INSERT INTO camera_accessories (name, type, compatible_cameras, price_range, description) VALUES
('DS-1280ZJ-S', 'Mount', 'universal', '15-25 EUR', 'Wandhalterung aus Aluminiumlegierung für Dome-Kameras'),
('DS-1273ZJ-140', 'Mount', 'universal', '30-45 EUR', 'Eckmontagehalterung für Dome und Bullet'),
('DS-1280ZJ-DM27', 'Mount', 'universal', '40-60 EUR', 'Deckenmontage-Adapter mit Kabelmanagement'),
('DS-1602ZJ', 'Mount', '["PTZ"]', '80-120 EUR', 'Wandhalterung für PTZ-Kameras'),
('DS-1280ZJ-PT', 'Mount', '["PTZ"]', '120-180 EUR', 'Pfahlmontage für PTZ bis 5kg'),
('DS-1331HZ', 'Housing', 'universal', '150-250 EUR', 'Outdoor-Gehäuse mit Heizung und Lüfter'),
('DS-1602ZJ-BOX', 'Housing', '["Box Cameras"]', '100-150 EUR', 'Wetterschutzgehäuse für Box-Kameras'),
('DS-1H34', 'Power', 'universal', '15-25 EUR', '12V DC Netzteil 1A für Kameras ohne PoE'),
('DS-KAW60-2N', 'Power', 'universal', '40-60 EUR', '24V AC/DC Netzteil für mehrere Geräte'),
('HiWatch HWI-PMS4800-HP', 'Power', 'universal', '300-450 EUR', 'PoE Switch 8-Port mit 120W Budget'),
('CAT6 Outdoor Cable 305m', 'Cable', 'universal', '120-180 EUR', 'Outdoor CAT6 Kabel, wasserfest'),
('DS-1LN6-UE', 'Cable', 'universal', '150-200 EUR', 'CAT6 UTP Kabel 305m Box'),
('DS-1LN6-PE', 'Cable', 'universal', '180-250 EUR', 'CAT6 PE Outdoor Kabel 305m');

-- Beispieldaten für VMS
INSERT INTO vms_systems (name, type, max_cameras, max_storage_tb, features, cloud_support, mobile_app, price_range, license_model, description) VALUES
('Hik-Connect', 'Cloud', 256, 100, '["remote access", "push notifications", "basic analytics", "alarm management"]', 1, 1, 'Kostenlos - 50 EUR/Monat', 'Freemium/Abo', 'Cloud-basierte Verwaltung für kleine bis mittlere Systeme'),
('iVMS-4200', 'Free Software', 64, 0, '["live view", "playback", "PTZ control", "alarm management", "e-map"]', 0, 0, 'Kostenlos', 'Freeware', 'Kostenlose Client-Software für lokale Verwaltung'),
('HikCentral Professional', 'Enterprise', 256, 500, '["video management", "access control", "alarm center", "reporting", "VCA analytics"]', 1, 1, '500-2000 EUR', 'Lizenz pro Kanal', 'Professionelle VMS-Lösung für mittlere Unternehmen'),
('HikCentral Enterprise', 'Enterprise', 10000, 5000, '["video wall", "access control", "intrusion alarm", "VCA", "ANPR", "face recognition", "traffic management"]', 1, 1, '5000-50000 EUR', 'Modulare Lizenzierung', 'Enterprise VMS für große Installationen'),
('IVMS-5200', 'Enterprise', 1024, 1000, '["distributed architecture", "video wall", "GIS map", "advanced analytics", "redundancy"]', 1, 1, '3000-15000 EUR', 'Lizenz pro Kanal', 'Skalierbare Lösung für größere Projekte');

-- Beispieldaten für Netzwerktechnik
INSERT INTO network_equipment (model, type, port_count, poe_ports, poe_budget_watts, poe_standard, managed, throughput_gbps, price_range, description, features) VALUES
('DS-3E0105P-E', 'Switch', 5, 4, 58, '802.3af/at', 0, 1.0, '50-80 EUR', 'Unmanaged PoE Switch 4-Port + 1 Uplink', '["Plug & Play", "65W Budget", "Desktop"]'),
('DS-3E0109P-E', 'Switch', 9, 8, 123, '802.3af/at', 0, 1.0, '120-180 EUR', 'Unmanaged PoE Switch 8-Port + 1 Uplink', '["Plug & Play", "123W Budget", "Rackmount"]'),
('DS-3E0318P-E', 'Switch', 18, 16, 230, '802.3af/at', 1, 4.0, '300-450 EUR', 'Smart Managed PoE Switch 16-Port + 2 Uplink', '["VLAN", "QoS", "230W Budget", "Web Management"]'),
('DS-3E0326P-E', 'Switch', 26, 24, 370, '802.3af/at/bt', 1, 8.0, '600-900 EUR', 'L2+ Managed PoE Switch 24-Port + 2 SFP', '["802.3bt PoE++", "370W", "Layer 2+", "CLI Management"]'),
('DS-3E1326P-EI', 'Switch', 26, 24, 370, '802.3af/at/bt', 1, 52.0, '1200-1800 EUR', 'Layer 3 Managed Switch mit High PoE', '["Layer 3 Routing", "PoE++", "Redundant Power", "10G Uplinks"]'),
('DS-3E0310P-E', 'Switch', 10, 8, 123, '802.3af/at', 1, 2.0, '180-250 EUR', 'Smart Managed PoE Switch 8-Port + 2 Combo', '["VLAN", "QoS", "Port Mirroring", "Web/CLI"]'),
('DS-3E1510P-SI', 'Switch', 10, 8, 240, '802.3af/at/bt', 1, 20.0, '800-1200 EUR', 'L2+ Switch mit PoE++ für anspruchsvolle Kameras', '["High Power PoE", "Ring Network", "ERPS"]');
