# Reference

This page summarizes the available **global options** and **attributes**.

## Global Options

### Global object

```js
window.TikzJaxOptions = {};
```

!!! example
    ```javascript
    window.TikzJaxOptions = {
        # Global Options
        renderTimeout: 10000,
        brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-esquisse.svg",

        theme: {
            # theme Options
            selector: "body",
            attribute: "data-md-color-scheme",
            darkValue: "slate",
            lightValue: "default"
        },

        tex: {
            # tex Options
            texPackages: {
                "tkz-tab": "",
                amsmath: ""
            },
            tikzLibraries: [
                "arrows.meta",
                "calc",
                "positioning"
            ]
        },

        tkzTab: {
            # tkzTab Options
            lineWidth: "1.2pt",
            font: "\\Large",

            lgt: 10,
            espcl: 3.2,

            variableRowHeight: 1.2,
            signRowHeight: 2.2,
            variationRowHeight: 2.2,

            imageRowHeight: 2.2,
            antecedentRowHeight: 2.2
        }
    };
    ```

### Global options

| Option | Type | Default |
|---|---:|---:|
| `renderTimeout` | number | `15000` |
| `maxRetries` | number | `0` |
| `restartWorkerOnFail` | boolean | `true` |
| `brokenImageSrc` | string | `assets/broken-image.svg` |

### `theme` options

The `theme` options are meant to help configure Light / Dark themes, in every **other documentation platforms**.  
If you are using MkDocs, you shouldn't need to use them : Light/Dark Theme Detection should be automatic.

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

### `tex` options

Allows **additional `tex` libraries** to be loaded.

| Option | Type | Example |
|---|---:|---|
| `tex.texPackages` | object or JSON string | `{ amsmath: "", "tkz-tab": "" }` |
| `tex.tikzLibraries` | array or string | `["arrows.meta", "calc"]` |
| `tex.addToPreamble` | string | `String.raw` template string |
| `tex.renderTimeout` | number | `10000` |
| `tex.maxRetries` | number | `1` |
| `tex.restartWorkerOnFail` | boolean | `true` |

### `tkzTab` options

Defines **Default `tkz-tab` macros values**.

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

Allows **additional `tex-packages` and `tikz-libraries`** to be loaded as **attributes** when used with the `<script>` syntax.  
And some other options, notably `width` and `height`.

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
