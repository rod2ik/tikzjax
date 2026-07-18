# Configuration

TikZJax can be configured globally for the complete page and locally for individual diagrams.

A typical setup consists of:

1. a global `tikzjax.config.js` file;
2. the TikZJax font stylesheet;
3. the TikZJax JavaScript bundle;
4. local `data-*` attributes for specialized diagrams.

The configuration file must be loaded before `tikzjax.min.js` or `tikzjax.js`.

For the exact configuration precedence and merge rules, see [Global and Local Configuration](configuration-scopes.md).

---

## Recommended configuration

The following configuration is a good default for documentation sites:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    workerPool: {
        enabled: true,
        maxWorkers: 3,
        reserveCpuCores: 1,
        useDeviceMemory: true,
        initializationRetries: 1
    }
};
```

It provides:

* a finite render timeout;
* one retry after a failed render;
* worker replacement after a fatal failure;
* parallel rendering with a bounded worker pool;
* CPU and memory safeguards for smaller devices.

Specialized TeX packages and TikZ libraries should normally be loaded locally on the diagrams that require them.

---

## Recommended loading order

Load the configuration first, followed by the stylesheet and JavaScript bundle:

```html
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

For debugging, use the non-minified files:

```html
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.js"></script>
```

!!! warning "Configure before loading TikZJax"

    Define one complete initial `window.TikzJaxOptions` object before loading the TikZJax bundle.

    Runtime partial updates should be applied only after TikZJax has installed its configuration API.

---

## Minimal configuration

TikZJax already provides default values.

A configuration file can contain only the options that need to change:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

For a page containing only standard TikZ diagrams, an explicit TeX package list is not required.

---

## Complete recommended file

A practical `tikzjax.config.js` can start with:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    workerPool: {
        enabled: true,
        maxWorkers: 3,
        reserveCpuCores: 1,
        useDeviceMemory: true,
        initializationRetries: 1
    },

    tex: {
        texPackages: {},
        tikzLibraries: []
    }
};
```

Add globally shared dependencies only when they are genuinely required by most diagrams.

For example:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    workerPool: {
        enabled: true,
        maxWorkers: 3,
        reserveCpuCores: 1,
        useDeviceMemory: true,
        initializationRetries: 1
    },

    tex: {
        texPackages: {
            amsfonts: ""
        },

        tikzLibraries: [
            "arrows.meta"
        ]
    }
};
```

---

## Main option groups

TikZJax configuration is organized into several groups.

| Group                  | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| Root rendering options | Timeout, retries, fallback image               |
| `workerPool`           | Parallel worker-pool sizing and initialization |
| `worker`               | Worker URL and startup mode                    |
| `tex`                  | Packages, TikZ libraries, and custom preamble  |
| `theme`                | Light and dark theme detection                 |
| `tkzTab`               | Automatic `tkz-tab` defaults and helper macros |
| Asset options          | Runtime and worker file locations              |

The [API Reference](api-reference.md) documents every supported property.

---

## Rendering safety

Use the root-level options:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true
};
```

| Option                | Purpose                                                         |
| --------------------- | --------------------------------------------------------------- |
| `renderTimeout`       | Maximum time allowed for one rendering attempt, in milliseconds |
| `maxRetries`          | Number of retry attempts after the initial failure              |
| `restartWorkerOnFail` | Replace a worker whose runtime may no longer be usable          |

A complex diagram can override these values locally:

```html
<script
  type="text/tikz"
  data-render-timeout="45000"
  data-max-retries="1"
  data-restart-worker-on-fail="true"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

!!! note

    Older configurations may place these values inside `tex`.

    Root-level values are preferred and take precedence when both forms are present.

---

## Worker-pool configuration

TikZJax can render independent diagrams concurrently:

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: true,
        maxWorkers: 3,
        reserveCpuCores: 1,
        useDeviceMemory: true,
        initializationRetries: 1
    }
};
```

| Option                  | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `enabled`               | Enable the parallel worker pool                         |
| `maxWorkers`            | Hard upper limit for rendering workers                  |
| `reserveCpuCores`       | Attempt to leave logical CPU cores available            |
| `useDeviceMemory`       | Consider the browser's memory hint when sizing the pool |
| `initializationRetries` | Retry failed worker initialization                      |

The effective worker count can be lower than `maxWorkers`.

TikZJax initializes workers lazily after detecting diagrams that require rendering.

See [Parallel Rendering and the Worker Pool](parallel-rendering.md).

---

## One-worker debugging configuration

To keep the worker-pool scheduler but allow only one active worker:

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: true,
        maxWorkers: 1,
        reserveCpuCores: 0,
        useDeviceMemory: false
    }
};
```

