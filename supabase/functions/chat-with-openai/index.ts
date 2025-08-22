import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    // Use the DeepSeek API key from Supabase secrets
    const deepseekApiKey = Deno.env.get('deepseek') || Deno.env.get('DEEPSEEK_API_KEY')
    
    if (!deepseekApiKey) {
      console.error('DeepSeek API key not found in environment variables')
      console.log('Available env vars:', Object.keys(Deno.env.toObject()))
      return new Response(
        JSON.stringify({ error: 'DeepSeek API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log('DeepSeek API Key found:', deepseekApiKey ? 'Yes' : 'No')
    console.log('API Key length:', deepseekApiKey.length)

    // Parse the request body
    const body = await req.json()
    const { messages, model = 'deepseek-chat', max_tokens = 1000, temperature = 0.7 } = body
    
    console.log('Request data:', { model, messages: messages.length, max_tokens, temperature })

    // Make request to DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature,
      }),
    })
    
    console.log('DeepSeek response status:', response.status)

    const data = await response.json()

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || 'DeepSeek API error' }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})