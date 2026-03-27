-- =============================================
-- EMERGENCY FIX: RLS Infinite Recursion on users table
-- Run entire script in Supabase Dashboard > SQL Editor
-- =============================================

-- Charities: Fully public read
DROP POLICY IF EXISTS "Charities are viewable by everyone" ON charities;
DROP POLICY IF EXISTS "Admins can manage charities" ON charities;
CREATE POLICY "Charities public read" ON charities FOR SELECT USING (true);
CREATE POLICY "Authenticated manage charities" ON charities FOR ALL USING (auth.role() = 'authenticated');

-- Users: Fix recursion - remove self-reference subquery
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;

CREATE POLICY "Users own profile read" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users own profile update" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Authenticated view users basic" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update users" ON users FOR ALL USING (auth.role() = 'authenticated');

-- Draws: Public read
DROP POLICY IF EXISTS "Published draws viewable by authenticated" ON draws;
DROP POLICY IF EXISTS "Admins can manage draws" ON draws;
CREATE POLICY "Draws public read" ON draws FOR SELECT USING (true);
CREATE POLICY "Authenticated manage draws" ON draws FOR ALL USING (auth.role() = 'authenticated');

-- Prize Pool: Public read
DROP POLICY IF EXISTS "Prize pool viewable by authenticated" ON prize_pool;
DROP POLICY IF EXISTS "Admins can manage prize pool" ON prize_pool;
CREATE POLICY "Prize pool public read" ON prize_pool FOR SELECT USING (true);
CREATE POLICY "Authenticated manage prize pool" ON prize_pool FOR ALL USING (auth.role() = 'authenticated');

-- Scores/Winners: Keep user-centric (safe)
-- No changes needed as they reference user_id, not self

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'charities', 'draws', 'prize_pool');

