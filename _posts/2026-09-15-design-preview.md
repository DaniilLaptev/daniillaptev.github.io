---
layout: post
title: "A Synthetic Note for Design Review"
summary: "Synthetic placeholder content for reviewing the blog's typography, mathematics, tables, figures, and interactive elements."
abstract: "Everything on this page is fabricated for visual testing. It demonstrates the available article elements without containing personal notes, unpublished results, or substantive research claims."
date: 2026-09-15
toc: true
---

This page contains deliberately generic material. Its only purpose is to make
the reading surface concrete enough to evaluate spacing, hierarchy, equations,
figures, and interaction before real writing is published.

## Prose and hierarchy

A technical note usually begins with one question and gives the reader enough
context to decide whether the answer matters. Paragraphs should carry most of
the argument. Use *italics* for local emphasis, **bold text** for a decisive
term, `inline code` for identifiers, and links with descriptive text.

### Lists and quotations

Ordered lists suit sequential reasoning:

1. state the question;
2. expose the assumptions;
3. connect the conclusion to a calculation or observation.

Unordered lists suit parallel artifacts:

- a configuration;
- a generated figure;
- a short record of what changed.

> A quotation occupies its own visual register and remains subordinate to the
> surrounding argument.

Footnotes can hold secondary context without interrupting the sentence.[^note]

## Mathematics

Inline mathematics such as $$x\in\RR^d$$ should sit naturally inside prose.
A display can align several steps while preserving the logical relation among
them:

$$
\begin{aligned}
  f(x) &= \frac12\norm{Ax-b}_2^2 + \lambda\norm{x}_1, \\
  \nabla f_0(x) &= A\T(Ax-b), \\
  x_{k+1} &= T_{\eta\lambda}\!\left(x_k-\eta A\T(Ax_k-b)\right).
\end{aligned}
\tag{1}
$$

Structured displays include cases and matrices:

$$
T_\tau(z)=
\begin{cases}
  z-\tau, & z>\tau, \\
  0, & |z|\leq\tau, \\
  z+\tau, & z<-\tau,
\end{cases}
\qquad
\begin{pmatrix}
  A & B\T \\
  B & -\lambda I
\end{pmatrix}
\begin{pmatrix}u\\v\end{pmatrix}
=
\begin{pmatrix}f\\g\end{pmatrix}.
\tag{2}
$$

## Statements and proofs

<div class="statement" markdown="1">
<span class="statement-label">Definition: stable sequence</span>
A sequence $$(x_k)_{k\geq 0}$$ is *geometrically stable* when there are constants
$$C>0$$ and $$0\leq q<1$$ such that
$$\norm{x_k-x_\star}_2\leq Cq^k$$ for every $$k$$.
</div>

<div class="statement" markdown="1">
<span class="statement-label">Proposition: contraction</span>
If $$F:\RR^d\to\RR^d$$ is $$q$$-Lipschitz for $$q<1$$, then
$$x_{k+1}=F(x_k)$$ converges geometrically to its unique fixed point.
</div>

<p class="proof">The fixed-point theorem gives a unique point \(x_\star\).
Repeated application of the Lipschitz inequality yields
\(\norm{x_k-x_\star}_2\leq q^k\norm{x_0-x_\star}_2\).</p>

## Tables and code

| Element | Example purpose | Review question |
|---|---|---|
| prose | explain an argument | is the line length comfortable? |
| equation | compress a derivation | does it fit or scroll cleanly? |
| table | compare parallel cases | are rows easy to scan? |
| figure | expose a pattern | are labels and caption legible? |

Fenced code uses syntax highlighting and provides a copy control:

```python
def moving_average(values, window):
    """Return a simple trailing average for synthetic values."""
    return [
        sum(values[max(0, i - window + 1):i + 1]) / min(i + 1, window)
        for i in range(len(values))
    ]
```

## Static figure

