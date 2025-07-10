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

    // Server-side validation
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    const isNewDay = monster.last_action_date !== today
    const actionsToday = isNewDay ? 0 : monster.actions_today

    if (actionsToday >= 3) {
      throw new Error('You have already performed 3 actions today!')
    }

    // Server-side game logic
    const result = await performActionServerSide(monster, actionType)

    // Update monster in database
    const { error: updateError } = await supabaseClient
      .from('monsters')
      .update({
        stats: result.updatedStats,
        last_action_date: today,
        actions_today: actionsToday + 1
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
          last_action_date: today,
          actions_today: actionsToday + 1
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

// Server-side game logic (same as frontend but secure)
async function performActionServerSide(monster: any, actionType: string) {
  const updatedStats = { ...monster.stats }
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
  const isFavoriteFood = Math.random() < 0.3
  let moodChange = 0
  let energyChange = 20

  if (isFavoriteFood) {
    moodChange = 10
    energyChange = 30
  } else {
    moodChange = Math.floor(Math.random() * 6) - 2
  }

  return {
    moodChange,
    energyChange,
    message: isFavoriteFood 
      ? `${monster.name} loves the food! Mood +${moodChange}`
      : `${monster.name} eats the food. Energy +${energyChange}, Mood ${moodChange >= 0 ? '+' : ''}${moodChange}`
  }
}

function performTrainServerSide(monster: any, stats: any) {
  const trainingStats = ['strength', 'intelligence', 'fortitude', 'agility', 'perception']
  const elementTrainingBias: { [key: string]: string } = {
    Fire: 'strength',
    Water: 'agility',
    Nature: 'fortitude',
    Shadow: 'intelligence',
    Lightning: 'perception',
    Earth: 'fortitude'
  }

  const targetStat = elementTrainingBias[monster.element] || trainingStats[Math.floor(Math.random() * trainingStats.length)]

  let baseChance = 80

  if (elementTrainingBias[monster.element] === targetStat) {
    baseChance += 10
  }

  const moodModifier = Math.floor((stats.mood - 50) / 5)
  baseChance += moodModifier

  if (monster.size_category === 'Large' && targetStat === 'agility') {
    baseChance -= 15
  } else if (monster.size_category === 'Small' && targetStat === 'fortitude') {
    baseChance -= 10
  }

  const success = Math.random() * 100 < baseChance

  if (success) {
    const gain = Math.floor(Math.random() * 3) + 1
    const moodChange = 5

    return {
      statGains: { [targetStat]: gain },
      moodChange,
      message: `Training successful! ${targetStat.charAt(0).toUpperCase() + targetStat.slice(1)} +${gain}, Mood +${moodChange}`
    }
  } else {
    const moodChange = -5
    return {
      moodChange,
      message: `Training failed! ${monster.name} seems frustrated. Mood ${moodChange}`
    }
  }
}

function performRestServerSide(monster: any, stats: any) {
  let moodChange = 10
  let energyChange = 40

  switch (monster.element) {
    case 'Nature':
      moodChange = 15
      break
    case 'Lightning':
      moodChange = -5
      break
    case 'Metal':
      if (stats.energy > 70) {
        moodChange = -10
      }
      break
    case 'Spirit':
      moodChange = Math.floor(Math.random() * 20) + 5
      break
  }

  return {
    moodChange,
    energyChange,
    message: `${monster.name} rests and recovers. Energy +${energyChange}, Mood ${moodChange >= 0 ? '+' : ''}${moodChange}`
  }
} 