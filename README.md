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
print well, and survive feeds and archives. Every visual uses the same outer
frame, content stage, and caption:

```html
<figure class="figure-frame">
  <div class="figure-stage">
    <img src="/assets/posts/my-post/figure.svg" alt="Describe the figure">
  </div>
  <figcaption><strong>Figure 1.</strong> Explain what the reader should notice.</figcaption>
</figure>
```

Keep post-specific files in `assets/posts/<post-slug>/`, so figures and data
artifacts remain visibly owned by the post that uses them.

Animated GIFs use the same image markup. Native video remains inside the same
frame and should include browser controls and a fallback sentence:

```html
<figure class="figure-frame">
  <div class="figure-stage">
    <video controls preload="metadata" playsinline>
      <source src="/assets/posts/my-post/demo.webm" type="video/webm">
      <source src="/assets/posts/my-post/demo.mp4" type="video/mp4">
      Your browser does not support embedded video.
    </video>
  </div>
  <figcaption>What the animation demonstrates.</figcaption>
</figure>
```

For hosted video, put a provider iframe inside `.video-embed`, then put that
element inside `.figure-stage`. It keeps a responsive 16:9 content area while
the caption remains part of the shared outer frame.

### Native phase diagram

The reference post demonstrates the dependency-free `phase-lab` component.
It uses a canvas and a range input inside a centered `.figure-controlbar`.
Each control gets its own compact `.figure-knob`; several controls wrap and
remain centered without creating a full-width shaded header. Use it as a
pattern for small purpose-built explainers rather than as a generic chart API.

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

Use `.figure-switcher` on the outer frame and place `.figure-view` elements in
its stage. Each view uses `data-label` as its tab name. Generated tabs remain
centered, wrap instead of scrolling, and support arrow-key navigation:

```html
<figure class="figure-frame figure-switcher">
  <div class="figure-stage">
    <div class="figure-view" data-label="Interactive">...</div>
    <div class="figure-view" data-label="Static fallback">...</div>
  </div>
  <figcaption>One caption for the complete figure.</figcaption>
</figure>
```

### Sequences

Add `data-sequence` to a `.figure-switcher` to place previous and next arrows
at the toolbar edges. The views, tabs, content stage, and caption remain the
same as an ordinary switcher. Static figures should still be preferred when a
sequence can be understood as one well-designed panel.

## Footnotes

Write ordinary kramdown footnotes with `[^name]` and define them at the end of
the source. Hovering or focusing a reference shows the note beside the reading
position. Previews are capped at roughly sixteen lines; longer notes fade at
the bottom and provide an in-place expansion control. The original endnotes
remain in the document for printing, direct links, and no-JavaScript readers.

## Structure

- `index.html` is the complete chronological publication list.
- `_posts/2026-09-15-design-preview.md` is synthetic content for design review.
- `_layouts/post.html` owns note metadata and navigation.
- `assets/css/style.css` contains the full visual system.
- `assets/js/main.js` contains TOC, figure switcher, footnote, canvas, and Plotly
  behavior with no application framework.
