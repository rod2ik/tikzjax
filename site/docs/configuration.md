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

Dark-mode explicit-color adaptation and foreground/background contrast correction are already enabled by default. A `theme` block is required only when theme detection, page palettes, target styling, or color tuning must be customized.

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

The built-in theme defaults already enable `theme.adaptiveColors` and its foreground/background contrast correction. They do not need to be repeated in a normal configuration file.

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
| `theme`                | Theme detection, palettes, adaptive SVG colors, contrast, and optional target styling |
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

TikZJax can detect light and dark themes and update generated SVG diagrams without recompiling their TeX sources.

Theme configuration is global and belongs in `window.TikzJaxOptions.theme`.

In Dark mode, TikZJax also adapts explicit chromatic SVG colors by default:

* dark or medium colors are moved towards vivid lighter variants;
* the perceived color family is preserved;
* blue-family colors are shifted slightly towards sky blue;
* foreground/background contrast can be corrected by darkening a detected filled background behind text, a bright outline, or a small light-neutral vector detail;
* very light non-text fills have a separate dark-mode adaptation stage.

Light mode restores the stored original chromatic SVG colors. The existing special handling of pure black and pure white remains separate from `adaptiveColors`.

### Built-in adaptive behavior

No explicit configuration is required to enable adaptive colors:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: true
    }
};
```

The block above only states the built-in behavior explicitly.

To disable explicit-color adaptation and its contrast stage:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: false
    }
};
```

