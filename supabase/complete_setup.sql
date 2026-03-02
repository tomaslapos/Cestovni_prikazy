-- =============================================================================
-- CESTOVNÍ PŘÍKAZY - KOMPLETNÍ DATABÁZOVÝ SETUP
-- Zkopírujte celý tento soubor do Supabase SQL Editoru a spusťte
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABULKY
-- =============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    spz TEXT UNIQUE NOT NULL,
    ownership TEXT NOT NULL DEFAULT 'vlastní',
    department TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    acquisition_date DATE NOT NULL,
    disposal_date DATE,
    initial_km INTEGER NOT NULL DEFAULT 0,
    current_km INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    driver_name TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    purpose TEXT NOT NULL DEFAULT 'služební',
    start_location TEXT NOT NULL,
    end_location TEXT NOT NULL,
    start_km INTEGER NOT NULL,
    end_km INTEGER NOT NULL,
    distance INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Distances table
CREATE TABLE IF NOT EXISTS distances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_city TEXT NOT NULL,
    end_city TEXT NOT NULL,
    distance_km INTEGER NOT NULL,
    travel_time_min INTEGER NOT NULL DEFAULT 60,
    UNIQUE(start_city, end_city)
);

-- Generator requests table
CREATE TABLE IF NOT EXISTS generator_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    total_km INTEGER NOT NULL,
    generated_km INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXY
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON trips(start_date);
CREATE INDEX IF NOT EXISTS idx_trips_driver_name ON trips(driver_name);
CREATE INDEX IF NOT EXISTS idx_vehicles_spz ON vehicles(spz);
CREATE INDEX IF NOT EXISTS idx_distances_cities ON distances(start_city, end_city);
CREATE INDEX IF NOT EXISTS idx_generator_requests_vehicle_id ON generator_requests(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_generator_requests_date_to ON generator_requests(date_to);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE distances ENABLE ROW LEVEL SECURITY;
ALTER TABLE generator_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read users" ON users;
DROP POLICY IF EXISTS "Allow public read vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow public read trips" ON trips;
DROP POLICY IF EXISTS "Allow public read distances" ON distances;
DROP POLICY IF EXISTS "Allow public insert vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow public update vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow public delete vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow public insert trips" ON trips;
DROP POLICY IF EXISTS "Allow public read generator_requests" ON generator_requests;
DROP POLICY IF EXISTS "Allow public insert generator_requests" ON generator_requests;
DROP POLICY IF EXISTS "Allow public update trips" ON trips;
DROP POLICY IF EXISTS "Allow public delete trips" ON trips;

-- Create new policies
CREATE POLICY "Allow public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public read trips" ON trips FOR SELECT USING (true);
CREATE POLICY "Allow public read distances" ON distances FOR SELECT USING (true);

CREATE POLICY "Allow public insert vehicles" ON vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update vehicles" ON vehicles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete vehicles" ON vehicles FOR DELETE USING (true);

CREATE POLICY "Allow public insert trips" ON trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update trips" ON trips FOR UPDATE USING (true);
CREATE POLICY "Allow public delete trips" ON trips FOR DELETE USING (true);

CREATE POLICY "Allow public read generator_requests" ON generator_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert generator_requests" ON generator_requests FOR INSERT WITH CHECK (true);

-- =============================================================================
-- UŽIVATELÉ
-- =============================================================================

INSERT INTO users (username, password_hash) VALUES ('lapos.tomas@gastrotechnogroup.cz', 'g@stro2026')
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;

INSERT INTO users (username, password_hash) VALUES ('tyna.vyravova', 'g@stro2026')
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- =============================================================================
-- VZDÁLENOSTI Z ÚSTÍ NAD LABEM (přesné km)
-- =============================================================================

INSERT INTO distances (start_city, end_city, distance_km, travel_time_min) VALUES
-- Krajská města (dálnice = rychlejší časy)
('Ústí nad Labem', 'Praha', 93, 65),
('Ústí nad Labem', 'Brno', 282, 175),
('Ústí nad Labem', 'Ostrava', 378, 240),
('Ústí nad Labem', 'Plzeň', 148, 105),
('Ústí nad Labem', 'Liberec', 87, 75),
('Ústí nad Labem', 'Olomouc', 308, 195),
('Ústí nad Labem', 'České Budějovice', 218, 160),
('Ústí nad Labem', 'Hradec Králové', 128, 100),
('Ústí nad Labem', 'Pardubice', 152, 110),
('Ústí nad Labem', 'Zlín', 338, 215),
('Ústí nad Labem', 'Jihlava', 208, 145),
('Ústí nad Labem', 'Karlovy Vary', 84, 70),

-- Ústecký kraj - okresní města a větší obce
('Ústí nad Labem', 'Děčín', 31, 30),
('Ústí nad Labem', 'Teplice', 18, 20),
('Ústí nad Labem', 'Most', 34, 30),
('Ústí nad Labem', 'Chomutov', 48, 40),
('Ústí nad Labem', 'Litoměřice', 24, 25),
('Ústí nad Labem', 'Louny', 43, 40),
('Ústí nad Labem', 'Roudnice nad Labem', 36, 30),
('Ústí nad Labem', 'Lovosice', 21, 22),
('Ústí nad Labem', 'Bílina', 23, 22),
('Ústí nad Labem', 'Litvínov', 38, 35),
('Ústí nad Labem', 'Kadaň', 58, 50),
('Ústí nad Labem', 'Žatec', 53, 48),
('Ústí nad Labem', 'Jirkov', 44, 38),
('Ústí nad Labem', 'Klášterec nad Ohří', 62, 52),
('Ústí nad Labem', 'Krupka', 12, 15),
('Ústí nad Labem', 'Duchcov', 26, 25),
('Ústí nad Labem', 'Osek', 29, 28),
('Ústí nad Labem', 'Podbořany', 63, 55),
('Ústí nad Labem', 'Rumburk', 54, 50),
('Ústí nad Labem', 'Varnsdorf', 62, 55),
('Ústí nad Labem', 'Šluknov', 58, 52),
('Ústí nad Labem', 'Benešov nad Ploučnicí', 38, 35),
('Ústí nad Labem', 'Česká Kamenice', 42, 40),
('Ústí nad Labem', 'Třebenice', 32, 30),
('Ústí nad Labem', 'Štětí', 28, 28),
('Ústí nad Labem', 'Povrly', 8, 10),
('Ústí nad Labem', 'Velké Březno', 6, 8),
('Ústí nad Labem', 'Chabařovice', 7, 10),
('Ústí nad Labem', 'Chlumec', 14, 15),

-- Středočeský kraj
('Ústí nad Labem', 'Kladno', 76, 60),
('Ústí nad Labem', 'Mladá Boleslav', 78, 65),
('Ústí nad Labem', 'Kolín', 114, 85),
('Ústí nad Labem', 'Kutná Hora', 128, 95),
('Ústí nad Labem', 'Mělník', 54, 45),
('Ústí nad Labem', 'Beroun', 98, 75),
('Ústí nad Labem', 'Příbram', 132, 100),
('Ústí nad Labem', 'Benešov', 126, 95),
('Ústí nad Labem', 'Nymburk', 94, 75),
('Ústí nad Labem', 'Rakovník', 78, 70),
('Ústí nad Labem', 'Slaný', 64, 50),
('Ústí nad Labem', 'Kralupy nad Vltavou', 56, 42),
('Ústí nad Labem', 'Neratovice', 62, 48),
('Ústí nad Labem', 'Brandýs nad Labem', 74, 58),
('Ústí nad Labem', 'Poděbrady', 98, 75),
('Ústí nad Labem', 'Říčany', 106, 80),
('Ústí nad Labem', 'Čáslav', 138, 105),
('Ústí nad Labem', 'Lysá nad Labem', 86, 68),
('Ústí nad Labem', 'Český Brod', 102, 78),
('Ústí nad Labem', 'Mnichovo Hradiště', 72, 62),
('Ústí nad Labem', 'Vlašim', 142, 110),
('Ústí nad Labem', 'Sedlčany', 138, 110),
('Ústí nad Labem', 'Dobříš', 118, 90),
('Ústí nad Labem', 'Hořovice', 104, 80),
('Ústí nad Labem', 'Votice', 148, 115),

-- Liberecký kraj
('Ústí nad Labem', 'Jablonec nad Nisou', 94, 80),
('Ústí nad Labem', 'Česká Lípa', 58, 50),
('Ústí nad Labem', 'Semily', 108, 90),
('Ústí nad Labem', 'Turnov', 98, 82),
('Ústí nad Labem', 'Nový Bor', 52, 45),
('Ústí nad Labem', 'Tanvald', 102, 88),
('Ústí nad Labem', 'Železný Brod', 96, 82),
('Ústí nad Labem', 'Jilemnice', 114, 95),
('Ústí nad Labem', 'Rokytnice nad Jizerou', 118, 100),
('Ústí nad Labem', 'Harrachov', 126, 110),
('Ústí nad Labem', 'Frýdlant', 96, 85),
('Ústí nad Labem', 'Hrádek nad Nisou', 92, 78),
('Ústí nad Labem', 'Zákupy', 54, 48),
('Ústí nad Labem', 'Mimoň', 64, 55),
('Ústí nad Labem', 'Doksy', 68, 58),

-- Královéhradecký kraj
('Ústí nad Labem', 'Trutnov', 148, 115),
('Ústí nad Labem', 'Náchod', 162, 125),
('Ústí nad Labem', 'Jičín', 108, 88),
('Ústí nad Labem', 'Rychnov nad Kněžnou', 168, 130),
('Ústí nad Labem', 'Dvůr Králové nad Labem', 134, 105),
('Ústí nad Labem', 'Vrchlabí', 138, 110),
('Ústí nad Labem', 'Jaroměř', 144, 110),
('Ústí nad Labem', 'Nová Paka', 118, 95),
('Ústí nad Labem', 'Hořice', 116, 92),
('Ústí nad Labem', 'Broumov', 178, 140),
('Ústí nad Labem', 'Špindlerův Mlýn', 152, 125),
('Ústí nad Labem', 'Pec pod Sněžkou', 158, 130),
('Ústí nad Labem', 'Dobruška', 168, 130),
('Ústí nad Labem', 'Nové Město nad Metují', 156, 122),
('Ústí nad Labem', 'Police nad Metují', 164, 130),
('Ústí nad Labem', 'Kostelec nad Orlicí', 172, 132),
('Ústí nad Labem', 'Hostinné', 142, 112),
('Ústí nad Labem', 'Chlumec nad Cidlinou', 104, 80),

-- Pardubický kraj
('Ústí nad Labem', 'Chrudim', 162, 120),
('Ústí nad Labem', 'Svitavy', 194, 145),
('Ústí nad Labem', 'Ústí nad Orlicí', 178, 135),
('Ústí nad Labem', 'Litomyšl', 186, 140),
('Ústí nad Labem', 'Vysoké Mýto', 172, 130),
('Ústí nad Labem', 'Přelouč', 138, 105),
('Ústí nad Labem', 'Holice', 156, 118),
('Ústí nad Labem', 'Lanškroun', 192, 148),
('Ústí nad Labem', 'Polička', 202, 155),
('Ústí nad Labem', 'Choceň', 174, 132),
('Ústí nad Labem', 'Moravská Třebová', 212, 160),
('Ústí nad Labem', 'Česká Třebová', 188, 142),
('Ústí nad Labem', 'Letohrad', 184, 140),
('Ústí nad Labem', 'Králíky', 208, 162),
('Ústí nad Labem', 'Žamberk', 186, 142),
('Ústí nad Labem', 'Hlinsko', 182, 140),

-- Karlovarský kraj
('Ústí nad Labem', 'Cheb', 128, 100),
('Ústí nad Labem', 'Sokolov', 104, 82),
('Ústí nad Labem', 'Mariánské Lázně', 114, 92),
('Ústí nad Labem', 'Františkovy Lázně', 132, 105),
('Ústí nad Labem', 'Aš', 152, 120),
('Ústí nad Labem', 'Ostrov', 74, 62),
('Ústí nad Labem', 'Kraslice', 116, 95),
('Ústí nad Labem', 'Chodov', 92, 75),
('Ústí nad Labem', 'Jáchymov', 82, 70),
('Ústí nad Labem', 'Nejdek', 86, 72),
('Ústí nad Labem', 'Horní Slavkov', 96, 80),
('Ústí nad Labem', 'Loket', 88, 72),
('Ústí nad Labem', 'Bečov nad Teplou', 94, 78),
('Ústí nad Labem', 'Toužim', 98, 82),
('Ústí nad Labem', 'Habartov', 108, 88),
('Ústí nad Labem', 'Kynšperk nad Ohří', 102, 82),

-- Plzeňský kraj
('Ústí nad Labem', 'Klatovy', 188, 140),
('Ústí nad Labem', 'Domažlice', 178, 135),
('Ústí nad Labem', 'Tachov', 138, 110),
('Ústí nad Labem', 'Rokycany', 128, 95),
('Ústí nad Labem', 'Sušice', 198, 155),
('Ústí nad Labem', 'Horažďovice', 192, 150),
('Ústí nad Labem', 'Stod', 156, 118),
('Ústí nad Labem', 'Stříbro', 136, 105),
('Ústí nad Labem', 'Planá', 142, 110),
('Ústí nad Labem', 'Nýřany', 148, 112),
('Ústí nad Labem', 'Přeštice', 164, 125),
('Ústí nad Labem', 'Kdyně', 172, 132),
('Ústí nad Labem', 'Blovice', 162, 125),
('Ústí nad Labem', 'Nepomuk', 172, 132),
('Ústí nad Labem', 'Horšovský Týn', 168, 130),
('Ústí nad Labem', 'Kralovice', 118, 95),

-- Jihočeský kraj
('Ústí nad Labem', 'Tábor', 178, 125),
('Ústí nad Labem', 'Písek', 198, 148),
('Ústí nad Labem', 'Strakonice', 208, 155),
('Ústí nad Labem', 'Prachatice', 248, 185),
('Ústí nad Labem', 'Český Krumlov', 258, 195),
('Ústí nad Labem', 'Jindřichův Hradec', 228, 170),
('Ústí nad Labem', 'Třeboň', 232, 175),
('Ústí nad Labem', 'Soběslav', 192, 142),
('Ústí nad Labem', 'Blatná', 196, 150),
('Ústí nad Labem', 'Týn nad Vltavou', 204, 155),
('Ústí nad Labem', 'Milevsko', 188, 142),
('Ústí nad Labem', 'Vimperk', 238, 180),
('Ústí nad Labem', 'Volary', 262, 200),
('Ústí nad Labem', 'Dačice', 242, 185),
('Ústí nad Labem', 'Veselí nad Lužnicí', 214, 160),
('Ústí nad Labem', 'Kaplice', 248, 188),
('Ústí nad Labem', 'Vyšší Brod', 268, 205),
('Ústí nad Labem', 'Nové Hrady', 252, 192),
('Ústí nad Labem', 'Trhové Sviny', 238, 180),
('Ústí nad Labem', 'Lomnice nad Lužnicí', 226, 170),

-- Vysočina
('Ústí nad Labem', 'Havlíčkův Brod', 174, 128),
('Ústí nad Labem', 'Pelhřimov', 188, 140),
('Ústí nad Labem', 'Žďár nad Sázavou', 208, 155),
('Ústí nad Labem', 'Třebíč', 238, 175),
('Ústí nad Labem', 'Humpolec', 172, 118),
('Ústí nad Labem', 'Velké Meziříčí', 224, 165),
('Ústí nad Labem', 'Světlá nad Sázavou', 162, 122),
('Ústí nad Labem', 'Chotěboř', 178, 135),
('Ústí nad Labem', 'Bystřice nad Pernštejnem', 218, 165),
('Ústí nad Labem', 'Telč', 232, 175),
('Ústí nad Labem', 'Moravské Budějovice', 252, 190),
('Ústí nad Labem', 'Nové Město na Moravě', 214, 162),
('Ústí nad Labem', 'Náměšť nad Oslavou', 244, 182),
('Ústí nad Labem', 'Pacov', 182, 138),
('Ústí nad Labem', 'Počátky', 196, 148),
('Ústí nad Labem', 'Ledeč nad Sázavou', 158, 120),
('Ústí nad Labem', 'Golčův Jeníkov', 152, 115),

-- Jihomoravský kraj
('Ústí nad Labem', 'Znojmo', 278, 195),
('Ústí nad Labem', 'Břeclav', 308, 195),
('Ústí nad Labem', 'Hodonín', 318, 205),
('Ústí nad Labem', 'Vyškov', 288, 180),
('Ústí nad Labem', 'Blansko', 264, 170),
('Ústí nad Labem', 'Boskovice', 274, 178),
('Ústí nad Labem', 'Tišnov', 268, 175),
('Ústí nad Labem', 'Kuřim', 272, 175),
('Ústí nad Labem', 'Slavkov u Brna', 292, 185),
('Ústí nad Labem', 'Ivančice', 284, 185),
('Ústí nad Labem', 'Pohořelice', 294, 190),
('Ústí nad Labem', 'Hustopeče', 302, 195),
('Ústí nad Labem', 'Kyjov', 322, 210),
('Ústí nad Labem', 'Veselí nad Moravou', 326, 215),
('Ústí nad Labem', 'Mikulov', 312, 200),
('Ústí nad Labem', 'Valtice', 314, 202),
('Ústí nad Labem', 'Lednice', 312, 200),
('Ústí nad Labem', 'Židlochovice', 288, 185),
('Ústí nad Labem', 'Rosice', 274, 180),
('Ústí nad Labem', 'Letovice', 262, 175),
('Ústí nad Labem', 'Velká nad Veličkou', 334, 220),
('Ústí nad Labem', 'Strážnice', 328, 215),
('Ústí nad Labem', 'Bučovice', 298, 192),
('Ústí nad Labem', 'Oslavany', 278, 182),
('Ústí nad Labem', 'Modřice', 282, 178),

-- Olomoucký kraj
('Ústí nad Labem', 'Prostějov', 294, 188),
('Ústí nad Labem', 'Přerov', 318, 200),
('Ústí nad Labem', 'Šumperk', 278, 195),
('Ústí nad Labem', 'Jeseník', 308, 225),
('Ústí nad Labem', 'Hranice', 332, 210),
('Ústí nad Labem', 'Zábřeh', 268, 188),
('Ústí nad Labem', 'Mohelnice', 262, 182),
('Ústí nad Labem', 'Litovel', 298, 195),
('Ústí nad Labem', 'Šternberk', 302, 198),
('Ústí nad Labem', 'Uničov', 296, 195),
('Ústí nad Labem', 'Kojetín', 314, 202),
('Ústí nad Labem', 'Lipník nad Bečvou', 326, 210),
('Ústí nad Labem', 'Zlaté Hory', 322, 238),
('Ústí nad Labem', 'Javorník', 324, 240),
('Ústí nad Labem', 'Hanušovice', 288, 205),

-- Zlínský kraj
('Ústí nad Labem', 'Kroměříž', 328, 210),
('Ústí nad Labem', 'Uherské Hradiště', 348, 225),
('Ústí nad Labem', 'Vsetín', 368, 240),
('Ústí nad Labem', 'Uherský Brod', 358, 235),
('Ústí nad Labem', 'Valašské Meziříčí', 362, 235),
('Ústí nad Labem', 'Rožnov pod Radhoštěm', 372, 245),
('Ústí nad Labem', 'Holešov', 334, 218),
('Ústí nad Labem', 'Otrokovice', 338, 218),
('Ústí nad Labem', 'Napajedla', 342, 220),
('Ústí nad Labem', 'Staré Město', 352, 228),
('Ústí nad Labem', 'Luhačovice', 358, 235),
('Ústí nad Labem', 'Bystřice pod Hostýnem', 348, 228),
('Ústí nad Labem', 'Vizovice', 356, 232),
('Ústí nad Labem', 'Slavičín', 364, 240),
('Ústí nad Labem', 'Valašské Klobouky', 372, 245),
('Ústí nad Labem', 'Brumov-Bylnice', 378, 250),

-- Moravskoslezský kraj
('Ústí nad Labem', 'Opava', 388, 245),
('Ústí nad Labem', 'Karviná', 398, 255),
('Ústí nad Labem', 'Frýdek-Místek', 392, 250),
('Ústí nad Labem', 'Nový Jičín', 368, 235),
('Ústí nad Labem', 'Bruntál', 348, 240),
('Ústí nad Labem', 'Havířov', 394, 252),
('Ústí nad Labem', 'Třinec', 408, 262),
('Ústí nad Labem', 'Orlová', 396, 255),
('Ústí nad Labem', 'Český Těšín', 404, 260),
('Ústí nad Labem', 'Kopřivnice', 372, 238),
('Ústí nad Labem', 'Bohumín', 392, 250),
('Ústí nad Labem', 'Krnov', 358, 248),
('Ústí nad Labem', 'Hlučín', 386, 245),
('Ústí nad Labem', 'Bílovec', 374, 240),
('Ústí nad Labem', 'Studénka', 376, 242),
('Ústí nad Labem', 'Frenštát pod Radhoštěm', 378, 245),
('Ústí nad Labem', 'Příbor', 374, 240),
('Ústí nad Labem', 'Fulnek', 366, 235),
('Ústí nad Labem', 'Odry', 362, 235),
('Ústí nad Labem', 'Vítkov', 356, 240),
('Ústí nad Labem', 'Rýmařov', 342, 242),
('Ústí nad Labem', 'Jablunkov', 418, 270),
('Ústí nad Labem', 'Frýdlant nad Ostravicí', 386, 250),
('Ústí nad Labem', 'Vratimov', 382, 245),
('Ústí nad Labem', 'Šenov', 388, 248),
('Ústí nad Labem', 'Petřvald', 392, 252),

-- Další významná města Praha a okolí
('Ústí nad Labem', 'Roztoky', 84, 60),
('Ústí nad Labem', 'Černošice', 94, 68),
('Ústí nad Labem', 'Hostivice', 86, 62),
('Ústí nad Labem', 'Rudná', 92, 66),
('Ústí nad Labem', 'Unhošť', 82, 60),
('Ústí nad Labem', 'Klecany', 72, 55),
('Ústí nad Labem', 'Odolena Voda', 68, 52),
('Ústí nad Labem', 'Úvaly', 98, 72),
('Ústí nad Labem', 'Jesenice', 104, 78),
('Ústí nad Labem', 'Průhonice', 102, 75),
('Ústí nad Labem', 'Čelákovice', 82, 62)

ON CONFLICT (start_city, end_city) DO UPDATE SET distance_km = EXCLUDED.distance_km, travel_time_min = EXCLUDED.travel_time_min;

-- =============================================================================
-- UKÁZKOVÁ VOZIDLA
-- =============================================================================

INSERT INTO vehicles (name, spz, ownership, department, driver_name, acquisition_date, disposal_date, initial_km, current_km) VALUES
('Škoda Octavia', '1U1 2345', 'vlastní', 'Obchod', 'Jan Novák', '2023-01-15', NULL, 25000, 45000),
('VW Passat', '2U2 3456', 'leasing', 'Management', 'Petr Svoboda', '2022-06-01', NULL, 50000, 85000),
('Škoda Superb', '3U3 4567', 'vlastní', 'Technika', 'Martin Dvořák', '2021-03-20', NULL, 10000, 120000),
('Škoda Fabia', '4U4 5678', 'vlastní', 'Administrativa', 'Eva Černá', '2023-06-01', NULL, 0, 15000),
('Renault Megane', '5U5 6789', 'pronájem', 'Obchod', 'Jiří Kučera', '2024-01-01', NULL, 5000, 12000)
ON CONFLICT (spz) DO NOTHING;

-- =============================================================================
-- HOTOVO!
-- =============================================================================
-- Přihlašovací údaje:
-- Email: lapos.tomas@gastrotechnogroup.cz
-- Heslo: g@stro2026
-- =============================================================================
