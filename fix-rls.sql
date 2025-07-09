-- Quick fix for RLS issues during development
-- Run this in your Supabase SQL Editor

-- Temporarily disable RLS on users table for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Or alternatively, create a more permissive policy
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (true);

-- This will allow the user creation to work
-- You can re-enable RLS later with proper policies 