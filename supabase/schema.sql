  -- Schema SQL untuk Supabase (Adipra Portfolio)

  -- 1. Tabel Projects
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    year INT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    cover TEXT NOT NULL,
    description TEXT NOT NULL,
    detail TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );

  -- 2. Tabel Competitions
  CREATE TABLE IF NOT EXISTS competitions (
    id TEXT PRIMARY KEY,
    img TEXT NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    year INT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );

  -- 3. Tabel Trainings
  CREATE TABLE IF NOT EXISTS trainings (
    id TEXT PRIMARY KEY,
    img TEXT NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    year INT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );

  -- 4. Tabel Articles
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    cover TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );

  -- Kebijakan RLS (Row Level Security): Izinkan Read publik (Anon)
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "Allow public read for projects" ON projects;
  CREATE POLICY "Allow public read for projects" ON projects FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Allow public read for competitions" ON competitions;
  CREATE POLICY "Allow public read for competitions" ON competitions FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Allow public read for trainings" ON trainings;
  CREATE POLICY "Allow public read for trainings" ON trainings FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Allow public read for articles" ON articles;
  CREATE POLICY "Allow public read for articles" ON articles FOR SELECT USING (true);

  -- Kebijakan RLS untuk Admin (authenticated): Izinkan Insert/Update/Delete
  DROP POLICY IF EXISTS "Allow authenticated update for projects" ON projects;
  CREATE POLICY "Allow authenticated update for projects" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow authenticated update for competitions" ON competitions;
  CREATE POLICY "Allow authenticated update for competitions" ON competitions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow authenticated update for trainings" ON trainings;
  CREATE POLICY "Allow authenticated update for trainings" ON trainings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow authenticated update for articles" ON articles;
  CREATE POLICY "Allow authenticated update for articles" ON articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow authenticated insert for projects" ON projects;
  CREATE POLICY "Allow authenticated insert for projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow authenticated insert for competitions" ON competitions;
  CREATE POLICY "Allow authenticated insert for competitions" ON competitions FOR INSERT TO authenticated WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow authenticated insert for trainings" ON trainings;
  CREATE POLICY "Allow authenticated insert for trainings" ON trainings FOR INSERT TO authenticated WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow authenticated insert for articles" ON articles;
  CREATE POLICY "Allow authenticated insert for articles" ON articles FOR INSERT TO authenticated WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow authenticated delete for projects" ON projects;
  CREATE POLICY "Allow authenticated delete for projects" ON projects FOR DELETE TO authenticated USING (true);

  DROP POLICY IF EXISTS "Allow authenticated delete for competitions" ON competitions;
  CREATE POLICY "Allow authenticated delete for competitions" ON competitions FOR DELETE TO authenticated USING (true);

  DROP POLICY IF EXISTS "Allow authenticated delete for trainings" ON trainings;
  CREATE POLICY "Allow authenticated delete for trainings" ON trainings FOR DELETE TO authenticated USING (true);

  DROP POLICY IF EXISTS "Allow authenticated delete for articles" ON articles;
  CREATE POLICY "Allow authenticated delete for articles" ON articles FOR DELETE TO authenticated USING (true);
