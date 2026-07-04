# API Reference

This page is the complete reference for TikZJax configuration and local attributes.

For examples, see [Configuration](configuration.md) and [Advanced Examples](advanced-examples.md).

## 1. Global configuration object

TikZJax reads its global configuration from:

```js
window.TikzJaxOptions = {};
```

A complete global configuration should normally be defined before loading `tikzjax.js` or `tikzjax.min.js`.

Recommended CDN usage with minified files:

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Equivalent unpkg usage:

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

For debugging, you may use the non-minified files:

```html
<script>
window.TikzJaxOptions = {
    renderTimeout: 20000,
    maxRetries: 1
};
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.js"></script>
```

## 2. Configuration priority and merge behavior

TikZJax merges configuration in this order:

```text
default TikZJax options
< global configuration
< later partial global configuration
< local diagram configuration
```

This means that later partial configuration can update one option without replacing the whole previous configuration.

Example:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsmath: "",
            amsfonts: ""
        },
        tikzLibraries: [
            "arrows.meta"
        ]
    }
};

window.TikzJaxOptions = {
    brokenImageSrc: "/images/custom-tikz-error.svg"
};
```

The second assignment changes only `brokenImageSrc`.

It does not erase `tex.texPackages` or `tex.tikzLibraries`.

!!! warning

    TikZJax can merge later assignments only after its configuration API has been installed.

    The recommended pattern is:

    ```html
    <script src="tikzjax.config.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
    ```

    Use one complete global configuration file before loading TikZJax.

    Use later partial assignments only after TikZJax has loaded.

## 3. Deep merge rules

TikZJax uses a deep merge strategy.

| Value type | Merge behavior |
| --- | --- |
| Plain objects | Merged recursively |
| Arrays | Merged without duplicate entries |
| Strings, numbers, booleans | Later value replaces earlier value |
| Local `data-*` values | Applied only to the current diagram |

Example with arrays:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: [
            "arrows.meta",
            "calc"
        ]
    }
};

window.TikzJaxOptions = {
    tex: {
        tikzLibraries: [
            "positioning"
        ]
    }
};
```

The final `tikzLibraries` value is equivalent to:

```js
[
    "arrows.meta",
    "calc",
    "positioning"
]
```

## 4. `window.TikzJaxConfigure()`

After TikZJax has loaded, you can also use:

```js
window.TikzJaxConfigure({
    brokenImageSrc: "/images/custom-tikz-error.svg"
});
```

This is equivalent to assigning a partial object to `window.TikzJaxOptions`.

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/images/custom-tikz-error.svg"
};
```

`window.TikzJaxConfigure()` returns the merged configuration object.

## 5. Complete structure

This example shows the supported global configuration structure. You do not need to define every option.

```js
window.TikzJaxOptions = {
    assetBaseUrl: undefined,

    workerMode: "auto",
    workerUrl: "run-tex.js",

    worker: {
        mode: "auto",
        url: "run-tex.js"
    },

    renderTimeout: 15000,
    maxRetries: 0,
    restartWorkerOnFail: true,

    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg",

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
            amsfonts: "",
            amssymb: "",
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

## 6. Root options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `assetBaseUrl` | `string` | directory of loaded script | Base URL used to load runtime assets such as `run-tex.js`, `tex.wasm.gz`, `core.dump.gz`, `tex_files/`, and `assets/broken-image.svg`. |
| `workerMode` | `"auto"`, `"direct"`, `"blob"` | `"auto"` | Controls how the TeX Web Worker is created. |
| `workerUrl` | `string` | `"run-tex.js"` | Worker file URL or path. Relative paths are resolved against `assetBaseUrl`. |
| `worker.mode` | `"auto"`, `"direct"`, `"blob"` | `"auto"` | Nested form of `workerMode`. Root `workerMode` takes precedence. |
| `worker.url` | `string` | `"run-tex.js"` | Nested form of `workerUrl`. Root `workerUrl` takes precedence. |
| `renderTimeout` | `number` | `15000` | Maximum rendering time in milliseconds. |
| `maxRetries` | `number` | `0` | Number of retry attempts after a render failure. |
| `restartWorkerOnFail` | `boolean` | `true` | Restarts the TeX worker after a failure or timeout. |
| `brokenImageSrc` | `string` | internal fallback image | Image displayed when rendering fails. |
| `theme` | `object` | automatic theme handling | Light/dark theme configuration. |
| `tex` | `object` | `{}` | TeX packages, TikZ libraries, preamble, and optional render safety values. |
| `tkzTab` | `object` | `{}` | Global macros for `tkz-tab` tables. |

The same render-safety options may also be placed under `tex`.

```js
window.TikzJaxOptions = {
    tex: {
        renderTimeout: 20000,
        maxRetries: 1,
        restartWorkerOnFail: true
    }
};
```

Root-level values take precedence over nested `tex` values.

```js
window.TikzJaxOptions = {
    renderTimeout: 10000,

    tex: {
        renderTimeout: 30000
    }
};
```

In this example, `10000` wins.

## 7. CDN and runtime asset options

TikZJax needs several runtime files in addition to the main script and CSS file.

When loaded from jsDelivr or unpkg, the default behavior is usually enough:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

TikZJax resolves runtime assets relative to the loaded script directory:

```text
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/run-tex.js
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tex.wasm.gz
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/core.dump.gz
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tex_files/
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg
```

### 7.1 `assetBaseUrl`

Use `assetBaseUrl` when the main script is loaded from one location but the runtime assets are served from another location.

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist"
};
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Local same-origin example:

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax"
};
</script>

