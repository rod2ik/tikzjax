# API Reference

This page is the complete reference for TikZJax configuration and local attributes.

For examples, see [Configuration](configuration.md) and [Advanced Examples](advanced-examples.md).

## 1. Global configuration object

TikZJax reads its global configuration from:

```js
window.TikzJaxOptions = {};
```

The configuration file must be loaded before `tikzjax.js`.

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

## 2. Complete structure

```js
window.TikzJaxOptions = {
    renderTimeout: 15000,
    maxRetries: 0,
    restartWorkerOnFail: true,
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image.svg",

    theme: {
        selector: "body",
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default",
        darkClass: undefined,
        lightClass: undefined,
        fallbackTheme: "light",
        defaultTheme: "light",
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
        addToPreamble: "",

        renderTimeout: 15000,
        maxRetries: 0,
        restartWorkerOnFail: true
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

## 3. Root options

| Option                | Type      | Default                 | Description                                         |
| --------------------- | --------- | ----------------------- | --------------------------------------------------- |
| `renderTimeout`       | `number`  | `15000`                 | Maximum rendering time in milliseconds.             |
| `maxRetries`          | `number`  | `0`                     | Number of retry attempts after a render failure.    |
| `restartWorkerOnFail` | `boolean` | `true`                  | Restarts the TeX worker after a failure or timeout. |
| `brokenImageSrc`      | `string`  | internal fallback image | Image displayed when rendering fails.               |

The same worker options may also be placed under `tex`.

```js
window.TikzJaxOptions = {
    tex: {
        renderTimeout: 20000,
        maxRetries: 1,
        restartWorkerOnFail: true
    }
};
```

## 4. `theme` options

Theme options configure light/dark rendering.

Material for MkDocs is usually detected automatically. Use these options when your own site stores the theme in a custom attribute or class.

| Option                    | Type                  | Description                                                   |
| ------------------------- | --------------------- | ------------------------------------------------------------- |
| `theme.selector`          | `string`              | CSS selector of the element used to detect the current theme. |
| `theme.attribute`         | `string`              | Attribute observed on the selected element.                   |
| `theme.darkValue`         | `string`              | Attribute value corresponding to dark mode.                   |
| `theme.lightValue`        | `string`              | Attribute value corresponding to light mode.                  |
| `theme.darkClass`         | `string`              | Class corresponding to dark mode.                             |
| `theme.lightClass`        | `string`              | Class corresponding to light mode.                            |
| `theme.fallbackTheme`     | `"light"` or `"dark"` | Theme used if no theme is detected.                           |
| `theme.defaultTheme`      | `"light"` or `"dark"` | Alias for the default theme.                                  |
| `theme.followSystemTheme` | `boolean`             | Uses `prefers-color-scheme` as fallback.                      |

Example with an attribute:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "html",
        attribute: "data-theme",
        darkValue: "dark",
        lightValue: "light",
        fallbackTheme: "light",
        followSystemTheme: true
    }
};
```

Example with classes:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        darkClass: "theme-dark",
        lightClass: "theme-light",
        fallbackTheme: "light"
    }
};
```

## 5. `tex` options

| Option                    | Type                              | Description                                     |
| ------------------------- | --------------------------------- | ----------------------------------------------- |
| `tex.texPackages`         | `object` or JSON string           | LaTeX packages injected with `\usepackage`.     |
| `tex.tikzLibraries`       | `array` or comma-separated string | TikZ libraries injected with `\usetikzlibrary`. |
| `tex.addToPreamble`       | `string`                          | Raw LaTeX added to the preamble.                |
| `tex.renderTimeout`       | `number`                          | Same as root `renderTimeout`.                   |
| `tex.maxRetries`          | `number`                          | Same as root `maxRetries`.                      |
| `tex.restartWorkerOnFail` | `boolean`                         | Same as root `restartWorkerOnFail`.             |

### 5.1 `tex.texPackages`

Package values are the options passed to `\usepackage`.

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsmath: "",
            amssymb: "",
            xcolor: "dvipsnames",
            "tkz-tab": ""
        }
    }
};
```

This conceptually produces:

```latex
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage[dvipsnames]{xcolor}
\usepackage{tkz-tab}
```

### 5.2 `tex.tikzLibraries`

You can use an array:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: [
            "arrows.meta",
            "calc",
            "positioning"
        ]
    }
};
```

or a comma-separated string:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: "arrows.meta,calc,positioning"
    }
};
```

### 5.3 `tex.addToPreamble`

Use this for global LaTeX commands.

```js
window.TikzJaxOptions = {
    tex: {
        addToPreamble: String.raw`
