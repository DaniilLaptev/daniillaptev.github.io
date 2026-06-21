# Into the Sky — a research blog

A minimal, math-heavy personal blog built with Jekyll and MathJax, designed for
GitHub Pages. Pastel light/dark themes, three switchable reading fonts, a top
reading-progress bar, an auto-generated table of contents, image carousels, and
tabbed plot switchers.

## Run locally

```bash
bundle install
bundle exec jekyll serve --livereload
# open http://localhost:4000
```

If you don't have Ruby/Bundler: install Ruby (3.x), then `gem install bundler`.

## Deploy to GitHub Pages

1. Create a repo and push this folder.
2. **User/org site** → name the repo `<username>.github.io`, leave
   `baseurl: ""` in `_config.yml`.
   **Project site** → any repo name, set `baseurl: "/<repo-name>"`.
3. In the repo: **Settings → Pages → Build and deployment → Source:
   _Deploy from a branch_**, branch `main`, folder `/ (root)`.
4. GitHub builds it automatically — no Actions workflow needed.

Then edit `_config.yml`: `title`, `author`, `github_username`, `scholar_url`, etc.

## Writing a post

Add `_posts/YYYY-MM-DD-title.md` with front matter:

```yaml
---
layout: post
title: "My Title"
subtitle: "Optional one-liner"
date: 2026-06-21
tags: [optimization, theory]
toc: true   # set false to hide the table of contents
---
```

### Math
Use `$$ … $$` for **both** inline and display math (kramdown keeps the contents
safe from Markdown). Display math on its own line gets an equation number.
Custom macros (`\EE`, `\KL`, `\argmin`, `\vct`, `\Loss`, …) live in
`_includes/mathjax.html` — add your own there. The `physics` and `mathtools`
MathJax packages are preloaded.

### Plot switcher (tabbed figures)
```html
<div class="plot-switcher">
  <figure class="plot-option" data-label="Loss">
    <img src="{{ '/assets/images/x.svg' | relative_url }}" alt="...">
    <figcaption>Caption.</figcaption>
  </figure>
  <figure class="plot-option" data-label="Accuracy"> ... </figure>
</div>
```
A switcher with a **single** `.plot-option` renders as a plain framed figure —
no tab is shown — so the same markup works for one plot or many.

### Interactive plots (Plotly)
For hover tooltips, zoom, or rotatable 3D, use an `.iplot` block. Plotly is
lazy-loaded only on pages that need it, themed from the CSS variables, and
re-themed automatically on the light/dark toggle.
```html
<div class="iplot" style="height:420px">
<script type="application/json">
{ "data": [ { "type": "scatter3d", "mode": "markers",
              "x": [...], "y": [...], "z": [...] } ],
  "layout": {}, "config": { "responsive": true } }
</script>
</div>
```
- **Images vs. interactive**: `<img>` handles SVG/PNG/JPG/WebP. For PDF use
  `<iframe src="….pdf">` or export to SVG. Data-driven plots ship their data in
  the JSON spec above.
- **They compose.** Put an `.iplot` inside a `.plot-option`, or a
  `.plot-switcher`/`.iplot` inside a `.carousel` slide — each interactive plot
  is resized when its tab/slide is revealed.

### Carousel
```html
<div class="carousel">
  <figure><img src="..." alt="..."><figcaption>...</figcaption></figure>
  <figure><img src="..." alt="..."><figcaption>...</figcaption></figure>
</div>
```

### Callouts
```html
<div class="callout key">   <!-- or: note, warn -->
  <span class="callout-title">Heads up</span>
  Your text here.
</div>
```
Add `markdown="1"` to the `<div>` if you want Markdown processed inside it.

## Customizing the look
- **Colors / palette**: CSS variables at the top of `assets/css/style.css`
  (`[data-theme="light"]` and `[data-theme="dark"]`).
- **Fonts**: the three options are wired in `_includes/header.html`,
  `assets/css/style.css` (`--font-*`), and loaded in `_includes/head.html`.
- **Behavior** (progress bar, TOC, carousel, tabs): `assets/js/main.js`.
