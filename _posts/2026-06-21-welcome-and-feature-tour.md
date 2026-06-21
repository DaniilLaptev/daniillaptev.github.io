---
layout: post
title: "A Field Guide to This Blog"
subtitle: "Math, plots, and the interactive bits — all in one tour."
date: 2026-06-21
tags: [meta, deep-learning, optimization]
---

This first post is a working demo. Everything you see here — the rendered math,
the carousel, the tabbed plots, the progress bar creeping along the top — is
available to you in any post by writing plain Markdown plus a sprinkle of HTML.
Read on; the [About](/about/) page covers the philosophy.

## Writing mathematics

Inline math sits in the flow of a sentence: the softmax temperature $$\tau$$
controls how peaked $$\softmax(\vct{z}/\tau)$$ becomes. Display math gets its
own line and an equation number:

$$
\begin{equation}
  \Loss(\theta) \;=\; \EE_{(\vct{x}, y) \sim \Data}
  \big[\, -\log p_\theta(y \given \vct{x}) \,\big]
  \;+\; \tfrac{\lambda}{2}\, \norm{\theta}^2 .
\end{equation}
$$

The macro library is generous. Expectations $$\EE$$, the KL divergence
$$\KL{q}{p}$$, transposes $$\vct{w}\T\vct{x}$$, $$\argmin_\theta$$, indicator
functions $$\ind[y = k]$$ — all predefined, and you can add your own in
`_includes/mathjax.html`. Because the `physics` and `mathtools` packages are
loaded, derivatives are painless too:

$$
\begin{align}
  \pdv{\Loss}{\theta_j}
  &= \EE\!\left[ \pdv{\theta_j} \big(-\log p_\theta(y \given \vct{x})\big) \right], \\
  \grad_\theta \Loss
  &= \frac{1}{N} \sum_{i=1}^{N} \grad_\theta \ell\big(f_\theta(\vct{x}_i), y_i\big).
\end{align}
$$

<div class="callout key" markdown="1">
<span class="callout-title">Authoring tip</span>
Write **both** inline and display math with `$$ … $$`. On its own line it
becomes a display block; mid-sentence it stays inline. kramdown protects the
contents, so `_`, `*`, and `^` never get mangled by Markdown.
</div>

## Switching between plots

When two views compete for the same slot, use a **plot switcher** instead of
stacking figures. Click the tabs:

<div class="plot-switcher">
  <figure class="plot-option" data-label="Loss">
    <img src="{{ '/assets/images/loss-curve.svg' | relative_url }}" alt="Training and validation loss">
    <figcaption>Cross-entropy loss. Validation tracks training — no overfitting yet.</figcaption>
  </figure>
  <figure class="plot-option" data-label="Accuracy">
    <img src="{{ '/assets/images/accuracy-curve.svg' | relative_url }}" alt="Training and validation accuracy">
    <figcaption>Top-1 accuracy on the same run.</figcaption>
  </figure>
  <figure class="plot-option" data-label="LR schedule">
    <img src="{{ '/assets/images/lr-schedule.svg' | relative_url }}" alt="Learning-rate schedule">
    <figcaption>Linear warmup followed by cosine decay.</figcaption>
  </figure>
</div>

The markup is just a `<div class="plot-switcher">` wrapping one
`<figure class="plot-option" data-label="…">` per view. The tabs are generated
for you. **A switcher with only one panel renders as a plain framed figure —
no tab is shown**, so you can use the same markup everywhere.

## Truly interactive plots

