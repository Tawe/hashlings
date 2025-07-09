-- Update monsters table to fix 400 error
-- Run this in your Supabase SQL Editor

-- Drop the existing monsters table if it exists
DROP TABLE IF EXISTS monsters CASCADE;

-- Recreate the monsters table with correct structure
CREATE TABLE monsters (
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

-- Recreate the actions table
DROP TABLE IF EXISTS actions CASCADE;

CREATE TABLE actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monster_id UUID NOT NULL REFERENCES monsters(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    result JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate indexes
CREATE INDEX idx_monsters_user_id ON monsters(user_id);
CREATE INDEX idx_actions_monster_id ON actions(monster_id);
CREATE INDEX idx_actions_timestamp ON actions(timestamp DESC);

-- Recreate RLS policies for monsters
ALTER TABLE monsters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own monsters" ON monsters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own monsters" ON monsters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own monsters" ON monsters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Recreate RLS policies for actions
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;

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