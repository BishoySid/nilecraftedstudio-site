/*!
 * Nile Crafted Studio - page behaviour (menu, announcement bar, founder reveal, reveal-on-scroll).
 * Kept in its own file so the security policy can block all inline scripts.
 */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile menu
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
    });
  }

  // Announcement rotator (pauses on hover/focus and when the tab is hidden)
  var msgs = [
    'Custom Designs &nbsp;&#10022;&nbsp; Meaningful Gifts &nbsp;&#10022;&nbsp; Everyday Luxury',
    'Local Delivery on Staten Island &nbsp;&#10022;&nbsp; Shipping Across the US &amp; Internationally',
    'Now Taking Bridal &amp; Bridal Party Orders',
    'Now Taking Custom &amp; Group Orders'
  ], i = 0, el = document.getElementById('annText'), bar = document.querySelector('.announce'), paused = false;
  function show(n) {
    if (!el) return;
    i = (n + msgs.length) % msgs.length; el.style.opacity = 0;
    setTimeout(function () { el.innerHTML = msgs[i]; el.style.opacity = 1; }, 250);
  }
  var prev = document.getElementById('annPrev'), next = document.getElementById('annNext');
  if (prev) prev.addEventListener('click', function () { show(i - 1); });
  if (next) next.addEventListener('click', function () { show(i + 1); });
  if (bar) {
    bar.addEventListener('mouseenter', function () { paused = true; });
    bar.addEventListener('mouseleave', function () { paused = false; });
    bar.addEventListener('focusin', function () { paused = true; });
    bar.addEventListener('focusout', function () { paused = false; });
  }
  setInterval(function () { if (!paused && !document.hidden) show(i + 1); }, 6000);

  // Founder heading "ink" reveal
  var f = document.getElementById('founder');
  if (f) {
    if (!('IntersectionObserver' in window)) { f.classList.add('is-visible'); }
    else {
      f.classList.add('will-animate');
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { f.classList.add('is-visible'); io.disconnect(); } });
      }, { threshold: 0.6 });
      io.observe(f.querySelector('.founder-title') || f);
    }
  }

  // Gentle fade-up for elements marked .reveal
  var rs = document.querySelectorAll('.reveal');
  if (rs.length) {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rs.forEach(function (r) { r.classList.add('in'); });
    } else {
      document.documentElement.classList.add('js-reveal');
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      rs.forEach(function (r) { ro.observe(r); });
    }
  }

  // FAQ: only one answer open at a time
  var faqs = document.querySelectorAll('.faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
})();
