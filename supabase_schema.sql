-- Profiles table to store user metadata (No references to auth.users for bypass)
create table profiles (
  id uuid default gen_random_uuid() primary key,
  id_identifier text unique, -- For authorities (e.g., 'PRINCIPAL_JEC')
  name text,
  role text check (role in ('student', 'employee', 'hod', 'principal')),
  department text,
  branch text,
  degree text,
  roll_number text unique,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Grievances table
create table grievances (
  id uuid default gen_random_uuid() primary key,
  token_id text unique not null,
  student_id text not null, -- Changed from uuid references auth.users
  student_name text not null,
  title text not null,
  description text not null,
  category text not null,
  sub_category text,
  target_department text not null,
  branch text,
  degree text,
  urgency text check (urgency in ('Low', 'Medium', 'High')),
  status text default 'pending' check (status in ('pending', 'in-progress', 'resolved')),
  authority_level integer default 1,
  expected_date date,
  resolved_at timestamp with time zone,
  resolution_proof_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Comments table
create table comments (
  id uuid default gen_random_uuid() primary key,
  grievance_id uuid references grievances on delete cascade not null,
  author_id text not null, -- Changed from uuid references auth.users
  author_name text not null,
  content text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now())
);

-- DISABLE RLS for HACKATHON DEMO (Bulletproof Sync)
alter table profiles disable row level security;
alter table grievances disable row level security;
alter table comments disable row level security;
