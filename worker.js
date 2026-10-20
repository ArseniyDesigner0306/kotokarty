const SUPABASE_ORIGIN = 'https://xmyqfbzgrmjghqjkcu.supabase.co';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetUrl = SUPABASE_ORIGIN + url.pathname + url.search;
    const modifiedRequest = new Request(targetUrl, request);
    modifiedRequest.headers.set('Host', new URL(SUPABASE_ORIGIN).host);
    return fetch(modifiedRequest);
  }
};