Static images (`<img>`, SVG or PNG) are perfect for most figures. When you want
**hover tooltips, zoom, or a 3D plot you can rotate**, drop in a `.iplot` block:
a `<div class="iplot">` containing a `<script type="application/json">` with a
[Plotly](https://plotly.com/javascript/) spec (`data`, `layout`, `config`).
Plotly is lazy-loaded only on pages that use it, and the plot automatically
re-themes with the light/dark toggle. Drag to rotate:

<div class="iplot" style="height:420px">
<script type="application/json">
{
  "data": [
    {"type":"scatter3d","mode":"markers","name":"class A",
     "x":[1.1,0.8,1.3,0.9,1.2,0.7,1.0,1.4],
     "y":[0.9,1.2,1.0,0.7,1.3,1.1,0.8,1.0],
     "z":[1.0,0.8,1.2,1.1,0.9,1.3,0.7,1.0],
     "marker":{"size":5,"color":"#8c7ae0"}},
    {"type":"scatter3d","mode":"markers","name":"class B",
     "x":[-1.0,-0.8,-1.3,-0.9,-1.2,-0.7,-1.1,-1.0],
     "y":[-1.1,-0.9,-1.0,-1.3,-0.7,-1.2,-0.8,-1.0],
     "z":[-0.9,-1.2,-1.0,-0.8,-1.3,-0.7,-1.1,-1.0],
     "marker":{"size":5,"color":"#e87aa6"}}
  ],
  "layout": {"legend":{"orientation":"h"}}
}
</script>
</div>

<div class="callout note" markdown="1">
<span class="callout-title">Combine them freely</span>
Switchers, carousels, and `.iplot` blocks compose. Put an `.iplot` inside a
`.plot-option`, or a `.plot-switcher`/`.iplot` inside a carousel slide — each
reveals and resizes its interactive plot correctly. Below, one tab is a static
SVG and the other is a live 3D plot:
</div>

<div class="plot-switcher">
  <figure class="plot-option" data-label="Loss (static)">
    <img src="{{ '/assets/images/loss-curve.svg' | relative_url }}" alt="Static loss curve">
    <figcaption>A static SVG figure.</figcaption>
  </figure>
  <div class="plot-option" data-label="Embeddings (3D)">
    <div class="iplot" style="height:380px">
<script type="application/json">
{
  "data": [
    {"type":"scatter3d","mode":"markers",
     "x":[1,0.7,1.2,-1,-0.8,-1.1,0.1,-0.2,0.0],
     "y":[1,1.1,0.8,-1,-1.2,-0.9,0.0,0.2,-0.1],
     "z":[1,0.9,1.1,-1,-0.7,-1.2,0.2,-0.1,0.0],
     "marker":{"size":5,"color":[0,0,0,1,1,1,2,2,2],"colorscale":[[0,"#8c7ae0"],[0.5,"#e87aa6"],[1,"#5cc2a0"]]}}
  ],
  "layout": {}
}
</script>
    </div>
    <figcaption>The same data, now rotatable.</figcaption>
  </div>
</div>

> **PNG, PDF, raw data?** `<img>` handles SVG/PNG/JPG/WebP. For PDF, embed with
> `<iframe src="….pdf">` or (better) export the figure to SVG. "Raw data" plots
> — where the data ships with the page and is drawn in the browser — are exactly
> what `.iplot` is for; the data lives in the JSON spec.

## A carousel for sequences

For images that belong in sequence — training snapshots, ablation grids — a
**carousel** keeps them from sprawling down the page. Use the arrows, the dots,
or your keyboard's ← → keys.

<div class="carousel">
  <figure>
    <img src="{{ '/assets/images/embed-epoch1.svg' | relative_url }}" alt="Embeddings at epoch 1">
    <figcaption>Epoch 1 — classes are entangled in representation space.</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/images/embed-epoch50.svg' | relative_url }}" alt="Embeddings at epoch 50">
    <figcaption>Epoch 50 — clean, well-separated clusters have emerged.</figcaption>
  </figure>
</div>

Any number of `<figure>` children inside `<div class="carousel">` works.

## Code, with a copy button

Hover a code block to reveal a copy button in the corner:

```python
import torch
import torch.nn.functional as F

def label_smoothing_loss(logits, target, eps: float = 0.1):
    """Cross-entropy with uniform label smoothing."""
    n = logits.size(-1)
    log_p = F.log_softmax(logits, dim=-1)
    nll = -log_p.gather(-1, target.unsqueeze(-1)).squeeze(-1)
    smooth = -log_p.mean(dim=-1)
    return ((1 - eps) * nll + eps * smooth).mean()
```

## Tables and asides

| Optimizer | Warmup | Final val. acc. | Notes                       |
|-----------|:------:|:---------------:|-----------------------------|
| SGD+m     |   no   |      91.2%      | strong baseline             |
| Adam      |   no   |      90.4%      | faster early, slightly worse|
| AdamW     |  yes   |    **92.6%**    | decoupled weight decay      |

> A result you cannot plot is a result you do not yet understand. Keep the
> figures close to the claims.

That's the whole toolkit. Duplicate this file in `_posts/`, rename it
`YYYY-MM-DD-your-title.md`, and start writing.
