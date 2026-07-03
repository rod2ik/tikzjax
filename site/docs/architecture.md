# Architecture

This page describes how TikZJax works internally.

## 1. Overview

Rendering follows this path:

```text
TikZ block in the page
        ↓
detected by tikzjax.min.js
        ↓
dataset, options, packages, libraries, and preamble preparation
        ↓
cache lookup in IndexedDB
        ↓
run-tex.js worker
        ↓
TeX WebAssembly engine
        ↓
DVI file
        ↓
dvi2html conversion
        ↓
SVG injected into the page
        ↓
theme adaptation and final render event
```

TikZJax runs TeX in the browser. It does not require a server-side LaTeX installation.

## 2. Main runtime files

The package includes the following runtime files:

```text
dist/tikzjax.js
dist/tikzjax.min.js
dist/run-tex.js
dist/run-tex.min.js
dist/fonts.css
dist/fonts.min.css
dist/tex.wasm.gz
dist/core.dump.gz
dist/tex_files/
dist/assets/broken-image.svg
```

For production, the recommended files are:

```text
fonts.min.css
tikzjax.min.js
```

For debugging, the non-minified files can be useful:

```text
fonts.css
tikzjax.js
```

## 3. Role of `tikzjax.min.js`

The main browser-side script is built from the source code in `src/index.js`.

It is responsible for:

* detecting TikZ sources in the page;
* detecting `<script type="text/tikz">` blocks;
* detecting MkDocs fenced `tikzjax` code blocks;
* replacing each source with a temporary loader;
* building the final rendering options;
* merging global options and local `data-*` attributes;
* managing the IndexedDB cache;
* creating the TeX worker;
* restarting the worker when needed;
* applying light/dark theme handling to rendered SVGs;
* observing the DOM to render dynamically added blocks;
* rescanning MkDocs tabs and delayed content;
* displaying a fallback error image if rendering fails;
* dispatching the `tikzjax-load-finished` event after rendering.

## 4. Role of `run-tex.js`

`run-tex.js` runs inside a Web Worker.

It is responsible for:

* loading `tex.wasm.gz`;
* loading `core.dump.gz`;
* loading TeX support files from `tex_files/`;
* decompressing runtime assets with `pako`;
* injecting `input.tex` into the TeX environment;
* adding LaTeX packages;
* adding TikZ libraries;
* adding global and local preamble content;
* running the TeX WebAssembly engine;
* reading the generated `input.dvi`;
* converting DVI output to SVG/HTML with `@rod2ik/dvi2html`;
* returning the generated HTML to the main thread.

The worker keeps TeX execution isolated from the main page.

## 5. Generated LaTeX document

For each render, the worker builds a complete LaTeX document.

Conceptually, the generated document looks like this:

```tex
\documentclass{article}

\usepackage{amsmath}
\usepackage{...}

\usepackage{tikz}
\usetikzlibrary{...}

% global preamble
% local preamble

\begin{document}

% user TikZ or tkz-tab code

\end{document}
```

The exact document depends on:

* global `window.TikzJaxOptions`;
* local `data-*` attributes;
* configured LaTeX packages;
* configured TikZ libraries;
* configured `tkz-tab` options;
* custom preamble content.

## 6. Global and local configuration

Global configuration is defined with:

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
        tikzLibraries: ["arrows.meta", "calc", "positioning"],
        addToPreamble: ""
    }
};
```

Local block options can override or extend global options.

Example:

```html
<script
  type="text/tikz"
  data-tikz-libraries="arrows.meta,calc"
  data-tex-packages='{"xcolor":"dvipsnames"}'
  data-disable-cache="true"
>
\begin{tikzpicture}
    \draw[very thick, NavyBlue] (0,0) -- (3,1);
\end{tikzpicture}
</script>
```

## 7. Runtime asset resolution

TikZJax needs runtime assets in addition to `tikzjax.min.js`.

These include:

```text
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

