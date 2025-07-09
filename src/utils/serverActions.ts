import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Monster, Action } from '../types/game';

// Call server-side action function
export async function performActionServerSide(actionType: 'feed' | 'train' | 'rest'): Promise<{
  success: boolean;
  monster?: Monster;
  action?: Action;
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }

  try {
    const { data, error } = await supabase.functions.invoke('perform-action', {
      body: { actionType }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.success) {
      return { success: false, error: data.error };
    }

    // Convert database format to frontend format
    const monster: Monster = {
      id: data.monster.id,
      userId: data.monster.user_id,
      name: data.monster.name,
      species: data.monster.species,
      element: data.monster.element,
      sizeCategory: data.monster.size_category,
      baseSize: data.monster.base_size,
      stats: data.monster.stats,
      stage: data.monster.stage,
      createdAt: new Date(data.monster.created_at),
      lastActionDate: data.monster.last_action_date,
      actionsToday: data.monster.actions_today
    };

    const action: Action = {
      id: data.action.id,
      monsterId: data.action.monster_id,
      actionType: data.action.action_type,
      result: data.action.result,
      timestamp: new Date(data.action.timestamp)
    };

    return { success: true, monster, action };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to perform action' 
    };
  }
}

// Call server-side rename function
export async function renameMonsterServerSide(newName: string): Promise<{
  success: boolean;
  monster?: Monster;
  action?: Action;
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }

  try {
    const { data, error } = await supabase.functions.invoke('rename-monster', {
      body: { newName }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.success) {
      return { success: false, error: data.error };
    }

    // Convert database format to frontend format
    const monster: Monster = {
      id: data.monster.id,
      userId: data.monster.user_id,
      name: data.monster.name,
      species: data.monster.species,
      element: data.monster.element,
      sizeCategory: data.monster.size_category,
      baseSize: data.monster.base_size,
      stats: data.monster.stats,
      stage: data.monster.stage,
      createdAt: new Date(data.monster.created_at),
      lastActionDate: data.monster.last_action_date,
      actionsToday: data.monster.actions_today
    };

    const action: Action = {
      id: data.action.id,
      monsterId: data.action.monster_id,
      actionType: data.action.action_type,
      result: data.action.result,
      timestamp: new Date(data.action.timestamp)
    };

    return { success: true, monster, action };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to rename monster' 
    };
  }
} 