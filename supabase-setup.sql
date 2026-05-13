-- ============================================
-- NEOSTORE SUPABASE SETUP SQL
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'zap', color TEXT DEFAULT '#06b6d4',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  icon_url TEXT, version TEXT NOT NULL, developer TEXT NOT NULL,
  mod_feature TEXT, mod_feature_full TEXT, description TEXT,
  package_name TEXT, size TEXT, upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  free_url TEXT, vip_url TEXT, screenshots TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id),
  rating NUMERIC DEFAULT 0, download_count INTEGER DEFAULT 0,
  is_recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL, username TEXT, avatar_url TEXT,
  is_vip BOOLEAN DEFAULT FALSE, vip_expires_at TIMESTAMP WITH TIME ZONE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id), app_id UUID REFERENCES apps(id),
  app_name TEXT NOT NULL, download_url TEXT NOT NULL,
  is_vip BOOLEAN DEFAULT FALSE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE apps DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE downloads DISABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, is_vip, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)), FALSE, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO categories (name, slug, icon, color) VALUES
  ('Games', 'games', 'gamepad2', '#ef4444'),
  ('Tools', 'tools', 'wrench', '#06b6d4'),
  ('Social', 'social', 'users', '#8b5cf6'),
  ('Entertainment', 'entertainment', 'music', '#eab308'),
  ('Productivity', 'productivity', 'briefcase', '#22c55e'),
  ('Photography', 'photography', 'camera', '#f97316')
ON CONFLICT (slug) DO NOTHING;

-- UPDATE users SET role = 'admin' WHERE email = 'monrama200919@gmail.com';