The equivalent object form is:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            enabled: false
        }
    }
};
```

!!! note

    Disabling `adaptiveColors` does not disable the separate `adaptiveFills` stage.

    To preserve very light non-text fills as well, set `theme.adaptiveFills.enabled` to `false`.

---

### Attribute-based detection

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

### Class-based detection

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

---

### Theme detection and palette options

| Option                               | Type      | Default        | Purpose |
| ------------------------------------ | --------- | -------------- | ------- |
| `theme.selector`                     | `string`  | none           | CSS selector identifying one or more theme targets |
| `theme.attribute`                    | `string`  | `"data-theme"` | Attribute containing the current theme value |
| `theme.darkValue`                    | `string`  | `"dark"`       | Attribute value representing Dark mode |
| `theme.lightValue`                   | `string`  | `"light"`      | Attribute value representing Light mode |
| `theme.darkClass`                    | `string`  | `"dark"`       | CSS class representing Dark mode |
| `theme.lightClass`                   | `string`  | `"light"`      | CSS class representing Light mode |
| `theme.fallbackTheme`                | `string`  | `"light"`      | Theme used when no usable DOM state is found |
| `theme.defaultTheme`                 | `string`  | none           | Compatibility alias for the fallback theme |
| `theme.followSystemTheme`            | `boolean` | `false`        | Use `prefers-color-scheme` as a fallback |
| `theme.applyTargetStyles`            | `boolean` | `false`        | Apply the resolved palette to each selected target |
| `theme.lightBackgroundColor`         | `string`  | `"#ffffff"`    | Light-palette background color |
| `theme.lightTextColor`               | `string`  | `"#000000"`    | Light-palette text and default TikZ foreground color |
| `theme.darkBackgroundColor`          | `string`  | `"#1b1e2b"`    | Dark-palette background color |
| `theme.darkTextColor`                | `string`  | `"#ffffff"`    | Dark-palette text and default TikZ foreground color |

`theme.selector` is interpreted as a normal CSS selector and is passed to `document.querySelectorAll()`.

Examples include:

```js
selector: ".app"
```

```js
selector: "div.tikzjax"
```

```js
selector: "main > section.diagram-zone"
```

Every matching element becomes a configured theme target.

An invalid selector produces a warning in the browser Console and does not stop TikZJax.

---

### Adaptive explicit-color options

`theme.adaptiveColors` may be either:

* `true`;
* `false`;
* an object containing the options below.

| Option                                            | Type                 | Default | Purpose |
| ------------------------------------------------- | -------------------- | ------- | ------- |
| `theme.adaptiveColors`                            | `boolean` or `object` | built-in object | Enable, disable, or configure Dark-mode explicit-color adaptation |
| `theme.adaptiveColors.enabled`                    | `boolean`            | `true`  | Enable explicit-color adaptation and its contrast stage |
| `theme.adaptiveColors.strength`                   | `number`             | `1`     | Blend between the original color (`0`) and the fully adapted color (`1`) |
| `theme.adaptiveColors.minimumPerceptualLightness` | `number`             | `0.60`  | Minimum target perceptual lightness for adapted dark or medium colors |
| `theme.adaptiveColors.maximumPerceptualLightness` | `number`             | `0.82`  | Maximum target perceptual lightness, limiting washed-out pastel results |
| `theme.adaptiveColors.saturationBoost`            | `number`             | `0.18`  | Increase applied to chromatic saturation |
| `theme.adaptiveColors.minimumSaturation`          | `number`             | `0.52`  | Minimum saturation used for adapted chromatic colors |
| `theme.adaptiveColors.maximumSaturation`          | `number`             | `0.90`  | Maximum saturation used for adapted chromatic colors |
| `theme.adaptiveColors.chromaticThreshold`         | `number`             | `0.08`  | Saturation below which a color is treated as approximately neutral |
| `theme.adaptiveColors.hueShift.red`               | `number`             | `0`     | Hue rotation, in degrees, around the red family |
| `theme.adaptiveColors.hueShift.green`             | `number`             | `0`     | Hue rotation, in degrees, around the green family |
| `theme.adaptiveColors.hueShift.blue`              | `number`             | `-40`   | Hue rotation, in degrees, around the blue family |
| `theme.adaptiveColors.hueShiftRange`              | `number`             | `60`    | Angular influence range of each red, green, or blue family |
| `theme.adaptiveColors.hueShiftStrength`           | `number`             | `1`     | Global multiplier for all configured hue shifts |

TikZJax does not use a literal RGB negative. A literal negative would change blue to yellow, red to cyan, and green to magenta.

Instead, it raises perceptual lightness while preserving the color family. The default blue shift moves pure blue away from a violet-looking light blue and towards a vivid sky-blue result.

Pure black, pure white, `currentColor`, `none`, transparent paint, CSS variables, gradients, and patterns are excluded from this explicit-color transformation.

---

### Complete adaptive-color tuning block

The following block reproduces the built-in `adaptiveColors` defaults and can be copied as a tuning starting point:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            enabled: true,
            strength: 1,

            minimumPerceptualLightness: 0.60,
            maximumPerceptualLightness: 0.82,

            saturationBoost: 0.18,
            minimumSaturation: 0.52,
            maximumSaturation: 0.90,
            chromaticThreshold: 0.08,

            hueShift: {
                red: 0,
                green: 0,
                blue: -40
            },
            hueShiftRange: 60,
            hueShiftStrength: 1,

            contrast: {
                enabled: true,
                minimumRatio: 4.5,
                strength: 1,
                minimumBackgroundLightness: 0.04,
                containmentTolerance: 1
            }
        }
    }
};
```

The main supported ranges are:

* `strength` and `hueShiftStrength`: `0` to `1`;
* `minimumPerceptualLightness`: `0.5` to `1`;
* `maximumPerceptualLightness`: from the configured minimum up to `1`;
* saturation values: `0` to `1`;
* `chromaticThreshold`: `0` to `0.5`;
* `hueShiftRange`: `1` to `180` degrees.

Out-of-range values are clamped.

---

### Common color adjustments

Use a smaller adaptation strength for a result closer to the original TikZ colors:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            strength: 0.75
        }
    }
};
```

Use a less cyan blue:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            hueShift: {
                blue: -25
            }
        }
    }
};
```

Use a more sky-blue result:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            hueShift: {
                blue: -50
            }
        }
    }
};
```

Increase vividness:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            saturationBoost: 0.28,
            minimumSaturation: 0.60,
            maximumSaturation: 0.96
        }
    }
};
```

