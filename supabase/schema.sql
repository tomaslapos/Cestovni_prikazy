-- Cestovní příkazy - Database Schema
-- Run this script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Distances table (for calculating km between cities)
CREATE TABLE IF NOT EXISTS distances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_city TEXT NOT NULL,
    end_city TEXT NOT NULL,
    distance_km INTEGER NOT NULL,
    UNIQUE(start_city, end_city)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON trips(start_date);
CREATE INDEX IF NOT EXISTS idx_trips_driver_name ON trips(driver_name);
CREATE INDEX IF NOT EXISTS idx_vehicles_spz ON vehicles(spz);
CREATE INDEX IF NOT EXISTS idx_distances_cities ON distances(start_city, end_city);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE distances ENABLE ROW LEVEL SECURITY;

-- Policies for public read access (after login verification in app)
CREATE POLICY "Allow public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public read trips" ON trips FOR SELECT USING (true);
CREATE POLICY "Allow public read distances" ON distances FOR SELECT USING (true);

-- Policies for insert/update/delete
CREATE POLICY "Allow public insert vehicles" ON vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update vehicles" ON vehicles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete vehicles" ON vehicles FOR DELETE USING (true);

CREATE POLICY "Allow public insert trips" ON trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update trips" ON trips FOR UPDATE USING (true);
CREATE POLICY "Allow public delete trips" ON trips FOR DELETE USING (true);

-- Insert default user
INSERT INTO users (username, password_hash) VALUES ('lapos.tomas@gastrotechnogroup.cz', 'g@stro2026')
ON CONFLICT (username) DO NOTHING;
