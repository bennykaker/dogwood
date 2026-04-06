-- Admin profiles table (one row per admin user)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor', -- 'editor' | 'reviewer' | 'admin'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Admins can only read their own profile (service role bypasses RLS)
CREATE POLICY "admin_profiles_self" ON admin_profiles
  FOR SELECT USING (auth.uid() = id);

-- Escalations table
CREATE TABLE IF NOT EXISTS escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  question TEXT NOT NULL,
  dogwood_reply TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | draft | in_review | published
  answer TEXT,
  answered_by UUID REFERENCES admin_profiles(id),
  answered_by_name TEXT,
  answered_at TIMESTAMPTZ,
  reviewer_id UUID REFERENCES admin_profiles(id),
  reviewer_name TEXT,
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can read/update escalations
CREATE POLICY "escalations_read" ON escalations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "escalations_update" ON escalations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Service role (used by API routes) can insert
CREATE POLICY "escalations_insert" ON escalations
  FOR INSERT WITH CHECK (true);

-- Index for dashboard queries
CREATE INDEX IF NOT EXISTS escalations_status_idx ON escalations (status, created_at DESC);