By default, TikZJax resolves these files from the same directory as the loaded `tikzjax.min.js` script.

For example, if TikZJax is loaded from jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
```

then runtime files are resolved from:

```text
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/
```

So the worker is loaded from:

```text
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/run-tex.js
```

The same applies to unpkg:

```html
<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
```

## 8. `assetBaseUrl`

Use `assetBaseUrl` when runtime assets are not located next to `tikzjax.min.js`.

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

A same-origin deployment should expose:

```text
/vendor/tikzjax/tikzjax.min.js
/vendor/tikzjax/run-tex.js
/vendor/tikzjax/fonts.min.css
/vendor/tikzjax/tex.wasm.gz
/vendor/tikzjax/core.dump.gz
/vendor/tikzjax/tex_files/
/vendor/tikzjax/assets/broken-image.svg
```

## 9. Worker modes

TikZJax supports three worker modes.

| Mode       | Description                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------- |
| `"auto"`   | Default mode. Uses a direct Worker for same-origin files and a Blob Worker for cross-origin files. |
| `"blob"`   | Always creates a Blob Worker. Useful for CDN-hosted worker scripts.                                |
| `"direct"` | Always creates a direct Worker. Best for same-origin deployments.                                  |

Default configuration:

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

Same-origin configuration:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

Nested worker configuration is also supported:

```js
window.TikzJaxOptions = {
    worker: {
        mode: "auto",
        url: "run-tex.js"
    }
};
```

Root-level `workerMode` and `workerUrl` take precedence over nested `worker.mode` and `worker.url`.

## 10. Sequential rendering

Detected TikZ sources are placed in a queue and rendered one after another.

This avoids launching several TeX WebAssembly compilations simultaneously in the same worker.

The queue helps keep rendering stable on pages containing many diagrams, especially when several `tkz-tab` tables are present.

## 11. IndexedDB cache

TikZJax stores generated SVGs in IndexedDB.

It uses:

```text
Database: TikzJax
Object store: svgImages
```

The cache key is built from the final rendering input, including:

* TikZ source code;
* final dataset;
* packages;
* libraries;
* preamble;
* local rendering options.

If the source or options change, the diagram is rendered again.

To bypass the cache for one block:

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
\end{tikzpicture}
</script>
```

To clear the whole cache during development:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

## 12. DOM observation

TikZJax observes the page after the initial load.

This is useful for:

* MkDocs Material content tabs;
* collapsible admonitions;
* dynamically inserted content;
* client-side navigation;
* delayed Markdown rendering.

TikZJax can rescan the DOM and render newly detected TikZ blocks.

It detects sources such as:

```text
script[type="text/tikz"]
pre.language-tikzjax
pre.tikzjax
pre.language-tikz
pre.tikz
```

## 13. Theme handling

After SVG generation, TikZJax adapts common colors for light/dark themes.

It can normalize:

* black fills;
* black strokes;
* text color;
* some white backgrounds.

Theme detection can use:

* attributes such as `data-theme`;
* attributes such as `data-md-color-scheme`;
* CSS classes such as `dark` or `theme-dark`;
* explicit configuration through `window.TikzJaxOptions.theme`.

Example for Material for MkDocs:

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

## 14. Error handling

When rendering fails, TikZJax displays a fallback error image.

The fallback image can be configured globally:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/assets/broken-image.svg"
};
```

Typical failure causes include:

* invalid TikZ code;
* missing `\end{tikzpicture}`;
* missing LaTeX package;
* missing TikZ library;
* TeX timeout;
* worker failure;
* blocked runtime assets.

## 15. Cleanup

After each render, the worker cleans the virtual file system.

When the page unloads, TikZJax can:

* disconnect observers;
* cancel scheduled theme updates;
* clear pending render work;
* terminate the worker.

This helps avoid leaking memory when pages are dynamically updated or navigated.