This is useful when investigating behavior that might depend on parallel rendering.

To disable the pool entirely:

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: false
    }
};
```

For normal documentation sites, the pool should usually remain enabled.

---

## TeX packages

Global packages are declared in `tex.texPackages`:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsfonts: "",
            amssymb: ""
        }
    }
};
```

The object maps package names to package options:

```text
package name -> option string
```

An empty string means that the package has no options.

Example with options:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            xcolor: "dvipsnames"
        }
    }
};
```

This is equivalent to:

```latex
\usepackage[dvipsnames]{xcolor}
```

!!! warning "Avoid loading every package globally"

    A global package is included in the TeX preamble of every diagram.

    Specialized packages such as `chemfig`, `circuitikz`, `yquant`, and `pgf-spectra` should normally be loaded locally.

---

## Local TeX packages

Load one package locally with:

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}
    \node {$\vb{F}=m\vb{a}$};
\end{tikzpicture}
</script>
```

Use JSON when several packages or package options are required:

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "physics": "",
    "xcolor": "dvipsnames"
  }'
>
\begin{tikzpicture}
    \node[text=NavyBlue] {$\vb{F}=m\vb{a}$};
\end{tikzpicture}
</script>
```

The local packages are merged with globally configured packages for this diagram only.

They do not modify `window.TikzJaxOptions`.

---

## TikZ libraries

Global TikZ libraries are declared as an array:

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

This is equivalent to:

```latex
\usetikzlibrary{
    arrows.meta,
    calc,
    positioning
}
```

Load a library locally when only one diagram requires it:

```html
<script
  type="text/tikz"
  data-tikz-libraries="calc,positioning"
>
\begin{tikzpicture}
    \coordinate (A) at (0,0);
    \coordinate (B) at (4,0);

    \fill
        ($(A)!0.5!(B)$)
        circle (3pt);
\end{tikzpicture}
</script>
```

Local and global library lists are combined and deduplicated.

---

## Packages versus TikZ libraries

Use `data-tex-packages` for dependencies normally loaded with:

```latex
\usepackage{...}
```

Examples:

```text
tkz-tab
physics
circuitikz
chemfig
yquant
tikz-feynhand
pgf-spectra
kinematikz
```

Use `data-tikz-libraries` for dependencies normally loaded with:

```latex
\usetikzlibrary{...}
```

Examples:

```text
arrows.meta
calc
positioning
patterns
shapes.geometric
braids
decorations.pathreplacing
```

For example, `braids` is a TikZ library:

```html
<script
  type="text/tikz"
  data-tikz-libraries="braids"
>
\begin{tikzpicture}
    % Braid source
\end{tikzpicture}
</script>
```

It is not a `data-tex-packages` value.

---

## Custom LaTeX preamble

Use `String.raw` for a global custom preamble:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsfonts: ""
        },

        addToPreamble: String.raw`
