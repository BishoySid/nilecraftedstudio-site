/*!
 * Nile Crafted Studio - loads the Lotus Egg into the music button once the page has finished loading,
 * so the homepage itself stays fast. If the visitor's browser can't show 3D (no WebGL, very old browser,
 * data saver on), the classic gold music button simply stays as it is.
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

  var V = '20261102';
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
      .catch(function () { btn.classList.remove('egg-ready'); });
  }
  function whenIdle() {
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2500 }); else setTimeout(start, 600);
  }
  if (document.readyState === 'complete') whenIdle(); else window.addEventListener('load', whenIdle);
})();