<link rel="stylesheet" href="/vendor/tikzjax/fonts.min.css">
<script src="/vendor/tikzjax/tikzjax.min.js"></script>
```

In this case, the following files should exist:

```text
/vendor/tikzjax/tikzjax.min.js
/vendor/tikzjax/run-tex.js
/vendor/tikzjax/fonts.min.css
/vendor/tikzjax/tex.wasm.gz
/vendor/tikzjax/core.dump.gz
/vendor/tikzjax/tex_files/
/vendor/tikzjax/assets/broken-image.svg
```

## 8. Worker options

TikZJax renders TeX inside a Web Worker. Worker loading is controlled by `workerMode`, `workerUrl`, and the nested `worker` object.

### 8.1 `workerMode: "auto"`

This is the default mode.

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

Behavior:

| Situation | Behavior |
| --- | --- |
| Worker URL is same-origin | TikZJax uses a direct Worker. |
| Worker URL is cross-origin | TikZJax fetches the worker script and creates a Blob Worker. |

This mode is recommended for most users.

### 8.2 `workerMode: "blob"`

This forces Blob Worker mode.

```js
window.TikzJaxOptions = {
    workerMode: "blob"
};
```

This is useful when the worker script is served from jsDelivr or unpkg and the page itself is served from another origin.

Blob Worker mode requires the browser to be allowed to create `blob:` workers.

Typical CSP requirement:

```http
worker-src 'self' blob:;
connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
```

### 8.3 `workerMode: "direct"`

This forces direct Worker mode.

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

Direct mode is useful for strict same-origin deployments or CSP policies that do not allow `blob:` workers.

In direct mode, the worker should normally be served from the same origin as the page:

```text
https://example.com/vendor/tikzjax/run-tex.js
```

Direct cross-origin Workers are blocked by many browsers, even if the worker script itself is accessible as a normal script.

### 8.4 `workerUrl`

Use `workerUrl` to override the worker script location.

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerUrl: "/vendor/tikzjax/run-tex.js",
    workerMode: "direct"
};
```

Nested form:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    worker: {
        url: "/vendor/tikzjax/run-tex.js",
        mode: "direct"
    }
};
```

Root options take precedence over nested options:

```js
window.TikzJaxOptions = {
    workerMode: "blob",

    worker: {
        mode: "direct"
    }
};
```

In this example, `"blob"` wins.

## 9. Content Security Policy

TikZJax uses WebAssembly and a Web Worker.

### 9.1 CDN with Blob Worker

For jsDelivr or unpkg usage, a typical CSP is:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'wasm-unsafe-eval';
  style-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'unsafe-inline';
  worker-src 'self' blob:;
  connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
  img-src 'self' https://cdn.jsdelivr.net https://unpkg.com data: blob:;
  font-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
  object-src 'none';
  base-uri 'self';
```

### 9.2 Local same-origin deployment

For a local same-origin deployment with direct Worker mode:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  worker-src 'self';
  connect-src 'self';
  img-src 'self' data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
```

Example configuration:

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
</script>

<link rel="stylesheet" href="/vendor/tikzjax/fonts.min.css">
<script src="/vendor/tikzjax/tikzjax.min.js"></script>
```

Notes:

- `worker-src blob:` is required for Blob Worker mode.
- `'wasm-unsafe-eval'` is usually required because TikZJax uses `WebAssembly.instantiate`.
- `style-src 'unsafe-inline'` may be required because the bundled CSS is injected by the JavaScript bundle.

## 10. `theme` options

