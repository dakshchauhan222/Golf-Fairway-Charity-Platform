-- =============================================
-- FIXED Schema - No RLS Recursion
-- Use this for future migrations/setup
-- =============================================

-- Tables (same)
CREATE TABLE IF NOT EXISTS charities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'lapsed')),
  subscription_type TEXT CHECK (subscription_type IN ('monthly', 'yearly')),
  subscription_start TIMESTAMPTZ,
  renewal_date TIMESTAMPTZ,
  charity_id UUID REFERENCES charities(id) ON DELETE SET NULL,
  charity_percentage INTEGER DEFAULT 10 CHECK (charity_percentage >= 10),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ... (scores, draws, winners, prize_pool same as original)

-- FIXED RLS Policies - NO RECURSION
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE prize_pool ENABLE ROW LEVEL SECURITY;

-- Charities: Public read (key fix)
CREATE POLICY \"Charities public read\" ON charities
FOR SELECT USING (true);
CREATE POLICY \"Authenticated charities manage\" ON charities
FOR ALL USING (auth.role() = 'authenticated');

-- Users: Own records + authenticated view (no self-query)
CREATE POLICY \"Users own profile\" ON users
FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY \"Authenticated users view all basic\" ON users
FOR SELECT USING (auth.role() = 'authenticated');

-- Draws/Prize Pool: Public read
CREATE POLICY \"Public draws read\" ON draws FOR SELECT USING (true);
CREATE POLICY \"Authenticated draws manage\" ON draws FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY \"Public prize_pool read\" ON prize_pool FOR SELECT USING (true);
CREATE POLICY \"Authenticated prize_pool manage\" ON prize_pool FOR ALL USING (auth.role() = 'authenticated');

-- Scores: Own + auth
CREATE POLICY \"Own scores\" ON scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY \"Authenticated scores manage\" ON scores FOR ALL USING (auth.role() = 'authenticated');

-- Winners: Own + auth
CREATE POLICY \"Own winners\" ON winners FOR ALL USING (auth.uid() = user_id);
CREATE POLICY \"Authenticated winners manage\" ON winners FOR ALL USING (auth.role() = 'authenticated');

-- Seed charities (same)
INSERT INTO charities (name, description, image_url, is_featured) VALUES
  ('Children''s Hospital Foundation', 'Supporting pediatric healthcare...', '/charities/children-hospital.jpg', true),
  -- ... rest same
ON CONFLICT (name) DO NOTHING;

