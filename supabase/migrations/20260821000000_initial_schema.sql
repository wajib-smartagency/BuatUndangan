-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. PROFILES TABLE (User / WO / EO)
-- ==========================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  full_name text not null,
  role text default 'personal' check (role in ('personal', 'pro', 'admin')),
  plan_status text default 'active' check (plan_status in ('active', 'inactive', 'pending_payment')),
  created_at timestamp with time zone default timezone('Asia/Jakarta'::text, now()) not null,
  updated_at timestamp with time zone default timezone('Asia/Jakarta'::text, now()) not null
);

-- Turn on Row Level Security (RLS)
alter table public.profiles enable row level security;
-- Policy: User can read and update their own profile
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- ==========================================
-- 2. PROJECTS / EVENTS TABLE
-- ==========================================
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null, -- e.g., "Pernikahan Budi & Sarah"
  event_date timestamp with time zone,
  event_type text default 'wedding', -- wedding, birthday, etc
  template_id text default 'modern-1',
  slug text unique not null, -- e.g., "budi-sarah-2026" (for URL)
  is_published boolean default false,
  created_at timestamp with time zone default timezone('Asia/Jakarta'::text, now()) not null
);

alter table public.projects enable row level security;
create policy "Users can manage own projects" on projects for all using (auth.uid() = user_id);
-- Public can view published projects (for the invitation link)
create policy "Public can view published projects" on projects for select using (is_published = true);

-- ==========================================
-- 3. GUESTS TABLE
-- ==========================================
create table public.guests (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  name text not null,
  phone text,
  email text,
  unique_token text unique not null, -- to generate unique URL like ?to=Token123
  is_blast_sent boolean default false,
  created_at timestamp with time zone default timezone('Asia/Jakarta'::text, now()) not null
);

alter table public.guests enable row level security;
create policy "Users can manage guests for their projects" on guests for all using (
  auth.uid() in (select user_id from projects where id = project_id)
);

-- ==========================================
-- 4. RSVPS TABLE
-- ==========================================
create table public.rsvps (
  id uuid default uuid_generate_v4() primary key,
  guest_id uuid references public.guests(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  status text not null check (status in ('hadir', 'tidak_hadir', 'ragu')),
  pax integer default 1,
  message text,
  created_at timestamp with time zone default timezone('Asia/Jakarta'::text, now()) not null
);

alter table public.rsvps enable row level security;
-- Guest can insert their own RSVP
create policy "Anyone can insert RSVP if they have guest token (handled via app logic)" on rsvps for insert with check (true);
-- Project owner can view and manage all RSVPs for their project
create policy "Users can manage RSVPs for their projects" on rsvps for all using (
  auth.uid() in (select user_id from projects where id = project_id)
);

-- ==========================================
-- 5. AUDIT LOGS TABLE
-- ==========================================
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete set null,
  action text not null, -- e.g., "GUEST_RSVP", "BLAST_SENT", "PROJECT_CREATED"
  description text not null,
  created_at timestamp with time zone default timezone('Asia/Jakarta'::text, now()) not null
);

alter table public.audit_logs enable row level security;
create policy "Users can view logs for their projects" on audit_logs for select using (
  auth.uid() in (select user_id from projects where id = project_id)
);

-- Trigger Function: Automatically create profile after user signs up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'personal'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: Fire the function every time a user signs up via Supabase Auth
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
