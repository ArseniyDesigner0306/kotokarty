export default {
  async fetch(request) {
    // 1. Обработка предварительного запроса (CORS Preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,HEAD,POST,PUT,DELETE,OPTIONS,PATCH",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    // 2. Проксирование запроса в Supabase
    const url = new URL(request.url);
    const targetUrl = "https://xmyqfbzgrmjghqjkcu.supabase.co" + url.pathname + url.search;

    // Создаем новый запрос (НЕ ТРОГАЕМ заголовок Host, Cloudflare сам его поставит)
    const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
    });

    // 3. Выполняем запрос
    const response = await fetch(modifiedRequest);

    // 4. Возвращаем ответ с CORS-заголовками
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,DELETE,OPTIONS,PATCH");
    newResponse.headers.set("Access-Control-Allow-Headers", "*");

    return newResponse;
  }
};
