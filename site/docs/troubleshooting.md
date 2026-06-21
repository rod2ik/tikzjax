# Troubleshooting

## Nothing is displayed

First check that files are loaded in the correct order.

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

Then open the browser console and the Network tab.

Check that `tikzjax.js`, `run-tex.js`, `tex.wasm.gz`, and `core.dump.gz` are loaded, and that no CORS or CSP error blocks the resources.

## The error image is displayed

This means TikZJax detected the block, but rendering failed.

Common causes:

- incomplete TikZ environment;
- `\begin{tikzpicture}` without `\end{tikzpicture}`;
- missing package;
- missing TikZ library;
- unavailable LaTeX command;
- timeout exceeded.

## A TikZ library is missing

Add it globally:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: ["arrows.meta", "calc", "positioning"]
    }
};
```

or locally:

```html
<script type="text/tikz" data-tikz-libraries="arrows.meta,calc">
...
</script>
```

## A LaTeX package is missing

Add it to `texPackages`.

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

## Drawings do not change after editing

The IndexedDB cache may return an old version if the code and dataset are identical.

Solutions:

1. change the TikZ code or options;
2. temporarily add `data-disable-cache="true"`;
3. clear the site’s IndexedDB storage in DevTools.

## Rendering takes too long

Lower the timeout to diagnose, or increase it for complex figures.

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

## Dark mode renders colors poorly

TikZJax mainly adapts black, white, and text elements generated in SVG. For highly colored figures, define colors explicitly in the TikZ code or provide theme-specific variants.

## Blocks in MkDocs are not rendered

Check that the block produces one of the recognized classes: `language-tikzjax`, `tikzjax`, `language-tikz`, or `tikz`.

## Enable engine logs

```html
<script type="text/tikz" data-show-console="true">
...
</script>
```

This enables engine-side console output when that feature is available.
