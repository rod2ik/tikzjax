# Troubleshooting

This page lists the most common TikZJax issues and fixes.

## 1. Nothing is displayed

First check the loading order.

The configuration file is optional, but when it exists, it must be loaded before `tikzjax.min.js`.

Recommended jsDelivr loading:

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Equivalent unpkg loading:

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Then open the browser DevTools:

* check the **Console** for JavaScript errors;
* check the **Network** tab for missing or blocked files;
* make sure `tikzjax.min.js`, `run-tex.js`, `tex.wasm.gz`, and `core.dump.gz` are loaded;
* make sure `tex_files/` is reachable;
* check that no CORS or CSP policy blocks the resources.

If you use MkDocs, make sure the CDN references are loaded in `overrides/main.html`, or that the final generated HTML loads them in the correct order.

## 2. The fallback error image is displayed

This means TikZJax detected the block, but the TeX rendering failed.

Common causes include:

* incomplete TikZ code;
* `\begin{tikzpicture}` without `\end{tikzpicture}`;
* missing LaTeX package;
* missing TikZ library;
* unavailable LaTeX command;
* render timeout;
* worker failure.

Example of intentionally invalid code:

````latex
```tikzjax
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
```
````

This block is missing `\end{tikzpicture}`.

## 3. A TikZ library is missing

Add the library globally in `tikzjax.config.js`:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: ["arrows.meta", "calc", "positioning"]
    }
};
```

Or add it locally on one block:

```html
<script type="text/tikz" data-tikz-libraries="arrows.meta,calc">
\begin{tikzpicture}
    ...
\end{tikzpicture}
</script>
```

## 4. A LaTeX package is missing

Add the package to `tex.texPackages`.

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsmath: "",
            "tkz-tab": "",
            xcolor: "dvipsnames"
        }
    }
};
```

Package values are package options. Use an empty string when the package has no option.

## 5. A custom LaTeX command is missing

Add it to the global preamble:

```js
window.TikzJaxOptions = {
    tex: {
        addToPreamble: String.raw`
\newcommand{\R}{\mathbb{R}}
`
    }
};
```

Or locally:

```html
<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\R}{\mathbb{R}}"
>
\begin{tikzpicture}
    \node {$\R$};
\end{tikzpicture}
</script>
```

## 6. MkDocs code blocks are not rendered

The `<script type="text/tikz">` syntax works directly in Markdown.

For fenced code blocks, make sure `pymdownx.superfences` is configured.

```yaml
markdown_extensions:
  - pymdownx.superfences:
      custom_fences:
        - name: tikzjax
          class: language-tikzjax
          format: !!python/name:pymdownx.superfences.fence_code_format
```

Then use:

````latex
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

The generated block should use one of these classes:

* `language-tikzjax`;
* `tikzjax`;
* `language-tikz`;
* `tikz`.

## 7. Blocks inside admonitions or tabs are not rendered

TikZJax observes the DOM and should detect blocks inserted later, including blocks inside Material admonitions or content tabs.

If a block is still not rendered:

* check that the Markdown indentation is valid;
* check that every line inside `!!!`, `???`, and `===` blocks is indented correctly;
* check that `pymdownx.superfences` is configured for `tikzjax` code blocks;
* try the equivalent `<script type="text/tikz">` syntax;
* open the Console and check for JavaScript errors.

For example:

````markdown
!!! success
    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) circle (1);
    \end{tikzpicture}
    ```
````

And inside a Content Tab:

````markdown
=== "Solution"
    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) circle (1);
    \end{tikzpicture}
    ```
````

## 8. Drawings do not change after editing

TikZJax uses browser-side cache through IndexedDB.

Generated SVGs are stored in:

```text
Database: TikzJax
Object store: svgImages
```

During debugging, disable cache locally:

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    ...
\end{tikzpicture}
</script>
```

You can also clear the cache from the browser console:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

## 9. Rendering takes too long

Complex figures or large `tkz-tab` tables may need more time.

Increase the timeout:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

You can also allow one retry:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true
};
```

## 10. Worker files are not loaded

TikZJax needs runtime files in addition to `tikzjax.min.js`.

Required runtime files include:

```text
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

When using jsDelivr or unpkg, TikZJax normally resolves these files automatically from the same `dist/` directory as `tikzjax.min.js`.

If needed, set `assetBaseUrl` explicitly.

jsDelivr:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist"
};
```

unpkg:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist"
};
```

Same-origin deployment:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

## 11. Worker mode issue

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

If CDN usage fails because of a strict CSP, either allow Blob Workers or serve TikZJax from the same origin and use:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

## 12. CSP blocks TikZJax

If your site has a Content Security Policy, make sure it allows the required resources.

For jsDelivr or unpkg with Blob Worker support:

```http
script-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'wasm-unsafe-eval';
style-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'unsafe-inline';
worker-src 'self' blob:;
connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
img-src 'self' https://cdn.jsdelivr.net https://unpkg.com data: blob:;
font-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
```

For same-origin files with direct Worker mode:

```http
script-src 'self' 'wasm-unsafe-eval';
style-src 'self' 'unsafe-inline';
worker-src 'self';
connect-src 'self';
img-src 'self' data:;
font-src 'self';
```

## 13. Dark mode renders colors poorly

TikZJax can adapt common black, white, and text colors in generated SVGs.

For highly colored figures, define colors explicitly in the TikZ code, or provide separate light and dark variants when needed.

Check your theme configuration:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default",
        fallbackTheme: "light"
    }
};
```

## 14. The fallback image path is wrong

If the error image itself is missing, set `brokenImageSrc`.

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

Equivalent unpkg path:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

## 15. Enable engine logs

For debugging, enable console output on a block:

```html
<script type="text/tikz" data-show-console="true">
\begin{tikzpicture}
    ...
\end{tikzpicture}
</script>
```

This enables engine-side console output when available.

## 16. Quick checklist

1. `tikzjax.config.js` is loaded before `tikzjax.min.js`.
2. `fonts.min.css` is loaded.
3. `tikzjax.min.js` is loaded.
4. `run-tex.js`, `tex.wasm.gz`, `core.dump.gz`, and `tex_files/` are reachable.
5. No CORS or CSP policy blocks the CDN files.
6. `worker-src` allows `blob:` for CDN Blob Worker mode.
7. The TikZ code contains a complete `tikzpicture` environment.
8. Required packages and TikZ libraries are configured.
9. MkDocs `tikzjax` code blocks are configured with `pymdownx.superfences`.
10. Markdown indentation is correct inside `!!!`, `???`, and `===` blocks.
11. Cache is disabled while debugging, or IndexedDB has been cleared.
12. The browser Console and Network tabs have been checked.
