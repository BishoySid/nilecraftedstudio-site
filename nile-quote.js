/*!
 * Nile Crafted Studio — custom order request form.
 * Any link or button with data-quote opens it (data-category / data-occasion pre-select those fields).
 * Sending opens the visitor's own email or messages app with everything filled in;
 * nothing is stored or sent anywhere by this site.
 * Deep link: nilecraftedstudio.com/#quote opens the form.
 */
(function () {
  'use strict';

  var CONFIG = {
    email: 'nilecraftedstudio@gmail.com',
    sms: '+18624140499',
    phoneLabel: '(862) 414-0499',
    categories: ['Bridal & Bridal Party Gifts', 'Personalized Apparel', 'Gifts & Keepsakes', 'Events & Celebrations', 'Business & Group Orders', 'Something else'],
    occasions: ['Wedding', 'Engagement', 'Bridal Shower', 'Baby Shower', 'Birthday', 'Anniversary', 'Graduation', 'Holiday', 'Corporate Event', 'Just Because', 'Other']
  };

  var CSS = [
    '.ncq-open{overflow:hidden}',
    '.ncq-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-end;justify-content:center;background:rgba(42,31,26,.55);opacity:0;transition:opacity .2s ease}',
    '.ncq-overlay[hidden]{display:none}',
    '.ncq-overlay.is-in{opacity:1}',
    '@media(min-width:640px){.ncq-overlay{align-items:center;padding:24px}}',
    '.ncq-dialog{--ink:#3b2a1e;--muted:#6e5644;--gold:#a87a3d;--cream:#fbf7f2;--line:#e3d5c6;background:var(--cream);color:var(--ink);width:100%;max-width:520px;max-height:92vh;overflow:auto;border-radius:20px 20px 0 0;padding:24px 20px calc(20px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.18);transform:translateY(24px);transition:transform .25s ease;font-family:"Jost",system-ui,sans-serif}',
    '.ncq-overlay.is-in .ncq-dialog{transform:none}',
    '@media(min-width:640px){.ncq-dialog{border-radius:20px;padding:32px}}',
    '.ncq-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:4px}',
    '.ncq-eyebrow{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin:0 0 6px}',
    '.ncq-title{margin:0;font-family:"Cormorant Garamond",Georgia,serif;font-size:30px;line-height:1.15;font-weight:500}',
    '.ncq-sub{margin:6px 0 18px;color:var(--muted);font-size:15px;line-height:1.5}',
    '.ncq-sub a{color:var(--ink)}',
    '.ncq-x{flex:none;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:#fff;color:var(--ink);cursor:pointer;display:grid;place-items:center}',
    '.ncq-dialog :focus-visible{outline:2px solid var(--gold);outline-offset:2px}',
    '.ncq-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}',
    '.ncq-full{grid-column:1/-1}',
    '.ncq-f label{display:block;font-size:14px;font-weight:500;margin:0 0 6px}',
    '.ncq-f label small{font-weight:400;color:var(--muted)}',
    '.ncq-dialog input,.ncq-dialog select,.ncq-dialog textarea{width:100%;box-sizing:border-box;min-height:46px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:#fff;color:var(--ink);font:inherit;font-size:16px}',
    '.ncq-dialog textarea{min-height:110px;resize:vertical}',
    '.ncq-chips{display:flex;flex-wrap:wrap;gap:8px;border:0;margin:0;padding:0;min-width:0}',
    '.ncq-chips legend{font-size:14px;font-weight:500;margin:0 0 8px;padding:0}',
    '.ncq-chip{position:relative}',
    '.ncq-chip input{position:absolute;opacity:0;width:1px;height:1px;min-height:0;margin:0}',
    '.ncq-chip span{display:inline-flex;align-items:center;min-height:42px;padding:8px 15px;border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--ink);font-size:15px;cursor:pointer;transition:background .15s,border-color .15s,color .15s}',
    '.ncq-chip span:hover{border-color:var(--gold)}',
    '.ncq-chip input:checked+span{background:var(--ink);border-color:var(--ink);color:#fff}',
    '.ncq-chip input:focus-visible+span{outline:2px solid var(--gold);outline-offset:2px}',
    '.ncq-err{color:#a12d2d;font-size:14px;margin:8px 0 0}',
    '.ncq-err:empty{display:none}',
    '.ncq-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}',
    '.ncq-btn{flex:1 1 180px;min-height:50px;border-radius:999px;font:inherit;font-size:13px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;border:1px solid #c98e80;background:#c98e80;color:#fff}',
    '.ncq-btn.alt{background:transparent;color:var(--ink);border-color:var(--ink)}',
    '.ncq-fine{font-size:13px;color:var(--muted);margin:12px 0 0;text-align:center}',
    '.ncq-done{text-align:center;padding:16px 0 4px}',
    '.ncq-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important}',
    '@media(max-width:380px){.ncq-grid{grid-template-columns:1fr}}',
    '@media(prefers-reduced-motion:reduce){.ncq-overlay,.ncq-dialog{transition:none}}'
  ].join('\n');

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  var overlay, dialog, form, done, lastFocus;

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var t = new Date();
    var min = new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    overlay = document.createElement('div');
    overlay.className = 'ncq-overlay';
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="ncq-dialog" role="dialog" aria-modal="true" aria-labelledby="ncq-title">' +
      ' <div class="ncq-head"><div><p class="ncq-eyebrow">Custom order</p><h2 class="ncq-title" id="ncq-title">Start a custom order</h2></div>' +
      '  <button type="button" class="ncq-x" data-ncq-close aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      ' <p class="ncq-sub">Tell us a little about your piece and we\'ll reply with a design preview and price.</p>' +
      ' <form novalidate>' +
      '  <div class="ncq-grid">' +
      '   <fieldset class="ncq-chips ncq-full"><legend>What\'s the occasion?</legend>' +
            CONFIG.occasions.map(function (o) { return '<label class="ncq-chip"><input type="radio" name="occasion" value="' + esc(o) + '"><span>' + esc(o) + '</span></label>'; }).join('') + '</fieldset>' +
      '   <div class="ncq-f ncq-full"><label for="ncq-cat">What are you looking for?</label><select id="ncq-cat" name="category">' +
            CONFIG.categories.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('') + '</select></div>' +
      '   <div class="ncq-f"><label for="ncq-date"><span data-ncq-datelabel>Event date</span> <small>(or need-by)</small></label><input id="ncq-date" name="date" type="date" min="' + min + '"></div>' +
      '   <div class="ncq-f"><label for="ncq-qty">Quantity or guests <small>(optional)</small></label><input id="ncq-qty" name="qty" type="number" inputmode="numeric" min="1" max="5000" placeholder="e.g. 1, 25, 120"></div>' +
      '   <div class="ncq-f ncq-full"><label for="ncq-notes">Your idea</label><textarea id="ncq-notes" name="notes" maxlength="2000" placeholder="Names, wording, colors, theme, sizes — anything that helps us picture it."></textarea></div>' +
      '   <div class="ncq-f"><label for="ncq-name">Your name</label><input id="ncq-name" name="name" type="text" autocomplete="name" maxlength="80" required></div>' +
      '   <div class="ncq-f"><label for="ncq-contact">Phone or email</label><input id="ncq-contact" name="contact" type="text" autocomplete="email" maxlength="120" required></div>' +
      '   <div class="ncq-hp" aria-hidden="true"><label for="ncq-web">Leave empty</label><input id="ncq-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>' +
      '  </div>' +
      '  <p class="ncq-err" role="alert"></p>' +
      '  <div class="ncq-actions"><button type="submit" class="ncq-btn" data-via="email">Send by email</button><button type="submit" class="ncq-btn alt" data-via="sms">Send by text</button></div>' +
      '  <p class="ncq-fine">Opens your email or messages app with everything filled in, ready to send.</p>' +
      ' </form>' +
      '</div>';
    document.body.appendChild(overlay);

    dialog = overlay.querySelector('.ncq-dialog');
    form = overlay.querySelector('form');

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.closest('[data-ncq-close]')) close();
    });
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') trapTab(e);
    });
    form.addEventListener('submit', onSubmit);
    form.addEventListener('change', function (e) { if (e.target.name === 'occasion') dateLabel(); });
    form.addEventListener('reset', function () { setTimeout(dateLabel, 0); });
  }

  // "Wedding date", "Birthday date"... follows the chosen occasion
  function dateLabel() {
    var o = form.querySelector('input[name=occasion]:checked');
    var v = o && o.value;
    form.querySelector('[data-ncq-datelabel]').textContent = (v && v !== 'Other' && v !== 'Just Because') ? v + ' date' : 'Event date';
  }

  function setOccasion(v) {
    Array.prototype.forEach.call(form.querySelectorAll('input[name=occasion]'), function (r) { r.checked = (r.value === v); });
    dateLabel();
  }

  function trapTab(e) {
    var list = Array.prototype.filter.call(dialog.querySelectorAll('button,input,select,textarea,a[href]'), function (el) {
      return !el.disabled && el.tabIndex !== -1 && el.offsetParent !== null;
    });
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function open(category, date, occasion) {
    if (!overlay) build();
    if (done) { done.remove(); done = null; form.hidden = false; }
    if (category) {
      var sel = form.querySelector('#ncq-cat');
      Array.prototype.forEach.call(sel.options, function (o) { if (o.text === category) sel.value = o.text; });
    }
    if (date) form.querySelector('#ncq-date').value = date;
    if (occasion) setOccasion(occasion);
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.documentElement.classList.add('ncq-open');
    requestAnimationFrame(function () { overlay.classList.add('is-in'); });
    setTimeout(function () { form.querySelector(date ? '#ncq-notes' : '#ncq-cat').focus(); }, 60);
  }

  function close() {
    overlay.classList.remove('is-in');
    document.documentElement.classList.remove('ncq-open');
    setTimeout(function () { overlay.hidden = true; }, 200);
    if (location.hash === '#quote') history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onSubmit(e) {
    e.preventDefault();
    var via = (e.submitter && e.submitter.getAttribute('data-via')) || 'email';
    var d = new FormData(form);
    var err = form.querySelector('.ncq-err');
    if ((d.get('website') || '').length) return; // bots fill hidden fields
    var name = (d.get('name') || '').trim(), contact = (d.get('contact') || '').trim();
    if (!name || !contact) {
      err.textContent = 'Please add your name and a phone number or email so we can reply.';
      form.querySelector(!name ? '#ncq-name' : '#ncq-contact').focus();
      return;
    }
    err.textContent = '';

    var dateTxt = d.get('date') ? new Date(d.get('date') + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set';
    var body = [
      'Hi Randa! I\'d like to start a custom order.',
      '',
      'Occasion: ' + (d.get('occasion') || 'Not set'),
      'Looking for: ' + d.get('category'),
      'Date: ' + dateTxt,
      'Quantity / guests: ' + (d.get('qty') || 'N/A'),
      'My idea: ' + ((d.get('notes') || '').trim() || '-'),
      '',
      'Name: ' + name,
      'Contact: ' + contact
    ].join('\n');
    var href = via === 'sms'
      ? 'sms:' + CONFIG.sms + (/iPhone|iPad|iPod/.test(navigator.userAgent) ? '&' : '?') + 'body=' + encodeURIComponent(body)
      : 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Custom order: ' + (d.get('occasion') ? d.get('occasion') + ' – ' : '') + d.get('category') + ' (' + name + ')') + '&body=' + encodeURIComponent(body);

    window.location.href = href;

    form.hidden = true;
    done = document.createElement('div');
    done.className = 'ncq-done';
    done.innerHTML = '<h3 class="ncq-title" style="font-size:26px">Almost there</h3>' +
      '<p class="ncq-sub">Your ' + (via === 'sms' ? 'messages' : 'email') + ' app should open with your request. Tap send and we\'ll be in touch.</p>' +
      '<p class="ncq-sub">Didn\'t open? Call or text <a href="tel:' + CONFIG.sms + '">' + CONFIG.phoneLabel + '</a> or email <a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a>.</p>' +
      '<div class="ncq-actions"><button type="button" class="ncq-btn alt" data-ncq-close>Close</button></div>';
    dialog.appendChild(done);
    form.reset();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-quote]');
    if (!a) return;
    e.preventDefault();
    open(a.getAttribute('data-category'), null, a.getAttribute('data-occasion'));
  });

  // Quick start bar under the hero: carries the chosen category and date into the form
  document.addEventListener('submit', function (e) {
    var q = e.target.closest && e.target.closest('[data-quickstart]');
    if (!q) return;
    e.preventDefault();
    var c = q.querySelector('[name=qs-cat]'), d = q.querySelector('[name=qs-date]'), o = q.querySelector('[name=qs-occasion]');
    var ap = document.getElementById('apparel');
    if (ap && c && c.value === 'Personalized Apparel') { ap.scrollIntoView({ behavior: 'smooth' }); return; }
    open(c && c.value, d && d.value, o && o.value);
  });

  function checkHash() { if (location.hash === '#quote') open(); }
  window.addEventListener('hashchange', checkHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', checkHash); else checkHash();

  window.NileQuote = { open: open };
})();
