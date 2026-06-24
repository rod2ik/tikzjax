# Advanced Examples

This page shows advanced TikZJax features.

For basic syntax examples, see [Basic Examples](basic-examples.md).
For all available options, see [API Reference](api-reference.md).

## 1. Local TikZ libraries

Use `data-tikz-libraries` when a block needs extra TikZ libraries.

This example uses `arrows.meta`, `calc`, and `positioning`.

```html
<script
  type="text/tikz"
  data-tikz-libraries="arrows.meta,calc,positioning"
>
\begin{tikzpicture}[
    node distance=2.2cm,
    every node/.style={draw, rounded corners, inner sep=5pt}
]
    \node (A) {$A$};
    \node[right=of A] (B) {$B$};
    \node[below=of $(A)!0.5!(B)$] (C) {$C$};

    \draw[-{Latex[length=4mm]}] (A) -- (B);
    \draw[-{Latex[length=4mm]}] (A) -- (C);
    \draw[-{Latex[length=4mm]}] (B) -- (C);
\end{tikzpicture}
</script>
```

renders as:

<script
  type="text/tikz"
  data-tikz-libraries="arrows.meta,calc,positioning"
>
\begin{tikzpicture}[
    node distance=2.2cm,
    every node/.style={draw, rounded corners, inner sep=5pt}
]
    \node (A) {$A$};
    \node[right=of A] (B) {$B$};
    \node[below=of $(A)!0.5!(B)$] (C) {$C$};

    \draw[-{Latex[length=4mm]}] (A) -- (B);
    \draw[-{Latex[length=4mm]}] (A) -- (C);
    \draw[-{Latex[length=4mm]}] (B) -- (C);
\end{tikzpicture}
</script>

## 2. Local LaTeX packages

Use `data-tex-packages` when a single block needs extra LaTeX packages.

```html
<script
  type="text/tikz"
  data-tex-packages='{"xcolor":"dvipsnames"}'
>
\begin{tikzpicture}
    \draw[very thick, NavyBlue] (0,0) rectangle (4,2);
    \draw[fill=Goldenrod!30, draw=Goldenrod] (1,1) circle (0.45);
    \node at (2.8,1) {$xcolor$};
\end{tikzpicture}
</script>
```

renders as:

<script
  type="text/tikz"
  data-tex-packages='{"xcolor":"dvipsnames"}'
>
\begin{tikzpicture}
    \draw[very thick, NavyBlue] (0,0) rectangle (4,2);
    \draw[fill=Goldenrod!30, draw=Goldenrod] (1,1) circle (0.45);
    \node at (2.8,1) {$xcolor$};
\end{tikzpicture}
</script>

## 3. Local LaTeX preamble

Use `data-add-to-preamble` when a command is useful for one block only.

```html
<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\R}{\mathbb{R}}\newcommand{\dd}{\,\mathrm{d}}"
>
\begin{tikzpicture}
    \node[draw, rounded corners, inner sep=6pt] {$f:\R\to\R$};
    \node[below=0.7cm] at (0,0) {$\displaystyle \int_0^1 x^2\dd x=\frac13$};
\end{tikzpicture}
</script>
```

renders as:

<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\R}{\mathbb{R}}\newcommand{\dd}{\,\mathrm{d}}"
>
\begin{tikzpicture}
    \node[draw, rounded corners, inner sep=6pt] {$f:\R\to\R$};
    \node[below=0.7cm] at (0,0) {$\displaystyle \int_0^1 x^2\dd x=\frac13$};
\end{tikzpicture}
</script>

## 4. Reusable `tkz-tab` style macros

When `tkz-tab` is enabled in the global configuration, TikZJax provides reusable `\tikzjaxTkzTab...` macros.

They make it possible to centralize table style in `tikzjax.config.js`.

````latex
```tikzjax
\begin{tikzpicture}[line width=\tikzjaxTkzTabLineWidth, font=\tikzjaxTkzTabFont]
    \tkzTabInit[
        lgt=\tikzjaxTkzTabLgt,
        espcl=\tikzjaxTkzTabEspcl,
        lw=\tikzjaxTkzTabLineWidth
    ]
        {
            $x$/\tikzjaxTkzTabVariableRowHeight,
            Sign of $f'(x)=2x-4$/\tikzjaxTkzTabSignRowHeight,
            Variations of $f(x)=x^2-4x+1$/\tikzjaxTkzTabVariationRowHeight
        }
        {$-\infty$, $2$, $+\infty$}
    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/ $+\infty$, -/ $-3$, +/ $+\infty$}
\end{tikzpicture}
```
````

renders as:

