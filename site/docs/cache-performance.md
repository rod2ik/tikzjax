# Cache and Performance

TikZJax uses a browser-side cache to avoid recomputing diagrams that have already been rendered.

This improves performance when:

* the same TikZ block appears several times;
* the user reloads a page;
* an MkDocs page contains many diagrams;
* a `tkz-tab` table is rendered more than once.

## 1. IndexedDB cache

Generated SVGs are stored in IndexedDB.

TikZJax uses:

```text
Database: TikzJax
Object store: svgImages
```

The cache key is built from:

* the final TikZ dataset;
* the TikZ source code;
* local rendering options.

If the source code or local options change, the render is recomputed.

## 2. Disable cache locally

Use `data-disable-cache="true"` to bypass the cache for one block.

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
\end{tikzpicture}
</script>
```

This is useful during development, especially when testing a change in the rendering engine or in the generated TeX preamble.

For normal documentation pages, keep the cache enabled.

## 3. Clear the cache manually

During development, you may want to clear the whole TikZJax cache.

Open the browser console and run:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

This deletes all cached SVGs and reloads the page.

## 4. Render timeout

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

If the timeout is exceeded, the render is considered failed and the fallback error image is displayed.

## 5. Retries

Use `maxRetries` to retry a failed render.

```js
window.TikzJaxOptions = {
    maxRetries: 1,
    restartWorkerOnFail: true
};
```

With `maxRetries: 1`, TikZJax performs:

* one initial render attempt;
* one retry if the first attempt fails.

For most sites, `maxRetries: 1` is enough.

## 6. Worker restart

Use `restartWorkerOnFail` to recreate the TeX worker after a rendering failure.

```js
window.TikzJaxOptions = {
    restartWorkerOnFail: true
};
```

This can help after:

* a TeX engine failure;
* a timeout;
* a corrupted worker state;
* a failed WebAssembly execution.

## 7. Worker mode and performance

TikZJax renders diagrams inside a Web Worker.

The worker is loaded from `run-tex.js`, which is part of the package.

When using jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
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

| Mode       | Description                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| `"auto"`   | Uses a direct Worker for same-origin files and a Blob Worker for cross-origin files. |
| `"blob"`   | Always creates a Blob Worker. Useful for CDN-hosted worker scripts.                  |
| `"direct"` | Always creates a direct Worker. Best for same-origin deployments.                    |

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

## 8. `assetBaseUrl`

Use `assetBaseUrl` when the runtime assets are not located next to `tikzjax.min.js`.

Example with jsDelivr:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist"
};
```

Example with unpkg:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "https://unpkg.com/@rod2ik/tikzjax@1.1.7/dist"
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

## 9. Recommended performance configuration

For most documentation sites:

```js
window.TikzJaxOptions = {
    renderTimeout: 15000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    tex: {
        texPackages: {
            amsmath: "",
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

    renderTimeout: 15000,
    maxRetries: 1,
    restartWorkerOnFail: true
};
```

## 10. Performance tips

* Enable globally only the LaTeX packages you actually need.
* Enable globally only the TikZ libraries you actually need.
* Avoid very heavy preambles in every block.
* Keep the cache enabled by default.
* Use `data-disable-cache="true"` only during development.
* Prefer a global `tkz-tab` configuration instead of repeating the same definitions in every block.
* Avoid very large TikZ drawings on a single page.
* Split very large documentation pages when they contain many diagrams.
* Use the minified CDN files in production: `fonts.min.css` and `tikzjax.min.js`.
* Use non-minified files only while debugging: `fonts.css` and `tikzjax.js`.

## 11. Troubleshooting

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

### Rendering fails after a timeout

Increase `renderTimeout`:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
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