\newcommand{\R}{\mathbb{R}}
\newcommand{\N}{\mathbb{N}}
\newcommand{\vect}[1]{\overrightarrow{#1}}
`
    }
};
```

The commands can then be used in diagrams:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \node[
        draw,
        rounded corners,
        inner sep=7pt
    ] {
        $f:\R\to\R$
    };
\end{tikzpicture}
</script>
```

Use `data-add-to-preamble` for a diagram-specific preamble:

```html
<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\localR}{\mathbb{R}}"
>
\begin{tikzpicture}
    \node {$f:\localR\to\localR$};
\end{tikzpicture}
</script>
```

For the precise interaction between global and local preamble values, see [Global and Local Configuration](configuration-scopes.md).

---

## `tkz-tab` configuration

The `tkzTab` object controls the default appearance and native package options used by `tkz-tab` tables.

Package loading and table configuration are separate concerns:

* load `tkz-tab` globally when most diagrams use it;
* load it locally with `data-tex-packages="tkz-tab"` for occasional tables;
* define shared table defaults once in `tikzjax.config.js`.

The global `tkzTab` values are merged over TikZJax's built-in defaults. When `autoApply` is enabled, supported values are applied automatically even when the diagram source does not reference a `\tikzjaxTkzTab...` macro.

### Global package and table defaults

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            "tkz-tab": ""
        }
    },

    tkzTab: {
        autoApply: true,

        lineWidth: "1.2pt",
        font: "\\Large",
        lgt: 10,
        espcl: 3.2,

        init: {
            deltacl: 0.5,
            nocadre: false
        },

        setup: {
            arrowlinewidth: "1.2pt",
            doubledistance: "1pt"
        },

        colors: {
            color: "black",
            backgroundcolor: "white"
        },

        variableRowHeight: 1.2,
        signRowHeight: 2.2,
        variationRowHeight: 2.2,
        imageRowHeight: 2.2,
        antecedentRowHeight: 2.2
    }
};
```

The package can still be loaded locally while using the same global table defaults:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
>
\begin{tikzpicture}
    \tkzTabInit
        {$x$/1,$f'(x)$/1,$f(x)$/2}
        {$-\infty$,$0$,$+\infty$}

    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/$+\infty$,-/$0$,+/$+\infty$}
\end{tikzpicture}
</script>
```

In this example, `lineWidth`, `font`, `lgt`, `espcl`, and the supported native options are applied even though the source does not mention them explicitly.

### Automatically applied top-level options

| Option                 | Native effect                                                                 |
| ---------------------- | ----------------------------------------------------------------------------- |
| `autoApply`            | Enables or disables automatic application of native `tkz-tab` defaults       |
| `lineWidth`            | Sets the package line-width default and the native `lw` default               |
| `font`                 | Appends the configured font to nodes in the current `tkz-tab` render          |
| `lgt`                  | Sets the default first-column width                                            |
| `firstColumnWidth`     | Overrides `lgt` as the native first-column width when it is defined           |
| `espcl`                | Sets the default spacing between value columns                                |
| `init`                 | Adds native default keys for `\tkzTabInit`                                    |
| `setup`                | Passes native options to `\tkzTabSetup`                                       |
| `colors`               | Passes native options to `\tkzTabColors`                                      |

Entries in `tkzTab.init` override the corresponding automatically generated `lgt`, `espcl`, or `lw` value.

For example:

```js
window.TikzJaxOptions = {
    tkzTab: {
        lineWidth: "1.2pt",
        lgt: 4,
        espcl: 2.5,

        init: {
            lw: "1.8pt",
            lgt: 5,
            deltacl: 0.8
        }
    }
};
```

The effective native defaults are therefore:

```text
lw=1.8pt
lgt=5
espcl=2.5
deltacl=0.8
```

### Native `init`, `setup`, and `colors` objects

`tkzTab.init` accepts scalar options understood by `\tkzTabInit`, including values such as:

```text
help
color
nocadre
lw
textw
colorC
colorL
colorT
colorV
lgt
espcl
deltacl
```

`tkzTab.setup` accepts scalar options understood by `\tkzTabSetup`, including values such as:

```text
crosslines
doubledistance
lw
doublecolor
color
backgroundcolor
patterncolor
patternstyle
tstyle
tcolor
tanstyle
tanarrowstyle
tancolor
tanwidth
fromstyle
fromarrowstyle
fromcolor
fromwidth
twidth
hcolor
hopacity
arrowcolor
arrowstyle
arrowlinewidth
```

`tkzTab.colors` accepts the native color options:

```text
color
backgroundcolor
```

Only scalar string, number, or boolean values are serialized into these native option lists.

### Configuration priority

For native table defaults, the effective priority is:

```text
native tkz-tab defaults
< TikZJax built-in tkzTab defaults
< initial tikzjax.config.js values
< later partial global configuration
< local data-tkz-tab values
< explicit TeX options such as \tkzTabInit[lw=...]
```

An explicit option in the diagram source remains the highest-priority value.

### Local `data-tkz-tab` override

A single diagram can override the global table defaults:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-tkz-tab='{
    "lineWidth": "1.8pt",
    "font": "\\large",
    "lgt": 5,
    "espcl": 2.6,
    "setup": {
      "arrowlinewidth": "1.4pt"
    }
  }'
>
\begin{tikzpicture}
    \tkzTabInit
        {$x$/1,$f'(x)$/1,$f(x)$/2}
        {$-\infty$,$0$,$+\infty$}

    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/$+\infty$,-/$0$,+/$+\infty$}
\end{tikzpicture}
</script>
```

This local object is merged with the global `tkzTab` object for this diagram only.

### Row-height helpers

The row-height properties remain reusable TeX macros:

```text
\tikzjaxTkzTabVariableRowHeight
\tikzjaxTkzTabSignRowHeight
\tikzjaxTkzTabVariationRowHeight
\tikzjaxTkzTabImageRowHeight
\tikzjaxTkzTabAntecedentRowHeight
```

They are not applied automatically because row heights are part of the required `label/height` list passed to `\tkzTabInit`. TikZJax cannot safely infer whether a custom row is a variable, sign, variation, image, or antecedent row.

Example:

```tex
\tkzTabInit
    {
        $x$/\tikzjaxTkzTabVariableRowHeight,
        $f'(x)$/\tikzjaxTkzTabSignRowHeight,
        $f(x)$/\tikzjaxTkzTabVariationRowHeight
    }
    {$-\infty$,$0$,$+\infty$}
```

The other helper macros remain available for explicit use:

```text
\tikzjaxTkzTabLineWidth
\tikzjaxTkzTabFont
\tikzjaxTkzTabLgt
\tikzjaxTkzTabFirstColumnWidth
\tikzjaxTkzTabEspcl
```

### Disable automatic application

Set `autoApply` to `false` to keep the helper macros without modifying native `tkz-tab` defaults automatically:

```js
window.TikzJaxOptions = {
    tkzTab: {
        autoApply: false,
        lineWidth: "1.8pt"
    }
};
```

### Inspect the active table configuration

Run in the browser console:

```js
window.TikzJaxOptions?.tkzTab
```

To inspect one value:

```js
window.TikzJaxOptions?.tkzTab?.lineWidth
```

See the [`tkz-tab` examples](examples/tkz-tab.md).

---

## Theme configuration

TikZJax can follow a site theme stored in an HTML attribute:

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

For a class-based theme:

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

See [Themes](themes.md) for theme detection, SVG adaptation, and MkDocs Material integration.

---

## Broken-image fallback

Set the global fallback image with:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/images/tikz-error.svg"
};
```

A single diagram can override it:

```html
<script
  type="text/tikz"
  data-broken-image-src="/images/local-tikz-error.svg"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

