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
    // Parse the request body
    const body = await req.json()
    const { messages, model = 'gpt-4o-mini', max_tokens = 1000, temperature = 0.7, provider = 'openai' } = body
    
    console.log('Request data:', { provider, model, messages: messages.length, max_tokens, temperature })

    let apiKey: string | undefined
    let apiUrl: string
    let requestBody: any

    if (provider === 'openai') {
      // Use OpenAI API
      apiKey = Deno.env.get('OPENAI_API_KEY')
      if (!apiKey) {
        console.error('OpenAI API key not found in environment variables')
        return new Response(
          JSON.stringify({ error: 'OpenAI API key not configured' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      apiUrl = 'https://api.openai.com/v1/chat/completions'
      
      // Handle newer models that use max_completion_tokens instead of max_tokens
      const isNewerModel = model.includes('gpt-5') || model.includes('gpt-4.1') || model.includes('o3') || model.includes('o4')
      requestBody = {
        model,
        messages,
        ...(isNewerModel ? { max_completion_tokens: max_tokens } : { max_tokens }),
        ...(isNewerModel ? {} : { temperature }), // Newer models don't support temperature
      }
    } else {
      // Use DeepSeek API (default)
      apiKey = Deno.env.get('DEEPSEEK_V3_API_KEY') || Deno.env.get('deepseek') || Deno.env.get('DEEPSEEK_API_KEY')
      if (!apiKey) {
        console.error('DeepSeek API key not found in environment variables')
        return new Response(
          JSON.stringify({ error: 'DeepSeek API key not configured' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      apiUrl = 'https://api.deepseek.com/v1/chat/completions'
      requestBody = {
        model: model === 'gpt-4o-mini' ? 'deepseek-chat' : model,
        messages,
        max_tokens,
        temperature,
      }
    }
    
    console.log('API Key found:', apiKey ? 'Yes' : 'No')
    console.log('API URL:', apiUrl)

    // Make request to the selected API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    
    console.log('API response status:', response.status)

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