-- Sample data for testing
-- Run this after schema.sql and distances.sql

-- Sample vehicles
INSERT INTO vehicles (name, spz, ownership, department, driver_name, acquisition_date, disposal_date, initial_km, current_km) VALUES
('Škoda Octavia', '1U1 2345', 'vlastní', 'Obchod', 'Jan Novák', '2023-01-15', NULL, 25000, 45000),
('VW Passat', '2U2 3456', 'leasing', 'Management', 'Petr Svoboda', '2022-06-01', NULL, 50000, 85000),
('Škoda Superb', '3U3 4567', 'vlastní', 'Technika', 'Martin Dvořák', '2021-03-20', NULL, 10000, 120000),
('Škoda Fabia', '4U4 5678', 'vlastní', 'Administrativa', 'Eva Černá', '2023-06-01', NULL, 0, 15000),
('Renault Megane', '5U5 6789', 'pronájem', 'Obchod', 'Jiří Kučera', '2024-01-01', NULL, 5000, 12000)
ON CONFLICT DO NOTHING;

-- Sample trips (will need valid vehicle_id - run after vehicles are inserted)
-- You can add trips through the application UI
