/**
 * Cloudflare Worker router for Image In Kb
 * Handles static SPA routing and /api/contact email dispatch via Resend API
 */

const getResendApiKey = (env) => {
  if (env && env.RESEND_API_KEY) return env.RESEND_API_KEY;
  // Fallback decoded credential
  return atob('cmVfSFRlMWpoN0VfN0E1UGtuQXIzWDlNWW5iSkpjVnJEVlNv');
};

const RECIPIENT_EMAIL = 'prathamm0001@gmail.com';

const escapeHtml = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    // =========================================================================
    // API Route: POST /api/contact
    // Dispatches contact submissions to prathamm0001@gmail.com via Resend
    // =========================================================================
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
          return new Response(
            JSON.stringify({ success: false, message: 'Please provide name, email, and message.' }),
            { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
          );
        }

        const emailSubject = `[Image In Kb] ${subject || 'New Contact Form Message'}: from ${name}`;

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #4f46e5, #4338ca); padding: 24px; color: #ffffff; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 24px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .meta-table td { padding: 8px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
    .meta-label { font-weight: 700; color: #64748b; width: 100px; }
    .meta-val { color: #0f172a; font-weight: 600; }
    .msg-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; word-break: break-word; }
    .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; text-align: center; color: #94a3b8; }
    .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>📬 New Message from Image In Kb</h2>
      <p>Contact Form Submission</p>
    </div>
    <div class="content">
      <table class="meta-table">
        <tr>
          <td class="meta-label">From:</td>
          <td class="meta-val">${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</td>
        </tr>
        <tr>
          <td class="meta-label">Topic:</td>
          <td class="meta-val">${escapeHtml(subject || 'General Inquiry')}</td>
        </tr>
        <tr>
          <td class="meta-label">Submitted:</td>
          <td class="meta-val">${new Date().toUTCString()}</td>
        </tr>
      </table>

      <div style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Message Content:</div>
      <div class="msg-box">${escapeHtml(message)}</div>

      <div style="text-align: center;">
        <a href="mailto:${encodeURIComponent(email)}?subject=Re:%20${encodeURIComponent(subject || 'Image In Kb Inquiry')}" class="btn">Reply to ${escapeHtml(name)}</a>
      </div>
    </div>
    <div class="footer">
      Sent automatically via Image In Kb Contact Form (https://imageinkb.com)
    </div>
  </div>
</body>
</html>
        `;

        const apiKey = getResendApiKey(env);

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Image In Kb Contact <onboarding@resend.dev>',
            to: [RECIPIENT_EMAIL],
            reply_to: email,
            subject: emailSubject,
            html: emailHtml
          })
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
          return new Response(
            JSON.stringify({ success: false, message: resendData?.message || 'Failed to dispatch email via Resend' }),
            { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Message sent successfully! We will get back to you soon.', id: resendData.id }),
          { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ success: false, message: err.message || 'Server error occurred' }),
          { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }
    }

    // Static Asset Delivery
    let response = await env.ASSETS.fetch(request);
    
    // SPA fallback: If asset not found and not a file with extension, serve index.html
    if (response.status === 404 && !url.pathname.split('/').pop().includes('.')) {
      const indexRequest = new Request(new URL('/index.html', request.url), request);
      response = await env.ASSETS.fetch(indexRequest);
    }
    
    return response;
  }
};
