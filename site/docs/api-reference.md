# Reference

This page summarizes the available options and attributes.

## Global object

```js
window.TikzJaxOptions = {};
```

## Global options

| Option | Type | Default |
|---|---:|---:|
| `renderTimeout` | number | `15000` |
| `maxRetries` | number | `0` |
| `restartWorkerOnFail` | boolean | `true` |
| `brokenImageSrc` | string | `assets/broken-image.svg` |

## `tex` options

| Option | Type | Example |
|---|---:|---|
| `tex.texPackages` | object or JSON string | `{ amsmath: "", "tkz-tab": "" }` |
| `tex.tikzLibraries` | array or string | `["arrows.meta", "calc"]` |
| `tex.addToPreamble` | string | `String.raw` template string |
| `tex.renderTimeout` | number | `10000` |
| `tex.maxRetries` | number | `1` |
| `tex.restartWorkerOnFail` | boolean | `true` |

## `theme` options

| Option | Type | Description |
|---|---:|---|
| `theme.selector` | CSS selector | Reference element used to detect the theme. |
| `theme.attribute` | string | Attribute to observe. |
| `theme.darkValue` | string | Value corresponding to dark mode. |
| `theme.lightValue` | string | Value corresponding to light mode. |
| `theme.darkClass` | string | Class corresponding to dark mode. |
| `theme.lightClass` | string | Class corresponding to light mode. |
| `theme.fallbackTheme` | `"light"` or `"dark"` | Theme used if nothing is detected. |
| `theme.defaultTheme` | `"light"` or `"dark"` | Default theme alias. |
| `theme.followSystemTheme` | boolean | Uses `prefers-color-scheme` as a last resort. |

## `tkzTab` options

| Option | Macro |
|---|---|
| `lineWidth` | `\tikzjaxTkzTabLineWidth` |
| `font` | `\tikzjaxTkzTabFont` |
| `lgt` | `\tikzjaxTkzTabLgt` |
| `firstColumnWidth` | `\tikzjaxTkzTabFirstColumnWidth` |
| `espcl` | `\tikzjaxTkzTabEspcl` |
| `variableRowHeight` | `\tikzjaxTkzTabVariableRowHeight` |
| `signRowHeight` | `\tikzjaxTkzTabSignRowHeight` |
| `variationRowHeight` | `\tikzjaxTkzTabVariationRowHeight` |
| `imageRowHeight` | `\tikzjaxTkzTabImageRowHeight` |
| `antecedentRowHeight` | `\tikzjaxTkzTabAntecedentRowHeight` |

## Local `data-*` attributes

| HTML attribute | JS dataset | Description |
|---|---|---|
| `data-tex-packages` | `texPackages` | Local packages as JSON. |
| `data-tikz-libraries` | `tikzLibraries` | Local TikZ libraries, comma-separated. |
| `data-add-to-preamble` | `addToPreamble` | Local preamble appended after the global preamble. |
| `data-disable-cache` | `disableCache` | Disables cache if the value is present. |
| `data-width` | `width` | Loader width in points. |
| `data-height` | `height` | Loader height in points. |
| `data-show-console` | `showConsole` | Enables engine-side console output, if supported. |

## Render completion event

After replacing the loader with the SVG, TikZJax dispatches `tikzjax-load-finished` on the generated SVG. The event bubbles through the DOM.
