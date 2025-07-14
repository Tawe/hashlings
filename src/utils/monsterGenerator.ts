import { sha256 } from 'js-sha256';
import { Monster, MonsterStats, Element, SizeCategory } from '../types/game';
import { SPECIES_DATA } from '../data/species';

export function generateMonster(username: string): Monster {
  const hash = sha256(username);
  
  // Parse hash into different sections
  const speciesIdx = parseInt(hash.slice(0, 4), 16) % SPECIES_DATA.length;
  const elementIdx = parseInt(hash.slice(4, 8), 16) % 8;
  const sizeVal = parseInt(hash.slice(8, 12), 16);
  
  // Get species data
  const species = SPECIES_DATA[speciesIdx];
  
  // Determine element
  const elements: Element[] = ['Fire', 'Water', 'Nature', 'Shadow', 'Spirit', 'Metal', 'Lightning', 'Earth'];
  const element = elements[elementIdx];
  
  // Determine size category
  let sizeCategory: SizeCategory;
  if (sizeVal <= 0x5555) {
    sizeCategory = 'Small';
  } else if (sizeVal <= 0xAAAA) {
    sizeCategory = 'Medium';
  } else {
    sizeCategory = 'Large';
  }
  
  // Calculate base size with modifiers
  let baseSize = species.baseSize;
  if (sizeCategory === 'Small') {
    baseSize = Math.max(1, Math.round(species.baseSize - 0.5));
  } else if (sizeCategory === 'Large') {
    baseSize = Math.round(species.baseSize + 1.5);
  }
  
  // Apply size and element modifiers to stats
  const stats: MonsterStats = {
    strength: species.strength,
    intelligence: species.intelligence,
    fortitude: species.fortitude,
    agility: species.agility,
    perception: species.perception,
    mood: 50, // Start with neutral mood
    energy: 100 // Start with full energy
  };
  
  // Apply size category modifiers
  if (sizeCategory === 'Small') {
    stats.agility += 2;
    stats.fortitude -= 1;
  } else if (sizeCategory === 'Large') {
    stats.fortitude += 2;
    stats.agility -= 1;
  }
  
  // Apply element bonuses
  switch (element) {
    case 'Fire':
      stats.strength = Math.floor(stats.strength * 1.05);
      break;
    case 'Water':
      stats.agility = Math.floor(stats.agility * 1.05);
      break;
    case 'Nature':
      stats.fortitude = Math.floor(stats.fortitude * 1.05);
      break;
    case 'Shadow':
      stats.intelligence = Math.floor(stats.intelligence * 1.05);
      break;
    case 'Spirit':
      // Mood effects are handled in action logic
      break;
    case 'Metal':
      // Resistances handled in combat
      break;
    case 'Lightning':
      stats.perception = Math.floor(stats.perception * 1.05);
      break;
    case 'Earth':
      stats.fortitude = Math.floor(stats.fortitude * 1.1);
      break;
  }
  
  // Generate monster name based on species and element
  const monsterName = `${element} ${species.name}`;
  
  return {
    id: `monster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: '', // Will be set when user is created
    name: monsterName,
    species: species.name,
    element,
    sizeCategory,
    baseSize,
    stats,
    stage: 1,
    createdAt: new Date()
  };
}

export function getElementColor(element: Element): string {
  const colors = {
    Fire: 'monster-fire',
    Water: 'monster-water',
    Nature: 'monster-nature',
    Shadow: 'monster-shadow',
    Spirit: 'monster-spirit',
    Metal: 'monster-metal',
    Lightning: 'monster-lightning',
    Earth: 'monster-earth'
  };
  return colors[element];
} 