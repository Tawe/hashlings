-- Reset actions for all monsters to test the new date format
-- Run this in your Supabase SQL Editor

-- Update all monsters to use the new date format and reset actions
UPDATE monsters 
SET 
  last_action_date = NULL,
  actions_today = 0
WHERE last_action_date IS NOT NULL;

-- This will force all monsters to start fresh with the new date format
-- The next action performed will set the correct YYYY-MM-DD format 