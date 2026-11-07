/* nile-polish.js · persona review fixes · Nov 7, 2026
   Phones: hides the Weddings/Shop switch once the visitor has scrolled past the
   two panels it controls, and brings it back when they scroll up to them. */
(function () {
  'use strict';
  var tabs = document.querySelector('.gl-tabs');
  var first = document.getElementById('glFirst');
  if (!tabs || !first) return;
  var queued = false;
  function update() {
    queued = false;
    tabs.classList.toggle('gl-tabs--away', first.getBoundingClientRect().bottom < 130);
  }
  window.addEventListener('scroll', function () {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
