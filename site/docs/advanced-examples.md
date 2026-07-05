# Advanced Examples

This page shows advanced TikZJax features.

For basic syntax examples, see [Basic Examples](basic-examples.md).  
For all available options, see [API Reference](api-reference.md).  
For global configuration details, see [Configuration](configuration.md).

## Configuration reminder

TikZJax merges configuration in this order:

```text
default TikZJax options
< global configuration
< later partial global configuration
< local diagram configuration
```

Local options defined with `data-*` attributes affect only one diagram.

They do not erase or mutate the global `window.TikzJaxOptions` configuration.

---

## 1. Local TikZ libraries

Use `data-tikz-libraries` when a single block needs extra TikZ libraries.

Local TikZ libraries are added to the global libraries.

They do not replace them.

This example uses:

- `arrows.meta`, usually provided by the global configuration;
- `decorations.pathreplacing`, provided locally by this diagram.

```html
<script type="text/tikz" data-tikz-libraries="decorations.pathreplacing">
\begin{tikzpicture}[line width=1.2pt]
    \draw[-{Stealth[length=4mm]}, thick] (0,0) -- (4,0)
        node[midway, above] {$arrows.meta$ from global config};

    \draw[decorate, decoration={brace, amplitude=6pt}]
        (0,-0.5) -- (4,-0.5)
        node[midway, below=8pt] {$decorations.pathreplacing$ from local config};
\end{tikzpicture}
</script>
```

renders as:

<script type="text/tikz" data-tikz-libraries="decorations.pathreplacing">
\begin{tikzpicture}[line width=1.2pt]
    \draw[-{Stealth[length=4mm]}, thick] (0,0) -- (4,0)
        node[midway, above] {$arrows.meta$ from global config};

    \draw[decorate, decoration={brace, amplitude=6pt}]
        (0,-0.5) -- (4,-0.5)
        node[midway, below=8pt] {$decorations.pathreplacing$ from local config};
\end{tikzpicture}
</script>

---

## 2. Local LaTeX packages

Use `data-tex-packages` when a single block needs extra LaTeX packages.

Local TeX packages are added to the global TeX packages.

They do not replace them.

### 2.1 Add a package locally

This example adds `xcolor` locally.

It still uses globally configured packages such as `amsfonts`, which provides `\mathbb`.

```html
<script
  type="text/tikz"
  data-tex-packages='{"xcolor": ""}'
>
\begin{tikzpicture}
    \draw[green, very thick] (-2,0) -- (2,0);

    \node[above] at (0,0)
        {\textcolor{blue}{$\mathbb{R}$ is provided by global packages}};

    \node[below] at (0,0)
        {\textcolor{red}{xcolor is added locally for this diagram}};
\end{tikzpicture}
</script>
```

renders as:

<script
  type="text/tikz"
  data-tex-packages='{"xcolor": ""}'
>
\begin{tikzpicture}
    \draw[green, very thick] (-2,0) -- (2,0);

    \node[above] at (0,0)
        {\textcolor{blue}{$\mathbb{R}$ is provided by global packages}};

    \node[below] at (0,0)
        {\textcolor{red}{xcolor is added locally for this diagram}};
\end{tikzpicture}
</script>

### 2.2 Add a package with options

This example adds `xcolor` locally with the `dvipsnames` option.

This enables named colors such as `ForestGreen`, `NavyBlue`, and `BrickRed`.

It still uses globally configured packages such as `amsfonts`, which provides `\mathbb`.

```html
<script
  type="text/tikz"
  data-tex-packages='{"xcolor": "dvipsnames"}'
>
\begin{tikzpicture}
    \draw[ForestGreen, very thick] (-2,0) -- (2,0);

    \node[NavyBlue, above] at (0,0)
        {$\mathbb{R}$ is provided by global packages};

    \node[BrickRed, below] at (0,0)
        {xcolor with dvipsnames is added locally};
\end{tikzpicture}
</script>
```

renders as:

<script
  type="text/tikz"
  data-tex-packages='{"xcolor": "dvipsnames"}'
>
\begin{tikzpicture}
    \draw[ForestGreen, very thick] (-2,0) -- (2,0);

    \node[NavyBlue, above] at (0,0)
        {$\mathbb{R}$ is provided by global packages};

    \node[BrickRed, below] at (0,0)
        {xcolor with dvipsnames is added locally};
\end{tikzpicture}
</script>

!!! note
    Package options may require additional TeX runtime files.

    For example, `xcolor` with `dvipsnames` requires `dvipsnam.def.gz` to be available in `tex_files/`.

    If you deploy TikZJax from npm through jsDelivr or unpkg, the packaged runtime files are used.

    If you deploy TikZJax from a custom CDN, make sure your custom `tex_files/` directory contains the required files.

---

## 3. Local LaTeX preamble

Use `data-add-to-preamble` when a command is useful for one block only.

The local preamble is appended to the global preamble for this diagram only.

```html
<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\localR}{\mathbb{R}}\newcommand{\dd}{\,\mathrm{d}}"
>
\begin{tikzpicture}
    \node[draw, rounded corners, inner sep=6pt] {$f:\localR\to\localR$};
    \node[below=0.7cm] at (0,0) {$\displaystyle \int_0^1 x^2\dd x=\frac13$};
\end{tikzpicture}
</script>
```

renders as:

<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\localR}{\mathbb{R}}\newcommand{\dd}{\,\mathrm{d}}"
>
\begin{tikzpicture}
    \node[draw, rounded corners, inner sep=6pt] {$f:\localR\to\localR$};
    \node[below=0.7cm] at (0,0) {$\displaystyle \int_0^1 x^2\dd x=\frac13$};
