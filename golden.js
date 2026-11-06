/* Preview only: places the real site blocks on either side of the golden line. */
(function () {
  'use strict';
  var blocks = {};
  document.querySelectorAll('#glBlocks [data-b]').forEach(function (b) { blocks[b.getAttribute('data-b')] = b; });
  var LAYOUTS = {
    c: { L: ['weddings'], R: ['shop'], Mid: ['quick', 'steps'], L2: ['story'], R2: ['gallery'], tabs: ['Weddings', 'Shop'] },
  };
  var first = document.getElementById('glFirst');
  var tabL = document.getElementById('glTabL'), tabR = document.getElementById('glTabR');
  var cats = document.getElementById('glCats'), slot = document.getElementById('glBridalSlot');
  var bridal = document.querySelector('.cat-bridal');

  function side(s) {
    first.setAttribute('data-side', s);
    tabL.setAttribute('aria-selected', s === 'L'); tabR.setAttribute('aria-selected', s === 'R');
  }
  function layout(k, keepScroll) {
    var L = LAYOUTS[k];
    document.body.setAttribute('data-layout', k);
    ['L', 'R', 'Mid', 'L2', 'R2'].forEach(function (id) {
      var c = document.getElementById(id);
      L[id].forEach(function (n) { c.appendChild(blocks[n]); });
    });
    if (k === 'b') slot.appendChild(bridal); else cats.insertBefore(bridal, cats.firstChild);
    var feat = document.querySelector('.features'), tl = document.getElementById('glTimeline');
    document.getElementById(k === 'c' ? 'glFeatC' : 'glFeatTop').appendChild(feat);
    if (k === 'c') document.getElementById('Mid').appendChild(tl); else blocks.weddings.appendChild(tl);
    var pil = document.getElementById('glPillars');
    if (k === 'c') { blocks.gallery.appendChild(pil); pil.open = true; } else { blocks.story.appendChild(pil); pil.open = false; }
    document.querySelectorAll('[data-a]').forEach(function (el) { el.innerHTML = el.getAttribute(k === 'a' ? 'data-a' : k === 'c' ? 'data-c' : 'data-bb'); });
    tabL.textContent = L.tabs[0]; tabR.textContent = L.tabs[1];
    document.querySelectorAll('[data-layout]').forEach(function (b) { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', b.getAttribute('data-layout') === k); });
    side('L');
    if (!keepScroll) window.scrollTo(0, 0);
  }
  var apparel = document.getElementById('apparel');
  function showApparel() { apparel.hidden = false; window.dispatchEvent(new Event('resize')); }
  function reveal(id) {
    var el = document.getElementById(id); if (!el) return;
    if (id === 'apparel') { showApparel(); return; }
    for (var p = el; p; p = p.parentElement) {
      if (p.tagName === 'DETAILS') p.open = true;
      if (p.id === 'L') side('L');
      if (p.id === 'R') side('R');
    }
  }
  tabL.addEventListener('click', function () { side('L'); });
  tabR.addEventListener('click', function () { side('R'); });
  document.getElementById('glApparelClose').addEventListener('click', function () { apparel.hidden = true; });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (a && !a.hasAttribute('data-quote') && a.getAttribute('href').length > 1) {
      var id = a.getAttribute('href').slice(1);
      reveal(id);
      if (id === 'apparel') { e.preventDefault(); apparel.scrollIntoView({ block: 'start' }); }
    }
  }, true);
  document.addEventListener('submit', function (e) {
    var c = e.target.querySelector && e.target.querySelector('[name=qs-cat]');
    if (c && c.value === 'Personalized Apparel') showApparel();
  }, true);
  // --- polish ---
  var stage = document.getElementById('wcStage');
  stage.addEventListener('click', function (e) {
    if (e.target.closest('[data-gl-fast]')) stage.classList.add('wc-fast');
    if (e.target.closest('[data-wc-open]') && innerWidth <= 1100) setTimeout(function () { stage.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 60);
    else if (e.target.closest('[data-wc-close]') || e.target.closest('[data-wc-leave]')) setTimeout(function () { stage.classList.remove('wc-fast'); }, 300);
  }, true);
  var tabsEl = document.querySelector('.gl-tabs');
  function toTabs() { var t = tabsEl.getBoundingClientRect().top + scrollY - 76; if (scrollY > t) window.scrollTo(0, t); }
  tabL.addEventListener('click', toTabs); tabR.addEventListener('click', toTabs);
  tabsEl.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { side('R'); tabR.focus(); }
    if (e.key === 'ArrowLeft') { side('L'); tabL.focus(); }
  });
  var lastApparel = null;
  document.addEventListener('click', function (e) { var a = e.target.closest('a[href="#apparel"]'); if (a) lastApparel = a; }, true);
  document.getElementById('glApparelClose').addEventListener('click', function () { if (lastApparel) { lastApparel.focus({ preventScroll: true }); lastApparel.scrollIntoView({ block: 'center' }); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !apparel.hidden && !document.querySelector('.ncq-overlay:not([hidden])')) document.getElementById('glApparelClose').click(); });
  // date form: occasion steers the collection; no past dates
  var occ = document.querySelector('[name=qs-occasion]'), cat = document.querySelector('[name=qs-cat]'), dt = document.querySelector('[name=qs-date]');
  if (dt) { var n = new Date(); dt.min = new Date(n.getTime() - n.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  var WED = /Wedding|Engagement|Bridal/, picked = false;
  if (cat) cat.addEventListener('change', function () { picked = true; });
  if (occ) occ.addEventListener('change', function () {
    if (picked) return;
    cat.value = WED.test(occ.value) ? 'Bridal & Bridal Party Gifts' : occ.value === 'Corporate Event' ? 'Business & Group Orders' : 'Gifts & Keepsakes';
  });
  // header logo appears once the big centered logo scrolls away
  var crest = document.querySelector('.gl-crest');
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { document.body.classList.toggle('gl-crest-seen', es[0].isIntersecting && document.body.getAttribute('data-layout') === 'c'); }, { rootMargin: '-76px 0px 0px 0px' }).observe(crest);
  layout('c', true);
  if (location.hash.length > 1) reveal(location.hash.slice(1));
})();
