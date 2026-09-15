# molchat neironki

A reader-oriented research notebook built with Jekyll. The site is designed for
mathematical explanations, experiment notes, wide figures, and occasional
interactive visualizations while keeping the publishing stack small.

## Run locally

```bash
bundle install
bundle exec jekyll serve --livereload
```

Open <http://localhost:4000>. The dependency set matches GitHub Pages.

## Publish a post

Create `_posts/YYYY-MM-DD-title.md`:

```yaml
---
layout: post
title: "A precise, reader-facing title"
summary: "A short social-preview description."
abstract: "The claim, method, and main limitation in a compact paragraph."
date: 2026-06-22
updated: 2026-06-24
tags: [optimization, diagnostics]
toc: true
---
```

The homepage uses `abstract` as the visible brief and clamps it to three lines.
Use `summary` for social metadata. Papers, explanations, and shorter notes use
this same dated-post format so they remain in one chronology.

## Mathematics

Use `$$ ... $$` inside ordinary Markdown; kramdown renders it inline when it is
part of a sentence and as display mathematics when it stands on its own lines.
Inside a raw HTML paragraph, use `\( ... \)` for inline mathematics. Shared
macros live in `_includes/mathjax.html`. MathJax is loaded for every post and
for standalone pages that set `math: true`.

For multi-line displays, place `aligned`, `gathered`, `split`, `cases`, or a
matrix environment inside one display block. Keep sentence-level expressions
on the same source line as their punctuation:

```latex
$$
\begin{aligned}
  f(x) &= x^2 + 1, \\
  f'(x) &= 2x.
\end{aligned}
$$
```

Use one neutral environment for statements worth separating from the argument.
The label may be `Theorem`, `Lemma`, `Proposition`, `Definition`, `Remark`,
`Principle`, or another term required by the content:

```html
<div class="statement" markdown="1">
<span class="statement-label">Proposition</span>
The statement, with $$\Loss(\theta)$$ if needed.
</div>
```

Keep `<blockquote>` for quotations rather than theorem-like statements. A
paragraph with class `proof` gets a compact proof-sketch treatment.

## Figures

Ordinary SVG, PNG, or WebP images should remain the default. They load quickly,
print well, and survive feeds and archives.

Keep post-specific files in `assets/posts/<post-slug>/`, so figures and data
artifacts remain visibly owned by the post that uses them.

Animated GIFs work through the ordinary figure markup. Native video should use
browser controls and include a fallback sentence:

```html
<figure>
  <video controls preload="metadata" playsinline>
    <source src="/assets/posts/my-post/demo.webm" type="video/webm">
    <source src="/assets/posts/my-post/demo.mp4" type="video/mp4">
    Your browser does not support embedded video.
  </video>
  <figcaption>What the animation demonstrates.</figcaption>
</figure>
```

For hosted video, wrap the provider iframe in `<div class="video-embed">` so
it keeps a responsive 16:9 frame.

### Native phase diagram

The reference post demonstrates the dependency-free `phase-lab` component.
It uses a canvas and a range input, and is initialized by `assets/js/main.js`.
Use it as a pattern for small purpose-built explainers rather than as a generic
chart API.

### Plotly

Use Plotly when readers need hover, zoom, linked axes, or 3D rotation:

```html
<div class="iplot" style="height:420px">
  <p class="iplot-message">Interactive figure loading...</p>
  <script type="application/json">
  {"data": [...], "layout": {...}, "config": {...}}
  </script>
</div>
```

Plotly is loaded lazily when the figure approaches the viewport. Author-supplied
axis titles, ranges, scales, and scene settings take precedence over the site
theme. Invalid specifications and network failures produce a visible message.

### Switchable figures

Wrap `.plot-option` elements in `.plot-switcher`. Each option uses its
`data-label` as the tab name. The generated tabs support arrow keys and proper
tab semantics.

### Sequences

Wrap figures in `.carousel` for checkpoints or ablation sequences. Static
figures should still be preferred when the sequence can be understood as one
well-designed panel.

## Structure

- `index.html` is the complete chronological publication list.
- `_posts/2026-09-15-design-preview.md` is synthetic content for design review.
- `_layouts/post.html` owns note metadata and navigation.
- `assets/css/style.css` contains the full visual system.
- `assets/js/main.js` contains TOC, carousel, tab, canvas, and Plotly
  behavior with no application framework.