\end{tikzpicture}
</script>

---

## 4. Local JSON options

For more complex local configuration, use `data-tikzjax-options`.

This is useful when a local diagram needs several options at once.

```html
<script
  type="text/tikz"
  data-tikzjax-options='{"renderTimeout":30000,"tex":{"tikzLibraries":["decorations.pathreplacing"],"texPackages":{"xcolor":""}}}'
>
\begin{tikzpicture}
    \node at (0,0) {\textcolor{blue}{$\mathbb{N} \subset \mathbb{R}$}};

    \draw[decorate, decoration={brace, amplitude=6pt}]
        (-1,-0.6) -- (1,-0.6);
\end{tikzpicture}
</script>
```

renders as:

<script
  type="text/tikz"
  data-tikzjax-options='{"renderTimeout":30000,"tex":{"tikzLibraries":["decorations.pathreplacing"],"texPackages":{"xcolor":""}}}'
>
\begin{tikzpicture}
    \node at (0,0) {\textcolor{blue}{$\mathbb{N} \subset \mathbb{R}$}};

    \draw[decorate, decoration={brace, amplitude=6pt}]
        (-1,-0.6) -- (1,-0.6);
\end{tikzpicture}
</script>

---

## 5. Reusable `tkz-tab` style macros

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

---

## 6. Larger variation table

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

---

## 7. Local broken image fallback

Use `data-broken-image-src` when one diagram should use its own error fallback image.

This option affects only the current diagram.

It does not change the global fallback image.

```html
<script
    type="text/tikz"
    data-disable-cache="true"
    data-broken-image-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='110' viewBox='0 0 220 110'%3E%3Crect width='220' height='110' rx='12' fill='%23fff7ed' stroke='%23ea580c' stroke-width='5'/%3E%3Ctext x='110' y='48' text-anchor='middle' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='%23c2410c'%3ELOCAL ERROR%3C/text%3E%3Ctext x='110' y='74' text-anchor='middle' font-family='Arial,sans-serif' font-size='13' fill='%239a3412'%3Edata-broken-image-src%3C/text%3E%3C/svg%3E"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

renders as a local error image:

<script
    type="text/tikz"
    data-disable-cache="true"
    data-broken-image-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='110' viewBox='0 0 220 110'%3E%3Crect width='220' height='110' rx='12' fill='%23fff7ed' stroke='%23ea580c' stroke-width='5'/%3E%3Ctext x='110' y='48' text-anchor='middle' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='%23c2410c'%3ELOCAL ERROR%3C/text%3E%3Ctext x='110' y='74' text-anchor='middle' font-family='Arial,sans-serif' font-size='13' fill='%239a3412'%3Edata-broken-image-src%3C/text%3E%3C/svg%3E"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>

---

## 8. Disable cache for one block

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

---

## 9. Custom render timeout for one block

Use `data-render-timeout` when one diagram needs more time than the global timeout.

```html
<script type="text/tikz" data-render-timeout="30000">
\begin{tikzpicture}
    \draw[thick] (0,0) circle (1);
    \node at (0,-1.5) {This block has a 30 second timeout};
\end{tikzpicture}
</script>
```

renders as:

<script type="text/tikz" data-render-timeout="30000">
\begin{tikzpicture}
    \draw[thick] (0,0) circle (1);
    \node at (0,-1.5) {This block has a 30 second timeout};
\end{tikzpicture}
</script>

---

## 10. Custom loader size

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

---

## 11. Partial global configuration

A partial global configuration can update one option after TikZJax has loaded.

For example, this changes only the global fallback image:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/assets/images/tikz-error.svg"
};
```

The previous global configuration remains available.

For example, this does not erase:

```text
tex.texPackages
tex.tikzLibraries
tkzTab
workerMode
renderTimeout
```

You can also use:

```js
window.TikzJaxConfigure({
    brokenImageSrc: "/assets/images/tikz-error.svg"
});
```

!!! warning

    Do not use this example as a rendered demo inside a documentation page unless you intentionally want to change the fallback image for the rest of that page.

    A partial global configuration changes `window.TikzJaxOptions` for the page.

---

## 12. Listen for rendered SVGs

TikZJax dispatches a `tikzjax-load-finished` event after an SVG has been rendered.

```js
document.addEventListener("tikzjax-load-finished", function (event) {
    const svg = event.target;

    console.log("TikZJax SVG rendered:", svg);
});
```

This is useful when you want to post-process rendered SVGs, collect metrics, or integrate TikZJax with custom frontend code.

---

## 13. Debug one block with engine logs

Use `data-show-console="true"` when you need TeX engine logs for one block.

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

When supported by the runtime, TeX logs are printed in the browser console.

---

## 14. Clear the TikZJax cache manually

TikZJax stores rendered SVGs in IndexedDB.

When debugging, you can clear the cache from the browser console:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

You can also disable cache only for one block:

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \draw (0,0) -- (2,1);
\end{tikzpicture}
</script>
```

---

## 15. Advanced runtime options

Runtime deployment options such as `assetBaseUrl`, `workerMode`, `workerUrl`, CSP settings, jsDelivr, unpkg, and same-origin deployment are documented in:

- [Configuration](configuration.md)
- [Installation on a Custom Standalone HTML Page](installation/html.md)
- [Installation on an MkDocs Site](installation/mkdocs.md)