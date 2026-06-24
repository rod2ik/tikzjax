# Troubleshooting

This page lists the most common issues and fixes.

## Nothing is displayed

First check the loading order.

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

The configuration file is optional, but when it exists, it must be loaded before `tikzjax.js`.

Then open the browser DevTools:

* check the **Console** for JavaScript errors;
* check the **Network** tab for missing or blocked files;
* make sure `tikzjax.js`, `run-tex.js`, `tex.wasm.gz`, and `core.dump.gz` are loaded;
* check that no CORS or CSP policy blocks the resources.

If you use MkDocs, make sure the CDN references are loaded in `overrides/main.html`, not only through `extra_css` or `extra_javascript`.

## The fallback error image is displayed

This means TikZJax detected the block, but the TeX rendering failed.

Common causes include:

* incomplete TikZ code;
* `\begin{tikzpicture}` without `\end{tikzpicture}`;
* missing LaTeX package;
* missing TikZ library;
* unavailable LaTeX command;
* render timeout.

Example of intentionally invalid code:

````latex
```tikzjax
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
```
````

## A TikZ library is missing

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

## A LaTeX package is missing

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

## A custom LaTeX command is missing

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

## MkDocs code blocks are not rendered

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

* `language-tikzjax`
* `tikzjax`
* `language-tikz`
* `tikz`

## Blocks inside admonitions or tabs are not rendered

TikZJax observes the DOM and should detect blocks inserted later, including blocks inside Material admonitions or content tabs.

If a block is still not rendered:

* check that the Markdown indentation is valid;
* check that `pymdownx.superfences` is configured for `tikzjax` code blocks;
* try the equivalent `<script type="text/tikz">` syntax;
* open the Console and check for JavaScript errors.

## Drawings do not change after editing

TikZJax uses browser-side cache.

During debugging, disable cache locally:

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    ...
\end{tikzpicture}
</script>
```

You can also clear the site storage in the browser DevTools, especially IndexedDB.

## Rendering takes too long

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

## Dark mode renders colors poorly

TikZJax can adapt common black, white, and text colors in generated SVGs.

For highly colored figures, define colors explicitly in the TikZ code, or provide separate light and dark variants when needed.

## The fallback image path is wrong

If the error image itself is missing, set `brokenImageSrc`.

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image.svg"
};
```

## Enable engine logs

For debugging, enable console output on a block:

```html
<script type="text/tikz" data-show-console="true">
\begin{tikzpicture}
    ...
\end{tikzpicture}
</script>
```

This enables engine-side console output when available.

## Quick checklist

1. `tikzjax.config.js` is loaded before `tikzjax.js`.
2. `fonts.css` is loaded.
3. `tikzjax.js` is loaded.
4. `run-tex.js`, `tex.wasm.gz`, and `core.dump.gz` are reachable.
5. No CORS or CSP policy blocks the CDN files.
6. The TikZ code contains a complete `tikzpicture` environment.
7. Required packages and TikZ libraries are configured.
8. MkDocs `tikzjax` code blocks are configured with `pymdownx.superfences`.
9. Cache is disabled while debugging.
10. The browser Console has been checked.
