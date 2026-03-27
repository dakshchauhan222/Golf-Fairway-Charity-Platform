-- =============================================
-- Golf Charity Subscription Platform
-- Complete Database Schema
-- =============================================

-- 1. Charities Table (created first since users reference it)
CREATE TABLE IF NOT EXISTS charities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Users Profile Table (extends Supabase auth.users)
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

-- 3. Scores Table
CREATE TABLE IF NOT EXISTS scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Draws Table
CREATE TABLE IF NOT EXISTS draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_numbers INTEGER[] NOT NULL,
  month TEXT NOT NULL,
  status TEXT DEFAULT 'simulated' CHECK (status IN ('simulated', 'published')),
  jackpot_carried_over BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Winners Table
CREATE TABLE IF NOT EXISTS winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
  match_type INTEGER NOT NULL CHECK (match_type IN (3, 4, 5)),
  prize_amount DECIMAL(10,2) DEFAULT 0,
  proof_url TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'paid')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Prize Pool Table
CREATE TABLE IF NOT EXISTS prize_pool (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
  total_pool DECIMAL(10,2) DEFAULT 0,
  jackpot_pool DECIMAL(10,2) DEFAULT 0,
  four_match_pool DECIMAL(10,2) DEFAULT 0,
  three_match_pool DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Row Level Security Policies
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE prize_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;

-- Charities: Public read, admin write
CREATE POLICY "Charities are viewable by everyone" ON charities FOR SELECT USING (true);
CREATE POLICY "Admins can manage charities" ON charities FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Users: Own profile read/update, admin full access
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "Admins can manage users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Scores: Own scores + admin
CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scores" ON scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON scores FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all scores" ON scores FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Draws: Public read, admin write
CREATE POLICY "Published draws viewable by authenticated" ON draws FOR SELECT USING (true);
CREATE POLICY "Admins can manage draws" ON draws FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Winners: Own wins + admin
CREATE POLICY "Users can view own wins" ON winners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own wins" ON winners FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage winners" ON winners FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Prize Pool: Public read, admin write
CREATE POLICY "Prize pool viewable by authenticated" ON prize_pool FOR SELECT USING (true);
CREATE POLICY "Admins can manage prize pool" ON prize_pool FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- =============================================
-- Seed Data: Sample Charities
-- =============================================

INSERT INTO charities (name, description, image_url, is_featured) VALUES
  ('Children''s Hospital Foundation', 'Supporting pediatric healthcare and medical research for children in need. Every contribution helps fund life-saving treatments and state-of-the-art medical facilities.', '/charities/children-hospital.jpg', true),
  ('Ocean Conservation Alliance', 'Protecting marine ecosystems and endangered ocean species through research, education, and direct conservation action worldwide.', '/charities/ocean-conservation.jpg', true),
  ('Education For All Initiative', 'Providing quality education and learning resources to underserved communities. Building schools, training teachers, and creating scholarship programs.', '/charities/education-for-all.jpg', true),
  ('Mental Health Awareness Network', 'Breaking the stigma around mental health through awareness campaigns, free counseling services, and community support programs.', '/charities/mental-health.jpg', false),
  ('Green Earth Reforestation', 'Combating climate change by planting trees, restoring degraded lands, and supporting sustainable forestry practices across the globe.', '/charities/green-earth.jpg', false),
  ('Hunger Relief International', 'Fighting food insecurity and malnutrition by distributing meals, supporting food banks, and funding sustainable agriculture in developing regions.', '/charities/hunger-relief.jpg', false);
