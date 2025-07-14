import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse request body
    const { actionType } = await req.json()
    
    if (!actionType || !['feed', 'train', 'rest'].includes(actionType)) {
      throw new Error('Invalid action type')
    }

    // Get user's monster
    const { data: monster, error: monsterError } = await supabaseClient
      .from('monsters')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (monsterError || !monster) {
      throw new Error('Monster not found')
    }

    // Calculate passive energy regeneration since last action
    const updatedStats = calculatePassiveEnergyRegen(monster.stats, monster.last_action_date || new Date().toISOString())

    // Check energy requirements for actions
    const energyCosts = { feed: 10, train: 30, rest: 0 }
    const energyCost = energyCosts[actionType as keyof typeof energyCosts]
    
    if (actionType !== 'rest' && updatedStats.energy < energyCost) {
      throw new Error(`Not enough energy! ${actionType} requires ${energyCost} energy, but you only have ${updatedStats.energy}.`)
    }

    // Check energy threshold for training
    if (actionType === 'train' && updatedStats.energy < 20) {
      throw new Error(`${monster.name} is too tired to train! Energy must be at least 20.`)
    }

    // Server-side game logic
    const result = await performActionServerSide(monster, actionType, updatedStats)

    // Update monster in database
    const { error: updateError } = await supabaseClient
      .from('monsters')
      .update({
        stats: result.updatedStats,
        last_action_date: new Date().toISOString()
      })
      .eq('id', monster.id)

    if (updateError) {
      throw new Error('Failed to update monster')
    }

    // Save action to database
    const action = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      monster_id: monster.id,
      action_type: actionType,
      result: result.actionResult,
      timestamp: new Date().toISOString()
    }

    const { error: actionError } = await supabaseClient
      .from('actions')
      .insert(action)

    if (actionError) {
      throw new Error('Failed to save action')
    }

    return new Response(
      JSON.stringify({
        success: true,
        monster: {
          ...monster,
          stats: result.updatedStats,
          last_action_date: new Date().toISOString()
        },
        action
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

// Calculate passive energy regeneration since last action
function calculatePassiveEnergyRegen(stats: any, lastActionDate: string) {
  const now = new Date()
  const lastAction = new Date(lastActionDate || now.toISOString())
  const hoursSinceLastAction = (now.getTime() - lastAction.getTime()) / (1000 * 60 * 60)
  
  // Base energy regeneration: +5 per hour
  let energyRegen = Math.floor(hoursSinceLastAction * 5)
  
  // Mood affects energy regeneration
  if (stats.mood >= 80) {
    // Joyful: +1 bonus regen per hour
    energyRegen += Math.floor(hoursSinceLastAction * 1)
  } else if (stats.mood < 20) {
    // Rebellious: No passive regen
    energyRegen = 0
  } else if (stats.mood < 50) {
    // Moody: -1 regen per hour
    energyRegen -= Math.floor(hoursSinceLastAction * 1)
  }
  
  const updatedStats = { ...stats }
  updatedStats.energy = Math.min(100, Math.max(0, stats.energy + energyRegen))
  
  return updatedStats
}

// Server-side game logic
async function performActionServerSide(monster: any, actionType: string, stats: any) {
  const updatedStats = { ...stats }
  let actionResult: any

  switch (actionType) {
    case 'feed':
      actionResult = performFeedServerSide(monster, updatedStats)
      break
    case 'train':
      actionResult = performTrainServerSide(monster, updatedStats)
      break
    case 'rest':
      actionResult = performRestServerSide(monster, updatedStats)
      break
    default:
      throw new Error('Invalid action type')
  }

  // Apply stat changes
  if (actionResult.statGains) {
    Object.entries(actionResult.statGains).forEach(([stat, value]) => {
      if (value !== undefined) {
        (updatedStats as any)[stat] = Math.max(0, Math.min(100, (updatedStats as any)[stat] + value))
      }
    })
  }

  // Apply mood change
  if (actionResult.moodChange) {
    updatedStats.mood = Math.max(0, Math.min(100, updatedStats.mood + actionResult.moodChange))
  }

  // Apply energy change
  if (actionResult.energyChange) {
    updatedStats.energy = Math.max(0, Math.min(100, updatedStats.energy + actionResult.energyChange))
  }

  return { updatedStats, actionResult }
}

function performFeedServerSide(monster: any, stats: any) {
  // Energy cost for feeding
  const energyCost = 10
  
  // Check if monster has enough energy
  if (stats.energy < energyCost) {
    throw new Error(`Not enough energy! Feeding requires ${energyCost} energy.`)
  }

  const isFavoriteFood = Math.random() < 0.3
  let moodChange = 0
  let energyChange = 20 - energyCost // Net energy gain

  if (isFavoriteFood) {
    moodChange = 10
    energyChange = 30 - energyCost
  } else {
    moodChange = Math.floor(Math.random() * 6) - 2
  }

  // Element-specific mood effects
  switch (monster.element) {
    case 'Fire':
      if (moodChange > 5) moodChange = Math.min(moodChange, 5) // Fire monsters get angry if overfed
      break
    case 'Water':
      if (Math.random() < 0.2) moodChange += 5 // Water monsters love food
      break
    case 'Earth':
      if (Math.random() < 0.3) moodChange -= 3 // Earth monsters sometimes dislike food
      break
  }

  return {
    moodChange,
    energyChange,
    message: isFavoriteFood 
      ? `${monster.name} loves the food! Mood +${moodChange}, Energy +${energyChange}`
      : `${monster.name} eats the food. Energy +${energyChange}, Mood ${moodChange >= 0 ? '+' : ''}${moodChange}`
  }
}

function performTrainServerSide(monster: any, stats: any) {
  // Energy cost for training
  const energyCost = 30
  
  // Check if monster has enough energy
  if (stats.energy < energyCost) {
    throw new Error(`Not enough energy! Training requires ${energyCost} energy.`)
  }

  // Check energy threshold
  if (stats.energy < 20) {
    throw new Error(`${monster.name} is too tired to train! Energy must be at least 20.`)
  }

  const trainingStats = ['strength', 'intelligence', 'fortitude', 'agility', 'perception']
  const elementTrainingBias: { [key: string]: string } = {
    Fire: 'strength',
    Water: 'agility',
    Nature: 'fortitude',
    Shadow: 'intelligence',
    Spirit: 'intelligence', // Spirit has mood-based growth
    Metal: 'fortitude', // Metal has slower growth
    Lightning: 'perception',
    Earth: 'fortitude'
  }

  const targetStat = elementTrainingBias[monster.element] || trainingStats[Math.floor(Math.random() * trainingStats.length)]

  let baseChance = 80

  // Elemental bonus
  if (elementTrainingBias[monster.element] === targetStat) {
    baseChance += 10
  }

  // Mood modifier
  const moodModifier = Math.floor((stats.mood - 50) / 5) // ±10% based on mood
  baseChance += moodModifier

  // Size penalty
  if (monster.size_category === 'Large' && targetStat === 'agility') {
    baseChance -= 15
  } else if (monster.size_category === 'Small' && targetStat === 'fortitude') {
    baseChance -= 10
  }

  const success = Math.random() * 100 < baseChance

  if (success) {
    const gain = Math.floor(Math.random() * 3) + 1 // 1-3 points
    const moodChange = 5
    const energyChange = -energyCost // Consume energy

    return {
      statGains: { [targetStat]: gain },
      moodChange,
      energyChange,
      message: `Training successful! ${targetStat.charAt(0).toUpperCase() + targetStat.slice(1)} +${gain}, Mood +${moodChange}, Energy -${energyCost}`
    }
  } else {
    const moodChange = -5
    const energyChange = -energyCost // Still consume energy even on failure

    return {
      moodChange,
      energyChange,
      message: `Training failed! ${monster.name} seems frustrated. Mood ${moodChange}, Energy -${energyCost}`
    }
  }
}

function performRestServerSide(monster: any, stats: any) {
  // Rest doesn't cost energy, but disables other actions for 1 cycle
  let moodChange = 10
  let energyChange = 40 // Immediate energy boost

  // Element-specific rest effects
  switch (monster.element) {
    case 'Nature':
      moodChange = 15 // Nature monsters love rest
      break
    case 'Lightning':
      moodChange = -5 // Lightning monsters dislike rest
      break
    case 'Metal':
      if (stats.energy > 70) {
        moodChange = -10 // Metal monsters get restless when not tired
      }
      break
    case 'Spirit':
      moodChange = Math.floor(Math.random() * 20) + 5 // Spirit monsters have variable rest effects
      break
  }

  return {
    moodChange,
    energyChange,
    message: `${monster.name} rests and recovers. Energy +${energyChange}, Mood ${moodChange >= 0 ? '+' : ''}${moodChange}`
  }
} 