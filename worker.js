const SUPABASE_ORIGIN = 'https://xmyqfbzgkmrjghqjkcu.supabase.co';

export default {
  async fetch(request) {
    // 1. Заголовки для CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,PUT,DELETE,OPTIONS,PATCH",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
      "Access-Control-Max-Age": "86400",
    };

    // 2. Обработка предварительного запроса (Preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 3. Проксирование запроса
    const url = new URL(request.url);
    const targetUrl = SUPABASE_ORIGIN + url.pathname + url.search;
    
    // Создаем новый запрос и подменяем заголовки
    const modifiedRequest = new Request(targetUrl, request);
    modifiedRequest.headers.set('Host', new URL(SUPABASE_ORIGIN).host);
    // Важно: Supabase должен думать, что запрос идет с его же домена, чтобы не блокировать
    modifiedRequest.headers.set('Origin', SUPABASE_ORIGIN); 

    // Выполняем запрос к Supabase
    const response = await fetch(modifiedRequest);

    // 4. Возвращаем ответ с CORS-заголовками
    const newResponse = new Response(response.body, response);
    for (const key in corsHeaders) {
      newResponse.headers.set(key, corsHeaders[key]);
    }
    
    return newResponse;
  }
};
