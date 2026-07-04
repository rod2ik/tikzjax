# Advanced Examples

This page shows advanced TikZJax features.

For basic syntax examples, see [Basic Examples](basic-examples.md).
For all available options, see [API Reference](api-reference.md).

## 1. Local TikZ libraries

Use `data-tikz-libraries` when a block needs extra TikZ libraries.

This example uses `arrows.meta`, `calc`, and `positioning`.

```html
<script type="text/tikz" data-tikz-libraries="arrows.meta,calc,positioning">
\begin{tikzpicture}[node distance=2.2cm, every node/.style={draw, rounded corners, inner sep=5pt}]
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

<script type="text/tikz" data-tikz-libraries="arrows.meta,calc,positioning">
\begin{tikzpicture}[node distance=2.2cm, every node/.style={draw, rounded corners, inner sep=5pt}]
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
<script type="text/tikz" data-tex-packages='{"xcolor":"dvipsnames"}'>
\begin{tikzpicture}
    \draw[very thick, NavyBlue] (0,0) rectangle (4,2);
    \draw[fill=Goldenrod!30, draw=Goldenrod] (1,1) circle (0.45);
    \node at (2.8,1) {$xcolor$};
\end{tikzpicture}
</script>
```

renders as:

<script type="text/tikz" data-tex-packages='{"xcolor":"dvipsnames"}'>
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

## 8. Listen for rendered SVGs

TikZJax dispatches a `tikzjax-load-finished` event after an SVG has been rendered.

```js
document.addEventListener("tikzjax-load-finished", function (event) {
    const svg = event.target;

    console.log("TikZJax SVG rendered:", svg);
});
```

This is useful when you want to post-process rendered SVGs, collect metrics, or integrate TikZJax with custom frontend code.

## 9. Debug one block with engine logs

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

## 10. Custom broken image

Use `brokenImageSrc` to customize the fallback image displayed when rendering fails.

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@{{ tikzjax_version }}/dist/assets/broken-image.svg"
};
```

You can also point to your own image:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/assets/images/tikz-error.svg"
};
```

## 11. Longer render timeout and automatic retry

Some complex diagrams may take longer to render. You can increase the timeout and retry once after a failure.

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true
};
```

The same options may also be placed under `tex`:

```js
window.TikzJaxOptions = {
    tex: {
        renderTimeout: 30000,
        maxRetries: 1,
        restartWorkerOnFail: true
    }
};
```

## 12. Clear the TikZJax cache manually

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

## 13. Explicit jsDelivr runtime base URL

In normal jsDelivr usage, TikZJax automatically resolves runtime files from the same `dist/` directory as `tikzjax.min.js`.

This explicit configuration is equivalent to the default behavior:

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@{{ tikzjax_version }}/dist",
    workerMode: "auto"
};
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@{{ tikzjax_version }}/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@{{ tikzjax_version }}/dist/tikzjax.min.js"></script>
```

Runtime files are loaded from:

```text
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@{{ tikzjax_version }}/dist/run-tex.js
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@{{ tikzjax_version }}/dist/tex.wasm.gz
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@{{ tikzjax_version }}/dist/core.dump.gz
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@{{ tikzjax_version }}/dist/tex_files/
```

## 14. Explicit unpkg runtime base URL

The same setup can be used with unpkg.

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "https://unpkg.com/@rod2ik/tikzjax@{{ tikzjax_version }}/dist",
    workerMode: "auto"
};
</script>

<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@{{ tikzjax_version }}/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@{{ tikzjax_version }}/dist/tikzjax.min.js"></script>
```

## 15. Same-origin deployment with direct Worker mode

For strict deployments, serve all TikZJax files from your own domain and use `workerMode: "direct"`.

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
</script>

<link rel="stylesheet" href="/vendor/tikzjax/fonts.min.css">
<script src="/vendor/tikzjax/tikzjax.min.js"></script>
```

Your site should expose:

```text
/vendor/tikzjax/tikzjax.min.js
/vendor/tikzjax/run-tex.js
/vendor/tikzjax/fonts.min.css
/vendor/tikzjax/tex.wasm.gz
/vendor/tikzjax/core.dump.gz
/vendor/tikzjax/tex_files/
/vendor/tikzjax/assets/broken-image.svg
```

Use this mode when your Content Security Policy does not allow `blob:` workers.

## 16. Custom worker URL

Use `workerUrl` if `run-tex.js` is not located directly inside `assetBaseUrl`.

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerUrl: "/vendor/tikzjax/workers/run-tex.js",
    workerMode: "direct"
};
```

Nested form:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    worker: {
        url: "/vendor/tikzjax/workers/run-tex.js",
        mode: "direct"
    }
};
```

Root-level `workerUrl` and `workerMode` take precedence over nested `worker.url` and `worker.mode`.

## 17. Worker modes

TikZJax supports three worker modes.

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

| Mode       | Description                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| `"auto"`   | Uses a direct Worker for same-origin files and a Blob Worker for cross-origin files. |
| `"blob"`   | Always creates a Blob Worker. Useful for CDN-hosted worker scripts.                  |
| `"direct"` | Always creates a direct Worker. Best for same-origin installations.                  |

Recommended choices:

| Situation                                    | Recommended mode                  |
| -------------------------------------------- | --------------------------------- |
| jsDelivr or unpkg on a normal page           | `"auto"`                          |
| CDN script with CSP allowing `blob:` workers | `"auto"` or `"blob"`              |
| Fully local same-origin deployment           | `"direct"`                        |
| Strict CSP without `blob:` workers           | `"direct"` with same-origin files |

## 18. CSP example for CDN usage

For jsDelivr or unpkg with Blob Worker support, a typical CSP should allow the CDN, WebAssembly, and Blob Workers.

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'wasm-unsafe-eval';
  style-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'unsafe-inline';
  worker-src 'self' blob:;
  connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
  img-src 'self' https://cdn.jsdelivr.net https://unpkg.com data: blob:;
  font-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
  object-src 'none';
  base-uri 'self';
```

## 19. CSP example for same-origin usage

For same-origin files with direct Worker mode:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  worker-src 'self';
  connect-src 'self';
  img-src 'self' data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
```

Use this together with:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```
