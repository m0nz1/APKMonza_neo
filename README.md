# 🎨 NeoStore - Neo Brutalism APK/Game Downloader

Website modern untuk download APK dan Game dengan design Neo Brutalism yang colorful, responsive, dan mobile-friendly.

## ✨ Features

### User Features
- 🔍 Realtime search & category filter
- 📱 Mobile-first responsive design
- 🌓 Dark mode / Light mode toggle
- 🔐 Authentication (Login, Register, Forgot Password)
- 👤 User Profile with download history
- 💎 VIP System with exclusive download links
- ⚡ Smooth animations with Framer Motion
- 🎴 Neo Brutalism UI with bold shadows & borders

### Admin Features
- 📊 Dashboard with statistics
- 📝 CRUD Apps (Create, Read, Update, Delete)
- 👥 Manage Users & VIP status
- 🏷️ Manage Categories
- 🔒 Protected admin routes

### Technical Features
- ⚡ Next.js 14 with App Router
- 🎨 TailwindCSS with custom Neo Brutalism theme
- 🗄️ Supabase Backend (Auth + Database + Storage)
- 🔒 Row Level Security
- 📱 Bottom Navigation for mobile
- 🦴 Loading skeletons
- 🔔 Toast notifications
- 🗺️ Dynamic sitemap
- 🔍 SEO optimized

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + React 18 + TypeScript |
| Styling | TailwindCSS + Custom Neo Brutalism |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Deployment | Vercel |

## 📁 Project Structure

```
├── app/
│   ├── (main)/              # Route group for main pages
│   │   ├── page.tsx         # Home page
│   │   ├── search/page.tsx  # Search page
│   │   ├── profile/page.tsx # Profile page
│   │   └── app/[slug]/      # App detail page
│   ├── auth/                # Auth pages
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── admin/               # Admin dashboard
│   │   ├── dashboard/page.tsx
│   │   ├── apps/page.tsx
│   │   ├── users/page.tsx
│   │   └── categories/page.tsx
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   └── sitemap.ts           # Dynamic sitemap
├── components/
│   ├── layout/              # Navbar, BottomNav
│   ├── ui/                  # Reusable UI components
│   └── providers.tsx        # Theme provider
├── lib/
│   ├── supabase/            # Supabase clients
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript types
└── public/                  # Static assets
```

## 🗄️ Database Schema (Supabase)

### Tables

#### `users` (extends auth.users)
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT,
  avatar_url TEXT,
  is_vip BOOLEAN DEFAULT FALSE,
  vip_expires_at TIMESTAMP WITH TIME ZONE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `categories`
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'zap',
  color TEXT DEFAULT '#06b6d4',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `apps`
```sql
CREATE TABLE apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  version TEXT NOT NULL,
  developer TEXT NOT NULL,
  mod_feature TEXT,
  mod_feature_full TEXT,
  description TEXT,
  package_name TEXT,
  size TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  free_url TEXT,
  vip_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id),
  rating NUMERIC DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `downloads`
```sql
CREATE TABLE downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  app_id UUID REFERENCES apps(id),
  app_name TEXT NOT NULL,
  download_url TEXT NOT NULL,
  is_vip BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Users: users can read their own profile, admins can read all
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Apps: public read access
CREATE POLICY "Apps are public" ON apps FOR SELECT USING (true);

-- Categories: public read access
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);

-- Downloads: users can read own downloads
CREATE POLICY "Users can read own downloads" ON downloads
  FOR SELECT USING (auth.uid() = user_id);
```

### Functions & Triggers

```sql
-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, is_vip, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    FALSE,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🛠️ Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/neobrutal-apk-downloader.git
cd neobrutal-apk-downloader
npm install
```

### 2. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Supabase Setup
1. Create new project at [supabase.com](https://supabase.com)
2. Run the SQL schema above in SQL Editor
3. Enable Email provider in Authentication > Providers
4. Copy project URL and anon key to `.env.local`
5. Get service role key from Project Settings > API

### 4. Run Development
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
npm run build
# Or connect GitHub repo to Vercel for auto-deploy
```

## 🎨 Design System

### Colors (Light Mode)
- Primary: Cyan `#06b6d4`
- Secondary: Yellow `#eab308`
- Accent: Purple `#8b5cf6`
- Background: White / Light Gray
- Text: Black

### Colors (Dark Mode)
- Primary: Purple `#8b5cf6`
- Secondary: Cyan `#06b6d4`
- Accent: Yellow `#eab308`
- Background: Dark Purple-Black `#1e1b4b`
- Text: White

### Neo Brutalism Elements
- Border: 2px solid black
- Shadow: 4px 4px 0px 0px black
- Border Radius: 0.75rem (12px)
- Active state: 2px 2px shadow
- Hover state: 6px 6px shadow + translate up

## 📱 Mobile Features
- Floating bottom navigation
- Touch-friendly buttons (min 44px)
- Swipeable categories
- Responsive cards (1 col mobile, 2-3 col desktop)

## 🔐 Admin Setup

To create an admin user:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Admin routes are protected by:
1. Middleware session check
2. Server-side role verification in layout
3. Automatic redirect for non-admin users

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

Built with ❤️ using Next.js + Supabase + TailwindCSS
