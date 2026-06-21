/* ============================================================
   Into the Sky — interactions
   progress bar · settings (font/theme) · TOC · carousel ·
   plot-switcher · interactive plots · copy buttons · anchors
   ============================================================ */
(function () {
  'use strict';

  var doc = document.documentElement;

  // Registry of Plotly plots so we can resize them when revealed (a plot
  // rendered inside a hidden tab/slide has zero size until shown) and
  // re-theme them when the colour scheme changes.
  var iplots = [];
  function resizeIPlots(scope) {
    if (!window.Plotly) return;
    var nodes = (scope || document).querySelectorAll('.iplot');
    Array.prototype.forEach.call(nodes, function (n) {
      try { window.Plotly.Plots.resize(n); } catch (e) {}
    });
  }

  /* ---- Reading progress bar ------------------------------ */
  (function () {
    var fill = document.getElementById('progress-fill');
    if (!fill) return;
    var ticking = false;
    function update() {
      var h = document.documentElement;
      var scrollable = h.scrollHeight - h.clientHeight;
      var pct = scrollable > 0 ? (h.scrollTop || document.body.scrollTop) / scrollable : 0;
      fill.style.width = Math.max(0, Math.min(1, pct)) * 100 + '%';
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  })();

  /* ---- Settings: font + theme ---------------------------- */
  (function () {
    var toggle = document.getElementById('settings-toggle');
    var menu = document.getElementById('settings-menu');
    if (!toggle || !menu) return;

    function setFont(f) {
      doc.setAttribute('data-font', f);
      try { localStorage.setItem('blog-font', f); } catch (e) {}
      syncChecks();
    }
    function setTheme(t) {
      doc.setAttribute('data-theme', t);
      try { localStorage.setItem('blog-theme', t); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', t === 'dark' ? '#1a1820' : '#fbfaf7');
      document.dispatchEvent(new CustomEvent('blog:theme', { detail: t }));
      syncChecks();
    }
    function syncChecks() {
      var font = doc.getAttribute('data-font');
      var theme = doc.getAttribute('data-theme');
      menu.querySelectorAll('.font-opt').forEach(function (b) {
        b.setAttribute('aria-checked', b.dataset.font === font);
      });
      menu.querySelectorAll('.theme-opt').forEach(function (b) {
        b.setAttribute('aria-checked', b.dataset.themeSet === theme);
      });
    }

    menu.querySelectorAll('.font-opt').forEach(function (b) {
      b.addEventListener('click', function () { setFont(b.dataset.font); });
    });
    menu.querySelectorAll('.theme-opt').forEach(function (b) {
      b.addEventListener('click', function () { setTheme(b.dataset.themeSet); });
    });

    function open() { menu.hidden = false; toggle.setAttribute('aria-expanded', 'true'); }
    function close() { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.hidden ? open() : close();
    });
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !menu.contains(e.target) && e.target !== toggle) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { close(); toggle.focus(); }
    });
    syncChecks();
  })();

  /* ---- Heading anchors + TOC ----------------------------- */
  (function () {
    var article = document.querySelector('.post.prose, .page.prose');
    if (!article) return;

    var headings = article.querySelectorAll('h2, h3');
    var slugCount = {};
    headings.forEach(function (h) {
      if (!h.id) {
        var base = (h.textContent || '').toLowerCase()
          .replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'section';
        slugCount[base] = (slugCount[base] || 0) + 1;
        h.id = slugCount[base] > 1 ? base + '-' + slugCount[base] : base;
      }
      var a = document.createElement('a');
      a.className = 'heading-anchor'; a.href = '#' + h.id;
      a.setAttribute('aria-label', 'Link to this section'); a.textContent = '#';
      h.insertBefore(a, h.firstChild);
    });

    var nav = document.getElementById('toc-list');
    if (nav && headings.length) {
      headings.forEach(function (h) {
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = (h.textContent || '').replace(/^#/, '');
        a.className = h.tagName === 'H3' ? 'lvl-3' : 'lvl-2';
        a.addEventListener('click', function () { history.replaceState(null, '', '#' + h.id); });
        nav.appendChild(a);
      });

      var links = nav.querySelectorAll('a');
      var byId = {};
      links.forEach(function (l) { byId[l.getAttribute('href').slice(1)] = l; });

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.classList.remove('active'); });
            var active = byId[en.target.id];
            if (active) active.classList.add('active');
          }
        });
      }, { rootMargin: '-10% 0px -75% 0px', threshold: 0 });
      headings.forEach(function (h) { observer.observe(h); });

      var tocToggle = document.querySelector('.toc-toggle');
      if (tocToggle) {
        tocToggle.addEventListener('click', function () {
          var collapsed = nav.style.display === 'none';
          nav.style.display = collapsed ? '' : 'none';
          tocToggle.setAttribute('aria-expanded', String(collapsed));
        });
      }
    }
  })();

  /* ---- Copy buttons on code blocks ----------------------- */
  (function () {
    document.querySelectorAll('.prose pre').forEach(function (pre) {
      var btn = document.createElement('button');
      btn.className = 'copy-btn'; btn.type = 'button'; btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.innerText : pre.innerText;
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1400);
        }).catch(function () { btn.textContent = 'Error'; });
      });
      pre.appendChild(btn);
    });
  })();

  /* ---- Carousel ------------------------------------------ */
  (function () {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.children)
        .filter(function (c) { return !c.classList.contains('carousel-viewport'); });
      if (!slides.length) return;

      var viewport = document.createElement('div'); viewport.className = 'carousel-viewport';
      var track = document.createElement('div'); track.className = 'carousel-track';
      slides.forEach(function (s) {
        s.classList.add('carousel-slide');
        track.appendChild(s);
      });
      viewport.appendChild(track);

      var prev = document.createElement('button');
      prev.className = 'carousel-btn prev'; prev.type = 'button';
      prev.setAttribute('aria-label', 'Previous'); prev.innerHTML = '‹';
      var next = document.createElement('button');
      next.className = 'carousel-btn next'; next.type = 'button';
      next.setAttribute('aria-label', 'Next'); next.innerHTML = '›';
      viewport.appendChild(prev); viewport.appendChild(next);

      var dots = document.createElement('div'); dots.className = 'carousel-dots';
      carousel.innerHTML = '';
      carousel.appendChild(viewport); carousel.appendChild(dots);

      var index = 0;
      slides.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'carousel-dot'; d.type = 'button';
        d.setAttribute('aria-label', 'Slide ' + (i + 1));
        d.addEventListener('click', function () { go(i); });
        dots.appendChild(d);
      });

      function go(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-index * 100) + '%)';
        dots.querySelectorAll('.carousel-dot').forEach(function (d, j) {
          d.classList.toggle('active', j === index);
        });
        resizeIPlots(slides[index]); // revealed slide may hold an interactive plot
      }
      prev.addEventListener('click', function () { go(index - 1); });
      next.addEventListener('click', function () { go(index + 1); });
      carousel.tabIndex = 0;
      carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') go(index - 1);
        if (e.key === 'ArrowRight') go(index + 1);
      });
      go(0);
    });
  })();

  /* ---- Plot switcher (tabs) ------------------------------ */
  (function () {
    document.querySelectorAll('.plot-switcher').forEach(function (sw) {
      // Only this switcher's own panels (closest match guards against a
      // nested .plot-switcher inside one of the panels).
      var panels = Array.prototype.slice.call(sw.querySelectorAll('.plot-option'))
        .filter(function (p) { return p.closest('.plot-switcher') === sw; });
      if (!panels.length) return;

      // A lone plot needs no tabs/headers — just show the framed figure.
      if (panels.length === 1) {
        panels[0].classList.add('plot-panel');
        panels[0].hidden = false;
        sw.classList.add('single');
        return;
      }

      var tabs = document.createElement('div'); tabs.className = 'plot-tabs';
      sw.insertBefore(tabs, sw.firstChild);

      panels.forEach(function (panel, i) {
        panel.classList.add('plot-panel');
        panel.hidden = i !== 0;
        var label = panel.dataset.label || ('View ' + (i + 1));
        var tab = document.createElement('button');
        tab.className = 'plot-tab' + (i === 0 ? ' active' : '');
        tab.type = 'button'; tab.textContent = label;
        tab.addEventListener('click', function () {
          panels.forEach(function (p, j) { p.hidden = j !== i; });
          tabs.querySelectorAll('.plot-tab').forEach(function (t, j) {
            t.classList.toggle('active', j === i);
          });
          resizeIPlots(panel); // interactive plot in this panel needs a resize
        });
        tabs.appendChild(tab);
      });
    });
  })();

  /* ---- Home: topic (tag) filter -------------------------- */
  (function () {
    var filter = document.getElementById('topic-filter');
    var list = document.getElementById('post-list');
    if (!filter || !list) return;
    var cards = Array.prototype.slice.call(list.querySelectorAll('.post-card'));

    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('.topic');
      if (!btn) return;
      var tag = btn.dataset.tag;
      filter.querySelectorAll('.topic').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
      cards.forEach(function (card) {
        var tags = ' ' + (card.dataset.tags || '') + ' ';
        var show = tag === '*' || tags.indexOf(' ' + tag + ' ') !== -1;
        card.classList.toggle('is-hidden', !show);
      });
    });
  })();

  /* ---- Interactive plots (Plotly, lazy-loaded) ----------- */
  (function () {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('.iplot'));
    if (!nodes.length) return;

    // Pull theme-aware colours from the live CSS variables so plots match
    // the page in both light and dark mode.
    function themePatch() {
      var cs = getComputedStyle(doc);
      var text = cs.getPropertyValue('--text').trim() || '#2f2b35';
      var grid = cs.getPropertyValue('--border').trim() || '#e7e3dc';
      var axis = { gridcolor: grid, zerolinecolor: grid, linecolor: grid, color: text };
      return {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: text, family: 'Inter, system-ui, sans-serif' },
        xaxis: axis, yaxis: axis,
        scene: { xaxis: axis, yaxis: axis, zaxis: axis }
      };
    }

    function render() {
      nodes.forEach(function (node) {
        var script = node.querySelector('script[type="application/json"]');
        if (!script) return;
        var spec;
        try { spec = JSON.parse(script.textContent); } catch (e) { return; }
        var layout = Object.assign({ autosize: true, margin: { l: 40, r: 16, t: 16, b: 40 } },
                                   spec.layout || {}, themePatch());
        var config = Object.assign({ responsive: true, displayModeBar: 'hover',
                                     displaylogo: false }, spec.config || {});
        window.Plotly.newPlot(node, spec.data || [], layout, config);
        iplots.push(node);
      });
    }

    function reTheme() {
      iplots.forEach(function (n) {
        try { window.Plotly.relayout(n, themePatch()); } catch (e) {}
      });
    }

    function load() {
      if (window.Plotly) { render(); return; }
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.35.2/plotly.min.js';
      s.onload = render;
      s.onerror = function () { console.warn('Plotly failed to load from CDN'); };
      document.head.appendChild(s);
    }

    document.addEventListener('blog:theme', reTheme);
    load();
  })();

})();
