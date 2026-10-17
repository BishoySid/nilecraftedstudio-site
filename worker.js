/**
 * Nile Crafted Studio — serves the static site from this repo.
 * Password lock is available but currently switched off (see fetch below).
 */
export default {
  async fetch(request, env) {
    // Password lock is OFF. To turn it back on, uncomment the next two lines.
    // const locked = await passwordGate(request, env);
    // if (locked) return locked;
    return finish(await env.ASSETS.fetch(request));
  }
};

// ---------------------------------------------------------------------------
// Password lock (currently switched off).
// The password lives in the Worker secret SITE_PASSWORD (Cloudflare dashboard →
// this Worker → Settings → Variables and Secrets). Any username works.
// To lock the site again, uncomment the two `locked` lines at the top of fetch().
// ---------------------------------------------------------------------------
async function passwordGate(request, env) {
  const password = env.SITE_PASSWORD;
  if (!password) {
    return secure(new Response('This site is private.', {
      status: 503,
      headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' },
    }));
  }
  const header = request.headers.get('Authorization') || '';
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const supplied = decoded.slice(decoded.indexOf(':') + 1);
      if (await sameText(supplied, password)) return null; // allowed
    } catch (_) { /* malformed header → ask again */ }
  }
  return secure(new Response('Password required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Private preview", charset="UTF-8"',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  }));
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

// The site is public, so search engines are allowed to index it.
function finish(res) {
  return secure(new Response(res.body, res));
}

// Security headers (applied to every response the Worker serves).
function secure(out) {
  const h = out.headers;
  h.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('X-Frame-Options', 'DENY');
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()');
  h.set('Cross-Origin-Opener-Policy', 'same-origin');
  h.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none'; upgrade-insecure-requests");
  return out;
}
