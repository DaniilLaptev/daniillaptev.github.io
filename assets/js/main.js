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

  (function initCarousels() {
    all('.carousel').forEach(function (carousel, carouselIndex) {
      var slides = Array.prototype.slice.call(carousel.children);
      if (slides.length < 2) return;
      carousel.setAttribute('role', 'region');
      carousel.setAttribute('aria-roledescription', 'carousel');

      var viewport = document.createElement('div');
      var track = document.createElement('div');
      viewport.className = 'carousel-viewport';
      track.className = 'carousel-track';
      slides.forEach(function (slide, slideIndex) {
        slide.classList.add('carousel-slide');
        slide.id = 'carousel-' + carouselIndex + '-slide-' + slideIndex;
        track.appendChild(slide);
      });
      viewport.appendChild(track);

      var previous = document.createElement('button');
      var next = document.createElement('button');
      previous.className = 'carousel-btn prev';
      next.className = 'carousel-btn next';
      previous.type = next.type = 'button';
      previous.setAttribute('aria-label', 'Previous figure');
      next.setAttribute('aria-label', 'Next figure');
      previous.textContent = '←';
      next.textContent = '→';
      viewport.appendChild(previous);
      viewport.appendChild(next);

      var dots = document.createElement('div');
      dots.className = 'carousel-dots';
      dots.setAttribute('role', 'tablist');
      carousel.innerHTML = '';
      carousel.appendChild(viewport);
      carousel.appendChild(dots);
      var activeIndex = 0;

      slides.forEach(function (slide, slideIndex) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Figure ' + (slideIndex + 1));
        dot.setAttribute('aria-controls', slide.id);
        dot.addEventListener('click', function () { go(slideIndex); });
        dots.appendChild(dot);
      });

      function go(index) {
        activeIndex = (index + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-activeIndex * 100) + '%)';
        all('.carousel-dot', dots).forEach(function (dot, dotIndex) {
          var active = dotIndex === activeIndex;
          dot.classList.toggle('active', active);
          dot.setAttribute('aria-selected', active ? 'true' : 'false');
          dot.tabIndex = active ? 0 : -1;
          slides[dotIndex].setAttribute('aria-hidden', active ? 'false' : 'true');
        });
        resizePlots(slides[activeIndex]);
      }

      previous.addEventListener('click', function () { go(activeIndex - 1); });
      next.addEventListener('click', function () { go(activeIndex + 1); });
      carousel.tabIndex = 0;
      carousel.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') go(activeIndex - 1);
        if (event.key === 'ArrowRight') go(activeIndex + 1);
      });
      go(0);
    });
  })();

  (function initPlotSwitchers() {
    all('.plot-switcher').forEach(function (switcher, switcherIndex) {
      var panels = all('.plot-option', switcher).filter(function (panel) {
        return panel.closest('.plot-switcher') === switcher;
      });
      if (!panels.length) return;
      panels.forEach(function (panel) { panel.classList.add('plot-panel'); });
      if (panels.length === 1) return;

      var tabs = document.createElement('div');
      tabs.className = 'plot-tabs';
      tabs.setAttribute('role', 'tablist');
      switcher.insertBefore(tabs, switcher.firstChild);
      var tabNodes = [];

      function select(index, focus) {
        panels.forEach(function (panel, panelIndex) {
          var active = panelIndex === index;
          panel.hidden = !active;
          tabNodes[panelIndex].classList.toggle('active', active);
          tabNodes[panelIndex].setAttribute('aria-selected', active ? 'true' : 'false');
          tabNodes[panelIndex].tabIndex = active ? 0 : -1;
        });
        if (focus) tabNodes[index].focus();
        resizePlots(panels[index]);
      }

      panels.forEach(function (panel, panelIndex) {
        var panelId = 'plot-panel-' + switcherIndex + '-' + panelIndex;
        var tabId = 'plot-tab-' + switcherIndex + '-' + panelIndex;
        panel.id = panelId;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tabId);
        var tab = document.createElement('button');
        tab.id = tabId;
        tab.className = 'plot-tab';
        tab.type = 'button';
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panelId);
        tab.textContent = panel.dataset.label || ('View ' + (panelIndex + 1));
        tab.addEventListener('click', function () { select(panelIndex, false); });
        tab.addEventListener('keydown', function (event) {
          var nextIndex = panelIndex;
          if (event.key === 'ArrowRight') nextIndex = (panelIndex + 1) % panels.length;
          else if (event.key === 'ArrowLeft') nextIndex = (panelIndex - 1 + panels.length) % panels.length;
          else if (event.key === 'Home') nextIndex = 0;
          else if (event.key === 'End') nextIndex = panels.length - 1;
          else return;
          event.preventDefault();
          select(nextIndex, true);
        });
        tabNodes.push(tab);
        tabs.appendChild(tab);
      });
      select(0, false);
    });
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