Theme options configure light/dark rendering.

Material for MkDocs is usually detected automatically. Use these options when your own site stores the theme in a custom attribute or class.

| Option | Type | Description |
| --- | --- | --- |
| `theme.selector` | `string` | CSS selector of the element used to detect the current theme. |
| `theme.attribute` | `string` | Attribute observed on the selected element. |
| `theme.darkValue` | `string` | Attribute value corresponding to dark mode. |
| `theme.lightValue` | `string` | Attribute value corresponding to light mode. |
| `theme.darkClass` | `string` | Class corresponding to dark mode. |
| `theme.lightClass` | `string` | Class corresponding to light mode. |
| `theme.fallbackTheme` | `"light"` or `"dark"` | Theme used if no theme is detected. |
| `theme.defaultTheme` | `"light"` or `"dark"` | Alias for the default theme. |
| `theme.followSystemTheme` | `boolean` | Uses `prefers-color-scheme` as fallback. |

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

## 11. `tex` options

| Option | Type | Description |
| --- | --- | --- |
| `tex.texPackages` | `object` or JSON string | LaTeX packages injected with `\usepackage`. |
| `tex.tikzLibraries` | `array` or comma-separated string | TikZ libraries injected with `\usetikzlibrary`. |
| `tex.addToPreamble` | `string` | Raw LaTeX added to the preamble. |
| `tex.renderTimeout` | `number` | Same as root `renderTimeout`. Root value takes precedence. |
| `tex.maxRetries` | `number` | Same as root `maxRetries`. Root value takes precedence. |
| `tex.restartWorkerOnFail` | `boolean` | Same as root `restartWorkerOnFail`. Root value takes precedence. |

Legacy root aliases are also supported:

```js
window.TikzJaxOptions = {
    texPackages: {
        amsmath: "",
        "tkz-tab": ""
    },
    tikzLibraries: "arrows.meta,calc",
    addToPreamble: "\\newcommand{\\R}{\\mathbb{R}}"
};
```

The recommended form is to place these options under `tex`.

### 11.1 `tex.texPackages`

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

### 11.2 `tex.tikzLibraries`

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

### 11.3 `tex.addToPreamble`

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

## 12. `tkzTab` options

The `tkzTab` options generate reusable LaTeX macros for variation tables and sign tables.

| Option | Generated macro |
| --- | --- |
| `tkzTab.lineWidth` | `\tikzjaxTkzTabLineWidth` |
| `tkzTab.font` | `\tikzjaxTkzTabFont` |
| `tkzTab.lgt` | `\tikzjaxTkzTabLgt` |
| `tkzTab.firstColumnWidth` | `\tikzjaxTkzTabFirstColumnWidth` |
| `tkzTab.espcl` | `\tikzjaxTkzTabEspcl` |
| `tkzTab.variableRowHeight` | `\tikzjaxTkzTabVariableRowHeight` |
| `tkzTab.signRowHeight` | `\tikzjaxTkzTabSignRowHeight` |
| `tkzTab.variationRowHeight` | `\tikzjaxTkzTabVariationRowHeight` |
| `tkzTab.imageRowHeight` | `\tikzjaxTkzTabImageRowHeight` |
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

## 13. Broken image fallback

Use `brokenImageSrc` to customize the image displayed when a diagram fails to render.

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/assets/images/tikz-error.svg"
};
```

A single diagram can override the fallback image locally:

```html
<script
  type="text/tikz"
  data-broken-image-src="/assets/images/local-tikz-error.svg"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

Fallback priority:

```text
default broken image
< global brokenImageSrc
< partial global brokenImageSrc
< local data-broken-image-src
```

## 14. Local `data-*` attributes

Local attributes are placed on a `<script type="text/tikz">` block.

They apply only to the current diagram.

They do not mutate `window.TikzJaxOptions`.

| HTML attribute | Dataset key | Description |
| --- | --- | --- |
| `data-tex-packages` | `texPackages` | Local LaTeX packages as JSON. |
| `data-tikz-libraries` | `tikzLibraries` | Local TikZ libraries, comma-separated. |
| `data-add-to-preamble` | `addToPreamble` | Local preamble appended after the global preamble. |
| `data-broken-image-src` | `brokenImageSrc` | Local fallback image for this diagram. |
| `data-render-timeout` | `renderTimeout` | Local render timeout in milliseconds. |
| `data-max-retries` | `maxRetries` | Local retry count. |
| `data-restart-worker-on-fail` | `restartWorkerOnFail` | Local worker restart behavior. |
| `data-disable-cache` | `disableCache` | Disables IndexedDB cache for this block. |
| `data-width` | `width` | Loader width in TeX points. |
| `data-height` | `height` | Loader height in TeX points. |
| `data-show-console` | `showConsole` | Enables TeX console output, when supported. |
| `data-options` | `options` | JSON object with local options. |
| `data-tikzjax-options` | `tikzjaxOptions` | JSON object with local options. |
| `data-tex` | `tex` | JSON object for local nested `tex` options. |
| `data-tkz-tab` | `tkzTab` | JSON object for local `tkzTab` options. |

