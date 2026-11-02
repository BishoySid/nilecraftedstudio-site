/*!
 * Nile Crafted Studio - loads the Lotus Egg into the music button once the page has finished loading,
 * so the homepage itself stays fast, and sprinkles golden pixie dust around it to draw the eye.
 * If the visitor's browser can't show 3D (no WebGL, very old browser, data saver on), the classic gold
 * music button simply stays as it is.
 */
(function () {
  'use strict';
  var btn = document.getElementById('musicBtn'), stage = document.getElementById('lotusEggStage');
  if (!btn || !stage) return;

  function canShow() {
    try {
      if (!window.Promise || !window.DecompressionStream || !window.ResizeObserver || !window.MutationObserver) return false;
      var c = navigator.connection;
      if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return false;
      var cv = document.createElement('canvas');
      return !!(cv.getContext('webgl') || cv.getContext('experimental-webgl'));
    } catch (e) { return false; }
  }
  if (!canShow()) return;

  var V = '20261102b';
  function load(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = src + '?v=' + V; s.async = false;
      s.onload = ok; s.onerror = fail;
      document.body.appendChild(s);
    });
  }
  function start() {
    load('three-r128.min.js')
      .then(function () { return load('nile-lotus-data.js'); })
      .then(function () { return load('nile-lotus-scene.js'); })
      .then(function () { pixieDust(); })
      .catch(function () { btn.classList.remove('egg-ready'); });
  }
  function whenIdle() {
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2500 }); else setTimeout(start, 600);
  }
  if (document.readyState === 'complete') whenIdle(); else window.addEventListener('load', whenIdle);

  // ---------------------------------------------------------------------------------------------
  // Pixie dust: golden sparkles drawn on a see-through layer around the egg (it never blocks taps).
  //  - arrival: a sparkling comet spirals in around the egg and bursts into dust over it
  //  - while the music plays: a gentle stream of dust rises from the open egg
  //  - while it's off: a few twinkles every few seconds, so visitors notice where the music lives
  // Visitors who ask their device for reduced motion get a single soft shimmer instead.
  // ---------------------------------------------------------------------------------------------
  function pixieDust() {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var PAD_L = 230, PAD_T = 250, PAD_R = 14, PAD_B = 14;     // how far the dust may travel around the egg
    var cv = document.createElement('canvas');
    cv.className = 'lotus-dust'; cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    var g = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, bx = 0, by = 0, bw = 0, bh = 0;

    function place() {
      var r = btn.getBoundingClientRect();
      bw = r.width; bh = r.height;
      W = Math.round(bw + PAD_L + PAD_R); H = Math.round(bh + PAD_T + PAD_B);
      cv.style.left = Math.round(r.left - PAD_L) + 'px'; cv.style.top = Math.round(r.top - PAD_T) + 'px';
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      bx = PAD_L; by = PAD_T;
    }
    place();
    window.addEventListener('resize', place);
    if (window.ResizeObserver) new ResizeObserver(place).observe(btn);

    // one soft four-point star sprite, tinted gold or pale champagne
    function sprite(core, glow, rim) {
      var s = document.createElement('canvas'); s.width = s.height = 64;
      var q = s.getContext('2d'), rg = q.createRadialGradient(32, 32, 0, 32, 32, 32);
      rg.addColorStop(0, core); rg.addColorStop(.16, glow); rg.addColorStop(.32, rim); rg.addColorStop(.5, 'rgba(200,140,50,0)');
      q.fillStyle = rg; q.fillRect(0, 0, 64, 64);
      function ray(a, len, w) {
        q.save(); q.translate(32, 32); q.rotate(a);
        var lg = q.createLinearGradient(0, 0, 0, -len); lg.addColorStop(0, core); lg.addColorStop(.55, glow); lg.addColorStop(1, 'rgba(214,160,70,0)');
        q.fillStyle = lg; q.beginPath(); q.moveTo(-w, 0); q.quadraticCurveTo(-w * .2, -len * .4, 0, -len);
        q.quadraticCurveTo(w * .2, -len * .4, w, 0); q.closePath(); q.fill(); q.restore();
      }
      for (var k = 0; k < 4; k++) ray(k * Math.PI / 2, 30, 3.2);
      for (k = 0; k < 4; k++) ray(Math.PI / 4 + k * Math.PI / 2, 11, 2);
      return s;
    }
    var GOLD = sprite('rgba(255,250,232,1)', 'rgba(240,190,90,.95)', 'rgba(190,130,45,.35)');
    var PALE = sprite('rgba(255,255,248,1)', 'rgba(232,184,96,.9)', 'rgba(176,118,40,.3)');
    var ROSE = sprite('rgba(255,246,242,1)', 'rgba(214,140,128,.9)', 'rgba(170,96,86,.3)');

    var P = [], comet = null, last = 0, raf = 0, idleT = 0, nextIdle = 2.5, arrivalDone = false;
    function eggX() { return bx + bw * .5; }
    function eggY() { return by + bh * (btn.classList.contains('on') ? .42 : .3); }
    function add(x, y, vx, vy, life, size, img) {
      if (P.length > 260) return;
      P.push({ x: x, y: y, vx: vx, vy: vy, t: 0, life: life, s: size, img: img || (Math.random() < .7 ? GOLD : (Math.random() < .6 ? PALE : ROSE)),
               tw: Math.random() * 6.28, tws: 6 + Math.random() * 8, rot: Math.random() * .8 });
    }
    function burst(n, spread, up) {
      for (var i = 0; i < n; i++) {
        var a = Math.random() * 6.283, v = 15 + Math.random() * spread;
        add(eggX() + (Math.random() - .5) * bw * .3, eggY() + (Math.random() - .5) * bh * .2,
            Math.cos(a) * v, Math.sin(a) * v - up, 1.6 + Math.random() * 1.8, 10 + Math.random() * 14);
      }
    }
    function startComet() {
      // spirals in from the upper left, circles the egg twice, then bursts over it
      comet = { t: 0, dur: 3.2 };
    }
    function stepComet(dt) {
      comet.t += dt;
      var k = Math.min(1, comet.t / comet.dur), e = 1 - Math.pow(1 - k, 2.2);
      var turns = 2.15, ang = -2.4 + e * turns * 6.283;
      var rad = (1 - e) * 170 + e * bw * .42;
      var cx = eggX(), cy = eggY() + bh * .08;
      var x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad * .62 - (1 - e) * 40;
      for (var i = 0; i < 3; i++) add(x + (Math.random() - .5) * 6, y + (Math.random() - .5) * 6,
        (Math.random() - .5) * 18, 8 + Math.random() * 16, .9 + Math.random() * 1, 9 + Math.random() * 10);
      add(x, y, 0, 0, .14, 34, PALE);                    // the bright head of the comet
      if (k >= 1) { comet = null; burst(46, 70, 40); arrivalDone = true; }
    }

    function frame(now) {
      raf = 0;
      var dt = Math.min(.05, last ? (now - last) / 1000 : .016); last = now;
      var on = btn.classList.contains('on');
      if (comet) stepComet(dt);
      if (on) {                                            // gentle stream rising from the open egg
        if (Math.random() < dt * 11) add(eggX() + (Math.random() - .5) * bw * .45, eggY() + (Math.random() - .3) * bh * .25,
          (Math.random() - .5) * 14, -18 - Math.random() * 22, 2.4 + Math.random() * 1.8, 9 + Math.random() * 11);
      } else if (arrivalDone) {                            // a little shimmer every few seconds while the music is off
        idleT += dt;
        if (idleT > nextIdle) { idleT = 0; nextIdle = 4 + Math.random() * 3; burst(10, 34, 24); }
      }
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      g.globalCompositeOperation = 'source-over';
      for (var i = P.length - 1; i >= 0; i--) {
        var p = P[i]; p.t += dt;
        if (p.t >= p.life) { P.splice(i, 1); continue; }
        p.vy += -6 * dt; p.vx *= (1 - .6 * dt); p.vy *= (1 - .4 * dt);
        p.x += p.vx * dt + Math.sin(p.t * 2 + p.tw) * 6 * dt; p.y += p.vy * dt;
        var f = p.t / p.life, fade = f < .15 ? f / .15 : 1 - (f - .15) / .85;
        var tw = .55 + .45 * Math.sin(p.tw + p.t * p.tws), a = Math.max(0, fade * tw), s = p.s * (.7 + .3 * tw);
        g.globalAlpha = a;
        g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.drawImage(p.img, -s / 2, -s / 2, s, s); g.restore();
      }
      g.globalAlpha = 1;
      if (!document.hidden) raf = requestAnimationFrame(frame);
    }
    function go() { if (!raf && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) go(); });

    if (reduce) {
      // no moving dust: one soft shimmer on arrival, then a gentle glow while the music plays
      btn.classList.add('egg-shimmer');
      setTimeout(function () { btn.classList.remove('egg-shimmer'); }, 2600);
      return;
    }
    startComet(); go();
    // a fresh sprinkle whenever the music is turned on
    var wasOn = btn.classList.contains('on');
    new MutationObserver(function () {
      var on = btn.classList.contains('on');
      if (on && !wasOn) burst(36, 60, 30);
      wasOn = on;
    }).observe(btn, { attributes: true, attributeFilter: ['class'] });
  }
})();
