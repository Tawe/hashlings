import { Species } from '../types/game';

export const SPECIES_DATA: Species[] = [
  {
    name: 'Drake',
    baseSize: 1,
    strength: 20,
    intelligence: 10,
    fortitude: 15,
    agility: 15,
    perception: 10,
    specialAbility: 'Flame Burst',
    favoriteFood: 'Spicy Jerky'
  },
  {
    name: 'Golem',
    baseSize: 3,
    strength: 25,
    intelligence: 5,
    fortitude: 30,
    agility: 5,
    perception: 8,
    specialAbility: 'Stone Skin',
    favoriteFood: 'Ironroot Bark'
  },
  {
    name: 'Hellhound',
    baseSize: 1,
    strength: 18,
    intelligence: 8,
    fortitude: 10,
    agility: 20,
    perception: 12,
    specialAbility: 'Inferno Howl',
    favoriteFood: 'Charcoal Biscuits'
  },
  {
    name: 'Gargoyle',
    baseSize: 1,
    strength: 16,
    intelligence: 6,
    fortitude: 20,
    agility: 10,
    perception: 14,
    specialAbility: 'Petrify Glare',
    favoriteFood: 'Cave Mushrooms'
  },
  {
    name: 'Manticore',
    baseSize: 2,
    strength: 22,
    intelligence: 12,
    fortitude: 18,
    agility: 14,
    perception: 13,
    specialAbility: 'Poison Spike',
    favoriteFood: 'Scorpion Honey'
  },
  {
    name: 'Kraken',
    baseSize: 3,
    strength: 28,
    intelligence: 15,
    fortitude: 25,
    agility: 6,
    perception: 9,
    specialAbility: 'Tentacle Snare',
    favoriteFood: 'Salted Eel'
  },
  {
    name: 'Zombie Minotaur',
    baseSize: 2,
    strength: 24,
    intelligence: 4,
    fortitude: 22,
    agility: 6,
    perception: 7,
    specialAbility: 'Undying Charge',
    favoriteFood: 'Rotroot Stew'
  },
  {
    name: 'Phoenix',
    baseSize: 1,
    strength: 14,
    intelligence: 20,
    fortitude: 12,
    agility: 16,
    perception: 18,
    specialAbility: 'Rebirth Flame',
    favoriteFood: 'Sunfruit Nectar'
  }
];

export const ELEMENTS: { [key: string]: { trainingBias: string; statBonus: string; combatBonus: string; moodTriggers: string } } = {
  Fire: {
    trainingBias: 'Strength',
    statBonus: '+5% Strength',
    combatBonus: 'Bonus vs Nature, Weak vs Water',
    moodTriggers: 'Angry if overfed'
  },
  Water: {
    trainingBias: 'Agility',
    statBonus: '+5% Agility',
    combatBonus: 'Bonus vs Fire, Weak vs Lightning',
    moodTriggers: 'Loves rainy days'
  },
  Nature: {
    trainingBias: 'Fortitude',
    statBonus: '+5% Fortitude',
    combatBonus: 'Bonus vs Lightning, Weak vs Fire',
    moodTriggers: 'Calms down from rest'
  },
  Shadow: {
    trainingBias: 'Intelligence',
    statBonus: '+5% Intelligence',
    combatBonus: 'Bonus vs Light, Weak vs Spirit',
    moodTriggers: 'High mood at night'
  },
  Spirit: {
    trainingBias: 'Mood-based Growth',
    statBonus: '+10% Mood Effects',
    combatBonus: 'Bonus vs Shadow, Weak vs Metal',
    moodTriggers: 'Evolves differently'
  },
  Metal: {
    trainingBias: 'Slower Overall Growth',
    statBonus: '+5% Resistances',
    combatBonus: 'Bonus vs Spirit, Weak vs Nature',
    moodTriggers: 'Becomes restless when idle'
  },
  Lightning: {
    trainingBias: 'Perception',
    statBonus: '+5% Perception',
    combatBonus: 'Bonus vs Water, Weak vs Earth',
    moodTriggers: 'Dislikes rest'
  },
  Earth: {
    trainingBias: 'Fortitude & Health',
    statBonus: '+10% Health',
    combatBonus: 'Bonus vs Lightning, Weak vs Wind',
    moodTriggers: 'Hates sweets'
  }
}; 