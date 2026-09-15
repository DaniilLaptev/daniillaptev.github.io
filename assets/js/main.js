(function () {
  'use strict';

  var doc = document.documentElement;
  var plotlyPromise = null;

  function all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function resizePlots(scope) {
    if (!window.Plotly) return;
    all('.js-plotly-plot', scope || document).forEach(function (node) {
      try { window.Plotly.Plots.resize(node); } catch (error) {}
    });
  }

  (function initToc() {
    var article = document.querySelector('.post.prose, .page.prose');
    if (!article) return;
    var headings = all('h2, h3', article);
    var navs = all('[data-toc-list]');
    var desktopNav = document.querySelector('.article-nav');
    var seen = {};

    headings.forEach(function (heading) {
      if (!heading.id) {
        var base = (heading.textContent || '').toLocaleLowerCase()
          .normalize('NFKD')
          .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
          .trim()
          .replace(/\s+/g, '-') || 'section';
        seen[base] = (seen[base] || 0) + 1;
        heading.id = seen[base] > 1 ? base + '-' + seen[base] : base;
      }

      var anchor = document.createElement('a');
      anchor.className = 'heading-anchor';
      anchor.href = '#' + heading.id;
      anchor.setAttribute('aria-hidden', 'true');
      anchor.tabIndex = -1;
      anchor.textContent = '#';
      heading.insertBefore(anchor, heading.firstChild);
    });

    if (!headings.length || !navs.length) return;
    navs.forEach(function (nav) {
      headings.forEach(function (heading) {
        var link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = (heading.textContent || '').replace(/^#/, '');
        link.className = heading.tagName === 'H3' ? 'lvl-3' : 'lvl-2';
        nav.appendChild(link);
      });
    });

    var links = all('[data-toc-list] a');
    var byId = {};
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      (byId[id] = byId[id] || []).push(link);
    });

    function activate(id) {
      links.forEach(function (link) {
        var active = link.getAttribute('href') === '#' + id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    function updateToc() {
      var current = headings[0];
      headings.forEach(function (heading) {
        if (heading.getBoundingClientRect().top <= 112) current = heading;
      });
      activate(current.id);
      if (desktopNav) desktopNav.classList.toggle('is-collapsed', window.scrollY > 24);
    }

    var queued = false;
    function requestUpdate() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        updateToc();
        queued = false;
      });
    }

    updateToc();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
  })();

  (function initCopyButtons() {
    all('.prose pre').forEach(function (pre) {
      var button = document.createElement('button');
      button.className = 'copy-btn';
      button.type = 'button';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code');
      button.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.innerText : pre.innerText;
        navigator.clipboard.writeText(text).then(function () {
          button.textContent = 'Copied';
          window.setTimeout(function () { button.textContent = 'Copy'; }, 1400);
        }).catch(function () {
          button.textContent = 'Select to copy';
        });
      });
      pre.appendChild(button);
    });
  })();

  (function initTables() {
    all('.prose table').forEach(function (table) {
      if (table.parentElement && table.parentElement.classList.contains('table-scroll')) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', 'Scrollable table');
      wrapper.tabIndex = 0;
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  })();

  (function initFigureSwitchers() {
    all('.figure-switcher').forEach(function (switcher, switcherIndex) {
      var views = all('.figure-view', switcher).filter(function (view) {
        return view.closest('.figure-switcher') === switcher;
      });
      if (views.length < 2) return;

      var stage = switcher.querySelector('.figure-stage');
      var sequence = switcher.hasAttribute('data-sequence');
      var toolbar = document.createElement('div');
      var tabs = document.createElement('div');
      var tabNodes = [];
      var activeIndex = 0;
      toolbar.className = 'figure-toolbar figure-switcher-toolbar' + (sequence ? ' has-arrows' : '');
      tabs.className = 'figure-tablist';
      tabs.setAttribute('role', 'tablist');
      tabs.setAttribute('aria-label', sequence ? 'Figure sequence' : 'Figure views');

      function select(index, focus) {
        activeIndex = (index + views.length) % views.length;
        views.forEach(function (view, viewIndex) {
          var active = viewIndex === activeIndex;
          view.hidden = !active;
          tabNodes[viewIndex].classList.toggle('active', active);
          tabNodes[viewIndex].setAttribute('aria-selected', active ? 'true' : 'false');
          tabNodes[viewIndex].tabIndex = active ? 0 : -1;
        });
        if (focus) tabNodes[activeIndex].focus();
        resizePlots(views[activeIndex]);
      }

      views.forEach(function (view, viewIndex) {
        var viewId = 'figure-view-' + switcherIndex + '-' + viewIndex;
        var tabId = 'figure-tab-' + switcherIndex + '-' + viewIndex;
        var tab = document.createElement('button');
        view.id = viewId;
        view.setAttribute('role', 'tabpanel');
        view.setAttribute('aria-labelledby', tabId);
        tab.id = tabId;
        tab.className = 'figure-tab';
        tab.type = 'button';
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', viewId);
        tab.textContent = view.dataset.label || ('View ' + (viewIndex + 1));
        tab.addEventListener('click', function () { select(viewIndex, false); });
        tab.addEventListener('keydown', function (event) {
          var nextIndex = viewIndex;
          if (event.key === 'ArrowRight') nextIndex = (viewIndex + 1) % views.length;
          else if (event.key === 'ArrowLeft') nextIndex = (viewIndex - 1 + views.length) % views.length;
          else if (event.key === 'Home') nextIndex = 0;
          else if (event.key === 'End') nextIndex = views.length - 1;
          else return;
          event.preventDefault();
          select(nextIndex, true);
        });
        tabNodes.push(tab);
        tabs.appendChild(tab);
      });

      if (sequence) {
        var previous = document.createElement('button');
        var next = document.createElement('button');
        previous.className = 'figure-sequence-btn previous';
        next.className = 'figure-sequence-btn next';
        previous.type = next.type = 'button';
        previous.setAttribute('aria-label', 'Previous figure');
        next.setAttribute('aria-label', 'Next figure');
        previous.textContent = '\u2190';
        next.textContent = '\u2192';
        previous.addEventListener('click', function () { select(activeIndex - 1, false); });
        next.addEventListener('click', function () { select(activeIndex + 1, false); });
        toolbar.appendChild(previous);
        toolbar.appendChild(tabs);
        toolbar.appendChild(next);
      } else {
        toolbar.appendChild(tabs);
      }

      switcher.insertBefore(toolbar, stage || switcher.firstChild);
      select(0, false);
    });
  })();

  (function initFootnotePreviews() {
    var references = all('a.footnote, a[rel="footnote"]');
    if (!references.length) return;
    var closeTimer;
    var active;

    function cancelClose() {
      window.clearTimeout(closeTimer);
    }

    function position(reference, popover) {
      var referenceRect = reference.getBoundingClientRect();
      var popoverRect = popover.getBoundingClientRect();
      var left = referenceRect.left + referenceRect.width / 2 - popoverRect.width / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - popoverRect.width - 12));
      var top = referenceRect.bottom + 10;
      var above = top + popoverRect.height > window.innerHeight - 12;
      if (above) top = Math.max(76, referenceRect.top - popoverRect.height - 10);
      popover.style.left = left + 'px';
      popover.style.top = top + 'px';
      popover.classList.toggle('is-above', above);
    }

    function refresh(preview) {
      if (preview.popover.hidden) return;
      var truncated = preview.content.scrollHeight > preview.content.clientHeight + 2;
      preview.popover.classList.toggle('is-truncated', truncated);
      preview.more.hidden = !truncated;
      position(preview.reference, preview.popover);
    }

    function typeset(preview, attempt) {
      if (preview.popover.hidden || preview.popover.dataset.mathTypeset ||
          preview.popover.dataset.mathTypesetting) return;

      var mathjax = window.MathJax;
      if (!mathjax || !mathjax.startup || !mathjax.startup.promise ||
          typeof mathjax.typesetPromise !== 'function') {
        if (attempt < 50) {
          window.setTimeout(function () { typeset(preview, attempt + 1); }, 100);
        }
        return;
      }

      preview.popover.dataset.mathTypesetting = 'true';
      mathjax.startup.promise.then(function () {
        if (preview.popover.hidden) return;
        return mathjax.typesetPromise([preview.popover]).then(function () {
          preview.popover.dataset.mathTypeset = 'true';
          window.requestAnimationFrame(function () { refresh(preview); });
        });
      }).catch(function () {
        // Leave the source readable and allow another attempt when reopened.
      }).then(function () {
        delete preview.popover.dataset.mathTypesetting;
      });
    }

    function hide(preview) {
      preview.popover.hidden = true;
      preview.popover.classList.remove('is-expanded');
      preview.more.textContent = 'Read full note';
      preview.reference.setAttribute('aria-expanded', 'false');
      if (active === preview) active = null;
    }

    function scheduleClose(preview) {
      cancelClose();
      closeTimer = window.setTimeout(function () {
        if (!preview.popover.matches(':hover') && !preview.popover.contains(document.activeElement) && document.activeElement !== preview.reference) {
          hide(preview);
        }
      }, 140);
    }

    references.forEach(function (reference, index) {
      var targetId = decodeURIComponent((reference.getAttribute('href') || '').replace(/^#/, ''));
      var target = document.getElementById(targetId);
      if (!target) return;

      var popover = document.createElement('aside');
      var content = document.createElement('div');
      var more = document.createElement('button');
      var clone = target.cloneNode(true);
      all('.reversefootnote', clone).forEach(function (link) { link.remove(); });
      all('[id]', clone).forEach(function (node) { node.removeAttribute('id'); });
      while (clone.firstChild) content.appendChild(clone.firstChild);

      popover.id = 'footnote-preview-' + index;
      popover.className = 'footnote-popover';
      popover.setAttribute('role', 'note');
      popover.hidden = true;
      content.className = 'footnote-popover-content';
      more.className = 'footnote-more';
      more.type = 'button';
      more.textContent = 'Read full note';
      more.hidden = true;
      popover.appendChild(content);
      popover.appendChild(more);
      document.body.appendChild(popover);
      reference.setAttribute('aria-controls', popover.id);
      reference.setAttribute('aria-expanded', 'false');

      var preview = { reference: reference, popover: popover, content: content, more: more };

      function show() {
        cancelClose();
        if (active && active !== preview) hide(active);
        active = preview;
        popover.hidden = false;
        reference.setAttribute('aria-expanded', 'true');
        window.requestAnimationFrame(function () { refresh(preview); });
        typeset(preview, 0);
      }

      reference.addEventListener('mouseenter', show);
      reference.addEventListener('mouseleave', function () { scheduleClose(preview); });
      reference.addEventListener('focus', show);
      reference.addEventListener('blur', function () { scheduleClose(preview); });
      reference.addEventListener('click', function (event) {
        if (!window.matchMedia('(hover: none)').matches) return;
        if (popover.hidden) {
          event.preventDefault();
          show();
        }
      });
      popover.addEventListener('mouseenter', cancelClose);
      popover.addEventListener('mouseleave', function () { scheduleClose(preview); });
      popover.addEventListener('focusin', cancelClose);
      popover.addEventListener('focusout', function () { scheduleClose(preview); });
      more.addEventListener('click', function () {
        var expanded = popover.classList.toggle('is-expanded');
        more.textContent = expanded ? 'Collapse note' : 'Read full note';
        position(reference, popover);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && active) {
        hide(active);
        active.reference.focus();
      }
    });
    document.addEventListener('pointerdown', function (event) {
      if (active && event.target !== active.reference && !active.popover.contains(event.target)) hide(active);
    });
    window.addEventListener('scroll', function () {
      if (active) hide(active);
    }, { passive: true });
    window.addEventListener('resize', function () {
      if (active) position(active.reference, active.popover);
    }, { passive: true });
  })();

  function loadPlotly() {
    if (window.Plotly) return Promise.resolve(window.Plotly);
    if (plotlyPromise) return plotlyPromise;
    plotlyPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.35.2/plotly.min.js';
      script.onload = function () { resolve(window.Plotly); };
      script.onerror = function () { reject(new Error('Plotly failed to load')); };
      document.head.appendChild(script);
    });
    return plotlyPromise;
  }

  function plotLayout(layout) {
    var styles = getComputedStyle(doc);
    var text = styles.getPropertyValue('--ink').trim() || '#1c211f';
    var grid = styles.getPropertyValue('--line').trim() || '#d8ddd9';
    var axis = { gridcolor: grid, zerolinecolor: grid, linecolor: grid, color: text };
    layout = layout || {};
    var output = Object.assign({
      autosize: true,
      margin: { l: 48, r: 20, t: 24, b: 48 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }, layout);
    output.font = Object.assign({ color: text, family: 'Source Serif 4, Georgia, serif', size: 12 }, layout.font || {});
    Object.keys(layout).forEach(function (key) {
      if (/^[xy]axis\d*$/.test(key)) output[key] = Object.assign({}, axis, layout[key] || {});
    });
    output.xaxis = Object.assign({}, axis, layout.xaxis || {});
    output.yaxis = Object.assign({}, axis, layout.yaxis || {});
    if (layout.scene) {
      output.scene = Object.assign({}, layout.scene);
      output.scene.xaxis = Object.assign({}, axis, layout.scene.xaxis || {});
      output.scene.yaxis = Object.assign({}, axis, layout.scene.yaxis || {});
      output.scene.zaxis = Object.assign({}, axis, layout.scene.zaxis || {});
    }
    return output;
  }

  function showPlotError(node, message) {
    node.classList.add('iplot-error');
    node.innerHTML = '<p class="iplot-message">' + message + '</p>';
  }

  function renderPlot(node) {
    if (node.dataset.rendered) return;
    var source = node.querySelector('script[type="application/json"]');
    if (!source) return;
    var spec;
    try { spec = JSON.parse(source.textContent); }
    catch (error) {
      showPlotError(node, 'This interactive figure has an invalid specification.');
      return;
    }
    node.dataset.rendered = 'loading';
    loadPlotly().then(function () {
      var config = Object.assign({ responsive: true, displayModeBar: 'hover', displaylogo: false, scrollZoom: false }, spec.config || {});
      all('.iplot-message, script[type="application/json"]', node).forEach(function (child) { child.remove(); });
      return window.Plotly.newPlot(node, spec.data || [], plotLayout(spec.layout), config);
    }).then(function () {
      node.dataset.rendered = 'true';
    }).catch(function () {
      showPlotError(node, 'The interactive figure could not be loaded.');
    });
  }

  (function initPlotly() {
    var nodes = all('.iplot');
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(renderPlot);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        renderPlot(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '400px 0px' });
    nodes.forEach(function (node) { observer.observe(node); });
  })();

  function initPhaseLab(root) {
    var canvas = root.querySelector('canvas');
    var slider = root.querySelector('input[type="range"]');
    var value = root.querySelector('[data-phase-value]');
    if (!canvas || !slider) return;
    var context = canvas.getContext('2d');

    function logistic(x, center, scale) {
      return 1 / (1 + Math.exp(-(x - center) / scale));
    }

    function line(x1, y1, x2, y2, color, width) {
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.strokeStyle = color;
      context.lineWidth = width;
      context.stroke();
    }

    function draw() {
      var rect = canvas.getBoundingClientRect();
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      var width = Math.max(320, Math.round(rect.width));
      var height = Math.max(250, Math.round(rect.height));
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      var sparsity = Number(slider.value);
      if (value) value.textContent = sparsity.toFixed(2);
      var styles = getComputedStyle(doc);
      var ink = styles.getPropertyValue('--ink').trim();
      var muted = styles.getPropertyValue('--muted').trim();
      var grid = styles.getPropertyValue('--line').trim();
      var blue = styles.getPropertyValue('--blue').trim();
      var rust = styles.getPropertyValue('--rust').trim();
      var green = styles.getPropertyValue('--green').trim();
      var compact = width < 620;
      var gap = compact ? 22 : 42;
      var panelWidth = compact ? width - 36 : (width - gap - 54) / 2;
      var panelHeight = compact ? (height - 120) / 2 : height - 80;

      context.font = '600 11px "Source Serif 4", Georgia, serif';
      context.fillStyle = muted;
      context.fillText('LEARNED FEATURE GEOMETRY', 18, 24);

      var gx = 18;
      var gy = 38;
      var cx = gx + panelWidth / 2;
      var cy = gy + panelHeight / 2;
      var radius = Math.min(panelWidth, panelHeight) * 0.36;
      line(gx, cy, gx + panelWidth, cy, grid, 1);
      line(cx, gy, cx, gy + panelHeight, grid, 1);

      var palette = [blue, rust, green, '#7a5d93', '#9a7424'];
      for (var index = 0; index < 5; index += 1) {
        var denseAngle = index < 2 ? index * Math.PI / 2 : (index - 1) * Math.PI / 2;
        var sparseAngle = -Math.PI / 2 + index * Math.PI * 2 / 5;
        var mix = logistic(sparsity, 0.48, 0.08);
        var angle = denseAngle * (1 - mix) + sparseAngle * mix;
        var active = index < 2 ? 1 : logistic(sparsity, 0.34 + index * 0.07, 0.05);
        var length = radius * (0.22 + 0.78 * active);
        var x = cx + Math.cos(angle) * length;
        var y = cy + Math.sin(angle) * length;
        line(cx, cy, x, y, palette[index], 2.5);
        context.beginPath();
        context.arc(x, y, 4.2, 0, Math.PI * 2);
        context.fillStyle = palette[index];
        context.fill();
      }
      context.beginPath();
      context.arc(cx, cy, 3.4, 0, Math.PI * 2);
      context.fillStyle = ink;
      context.fill();

      var px = compact ? 18 : gx + panelWidth + gap;
      var py = compact ? gy + panelHeight + 42 : gy;
      var pw = panelWidth;
      var ph = panelHeight;
      context.fillStyle = muted;
      context.fillText('FEATURES REPRESENTED', px, py - 14);
      line(px, py + ph, px + pw, py + ph, grid, 1);
      line(px, py, px, py + ph, grid, 1);
      context.font = '10px "Source Serif 4", Georgia, serif';
      context.fillText('dense', px, py + ph + 18);
      context.fillText('sparse', px + pw - 34, py + ph + 18);
      context.fillText('5', px - 13, py + 5);
      context.fillText('2', px - 13, py + ph * 0.62);

      context.beginPath();
      for (var step = 0; step <= 80; step += 1) {
        var s = step / 80;
        var represented = 2 + logistic(s, 0.38, 0.035) + logistic(s, 0.53, 0.035) + logistic(s, 0.68, 0.035);
        var sx = px + s * pw;
        var sy = py + ph - ((represented - 1.5) / 4) * ph;
        if (step === 0) context.moveTo(sx, sy);
        else context.lineTo(sx, sy);
      }
      context.strokeStyle = blue;
      context.lineWidth = 2.5;
      context.stroke();
      var current = 2 + logistic(sparsity, 0.38, 0.035) + logistic(sparsity, 0.53, 0.035) + logistic(sparsity, 0.68, 0.035);
      var pointX = px + sparsity * pw;
      var pointY = py + ph - ((current - 1.5) / 4) * ph;
      line(pointX, py, pointX, py + ph, rust, 1);
      context.beginPath();
      context.arc(pointX, pointY, 5, 0, Math.PI * 2);
      context.fillStyle = rust;
      context.fill();
    }

    slider.addEventListener('input', draw);
    if ('ResizeObserver' in window) new ResizeObserver(draw).observe(root);
    else window.addEventListener('resize', draw, { passive: true });
    draw();
  }

  all('[data-phase-lab]').forEach(initPhaseLab);
})();
