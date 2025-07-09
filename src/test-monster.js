// Simple test to verify monster generation
const { generateMonster } = require('./utils/monsterGenerator');

console.log('🐾 Testing Hashlings Monster Generation\n');

const testUsernames = ['alice', 'bob', 'charlie', 'diana', 'edward'];

testUsernames.forEach(username => {
  console.log(`\n--- Testing username: "${username}" ---`);
  const monster = generateMonster(username);
  
  console.log(`Name: ${monster.name}`);
  console.log(`Species: ${monster.species}`);
  console.log(`Element: ${monster.element}`);
  console.log(`Size: ${monster.sizeCategory} (${monster.baseSize})`);
  console.log('Stats:');
  console.log(`  Strength: ${monster.stats.strength}`);
  console.log(`  Intelligence: ${monster.stats.intelligence}`);
  console.log(`  Fortitude: ${monster.stats.fortitude}`);
  console.log(`  Agility: ${monster.stats.agility}`);
  console.log(`  Perception: ${monster.stats.perception}`);
  console.log(`  Mood: ${monster.stats.mood}`);
  console.log(`  Energy: ${monster.stats.energy}`);
});

console.log('\n✅ Monster generation test complete!'); 