Increase the minimum brightness of medium colors:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            minimumPerceptualLightness: 0.68
        }
    }
};
```

Reduce `maximumPerceptualLightness` when adapted colors look too pale.

---

### Automatic foreground/background contrast

The contrast stage is enabled by default inside `adaptiveColors`.

| Option                                                     | Type      | Default | Purpose |
| ---------------------------------------------------------- | --------- | ------- | ------- |
| `theme.adaptiveColors.contrast.enabled`                    | `boolean` | `true`  | Enable Dark-mode foreground/background contrast correction |
| `theme.adaptiveColors.contrast.minimumRatio`               | `number`  | `4.5`   | Minimum requested relative-luminance contrast ratio |
| `theme.adaptiveColors.contrast.strength`                   | `number`  | `1`     | Blend between the current fill and the calculated darker fill |
| `theme.adaptiveColors.contrast.minimumBackgroundLightness` | `number`  | `0.04`  | Lowest HSL lightness allowed while darkening a background |
| `theme.adaptiveColors.contrast.containmentTolerance`       | `number`  | `1`     | Screen-space tolerance used when associating separate text or vector details with a containing shape |

In Dark mode, TikZJax evaluates three common foreground/background arrangements:

1. an SVG `<text>` element painted over a previously painted filled shape;
2. a bright neutral `stroke` belonging to the same element as its background `fill`;
3. a small bright-neutral vector shape painted over a larger previously painted filled shape.

TikZJax estimates the visible foreground and background colors, including fill opacity, stroke opacity, element opacity, and the effective page background. It then darkens the detected background fill when the contrast ratio is below `minimumRatio`.

The contrast stage changes only the detected background fill. It does not recolor the foreground text, outline, or vector detail.

Chromatic vector accents, such as a red target point, do not trigger the bright-neutral outline or vector-detail heuristic.

No new configuration option is required for this expanded detection.

Example with a stronger requested ratio:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            contrast: {
                minimumRatio: 5.5
            }
        }
    }
};
```

Apply only part of the calculated darkening:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            contrast: {
                strength: 0.8
            }
        }
    }
};
```

Disable only the contrast stage:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            contrast: {
                enabled: false
            }
        }
    }
};
```

!!! warning

    `adaptiveColors.strength` and `adaptiveColors.contrast.strength` are independent.

    Setting only `adaptiveColors.strength: 0` keeps explicit colors unchanged, but it does not disable contrast correction.

The accepted contrast ranges are:

* `minimumRatio`: `1` to `21`;
* `strength`: `0` to `1`;
* `minimumBackgroundLightness`: `0` to `0.5`;
* `containmentTolerance`: `0` to `20`.

Out-of-range values are clamped.

The automatic shape association is intentionally conservative. It targets common filled SVG shapes and may not identify gradients, patterns, complex masks, filters, unusual paint ordering, or every overlapping illustration.

`containmentTolerance` applies only when TikZJax must associate separate text or vector details with a background shape. The direct `fill`/`stroke` comparison on one SVG element does not use this tolerance.

A corrected background can be identified in the generated SVG by:

```html
data-tikzjax-contrast-adjusted="true"
```

---

### Very-light fill adaptation

Very light non-text fills use the separate `theme.adaptiveFills` stage.

| Option                                   | Type      | Default | Purpose |
| ---------------------------------------- | --------- | ------- | ------- |
| `theme.adaptiveFills.enabled`            | `boolean` | `true`  | Convert very light non-text fills into dark-mode fills |
| `theme.adaptiveFills.lightnessThreshold` | `number`  | `0.82`  | Minimum HSL lightness at which a fill is considered very light |
| `theme.adaptiveFills.darkLightness`      | `number`  | `0.23`  | Target HSL lightness for converted light fills |
| `theme.adaptiveFills.minimumSaturation`  | `number`  | `0.18`  | Minimum saturation for converted chromatic fills |
| `theme.adaptiveFills.maximumSaturation`  | `number`  | `0.46`  | Maximum saturation for converted chromatic fills |

Its purpose differs from `adaptiveColors`:

* `adaptiveFills` converts very light fills into darker Dark-mode fills;
* `adaptiveColors` converts dark or medium explicit colors into brighter variants;
* the contrast stage may darken a filled shape further when foreground text, a bright outline, or a small light-neutral vector detail is not readable enough.

