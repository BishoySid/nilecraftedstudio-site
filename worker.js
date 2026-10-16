/**
 * Nile Crafted Studio — serves the static site from this repo.
 * While the site is private, every request needs the site password first.
 */
export default {
  async fetch(request, env) {
    const locked = await passwordGate(request, env);
    if (locked) return locked;
    return noindex(await env.ASSETS.fetch(request));
  }
};

// ---------------------------------------------------------------------------
// Password lock (temporary, while the site is private).
// The password lives in the Worker secret SITE_PASSWORD (Cloudflare dashboard →
// this Worker → Settings → Variables and Secrets). Any username works.
// To open the site to the public, remove the two `locked` lines at the top of fetch().
// ---------------------------------------------------------------------------
async function passwordGate(request, env) {
  const password = env.SITE_PASSWORD;
  if (!password) {
    return new Response('This site is private.', {
      status: 503,
      headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' },
    });
  }
  const header = request.headers.get('Authorization') || '';
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const supplied = decoded.slice(decoded.indexOf(':') + 1);
      if (await sameText(supplied, password)) return null; // allowed
    } catch (_) { /* malformed header → ask again */ }
  }
  return new Response('Password required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Private preview", charset="UTF-8"',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  });
}

async function sameText(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  const x = new Uint8Array(ha), y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function noindex(res) {
  const out = new Response(res.body, res);
  out.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return out;
}