```tikzjax
\begin{tikzpicture}[line width=\tikzjaxTkzTabLineWidth, font=\tikzjaxTkzTabFont]
    \tkzTabInit[
        lgt=\tikzjaxTkzTabLgt,
        espcl=\tikzjaxTkzTabEspcl,
        lw=\tikzjaxTkzTabLineWidth
    ]
        {
            $x$/\tikzjaxTkzTabVariableRowHeight,
            Sign of $f'(x)=2x-4$/\tikzjaxTkzTabSignRowHeight,
            Variations of $f(x)=x^2-4x+1$/\tikzjaxTkzTabVariationRowHeight
        }
        {$-\infty$, $2$, $+\infty$}
    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/ $+\infty$, -/ $-3$, +/ $+\infty$}
\end{tikzpicture}
```

## 5. Larger variation table

This example shows a larger table while still using the global `tkzTab` style macros.

````latex
```tikzjax
\begin{tikzpicture}[line width=\tikzjaxTkzTabLineWidth, font=\tikzjaxTkzTabFont]
    \tkzTabInit[
        lgt=\tikzjaxTkzTabLgt,
        espcl=2.6,
        lw=\tikzjaxTkzTabLineWidth
    ]
        {
            $x$/\tikzjaxTkzTabVariableRowHeight,
            $f'(x)$/\tikzjaxTkzTabSignRowHeight,
            $f(x)$/\tikzjaxTkzTabVariationRowHeight
        }
        {$-\infty$, $-1$, $0$, $1$, $+\infty$}
    \tkzTabLine{,+,z,-,z,-,z,+,}
    \tkzTabVar{-/ $-\infty$, +/ $3$, R/, -/ $-1$, +/ $+\infty$}
\end{tikzpicture}
```
````

renders as:

```tikzjax
\begin{tikzpicture}[line width=\tikzjaxTkzTabLineWidth, font=\tikzjaxTkzTabFont]
    \tkzTabInit[
        lgt=\tikzjaxTkzTabLgt,
        espcl=2.6,
        lw=\tikzjaxTkzTabLineWidth
    ]
        {
            $x$/\tikzjaxTkzTabVariableRowHeight,
            $f'(x)$/\tikzjaxTkzTabSignRowHeight,
            $f(x)$/\tikzjaxTkzTabVariationRowHeight
        }
        {$-\infty$, $-1$, $0$, $1$, $+\infty$}
    \tkzTabLine{,+,z,-,z,-,z,+,}
    \tkzTabVar{-/ $-\infty$, +/ $3$, R/, -/ $-1$, +/ $+\infty$}
\end{tikzpicture}
```

## 6. Disable cache for one block

Use `data-disable-cache="true"` while debugging a specific figure.

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \draw[thick] (0,0) rectangle (5,2);
    \node at (2.5,1) {This block bypasses cache};
\end{tikzpicture}
</script>
```

renders as:

<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \draw[thick] (0,0) rectangle (5,2);
    \node at (2.5,1) {This block bypasses cache};
\end{tikzpicture}
</script>

## 7. Custom loader size

Use `data-width` and `data-height` to reserve a custom loader size before rendering.

```html
<script
  type="text/tikz"
  data-width="180"
  data-height="90"
>
\begin{tikzpicture}
    \draw[thick] (0,0) rectangle (4,2);
    \node at (2,1) {Custom loader size};
\end{tikzpicture}
</script>
```

renders as:

<script
  type="text/tikz"
  data-width="180"
  data-height="90"
>
\begin{tikzpicture}
    \draw[thick] (0,0) rectangle (4,2);
    \node at (2,1) {Custom loader size};
\end{tikzpicture}
</script>

## 8. Accessible SVG label

Use `data-aria-label` when the generated SVG needs an explicit accessible label.

```html
<script
  type="text/tikz"
  data-aria-label="Graph of a line in an orthonormal coordinate system"
>
\begin{tikzpicture}
    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
    \draw[thick] (0,0) -- (3,2);
\end{tikzpicture}
</script>
```

renders as:

<script
  type="text/tikz"
  data-aria-label="Graph of a line in an orthonormal coordinate system"
>
\begin{tikzpicture}
    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
    \draw[thick] (0,0) -- (3,2);
\end{tikzpicture}
</script>

## 9. Listen for rendered SVGs

TikZJax dispatches a `tikzjax-load-finished` event after a SVG has been rendered.

```js
document.addEventListener("tikzjax-load-finished", function (event) {
    const svg = event.target;

    console.log("TikZJax SVG rendered:", svg);
});
```

This is useful when you want to post-process rendered SVGs, collect metrics, or integrate TikZJax with custom frontend code.

## 10. Debug one block with engine logs

Use `data-show-console="true"` when you need engine-side logs for one block.

```html
<script type="text/tikz" data-show-console="true">
\begin{tikzpicture}
    \draw[thick] (0,0) circle (1);
\end{tikzpicture}
</script>
```

renders as:

<script type="text/tikz" data-show-console="true">
\begin{tikzpicture}
    \draw[thick] (0,0) circle (1);
\end{tikzpicture}
</script>
