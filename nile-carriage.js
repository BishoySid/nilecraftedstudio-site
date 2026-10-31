/*!
 * Nile Crafted Studio - Weddings carriage.
 * Tapping the carriage zooms in, its two doors swing open, and the wedding gift planning options appear inside.
 * Options with data-quote are handled by nile-quote.js (opens the order form pre-filled).
 */
(function () {
  'use strict';
  var stage = document.getElementById('wcStage');
  if (!stage) return;
  var outside = stage.querySelector('.wc-s1'), inside = stage.querySelector('.wc-s2');
  var heading = document.getElementById('wcInsideTitle'), carriage = stage.querySelector('.wc-cbtn');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = null;

  function setInert(el, on) {
    if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
    else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
  }

  function open() {
    if (stage.classList.contains('wc-open')) return;
    stage.classList.add('wc-open');
    setInert(outside, true);
    setInert(inside, false);
    clearTimeout(timer);
    timer = setTimeout(function () { if (heading) heading.focus({ preventScroll: true }); }, reduce ? 300 : 2700);
    try { if (window.gtag) gtag('event', 'wedding_carriage_open'); } catch (_) {}
  }

  function close(returnFocus) {
    if (!stage.classList.contains('wc-open')) return;
    stage.classList.remove('wc-open');
    setInert(inside, true);
    setInert(outside, false);
    clearTimeout(timer);
    if (returnFocus && carriage) carriage.focus({ preventScroll: true });
  }

  setInert(inside, true);
  stage.addEventListener('click', function (e) {
    if (e.target.closest('[data-wc-open]')) { e.preventDefault(); open(); }
    else if (e.target.closest('[data-wc-close]')) { e.preventDefault(); close(true); }
    else if (e.target.closest('[data-wc-leave]')) { close(false); }   // e.g. "Gift Timeline": close the doors and follow the link
  });
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && stage.classList.contains('wc-open')) close(true);
  });

  // #weddings-open deep link opens the doors
  if (location.hash === '#weddings-open') setTimeout(open, 600);

  // Pause the idle animation while the carriage is off screen (saves battery on phones)
  if ('IntersectionObserver' in window) {
    stage.classList.add('wc-paused');
    new IntersectionObserver(function (es) {
      es.forEach(function (en) { stage.classList.toggle('wc-paused', !en.isIntersecting); });
    }, { rootMargin: '100px 0px' }).observe(stage);
  }
})();