See [Fallback and Error Images](fallback-error-images.md).

---

## Local diagram options

A `<script type="text/tikz">` element can provide local options through `data-*` attributes.

Common attributes include:

| Attribute                     | Purpose                            |
| ----------------------------- | ---------------------------------- |
| `data-tex-packages`           | Load local TeX packages            |
| `data-tikz-libraries`         | Load local TikZ libraries          |
| `data-add-to-preamble`        | Set the diagram-specific preamble  |
| `data-tkz-tab`                | Override local `tkz-tab` defaults  |
| `data-render-timeout`         | Override the render timeout        |
| `data-max-retries`            | Override the retry count           |
| `data-restart-worker-on-fail` | Override restart behavior          |
| `data-broken-image-src`       | Override the fallback image        |
| `data-disable-cache`          | Bypass the persistent SVG cache    |
| `data-width`                  | Reserve loader width               |
| `data-height`                 | Reserve loader height              |
| `data-debug-timings`          | Enable detailed timing output      |
| `data-show-timings`           | Enable timing display or logging   |
| `data-show-console`           | Show TeX worker console output     |
| `data-tikzjax-options`        | Provide a local JSON configuration |

Example:

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="arrows.meta,positioning"
  data-render-timeout="45000"
  data-width="420"
  data-height="180"
>
\begin{tikzpicture}
    \node[
        draw,
        rounded corners
    ] (force) {
        $\vb{F}$
    };

    \node[
        draw,
        rounded corners,
        right=1.5cm of force
    ] {
        $m\vb{a}$
    };
\end{tikzpicture}
</script>
```

For all supported local options and their parsing priority, see [Global and Local Configuration](configuration-scopes.md).

---

## Local JSON configuration

Use `data-tikzjax-options` when several related local settings are required:

```html
<script
  type="text/tikz"
  data-tikzjax-options='{
    "renderTimeout": 45000,
    "maxRetries": 1,
    "tex": {
      "tikzLibraries": [
        "calc",
        "positioning"
      ],
      "texPackages": {
        "physics": ""
      }
    }
  }'
