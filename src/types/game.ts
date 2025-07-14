export type Element = 'Fire' | 'Water' | 'Nature' | 'Shadow' | 'Spirit' | 'Metal' | 'Lightning' | 'Earth';
export type SizeCategory = 'Small' | 'Medium' | 'Large';
export type ActionType = 'feed' | 'train' | 'rest' | 'rename';

export interface MonsterStats {
  strength: number;
  intelligence: number;
  fortitude: number;
  agility: number;
  perception: number;
  mood: number;
  energy: number;
}

export interface Species {
  name: string;
  baseSize: number; // Integer representing size category
  strength: number;
  intelligence: number;
  fortitude: number;
  agility: number;
  perception: number;
  specialAbility: string;
  favoriteFood: string;
}

export interface Monster {
  id: string;
  userId: string;
  name: string;
  species: string;
  element: Element;
  sizeCategory: SizeCategory;
  baseSize: number;
  stats: MonsterStats;
  stage: number;
  createdAt: Date;
  lastActionDate?: string;
}

export interface Action {
  id: string;
  monsterId: string;
  actionType: ActionType;
  result: {
    statGains?: Partial<MonsterStats>;
    moodChange?: number;
    energyChange?: number;
    message: string;
  };
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  createdAt: Date;
  uuid: string; // Add this line for friend code support
}

export interface GameState {
  user: User | null;
  monster: Monster | null;
  actions: Action[];
  isLoading: boolean;
  error: string | null;
} 