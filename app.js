/* ==========================================================================
   app.js — renders portfolio-data.js into index.html and runs the interactions.
   No framework, no build step, no runtime dependencies.

   Structure:
     helpers → rAF manager → nav → hero (classifier canvas, code cell) →
     spectrum → skills → experience → projects → github → metrics →
     neural net → knowledge → credentials → beyond → about → contact →
     terminal → boot
   ========================================================================== */
(function () {
  'use strict';

  var D = window.PORTFOLIO;
  if (!D) { console.error('portfolio-data.js failed to load'); return; }

  /* ------------------------------------------------------------- helpers */
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* lighter escape for code — keeps quotes so the highlighter can match them */
  function escCode(s) { return String(s).replace(/[&<>]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse  = window.matchMedia('(hover: none)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp  = function (a, b, t) { return a + (b - a) * t; };
  var pad2  = function (n) { return String(n).length < 2 ? '0' + n : String(n); };

  /* single rAF manager — every animation shares one loop, each pauses when
     off-screen or when the tab is hidden */
  var jobs = [], running = false;
  function tick(t) {
    var any = false;
    for (var i = 0; i < jobs.length; i++) {
      if (!jobs[i].on) continue;
      any = true;
      if (!document.hidden) jobs[i].fn(t);
    }
    running = any;
    if (any) requestAnimationFrame(tick);
  }
  function addJob(fn, node) {
    var job = { fn: fn, on: false };
    jobs.push(job);
    if (node && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        job.on = es[0].isIntersecting;
        if (job.on && !running) { running = true; requestAnimationFrame(tick); }
      }, { rootMargin: '140px' }).observe(node);
    } else { job.on = true; }
    if (!running) { running = true; requestAnimationFrame(tick); }
    return job;
  }
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && !running) { running = true; requestAnimationFrame(tick); }
  });

  function sizeCanvas(cv) {
    var r = cv.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    cv.width = w * dpr; cv.height = h * dpr;
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: w, h: h, ctx: ctx };
  }
  function onResize(fn) {
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fn, 170); });
  }

  /* fire a callback the first time an element scrolls into view */
  function onceVisible(node, fn, threshold) {
    if (!node) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es, o) {
      if (es[0].isIntersecting) { fn(); o.disconnect(); }
    }, { threshold: threshold == null ? 0.3 : threshold });
    io.observe(node);
  }

  /* reveal-on-scroll */
  var revealIO = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (es, o) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -7% 0px', threshold: 0.06 })
    : null;
  function watchReveal(root) {
    $$('.reveal', root || document).forEach(function (n) {
      if (revealIO) revealIO.observe(n); else n.classList.add('in');
    });
  }

  var P = D.profile, C = D.contact;

  /* =========================================================== NAVIGATION */
  var navEl = $('#nav'), navLinks = $('#navLinks'), navToggle = $('#navToggle');

  $('#brandSub').textContent = P.role;

  D.nav.forEach(function (n) {
    var a = el('a', null, esc(n.label));
    a.href = '#' + n.id;
    navLinks.appendChild(a);
  });

  navToggle.addEventListener('click', function () {
    var open = navEl.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navEl.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navEl.classList.contains('open')) {
      navEl.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  var progressBar = $('#progressBar');
  var navAnchors = $$('a', navLinks);
  var spyTargets = D.nav.map(function (n) { return document.getElementById(n.id); });

  var scrollQueued = false;
  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(function () {
      scrollQueued = false;
      var y = window.pageYOffset;
      navEl.classList.toggle('stuck', y > 18);

      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? clamp(y / max, 0, 1) * 100 : 0) + '%';

      var active = -1, probe = y + 150;
      for (var i = 0; i < spyTargets.length; i++) {
        if (spyTargets[i] && spyTargets[i].offsetTop <= probe) active = i;
      }
      if (y + window.innerHeight >= document.body.scrollHeight - 4) active = spyTargets.length - 1;
      navAnchors.forEach(function (a, i) {
        if (i === active) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ================================================================= HERO */
  $('#heroAvail').textContent = P.availability;
  $('#heroRole').textContent  = P.role;
  $('#heroDisc').textContent  = P.discipline;
  $('#heroLede').textContent  = P.headline;
  $('#heroVp').textContent    = P.valueProp;

  var nameParts = P.name.split(' ');
  var nameLines = $$('#heroName .line > span');
  if (nameLines[0]) nameLines[0].textContent = nameParts[0] || P.name;
  if (nameLines[1]) nameLines[1].textContent = nameParts.slice(1).join(' ');

  /* colour legend — doubles as the site's key */
  D.legend.forEach(function (l) {
    var li = el('li', null, esc(l.label));
    li.setAttribute('data-tone', l.key);
    $('#heroLegend').appendChild(li);
  });

  /* CTA row — the Résumé button only renders when a file is configured */
  (function heroCta() {
    var host = $('#heroCta');
    var items = [
      { label: 'View projects', href: '#projects', cls: 'btn btn-primary' },
      { label: 'GitHub',   href: C.github.url,   cls: 'btn', ext: true },
      { label: 'LinkedIn', href: C.linkedin.url, cls: 'btn', ext: true }
    ];
    if (C.resumeUrl) items.push({ label: 'Résumé', href: C.resumeUrl, cls: 'btn', ext: true, dl: true });
    items.push({ label: 'Contact', href: '#contact', cls: 'btn btn-ghost' });

    items.forEach(function (it) {
      var a = el('a', it.cls, esc(it.label) + (it.ext ? ' <i aria-hidden="true">↗</i>' : ''));
      a.href = it.href;
      if (it.ext) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      if (it.dl) a.setAttribute('download', '');
      host.appendChild(a);
    });
  })();

  /* recruiter scan strip */
  P.snapshot.forEach(function (s) {
    var d = el('div', 'snap-item');
    d.innerHTML =
      '<span class="snap-k mono">' + esc(s.k) + '</span>' +
      '<p class="snap-v">' + esc(s.v) + '</p>' +
      '<p class="snap-s">' + esc(s.s) + '</p>';
    $('#snap').appendChild(d);
  });

  /* ------------------------------------------------ SIGNATURE: live classifier
     Two classes stream in, a decision boundary fits itself, accuracy climbs.
     Everything on screen is real: the accuracy readout is computed from the
     points and the current boundary, not faked.                              */
  (function classifier() {
    var cv = $('#clsCanvas'); if (!cv) return;
    var accOut = $('#clsAcc'), epochOut = $('#clsEpoch');
    var S = sizeCanvas(cv), ctx = S.ctx;

    var COL = { a: '77,155,255', b: '155,123,255', ok: '47,215,155' };
    var pts = [], target = null, w = null, epoch = 0, shown = 0, phase = 0, hold = 0;

    function gauss() {
      var u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    function dataset() {
      var n = S.w < 420 ? 34 : 52;
      var ang = Math.random() * Math.PI;
      var dx = Math.cos(ang) * 0.19, dy = Math.sin(ang) * 0.19;
      pts = [];
      for (var i = 0; i < n; i++) {
        var lab = i % 2;
        var cx = 0.5 + (lab ? dx : -dx), cy = 0.5 + (lab ? dy : -dy);
        pts.push({
          x: clamp(cx + gauss() * 0.105, 0.05, 0.95),
          y: clamp(cy + gauss() * 0.105, 0.06, 0.94),
          l: lab, r: 0
        });
      }
      /* optimal boundary: perpendicular bisector of the two class means */
      var m = [[0, 0, 0], [0, 0, 0]];
      pts.forEach(function (p) { m[p.l][0] += p.x; m[p.l][1] += p.y; m[p.l][2]++; });
      var a = [m[0][0] / m[0][2], m[0][1] / m[0][2]];
      var b = [m[1][0] / m[1][2], m[1][1] / m[1][2]];
      var nx = b[0] - a[0], ny = b[1] - a[1];
      var mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      target = { nx: nx, ny: ny, c: -(nx * mid[0] + ny * mid[1]) };
      /* start wrongly oriented but still cutting through the cloud, so the
         opening frame reads as a plausible bad fit rather than a blank field */
      var a0 = (Math.random() < .5 ? 1 : -1) * (0.95 + Math.random() * 0.4);
      var ca = Math.cos(a0), sa = Math.sin(a0);
      var rnx = nx * ca - ny * sa, rny = nx * sa + ny * ca;
      w = { nx: rnx, ny: rny, c: -(rnx * mid[0] + rny * mid[1]) };
      epoch = 0; shown = 0; phase = 0; hold = 0;
    }
    dataset();

    function side(p, ww) { return ww.nx * p.x + ww.ny * p.y + ww.c; }

    function accuracy(ww) {
      var ok = 0, tot = 0;
      for (var i = 0; i < shown; i++) {
        tot++;
        if ((side(pts[i], ww) > 0 ? 1 : 0) === pts[i].l) ok++;
      }
      return tot ? ok / tot : 0;
    }

    /* line endpoints where nx*x + ny*y + c = 0, clipped to the unit box */
    function boundary(ww) {
      var out = [];
      var edges = [
        [0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]
      ];
      edges.forEach(function (e) {
        var x1 = e[0], y1 = e[1], x2 = e[2], y2 = e[3];
        var d1 = ww.nx * x1 + ww.ny * y1 + ww.c;
        var d2 = ww.nx * x2 + ww.ny * y2 + ww.c;
        if ((d1 > 0) !== (d2 > 0)) {
          var t = d1 / (d1 - d2);
          out.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
        }
      });
      return out.length >= 2 ? out : null;
    }

    function draw(time) {
      var W = S.w, H = S.h, PADX = 16, PADY = 14;
      var mx = function (x) { return PADX + x * (W - PADX * 2); };
      var my = function (y) { return PADY + (1 - y) * (H - PADY * 2); };

      ctx.clearRect(0, 0, W, H);

      /* plot grid */
      ctx.strokeStyle = 'rgba(255,255,255,.045)'; ctx.lineWidth = 1;
      for (var g = 0; g <= 4; g++) {
        var gy = Math.round(my(g / 4)) + .5, gx = Math.round(mx(g / 4)) + .5;
        ctx.beginPath(); ctx.moveTo(PADX, gy); ctx.lineTo(W - PADX, gy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gx, PADY); ctx.lineTo(gx, H - PADY); ctx.stroke();
      }

      if (!reduced) {
        /* phase 0: stream points in.  1: fit.  2: hold.  3: reset. */
        if (phase === 0) {
          shown = Math.min(pts.length, shown + 0.9);
          if (shown >= pts.length) { shown = pts.length; phase = 1; }
        } else if (phase === 1) {
          w.nx = lerp(w.nx, target.nx, 0.028);
          w.ny = lerp(w.ny, target.ny, 0.028);
          w.c  = lerp(w.c,  target.c,  0.028);
          if (time % 6 < 1) epoch++;
          if (Math.abs(w.nx - target.nx) < 0.004 && Math.abs(w.ny - target.ny) < 0.004) { phase = 2; hold = time; }
        } else if (phase === 2) {
          if (time - hold > 3400) phase = 3;
        } else { dataset(); }
      } else { shown = pts.length; w = target; }

      var count = Math.floor(shown);
      var acc = accuracy(w);

      /* half-plane tint + boundary */
      var line = boundary(w);
      if (line) {
        var a = line[0], b = line[1];
        ctx.save();
        ctx.beginPath();
        ctx.rect(PADX, PADY, W - PADX * 2, H - PADY * 2);
        ctx.clip();
        var ax = mx(a[0]), ay = my(a[1]), bx = mx(b[0]), by = my(b[1]);
        var dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
        var px = -dy / len * 900, py = dx / len * 900;
        ctx.fillStyle = 'rgba(' + COL.b + ',.055)';
        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.lineTo(bx + px, by + py); ctx.lineTo(ax + px, ay + py);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(' + COL.a + ',.055)';
        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.lineTo(bx - px, by - py); ctx.lineTo(ax - px, ay - py);
        ctx.closePath(); ctx.fill();
        ctx.restore();

        ctx.strokeStyle = 'rgba(' + COL.ok + ',' + (0.35 + acc * 0.5) + ')';
        ctx.lineWidth = 1.6;
        ctx.setLineDash(phase === 1 ? [5, 4] : []);
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
        ctx.setLineDash([]);
      }

      /* points */
      for (var i = 0; i < count; i++) {
        var p = pts[i];
        var X = mx(p.x), Y = my(p.y);
        var correct = (side(p, w) > 0 ? 1 : 0) === p.l;
        var col = p.l ? COL.b : COL.a;
        var pop = clamp((count - i) / 6, 0, 1);

        if (correct) {
          ctx.fillStyle = 'rgba(' + col + ',' + (0.14 * pop) + ')';
          ctx.beginPath(); ctx.arc(X, Y, 8.5, 0, 6.2832); ctx.fill();
          ctx.fillStyle = 'rgba(' + col + ',' + (0.95 * pop) + ')';
          ctx.beginPath(); ctx.arc(X, Y, 3.1, 0, 6.2832); ctx.fill();
        } else {
          ctx.strokeStyle = 'rgba(242,116,138,' + (0.85 * pop) + ')';
          ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(X, Y, 3.6, 0, 6.2832); ctx.stroke();
        }
      }

      if (accOut) accOut.textContent = Math.round(acc * 100) + '%';
      if (epochOut) epochOut.textContent = phase === 0 ? 'loading data' : 'epoch ' + epoch;
    }

    if (reduced) {
      draw(0);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { draw(0); });
    } else { addJob(draw, cv); }
    onResize(function () { S = sizeCanvas(cv); ctx = S.ctx; dataset(); draw(performance.now()); });
  })();

  /* ------------------------------------------------------- hero code cell */
  (function codeCell() {
    var host = $('#cell'); if (!host) return;
    var langOut = $('#cellLang');
    var cells = D.cells, ci = 0;

    function hl(raw, lang) {
      var s = escCode(raw);
      if (lang === 'sql') {
        return s
          .replace(/\b(SELECT|FROM|WHERE|GROUP|BY|ORDER|DESC|ASC|JOIN|ON|AND|OR|AS|LIMIT|HAVING|CURRENT_DATE)\b/g,
                   '<span class="kw">$1</span>')
          .replace(/\b(SUM|COUNT|AVG|MAX|MIN|ROUND)\b/g, '<span class="fn">$1</span>')
          .replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
      }
      return s
        .replace(/(#.*)$/g, '<span class="cm">$1</span>')
        .replace(/('[^']*')/g, '<span class="str">$1</span>')
        .replace(/\b(import|from|def|return|for|in|if|else|with|as|not|None|True|False|lambda)\b/g,
                 '<span class="kw">$1</span>')
        .replace(/\b([A-Za-z_][\w]*)\(/g, '<span class="fn">$1</span>(')
        .replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
    }

    function render(cell, lineIdx, charIdx, done) {
      var html = '';
      for (var i = 0; i < cell.code.length; i++) {
        if (i < lineIdx) html += '<div class="cell-line">' + hl(cell.code[i], cell.lang) + '</div>';
        else if (i === lineIdx) {
          html += '<div class="cell-line">' + escCode(cell.code[i].slice(0, charIdx)) +
                  (done ? '' : '<span class="cell-caret">|</span>') + '</div>';
        } else html += '<div class="cell-line">&nbsp;</div>';
      }
      if (done) html += '<div class="cell-out">' + esc(cell.out) + '</div>';
      host.innerHTML = html;
    }

    function full(cell) {
      var html = cell.code.map(function (l) {
        return '<div class="cell-line">' + hl(l, cell.lang) + '</div>';
      }).join('');
      host.innerHTML = html + '<div class="cell-out">' + esc(cell.out) + '</div>';
    }

    if (reduced) { if (langOut) langOut.textContent = cells[0].lang; full(cells[0]); return; }

    var timer = null;
    function play() {
      var cell = cells[ci];
      if (langOut) langOut.textContent = cell.lang;
      var li = 0, ch = 0;
      (function step() {
        if (li >= cell.code.length) {
          render(cell, cell.code.length, 0, true);
          timer = setTimeout(function () { ci = (ci + 1) % cells.length; play(); }, 2900);
          return;
        }
        render(cell, li, ch, false);
        ch++;
        if (ch > cell.code[li].length) { li++; ch = 0; timer = setTimeout(step, 210); }
        else timer = setTimeout(step, 17 + Math.random() * 26);
      })();
    }

    var started = false;
    onceVisible(host, function () { if (!started) { started = true; play(); } }, 0.1);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && timer) { clearTimeout(timer); timer = null; }
      else if (!document.hidden && started && !timer) play();
    });
  })();

  /* ============================================================= SPECTRUM */
  (function spectrum() {
    var rail = $('#specRail'), detail = $('#specDetail'), fill = $('#specFill');
    var stages = D.spectrum.stages, cur = -1;
    $('#specIntro').textContent = D.spectrum.intro;

    stages.forEach(function (s, i) {
      var b = el('button', 'spec-node');
      b.type = 'button';
      b.setAttribute('data-tone', s.tone);
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML =
        '<span class="spec-dot" aria-hidden="true"><i></i></span>' +
        '<span class="spec-n mono">' + esc(s.n) + '</span>' +
        '<span class="spec-t">' + esc(s.title) + '</span>';
      b.addEventListener('click', function () { pick(i); });
      b.addEventListener('focus', function () { pick(i); });
      if (!coarse) b.addEventListener('mouseenter', function () { pick(i); });
      rail.appendChild(b);
    });

    var nodes = $$('.spec-node', rail);

    function pick(i) {
      if (i === cur) return;
      cur = i;
      nodes.forEach(function (n, k) { n.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      var s = stages[i];
      detail.setAttribute('data-tone', s.tone);
      detail.innerHTML =
        '<div class="fade-in">' +
          '<p class="sd-k mono">Stage ' + esc(s.n) + ' of ' + pad2(stages.length) + '</p>' +
          '<h3 class="sd-title">' + esc(s.title) + '</h3>' +
          '<p class="sd-body">' + esc(s.body) + '</p>' +
          '<ul class="chips">' + s.tech.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
          '<div class="sd-proof"><p>Where I have done this</p><p>' + esc(s.proof) + '</p></div>' +
        '</div>';
      /* rail fill tracks how far down the spectrum you are */
      if (fill && nodes[i]) {
        var top = nodes[0].offsetTop;
        fill.style.height = Math.max(0, nodes[i].offsetTop + nodes[i].offsetHeight / 2 - top) + 'px';
      }
    }
    pick(0);

    rail.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      var n = (cur + (e.key === 'ArrowDown' ? 1 : -1) + nodes.length) % nodes.length;
      nodes[n].focus();
    });
    onResize(function () { var c = cur; cur = -1; pick(c); });
  })();

  /* =============================================================== SKILLS */
  (function skills() {
    var host = $('#skillDomains');
    $('#skillsNote').textContent = D.skills.note;

    D.skills.domains.forEach(function (dm, di) {
      var box = el('div', 'sk-domain');
      box.setAttribute('data-tone', dm.tone);

      var chain = dm.chain.map(function (c, i) {
        var sep = i ? '<li class="sep" style="--i:' + (i * 2 - 1) + '" aria-hidden="true">→</li>' : '';
        return sep + '<li style="--i:' + (i * 2) + '">' + esc(c) + '</li>';
      }).join('');

      box.innerHTML =
        '<button class="sk-head" type="button" aria-expanded="' + (di === 0 ? 'true' : 'false') +
          '" aria-controls="skp-' + dm.key + '">' +
          '<span class="sk-swatch" aria-hidden="true"></span>' +
          '<span class="sk-label">' + esc(dm.label) + '</span>' +
          '<span class="sk-count mono">' + dm.items.length + '</span>' +
          '<span class="sk-plus" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="sk-panel" id="skp-' + dm.key + '"><div><div class="sk-inner">' +
          '<p class="sk-lead">' + esc(dm.lead) + '</p>' +
          '<ol class="sk-chain" aria-label="How these connect">' + chain + '</ol>' +
          '<ul class="sk-items">' + dm.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
          '<p class="sk-ev"><b>In practice</b><span>' + esc(dm.evidence) + '</span></p>' +
        '</div></div></div>';

      var head = $('.sk-head', box);
      head.addEventListener('click', function () {
        var open = box.classList.toggle('open');
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      if (di === 0) box.classList.add('open');
      host.appendChild(box);
    });
  })();

  /* =========================================================== EXPERIENCE */
  (function experience() {
    var host = $('#xp');

    /* client-requirement → decision chain (business roles) */
    function flowchain(steps) {
      var html = '<span class="vis-k mono">Client requirement → business decision</span><div class="flowchain">';
      steps.forEach(function (s, i) {
        if (i) html += '<span class="fc-link" style="--i:' + i + '" aria-hidden="true"></span>';
        html += '<div class="fc-step" style="--i:' + i + '">' +
                  '<span class="fc-dot" aria-hidden="true">' + pad2(i + 1) + '</span>' +
                  '<span class="fc-label">' + esc(s) + '</span>' +
                '</div>';
      });
      return html + '</div>';
    }

    /* the automation achievement, as a bar that visibly shrinks */
    function autobar(a) {
      var maxv = Math.max(a.fromValue, a.toValue);
      return '<span class="vis-k mono">' + esc(a.label) + '</span>' +
        '<div class="autobar">' +
          '<div class="ab-row ab-before">' +
            '<span class="ab-tag">Before</span>' +
            '<span class="ab-track"><span class="ab-fill" style="--w:100%"></span></span>' +
            '<span class="ab-val">' + a.fromValue + ' ' + esc(a.unit) + '</span>' +
          '</div>' +
          '<p class="ab-via">' + esc(a.via) + '</p>' +
          '<div class="ab-row ab-after">' +
            '<span class="ab-tag">After</span>' +
            '<span class="ab-track"><span class="ab-fill" style="--w:' + Math.round(a.toValue / maxv * 100) + '%"></span></span>' +
            '<span class="ab-val">' + a.toValue + ' ' + esc(a.unit) + '</span>' +
          '</div>' +
          '<p class="ab-note">' + esc(a.caveat) + '</p>' +
        '</div>';
    }

    /* a raw table that cleans itself (analyst roles) */
    function dtable() {
      var rows = [
        { id: '001', a: 'line_A',  b: '0.94',  bad: false, flag: 'ok'      },
        { id: '002', a: 'line_B',  b: 'null',  bad: true,  flag: 'missing' },
        { id: '003', a: 'line_A',  b: '0.87',  bad: false, flag: 'ok'      },
        { id: '004', a: '—',       b: '12.40', bad: true,  flag: 'outlier' },
        { id: '005', a: 'line_C',  b: '0.91',  bad: false, flag: 'ok'      }
      ];
      var html = '<span class="vis-k mono">Raw data → cleaning</span><div class="dtable">' +
        '<div class="dt-row dt-head"><span>#</span><span>line</span><span>score</span><span>state</span></div>';
      var di = 0;
      rows.forEach(function (r) {
        var cls = 'dt-row' + (r.bad ? ' dirty' : '');
        var i = r.bad ? di++ : 0;
        html += '<div class="' + cls + '" style="--i:' + i + '">' +
          '<span>' + r.id + '</span>' +
          '<span class="' + (r.a === '—' ? 'bad' : '') + '">' + esc(r.a) + '</span>' +
          '<span class="' + (r.b === 'null' ? 'bad' : '') + '">' + esc(r.b) + '</span>' +
          (r.bad ? '<span class="dt-flag">' + r.flag + '</span>' : '<span class="dt-flag" style="opacity:.25">ok</span>') +
          '</div>';
      });
      return html + '</div><p class="dt-foot"><span>50,000+ records</span><span class="ok">imputed · deduped · balanced</span></p>';
    }

    /* an EDA distribution that builds on scroll */
    function edachart() {
      var hs = [14, 26, 41, 58, 76, 92, 84, 67, 49, 33, 21, 12];
      var bars = hs.map(function (h, i) {
        return '<span class="eda-bar" style="--h:' + h + '%;--i:' + i + '"></span>';
      }).join('');
      return '<span class="vis-k mono">Exploration → distribution</span>' +
        '<div class="edachart" role="img" aria-label="A histogram of a roughly normal distribution, built from exploratory analysis.">' + bars + '</div>' +
        '<div class="eda-axis"><span>min</span><span>median</span><span>max</span></div>';
    }

    D.experience.forEach(function (j) {
      var art = el('article', 'xp-card reveal');
      art.setAttribute('data-tone', j.tone);
      art.id = 'xp-' + j.id;

      var vis = j.visual === 'business'
        ? '<div class="vis-box">' + flowchain(j.chain) + '</div>' +
          '<div class="vis-box">' + autobar(j.automation) + '</div>'
        : '<div class="vis-box">' + dtable() + '</div>' +
          '<div class="vis-box">' + edachart() + '</div>';

      art.innerHTML =
        '<div class="xp-head">' +
          '<span class="xp-mark" aria-hidden="true">' + esc(j.company.charAt(0)) + '</span>' +
          '<div class="xp-id">' +
            '<h3 class="xp-company">' + esc(j.company) + '</h3>' +
            '<p class="xp-title">' + esc(j.title) + '</p>' +
            '<div class="xp-meta">' +
              '<span class="xp-period">' + esc(j.period) + '</span>' +
              (j.current ? '<span class="xp-badge">Current</span>' : '') +
            '</div>' +
          '</div>' +
          '<ul class="xp-focus">' + j.focus.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        '<p class="xp-ctx">' + esc(j.context) + '</p>' +
        '<div class="xp-kpis">' + j.kpis.map(function (k) {
          return '<div class="xp-kpi"><b>' + esc(k.v) + '</b><span>' + esc(k.l) + '</span></div>';
        }).join('') + '</div>' +
        '<div class="xp-body">' +
          '<ul class="xp-points">' + j.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' +
          '<div class="xp-vis">' + vis + '</div>' +
        '</div>' +
        '<ul class="xp-tags">' + j.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';

      host.appendChild(art);
    });

    /* trigger the in-card animations when each visual scrolls into view */
    $$('.vis-box', host).forEach(function (b) {
      onceVisible(b, function () { b.classList.add('seen'); }, 0.35);
    });
  })();

  /* ============================================================= PROJECTS */
  var lastFocus = null;

  (function projects() {
    var host = $('#projectsGrid');
    var modal = $('#modal'), modalIn = $('#modalIn');

    function mini(p) {
      if (p.chart === 'accuracy') {
        var ticks = '';
        for (var t = 0; t <= 18; t++) ticks += '<i></i>';
        return '<div class="gauge" aria-hidden="true">' +
            '<div class="gauge-top"><span>' + esc(p.chartLabel || p.kind) + '</span><span>0–100%</span></div>' +
            '<div class="gauge-track"><div class="gauge-fill" style="--w:' + (p.chartValue || 0) + '%"></div></div>' +
            '<div class="gauge-ticks">' + ticks + '</div>' +
          '</div>';
      }
      if (p.chart === 'shrink') {
        var s = p.shrink, mx = Math.max(s.from, s.to);
        return '<div class="shrinkviz" aria-hidden="true">' +
            '<div class="sv-row sv-before"><span class="sv-lab">manual</span>' +
              '<span class="sv-track"><span class="sv-fill" style="width:100%"></span></span>' +
              '<span class="sv-val">' + s.from + ' ' + esc(s.unit) + '</span></div>' +
            '<div class="sv-row sv-after"><span class="sv-lab">automated</span>' +
              '<span class="sv-track"><span class="sv-fill" style="width:' + Math.round(s.to / mx * 100) + '%"></span></span>' +
              '<span class="sv-val">' + s.to + ' ' + esc(s.unit) + '</span></div>' +
          '</div>';
      }
      var hs = [30, 52, 41, 66, 48, 72, 58, 44, 62, 36, 54, 47];
      var bars = hs.map(function (h, i) {
        return '<rect class="' + (h > 64 ? 'hi' : '') + '" x="' + (i * 22) + '" y="' + (72 - h) +
               '" width="13" height="' + h + '" rx="2" style="transition-delay:' + (i * 0.05) + 's"/>';
      }).join('');
      return '<svg class="mini" viewBox="0 0 261 72" preserveAspectRatio="none" aria-hidden="true">' + bars + '</svg>';
    }

    D.projects.forEach(function (p) {
      var card = el('article', 'pcard reveal');
      card.setAttribute('data-tone', p.tone);
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-label', 'Open case study: ' + p.name);

      var flow = p.stages.map(function (s, i) {
        return (i ? '<li class="sep" aria-hidden="true">→</li>' : '') + '<li>' + esc(s) + '</li>';
      }).join('');

      card.innerHTML =
        '<span class="pcard-glow" aria-hidden="true"></span>' +
        '<div>' +
          '<div class="pcard-top">' +
            '<span class="pcard-kind mono">' + esc(p.kind) + '</span>' +
            '<span class="pcard-origin">' + esc(p.origin) + '</span>' +
          '</div>' +
          '<h3 class="pcard-name">' + esc(p.name) + '</h3>' +
          '<p class="pcard-blurb">' + esc(p.blurb) + '</p>' +
          '<ul class="pflow">' + flow + '</ul>' +
          '<ul class="pcard-tech">' + p.tech.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        '<div class="pcard-right">' +
          '<p class="pcard-hl"><b>' + esc(p.headline.value) + '</b><span>' + esc(p.headline.label) + '</span></p>' +
          mini(p) +
          '<span class="pcard-open">Open case study <i aria-hidden="true">→</i></span>' +
        '</div>';

      function open() { openModal(p, card); }
      card.addEventListener('click', open);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });

      if (!coarse && !reduced) {
        var glow = $('.pcard-glow', card);
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          glow.style.left = (e.clientX - r.left) + 'px';
          glow.style.top  = (e.clientY - r.top) + 'px';
        });
      }
      host.appendChild(card);
    });

    function openModal(p, trigger) {
      lastFocus = trigger || document.activeElement;
      var d = p.detail;
      var flow = p.stages.map(function (s, i) {
        return (i ? '<li class="sep" aria-hidden="true">→</li>' : '') + '<li>' + esc(s) + '</li>';
      }).join('');
      var repoBtn = p.repo
        ? '<a class="btn btn-primary" href="' + esc(p.repo) + '" target="_blank" rel="noopener noreferrer">View repository ↗</a>'
        : '<a class="btn btn-primary" href="' + esc(C.github.url) + '" target="_blank" rel="noopener noreferrer">See my GitHub ↗</a>';

      var box = $('.modal-box', modal);
      box.setAttribute('data-tone', p.tone);
      modalIn.innerHTML =
        '<p class="m-kind">' + esc(p.kind) + ' · ' + esc(p.origin) + '</p>' +
        '<h3 class="m-title" id="modalTitle">' + esc(p.name) + '</h3>' +
        '<ul class="m-flow">' + flow + '</ul>' +
        '<div class="m-block"><p class="m-k">Problem</p><p class="m-v">' + esc(d.problem) + '</p></div>' +
        '<div class="m-block"><p class="m-k">Dataset</p><p class="m-v">' + esc(d.dataset) + '</p></div>' +
        '<div class="m-block"><p class="m-k">Approach</p><p class="m-v">' + esc(d.approach) + '</p></div>' +
        '<div class="m-block"><p class="m-k">Methods &amp; models</p><ul class="m-list">' +
          d.models.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="m-block"><p class="m-k">Result</p><div class="m-result"><b>' + esc(p.headline.value) +
          '</b><span>' + esc(d.result) + '</span></div></div>' +
        '<div class="m-block"><p class="m-k">Why it matters</p><p class="m-v">' + esc(d.impact) + '</p></div>' +
        '<div class="m-block"><p class="m-k">Technology</p><ul class="m-list">' +
          p.tech.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="m-actions">' + repoBtn + '<button class="btn" type="button" data-close>Close</button></div>';

      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      $('.modal-x', modal).focus();
    }
    window.__openProject = function (id) {
      var p = D.projects.filter(function (x) { return x.id === id; })[0];
      if (p) openModal(p, document.activeElement);
    };

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'Tab') {
        var f = $$('a[href], button, input, textarea, [tabindex]:not([tabindex="-1"])', modal)
          .filter(function (n) { return n.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  })();

  /* =============================================================== GITHUB */
  (function github() {
    $('#ghCta').href = C.github.url;
    var grid = $('#ghGrid'), sub = $('#ghSub');

    function fallback(msg) {
      sub.textContent = 'Repositories are listed on my GitHub profile.';
      grid.innerHTML = '';
      var box = el('div', 'gh-empty');
      box.innerHTML = esc(msg) + ' <a href="' + esc(C.github.url) +
        '" target="_blank" rel="noopener noreferrer" style="color:var(--data)">Open ' + esc(C.github.label) + ' ↗</a>';
      grid.appendChild(box);
    }

    function load() {
      fetch('https://api.github.com/users/' + encodeURIComponent(C.githubUser) + '/repos?sort=updated&per_page=6')
        .then(function (r) {
          if (r.status === 403) throw new Error('rate');
          if (!r.ok) throw new Error('http');
          return r.json();
        })
        .then(function (repos) {
          if (!Array.isArray(repos) || !repos.length) { fallback('No public repositories are listed yet.'); return; }
          sub.textContent = 'Live from the GitHub API — most recently updated first.';
          grid.innerHTML = '';
          repos.forEach(function (r) {
            var a = el('a', 'repo');
            a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener noreferrer';
            var updated = r.pushed_at || r.updated_at;
            var when = updated ? new Date(updated).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
            a.innerHTML =
              '<p class="repo-name">' + esc(r.name) + '</p>' +
              (r.description ? '<p class="repo-desc">' + esc(r.description) + '</p>' : '') +
              '<div class="repo-meta">' +
                (r.language ? '<span class="repo-lang"><i></i>' + esc(r.language) + '</span>' : '') +
                '<span>★ ' + (r.stargazers_count || 0) + '</span>' +
                '<span>⑂ ' + (r.forks_count || 0) + '</span>' +
                (when ? '<span>' + esc(when) + '</span>' : '') +
              '</div>';
            grid.appendChild(a);
          });
        })
        .catch(function (e) {
          fallback(e && e.message === 'rate'
            ? 'GitHub’s API is rate-limited from this network right now.'
            : 'Repositories couldn’t be loaded automatically.');
        });
    }
    onceVisible(grid, load, 0);
  })();

  /* ============================================================== METRICS */
  (function metrics() {
    var host = $('#metrics');
    D.metrics.forEach(function (m) {
      var card = el('div', 'metric');
      card.setAttribute('data-tone', m.tone || 'data');
      var v = el('div', 'metric-v');
      if (m.type === 'transform') {
        v.innerHTML = '<span class="from">' + esc(m.from) + '</span><span class="arrow">→</span>' +
                      '<span class="to">' + esc(m.to) + '</span><span class="u">' + esc(m.unit || '') + '</span>';
      } else {
        v.innerHTML = '<span class="num">' + (m.prefix || '') + '0' + (m.suffix || '') + '</span>';
        v.dataset.to = m.to; v.dataset.prefix = m.prefix || ''; v.dataset.suffix = m.suffix || '';
      }
      card.appendChild(v);
      card.appendChild(el('div', 'metric-l', esc(m.label)));
      if (m.note) card.appendChild(el('div', 'metric-n', esc(m.note)));
      host.appendChild(card);
    });

    function run() {
      $$('.metric-v[data-to]', host).forEach(function (v, i) {
        var to = parseFloat(v.dataset.to), pre = v.dataset.prefix, suf = v.dataset.suffix;
        var out = $('.num', v);
        if (reduced) { out.textContent = pre + to + suf; return; }
        var dur = 1150, delay = i * 55, start = null;
        function step(ts) {
          if (start === null) start = ts;
          var p = clamp((ts - start - delay) / dur, 0, 1);
          var e = 1 - Math.pow(1 - p, 3);
          out.textContent = pre + Math.round(to * e) + suf;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
    onceVisible(host, run, 0.2);
  })();

  /* ================================================== 3D NEURAL NETWORK */
  (function neural() {
    var M = D.ml;
    $('#mlBody').textContent = M.body;
    $('#netNote').textContent = M.note;

    var layersEl = $('#netLayers');
    M.layers.forEach(function (l, i) {
      layersEl.appendChild(el('li', null, '<span class="n mono">L' + i + '</span><span class="t">' + esc(l) + '</span>'));
    });

    var spots = [
      { t: '9%',  l: '4%'  }, { t: '20%', r: '5%'  }, { t: '47%', l: '3%'  },
      { t: '72%', r: '4%'  }, { t: '86%', l: '9%'  }, { t: '8%',  l: '58%' }
    ];
    var tagsEl = $('#netTags');
    M.tags.forEach(function (t, i) {
      var li = el('li', null, esc(t));
      var s = spots[i % spots.length];
      li.style.top = s.t;
      if (s.l) li.style.left = s.l; else li.style.right = s.r;
      tagsEl.appendChild(li);
    });

    var cv = $('#netCanvas'); if (!cv) return;
    var S = sizeCanvas(cv), ctx = S.ctx;

    var counts = [4, 6, 6, 3], radii = [1.05, 1.5, 1.5, .85], xs = [-2.75, -.92, .92, 2.75];
    var nodes = [], links = [], pulses = [];

    function build() {
      nodes = []; links = [];
      counts.forEach(function (n, li) {
        for (var i = 0; i < n; i++) {
          var a = (i / n) * Math.PI * 2 + li * 0.42;
          nodes.push({ layer: li, x: xs[li], y: Math.cos(a) * radii[li], z: Math.sin(a) * radii[li], ph: Math.random() * 6.283 });
        }
      });
      for (var l = 0; l < counts.length - 1; l++) {
        var A = nodes.filter(function (n) { return n.layer === l; });
        var B = nodes.filter(function (n) { return n.layer === l + 1; });
        A.forEach(function (a) { B.forEach(function (b) { links.push({ ai: nodes.indexOf(a), bi: nodes.indexOf(b) }); }); });
      }
      pulses = [];
      var pn = reduced ? 0 : (S.w < 520 ? 12 : 24);
      for (var p = 0; p < pn; p++) {
        pulses.push({ i: (Math.random() * links.length) | 0, t: Math.random(), sp: 0.006 + Math.random() * 0.007 });
      }
    }
    build();

    var yaw = 0.5, pitch = -0.12, mx = 0, my = 0;
    if (!coarse && !reduced) {
      cv.parentNode.addEventListener('mousemove', function (e) {
        var r = cv.getBoundingClientRect();
        mx = clamp((e.clientX - r.left) / r.width - .5, -.5, .5);
        my = clamp((e.clientY - r.top) / r.height - .5, -.5, .5);
      });
      cv.parentNode.addEventListener('mouseleave', function () { mx = 0; my = 0; });
    }

    function project(n) {
      var cy = Math.cos(yaw), sy = Math.sin(yaw);
      var x1 = n.x * cy + n.z * sy, z1 = -n.x * sy + n.z * cy;
      var cp = Math.cos(pitch), sp = Math.sin(pitch);
      var y2 = n.y * cp - z1 * sp, z2 = n.y * sp + z1 * cp;
      var depth = 8 - z2, per = 8 / depth;
      var scale = Math.min(S.w, S.h) / 5.6;
      return { x: S.w / 2 + x1 * per * scale * .78, y: S.h / 2 - y2 * per * scale, p: per, d: depth };
    }

    function draw(time) {
      if (!reduced) {
        yaw = lerp(yaw, 0.5 + mx * 0.85, 0.045) + 0.0016;
        pitch = lerp(pitch, -0.12 + my * 0.5, 0.045);
      }
      ctx.clearRect(0, 0, S.w, S.h);
      var pj = nodes.map(project);

      var order = links.map(function (l) { return { d: (pj[l.ai].d + pj[l.bi].d) / 2, ia: l.ai, ib: l.bi }; })
                       .sort(function (a, b) { return b.d - a.d; });
      for (var k = 0; k < order.length; k++) {
        var o = order[k], a = pj[o.ia], b = pj[o.ib];
        var near = clamp((10 - o.d) / 4, 0, 1);
        ctx.strokeStyle = 'rgba(150,160,215,' + (0.035 + near * 0.075) + ')';
        ctx.lineWidth = 0.6 + near * 0.5;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      for (var q = 0; q < pulses.length; q++) {
        var pu = pulses[q];
        pu.t += pu.sp;
        if (pu.t > 1) { pu.t = 0; pu.i = (Math.random() * links.length) | 0; }
        var L = links[pu.i], A = pj[L.ai], B = pj[L.bi];
        var e = pu.t * pu.t * (3 - 2 * pu.t);
        var fade = Math.sin(pu.t * Math.PI);
        ctx.fillStyle = 'rgba(155,123,255,' + (0.6 * fade) + ')';
        ctx.beginPath(); ctx.arc(lerp(A.x, B.x, e), lerp(A.y, B.y, e), 1.9, 0, 6.2832); ctx.fill();
      }
      var ni = nodes.map(function (n, i) { return i; }).sort(function (a, b) { return pj[b].d - pj[a].d; });
      for (var m = 0; m < ni.length; m++) {
        var idx = ni[m], n = nodes[idx], p = pj[idx];
        var out = n.layer === counts.length - 1;
        var col = out ? '47,215,155' : '155,123,255';
        var pulse = reduced ? .6 : (Math.sin(time * 0.0016 + n.ph) + 1) / 2;
        var r = (2.6 + (out ? 1 : 0)) * p.p;
        ctx.fillStyle = 'rgba(' + col + ',' + (0.05 + pulse * 0.09) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, r * 4.2, 0, 6.2832); ctx.fill();
        ctx.fillStyle = 'rgba(' + col + ',' + (0.5 + pulse * 0.45) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
      }
    }

    if (reduced) draw(0); else addJob(draw, cv);
    onResize(function () { S = sizeCanvas(cv); ctx = S.ctx; build(); draw(performance.now()); });
  })();

  /* ============================================================ KNOWLEDGE */
  (function knowledge() {
    var host = $('#knowGrid');
    $('#knowNote').textContent = D.knowledge.note;
    D.knowledge.areas.forEach(function (a) {
      var c = el('article', 'kcard');
      c.setAttribute('data-tone', a.tone);
      c.innerHTML =
        '<h3>' + esc(a.title) + '</h3>' +
        '<p>' + esc(a.body) + '</p>' +
        '<ul class="chips">' + a.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        (a.link ? '<button class="k-link" type="button" data-project="' + esc(a.link) + '">See the project →</button>' : '');
      var b = $('.k-link', c);
      if (b) b.addEventListener('click', function () { window.__openProject(a.link); });
      host.appendChild(c);
    });
  })();

  /* ================================================ EDUCATION + CERTIFICATES */
  (function credentials() {
    var E = D.education;
    $('#eduDeg').textContent = E.degree;
    $('#eduSchool').textContent = E.school;
    $('#eduMeta').textContent = E.period + '  ·  ' + E.location;

    var seal = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">' +
      '<circle cx="12" cy="9" r="5.6"/><path d="M8.4 13.4L7 22l5-2.4L17 22l-1.4-8.6"/></svg>';

    var host = $('#certs');
    D.certifications.forEach(function (c) {
      var node = c.url ? el('a', 'cert') : el('div', 'cert');
      node.setAttribute('data-tone', c.tone || 'data');
      if (c.url) { node.href = c.url; node.target = '_blank'; node.rel = 'noopener noreferrer'; }
      node.innerHTML =
        '<span class="cert-seal" aria-hidden="true">' + seal + '</span>' +
        '<div class="cert-b">' +
          '<p class="cert-name">' + esc(c.name) + '</p>' +
          '<p class="cert-iss">' + esc(c.issuer) + (c.year ? ' · ' + esc(c.year) : '') + '</p>' +
          (c.focus ? '<ul class="cert-focus">' + c.focus.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' : '') +
        '</div>' +
        (c.url ? '<span class="cert-x mono">Verify ↗</span>' : '');
      host.appendChild(node);
    });
  })();

  /* =========================================================== BEYOND DATA */
  (function beyond() {
    $('#beyondLead').textContent = D.beyond.lead;

    var art = {
      artist:
        '<svg class="art" viewBox="0 0 120 62" fill="none" aria-hidden="true">' +
          '<path class="draw" d="M6 52C20 14 36 8 50 26s14 30 28 22 26-30 30-42" stroke="var(--biz)" stroke-width="2.4"/>' +
          '<circle class="pop" style="--i:0" cx="18" cy="16" r="4" fill="var(--data)"/>' +
          '<circle class="pop" style="--i:1" cx="34" cy="10" r="3.2" fill="var(--ml)"/>' +
          '<circle class="pop" style="--i:2" cx="50" cy="14" r="3.6" fill="var(--auto)"/>' +
        '</svg>',
      composer:
        '<svg class="art" viewBox="0 0 120 62" fill="none" aria-hidden="true">' +
          (function () {
            var hs = [16, 34, 22, 46, 30, 54, 26, 40, 18, 34, 24, 14], o = '';
            for (var i = 0; i < hs.length; i++) {
              o += '<rect class="grow" style="--i:' + i + '" x="' + (5 + i * 9.6) + '" y="' + (56 - hs[i]) +
                   '" width="5" height="' + hs[i] + '" rx="2.5" fill="' + (i % 4 === 1 ? 'var(--biz)' : 'var(--ml)') +
                   '" opacity="' + (i % 4 === 1 ? .95 : .6) + '"/>';
            }
            return o;
          })() +
        '</svg>',
      chef:
        '<svg class="art" viewBox="0 0 120 62" fill="none" aria-hidden="true">' +
          '<path class="rise" style="--i:0" d="M44 18c3-4-3-7 0-11" stroke="var(--biz)" stroke-width="1.8"/>' +
          '<path class="rise" style="--i:1" d="M58 16c3-4-3-8 0-12" stroke="var(--biz)" stroke-width="1.8"/>' +
          '<path class="rise" style="--i:2" d="M72 18c3-4-3-7 0-11" stroke="var(--biz)" stroke-width="1.8"/>' +
          '<rect class="pop" style="--i:0" x="26" y="26" width="64" height="7" rx="2" fill="var(--data)" opacity=".9"/>' +
          '<rect class="pop" style="--i:1" x="26" y="38" width="46" height="7" rx="2" fill="var(--data)" opacity=".65"/>' +
          '<rect class="pop" style="--i:2" x="26" y="50" width="55" height="7" rx="2" fill="var(--data)" opacity=".45"/>' +
        '</svg>',
      creator:
        '<svg class="art" viewBox="0 0 120 62" fill="none" aria-hidden="true">' +
          '<rect class="pop" style="--i:0" x="4"  y="18" width="24" height="26" rx="3" stroke="var(--line-3)" stroke-width="1.4"/>' +
          '<rect class="pop" style="--i:1" x="32" y="18" width="24" height="26" rx="3" stroke="var(--line-3)" stroke-width="1.4"/>' +
          '<rect class="pop" style="--i:2" x="60" y="18" width="24" height="26" rx="3" stroke="var(--line-3)" stroke-width="1.4"/>' +
          '<rect class="pop" style="--i:3" x="88" y="18" width="24" height="26" rx="3" stroke="var(--auto)" stroke-width="1.6"/>' +
          '<circle class="pop" style="--i:0" cx="16"  cy="38" r="3" fill="var(--data)"/>' +
          '<circle class="pop" style="--i:1" cx="44"  cy="33" r="3" fill="var(--data)"/>' +
          '<circle class="pop" style="--i:2" cx="72"  cy="28" r="3" fill="var(--ml)"/>' +
          '<circle class="pop" style="--i:3" cx="100" cy="24" r="3.6" fill="var(--auto)"/>' +
        '</svg>'
    };

    var host = $('#btiles');
    D.beyond.tiles.forEach(function (t) {
      var b = el('button', 'btile');
      b.type = 'button';
      b.setAttribute('data-tone', 'biz');
      b.setAttribute('aria-expanded', 'false');
      b.innerHTML =
        '<div class="btile-art">' + (art[t.key] || '') + '</div>' +
        '<p class="btile-role">' + esc(t.role) + '</p>' +
        '<p class="btile-craft">' + esc(t.craft) + '</p>' +
        '<p class="btile-map">' + esc(t.map) + '</p>' +
        '<p class="btile-line"><span>' + esc(t.line) + '</span></p>';
      b.addEventListener('click', function () {
        var open = b.classList.toggle('open');
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      host.appendChild(b);
      onceVisible(b, function () { b.classList.add('seen'); }, 0.35);
    });
  })();

  /* ================================================================ ABOUT */
  P.about.forEach(function (t) { $('#aboutCopy').appendChild(el('p', null, esc(t))); });

  /* ============================================================== CONTACT */
  (function contact() {
    $('#ctaHeadline').textContent = C.ctaHeadline;
    $('#ctaBody').textContent = C.ctaBody;

    var rows = [
      { k: 'Email',    v: C.email,          h: 'mailto:' + C.email },
      { k: 'Phone',    v: C.phone,          h: 'tel:' + C.phone.replace(/[^+\d]/g, '') },
      { k: 'LinkedIn', v: C.linkedin.label, h: C.linkedin.url, ext: true },
      { k: 'GitHub',   v: C.github.label,   h: C.github.url,   ext: true },
      { k: 'Location', v: C.location,       h: '' }
    ];
    if (C.resumeUrl) rows.push({ k: 'Résumé', v: 'Download PDF', h: C.resumeUrl, ext: true });

    var list = $('#contactList');
    rows.forEach(function (r) {
      var li = el('li');
      if (!r.h) {
        li.innerHTML = '<a href="#contact" tabindex="-1" style="cursor:default">' +
          '<span class="cl-k">' + esc(r.k) + '</span><span class="cl-v">' + esc(r.v) + '</span></a>';
      } else {
        li.innerHTML = '<a href="' + esc(r.h) + '"' + (r.ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
          '<span class="cl-k">' + esc(r.k) + '</span>' +
          '<span class="cl-v">' + esc(r.v) + '</span>' +
          '<span class="cl-x mono">' + (r.ext ? '↗' : '→') + '</span></a>';
      }
      list.appendChild(li);
    });

    $('#footLeft').textContent = P.name + ' — ' + P.role;
    $('#footYear').textContent = '© ' + new Date().getFullYear();

    var form = $('#cform'), status = $('#cformStatus');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('#fName').value.trim(), em = $('#fEmail').value.trim(), msg = $('#fMsg').value.trim();
      if (!n || !em || !msg) {
        status.className = 'cform-status err';
        status.textContent = 'Fill in your name, email and message first.'; return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        status.className = 'cform-status err';
        status.textContent = 'That email address doesn’t look right.'; return;
      }
      status.className = 'cform-status';
      status.textContent = 'Opening your email app. If nothing happens, write to ' + C.email + ' directly.';
      window.location.href = 'mailto:' + C.email +
        '?subject=' + encodeURIComponent('Portfolio enquiry from ' + n) +
        '&body=' + encodeURIComponent(msg + '\n\n—\n' + n + '\n' + em);
    });
  })();

  /* ============================================================= TERMINAL */
  (function terminal() {
    var T = D.terminal;
    var body = $('#termBody'), form = $('#termForm'), input = $('#termCmd');
    var prompt = T.user + '@' + T.host + ':~$';
    $('#termPrompt').textContent = prompt;

    function line(cls, html) {
      var p = el('p', cls, html);
      body.appendChild(p);
      body.scrollTop = body.scrollHeight;
      return p;
    }
    function echo(cmd) { line('cmd', '<span class="p">' + esc(prompt) + '</span> ' + esc(cmd)); }
    function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }

    var commands = {
      help: function () {
        line('out', 'available: <span class="k">analyze --profile</span>, <span class="k">skills</span>, ' +
          '<span class="k">experience</span>, <span class="k">projects</span>, <span class="k">stack</span>, ' +
          '<span class="k">contact</span>, <span class="k">whoami</span>, <span class="k">clear</span>');
      },
      whoami: function () { line('out', esc(P.name) + ' — ' + esc(P.role)); },
      analyze: function () {
        T.profile.forEach(function (r) {
          line('out', '<span class="k">' + esc(pad(r[0] + ':', 9)) + '</span>' + esc(r[1]));
        });
      },
      skills: function () {
        D.skills.domains.forEach(function (d) {
          line('out', '<span class="k">' + esc(pad(d.label, 28)) + '</span>' + d.items.length + ' items');
        });
        line('out', 'run <span class="k">stack</span> for the full list.');
      },
      stack: function () {
        D.skills.domains.forEach(function (d) {
          line('out', '<span class="k">' + esc(d.label) + '</span>');
          line('out', '  ' + esc(d.items.join(', ')));
        });
      },
      experience: function () {
        D.experience.forEach(function (j) {
          line('out', '<span class="k">' + esc(j.period) + '</span>  ' + esc(j.title) + ' · ' + esc(j.company));
        });
      },
      projects: function () {
        D.projects.forEach(function (p) {
          line('out', '<span class="k">' + esc(pad(p.headline.value, 9)) + '</span>' + esc(p.name));
        });
      },
      contact: function () {
        line('out', '<span class="k">email   </span>' + esc(C.email));
        line('out', '<span class="k">github  </span>' + esc(C.github.label));
        line('out', '<span class="k">linkedin</span> ' + esc(C.linkedin.label));
      },
      clear: function () { body.innerHTML = ''; }
    };

    function run(raw) {
      var cmd = raw.trim();
      if (!cmd) return;
      echo(cmd);
      var base = cmd.split(/\s+/)[0].toLowerCase();
      if (commands[base]) commands[base](cmd);
      else line('err', 'command not found: ' + esc(base) + ' — try <span class="k">help</span>');
    }

    form.addEventListener('submit', function (e) { e.preventDefault(); run(input.value); input.value = ''; });
    $('#termClear').addEventListener('click', function () { body.innerHTML = ''; input.focus(); });
    $('#terminal').addEventListener('click', function (e) { if (e.target.tagName !== 'BUTTON') input.focus(); });

    var booted = false;
    function boot() {
      if (booted) return; booted = true;
      if (reduced) { echo(T.boot); commands.analyze(); return; }
      var p = line('cmd', '<span class="p">' + esc(prompt) + '</span> ');
      var i = 0;
      (function type() {
        if (i <= T.boot.length) {
          p.innerHTML = '<span class="p">' + esc(prompt) + '</span> ' + esc(T.boot.slice(0, i)) +
                        '<span style="opacity:.6">▌</span>';
          i++; setTimeout(type, 52);
        } else {
          p.innerHTML = '<span class="p">' + esc(prompt) + '</span> ' + esc(T.boot);
          setTimeout(commands.analyze, 240);
        }
      })();
    }
    onceVisible($('#terminal'), boot, 0.35);
  })();

  /* ================================================================= BOOT */
  watchReveal();
  onScroll();
  requestAnimationFrame(function () {
    $('#heroName').classList.add('on');
    $$('.hero .reveal').forEach(function (n) { n.classList.add('in'); });
  });
  onResize(onScroll);
})();
