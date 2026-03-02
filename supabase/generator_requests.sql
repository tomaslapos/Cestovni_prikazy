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

-- Index
CREATE INDEX IF NOT EXISTS idx_generator_requests_vehicle_id ON generator_requests(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_generator_requests_date_to ON generator_requests(date_to);

-- RLS
ALTER TABLE generator_requests ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow public read generator_requests" ON generator_requests;
DROP POLICY IF EXISTS "Allow public insert generator_requests" ON generator_requests;

CREATE POLICY "Allow public read generator_requests" ON generator_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert generator_requests" ON generator_requests FOR INSERT WITH CHECK (true);