\newcommand{\R}{\mathbb{R}}
\newcommand{\vect}[1]{\overrightarrow{#1}}
`
    }
};
```

## 6. `tkzTab` options

The `tkzTab` options generate reusable LaTeX macros for variation tables and sign tables.

| Option                       | Generated macro                     |
| ---------------------------- | ----------------------------------- |
| `tkzTab.lineWidth`           | `\tikzjaxTkzTabLineWidth`           |
| `tkzTab.font`                | `\tikzjaxTkzTabFont`                |
| `tkzTab.lgt`                 | `\tikzjaxTkzTabLgt`                 |
| `tkzTab.firstColumnWidth`    | `\tikzjaxTkzTabFirstColumnWidth`    |
| `tkzTab.espcl`               | `\tikzjaxTkzTabEspcl`               |
| `tkzTab.variableRowHeight`   | `\tikzjaxTkzTabVariableRowHeight`   |
| `tkzTab.signRowHeight`       | `\tikzjaxTkzTabSignRowHeight`       |
| `tkzTab.variationRowHeight`  | `\tikzjaxTkzTabVariationRowHeight`  |
| `tkzTab.imageRowHeight`      | `\tikzjaxTkzTabImageRowHeight`      |
| `tkzTab.antecedentRowHeight` | `\tikzjaxTkzTabAntecedentRowHeight` |

Example:

```latex
\begin{tikzpicture}[line width=\tikzjaxTkzTabLineWidth, font=\tikzjaxTkzTabFont]
    \tkzTabInit[
        lgt=\tikzjaxTkzTabLgt,
        espcl=\tikzjaxTkzTabEspcl,
        lw=\tikzjaxTkzTabLineWidth
    ]
        {
            $x$/\tikzjaxTkzTabVariableRowHeight,
            $f'(x)$/\tikzjaxTkzTabSignRowHeight,
            $f(x)$/\tikzjaxTkzTabVariationRowHeight
        }
        {$-\infty$, $0$, $+\infty$}
    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/ $+\infty$, -/ $0$, +/ $+\infty$}
\end{tikzpicture}
```

## 7. Local `data-*` attributes

Local attributes are placed on a `<script type="text/tikz">` block.

| HTML attribute         | Dataset key     | Description                                          |
| ---------------------- | --------------- | ---------------------------------------------------- |
| `data-tex-packages`    | `texPackages`   | Local LaTeX packages as JSON.                        |
| `data-tikz-libraries`  | `tikzLibraries` | Local TikZ libraries, comma-separated.               |
| `data-add-to-preamble` | `addToPreamble` | Local preamble appended after the global preamble.   |
| `data-disable-cache`   | `disableCache`  | Disables IndexedDB cache for this block.             |
| `data-width`           | `width`         | Loader width in TeX points.                          |
| `data-height`          | `height`        | Loader height in TeX points.                         |
| `data-show-console`    | `showConsole`   | Enables TeX console output, when supported.          |
| `data-aria-label`      | `ariaLabel`     | Adds an accessible label/title to the generated SVG. |

### 7.1 Local packages

```html
<script
  type="text/tikz"
  data-tex-packages='{"xcolor":"dvipsnames"}'
>
\begin{tikzpicture}
    \draw[red] (0,0) -- (2,1);
\end{tikzpicture}
</script>
```

### 7.2 Local TikZ libraries

```html
<script
  type="text/tikz"
  data-tikz-libraries="arrows.meta,calc"
>
\begin{tikzpicture}
    \draw[-{Latex[length=4mm]}] (0,0) -- (2,0);
\end{tikzpicture}
</script>
```

### 7.3 Local preamble

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

### 7.4 Disable cache locally

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
\end{tikzpicture}
</script>
```

### 7.5 Loader size

```html
<script type="text/tikz" data-width="120" data-height="80">
\begin{tikzpicture}
    \draw (0,0) rectangle (4,2);
\end{tikzpicture}
</script>
```

## 8. Configuration merging rules

TikZJax merges global and local options.

| Item                  | Merge behavior                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| Global packages       | Used by default.                                                                                     |
| Local packages        | Added to global packages. If the same package exists locally, local options override global options. |
| Global TikZ libraries | Used by default.                                                                                     |
| Local TikZ libraries  | Added to global libraries without duplicates.                                                        |
| Global preamble       | Added first.                                                                                         |
| Local preamble        | Appended after the global preamble.                                                                  |
| Local cache option    | Applies only to the current block.                                                                   |

## 9. Recognized source blocks

TikZJax recognizes two source families.

### 9.1 HTML syntax

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

### 9.2 Markdown fenced blocks

In MkDocs, fenced blocks are converted to HTML by the Markdown engine.

````latex
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

Recognized classes include:

| Class              | Typical source             |
| ------------------ | -------------------------- |
| `language-tikzjax` | ` ```tikzjax `             |
| `tikzjax`          | custom fenced block output |
| `language-tikz`    | ` ```tikz `                |
| `tikz`             | custom fenced block output |

## 10. CSS helper classes

Some CSS classes can be applied to the parent container.

| Class                      | Effect                                                                            |
| -------------------------- | --------------------------------------------------------------------------------- |
| `tikzjax-container`        | Adds `overflow: visible` to the generated SVG.                                    |
| `tikzjax-scaled-container` | Adds `overflow: visible`, `width: 100%`, and `height: 100%` to the generated SVG. |

Example:

```html
<div class="tikzjax-scaled-container">
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) rectangle (4,2);
    \end{tikzpicture}
    </script>
</div>
```

## 11. Render completion event

After a SVG has been generated, TikZJax dispatches:

```text
tikzjax-load-finished
```

Example:

```js
document.addEventListener("tikzjax-load-finished", function (event) {
    const svg = event.target;
    console.log("TikZJax SVG rendered:", svg);
});
```

## 12. Cache behavior

TikZJax caches rendered SVGs in the browser.

A block is rendered again if:

* the TikZ source changes;
* one of its relevant `data-*` attributes changes;
* cache is disabled with `data-disable-cache="true"`;
* the browser cache or IndexedDB storage is cleared.

## 13. Dynamically added content

TikZJax observes the DOM. TikZ blocks added after the initial page load are detected automatically.

No manual render call is required for normal MkDocs pages, Material tabs, or dynamically inserted content.