### 14.1 Local packages

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

### 14.2 Local TikZ libraries

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

### 14.3 Local preamble

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

### 14.4 Local fallback image

```html
<script
  type="text/tikz"
  data-broken-image-src="/assets/images/local-tikz-error.svg"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

### 14.5 Local render safety

```html
<script
  type="text/tikz"
  data-render-timeout="30000"
  data-max-retries="1"
  data-restart-worker-on-fail="true"
>
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
\end{tikzpicture}
</script>
```

### 14.6 Disable cache locally

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
\end{tikzpicture}
</script>
```

### 14.7 Loader size

```html
<script type="text/tikz" data-width="120" data-height="80">
\begin{tikzpicture}
    \draw (0,0) rectangle (4,2);
\end{tikzpicture}
</script>
```

### 14.8 Show TeX console output

Use this when debugging LaTeX errors.

```html
<script type="text/tikz" data-show-console="true">
\begin{tikzpicture}
    \draw (0,0) -- (2,1);
\end{tikzpicture}
</script>
```

When supported by the TeX runtime, TeX logs are printed in the browser console.

### 14.9 Local JSON options

Use `data-tikzjax-options` for complex local configuration.

```html
<script
  type="text/tikz"
  data-tikzjax-options='{"renderTimeout":30000,"tex":{"tikzLibraries":["decorations.pathreplacing"],"texPackages":{"xcolor":""}}}'
>
\begin{tikzpicture}
    \node at (0,0) {\textcolor{blue}{$\mathbb{R}$}};
    \draw[decorate, decoration={brace, amplitude=6pt}] (-1,-0.6) -- (1,-0.6);
\end{tikzpicture}
</script>
```

## 15. Local configuration merging rules

TikZJax merges global and local options.

| Item | Merge behavior |
| --- | --- |
| Global packages | Used by default. |
| Local packages | Added to global packages. If the same package exists locally, local options override global options. |
| Global TikZ libraries | Used by default. |
| Local TikZ libraries | Added to global libraries without duplicates. |
| Global preamble | Added first. |
| Local preamble | Appended after the global preamble. |
| Global fallback image | Used by default when rendering fails. |
| Local fallback image | Used only for the current diagram. |
| Local render timeout | Applies only to the current diagram. |
| Local cache option | Applies only to the current diagram. |

## 16. Recognized source blocks

TikZJax recognizes two source families.

### 16.1 HTML syntax

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

### 16.2 Markdown fenced blocks

In MkDocs, fenced blocks are converted to HTML by the Markdown engine.

````latex
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

Recognized classes include:

| Class | Typical source |
| --- | --- |
| `language-tikzjax` | ` ```tikzjax ` |
| `tikzjax` | custom fenced block output |
| `language-tikz` | ` ```tikz ` |
| `tikz` | custom fenced block output |

## 17. CSS helper classes

Some CSS classes can be applied to the parent container.

| Class | Effect |
| --- | --- |
| `tikzjax-container` | Adds `overflow: visible` to the generated SVG. |
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

## 18. Render completion event

After an SVG has been generated, TikZJax dispatches:

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

## 19. Cache behavior

TikZJax caches rendered SVGs in IndexedDB.

A block is rendered again if:

- the TikZ source changes;
- one of its relevant `data-*` attributes changes;
- cache is disabled with `data-disable-cache="true"`;
- the browser cache or IndexedDB storage is cleared;
- the effective global TeX options included in the dataset change.

To clear the TikZJax cache manually from the browser console:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

## 20. Dynamically added content

TikZJax observes the DOM. TikZ blocks added after the initial page load are detected automatically.

No manual render call is required for normal MkDocs pages, Material tabs, or dynamically inserted content.

TikZJax also listens to tab interactions commonly used by Material for MkDocs and rescans after a short delay when tabbed content becomes visible.

## 21. Runtime files included in the npm package

The npm package includes the runtime files required by the browser renderer.

Important files include:

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

For CDN use, prefer the minified files:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

For debugging, use the non-minified files:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.js"></script>
```