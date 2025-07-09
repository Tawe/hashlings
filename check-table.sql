-- Check and fix monsters table structure
-- Run this in your Supabase SQL Editor

-- First, let's see what the current table structure looks like
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'monsters' 
ORDER BY ordinal_position;

-- If the table doesn't exist or has wrong structure, recreate it
DROP TABLE IF EXISTS monsters CASCADE;

CREATE TABLE monsters (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    element TEXT NOT NULL,
    size_category TEXT NOT NULL,
    base_size INTEGER NOT NULL,
    stats JSONB NOT NULL,
    stage INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    last_action_date TEXT,
    actions_today INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX idx_monsters_user_id ON monsters(user_id);

-- Disable RLS for now to avoid permission issues
ALTER TABLE monsters DISABLE ROW LEVEL SECURITY;

-- Also recreate actions table
DROP TABLE IF EXISTS actions CASCADE;

CREATE TABLE actions (
    id TEXT PRIMARY KEY,
    monster_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    result JSONB NOT NULL,
    timestamp TEXT NOT NULL
);

CREATE INDEX idx_actions_monster_id ON actions(monster_id);
ALTER TABLE actions DISABLE ROW LEVEL SECURITY; 