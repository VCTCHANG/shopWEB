-- ============================================================
-- Heirloom. — Supabase Schema
-- Run this in your Supabase project → SQL Editor
-- ============================================================

-- Users table (stores registered accounts)
CREATE TABLE IF NOT EXISTS public.users (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL UNIQUE,
  password   TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
-- (server-side code uses service role key which bypasses RLS automatically)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Index for faster email lookups on login
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);
