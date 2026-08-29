export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let response = await env.ASSETS.fetch(request);
    
    // SPA fallback: If asset not found and not a file with extension, serve index.html
    if (response.status === 404 && !url.pathname.split('/').pop().includes('.')) {
      const indexRequest = new Request(new URL('/index.html', request.url), request);
      response = await env.ASSETS.fetch(indexRequest);
    }
    
    return response;
  }
};
