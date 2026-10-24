/*!
 * Nile Crafted Studio — Custom Apparel (T-shirts & Pajamas) order builder.
 * Mounts into any element with [data-apparel-order]. Deep link: /#apparel scrolls to it.
 * Sending opens the visitor's own email or messages app with everything filled in;
 * nothing is stored on a server. A draft is kept in this browser only, so a visitor
 * who leaves mid-way can pick up where they left off.
 */
(function () {
  'use strict';

  var CONFIG = {
    email: 'nilecraftedstudio@gmail.com',
    sms: '+18624140499',
    phoneLabel: '(862) 414-0499',
    draftKey: 'ncs-apparel-draft',
    headerOffset: 96   // px kept clear above a section when scrolling to it (site's sticky header)
  };

  var OCCASIONS = [
    ['Birthdays', ['Kids Birthday Party', "Baby's First Birthday", 'Adult Birthday Party', 'Sweet 16 / Quinceañera', 'Disney-Themed Birthday / Disney Characters', 'Princess / Fairytale Party', 'Superhero / Cartoon Character Party']],
    ['Weddings & love', ['Wedding / Bridal Shower', 'Bachelorette / Bachelor Party', 'Engagement Party', 'Anniversary', "Valentine's Day"]],
    ['Holidays', ['Christmas', 'Halloween', 'Easter', 'Thanksgiving', "New Year's Celebration"]],
    ['Family & faith', ['Family Reunion', 'Mommy & Me / Daddy & Me', 'Baby Shower / Gender Reveal', 'Baptism / Christening', 'First Communion / Confirmation', 'Memorial / Celebration of Life']],
    ['Trips', ['Disney Vacation / Matching Family Outfits', 'Family Vacation / Cruise', 'Summer Camp']],
    ['School, teams & work', ['Graduation / School Celebration', 'School Spirit / PTA / Class Trip', 'Sports / Dance Team', 'Corporate / Business Logo Shirts', 'Fundraiser / Charity Event']],
    ['Just because', ["Girls' Night / Friends Gathering", 'Custom Gift / Just Because', 'Other']]
  ];
  var CHARACTER = /Disney|Princess|Superhero/;
  // one fine-line icon per occasion family (same order as OCCASIONS)
  var ICONS = [
    '<path d="M5 21h14M6 21v-7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7"/><path d="M6 16.5c1.5 1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0"/><path d="M12 13V9.5M12 8a1.4 1.4 0 0 1-1.4-1.4C10.6 5.5 12 4 12 4s1.4 1.5 1.4 2.6A1.4 1.4 0 0 1 12 8Z"/>',
    '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M13.5 5.5 15 4l1.5 1.5L15 7z"/>',
    '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="m10 4.5 2 1.5 2-1.5M10 19.5l2-1.5 2 1.5"/>',
    '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M12 17.5s-3-1.8-3-3.6a1.5 1.5 0 0 1 3-.4 1.5 1.5 0 0 1 3 .4c0 1.8-3 3.6-3 3.6Z"/>',
    '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M8 8v12M16 8v12"/>',
    '<path d="m2.5 9.5 9.5-4.5 9.5 4.5-9.5 4.5z"/><path d="M6.5 11.5V16c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-4.5M21.5 9.5V15"/>',
    '<rect x="4" y="10" width="16" height="10" rx="1"/><path d="M3 7h18v3H3zM12 7v13"/><path d="M12 7S10.5 3.5 8.5 4 8 7 12 7Zm0 0s1.5-3.5 3.5-3 .5 3-3.5 3Z"/>'
  ];
  var orbitIdx = 0, orbitRot = 0, orbitDrift = null, orbitTouched = false, sizeGroup = -1;
  var SIZES = [
    ['Baby', ['Newborn', '0-3M', '3-6M', '6-12M', '12-18M', '18-24M']],
    ['Toddler', ['2T', '3T', '4T', '5T']],
    ['Youth', ['Youth XS', 'Youth S', 'Youth M', 'Youth L', 'Youth XL']],
    ['Adult', ['Adult XS', 'Adult S', 'Adult M', 'Adult L', 'Adult XL', 'Adult 2XL', 'Adult 3XL', 'Adult 4XL']]
  ];
  var ITEMS = ['T-shirts', 'Pajamas'];
  var STYLES = ['Standard T-shirt', 'Oversized T-shirt', 'Long-sleeve shirt', 'Short-sleeve pajama set', 'Long-sleeve pajama set', 'Matching family pajama sets', 'Need recommendations'];
  var PLACEMENTS = ['Front center', 'Small chest design', 'Back', 'Front and back', 'Sleeve', 'Pajama top', 'Pajama pants'];
  var PROVIDERS = ['Nile Crafted Studio provides items', 'I will provide my own items', 'I need recommendations'];
  var BUDGETS = ['Under $50', '$50–$100', '$100–$200', '$200–$400', '$400+', 'Please provide a quote'];
  var DELIVERY = ['Local pickup – Staten Island', 'Local delivery', 'Shipping (US or international)'];

  var STEPS = ['Occasion', 'Items & dates', 'Sizes', 'Design', 'Budget & delivery', 'Your details', 'Review'];

  function blank() {
    return {
      step: 0, occasion: '', occasionOther: '', items: [], eventDate: '', needBy: '', theme: '',
      qty: {}, colors: '', style: '', sizeNotes: '', placement: [], wording: '', inspiration: '', provider: '',
      budget: '', delivery: '', location: '', name: '', email: '', phone: '', agree: false, updates: false
    };
  }

  var S = blank(), root, errs = {};

  function load() { try { var d = JSON.parse(localStorage.getItem(CONFIG.draftKey) || 'null'); if (d && typeof d === 'object') { S = Object.assign(blank(), d); S.agree = false; } } catch (e) {} }
  function save() { try { localStorage.setItem(CONFIG.draftKey, JSON.stringify(S)); } catch (e) {} }
  function clearDraft() { try { localStorage.removeItem(CONFIG.draftKey); } catch (e) {} }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function fmtDate(v) { if (!v) return ''; var p = v.split('-'); return new Date(+p[0], p[1] - 1, +p[2]).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); }
  function daysUntil(v) { var p = v.split('-'); var t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((new Date(+p[0], p[1] - 1, +p[2]) - t) / 864e5); }
  function sizeKeys() { return Object.keys(S.qty).filter(function (k) { return S.qty[k]; }); }
  function totals() {
    var t = { all: 0 }; ITEMS.forEach(function (i) { t[i] = 0; });
    Object.keys(S.qty).forEach(function (sz) { ITEMS.forEach(function (i) { var n = (S.qty[sz] && S.qty[sz][i]) || 0; t[i] += n; t.all += n; }); });
    return t;
  }
  function occasionText() { return S.occasion === 'Other' ? ('Other: ' + (S.occasionOther || '')) : S.occasion; }

  // ---------- markup helpers ----------
  function chip(name, value, checked, type) {
    var id = 'nca-' + name + '-' + value.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    return '<label class="nca-chip" for="' + id + '"><input id="' + id + '" type="' + (type || 'radio') + '" name="' + name + '" value="' + esc(value) + '"' + (checked ? ' checked' : '') + '><span>' + esc(value) + '</span></label>';
  }
  function chips(name, list, current, type) {
    return '<div class="nca-chips">' + list.map(function (v) { return chip(name, v, type === 'checkbox' ? current.indexOf(v) > -1 : current === v, type); }).join('') + '</div>';
  }
  function field(id, label, input, hint) {
    return '<div class="nca-f"><label for="nca-' + id + '">' + label + '</label>' + input + (hint ? '<p class="nca-hint">' + hint + '</p>' : '') + err(id) + '</div>';
  }
  function err(k) { return '<p class="nca-err" id="nca-err-' + k + '" role="alert">' + esc(errs[k] || '') + '</p>'; }
  function req() { return ' <b class="nca-req" aria-hidden="true">*</b>'; }

  // ---------- steps ----------
  var VIEWS = [
    function occasion() {
      var arrow = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (d < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>'; };
      return '<fieldset class="nca-set nca-occ"><legend>What are you celebrating?' + req() + ' <small>Turn the ring, then choose</small></legend>' +
        '<div class="nca-orbit">' +
        '<button type="button" class="nca-orb-nav" data-orb="-1" aria-label="Previous occasion type">' + arrow(-1) + '</button>' +
        '<div class="nca-stage" tabindex="-1"><span class="nca-orbit-line" aria-hidden="true"></span><div class="nca-ring" role="group" aria-label="Occasion types">' +
        OCCASIONS.map(function (g, i) {
          return '<button type="button" class="nca-planet" data-grp="' + i + '" aria-label="' + esc(g[0]) + ', ' + g[1].length + ' occasions">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[i] + '</svg><span class="nca-pname">' + esc(g[0]) + '</span><span class="nca-pcount">' + g[1].length + ' occasions</span></button>';
        }).join('') + '</div></div>' +
        '<button type="button" class="nca-orb-nav" data-orb="1" aria-label="Next occasion type">' + arrow(1) + '</button>' +
        '</div>' +
        '<div class="nca-dots" aria-hidden="true">' + OCCASIONS.map(function (g, i) { return '<i' + (i === orbitIdx ? ' class="on"' : '') + '></i>'; }).join('') + '</div>' +
        '<div class="nca-moons">' + moons() + '</div>' +
        '</fieldset>' + err('occasion') +
        (S.occasion === 'Other' ? field('occasionOther', 'Tell us the occasion' + req(), '<input id="nca-occasionOther" data-k="occasionOther" maxlength="80" value="' + esc(S.occasionOther) + '">') : '');
    },
    function itemsDates() {
      var t = S.eventDate && S.needBy && S.needBy > S.eventDate ? '<p class="nca-warn">Your need-by date is after the event. Most people want their pieces a few days before.</p>' : '';
      var soon = S.needBy && daysUntil(S.needBy) >= 0 && daysUntil(S.needBy) < 14 ? '<p class="nca-warn">That\'s in ' + daysUntil(S.needBy) + ' day' + (daysUntil(S.needBy) === 1 ? '' : 's') + '. Send it anyway and Randa will let you know if it can be done in time.</p>' : '';
      return '<fieldset class="nca-set"><legend>What would you like to customize?' + req() + ' <small>Pick one or both</small></legend>' + chips('items', ITEMS.map(function (i) { return 'Personalized ' + i; }), S.items.map(function (i) { return 'Personalized ' + i; }), 'checkbox') + '</fieldset>' + err('items') +
        '<div class="nca-row">' +
        field('eventDate', 'Event or celebration date', '<input type="date" id="nca-eventDate" data-k="eventDate" min="' + today() + '" value="' + esc(S.eventDate) + '">') +
        field('needBy', 'Date the order is needed' + req(), '<input type="date" id="nca-needBy" data-k="needBy" min="' + today() + '" value="' + esc(S.needBy) + '">') +
        '</div>' + t + soon +
        field('theme', 'Theme or favorite characters', '<textarea id="nca-theme" data-k="theme" maxlength="600" placeholder="e.g. pastel rainbow, soccer, “Team Bride”, matching family colors">' + esc(S.theme) + '</textarea>',
          CHARACTER.test(S.occasion) ? 'Character-themed designs depend on artwork licensing and availability. We\'ll suggest an original design in the same spirit if needed.' : '');
    },
    function sizes() {
      var items = S.items.length ? S.items : ['T-shirts'];
      var t = totals();
      var rows = sizeKeys().map(function (sz) {
        return '<div class="nca-qrow"><span class="nca-qsize">' + esc(sz) + '</span>' + items.map(function (it) {
          var n = (S.qty[sz] && S.qty[sz][it]) || 0;
          return '<div class="nca-step" role="group" aria-label="' + esc(it + ', ' + sz) + '">' + (items.length > 1 ? '<span class="nca-qitem">' + esc(it === 'Pajamas' ? 'PJs' : 'Tees') + '</span>' : '') +
            '<button type="button" data-q="' + esc(sz) + '|' + it + '|-1" aria-label="One fewer">−</button><output aria-live="polite">' + n + '</output><button type="button" data-q="' + esc(sz) + '|' + it + '|1" aria-label="One more">+</button></div>';
        }).join('') + '<button type="button" class="nca-x" data-rm="' + esc(sz) + '" aria-label="Remove ' + esc(sz) + '">×</button></div>';
      }).join('');
      if (sizeGroup < 0) {
        sizeGroup = SIZES.length - 1;
        SIZES.forEach(function (g, i) { if (sizeGroup === SIZES.length - 1 && g[1].some(function (sz) { return S.qty[sz]; })) sizeGroup = i; });
      }
      var sg = SIZES[sizeGroup];
      return '<fieldset class="nca-set"><legend>Tap every size you need' + req() + '</legend>' +
        '<div class="nca-tabs" role="group" aria-label="Size range">' + SIZES.map(function (g, i) {
          var picked = g[1].filter(function (sz) { return S.qty[sz]; }).length;
          return '<button type="button" class="nca-tab' + (i === sizeGroup ? ' on' : '') + '" data-sg="' + i + '" aria-pressed="' + (i === sizeGroup) + '">' + g[0] + (picked ? '<b>' + picked + '</b>' : '') + '</button>';
        }).join('') + '</div>' +
        '<div class="nca-chips nca-fade">' + sg[1].map(function (sz) {
          return '<button type="button" class="nca-szbtn' + (S.qty[sz] ? ' on' : '') + '" data-sz="' + esc(sz) + '" aria-pressed="' + (S.qty[sz] ? 'true' : 'false') + '">' + esc(sz.replace('Adult ', '').replace('Youth ', 'Y-')) + '</button>';
        }).join('') + '</div></fieldset>' + err('sizes') +
        (rows ? '<div class="nca-qty"><p class="nca-glabel">How many of each?</p>' + rows +
          '<p class="nca-total">Total: <b>' + t.all + '</b>' + (items.length > 1 ? ' <span>(' + t['T-shirts'] + (t['T-shirts'] === 1 ? ' tee · ' : ' tees · ') + t.Pajamas + (t.Pajamas === 1 ? ' PJ set)</span>' : ' PJ sets)</span>') : '') + '</p></div>' : '') +
        field('colors', 'Preferred colors' + req(), '<input id="nca-colors" data-k="colors" maxlength="120" placeholder="e.g. white tees with gold lettering" value="' + esc(S.colors) + '">') +
        '<fieldset class="nca-set"><legend>Preferred style</legend>' + chips('style', STYLES.filter(function (s) {
          if (S.items.length === 1 && S.items[0] === 'T-shirts') return !/pajama/i.test(s);
          if (S.items.length === 1 && S.items[0] === 'Pajamas') return !/shirt/i.test(s);
          return true;
        }), S.style) + '</fieldset>' +
        field('sizeNotes', 'Anything else about sizing? <small>(optional)</small>', '<input id="nca-sizeNotes" data-k="sizeNotes" maxlength="200" placeholder="e.g. Dad runs big, size up" value="' + esc(S.sizeNotes) + '">');
    },
    function design() {
      var place = PLACEMENTS.filter(function (p) { return S.items.indexOf('Pajamas') > -1 || !/Pajama/.test(p); });
      return '<fieldset class="nca-set"><legend>Where should the design go? <small>Pick all that apply</small></legend>' + chips('placement', place, S.placement, 'checkbox') + '</fieldset>' +
        field('wording', 'Exact names, wording, ages and initials' + req(), '<textarea id="nca-wording" data-k="wording" maxlength="2000" rows="5" placeholder="Type it exactly as it should print.\nMia – Birthday Girl – 5\nMom of the Birthday Girl">' + esc(S.wording) + '</textarea>', 'Spelling and capitals print exactly as typed.') +
        field('inspiration', 'Inspiration photos or design links <small>(optional)</small>', '<textarea id="nca-inspiration" data-k="inspiration" maxlength="800" rows="2" placeholder="Paste Pinterest or Instagram links. You can also text photos after sending.">' + esc(S.inspiration) + '</textarea>') +
        '<fieldset class="nca-set"><legend>Who will provide the shirts or pajamas?</legend>' + chips('provider', PROVIDERS, S.provider) + '</fieldset>';
    },
    function budget() {
      var needLoc = S.delivery && !/pickup/i.test(S.delivery);
      return '<fieldset class="nca-set"><legend>Estimated budget</legend>' + chips('budget', BUDGETS, S.budget) + '</fieldset>' +
        '<fieldset class="nca-set"><legend>How would you like to get your order?' + req() + '</legend>' + chips('delivery', DELIVERY, S.delivery) + '</fieldset>' + err('delivery') +
        (needLoc ? field('location', (/Shipping/.test(S.delivery) ? 'ZIP code, or city and country' : 'Delivery neighborhood or ZIP code') + req(), '<input id="nca-location" data-k="location" maxlength="120" autocomplete="postal-code" value="' + esc(S.location) + '">') : '');
    },
    function details() {
      return '<div class="nca-row">' +
        field('name', 'Full name' + req(), '<input id="nca-name" data-k="name" autocomplete="name" maxlength="80" value="' + esc(S.name) + '">') +
        field('phone', 'Phone number' + req(), '<input id="nca-phone" data-k="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="30" value="' + esc(S.phone) + '">') +
        '</div>' +
        field('email', 'Email address' + req(), '<input id="nca-email" data-k="email" type="email" autocomplete="email" maxlength="120" value="' + esc(S.email) + '">');
    },
    function review() {
      var t = totals();
      var rows = [
        ['Occasion', occasionText(), 0], ['Items', S.items.map(function (i) { return 'Personalized ' + i; }).join(' + '), 1],
        ['Needed by', fmtDate(S.needBy) + (S.eventDate ? ' · event ' + fmtDate(S.eventDate) : ''), 1], ['Theme', S.theme, 1],
        ['Sizes', breakdown().join('; ') + ' — ' + t.all + ' total', 2], ['Colors', S.colors, 2], ['Style', S.style, 2],
        ['Placement', S.placement.join(', '), 3], ['Wording', S.wording, 3], ['Items from', S.provider, 3],
        ['Budget', S.budget, 4], ['Delivery', S.delivery + (S.location ? ' · ' + S.location : ''), 4],
        ['You', [S.name, S.phone, S.email].join(' · '), 5]
      ].filter(function (r) { return r[1]; });
      return '<dl class="nca-review">' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]).replace(/\n/g, '<br>') + '</dd><button type="button" class="nca-edit" data-go="' + r[2] + '">Edit</button></div>'; }).join('') + '</dl>' +
        '<div class="nca-policy"><p class="nca-glabel">Custom Order &amp; Refund Policy</p>' +
        '<p>All Nile Crafted Studio personalized T-shirts and pajamas are custom-made specifically for you. All personalized sales are final and non-refundable, subject to applicable consumer protection laws.</p>' +
        '<p>Your satisfaction is extremely important to us! If you are not 100% satisfied with your order, please reach out. We genuinely care about your experience and will do our best to address your concerns.</p>' +
        '<p>If an item arrives damaged, defective, or incorrect, please contact us with photos so we can review the issue and assist you. Please carefully verify names, sizes, colors, and design details before approving your order.</p></div>' +
        '<label class="nca-check"><input type="checkbox" id="nca-agree" data-k="agree"' + (S.agree ? ' checked' : '') + '><span>I have read and agree to the Custom Order &amp; Refund Policy.' + req() + '</span></label>' + err('agree') +
        '<label class="nca-check"><input type="checkbox" id="nca-updates" data-k="updates"' + (S.updates ? ' checked' : '') + '><span>Send me updates about seasonal collections and special offers.</span></label>' +
        '<p class="nca-hint">This is an order inquiry, not a purchase. Randa will confirm pricing and timing and send a design preview. Nothing is made until you approve it.</p>';
    }
  ];

  function moons() {
    var g = OCCASIONS[orbitIdx];
    return '<p class="nca-glabel">' + esc(g[0]) + '</p>' + chips('occasion', g[1], S.occasion);
  }

  // ---------- the occasion ring ----------
  function layoutOrbit() {
    var ring = root && root.querySelector('.nca-ring'); if (!ring) return;
    var ps = ring.querySelectorAll('.nca-planet'), n = ps.length, step = 360 / n;
    var w = ps[0].offsetWidth, sw = ring.parentNode.offsetWidth, r = Math.round(Math.min((w / 2) / Math.tan(Math.PI / n) * 1.55, sw * 0.4));
    ring.style.transform = 'translateZ(' + (-r) + 'px) rotateY(' + (-orbitRot) + 'deg)';
    Array.prototype.forEach.call(ps, function (p, i) {
      var a = i * step, rel = (((a - orbitRot) % 360) + 540) % 360 - 180, c = Math.cos(rel * Math.PI / 180);
      p.style.transform = 'rotateY(' + a + 'deg) translateZ(' + r + 'px)';
      p.style.opacity = c > -0.15 ? Math.max(0.1, 0.1 + 0.9 * Math.pow(Math.max(c, 0), 1.7)).toFixed(3) : '0';
      p.style.pointerEvents = c > 0.3 ? '' : 'none';
      var front = i === orbitIdx;
      p.classList.toggle('front', front);
      p.setAttribute('aria-pressed', front ? 'true' : 'false');
      p.tabIndex = front ? 0 : -1;
    });
    Array.prototype.forEach.call(root.querySelectorAll('.nca-dots i'), function (d, i) { d.classList.toggle('on', i === orbitIdx); });
  }
  function turnTo(i, fromUser) {
    var n = OCCASIONS.length, d = ((i - orbitIdx) % n + n) % n;
    if (d > n / 2) d -= n;
    if (!d) return;
    if (fromUser) stopDrift(true);
    orbitIdx = (i + n) % n; orbitRot += d * (360 / n);
    layoutOrbit();
    var m = root.querySelector('.nca-moons');
    if (m) {
      m.classList.remove('nca-fade'); void m.offsetWidth; m.classList.add('nca-fade');
      m.innerHTML = moons();
    }
  }
  function startDrift() {
    stopDrift(false);
    if (orbitTouched || S.occasion || reduceMotion) return;
    orbitDrift = setInterval(function () {
      var o = root.querySelector('.nca-orbit');
      if (!o || S.step !== 0) return stopDrift(false);
      if (o.matches(':hover') || o.contains(document.activeElement)) return;
      var b = o.getBoundingClientRect();
      if (b.bottom < 0 || b.top > innerHeight) return;
      turnTo(orbitIdx + 1);
    }, 3600);
  }
  function stopDrift(forGood) { clearInterval(orbitDrift); orbitDrift = null; if (forGood) orbitTouched = true; }

  function breakdown() {
    var out = [];
    ITEMS.forEach(function (it) {
      var parts = sizeKeys().filter(function (sz) { return S.qty[sz][it]; }).map(function (sz) { return sz + ' × ' + S.qty[sz][it]; });
      if (parts.length) out.push((it === 'Pajamas' ? 'PJs' : 'T-shirts') + ': ' + parts.join(', '));
    });
    return out;
  }

  // ---------- validation ----------
  function validate(step) {
    errs = {};
    if (step === 0) { if (!S.occasion) errs.occasion = 'Pick the occasion so we can suggest designs.'; else if (S.occasion === 'Other' && !S.occasionOther.trim()) errs.occasionOther = 'Tell us the occasion in a few words.'; }
    if (step === 1) { if (!S.items.length) errs.items = 'Choose T-shirts, pajamas, or both.'; if (!S.needBy) errs.needBy = 'Add the date you need the order.'; }
    if (step === 2) { if (!totals().all) errs.sizes = 'Tap at least one size and set how many.'; if (!S.colors.trim()) errs.colors = 'Add your preferred colors, or write “Need ideas”.'; }
    if (step === 3) { if (!S.wording.trim()) errs.wording = 'Type the names or wording to print, or write “Need ideas”.'; }
    if (step === 4) { if (!S.delivery) errs.delivery = 'Choose pickup, delivery or shipping.'; else if (!/pickup/i.test(S.delivery) && !S.location.trim()) errs.location = 'Add where it\'s going so we can price delivery.'; }
    if (step === 5) {
      if (!S.name.trim()) errs.name = 'Add your name.';
      if (S.phone.replace(/\D/g, '').length < 7) errs.phone = 'Add a phone number we can text.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.email.trim())) errs.email = 'Add a valid email, like name@example.com.';
    }
    if (step === 6) { if (!S.agree) errs.agree = 'Please check the box to agree to the policy.'; }
    return !Object.keys(errs).length;
  }

  // ---------- render ----------
  function render(focus) {
    var s = S.step, last = s === STEPS.length - 1;
    root.innerHTML =
      '<div class="nca-head"><p class="nca-eyebrow">Personalized T-shirts &amp; Pajamas</p><h2 class="nca-title">Design your custom apparel</h2>' +
      '<ol class="nca-progress" aria-label="Steps">' + STEPS.map(function (n, i) { return '<li class="' + (i < s ? 'done' : i === s ? 'now' : '') + '"' + (i === s ? ' aria-current="step"' : '') + '><button type="button" data-go="' + i + '"' + (i > furthest ? ' disabled' : '') + '><span>' + (i + 1) + '</span><em>' + n + '</em></button></li>'; }).join('') + '</ol></div>' +
      '<form class="nca-body" novalidate><h3 class="nca-stepname">' + (s + 1) + '. ' + STEPS[s] + '</h3>' + VIEWS[s]() +
      '<div class="nca-nav">' + (s ? '<button type="button" class="nca-btn ghost" data-back>Back</button>' : '<span></span>') +
      (last ? '<div class="nca-send"><button type="button" class="nca-btn" data-send="email">Send by email</button><button type="button" class="nca-btn alt" data-send="sms">Send by text</button></div>'
            : '<button type="submit" class="nca-btn">' + (returnTo != null ? 'Back to review →' : 'Next: ' + STEPS[s + 1] + ' →') + '</button>') + '</div></form>' +
      '<div class="nca-done" hidden></div>';
    if (focus) { var h = root.querySelector('.nca-stepname'); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (S.step === 0) {
      var ring = root.querySelector('.nca-ring');
      ring.classList.add('nca-still'); layoutOrbit();
      requestAnimationFrame(function () { requestAnimationFrame(function () { ring.classList.remove('nca-still'); }); });
      if (!orbitDrift) startDrift();
    } else stopDrift(false);
  }
  var furthest = 0, swiped = false;

  function go(n) {
    if (n > S.step) { for (var i = S.step; i < n; i++) { if (!validate(i)) { S.step = i; render(); focusErr(); return; } } }
    if (n >= STEPS.length - 1 || n < S.step) returnTo = null;
    errs = {}; S.step = n; furthest = Math.max(furthest, n); save(); render(true);
    scrollTo(root.querySelector('.nca-stepname'));
    // a step that opens with a typed answer: put the cursor there
    var first = root.querySelector('.nca-body .nca-f input');
    if (first && first === root.querySelector('.nca-body input, .nca-body textarea, .nca-body .nca-szbtn') && !first.value) first.focus({ preventScroll: true });
  }
  function forward() { go(returnTo != null ? returnTo : S.step + 1); }

  // ---------- guided flow: every choice moves the visitor to the next decision ----------
  var returnTo = null, pending = null;
  var BLOCKS = '.nca-set,.nca-f,.nca-qty,.nca-check,.nca-nav';
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scrollTo(el) {
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - CONFIG.headerOffset;
    window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  function isOptionalText(b) {
    var f = b.matches('.nca-f') && b.querySelector('input,textarea');
    return f && f.type !== 'date' && !b.querySelector('label .nca-req');
  }
  // does this block still need an answer?
  function needs(b) {
    if (b.matches('.nca-nav')) return true;
    if (b.matches('.nca-qty')) return totals().all === 0;
    if (b.querySelector('.nca-szbtn')) return !sizeKeys().length;
    if (b.matches('.nca-set')) return !b.querySelector('input:checked');
    if (b.matches('.nca-check')) { var c = b.querySelector('input'); return c.id === 'nca-agree' && !c.checked; }
    var f = b.querySelector('input,textarea'); return !!f && !f.value.trim();
  }
  function stepOk(step) { var keep = errs, ok = validate(step); errs = keep; return ok; }
  function pulse(el) {
    if (reduceMotion) return;
    el.classList.remove('nca-pulse'); void el.offsetWidth; el.classList.add('nca-pulse');
    setTimeout(function () { el.classList.remove('nca-pulse'); }, 1300);
  }
  // from = the block (or an element inside it) where a choice was just made
  function advance(from) {
    clearTimeout(pending); pending = null;
    if (!from || !root.contains(from)) return;
    var cur = from.closest(BLOCKS), list = Array.prototype.slice.call(root.querySelectorAll('.nca-body ' + BLOCKS));
    var skippedOptional = null, target = null;
    for (var i = list.indexOf(cur) + 1; i < list.length; i++) {
      var b = list[i];
      if (!b.offsetParent && !b.matches('.nca-nav')) continue;
      if (isOptionalText(b)) { if (!skippedOptional && !b.querySelector('input,textarea').value.trim()) skippedOptional = b; continue; }
      if (needs(b)) { target = b; break; }
    }
    if (!target) return;
    if (target.matches('.nca-nav')) {
      var last = S.step === STEPS.length - 1;
      // editing from the review screen: once the step is complete, go straight back to the review
      if (returnTo != null && stepOk(S.step)) { setTimeout(forward, reduceMotion ? 0 : 380); return; }
      // an optional note was passed over: show it (it sits just above the Next button)
      if (skippedOptional) { scrollTo(skippedOptional); pulse(skippedOptional); return; }
      // step finished: open the next one
      if (!last && stepOk(S.step)) { setTimeout(forward, reduceMotion ? 0 : 380); return; }
      scrollTo(target); pulse(target.querySelector('.nca-send') || target.querySelector('.nca-btn:last-child') || target);
      return;
    }
    scrollTo(target); pulse(target);
    var field = target.querySelector('input:not([type=radio]):not([type=checkbox]),textarea');
    if (field) field.focus({ preventScroll: true });
  }
  // multi-select (sizes, items, placement): wait until the visitor pauses tapping
  function advanceSoon(name, ms) {
    clearTimeout(pending);
    pending = setTimeout(function () {
      var el = root.querySelector(name);
      if (el) advance(el);
    }, ms || 1200);
  }
  function focusErr() { var e = root.querySelector('.nca-err:not(:empty)'); if (e) { var f = e.parentNode.querySelector('input,textarea') || e.previousElementSibling; if (f && f.focus) f.focus(); e.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }

  // ---------- send ----------
  function message() {
    var t = totals();
    return [
      'Hi Randa! I\'d like a custom apparel order.', '',
      'Occasion: ' + occasionText(),
      'Items: ' + S.items.map(function (i) { return 'Personalized ' + i; }).join(' + '),
      'Event date: ' + (fmtDate(S.eventDate) || 'N/A'),
      'Needed by: ' + fmtDate(S.needBy),
      'Theme / characters: ' + (S.theme || 'N/A'), '',
      'Sizes & quantities (' + t.all + ' total):', breakdown().map(function (l) { return '  ' + l; }).join('\n'),
      S.sizeNotes ? 'Sizing notes: ' + S.sizeNotes : null,
      'Colors: ' + S.colors,
      'Style: ' + (S.style || 'N/A'), '',
      'Placement: ' + (S.placement.join(', ') || 'N/A'),
      'Wording / names:', S.wording,
      'Inspiration: ' + (S.inspiration || 'N/A'),
      'Items provided by: ' + (S.provider || 'N/A'), '',
      'Budget: ' + (S.budget || 'N/A'),
      'Delivery: ' + S.delivery + (S.location ? ' (' + S.location + ')' : ''), '',
      'Name: ' + S.name, 'Phone: ' + S.phone, 'Email: ' + S.email,
      'Agreed to Custom Order & Refund Policy: Yes',
      'Seasonal updates: ' + (S.updates ? 'Yes please' : 'No thanks')
    ].filter(function (l) { return l !== null; }).join('\n');
  }
  function send(via) {
    if (!validate(6)) { render(); focusErr(); return; }
    var body = message();
    var href = via === 'sms'
      ? 'sms:' + CONFIG.sms + (/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) ? '&' : '?') + 'body=' + encodeURIComponent(body)
      : 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Apparel order: ' + occasionText() + ' (' + S.name + ')') + '&body=' + encodeURIComponent(body);
    try { window.location.href = href; } catch (e) {}
    var done = root.querySelector('.nca-done');
    root.querySelector('.nca-body').hidden = true;
    done.hidden = false;
    done.innerHTML = '<h3 class="nca-stepname">Almost there</h3><p>Your ' + (via === 'sms' ? 'messages' : 'email') + ' app should open with your order written out. Tap send there to reach Randa.</p>' +
      '<p>If nothing opened, copy your order and send it to <b class="nca-sel">' + CONFIG.email + '</b> or text <b class="nca-sel">' + CONFIG.phoneLabel + '</b>.</p>' +
      '<textarea class="nca-copybox" readonly rows="8" aria-label="Your order, ready to copy">' + esc(body) + '</textarea>' +
      '<div class="nca-nav"><button type="button" class="nca-btn ghost" data-reopen>Back to my order</button><button type="button" class="nca-btn" data-copy>Copy my order</button></div>' +
      '<button type="button" class="nca-link" data-new>Start a new order</button>';
    // the form just collapsed: keep the confirmation in view instead of whatever slid up underneath
    scrollTo(done);
  }

  // ---------- events ----------
  function onInput(e) {
    var el = e.target, k = el.getAttribute('data-k');
    if (e.type === 'input' && (el.type === 'radio' || el.type === 'checkbox')) return;   // handled once, on change
    if (k) {
      S[k] = el.type === 'checkbox' ? el.checked : el.value; save();
      if (errs[k] && (el.value || el.checked)) { errs[k] = ''; var p = root.querySelector('#nca-err-' + k); if (p) p.textContent = ''; }
      if (e.type === 'change' && el.type === 'date' && el.value) { render(); advance(root.querySelector('#nca-' + k)); }
      else if (e.type === 'change' && k === 'agree' && el.checked) advance(el);
      return;
    }
    if (el.name === 'occasion') { S.occasion = el.value; errs.occasion = ''; save(); render(); advance(root.querySelector('input[name=occasion]')); return; }
    if (el.name === 'items') { var v = el.value.replace('Personalized ', ''); S.items = ITEMS.filter(function (i) { return i === v ? el.checked : S.items.indexOf(i) > -1; }); errs.items = ''; save(); render(); var f = root.querySelector('#' + el.id); if (f) f.focus({ preventScroll: true }); if (S.items.length) advanceSoon('input[name=items]', S.items.length === ITEMS.length ? 300 : 1200); return; }
    if (el.name === 'placement') { S.placement = Array.prototype.map.call(root.querySelectorAll('input[name=placement]:checked'), function (i) { return i.value; }); save(); if (S.placement.length) advanceSoon('input[name=placement]', 1400); return; }
    if (['style', 'provider', 'budget', 'delivery'].indexOf(el.name) > -1) {
      S[el.name] = el.value; save();
      if (el.name === 'delivery') { errs.delivery = ''; render(); }
      advance(root.querySelector('input[name=' + el.name + ']'));
    }
  }
  function onClick(e) {
    var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
    var items = S.items.length ? S.items : ['T-shirts'];
    if (b.hasAttribute('data-orb')) { turnTo(orbitIdx + (+b.getAttribute('data-orb')), true); return; }
    if (b.hasAttribute('data-grp')) {
      if (swiped) return;
      var gi = +b.getAttribute('data-grp');
      if (gi !== orbitIdx) turnTo(gi, true);
      else { stopDrift(true); var c = root.querySelector('.nca-moons input'); if (c) c.focus(); }
      return;
    }
    if (b.hasAttribute('data-sg')) { sizeGroup = +b.getAttribute('data-sg'); render(); var tb = root.querySelector('[data-sg="' + sizeGroup + '"]'); if (tb) tb.focus({ preventScroll: true }); return; }
    if (b.hasAttribute('data-sz')) {
      var sz = b.getAttribute('data-sz');
      if (S.qty[sz]) delete S.qty[sz]; else { S.qty[sz] = {}; items.forEach(function (i) { S.qty[sz][i] = items.length === 1 ? 1 : 0; }); }
      errs.sizes = ''; save(); render(); var nb = root.querySelector('[data-sz="' + sz + '"]'); if (nb) nb.focus({ preventScroll: true }); if (sizeKeys().length) advanceSoon('.nca-szbtn', 1500); return;
    }
    if (b.hasAttribute('data-q')) {
      var q = b.getAttribute('data-q').split('|'), cur = (S.qty[q[0]][q[1]] || 0) + (+q[2]);
      S.qty[q[0]][q[1]] = Math.max(0, Math.min(500, cur)); save();
      b.parentNode.querySelector('output').textContent = S.qty[q[0]][q[1]];
      var t = totals(), tot = root.querySelector('.nca-total');
      tot.innerHTML = 'Total: <b>' + t.all + '</b>' + (items.length > 1 ? ' <span>(' + t['T-shirts'] + (t['T-shirts'] === 1 ? ' tee · ' : ' tees · ') + t.Pajamas + (t.Pajamas === 1 ? ' PJ set)</span>' : ' PJ sets)</span>') : '');
      return;
    }
    if (b.hasAttribute('data-rm')) { delete S.qty[b.getAttribute('data-rm')]; save(); render(); return; }
    if (b.hasAttribute('data-go')) { var to = +b.getAttribute('data-go'); if (b.classList.contains('nca-edit')) { go(to); returnTo = STEPS.length - 1; render(true); } else go(to); return; }
    if (b.hasAttribute('data-back')) { returnTo = null; go(S.step - 1); return; }
    if (b.hasAttribute('data-send')) { send(b.getAttribute('data-send')); return; }
    if (b.hasAttribute('data-reopen')) { root.querySelector('.nca-done').hidden = true; root.querySelector('.nca-body').hidden = false; return; }
    if (b.hasAttribute('data-copy')) {
      var box = root.querySelector('.nca-copybox'), done = function () { b.textContent = 'Copied'; };
      try { navigator.clipboard.writeText(box.value).then(done, function () { box.select(); }); } catch (x) { box.select(); }
      return;
    }
    if (b.hasAttribute('data-new')) { clearDraft(); S = blank(); furthest = 0; orbitIdx = 0; orbitRot = 0; orbitTouched = false; sizeGroup = -1; render(true); }
  }

  var CSS = [
    '.nca{--nca-ink:var(--ink,#2b2420);--nca-soft:var(--ink-soft,#6b5d54);--nca-gold:var(--gold,#a87a3d);--nca-blush:var(--blush,#d49a8c);--nca-line:var(--line,#e8ddd0);--nca-paper:var(--paper,#fff);--nca-tint:var(--tint,#f6ece0);--nca-serif:var(--serif,"Cormorant Garamond",Garamond,serif);--nca-sans:var(--sans,"Jost","Helvetica Neue",Arial,sans-serif);',
    'max-width:760px;margin:0 auto;font-family:var(--nca-sans);color:var(--nca-ink);display:grid;gap:22px}',
    '.nca *{box-sizing:border-box}.nca [hidden]{display:none!important}',
    '.nca-eyebrow{margin:0;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--nca-gold)}',
    '.nca-title{margin:4px 0 18px;font-family:var(--nca-serif);font-weight:500;font-size:clamp(28px,5vw,38px);line-height:1.1;text-wrap:balance}',
    '.nca-progress{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(7,1fr);gap:4px}',
    '.nca-progress button{all:unset;cursor:pointer;display:grid;gap:6px;width:100%}',
    '.nca-progress button:disabled{cursor:default}',
    '.nca-progress span{display:block;height:4px;border-radius:4px;background:var(--nca-line);font-size:0}',
    '.nca-progress .done span{background:var(--nca-gold)}.nca-progress .now span{background:var(--nca-blush)}',
    '.nca-progress em{font-style:normal;font-size:11px;letter-spacing:.06em;color:var(--nca-soft);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.nca-progress .now em{color:var(--nca-ink);font-weight:500}',
    '.nca-progress button:focus-visible{outline:2px solid var(--nca-gold);outline-offset:3px;border-radius:4px}',
    '@media(max-width:560px){.nca-progress em{display:none}}',
    '.nca-body,.nca-done{background:var(--nca-paper);border:1px solid var(--nca-line);border-radius:18px;padding:clamp(18px,4vw,30px);display:grid;gap:18px}',
    '.nca-stepname{margin:0;font-family:var(--nca-serif);font-weight:500;font-size:26px;outline:none}',
    '.nca-set{border:0;margin:0;padding:0;min-width:0;display:grid;gap:12px}',
    '.nca-set legend{padding:0;margin-bottom:10px;font-size:15px;font-weight:500}',
    '.nca-set legend small,.nca-f label small{font-weight:400;color:var(--nca-soft)}',
    '.nca-req{color:var(--nca-blush);font-weight:500}',
    '.nca-group{display:grid;gap:8px}',
    '.nca-glabel{margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--nca-soft)}',
    '.nca-chips{display:flex;flex-wrap:wrap;gap:8px}',
    '.nca-chip{position:relative}',
    '.nca-chip input{position:absolute;opacity:0;width:1px;height:1px;margin:0}',
    '.nca-chip span,.nca-szbtn{display:inline-flex;align-items:center;min-height:42px;padding:8px 15px;border:1px solid var(--nca-line);border-radius:999px;background:var(--nca-paper);color:var(--nca-ink);font:400 15px var(--nca-sans);cursor:pointer;transition:background .15s,border-color .15s,color .15s}',
    '.nca-chip span:hover,.nca-szbtn:hover{border-color:var(--nca-gold)}',
    '.nca-chip input:checked+span,.nca-szbtn.on{background:var(--nca-ink);border-color:var(--nca-ink);color:var(--nca-paper)}',
    '.nca-chip input:focus-visible+span,.nca-szbtn:focus-visible,.nca-btn:focus-visible,.nca-step button:focus-visible,.nca-x:focus-visible,.nca-edit:focus-visible,.nca-link:focus-visible{outline:2px solid var(--nca-gold);outline-offset:2px}',
    '.nca-szbtn{min-width:52px;justify-content:center;padding:8px 12px}',
    '.nca-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}',
    '.nca-f{display:grid;gap:6px;min-width:0}',
    '.nca-f label{font-size:15px;font-weight:500}',
    '.nca input:not([type=radio]):not([type=checkbox]),.nca textarea{width:100%;min-height:48px;padding:11px 13px;border:1px solid var(--nca-line);border-radius:12px;background:var(--nca-paper);color:var(--nca-ink);font:400 16px var(--nca-sans)}',
    '.nca textarea{min-height:96px;resize:vertical;line-height:1.5}',
    '.nca input:focus,.nca textarea:focus{outline:none;border-color:var(--nca-gold);box-shadow:0 0 0 3px color-mix(in srgb,var(--nca-gold) 22%,transparent)}',
    '.nca-hint{margin:0;font-size:13.5px;color:var(--nca-soft)}',
    '.nca-warn{margin:0;padding:10px 14px;border-radius:12px;background:var(--nca-tint);font-size:14px}',
    '.nca-err{margin:0;color:#b4473c;font-size:14px}.nca-err:empty{display:none}',
    '.nca-qty{display:grid;gap:8px;padding:14px;border-radius:14px;background:var(--nca-tint)}',
    '.nca-qrow{display:grid;grid-template-columns:minmax(64px,1fr) auto auto auto;align-items:center;gap:6px 14px;padding:6px 0;border-bottom:1px solid var(--nca-line)}',
    '@media(max-width:480px){.nca-qrow{grid-template-columns:1fr auto auto}.nca-qrow .nca-x{grid-row:1;grid-column:3}.nca-qsize{grid-column:1/3}.nca-qrow .nca-step{grid-column:span 1}}',
    '.nca-qsize{font-weight:500}',
    '.nca-step{display:inline-flex;align-items:center;gap:4px}',
    '.nca-qitem{font-size:12px;color:var(--nca-soft);margin-right:2px}',
    '.nca-step button,.nca-x{width:38px;height:38px;border-radius:50%;border:1px solid var(--nca-line);background:var(--nca-paper);color:var(--nca-ink);font:500 18px var(--nca-sans);cursor:pointer}',
    '.nca-step output{min-width:30px;text-align:center;font-variant-numeric:tabular-nums;font-weight:500}',
    '.nca-x{border:0;background:none;color:var(--nca-soft);font-size:20px}',
    '.nca-total{margin:4px 0 0;font-variant-numeric:tabular-nums}.nca-total span{color:var(--nca-soft);font-size:14px}',
    '.nca-review{margin:0;display:grid}',
    '.nca-review div{display:grid;grid-template-columns:110px 1fr auto;gap:10px;padding:10px 0;border-bottom:1px solid var(--nca-line);align-items:start}',
    '.nca-review dt{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--nca-soft);padding-top:3px}',
    '.nca-review dd{margin:0;min-width:0;overflow-wrap:anywhere}',
    '@media(max-width:480px){.nca-review div{grid-template-columns:1fr auto}.nca-review dt{grid-column:1}.nca-review dd{grid-column:1/-1;grid-row:2}}',
    '.nca-edit,.nca-link{all:unset;cursor:pointer;color:var(--nca-gold);font-size:14px;border-bottom:1px solid currentColor}',
    '.nca-link{justify-self:start}',
    '.nca-policy{padding:16px;border:1px solid var(--nca-line);border-radius:14px;display:grid;gap:8px;font-size:14.5px;line-height:1.55}.nca-policy p{margin:0}',
    '.nca-check{display:flex;gap:10px;align-items:flex-start;font-size:15px;cursor:pointer}',
    '.nca-check input{width:20px;height:20px;margin-top:2px;accent-color:var(--nca-gold);flex:none}',
    '.nca-nav{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-top:4px}',
    '.nca-send{display:flex;gap:10px;flex-wrap:wrap}',
    '.nca-btn{min-height:50px;padding:12px 24px;border-radius:999px;border:1px solid var(--nca-blush);background:var(--nca-blush);color:#fff;font:500 13px var(--nca-sans);letter-spacing:.16em;text-transform:uppercase;cursor:pointer}',
    '.nca-btn.alt{background:var(--nca-ink);border-color:var(--nca-ink);color:var(--nca-paper)}',
    '.nca-btn.ghost{background:transparent;color:var(--nca-ink);border-color:var(--nca-line)}',
    '.nca-done p{margin:0}.nca-sel{user-select:all}',
    '.nca-copybox{font-size:13.5px!important}',
    '@keyframes nca-pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--nca-blush) 55%,transparent)}100%{box-shadow:0 0 0 14px transparent}}',
    '.nca-pulse{animation:nca-pulse 1.1s ease-out;border-radius:14px}',
    '.nca-occ legend{text-align:center;width:100%}.nca-occ legend small{display:block;margin-top:4px}',
    '.nca-orbit{display:grid;grid-template-columns:44px 1fr 44px;align-items:center;gap:4px;margin:4px -6px 0}',
    '.nca-stage{position:relative;height:250px;perspective:1300px;perspective-origin:50% 22%;overflow:hidden;touch-action:pan-y;outline:none;',
    '-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 16%,#000 84%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 16%,#000 84%,transparent 100%)}',
    '.nca-orbit-line{position:absolute;left:4%;right:4%;top:146px;height:86px;border-radius:50%;border:1px solid color-mix(in srgb,var(--nca-gold) 38%,transparent);border-top-color:transparent;pointer-events:none}',
    '.nca-ring{position:absolute;left:50%;top:18px;width:0;height:0;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.22,.8,.24,1)}',
    '.nca-ring.nca-still,.nca-ring.nca-still .nca-planet{transition:none}',
    '.nca-planet{position:absolute;left:-72px;top:0;width:144px;height:178px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;padding:16px 12px;',
    'border:1px solid var(--nca-line);border-radius:18px;background:var(--nca-paper);color:var(--nca-ink);cursor:pointer;font:inherit;text-align:center;',
    'outline:1px solid color-mix(in srgb,var(--nca-gold) 22%,transparent);outline-offset:-7px;backface-visibility:hidden;-webkit-backface-visibility:hidden;',
    'transition:opacity .9s ease,border-color .3s,box-shadow .3s}',
    '.nca-planet svg{width:34px;height:34px;fill:none;stroke:var(--nca-gold);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}',
    '.nca-pname{font-family:var(--nca-serif);font-size:21px;line-height:1.08;font-weight:500;text-wrap:balance}',
    '.nca-pcount{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--nca-soft)}',
    '.nca-planet.front{border-color:color-mix(in srgb,var(--nca-gold) 70%,transparent);box-shadow:0 18px 34px -18px rgba(74,51,36,.45)}',
    '.nca-planet:focus-visible{outline:2px solid var(--nca-gold);outline-offset:3px}',
    '.nca-orb-nav{width:44px;height:44px;border-radius:50%;border:1px solid var(--nca-line);background:var(--nca-paper);color:var(--nca-ink);cursor:pointer;display:grid;place-items:center;transition:border-color .2s}',
    '.nca-orb-nav:hover{border-color:var(--nca-gold)}.nca-orb-nav:focus-visible{outline:2px solid var(--nca-gold);outline-offset:2px}',
    '.nca-orb-nav svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
    '.nca-dots{display:flex;justify-content:center;gap:7px;margin-top:-4px}',
    '.nca-dots i{width:5px;height:5px;border-radius:50%;background:var(--nca-line);transition:background .4s,transform .4s}',
    '.nca-dots i.on{background:var(--nca-gold);transform:scale(1.35)}',
    '.nca-moons{display:grid;gap:10px;justify-items:center;text-align:center;min-height:104px}',
    '.nca-moons .nca-chips{justify-content:center}',
    '@keyframes nca-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
    '.nca-fade{animation:nca-fade .45s ease both}',
    '.nca-tabs{display:flex;gap:6px;padding:4px;border:1px solid var(--nca-line);border-radius:999px;background:var(--nca-tint);width:max-content;max-width:100%;overflow-x:auto}',
    '.nca-tab{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;min-height:38px;padding:0 16px;border-radius:999px;font-size:14px;color:var(--nca-soft);white-space:nowrap}',
    '.nca-tab.on{background:var(--nca-paper);color:var(--nca-ink);box-shadow:0 1px 4px rgba(74,51,36,.12)}',
    '.nca-tab b{display:inline-grid;place-items:center;min-width:19px;height:19px;padding:0 5px;border-radius:999px;background:var(--nca-gold);color:#fff;font-size:11px;font-weight:500}',
    '.nca-tab:focus-visible{outline:2px solid var(--nca-gold);outline-offset:2px}',
    '@media(max-width:560px){.nca-tabs{width:100%;gap:2px}.nca-tab{flex:1;justify-content:center;padding:0 6px;font-size:13.5px;gap:4px}.nca-tab b{min-width:17px;height:17px;font-size:10px;padding:0 4px}}',
    '@media(max-width:560px){.nca-orbit{grid-template-columns:34px 1fr 34px;margin:0 -6px}.nca-moons .nca-chip span{min-height:38px;padding:6px 12px;font-size:14px}.nca-moons .nca-chips{gap:6px}.nca-orb-nav{width:36px;height:36px}.nca-stage{height:214px}',
    '.nca-planet{left:-58px;width:116px;height:152px;gap:7px;padding:12px 8px}.nca-pname{font-size:18px}.nca-planet svg{width:28px;height:28px}.nca-orbit-line{top:124px;height:70px}}',
    '@media(prefers-reduced-motion:reduce){.nca *{transition:none!important;animation:none!important}}'
  ].join('');

  function mount(el) {
    if (el.__nca) return; el.__nca = true; root = el; el.classList.add('nca');
    if (!document.getElementById('nca-css')) { var st = document.createElement('style'); st.id = 'nca-css'; st.textContent = CSS; document.head.appendChild(st); }
    load(); furthest = S.step;
    OCCASIONS.forEach(function (g, i) { if (g[1].indexOf(S.occasion) > -1) { orbitIdx = i; orbitRot = i * 360 / OCCASIONS.length; } });
    render();
    var sx = null;
    el.addEventListener('pointerdown', function (e) { if (e.target.closest('.nca-stage')) { sx = e.clientX; swiped = false; stopDrift(true); } });
    el.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 28) { swiped = true; turnTo(orbitIdx + (dx < 0 ? 1 : -1), true); setTimeout(function () { swiped = false; }, 50); }
    });
    el.addEventListener('keydown', function (e) {
      if (!e.target.closest || !e.target.closest('.nca-orbit')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); turnTo(orbitIdx + (e.key === 'ArrowRight' ? 1 : -1), true);
        var f = root.querySelector('.nca-planet.front'); if (f) f.focus({ preventScroll: true });
      }
    });
    // tapping the occasion that's already chosen (after coming back) moves on again
    el.addEventListener('click', function (e) {
      var l = e.target.closest && e.target.closest('.nca-moons .nca-chip');
      if (!l || e.target.matches('input')) return;
      var i = l.querySelector('input');
      if (i && i.checked && S.occasion === i.value) advance(l);
    });
    var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(layoutOrbit, 120); });
    el.addEventListener('input', onInput); el.addEventListener('change', onInput); el.addEventListener('click', onClick);
    el.addEventListener('submit', function (e) { e.preventDefault(); forward(); });
    el.addEventListener('keydown', function (e) {
      var t = e.target;
      if (e.key === 'Enter' && t.matches('input:not([type=radio]):not([type=checkbox])')) {
        e.preventDefault(); if (t.value.trim()) advance(t);
      }
    });
    // an occasion "Other" or delivery location typed then left: move on
    el.addEventListener('focusout', function (e) {
      var t = e.target;
      if (t.id === 'nca-occasionOther' && t.value.trim() && !root.contains(e.relatedTarget)) advance(t);
    });
    if (location.hash === '#apparel') setTimeout(function () { el.scrollIntoView({ behavior: 'smooth' }); }, 300);
  }
  function init() { var el = document.querySelector('[data-apparel-order]'); if (el) mount(el); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
