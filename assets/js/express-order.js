/* =============================================================================
   Café Chico — Express Order (order-direct demo)
   -----------------------------------------------------------------------------
   • Loads the menu from assets/data/menu.json and renders it by category
   • Basket: add / increment / decrement / remove, live totals, saved to
     localStorage so it survives a page reload
   • Checkout: details -> payment -> confirmation (demo: no real payment taken)
   ============================================================================= */
(function () {
  'use strict';

  var CURRENCY = '£';
  var STORE_KEY = 'cc_express_basket_v1';
  var FREE_DELIVERY_MILES = 2;   // flyer: "FREE DELIVERY WITHIN TWO MILES"
  var DELIVERY_MIN = 10;         // demo assumption: £10 minimum for delivery

  var state = {
    items: [],          // menu items
    cats: [],           // categories
    basket: {},         // slug -> qty
    mode: 'delivery',   // delivery | collection
    activeCat: 'all',
    query: '',
    step: 1,            // checkout step 1-3
    payment: 'card'
  };

  /* ------------------------------------------------------------ utilities */
  function money(n) { return CURRENCY + Number(n).toFixed(2); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function byslug(slug) { return state.items.filter(function (i) { return i.slug === slug; })[0]; }

  function saveBasket() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ basket: state.basket, mode: state.mode })); } catch (e) {}
  }
  function loadBasket() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      var d = JSON.parse(raw);
      if (d && d.basket) state.basket = d.basket;
      if (d && d.mode) state.mode = d.mode;
    } catch (e) {}
  }

  /* --------------------------------------------------------------- totals */
  function basketLines() {
    return Object.keys(state.basket).map(function (slug) {
      var it = byslug(slug);
      if (!it) return null;
      var qty = state.basket[slug];
      return { slug: slug, name: it.name, price: Number(it.price), qty: qty, total: Number(it.price) * qty };
    }).filter(Boolean);
  }
  function count() {
    return Object.keys(state.basket).reduce(function (n, s) { return n + state.basket[s]; }, 0);
  }
  function subtotal() {
    return basketLines().reduce(function (n, l) { return n + l.total; }, 0);
  }
  function deliveryFee() { return 0; }            // free within two miles
  function total() { return subtotal() + (state.mode === 'delivery' ? deliveryFee() : 0); }

  /* -------------------------------------------------------------- render */
  function itemPhoto(it) {
    if (it.image) {
      return '<img src="' + it.image + '" alt="' + escapeAttr(it.name) + '" loading="lazy" />';
    }
    return '<span>No photo<br/>yet</span>';
  }
  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function cardHtml(it) {
    var qty = state.basket[it.slug] || 0;
    return '' +
      '<article class="ex-card" data-slug="' + it.slug + '">' +
        '<div class="ex-card__photo' + (it.image ? '' : ' ex-card__photo--none') + '">' + itemPhoto(it) + '</div>' +
        '<div class="ex-card__body">' +
          '<h3 class="ex-card__name">' + escapeAttr(it.name) + '</h3>' +
          (it.desc ? '<p class="ex-card__desc">' + escapeAttr(it.desc) + '</p>' : '') +
          '<div class="ex-card__foot">' +
            '<span class="ex-card__price">' + money(it.price) + '</span>' +
            (qty > 0
              ? '<span class="ex-qty" data-qty="' + it.slug + '">' +
                  '<button type="button" data-act="dec" aria-label="Remove one ' + escapeAttr(it.name) + '">−</button>' +
                  '<span aria-live="polite">' + qty + '</span>' +
                  '<button type="button" data-act="inc" aria-label="Add one more ' + escapeAttr(it.name) + '">+</button>' +
                '</span>'
              : '<button class="ex-add" type="button" data-act="add">Add +</button>') +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderMenu() {
    var host = $('#ex-menu');
    if (!host) return;
    var q = state.query.trim().toLowerCase();
    var cats = state.cats.filter(function (c) { return state.activeCat === 'all' || c.slug === state.activeCat; });
    var html = '';
    var shown = 0;
    cats.forEach(function (c) {
      var items = state.items.filter(function (i) {
        if (i.cat_slug !== c.slug) return false;
        if (!q) return true;
        return (i.name + ' ' + (i.desc || '')).toLowerCase().indexOf(q) >= 0;
      });
      if (!items.length) return;
      shown += items.length;
      html += '<section class="ex-section" id="ex-cat-' + c.slug + '">' +
        '<div class="ex-section__head"><h2>' + escapeAttr(c.label) + '</h2>' +
        '<span class="ex-section__count">' + items.length + ' item' + (items.length > 1 ? 's' : '') + '</span></div>' +
        '<div class="ex-grid">' + items.map(cardHtml).join('') + '</div></section>';
    });
    host.innerHTML = html || '<p class="ex-empty">Nothing matched “' + escapeAttr(state.query) + '”. Try another search.</p>';
    var c = $('#ex-count');
    if (c) c.textContent = shown + ' items';
  }

  function renderBasket() {
    var lines = basketLines();
    var n = count();
    $$('[data-basket-count]').forEach(function (el) { el.textContent = n; });
    $$('[data-basket-total]').forEach(function (el) { el.textContent = money(total()); });

    var list = $('#ex-basket-list');
    if (list) {
      list.innerHTML = lines.length
        ? lines.map(function (l) {
            return '<li class="ex-line">' +
              '<div><p class="ex-line__name">' + escapeAttr(l.name) + '</p>' +
              '<span class="ex-qty" data-qty="' + l.slug + '">' +
                '<button type="button" data-act="dec" aria-label="Remove one ' + escapeAttr(l.name) + '">−</button>' +
                '<span>' + l.qty + '</span>' +
                '<button type="button" data-act="inc" aria-label="Add one more ' + escapeAttr(l.name) + '">+</button>' +
              '</span></div>' +
              '<div class="ex-line__right"><div class="ex-line__total">' + money(l.total) + '</div>' +
              '<button class="ex-line__remove" type="button" data-act="remove">Remove</button></div>' +
            '</li>';
          }).join('')
        : '<li class="ex-basket__empty">' +
            '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6h15l-1.6 9H7.2L6 6z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>' +
            '<p>Your basket is empty.<br/>Add something from the menu.</p></li>';
    }

    var sum = $('#ex-summary');
    if (sum) {
      sum.innerHTML = '' +
        '<div class="ex-sum__row"><span>Subtotal</span><strong>' + money(subtotal()) + '</strong></div>' +
        '<div class="ex-sum__row"><span>' + (state.mode === 'delivery' ? 'Delivery (free within 2 miles)' : 'Collection') + '</span><strong>Free</strong></div>' +
        '<div class="ex-sum__row ex-sum__row--total"><span>Total</span><strong>' + money(total()) + '</strong></div>';
    }

    var cta = $('#ex-checkout');
    if (cta) {
      cta.disabled = n === 0;
      cta.textContent = n === 0 ? 'Basket is empty' : 'Checkout · ' + money(total());
    }
    var hint = $('#ex-minhint');
    if (hint) {
      if (state.mode === 'delivery' && subtotal() > 0 && subtotal() < DELIVERY_MIN) {
        hint.textContent = 'Delivery minimum is ' + money(DELIVERY_MIN) + ' — ' + money(DELIVERY_MIN - subtotal()) + ' to go.';
      } else if (state.mode === 'delivery') {
        hint.textContent = 'Free delivery within 2 miles · around 25–40 minutes.';
      } else {
        hint.textContent = 'Collection from 185 St Helens Rd · ready in about 20 minutes.';
      }
    }
    $$('.ex-toggle button').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-mode') === state.mode);
      b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === state.mode));
    });
  }

  function renderAll() { renderMenu(); renderBasket(); saveBasket(); }

  /* ------------------------------------------------------------- actions */
  function add(slug, delta) {
    var it = byslug(slug);
    if (!it) return;
    var q = (state.basket[slug] || 0) + (delta || 1);
    if (q <= 0) delete state.basket[slug]; else state.basket[slug] = q;
    renderAll();
  }

  function onMenuClick(e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var host = btn.closest('[data-slug]');
    if (!host) return;
    var slug = host.getAttribute('data-slug');
    var act = btn.getAttribute('data-act');
    if (act === 'add') { add(slug, 1); toast('Added to your basket'); }
    else if (act === 'inc') add(slug, 1);
    else if (act === 'dec') add(slug, -1);
    else if (act === 'remove') { delete state.basket[slug]; renderAll(); }
  }

  function toast(msg) {
    var t = $('#ex-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('is-on'); }, 1400);
  }

  /* ------------------------------------------------------------- checkout */
  function openCheckout() {
    if (!count()) return;
    state.step = 1;
    renderCheckout();
    var m = $('#ex-modal');
    if (m) { m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  }
  function closeCheckout() {
    var m = $('#ex-modal');
    if (m) { m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
    var b = $('#ex-basket');
    if (b) b.classList.remove('is-open');
  }

  function summaryHtml() {
    var lines = basketLines();
    return lines.map(function (l) {
      return '<div><span>' + l.qty + ' × ' + escapeAttr(l.name) + '</span><span>' + money(l.total) + '</span></div>';
    }).join('') +
      '<div style="border-top:1px solid var(--hairline);margin-top:6px;padding-top:8px"><span><strong>Total</strong></span><span><strong>' + money(total()) + '</strong></span></div>';
  }

  function renderCheckout() {
    var body = $('#ex-modal-body');
    var foot = $('#ex-modal-foot');
    var title = $('#ex-modal-title');
    if (!body) return;

    if (state.step === 1) {
      if (title) title.textContent = 'Checkout · 1 of 3 · Your details';
      body.innerHTML = '' +
        '<div class="ex-steps"><span class="is-active">1 Details</span><span>2 Payment</span><span>3 Confirmed</span></div>' +
        '<div class="ex-field" id="f-name"><label for="i-name">Name</label><input id="i-name" type="text" autocomplete="name" placeholder="e.g. Aaliyah M." /><p class="ex-field__error">Please enter your name</p></div>' +
        '<div class="ex-field" id="f-phone"><label for="i-phone">Phone</label><input id="i-phone" type="tel" autocomplete="tel" placeholder="07…" /><p class="ex-field__error">Please enter a valid UK phone number</p></div>' +
        (state.mode === 'delivery'
          ? '<div class="ex-field" id="f-addr"><label for="i-addr">Delivery address</label><input id="i-addr" type="text" autocomplete="street-address" placeholder="House number and street" /><p class="ex-field__error">Please enter the delivery address</p></div>' +
            '<div class="ex-field--row">' +
              '<div class="ex-field" id="f-post"><label for="i-post">Postcode</label><input id="i-post" type="text" placeholder="BL3 3PS" /><p class="ex-field__error">Please enter the postcode</p></div>' +
              '<div class="ex-field"><label for="i-time">Time</label><select id="i-time"><option>As soon as possible (25–40 min)</option><option>In 1 hour</option><option>Tonight at 6:00</option></select></div>' +
            '</div>'
          : '<div class="ex-field"><label for="i-time">Collection time</label><select id="i-time"><option>As soon as possible (about 20 min)</option><option>In 30 minutes</option><option>In 1 hour</option></select></div>') +
        '<div class="ex-field"><label for="i-notes">Notes (optional)</label><textarea id="i-notes" rows="3" placeholder="e.g. no onions, sauces on the side, halal…"></textarea></div>' +
        '<p class="ex-field__hint">' + (state.mode === 'delivery'
            ? 'Free delivery within two miles. Outside that we will call you to confirm the delivery cost.'
            : 'Collection from 185 St Helens Rd, Bolton BL3 3PS (Tue–Sun 09:00–16:00).') + '</p>';
      if (foot) foot.innerHTML = '<button class="ex-cta" type="button" id="ex-next">Continue to payment</button>';
    }

    if (state.step === 2) {
      if (title) title.textContent = 'Checkout · 2 of 3 · Payment';
      body.innerHTML = '' +
        '<div class="ex-steps"><span>1 Details</span><span class="is-active">2 Payment</span><span>3 Confirmed</span></div>' +
        '<div class="ex-pay" role="radiogroup" aria-label="Payment method">' +
          payOpt('card', 'Card', 'Visa · Mastercard · Amex', '<span>🔒</span>') +
          payOpt('apple', 'Apple Pay', 'One tap with Face ID or Touch ID', '') +
          payOpt('google', 'Google Pay', 'Pay with your Google account', '') +
          payOpt('cash', 'Pay in the café', 'Cash or card on collection or delivery', '') +
        '</div>' +
        '<div class="ex-cardform' + (state.payment === 'card' ? ' is-active' : '') + '" id="ex-cardform">' +
          '<div class="ex-field" id="f-num"><label for="i-num">Card number</label><input id="i-num" type="text" inputmode="numeric" placeholder="4242 4242 4242 4242" autocomplete="cc-number" /><p class="ex-field__error">Please enter a 16-digit card number</p></div>' +
          '<div class="ex-field--row">' +
            '<div class="ex-field" id="f-exp"><label for="i-exp">Expiry</label><input id="i-exp" type="text" inputmode="numeric" placeholder="MM/YY" autocomplete="cc-exp" /><p class="ex-field__error">Use MM/YY</p></div>' +
            '<div class="ex-field" id="f-cvc"><label for="i-cvc">Security code</label><input id="i-cvc" type="text" inputmode="numeric" placeholder="123" autocomplete="cc-csc" /><p class="ex-field__error">3–4 digits</p></div>' +
          '</div>' +
          '<div class="ex-field" id="f-ccname"><label for="i-ccname">Name on card</label><input id="i-ccname" type="text" autocomplete="cc-name" /><p class="ex-field__error">Please enter the name on the card</p></div>' +
        '</div>' +
        '<div class="ex-wallet" id="ex-wallet" style="display:' + (state.payment === 'card' || state.payment === 'cash' ? 'none' : 'grid') + '">' +
          '<button type="button" id="ex-wallet-pay">' + (state.payment === 'google' ? 'Pay with Google Pay' : 'Pay with Apple Pay') + '</button>' +
          '<button type="button" class="ex-wallet--light" id="ex-pay-later">Pay in the café instead</button>' +
        '</div>' +
        '<p class="ex-field__hint">Demo only — no payment is taken and no card details are stored.</p>';
      if (foot) foot.innerHTML = '<button class="ex-cta" type="button" id="ex-pay">Pay ' + money(total()) + '</button>' +
        '<button class="ex-cta" type="button" id="ex-back" style="background:transparent;color:var(--ink);border:1px solid var(--hairline);margin-top:8px">Back to details</button>';
    }

    if (state.step === 3) {
      if (title) title.textContent = 'Order confirmed';
      var num = 'CC-' + String(Math.floor(1000 + Math.random() * 8999));
      body.innerHTML = '' +
        '<div class="ex-done">' +
          '<svg class="ex-done__tick" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="none" stroke="#a8a84a" stroke-width="4"/><path d="M19 33l9 9 17-18" fill="none" stroke="#a8a84a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<h3>Thanks — we have your order!</h3>' +
          '<span class="ex-done__num">Order ' + num + '</span>' +
          '<div class="ex-done__list">' + summaryHtml() + '</div>' +
          '<p class="ex-field__hint" style="text-align:left">' +
            (state.mode === 'delivery'
              ? 'Delivery: about 25–40 minutes (free within two miles). We will call to confirm.'
              : 'Collection: ready in about 20 minutes from 185 St Helens Rd.') +
            '<br/>Payment: ' + payLabel(state.payment) +
          '</p>' +
          '<p class="ex-demo" style="margin-top:16px">This is the Express Order <strong>demo flow</strong> — no payment is taken and no order is sent to the kitchen yet.</p>' +
        '</div>';
      if (foot) foot.innerHTML =
        '<button class="ex-cta" type="button" id="ex-again">Start another order</button>' +
        '<a class="ex-cta" href="menu.html" style="display:block;text-align:center;text-decoration:none;background:transparent;color:var(--ink);border:1px solid var(--hairline);margin-top:8px">Back to the menu</a>';
    }
  }

  function payOpt(val, label, desc, badge) {
    return '<label class="ex-pay__opt' + (state.payment === val ? ' is-active' : '') + '" data-pay="' + val + '">' +
      '<input type="radio" name="ex-payment" value="' + val + '"' + (state.payment === val ? ' checked' : '') + ' />' +
      '<span><span class="ex-pay__label">' + label + '</span><br/><span class="ex-pay__desc">' + desc + '</span></span>' +
      (badge ? '<span class="ex-pay__badges">' + badge + '</span>' : '') +
    '</label>';
  }
  function payLabel(v) {
    return { card: 'Card', apple: 'Apple Pay', google: 'Google Pay', cash: 'Pay in the café' }[v] || v;
  }

  /* ---------------------------------------------------------- validation */
  function fieldError(id, on) {
    var f = document.getElementById(id);
    if (f) f.classList.toggle('has-error', !!on);
    return !on;
  }
  function validDetails() {
    var ok = true;
    ok = fieldError('f-name', !($('#i-name') && $('#i-name').value.trim())) && ok;
    var phone = ($('#i-phone') && $('#i-phone').value.replace(/[^0-9+]/g, '')) || '';
    ok = fieldError('f-phone', !(phone.length >= 10)) && ok;
    if (state.mode === 'delivery') {
      ok = fieldError('f-addr', !($('#i-addr') && $('#i-addr').value.trim())) && ok;
      ok = fieldError('f-post', !($('#i-post') && $('#i-post').value.trim().length >= 3)) && ok;
      if (subtotal() < DELIVERY_MIN) {
        toast('Delivery minimum is ' + money(DELIVERY_MIN));
        ok = false;
      }
    }
    return ok;
  }
  function validCard() {
    var ok = true;
    var num = (($('#i-num') && $('#i-num').value) || '').replace(/\s+/g, '');
    ok = fieldError('f-num', !/^\d{16}$/.test(num)) && ok;
    var exp = (($('#i-exp') && $('#i-exp').value) || '').trim();
    var m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(exp);
    var expOk = false;
    if (m) {
      var mm = parseInt(m[1], 10), yy = 2000 + parseInt(m[2], 10);
      var now = new Date();
      expOk = mm >= 1 && mm <= 12 && (yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1));
    }
    ok = fieldError('f-exp', !expOk) && ok;
    var cvc = (($('#i-cvc') && $('#i-cvc').value) || '').trim();
    ok = fieldError('f-cvc', !/^\d{3,4}$/.test(cvc)) && ok;
    ok = fieldError('f-ccname', !($('#i-ccname') && $('#i-ccname').value.trim())) && ok;
    return ok;
  }

  /* ------------------------------------------------------------- wire up */
  function wire() {
    var tabs = $('#ex-tabs');
    if (tabs) {
      tabs.addEventListener('click', function (e) {
        var b = e.target.closest('.ex-tab');
        if (!b) return;
        state.activeCat = b.getAttribute('data-cat');
        $$('.ex-tab').forEach(function (t) { t.classList.toggle('is-active', t === b); });
        renderMenu();
      });
    }
    var search = $('#ex-search');
    if (search) {
      var t;
      search.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () { state.query = search.value; renderMenu(); }, 160);
      });
    }
    var menu = $('#ex-menu');
    if (menu) menu.addEventListener('click', onMenuClick);
    var blist = $('#ex-basket-list');
    if (blist) blist.addEventListener('click', onMenuClick);

    $$('.ex-toggle button').forEach(function (b) {
      b.addEventListener('click', function () {
        state.mode = b.getAttribute('data-mode');
        renderBasket(); saveBasket(); renderCheckout();
      });
    });

    var co = $('#ex-checkout');
    if (co) co.addEventListener('click', openCheckout);
    var bar = $('#ex-mobilebar');
    if (bar) bar.addEventListener('click', function () {
      var b = $('#ex-basket');
      if (b) { b.classList.add('is-open'); b.scrollIntoView({ behavior: 'smooth', block: 'end' }); }
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-close-modal]')) closeCheckout();
      var opt = e.target.closest('.ex-pay__opt');
      if (opt) {
        state.payment = opt.getAttribute('data-pay');
        renderCheckout();
      }
      var id = e.target.id;
      if (id === 'ex-next') { if (validDetails()) { state.step = 2; renderCheckout(); } }
      else if (id === 'ex-back') { state.step = 1; renderCheckout(); }
      else if (id === 'ex-pay') {
        if (state.payment === 'card' ? validCard() : true) { state.step = 3; renderCheckout(); }
      }
      else if (id === 'ex-wallet-pay' || id === 'ex-pay-later') {
        if (id === 'ex-pay-later') state.payment = 'cash';
        state.step = 3; renderCheckout();
      }
      else if (id === 'ex-again') {
        state.basket = {}; state.step = 1;
        saveBasket(); renderAll(); closeCheckout();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCheckout();
    });
  }

  /* ----------------------------------------------------------------- init */
  function init() {
    loadBasket();
    fetch('assets/data/menu.json')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        state.items = d.items || [];
        state.cats = d.categories || [];
        var tabs = $('#ex-tabs');
        if (tabs) {
          tabs.innerHTML = '<button type="button" class="ex-tab is-active" data-cat="all">All</button>' +
            state.cats.map(function (c) {
              return '<button type="button" class="ex-tab" data-cat="' + c.slug + '">' + escapeAttr(c.label) + '</button>';
            }).join('');
        }
        renderAll();
        wire();
      })
      .catch(function () {
        var host = $('#ex-menu');
        if (host) host.innerHTML = '<p class="ex-empty">Sorry — the menu could not be loaded. Please refresh the page.</p>';
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
