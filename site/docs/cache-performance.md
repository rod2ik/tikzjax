# Cache and performance

TikZJax uses a browser-side cache to avoid recomputing an already generated render.

## IndexedDB cache

Generated SVGs are stored in IndexedDB, in the database `TikzJax` and in the object store `svgImages`.

The cache key is built from the final TikZ dataset and the TikZ source code. If the code or the local options change, the render is recomputed.

## Disable cache locally

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
\end{tikzpicture}
</script>
```

This is useful during development or when testing a change in the rendering engine.

## Render timeout

By default, TikZJax waits up to `15000` ms.

```js
window.TikzJaxOptions = {
    renderTimeout: 10000
};
```

If the timeout is exceeded, the render is considered failed and the error image is displayed.

## Retries

```js
window.TikzJaxOptions = {
    maxRetries: 1,
    restartWorkerOnFail: true
};
```

With `maxRetries: 1`, TikZJax performs the initial render attempt and then one retry if it fails.

## Worker restart

```js
window.TikzJaxOptions = {
    restartWorkerOnFail: true
};
```

When this option is enabled, TikZJax recreates the TeX worker after a failure.

## Performance tips

- Enable globally only the packages you actually need.
- Avoid very heavy preambles in every block.
- Keep the cache enabled by default.
- Reserve `data-disable-cache="true"` for development.
- Prefer a global `tkz-tab` configuration instead of repeating the same definitions in every block.
- Avoid very large TikZ drawings on a single page.
