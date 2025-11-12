import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { action, taskId, ...requestData } = await req.json();

    const KIE_API_KEY = Deno.env.get('KIE_API_KEY');
    if (!KIE_API_KEY) {
      throw new Error('KIE_API_KEY not configured');
    }

    const KIE_API_ENDPOINT = 'https://api.kie.ai';

    let apiUrl: string;
    let method = 'POST';
    let body: string | undefined;

    if (action === 'generate') {
      apiUrl = `${KIE_API_ENDPOINT}/api/v1/runway/generate`;
      body = JSON.stringify(requestData);
    } else if (action === 'status') {
      apiUrl = `${KIE_API_ENDPOINT}/api/v1/runway/record-detail?taskId=${taskId}`;
      method = 'GET';
    } else {
      throw new Error('Invalid action');
    }

    console.log('Calling Kie.ai API:', { action, apiUrl });

    const apiResponse = await fetch(apiUrl, {
      method,
      headers: {
        'Authorization': `Bearer ${KIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body
    });

    const responseText = await apiResponse.text();
    console.log('Kie.ai API response:', { status: apiResponse.status, body: responseText });

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { code: apiResponse.status, msg: responseText };
    }

    return new Response(
      JSON.stringify(data),
      {
        status: apiResponse.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error: any) {
    console.error('Error in runway-video-proxy:', error);
    return new Response(
      JSON.stringify({ 
        code: 500, 
        msg: error.message || 'Internal server error',
        error: error.toString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});