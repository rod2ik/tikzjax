# Cache and Performance

TikZJax uses a browser-side cache to avoid recomputing diagrams that have already been rendered.

This improves performance when:

- the same TikZ block appears several times;
- the user reloads a page;
- an MkDocs page contains many diagrams;
- a `tkz-tab` table is rendered more than once.

## 1. IndexedDB cache

Generated SVGs are stored in IndexedDB.

TikZJax uses:

```text
Database: TikzJax
Object store: svgImages
```

The cache key is built from the effective rendering input, including:

- the TikZ source code;
- the effective dataset;
- merged TeX packages;
- merged TikZ libraries;
- global and local preamble content;
- relevant local rendering options.

If the source code or relevant options change, the render is recomputed.

For example, changing any of these may trigger a new render:

- the TikZ source;
- `data-tex-packages`;
- `data-tikz-libraries`;
- `data-add-to-preamble`;
- `data-render-timeout`;
- `data-max-retries`;
- `data-restart-worker-on-fail`;
- effective global TeX options.

## 2. Configuration and cache

TikZJax merges configuration in this order:

```text
default TikZJax options
< global configuration
< later partial global configuration
< local diagram configuration
```

The final merged options are part of what TikZJax uses to decide whether a diagram can be reused from cache.

This means that if you change important global rendering options, diagrams may be rendered again.

Example global configuration:

```js
window.TikzJaxOptions = {
    renderTimeout: 10000,
    maxRetries: 0,
    restartWorkerOnFail: true,

    tex: {
        texPackages: {
            amsmath: "",
            amsfonts: "",
            amssymb: "",
            "tkz-tab": ""
        },
        tikzLibraries: [
            "arrows.meta",
            "calc",
            "positioning"
        ]
    }
};
```

A later partial global configuration can update one option without erasing the previous configuration:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

After TikZJax has loaded, this changes only `renderTimeout`.

It does not erase `tex.texPackages`, `tex.tikzLibraries`, or `tkzTab`.

## 3. Disable cache locally

Use `data-disable-cache="true"` to bypass the cache for one block.

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
\end{tikzpicture}
</script>
```

This is useful during development, especially when testing:

- a change in the rendering engine;
- a change in the generated TeX preamble;
- a local package or TikZ library;
- a custom fallback image;
- a timeout or retry configuration.

For normal documentation pages, keep the cache enabled.

## 4. Clear the cache manually

During development, you may want to clear the whole TikZJax cache.

Open the browser console and run:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

This deletes all cached SVGs and reloads the page.

## 5. Render timeout

By default, TikZJax waits up to `15000` ms for a render.

You can change the timeout globally:

```js
window.TikzJaxOptions = {
    renderTimeout: 10000
};
```

You can also place it under `tex`:

```js
window.TikzJaxOptions = {
    tex: {
        renderTimeout: 10000
    }
};
```

Root-level values take precedence over nested `tex` values.

```js
window.TikzJaxOptions = {
    renderTimeout: 10000,

    tex: {
        renderTimeout: 30000
    }
};
```

In this example, `10000` wins.

If the timeout is exceeded, the render is considered failed and the fallback error image is displayed.

## 6. Local render timeout

A single diagram can override the global timeout.

```html
<script type="text/tikz" data-render-timeout="30000">
\begin{tikzpicture}
    \draw (0,0) -- (5,0);
\end{tikzpicture}
</script>
```

This diagram gets a 30-second timeout.

Other diagrams keep the global timeout.

## 7. Retries

Use `maxRetries` to retry a failed render.

```js
window.TikzJaxOptions = {
    maxRetries: 1,
    restartWorkerOnFail: true
};
```

With `maxRetries: 1`, TikZJax performs:

- one initial render attempt;
- one retry if the first attempt fails.

For most documentation sites, either of these configurations is reasonable:

```js
window.TikzJaxOptions = {
    renderTimeout: 10000,
    maxRetries: 0,
    restartWorkerOnFail: true
};
```

or:

```js
window.TikzJaxOptions = {
    renderTimeout: 15000,
    maxRetries: 1,
    restartWorkerOnFail: true
};
```

Use `maxRetries: 0` when you prefer fast failure and clear fallback behavior.

Use `maxRetries: 1` when diagrams are sometimes slow or the worker occasionally fails.

## 8. Local retries

A single diagram can override the retry behavior.

```html
<script
  type="text/tikz"
  data-render-timeout="30000"
  data-max-retries="1"
  data-restart-worker-on-fail="true"
>
\begin{tikzpicture}
    \draw (0,0) -- (5,0);
\end{tikzpicture}
</script>
```

These local options affect only the current diagram.

They do not mutate `window.TikzJaxOptions`.

## 9. Worker restart

Use `restartWorkerOnFail` to recreate the TeX worker after a rendering failure.

```js
window.TikzJaxOptions = {
    restartWorkerOnFail: true
};
```

This can help after:

- a TeX engine failure;
- a timeout;
- a corrupted worker state;
- a failed WebAssembly execution.

You can also configure this locally:

```html
<script
  type="text/tikz"
  data-restart-worker-on-fail="true"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

## 10. Worker mode and performance

TikZJax renders diagrams inside a Web Worker.

