CREATE TABLE profiles (
  id uuid references auth.users primary key,
  name text,
  school text,
  city text,
  default_subject text,
  default_grade int,
  created_at timestamptz default now()
);

CREATE TABLE lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  subject text not null,
  grade int not null,
  topic text not null,
  lesson_type text not null,
  content jsonb not null,
  created_at timestamptz default now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own lessons" ON lessons
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own profile" ON profiles
  FOR ALL USING (auth.uid() = id);
