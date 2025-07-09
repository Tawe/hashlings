# Database Setup Guide

This guide will help you set up the Supabase database for Hashlings.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `hashlings` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose closest to you
6. Click "Create new project"
7. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. In your local project, create a `.env` file in the root directory
2. Add your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your-project-url-here
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `database-schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- `users` table (extends Supabase auth)
- `monsters` table (stores monster data)
- `actions` table (stores action history)
- Row Level Security policies
- Automatic triggers for user creation

## Step 5: Verify Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see three tables: `users`, `monsters`, and `actions`
3. The tables should have the correct structure with RLS enabled

## Step 6: Test the Application

1. Start your development server: `npm start`
2. Create a new account
3. Your monster should be created and saved to the database
4. Log out and log back in - your monster should persist!

## Troubleshooting

### "Table doesn't exist" errors
- Make sure you ran the SQL schema in the correct project
- Check that all tables were created in the Table Editor

### "RLS policy" errors
- The schema includes Row Level Security policies
- Users can only access their own data
- This is normal and expected behavior

### "Permission denied" errors
- Check that your environment variables are correct
- Make sure you're using the `anon` key, not the `service_role` key
- Verify the project URL is correct

### Data not persisting
- Check the browser console for errors
- Verify the database functions are working
- Check the Supabase logs in the dashboard

## Database Schema Overview

### Users Table
- Extends Supabase's built-in auth.users
- Stores username and creation timestamp
- Automatically created when user signs up

### Monsters Table
- One monster per user (enforced by UNIQUE constraint)
- Stores all monster stats and properties
- Links to user via user_id foreign key

### Actions Table
- Stores history of all monster care actions
- Links to monster via monster_id foreign key
- Used for action log and analytics

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Foreign Key Constraints**: Ensures data integrity
- **Automatic User Creation**: Trigger creates user profile on signup
- **Cascade Deletes**: Deleting a user removes their monster and actions

## Next Steps

Once the database is set up, your Hashlings game will:
- Save user accounts and monster data
- Persist progress across sessions
- Allow cross-device access
- Maintain action history
- Scale to multiple users

The database is now ready for your monster-raising adventure! 🐾 