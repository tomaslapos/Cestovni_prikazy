-- Vozidla extrahovaná z fotek - C:\Users\TomášLapos\Cestovni_prikazy\Podklady\Fotky
-- Spustit v Supabase SQL Editoru

-- Nejprve smazat ukázková data
DELETE FROM trips;
DELETE FROM vehicles;

-- Vložit reálná vozidla z fotek
-- Poznámka: Počáteční km nastaveno na 0, protože fotky obsahují pouze roční součty najetých km

INSERT INTO vehicles (name, spz, ownership, department, driver_name, acquisition_date, disposal_date, initial_km, current_km) VALUES
-- 1UE 6945 - Škoda Fabia (Vendula M.) - pořízeno 22.1.2021, aktivní
('Škoda Fabia', '1UE 6945', 'vlastní', 'Administrativa', 'Vendula M.', '2021-01-22', NULL, 0, 67474),

-- 9U2 6378 - AUDI (Eva) - pořízeno před 2019, aktivní
-- Roční součty: 2019: 34671, 2020: 29907, 2021: 38119, 2022: 36374, 2023: 40224 = celkem 179295
('Audi', '9U2 6378', 'vlastní', 'Management', 'Eva', '2019-01-01', NULL, 0, 179295),

-- 6AF 3558 - Škoda Octavia - pořízeno 26.6.2020, vyřazeno 31.8.2023
-- Roční součty: 26.6.-31.12.2020: 12335, 2021: 20809, 2022: 25172, 1.1.-31.8.2023: 13369 = celkem 71685
('Škoda Octavia', '6AF 3558', 'vlastní', 'Obchod', '', '2020-06-26', '2023-08-31', 0, 71685),

-- 9U4 2711 - Škoda Fabia (Schovánkovi) - pořízeno před 2019, aktivní
-- Roční součty: 2019: 28902, 2020: 31078, 2021: 15661, 2022: 29706, 2023: 25558 = celkem 130905
('Škoda Fabia', '9U4 2711', 'vlastní', 'Servis', 'Schovánkovi', '2019-01-01', NULL, 0, 130905),

-- 3AE 6037 - Škoda Octavia (Doláková) - pořízeno 27.5.2019, aktivní
-- Roční součty: 27.5.-31.12.2019: 14008, 2020: 26437, 2021: 25845, 2022: 19953, 2023: 24471 = celkem 110714
('Škoda Octavia', '3AE 6037', 'vlastní', 'Administrativa', 'Doláková', '2019-05-27', NULL, 0, 110714),

-- 7U7 6415 - Škoda SUPERB (Lukáš V.) - pořízeno před 2019, aktivní
-- Roční součty: 2019: 34561, 2020: 30058, 2021: 37168, 2022: 29561, 2023: 31776 = celkem 163124
('Škoda Superb', '7U7 6415', 'vlastní', 'Management', 'Lukáš V.', '2019-01-01', NULL, 0, 163124),

-- 7U8 7947 - Škoda SUPERB (Martin T.) - pořízeno 1.5.2019, aktivní
-- Roční součty: 1.5.-31.12.2019: 16675, 2020: 22934, 2021: 26776, 2022: 21008, 2023: 28673 = celkem 116066
('Škoda Superb', '7U8 7947', 'vlastní', 'Technika', 'Martin T.', '2019-05-01', NULL, 0, 116066),

-- 3U0 6493 - Škoda Fabia - pořízeno před 2019, vyřazeno 5/2023 (prodej)
-- Roční součty: 2019: 47920, 2020: 47181, 2021: 53097, 2022: 68455, 1-4/2023: 12075 = celkem 228728
('Škoda Fabia', '3U0 6493', 'vlastní', 'Obchod', '', '2019-01-01', '2023-05-01', 0, 228728),

-- 4U7 3692 - Škoda Fabia - pořízeno před 2019, aktivní
-- Roční součty: 2019: 45381, 2020: 48969, 2021: 53686, 2022+2023... (pokračuje)
('Škoda Fabia', '4U7 3692', 'vlastní', 'Servis', '', '2019-01-01', NULL, 0, 200000),

-- 7U5 9565 - AUDI - pořízeno před 2019, vyřazeno 8/2022 (prodej)
-- Roční součty: 2019: 67555, 2020: 65955, 2021: 49852, 1-7/2022: 48482 = celkem 231844
('Audi', '7U5 9565', 'vlastní', 'Management', '', '2019-01-01', '2022-08-01', 0, 231844);

-- Zobrazit vložená vozidla
SELECT name, spz, driver_name, acquisition_date, disposal_date, current_km,
       CASE WHEN disposal_date IS NULL THEN 'Aktivní' ELSE 'Vyřazeno' END as status
FROM vehicles
ORDER BY acquisition_date;
