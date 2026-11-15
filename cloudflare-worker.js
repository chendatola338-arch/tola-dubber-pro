/**
 * Cloudflare Worker Proxy for ABA PayWay (JLA Gateway)
 * 
 * របៀបដំឡើង (Setup Instructions):
 * 1. ចូលទៅកាន់ Cloudflare Dashboard (https://dash.cloudflare.com)
 * 2. ជ្រើសរើស Workers & Pages -> Create Application -> Create Worker
 * 3. ចុច "Deploy" បន្ទាប់មកចុច "Edit code"
 * 4. Copy កូដខាងក្រោមនេះទាំងស្រុងទៅ Paste ជំនួសកូដចាស់ រួចចុច "Deploy"
 * 5. អ្នកនឹងទទួលបាន URL មួយ (ឧ. https://payway-proxy.your-name.workers.dev)
 * 6. យក URL នោះមកដាក់ក្នុង TOLA Dubber PRO ជាការស្រេច!
 */

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "*";

    // Handle CORS preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    try {
      const url = new URL(request.url);
      const targetUrl = "https://payway.jlastore.com" + url.pathname + url.search;

      const reqHeaders = new Headers(request.headers);
      reqHeaders.set("Host", "payway.jlastore.com");
      reqHeaders.set("Referer", "https://payway.jlastore.com/");
      reqHeaders.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
      reqHeaders.delete("Origin");

      const body = (request.method !== "GET" && request.method !== "HEAD") ? await request.arrayBuffer() : undefined;

      const response = await fetch(targetUrl, {
        method: request.method,
        headers: reqHeaders,
        body: body
      });

      const resHeaders = new Headers(response.headers);
      resHeaders.set("Access-Control-Allow-Origin", origin);
      resHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      resHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: resHeaders
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin
        }
      });
    }
  }
};
