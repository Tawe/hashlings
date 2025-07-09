import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User, Monster, Action } from '../types/game';

// Database table names
const TABLES = {
  USERS: 'users',
  MONSTERS: 'monsters',
  ACTIONS: 'actions'
};

// Save user profile to database
export async function saveUser(user: User): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase
    .from(TABLES.USERS)
    .upsert({
      id: user.id,
      username: user.username,
      created_at: user.createdAt.toISOString()
    });

  if (error) throw error;
}

// Save monster to database
export async function saveMonster(monster: Monster): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }

  const monsterData = {
    id: monster.id,
    user_id: monster.userId,
    name: monster.name,
    species: monster.species,
    element: monster.element,
    size_category: monster.sizeCategory,
    base_size: monster.baseSize,
    stats: monster.stats,
    stage: monster.stage,
    created_at: monster.createdAt.toISOString(),
    last_action_date: monster.lastActionDate || null,
    actions_today: monster.actionsToday
  };

  const { error } = await supabase
    .from(TABLES.MONSTERS)
    .upsert(monsterData);

  if (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Save action to database
export async function saveAction(action: Action): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase
    .from(TABLES.ACTIONS)
    .insert({
      id: action.id,
      monster_id: action.monsterId,
      action_type: action.actionType,
      result: action.result,
      timestamp: action.timestamp.toISOString()
    });

  if (error) throw error;
}

// Load user profile from database
export async function loadUser(userId: string): Promise<User | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(TABLES.USERS)
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    username: data.username,
    createdAt: new Date(data.created_at)
  };
}

// Load monster from database
export async function loadMonster(userId: string): Promise<Monster | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(TABLES.MONSTERS)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    species: data.species,
    element: data.element,
    sizeCategory: data.size_category,
    baseSize: data.base_size,
    stats: data.stats,
    stage: data.stage,
    createdAt: new Date(data.created_at),
    lastActionDate: data.last_action_date,
    actionsToday: data.actions_today
  };
}

// Load actions from database
export async function loadActions(monsterId: string): Promise<Action[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from(TABLES.ACTIONS)
    .select('*')
    .eq('monster_id', monsterId)
    .order('timestamp', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map(action => ({
    id: action.id,
    monsterId: action.monster_id,
    actionType: action.action_type,
    result: action.result,
    timestamp: new Date(action.timestamp)
  }));
}

// Update monster in database
export async function updateMonster(monster: Monster): Promise<void> {
  await saveMonster(monster);
}

// Check if user exists in database
export async function userExists(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from(TABLES.USERS)
    .select('id')
    .eq('id', userId)
    .single();

  return !error && !!data;
} 