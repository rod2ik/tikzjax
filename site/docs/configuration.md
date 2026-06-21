# Configuration

TikZJax is configured with the global `window.TikzJaxOptions` object.

This file must be loaded before `tikzjax.js`.

```html
<script src="tikzjax.config.js"></script>
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

## Complete example

```js
window.TikzJaxOptions = {
    renderTimeout: 10000,
    maxRetries: 1,
    restartWorkerOnFail: true,
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-esquisse.svg",

    theme: {
        selector: "body",
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default",
        fallbackTheme: "light",
        followSystemTheme: false
    },

    tex: {
        texPackages: {
            amsmath: "",
            "tkz-tab": ""
        },
        tikzLibraries: [
            "arrows.meta",
            "calc",
            "positioning"
        ],
        addToPreamble: ""
    },

    tkzTab: {
        lineWidth: "1.2pt",
        font: "\\Large",

        lgt: 10,
        firstColumnWidth: 10,
        espcl: 3.2,

        variableRowHeight: 1.5,
        signRowHeight: 2.5,
        variationRowHeight: 2.5,
        imageRowHeight: 2.5,
        antecedentRowHeight: 2.5
    }
};
```

## General options

| Option | Type | Default | Description |
|---|---:|---:|---|
| `renderTimeout` | number | `15000` | Maximum time, in milliseconds, allowed for a TikZ render. |
| `maxRetries` | number | `0` | Number of retry attempts after a render failure. |
| `restartWorkerOnFail` | boolean | `true` | Restarts the TeX worker after a failure or timeout. |
| `brokenImageSrc` | string | internal image | Image displayed when rendering fails. |

The `renderTimeout`, `maxRetries`, and `restartWorkerOnFail` options can also be placed under `tex`.

```js
window.TikzJaxOptions = {
    tex: {
        renderTimeout: 20000,
        maxRetries: 1,
        restartWorkerOnFail: true
    }
};
```

## TeX options

| Option | Type | Description |
|---|---:|---|
| `tex.texPackages` | object or JSON string | LaTeX packages injected with `\usepackage`. |
| `tex.tikzLibraries` | array or string | TikZ libraries injected with `\usetikzlibrary`. |
| `tex.addToPreamble` | string | Raw LaTeX preamble added before `\begin{document}`. |

Example:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsmath: "",
            "tkz-tab": "",
            xcolor: "dvipsnames"
        },
        tikzLibraries: [
            "arrows.meta",
            "calc",
            "positioning"
        ],
        addToPreamble: String.raw`
\newcommand{\R}{\mathbb{R}}
`
    }
};
```

## LaTeX packages with options

The package value corresponds to the options passed to `\usepackage`.

```js
texPackages: {
    xcolor: "dvipsnames",
    amsmath: "",
    "tkz-tab": ""
}
```

This conceptually produces:

```tex
\usepackage[dvipsnames]{xcolor}
\usepackage{amsmath}
\usepackage{tkz-tab}
```

The `amsmath` package is added by default in the worker to support common mathematical rendering.

## TikZ libraries

Libraries can be provided as an array:

```js
tikzLibraries: ["arrows.meta", "calc", "positioning"]
```

or as a string:

```js
tikzLibraries: "arrows.meta,calc,positioning"
```

## `tkzTab` options

The `tkzTab` options generate global LaTeX macros. They help avoid repeating the same dimensions in every variation table.

| JS option | Generated TeX macro |
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

Example:

```tikzjax
\begin{tikzpicture}[line width=\tikzjaxTkzTabLineWidth, font=\tikzjaxTkzTabFont]
    \tkzTabInit[
        lgt=\tikzjaxTkzTabLgt,
        espcl=\tikzjaxTkzTabEspcl,
        lw=\tikzjaxTkzTabLineWidth
    ]
        {
            $x$/\tikzjaxTkzTabVariableRowHeight,
            Sign of $f'(x)$/\tikzjaxTkzTabSignRowHeight,
            Variations of $f(x)$/\tikzjaxTkzTabVariationRowHeight
        }
        {$-\infty$, $0$, $+\infty$}
    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/ $+\infty$, -/ $0$, +/ $+\infty$}
\end{tikzpicture}
```

## Backward-compatible options

Some options can be placed directly at the root of `TikzJaxOptions`.

```js
window.TikzJaxOptions = {
    texPackages: {
        amsmath: "",
        "tkz-tab": ""
    },
    tikzLibraries: "arrows.meta,calc",
    addToPreamble: ""
};
```

The recommended form is still:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {},
        tikzLibraries: [],
        addToPreamble: ""
    }
};
```