>
\begin{tikzpicture}
    % Diagram source
\end{tikzpicture}
</script>
```

The value must be valid JSON:

* property names require double quotes;
* string values require double quotes;
* trailing commas are not allowed;
* backslashes inside JSON strings must be escaped.

Dedicated local attributes override corresponding values from the general local JSON object.

Avoid defining the same option in both places unless the override is intentional.

---

## Fenced `tikzjax` blocks

A fenced block contains only TeX source:

````markdown
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

It cannot carry local HTML `data-*` attributes.

A package or library required by a fenced block must therefore be loaded globally.

For example:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            physics: ""
        },

        tikzLibraries: [
            "arrows.meta"
        ]
    }
};
```

The fenced block can then use those dependencies:

````markdown
```tikzjax
\begin{tikzpicture}
    \draw[-{Stealth}]
        (0,0) -- (3,0)
        node[midway, above] {$\vb{F}$};
\end{tikzpicture}
```
````

Use `<script type="text/tikz">` when a diagram needs specialized local dependencies.

---

## Configuration priority

TikZJax builds the effective configuration in this order:

```text
TikZJax defaults
< initial global configuration
< later partial global configuration
< local diagram configuration
```

Local values apply only to the current diagram.

They do not mutate the global configuration.

Nested objects are merged recursively, arrays are combined and deduplicated, and scalar values are replaced by later values.

The full merge behavior is documented in [Global and Local Configuration](configuration-scopes.md).

---

## Runtime partial updates

After TikZJax has loaded, use `window.TikzJaxConfigure()` to update part of the global configuration:

```js
window.TikzJaxConfigure({
    brokenImageSrc: "/images/custom-tikz-error.svg"
});
```

This updates the fallback image without erasing unrelated settings.

The function returns the resulting global configuration:

```js
const options = window.TikzJaxConfigure({
    renderTimeout: 45000
});

console.log(options);
```

A later assignment to `window.TikzJaxOptions` can also be merged after the configuration API has been installed:

```js
window.TikzJaxOptions = {
    renderTimeout: 45000
};
```

For clarity, `window.TikzJaxConfigure()` is recommended for runtime changes.

!!! warning

    Partial configuration is additive.

    It is suitable for extending arrays and objects or replacing scalar values, but it is not intended as a complete reset API.

---

## jsDelivr

The standard jsDelivr setup is:

```html
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

In most cases, `assetBaseUrl` does not need to be configured manually.

TikZJax resolves runtime assets relative to the JavaScript bundle's `dist/` directory.

The distribution includes files such as:

```text
tikzjax.min.js
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

An equivalent explicit configuration is:

```js
window.TikzJaxOptions = {
    assetBaseUrl:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist",

    workerMode: "auto"
};
```

---

## unpkg

The equivalent unpkg setup is:

```html
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Explicit configuration:

```js
window.TikzJaxOptions = {
    assetBaseUrl:
        "https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist",

    workerMode: "auto"
};
```

---

## Same-origin hosting

Use same-origin hosting when all runtime files are served from your own domain:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

Load the files with:

```html
<script src="/assets/javascripts/tikzjax.config.js"></script>
<link rel="stylesheet" href="/vendor/tikzjax/fonts.min.css">
<script src="/vendor/tikzjax/tikzjax.min.js"></script>
```

The server should expose:

```text
/vendor/tikzjax/tikzjax.min.js
/vendor/tikzjax/run-tex.js
/vendor/tikzjax/fonts.min.css
/vendor/tikzjax/tex.wasm.gz
/vendor/tikzjax/core.dump.gz
/vendor/tikzjax/tex_files/
/vendor/tikzjax/assets/broken-image.svg
```

All files should come from the same TikZJax release.

---

## Custom worker URL

Set `workerUrl` when the worker script is not located directly inside `assetBaseUrl`:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerUrl: "/vendor/tikzjax/workers/run-tex.js",
    workerMode: "direct"
};
```

