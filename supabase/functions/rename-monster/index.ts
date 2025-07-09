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
    const { newName } = await req.json()
    
    // Server-side validation
    if (!newName || typeof newName !== 'string') {
      throw new Error('New name is required')
    }

    const trimmedName = newName.trim()
    if (trimmedName.length === 0) {
      throw new Error('Monster name cannot be empty')
    }

    if (trimmedName.length > 20) {
      throw new Error('Monster name must be 20 characters or less')
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

    // Check if name actually changed
    if (monster.name === trimmedName) {
      throw new Error('New name is the same as current name')
    }

    // Update monster name in database
    const { error: updateError } = await supabaseClient
      .from('monsters')
      .update({ name: trimmedName })
      .eq('id', monster.id)

    if (updateError) {
      throw new Error('Failed to update monster name')
    }

    // Save rename action to database
    const action = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      monster_id: monster.id,
      action_type: 'rename',
      result: {
        message: `Monster renamed to "${trimmedName}"!`
      },
      timestamp: new Date().toISOString()
    }

    const { error: actionError } = await supabaseClient
      .from('actions')
      .insert(action)

    if (actionError) {
      throw new Error('Failed to save rename action')
    }

    return new Response(
      JSON.stringify({
        success: true,
        monster: {
          ...monster,
          name: trimmedName
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