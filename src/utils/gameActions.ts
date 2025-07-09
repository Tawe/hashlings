import { Monster, MonsterStats, ActionType, Action } from '../types/game';
import { SPECIES_DATA } from '../data/species';

export function performAction(monster: Monster, actionType: ActionType): { monster: Monster; action: Action } {
  const today = new Date().toDateString();
  const isNewDay = monster.lastActionDate !== today;
  
  // Reset actions if it's a new day
  const actionsToday = isNewDay ? 0 : monster.actionsToday;
  
  if (actionsToday >= 3) {
    throw new Error('You have already performed 3 actions today!');
  }
  
  let result: Action['result'];
  let updatedStats = { ...monster.stats };
  
  switch (actionType) {
    case 'feed':
      result = performFeed(monster, updatedStats);
      break;
    case 'train':
      result = performTrain(monster, updatedStats);
      break;
    case 'rest':
      result = performRest(monster, updatedStats);
      break;
    case 'rename':
      // Rename doesn't affect stats, just return a message
      result = { message: 'Monster renamed successfully!' };
      break;
    default:
      throw new Error(`Unknown action type: ${actionType}`);
  }
  
  // Apply stat changes
  if (result.statGains) {
    Object.entries(result.statGains).forEach(([stat, value]) => {
      if (value !== undefined) {
        (updatedStats as any)[stat] = Math.max(0, Math.min(100, (updatedStats as any)[stat] + value));
      }
    });
  }
  
  // Apply mood change
  if (result.moodChange) {
    updatedStats.mood = Math.max(0, Math.min(100, updatedStats.mood + result.moodChange));
  }
  
  // Apply energy change
  if (result.energyChange) {
    updatedStats.energy = Math.max(0, Math.min(100, updatedStats.energy + result.energyChange));
  }
  
  const updatedMonster: Monster = {
    ...monster,
    stats: updatedStats,
    lastActionDate: today,
    actionsToday: actionsToday + 1
  };
  
  const action: Action = {
    id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    monsterId: monster.id,
    actionType,
    result,
    timestamp: new Date()
  };
  
  return { monster: updatedMonster, action };
}

function performFeed(monster: Monster, stats: MonsterStats): Action['result'] {
  const species = SPECIES_DATA.find(s => s.name === monster.species);
  if (!species) {
    return { message: 'Unknown species!' };
  }
  
  // Check if it's favorite food
  const isFavoriteFood = Math.random() < 0.3; // 30% chance of favorite food
  let moodChange = 0;
  let energyChange = 20;
  
  if (isFavoriteFood) {
    moodChange = 10;
    energyChange = 30;
  } else {
    moodChange = Math.floor(Math.random() * 6) - 2; // -2 to +3
  }
  
  // Element-specific mood effects
  switch (monster.element) {
    case 'Fire':
      if (moodChange > 5) moodChange = Math.min(moodChange, 5); // Fire monsters get angry if overfed
      break;
    case 'Water':
      if (Math.random() < 0.2) moodChange += 5; // Water monsters love food
      break;
    case 'Earth':
      if (Math.random() < 0.3) moodChange -= 3; // Earth monsters sometimes dislike food
      break;
  }
  
  return {
    moodChange,
    energyChange,
    message: isFavoriteFood 
      ? `${monster.name} loves the ${species.favoriteFood}! Mood +${moodChange}`
      : `${monster.name} eats the food. Energy +${energyChange}, Mood ${moodChange >= 0 ? '+' : ''}${moodChange}`
  };
}

function performTrain(monster: Monster, stats: MonsterStats): Action['result'] {
  // Determine which stat to train based on element
  const trainingStats: (keyof MonsterStats)[] = ['strength', 'intelligence', 'fortitude', 'agility', 'perception'];
  const elementTrainingBias: { [key: string]: keyof MonsterStats } = {
    Fire: 'strength',
    Water: 'agility',
    Nature: 'fortitude',
    Shadow: 'intelligence',
    Lightning: 'perception',
    Earth: 'fortitude'
  };
  
  const targetStat = elementTrainingBias[monster.element] || trainingStats[Math.floor(Math.random() * trainingStats.length)];
  
  // Calculate success chance
  let baseChance = 80;
  
  // Elemental bonus
  if (elementTrainingBias[monster.element] === targetStat) {
    baseChance += 10;
  }
  
  // Mood modifier
  const moodModifier = Math.floor((stats.mood - 50) / 5); // ±10% based on mood
  baseChance += moodModifier;
  
  // Size penalty
  if (monster.sizeCategory === 'Large' && targetStat === 'agility') {
    baseChance -= 15;
  } else if (monster.sizeCategory === 'Small' && targetStat === 'fortitude') {
    baseChance -= 10;
  }
  
  const success = Math.random() * 100 < baseChance;
  
  if (success) {
    const gain = Math.floor(Math.random() * 3) + 1; // 1-3 points
    const moodChange = 5;
    
    return {
      statGains: { [targetStat]: gain },
      moodChange,
      message: `Training successful! ${targetStat.charAt(0).toUpperCase() + targetStat.slice(1)} +${gain}, Mood +${moodChange}`
    };
  } else {
    const moodChange = -5;
    
    return {
      moodChange,
      message: `Training failed! ${monster.name} seems frustrated. Mood ${moodChange}`
    };
  }
}

function performRest(monster: Monster, stats: MonsterStats): Action['result'] {
  let moodChange = 10;
  let energyChange = 40;
  
  // Element-specific rest effects
  switch (monster.element) {
    case 'Nature':
      moodChange = 15; // Nature monsters love rest
      break;
    case 'Lightning':
      moodChange = -5; // Lightning monsters dislike rest
      break;
    case 'Metal':
      if (stats.energy > 70) {
        moodChange = -10; // Metal monsters get restless when not tired
      }
      break;
    case 'Spirit':
      moodChange = Math.floor(Math.random() * 20) + 5; // Spirit monsters have variable rest effects
      break;
  }
  
  return {
    moodChange,
    energyChange,
    message: `${monster.name} rests and recovers. Energy +${energyChange}, Mood ${moodChange >= 0 ? '+' : ''}${moodChange}`
  };
} 