-- Brightline Dental - Supabase Database Schema Setup
-- Run these SQL statements in your Supabase SQL Editor (https://app.supabase.com -> SQL Editor)

-- 1. Create Profiles Table (links to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Appointments Table (stores patient booking details)
CREATE TABLE IF NOT EXISTS public.appointments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Wellness Subscriptions Table
CREATE TABLE IF NOT EXISTS public.wellness_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  billing_interval TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Patient Intake Forms Table (stores completed intake questionnaires)
CREATE TABLE IF NOT EXISTS public.patient_forms (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  dob TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT NOT NULL,
  reason TEXT NOT NULL,
  "lastVisit" TEXT NOT NULL,
  allergies TEXT,
  conditions TEXT,
  consent BOOLEAN NOT NULL DEFAULT FALSE,
  signature TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_forms ENABLE ROW LEVEL SECURITY;

-- Security Policies

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles read access" ON public.profiles;
CREATE POLICY "Public profiles read access" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Appointments Policies
DROP POLICY IF EXISTS "Anyone can insert appointments" ON public.appointments;
CREATE POLICY "Anyone can insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users select own appointments" ON public.appointments;
CREATE POLICY "Users select own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Admins update appointments" ON public.appointments;
CREATE POLICY "Admins update appointments" ON public.appointments FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Wellness Subscriptions Policies
DROP POLICY IF EXISTS "Anyone can insert wellness subscriptions" ON public.wellness_subscriptions;
CREATE POLICY "Anyone can insert wellness subscriptions" ON public.wellness_subscriptions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins and owners select wellness subscriptions" ON public.wellness_subscriptions;
CREATE POLICY "Admins and owners select wellness subscriptions" ON public.wellness_subscriptions FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Patient Forms Policies
DROP POLICY IF EXISTS "Users manage own patient forms" ON public.patient_forms;
CREATE POLICY "Users manage own patient forms" ON public.patient_forms FOR ALL USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- 5. Create an automated trigger to create a public.profiles record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, is_admin)
  VALUES (
    new.id,
    COALESCE(
      (new.email = 'enginebuild.io@gmail.com' OR new.email LIKE '%admin%'),
      false
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute handle_new_user() on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