The nested form is also supported:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",

    worker: {
        url: "/vendor/tikzjax/workers/run-tex.js",
        mode: "direct"
    }
};
```

Root-level `workerUrl` and `workerMode` take precedence over nested `worker.url` and `worker.mode`.

---

## Worker modes

TikZJax supports three worker startup modes:

| Mode       | Behavior                                                  |
| ---------- | --------------------------------------------------------- |
| `"auto"`   | Select direct or Blob startup according to the worker URL |
| `"blob"`   | Fetch the worker script and start it through a Blob URL   |
| `"direct"` | Start the worker directly with `new Worker(workerUrl)`    |

Example:

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

Recommended choices:

| Deployment                                    | Mode                 |
| --------------------------------------------- | -------------------- |
| jsDelivr or unpkg                             | `"auto"`             |
| Cross-origin worker with Blob workers allowed | `"auto"` or `"blob"` |
| Same-origin self-hosting                      | `"direct"`           |
| Strict CSP without `blob:` workers            | `"direct"`           |

---

## Content Security Policy

### CDN with Blob workers

Example configuration:

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

Typical directives:

```http
script-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'wasm-unsafe-eval';
style-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'unsafe-inline';
worker-src 'self' blob:;
connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
img-src 'self' https://cdn.jsdelivr.net https://unpkg.com data: blob:;
font-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
```

### Same-origin without Blob workers

Example configuration:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

Typical directives:

```http
script-src 'self' 'wasm-unsafe-eval';
style-src 'self' 'unsafe-inline';
worker-src 'self';
connect-src 'self';
img-src 'self' data:;
font-src 'self';
```

CSP requirements depend on the complete site and should be adapted to the application's existing policy.

---

## MkDocs Material

In MkDocs Material, preserve the same loading order in `overrides/main.html`:

```html
{% block libs %}
    {{ super() }}

    <script src="{{ 'assets/javascripts/tikzjax.config.js' | url }}"></script>

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
    >

    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
{% endblock %}
```

The configuration file remains local to the MkDocs site, while the runtime can be loaded from npm through jsDelivr.

See [MkDocs Installation](installation/mkdocs.md).

---

## Inspecting configuration

Inspect the active global configuration:

```js
window.TikzJaxOptions
```

Inspect the worker pool:

```js
window.TikzJaxOptions?.workerPool
```

Inspect global packages:

```js
window.TikzJaxOptions?.tex?.texPackages
```

Inspect global TikZ libraries:

```js
window.TikzJaxOptions?.tex?.tikzLibraries
```

Inspect the active `tkz-tab` configuration:

```js
window.TikzJaxOptions?.tkzTab
```

Apply and inspect a runtime update:

```js
const options = window.TikzJaxConfigure({
    renderTimeout: 45000
});

console.log(options);
```

Local effective configurations are created independently for each diagram and do not mutate these global values.

---

## Common configuration mistakes

### Loading the configuration after TikZJax

Incorrect:

```html
<script src="tikzjax.min.js"></script>
<script src="tikzjax.config.js"></script>
```

Correct:

```html
<script src="tikzjax.config.js"></script>
<script src="tikzjax.min.js"></script>
```

### Loading every optional package globally

This makes every diagram process a larger TeX preamble.

Load specialized packages locally.

### Confusing packages and TikZ libraries

Use:

```html
data-tex-packages="chemfig"
```

for a package, and:

```html
data-tikz-libraries="positioning"
```

for a TikZ library.

### Expecting fenced blocks to support local configuration

Fenced blocks cannot carry HTML attributes.

Use a `<script type="text/tikz">` block for local dependencies.

### Using invalid JSON

Incorrect:

```html
data-tikzjax-options='{renderTimeout:30000,}'
```

Correct:

```html
data-tikzjax-options='{"renderTimeout":30000}'
```

### Combining files from different releases

The JavaScript bundle, worker script, WebAssembly runtime, core dump, and `tex_files` directory must come from the same TikZJax version.

---

## Related documentation

* [Global and Local Configuration](configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](parallel-rendering.md)
* [HTML Installation](installation/html.md)
* [MkDocs Installation](installation/mkdocs.md)
* [Themes](themes.md)
* [Fallback and Error Images](fallback-error-images.md)
* [Cache and Performance](cache-performance.md)
* [API Reference](api-reference.md)
* [Runtime Architecture](architecture.md)
* [Troubleshooting](troubleshooting.md)
* [Examples](examples/index.md)
