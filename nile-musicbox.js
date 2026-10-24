/*!
 * Nile Crafted Studio - music box background tune.
 * Pachelbel's Canon in D (public domain), arranged for a music box with a soft solo violin,
 * played live in the browser with Web Audio. Violin notes: VSCO 2 Community Edition (CC0).
 * Starts as soon as the browser allows: right away where permitted, otherwise on the visitor's
 * first tap, click or key press. Turning it off with #musicBtn keeps it off for the rest of the visit.
 */
(function () {
  'use strict';
  var btn = document.getElementById('musicBtn'), label = document.getElementById('musicLabel');
  if (!btn) return;
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) { btn.style.display = 'none'; return; }

  var TEMPO = 76;            // beats per minute: light and happy
  var TRANSPOSE = 5;         // semitones up from D major (plays in G major, brighter)
  var BEAT = 60 / TEMPO;
  var VOLUME = 0.42;         // master level once faded in (medium)
  var OFF_KEY = 'ncs-music-off';   // set for this visit only when the visitor turns the music off
  try { localStorage.removeItem('ncs-music'); } catch (e) {}   // old preference, no longer used
  function save(v) { try { if (v === 'off') sessionStorage.setItem(OFF_KEY, '1'); else sessionStorage.removeItem(OFF_KEY); } catch (e) {} }
  function turnedOff() { try { return sessionStorage.getItem(OFF_KEY) === '1'; } catch (e) { return false; } }

  // ---- score: [beat, midi note, velocity] ----
  var N = { 'F#3': 54, 'G3': 55, 'A3': 57, 'B3': 59, 'C#4': 61, 'D4': 62, 'E4': 64, 'F#4': 66, 'G4': 67, 'A4': 69, 'B4': 71, 'C#5': 73, 'D5': 74, 'E5': 76, 'F#5': 78, 'G5': 79, 'A5': 81, 'B5': 83, 'C#6': 85, 'D6': 86 };
  var BASS = ['D4', 'A3', 'B3', 'F#3', 'G3', 'D4', 'G3', 'A3'];
  var CHORDS = [['D5', 'F#5', 'A5'], ['C#5', 'E5', 'A5'], ['B4', 'D5', 'F#5'], ['A4', 'C#5', 'F#5'], ['G4', 'B4', 'D5'], ['F#4', 'A4', 'D5'], ['G4', 'B4', 'D5'], ['A4', 'C#5', 'E5']];
  var VARS = [
    { step: 2, notes: ['F#5', 'E5', 'D5', 'C#5', 'B4', 'A4', 'B4', 'C#5'] },
    { step: 1, notes: ['D5', 'F#5', 'A5', 'G5', 'F#5', 'D5', 'F#5', 'E5', 'D5', 'B4', 'D5', 'A5', 'G5', 'B5', 'A5', 'G5'] },
    { arp: true },
    { step: 1, notes: ['F#5', 'D5', 'E5', 'C#5', 'D5', 'B4', 'C#5', 'A4', 'B4', 'G4', 'A4', 'F#4', 'G4', 'B4', 'A4', 'C#5'] },
    { step: 2, notes: ['A5', 'G5', 'F#5', 'E5', 'D5', 'C#5', 'D5', 'E5'] }
  ];
  var score = [], cycleBeats = 16;
  VARS.forEach(function (v, vi) {
    var base = vi * cycleBeats;
    BASS.forEach(function (b, i) { score.push([base + i * 2, N[b], 0.55]); });
    if (v.arp) {
      CHORDS.forEach(function (c, i) {
        [c[0], c[1], c[2], c[1]].forEach(function (n, k) { score.push([base + i * 2 + k * 0.5, N[n], k === 0 ? 0.8 : 0.6]); });
      });
    } else {
      v.notes.forEach(function (n, i) { score.push([base + i * v.step, N[n], i % 2 ? 0.7 : 0.85]); });
    }
  });
  var LOOP = VARS.length * cycleBeats;   // beats per full loop
  // soft violin: sustained canon line under the music box, entering after the first pass
  var VIOLIN = [null, ['F#4', 'E4', 'D4', 'C#4', 'B3', 'A3', 'B3', 'C#4'], ['D5', 'C#5', 'B4', 'A4', 'G4', 'F#4', 'G4', 'A4'], ['F#4', 'E4', 'D4', 'C#4', 'B3', 'A3', 'B3', 'C#4'], ['A4', 'G4', 'F#4', 'E4', 'D4', 'C#4', 'D4', 'E4']];
  VIOLIN.forEach(function (line, vi) {
    if (!line) return;
    line.forEach(function (n, i) { score.push([vi * cycleBeats + i * 2, N[n], 0.6, 2]); });
  });

  // ---- audio graph ----
  var ctx = null, master, comp, wet, timer = null, startAt = 0, nextIdx = 0, loopN = 0, playing = false;
  function impulse(c) {
    var len = Math.floor(c.sampleRate * 2.2), buf = c.createBuffer(2, len, c.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    return buf;
  }
  function build() {
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0;
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3; comp.attack.value = 0.003; comp.release.value = 0.25;
    var dry = ctx.createGain(); dry.gain.value = 1;
    var tone = ctx.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 7500;
    tone.connect(dry);
    dry.connect(comp); comp.connect(master); master.connect(ctx.destination);
    master._in = tone;
    loadViolin();
  }
  // one music-box tine: bright metallic strike that rings and fades
  var PARTIALS = [[1, 1, 1.9], [2, 0.32, 0.7], [3, 0.12, 0.35], [5.4, 0.07, 0.1], [8.9, 0.035, 0.05]];
  function pluck(t, midi, vel) {
    var f = 440 * Math.pow(2, (midi - 69) / 12);
    var detune = (Math.random() - 0.5) * 4;
    var amp = vel * 0.16 * (midi < 60 ? 0.85 : 1);
    PARTIALS.forEach(function (p) {
      if (f * p[0] > 12000) return;
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f * p[0]; o.detune.value = detune;
      var dec = p[2] * (midi > 80 ? 0.75 : 1);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(amp * p[1], t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.004 + dec * 2.4);
      o.connect(g); g.connect(master._in);
      o.start(t); o.stop(t + dec * 2.5 + 0.05);
    });
  }
  // soft violin: a real solo violin (VSCO 2 Community Edition, CC0), bowed softly with vibrato
  var VLN = { A3: [57, 7.526, 3.0], C4: [60, 1.173, 20.8], E4: [64, 1.909, 4.1], G4: [67, 3.473, -4.6], A4: [69, 2.347, -14.3], C5: [72, 0.816, -2.4], E5: [76, 3.246, 5.8] };
  var VIOLIN_LEVEL = 3.0, vlnBufs = {};
  function loadViolin() {
    Object.keys(VLN).forEach(function (k) {
      fetch('violin-' + k + '.wav').then(function (r) { return r.arrayBuffer(); }).then(function (data) {
        ctx.decodeAudioData(data, function (buf) { vlnBufs[k] = buf; }, function () {});
      }).catch(function () {});
    });
  }
  function bow(t, midi, vel, len) {
    var best = null, dist = 99;
    Object.keys(vlnBufs).forEach(function (k) { var d = Math.abs(midi - VLN[k][0]); if (d < dist) { dist = d; best = k; } });
    if (!best || dist > 3) return;
    var s = VLN[best], end = t + len + 0.3, amp = vel * VIOLIN_LEVEL * s[1];
    var src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = vlnBufs[best];
    src.playbackRate.value = Math.pow(2, (midi - s[0]) / 12 - s[2] / 1200);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp, t + 0.3);
    g.gain.setValueAtTime(amp, Math.max(t + 0.3, end - 0.65));
    g.gain.linearRampToValueAtTime(0.0001, end);
    var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 160;
    src.connect(hp); hp.connect(g); g.connect(master._in);
    src.start(t); src.stop(end + 0.05);
  }
  function schedule() {
    var horizon = ctx.currentTime + 0.6;
    while (true) {
      var ev = score[nextIdx];
      var t = startAt + (loopN * LOOP + ev[0]) * BEAT + (Math.random() - 0.5) * 0.012;
      if (t > horizon) break;
      if (t > ctx.currentTime - 0.05) { if (ev[3]) bow(t, ev[1] + TRANSPOSE, ev[2], ev[3] * BEAT); else pluck(t, ev[1] + TRANSPOSE, ev[2]); }
      nextIdx++;
      if (nextIdx >= score.length) { nextIdx = 0; loopN++; }
    }
  }
  function fade(to, secs) {
    var now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(to, now + secs);
  }
  score.sort(function (a, b) { return a[0] - b[0]; });

  function setUI(on) {
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Turn background music off' : 'Turn background music on');
    if (label) label.textContent = on ? 'Music on' : 'Music off';
  }
  function play() {
    if (!ctx) build();
    return ctx.resume().then(function () {
      if (ctx.state !== 'running') { setUI(false); return false; }
      if (!playing) {
        playing = true; startAt = ctx.currentTime + 0.15; nextIdx = 0; loopN = 0;
        clearInterval(timer); timer = setInterval(schedule, 120); schedule();
      }
      fade(VOLUME, 3); setUI(true); hint(); return true;
    }).catch(function () { setUI(false); return false; });
  }
  function stop() {
    setUI(false);
    if (!ctx || !playing) return;
    fade(0, 0.8);
    setTimeout(function () { if (!btn.classList.contains('on')) { clearInterval(timer); playing = false; ctx.suspend(); } }, 900);
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation(); removeFirstTouch();
    if (btn.classList.contains('on')) { save('off'); stop(); } else { save('on'); play(); }
  });
  // a gold arc circles the button for a few seconds when the music starts, so visitors see where to turn it off
  var hinted = false;
  function hint() {
    if (hinted) return; hinted = true;
    btn.classList.add('hint');
    setTimeout(function () { btn.classList.remove('hint'); }, 7000);
  }

  // Start right away where the browser allows sound; otherwise on the first tap, click or key press anywhere.
  var EVENTS = ['pointerdown', 'touchend', 'keydown', 'click'];
  function firstTouch(e) {
    if (btn.contains(e.target)) return;           // the button handles itself
    if (turnedOff() || btn.classList.contains('on')) { removeFirstTouch(); return; }
    // some phones only allow sound from certain touch events, so keep listening until it actually starts
    play().then(function (ok) { if (ok) removeFirstTouch(); });
  }
  function removeFirstTouch() {
    EVENTS.forEach(function (t) { document.removeEventListener(t, firstTouch, true); });
  }
  setUI(false);
  if (!turnedOff()) {
    EVENTS.forEach(function (t) { document.addEventListener(t, firstTouch, { capture: true, passive: true }); });
    build();
    ctx.resume().catch(function () {});
    setTimeout(function () {
      if (ctx.state === 'running' && !btn.classList.contains('on') && !turnedOff()) { removeFirstTouch(); play(); }
    }, 250);
  }
  document.addEventListener('visibilitychange', function () {
    if (!ctx || !playing) return;
    if (document.hidden) ctx.suspend(); else if (btn.classList.contains('on')) ctx.resume();
  });
})();