<figure>
  <img src="{{ '/assets/posts/design-preview/loss-curve.svg' | relative_url }}" alt="Two synthetic curves descending at different rates">
  <figcaption><strong>Figure 1.</strong> A synthetic static figure used to review axes, labels, spacing, and caption treatment.</figcaption>
</figure>

## Native interaction

The following canvas is generated entirely in the browser. The values and
geometry are arbitrary and carry no empirical meaning.

<div class="phase-lab" data-phase-lab>
  <div class="phase-lab-head">
    <p class="phase-lab-title">Synthetic geometry</p>
    <label class="phase-lab-control">
      <span>Parameter</span>
      <input type="range" min="0" max="0.95" value="0.58" step="0.01" aria-label="Synthetic parameter">
      <span class="phase-lab-value" data-phase-value>0.58</span>
    </label>
  </div>
  <canvas role="img" aria-label="Synthetic directions and a response curve as the parameter changes"></canvas>
  <p class="phase-lab-caption"><strong>Figure 2.</strong> A dependency-free interactive diagram for reviewing controls and responsive layout.</p>
</div>

## Plotly figure

The chart below uses invented series and loads Plotly only when it approaches
the viewport.

<div class="plot-switcher">
  <div class="plot-option" data-label="Interactive">
    <div class="iplot" style="height:420px">
      <p class="iplot-message">Interactive figure loading...</p>
      <script type="application/json">
      {
        "data": [
          {"type":"scatter","mode":"lines+markers","name":"series A",
           "x":[0,1,2,3,4,5,6,7,8],
           "y":[0.82,0.79,0.75,0.68,0.51,0.39,0.45,0.56,0.64],
           "line":{"color":"#315f75","width":3},"marker":{"size":5}},
          {"type":"scatter","mode":"lines","name":"series B",
           "x":[0,1,2,3,4,5,6,7,8],
           "y":[2.8,2.4,2.0,1.7,1.5,1.6,1.8,1.6,1.4],
           "yaxis":"y2","line":{"color":"#785841","width":2,"dash":"dot"}}
        ],
        "layout": {
          "xaxis":{"title":"step","range":[0,8]},
          "yaxis":{"title":"quantity A","range":[0,1]},
          "yaxis2":{"title":"quantity B","overlaying":"y","side":"right","range":[1,3]},
          "legend":{"orientation":"h","y":1.14},
          "hovermode":"x unified"
        }
      }
      </script>
    </div>
    <figcaption><strong>Figure 3.</strong> A synthetic interactive chart for checking hover, axes, and typography.</figcaption>
  </div>
  <figure class="plot-option" data-label="Static fallback">
    <img src="{{ '/assets/posts/design-preview/loss-curve.svg' | relative_url }}" alt="Static fallback with two synthetic curves">
    <figcaption>The static view remains available for print and restricted networks.</figcaption>
  </figure>
</div>

## Figure sequence

<div class="carousel">
  <figure>
    <img src="{{ '/assets/posts/design-preview/loss-curve.svg' | relative_url }}" alt="First synthetic carousel frame">
    <figcaption><strong>Frame 1.</strong> A simple chart used as the first carousel state.</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/images/paper-vortex.jpg' | relative_url }}" alt="Abstract geometric texture used as a second carousel frame">
    <figcaption><strong>Frame 2.</strong> A contrasting image used only to test navigation and image scaling.</figcaption>
  </figure>
</div>

## Media placeholders

GIFs use ordinary image markup. Native video and hosted embeds use these
patterns when real media is available:

```html
<figure>
  <video controls preload="metadata" playsinline poster="poster.webp">
    <source src="demo.webm" type="video/webm">
    <source src="demo.mp4" type="video/mp4">
    Your browser does not support embedded video.
  </video>
  <figcaption>Describe what changes during playback.</figcaption>
</figure>

<div class="video-embed">
  <iframe src="https://provider.example/embed/id"
          title="Description of the video" loading="lazy"></iframe>
</div>
```

Every sentence, value, table entry, and figure on this page is synthetic.

[^note]: This footnote also contains placeholder text and exists only to test
    the footnote treatment and return link.