The worker is loaded from `run-tex.js`, which is part of the package.

When using jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

TikZJax automatically resolves runtime files from the same `dist/` directory.

Runtime files include:

```text
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

The default worker mode is:

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

Available modes:

| Mode | Description |
| --- | --- |
| `"auto"` | Uses a direct Worker for same-origin files and a Blob Worker for cross-origin files. |
| `"blob"` | Always creates a Blob Worker. Useful for CDN-hosted worker scripts. |
| `"direct"` | Always creates a direct Worker. Best for same-origin deployments. |

For CDN usage, keep:

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

For same-origin deployments, use:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

Root-level `workerMode` and `workerUrl` take precedence over nested `worker.mode` and `worker.url`.

## 11. `assetBaseUrl`

Use `assetBaseUrl` when the runtime assets are not located next to `tikzjax.min.js`.

Example with jsDelivr:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist"
};
```

Example with unpkg:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist"
};
```

Example with same-origin files:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

In most CDN installations, you do not need to set `assetBaseUrl` manually.

## 12. Sequential rendering

TikZJax renders detected diagrams through a queue.

This avoids running several TeX WebAssembly compilations at the same time in the same worker.

Sequential rendering helps keep large documentation pages stable, especially when they contain:

- many TikZ figures;
- several `tkz-tab` tables;
- diagrams inside MkDocs content tabs;
- dynamically inserted content.

The cache remains useful because diagrams that have already been rendered can be reused instead of being sent back to the worker.

## 13. Recommended performance configuration

For most documentation sites:

```js
window.TikzJaxOptions = {
    renderTimeout: 10000,
    maxRetries: 0,
    restartWorkerOnFail: true,

    tex: {
        texPackages: {
            amsmath: "",
            amsfonts: "",
            amssymb: "",
            "tkz-tab": ""
        },
        tikzLibraries: [
            "arrows.meta",
            "calc",
            "positioning"
        ]
    }
};
```

For sites with many heavy diagrams, you may prefer:

```js
window.TikzJaxOptions = {
    renderTimeout: 15000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    tex: {
        texPackages: {
            amsmath: "",
            amsfonts: "",
            amssymb: "",
            "tkz-tab": ""
        },
        tikzLibraries: [
            "arrows.meta",
            "calc",
            "positioning"
        ]
    }
};
```

For a strict same-origin setup:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct",

    renderTimeout: 10000,
    maxRetries: 0,
    restartWorkerOnFail: true
};
```

## 14. Performance tips

- Enable globally only the LaTeX packages you actually need.
- Enable globally only the TikZ libraries you actually need.
- Add rare packages locally with `data-tex-packages`.
- Add rare TikZ libraries locally with `data-tikz-libraries`.
- Avoid very heavy preambles in every block.
- Keep the cache enabled by default.
- Use `data-disable-cache="true"` only during development.
- Prefer a global `tkz-tab` configuration instead of repeating the same definitions in every block.
- Avoid very large TikZ drawings on a single page.
- Split very large documentation pages when they contain many diagrams.
- Use the minified CDN files in production: `fonts.min.css` and `tikzjax.min.js`.
- Use non-minified files only while debugging: `fonts.css` and `tikzjax.js`.

## 15. Troubleshooting

### A diagram is not updated after editing

Clear the cache manually:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

Or disable cache for the block you are testing:

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
\end{tikzpicture}
</script>
```

### Rendering is slow

Check whether the page contains many heavy diagrams.

Also check whether the global configuration loads more packages or TikZ libraries than needed.

Move rare packages or libraries to local diagram attributes when possible:

```html
<script
  type="text/tikz"
  data-tex-packages='{"xcolor":""}'
  data-tikz-libraries="decorations.pathreplacing"
>
\begin{tikzpicture}
    \draw[decorate, decoration={brace, amplitude=6pt}] (0,0) -- (4,0);
\end{tikzpicture}
</script>
```

### Rendering fails after a timeout

Increase `renderTimeout` globally:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

Or locally for one block:

```html
<script type="text/tikz" data-render-timeout="30000">
\begin{tikzpicture}
    \draw (0,0) -- (5,0);
\end{tikzpicture}
</script>
```

You can also enable one retry:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true
};
```

### Worker loading fails

Check that the runtime files are reachable.

For CDN usage, they are loaded from the same `dist/` directory as `tikzjax.min.js`.

For same-origin usage, make sure these files exist:

```text
/vendor/tikzjax/tikzjax.min.js
/vendor/tikzjax/run-tex.js
/vendor/tikzjax/fonts.min.css
/vendor/tikzjax/tex.wasm.gz
/vendor/tikzjax/core.dump.gz
/vendor/tikzjax/tex_files/
/vendor/tikzjax/assets/broken-image.svg
```

If you use `workerMode: "direct"`, the worker file must be served from the same origin as the page.

### CSP blocks the worker

For CDN usage, make sure your CSP allows Blob Workers:

```http
worker-src 'self' blob:;
connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
script-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'wasm-unsafe-eval';
```

For same-origin usage with `workerMode: "direct"`:

```http
worker-src 'self';
connect-src 'self';
script-src 'self' 'wasm-unsafe-eval';
```