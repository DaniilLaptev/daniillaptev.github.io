---
layout: post
title: "Adam vs. SGD, Briefly"
subtitle: "Why adaptive steps help — and when plain SGD still wins."
summary: "A compact comparison of SGD and Adam: update rules, adaptive scaling, convergence behavior, and practical defaults."
thumbnail: /assets/images/accuracy-curve.svg
date: 2026-06-22
tags: [optimization, deep-learning]
---

Both **SGD** and **Adam** descend the same loss $$\Loss(\theta)$$ using the
stochastic gradient $$g_t = \grad_\theta \Loss(\theta_t)$$.<span class="sidenote">Adam is short for *adaptive moment estimation* (Kingma & Ba, 2015). This kind of aside is a **sidenote** — it sits in the right margin on wide screens and folds inline on narrow ones.</span>
They differ only in how they turn that gradient into a step.

## The update rules

Vanilla SGD takes a fixed-size step downhill:

$$
\begin{equation}
  \theta_{t+1} = \theta_t - \eta\, g_t .
\end{equation}
$$

Adam keeps running estimates of the gradient's first moment $$m_t$$ (a momentum
term) and second moment $$v_t$$ (a per-coordinate scale), corrects their bias,
and divides one by the other:

$$
\begin{align}
  m_t &= \beta_1 m_{t-1} + (1-\beta_1)\, g_t, &
  \hat{m}_t &= \frac{m_t}{1-\beta_1^{\,t}}, \\
  v_t &= \beta_2 v_{t-1} + (1-\beta_2)\, g_t^2, &
  \hat{v}_t &= \frac{v_t}{1-\beta_2^{\,t}}, \\
  \theta_{t+1} &= \theta_t - \eta\, \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \eps}. &&
\end{align}
$$

<div class="callout key" markdown="1">
<span class="callout-title">The key idea</span>
The $$1/\sqrt{\hat{v}_t}$$ factor gives every parameter its **own** effective
learning rate: directions with large, noisy gradients get damped; flat
directions get amplified. SGD applies the single scalar $$\eta$$ to all of them.
</div>

## Convergence, side by side

On an ill-conditioned objective Adam typically races ahead early, while
well-tuned SGD (with momentum) often **generalizes a touch better** and lands at
a flatter minimum. Toggle the views:

<div class="plot-switcher">
  <div class="plot-option" data-label="Loss curves">
    <div class="iplot" style="height:380px">
<script type="application/json">
{
  "data": [
    {"type":"scatter","mode":"lines","name":"SGD + momentum",
     "x":[0,1,2,3,4,5,6,7,8,9,10],
     "y":[5.0,4.2,3.5,2.9,2.4,2.0,1.7,1.5,1.35,1.25,1.2],
     "line":{"color":"#8bcac0","width":3}},
    {"type":"scatter","mode":"lines","name":"Adam",
     "x":[0,1,2,3,4,5,6,7,8,9,10],
     "y":[5.0,3.1,2.0,1.5,1.25,1.15,1.12,1.18,1.22,1.25,1.27],
     "line":{"color":"#b9addf","width":3}}
  ],
  "layout": {"legend":{"orientation":"h"},
             "xaxis":{"title":"epoch"},"yaxis":{"title":"validation loss"}}
}
</script>
    </div>
  </div>
  <figure class="plot-option" data-label="Accuracy">
    <img src="{{ '/assets/images/accuracy-curve.svg' | relative_url }}" alt="Accuracy comparison">
    <figcaption>Adam (faster early) vs. SGD (catching up, slightly higher final).</figcaption>
  </figure>
</div>

## When to reach for which

| Situation | Better default |
|-----------|----------------|
| Transformers, sparse gradients, fast prototyping | **AdamW** |
| CNNs / vision, chasing best generalization | **SGD + momentum** |
| You don't want to tune a schedule | **Adam** |
| Compute-rich, want the flattest minimum | **SGD + momentum** |

> Rule of thumb: start with **AdamW** to get moving, then try **SGD + momentum**
> with a cosine schedule if you need the last point of accuracy.
