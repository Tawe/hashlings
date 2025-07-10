import { create } from 'zustand';
import { GameState, User, Monster, Action } from '../types/game';
import { generateMonster } from '../utils/monsterGenerator';
import { signIn, signUp, signOut, getCurrentUser } from '../utils/auth';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  saveMonster, 
  loadUser, 
  loadMonster, 
  loadActions
} from '../utils/database';
import { 
  performActionServerSide, 
  renameMonsterServerSide 
} from '../utils/serverActions';
import { supabase } from '../utils/supabaseClient';

interface Friend {
  uuid: string;
  username: string;
}

interface GameStore extends GameState {
  // Auth state
  authUser: SupabaseUser | null;
  isAuthenticated: boolean;
  
  // Actions
  createUser: (username: string) => void;
  setMonster: (monster: Monster) => void;
  performMonsterAction: (actionType: 'feed' | 'train' | 'rest') => void;
  renameMonster: (newName: string) => Promise<void>;
  addAction: (action: Action) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetGame: () => void;
  renameUsername: (newName: string) => Promise<void>;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;

  // Friends
  friends: Friend[];
  fetchFriends: () => Promise<void>;
  addFriend: (friendCode: string) => Promise<void>;
}

const initialState: GameState = {
  user: null,
  monster: null,
  actions: [],
  isLoading: false,
  error: null
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  authUser: null,
  isAuthenticated: false,
  friends: [],

  createUser: (username: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const user: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username,
        createdAt: new Date(),
        uuid: `uuid_${Math.random().toString(36).substr(2, 9)}` // Dummy uuid for local user creation
      };
      
      const monster = generateMonster(username);
      monster.userId = user.id;
      
      set({
        user,
        monster,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create user',
        isLoading: false
      });
    }
  },

  setMonster: (monster: Monster) => {
    set({ monster });
  },

  performMonsterAction: async (actionType) => {
    const { monster } = get();
    if (!monster) {
      set({ error: 'No monster found!' });
      return;
    }

    try {
      // Use server-side validation instead of client-side
      const result = await performActionServerSide(actionType);
      
      if (!result.success) {
        set({ error: result.error || 'Action failed' });
        return;
      }

      set((state) => ({
        monster: result.monster!,
        actions: [result.action!, ...state.actions]
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Action failed'
      });
    }
  },

  renameMonster: async (newName: string) => {
    const { monster } = get();
    if (!monster) {
      set({ error: 'No monster found!' });
      return;
    }

    try {
      // Use server-side validation instead of client-side
      const result = await renameMonsterServerSide(newName);
      
      if (!result.success) {
        set({ error: result.error || 'Failed to rename monster' });
        return;
      }

      set((state) => ({
        monster: result.monster!,
        actions: [result.action!, ...state.actions]
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to rename monster'
      });
    }
  },

  addAction: (action: Action) => {
    set((state) => ({
      actions: [action, ...state.actions]
    }));
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  resetGame: () => {
    set(initialState);
  },

  renameUsername: async (newName: string) => {
    const { user } = get();
    if (!user) {
      set({ error: 'No user found!' });
      return;
    }
    if (newName.trim().length < 3 || newName.trim().length > 20) {
      set({ error: 'Display name must be 3-20 characters.' });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      if (!supabase) {
        set({ error: 'Supabase is not configured.', isLoading: false });
        return;
      }
      // Update in Supabase users table
      const { data, error } = await supabase
        .from('users')
        .update({ username: newName.trim() })
        .eq('id', user.id)
        .select();
      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }
      set((state) => ({
        user: { ...state.user!, username: newName.trim() },
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update display name',
        isLoading: false
      });
    }
  },

  // Auth actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await signIn(email, password);
      set({
        authUser: user,
        isAuthenticated: true,
        isLoading: false
      });
      
      // Try to load existing user and monster data
      const existingUser = await loadUser(user!.id);
      const existingMonster = await loadMonster(user!.id);
      const existingActions = existingMonster ? await loadActions(existingMonster.id) : [];
      
      if (existingUser && existingMonster) {
        // User exists, load their data
        set({ 
          user: { ...existingUser, uuid: existingUser.uuid }, 
          monster: existingMonster,
          actions: existingActions
        });
      } else {
        // New user, create initial data
        const username = user?.user_metadata?.username || email.split('@')[0];
        const gameUser: User = {
          id: user!.id,
          username,
          createdAt: new Date(user!.created_at),
          uuid: user!.uuid || ''
        };
        
        const monster = generateMonster(username);
        monster.userId = user!.id;
        
        // Save monster to database (user is created by trigger)
        await saveMonster(monster);
        
        set({ user: gameUser, monster });
      }
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false
      });
    }
  },

  register: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await signUp(email, password);
      set({
        authUser: user,
        isAuthenticated: true,
        isLoading: false
      });
      
      // Create new user and monster
      const username = user?.user_metadata?.username || email.split('@')[0];
      const gameUser: User = {
        id: user!.id,
        username,
        createdAt: new Date(user!.created_at),
        uuid: user!.uuid || ''
      };
      
      const monster = generateMonster(username);
      monster.userId = user!.id;
      
      // Save monster to database (user is created by trigger)
      await saveMonster(monster);
      
      set({ user: gameUser, monster });
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      await signOut();
      // Reset ALL state to initial values
      set({
        user: null,
        monster: null,
        actions: [],
        authUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false
      });
    }
  },

  initializeAuth: async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        set({
          authUser: user,
          isAuthenticated: true
        });
        
        // Try to load existing user and monster data
        const existingUser = await loadUser(user.id);
        const existingMonster = await loadMonster(user.id);
        const existingActions = existingMonster ? await loadActions(existingMonster.id) : [];
        
        if (existingUser && existingMonster) {
          // User exists, load their data
          set({ 
            user: { ...existingUser, uuid: existingUser.uuid }, 
            monster: existingMonster,
            actions: existingActions
          });
        } else {
          // User exists but no game data, create initial data
          const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user';
          const gameUser: User = {
            id: user.id,
            username,
            createdAt: new Date(user.created_at),
            uuid: user.uuid || ''
          };
          
          const monster = generateMonster(username);
          monster.userId = user.id;
          
          // Save monster to database (user is created by trigger)
          await saveMonster(monster);
          
          set({ user: gameUser, monster });
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    }
  },

  // Friends
  fetchFriends: async () => {
    const { user } = get();
    if (!user) return;
    if (!supabase) return;
    const { data, error } = await supabase
      .from('friends')
      .select('friend_id, users:friend_id(username, uuid)')
      .eq('user_id', user.uuid);
    if (error) {
      set({ error: error.message });
      return;
    }
    const friends = (data || []).map((row: any) => ({
      uuid: row.users.uuid,
      username: row.users.username
    }));
    set({ friends });
  },

  addFriend: async (friendCode: string) => {
    const { user, friends } = get();
    if (!user) {
      set({ error: 'No user found!' });
      return;
    }
    if (!supabase) {
      set({ error: 'Supabase is not configured.' });
      return;
    }
    if (friendCode === user.uuid) {
      set({ error: 'You cannot add yourself as a friend.' });
      return;
    }
    // Check if already a friend
    if (friends.some(f => f.uuid === friendCode)) {
      set({ error: 'Already friends with this user.' });
      return;
    }
    // Check if user exists
    const { data: friendUser, error: userError } = await supabase
      .from('users')
      .select('uuid, username')
      .eq('uuid', friendCode)
      .single();
    if (userError || !friendUser) {
      set({ error: 'No user found with that friend code.' });
      return;
    }
    // Add to friends table
    const { error: addError } = await supabase
      .from('friends')
      .insert({ user_id: user.uuid, friend_id: friendCode });
    if (addError) {
      set({ error: addError.message });
      return;
    }
    // Update local state
    set((state) => ({
      friends: [...state.friends, { uuid: friendUser.uuid, username: friendUser.username }]
    }));
  }
})); 