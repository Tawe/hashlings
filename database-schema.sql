-- Hashlings Database Schema
-- Run this in your Supabase SQL Editor

-- Note: Supabase handles JWT secrets automatically, no need to set them manually

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monsters table
CREATE TABLE IF NOT EXISTS monsters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    element TEXT NOT NULL,
    size_category TEXT NOT NULL,
    base_size INTEGER NOT NULL,
    stats JSONB NOT NULL,
    stage INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_action_date TEXT,
    actions_today INTEGER DEFAULT 0,
    UNIQUE(user_id)
);

-- Actions table (monster care history)
CREATE TABLE IF NOT EXISTS actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monster_id UUID NOT NULL REFERENCES monsters(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    result TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monsters_user_id ON monsters(user_id);
CREATE INDEX IF NOT EXISTS idx_actions_monster_id ON actions(monster_id);
CREATE INDEX IF NOT EXISTS idx_actions_timestamp ON actions(timestamp DESC);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE monsters ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow insert for authenticated users or for the trigger function
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (
        auth.uid() = id OR 
        (auth.uid() IS NOT NULL AND auth.uid() = id)
    );

-- Users can only access their own monsters
CREATE POLICY "Users can view own monsters" ON monsters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own monsters" ON monsters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own monsters" ON monsters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only access actions for their own monsters
CREATE POLICY "Users can view own monster actions" ON actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM monsters 
            WHERE monsters.id = actions.monster_id 
            AND monsters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own monster actions" ON actions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM monsters 
            WHERE monsters.id = actions.monster_id 
            AND monsters.user_id = auth.uid()
        )
    );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, username, created_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.created_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions to the function
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on user updates
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 