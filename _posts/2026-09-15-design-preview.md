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
Long notes use the same reference and can be expanded from their preview.[^long-note]

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

<figure class="figure-frame">
  <div class="figure-stage">
    <img src="{{ '/assets/posts/design-preview/loss-curve.svg' | relative_url }}" alt="Two synthetic curves descending at different rates">
  </div>
  <figcaption><strong>Figure 1.</strong> A synthetic static figure used to review axes, labels, spacing, and caption treatment.</figcaption>
</figure>

## Native interaction

The following canvas is generated entirely in the browser. The values and
geometry are arbitrary and carry no empirical meaning.

<figure class="figure-frame phase-lab" data-phase-lab>
  <div class="figure-toolbar">
    <div class="figure-controlbar" aria-label="Figure controls">
      <label class="figure-knob">
        <span>Parameter</span>
        <input type="range" min="0" max="0.95" value="0.58" step="0.01" aria-label="Synthetic parameter">
        <output class="phase-lab-value" data-phase-value>0.58</output>
      </label>
    </div>
  </div>
  <div class="figure-stage">
    <canvas role="img" aria-label="Synthetic directions and a response curve as the parameter changes"></canvas>
  </div>
  <figcaption><strong>Figure 2.</strong> A dependency-free interactive diagram for reviewing controls and responsive layout.</figcaption>
</figure>

## Plotly figure

The chart below uses invented series and loads Plotly only when it approaches
the viewport.

<figure class="figure-frame figure-switcher">
  <div class="figure-stage">
    <div class="figure-view" data-label="Interactive">
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
    </div>
    <div class="figure-view" data-label="Static fallback">
      <img src="{{ '/assets/posts/design-preview/loss-curve.svg' | relative_url }}" alt="Static fallback with two synthetic curves">
    </div>
  </div>
  <figcaption><strong>Figure 3.</strong> A synthetic chart with interactive and static views in one stable figure frame.</figcaption>
</figure>

## Figure sequence

<figure class="figure-frame figure-switcher" data-sequence>
  <div class="figure-stage">
    <div class="figure-view" data-label="Frame 1">
      <img src="{{ '/assets/posts/design-preview/loss-curve.svg' | relative_url }}" alt="First synthetic sequence frame">
    </div>
    <div class="figure-view" data-label="Frame 2">
      <img src="{{ '/assets/images/paper-vortex.jpg' | relative_url }}" alt="Abstract geometric texture used as a second sequence frame">
    </div>
  </div>
  <figcaption><strong>Figure 4.</strong> A two-frame sequence using the same tabs and caption treatment as every other figure.</figcaption>
</figure>

## Media placeholders

GIFs use ordinary image markup. Native video and hosted embeds use these
patterns when real media is available:

```html
<figure class="figure-frame">
  <div class="figure-stage">
    <video controls preload="metadata" playsinline poster="poster.webp">
      <source src="demo.webm" type="video/webm">
      <source src="demo.mp4" type="video/mp4">
      Your browser does not support embedded video.
    </video>
  </div>
  <figcaption>Describe what changes during playback.</figcaption>
</figure>

<figure class="figure-frame">
  <div class="figure-stage">
    <div class="video-embed">
      <iframe src="https://provider.example/embed/id"
              title="Description of the video" loading="lazy"></iframe>
    </div>
  </div>
  <figcaption>Describe the hosted video.</figcaption>
</figure>
```

Every sentence, value, table entry, and figure on this page is synthetic.

[^note]: This footnote contains inline mathematics,
    $$\EE[X]=\int_{\Omega}X(\omega)\,d\PP(\omega)$$, and exists only to test
    the footnote treatment, MathJax rendering, and return link.

[^long-note]: This deliberately long footnote exists to test progressive
    disclosure rather than to communicate a result. A useful note may need
    several sentences to preserve a qualification, explain an edge case, or
    record a compact derivation without interrupting the main argument. The
    display below tests alignment inside the bounded preview:

    $$
    \begin{aligned}
      p(z\mid x) &= \frac{p(x\mid z)p(z)}{\int p(x\mid u)p(u)\,du}, \\
      \nabla_\theta \Loss(\theta)
        &= \EE_{z\sim p_\theta}\!\left[\nabla_\theta\log p_\theta(z)\,R(z)\right].
    \end{aligned}
    $$

    The
    preview should remain close to its reference, readable with a mouse or
    keyboard, and large enough for ordinary notes. When the content grows
    beyond the preview, the lower edge fades instead of ending abruptly. A
    reader can then expand the note in place and scroll within the popover if
    necessary. The complete endnote remains at the bottom of the article as a
    durable fallback for printing, link navigation, and readers without
    JavaScript. The remainder of this note is deliberately repetitive test
    material. It checks that a substantial aside does not expand the reading
    column or obscure the reference that opened it. The expanded state should
    retain a bounded height, provide its own scrolling when necessary, and
    collapse without moving the article. Links, inline emphasis, and ordinary
    punctuation should remain legible inside the preview. Keyboard focus must
    follow the same path as pointer hover, while the Escape key should close
    the note and return focus to its reference. These requirements matter more
    than the particular placeholder prose used to exercise them. A final group
    of neutral sentences makes the sample reliably exceed sixteen rendered
    lines on a typical desktop display. The text carries no claim or result.
    It exists only to make truncation, fading, expansion, and internal scrolling
    visible during design review.