To preserve very light fills exactly:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveFills: {
            enabled: false
        }
    }
};
```

Light mode restores the stored fill from before this transformation.

---

### Standalone HTML target styling

Target styling is opt-in.

With the built-in default:

```js
theme: {
    applyTargetStyles: false
}
```

TikZJax uses the configured target for theme detection but does not impose page-level background or text colors.

For a standalone HTML page, enable automatic styling explicitly:

```js
window.TikzJaxOptions = {
    theme: {
        selector: ".app",
        applyTargetStyles: true,

        lightBackgroundColor: "#ffffff",
        lightTextColor: "#000000",

        darkBackgroundColor: "#1b1e2b",
        darkTextColor: "#ffffff",

        darkClass: "dark",
        lightClass: "light",

        attribute: "data-theme",
        darkValue: "dark",
        lightValue: "light"
    }
};
```

The four color values can be omitted when the built-in palette is suitable.

When `applyTargetStyles` is enabled, TikZJax writes these inline properties on every matching target:

```css
background-color: <resolved background color>;
color: <resolved text color>;
```

It also publishes:

```css
--tikzjax-theme-background-color
--tikzjax-theme-text-color
--tikzjax-background-color
```

The custom properties are inherited by descendants and can be reused by page-specific CSS:

```css
.custom-panel {
    color:
        var(
            --tikzjax-theme-text-color
        );

    border-color:
        var(
            --tikzjax-theme-text-color
        );
}
```

TikZJax does not automatically create or recolor component borders.

Only elements matched by `theme.selector` receive the target styles. Elements outside the selected target remain under the page's own CSS.

---

### MkDocs Material behavior

For MkDocs Material, target styling remains disabled unless it is explicitly enabled.

A typical explicit detection configuration is:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        applyTargetStyles: false,
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default",
        fallbackTheme: "light",
        followSystemTheme: true
    }
};
```

Because `applyTargetStyles` defaults to `false`, Material remains responsible for the page background, text, navigation, code blocks, tables, cards, and admonitions.

The adaptive SVG stages still operate inside TikZJax diagrams in Dark mode. They do not restyle the surrounding Material page.

The configured palette colors still affect TikZJax wrapper foreground colors and fallback background colors. They can therefore customize diagram behavior without restyling the complete Material page.

To style one region deliberately inside Material, select a dedicated custom container rather than the complete page.

See [Themes](themes.md) for detailed theme detection, Light-mode restoration, adaptive colors, hue tuning, contrast limits, standalone styling, CSS variables, SVG adaptation, and MkDocs Material integration.

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

Inspect the active theme configuration:

```js
window.TikzJaxOptions?.theme
```

Inspect adaptive colors:

```js
window.TikzJaxOptions?.theme?.adaptiveColors
```

Inspect the contrast configuration:

```js
window.TikzJaxOptions?.theme?.adaptiveColors?.contrast
```

Inspect an explicitly configured very-light fill override:

```js
window.TikzJaxOptions?.theme?.adaptiveFills
```

When no `adaptiveFills` object was configured, this expression may be `undefined` even though the stage uses its built-in fallback values.

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

### Expecting `theme.selector` to style a target automatically

`theme.selector` identifies the element or elements used for theme detection.

It does not apply page-level colors unless:

```js
theme: {
    applyTargetStyles: true
}
```

### Styling the complete MkDocs Material page unintentionally

Keep `applyTargetStyles` disabled for normal Material integration.

When custom styling is required inside Material, target a dedicated container rather than `body` or the complete document.

### Expecting adaptive colors to require activation

`theme.adaptiveColors` is enabled by default.

Add an explicit block only when the built-in values must be tuned or the feature must be disabled.

### Setting `adaptiveColors.strength` to zero but still seeing contrast correction

The explicit-color strength and contrast strength are independent.

To disable contrast correction, use:

```js
theme: {
    adaptiveColors: {
        contrast: {
            enabled: false
        }
    }
}
```

### Disabling `adaptiveColors` but still seeing very light fills change

`adaptiveFills` is a separate stage and is also enabled by default.

Disable both stages when all explicit and very-light colors must remain fixed:

```js
theme: {
    adaptiveColors: false,

    adaptiveFills: {
        enabled: false
    }
}
```

### Expecting contrast correction for every complex SVG background

Automatic contrast correction uses SVG geometry, paint order, common filled shapes, and a conservative bright-neutral foreground heuristic.

It supports text over fills, bright outlines on the same filled element, and small light-neutral vector details over larger fills.

Gradients, patterns, masks, filters, chromatic vector accents, and complex overlapping illustrations may require explicit theme-compatible colors or separate Light and Dark variants.

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
