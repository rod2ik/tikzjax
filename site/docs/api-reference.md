# API Reference

This page is the complete reference for TikZJax configuration, local diagram attributes, source formats, events, and runtime files.

For practical examples, see:

* [Configuration](configuration.md)
* [Global and Local Configuration](configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](parallel-rendering.md)

---

## Global configuration object

TikZJax reads its global configuration from:

```js
window.TikzJaxOptions = {};
```

Define the initial configuration before loading `tikzjax.js` or `tikzjax.min.js`.

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

---

## Configuration priority

TikZJax builds the effective configuration in this order:

```text
TikZJax defaults
< initial global configuration
< later partial global configuration
< local diagram configuration
```

Values on the right have higher priority.

Local configuration affects only the current diagram. It does not mutate the global configuration object.

See [Global and Local Configuration](configuration-scopes.md) for detailed examples.

---

## Deep merge rules

TikZJax uses a recursive merge strategy.

| Value type           | Merge behavior                      |
| -------------------- | ----------------------------------- |
| Plain objects        | Merged recursively                  |
| Arrays               | Combined without duplicate entries  |
| Strings              | Later value replaces earlier value  |
| Numbers              | Later value replaces earlier value  |
| Booleans             | Later value replaces earlier value  |
| Local diagram values | Applied only to the current diagram |

Example:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: [
            "arrows.meta",
            "calc"
        ]
    }
};
```

After TikZJax has loaded:

```js
window.TikzJaxConfigure({
    tex: {
        tikzLibraries: [
            "calc",
            "positioning"
        ]
    }
});
```

The resulting array is equivalent to:

```js
[
    "arrows.meta",
    "calc",
    "positioning"
]
```

!!! warning "Partial updates are additive"
    The merge API is not a reset API.

    For example, assigning an empty array does not remove libraries that were already configured:

    ```js
    window.TikzJaxConfigure({
        tex: {
            tikzLibraries: []
        }
    });
    ```

---

## `window.TikzJaxConfigure()`

After TikZJax has loaded, update part of the global configuration with:

```js
window.TikzJaxConfigure({
    brokenImageSrc: "/images/custom-tikz-error.svg"
});
```

The function expects a plain JavaScript object.

It returns the resulting merged configuration:

```js
const options = window.TikzJaxConfigure({
    renderTimeout: 45000
});

console.log(options);
```

A later assignment to `window.TikzJaxOptions` also uses the merge API after TikZJax has installed it:

```js
window.TikzJaxOptions = {
    renderTimeout: 45000
};
```

For clarity, prefer `window.TikzJaxConfigure()` for runtime changes.

---

## Supported configuration structure

The following example shows the supported configuration groups.

You do not need to define every property:

```js
window.TikzJaxOptions = {
    assetBaseUrl: undefined,

    workerMode: "auto",
    workerUrl: "run-tex.js",

    worker: {
        mode: "auto",
        url: "run-tex.js",

        pool: {
            enabled: true,
            maxWorkers: 3,
            reserveCpuCores: 1,
            useDeviceMemory: true,
            initializationRetries: 1
        }
    },

    workerPool: {
        enabled: true,
        maxWorkers: 3,
        reserveCpuCores: 1,
        useDeviceMemory: true,
        initializationRetries: 1
    },

    renderTimeout: 15000,
    maxRetries: 0,
    restartWorkerOnFail: true,

    brokenImageSrc: undefined,

    disableCache: false,

    width: 75,
    height: 75,

    debugTimings: false,
    showTimings: false,

    theme: {
        selector: undefined,
        attribute: "data-theme",
        darkValue: "dark",
        lightValue: "light",
        darkClass: "dark",
        lightClass: "light",
        fallbackTheme: "light",
        defaultTheme: "light",
        followSystemTheme: false
    },

    tex: {
        texPackages: {},
        tikzLibraries: [],
        addToPreamble: "",

        renderTimeout: 15000,
        maxRetries: 0,
        restartWorkerOnFail: true
    },

    tkzTab: {
        autoApply: true,

        lineWidth: "1.2pt",
        font: "\\Large",

        lgt: 10,
        firstColumnWidth: undefined,
        espcl: 3.2,

        init: {},
        setup: {},
        colors: {},

        variableRowHeight: 1.2,
        signRowHeight: 2.2,
        variationRowHeight: 2.2,
        imageRowHeight: 2.2,
        antecedentRowHeight: 2.2
    }
};
```

`workerPool` is the recommended pool configuration location.

`worker.pool` is a supported nested alias.

---

## Global options

### Root-option summary

| Option                | Type                           |                     Default | Description                                             |
| --------------------- | ------------------------------ | --------------------------: | ------------------------------------------------------- |
| `assetBaseUrl`        | `string`                       | JavaScript bundle directory | Base URL for runtime assets                             |
| `workerMode`          | `"auto"`, `"direct"`, `"blob"` |                    `"auto"` | Worker startup mode                                     |
| `workerUrl`           | `string`                       |              `"run-tex.js"` | Worker script path                                      |
| `worker`              | `object`                       |                        `{}` | Nested worker configuration                             |
| `workerPool`          | `object` or `false`            |                     enabled | Parallel worker-pool configuration                      |
| `renderTimeout`       | `number`                       |                     `15000` | Maximum milliseconds per rendering attempt              |
| `maxRetries`          | `number`                       |                         `0` | Retry attempts after the initial failure                |
| `restartWorkerOnFail` | `boolean`                      |                      `true` | Restart a failed worker                                 |
| `brokenImageSrc`      | `string`                       |            bundled fallback | Error image URL                                         |
| `disableCache`        | `boolean`                      |                     `false` | Globally bypass persistent SVG caching                  |
| `width`               | `number`                       |                        `75` | Default loader width in TeX points                      |
| `height`              | `number`                       |                        `75` | Default loader height in TeX points                     |
| `debugTimings`        | `boolean`                      |                     `false` | Log worker timing stages                                |
| `showTimings`         | `boolean`                      |                     `false` | Alias enabling worker timing logs                       |
| `theme`               | `object`                       |         automatic detection | Theme-detection configuration                           |
| `tex`                 | `object`                       |                        `{}` | Packages, libraries, preamble, and legacy safety values |
| `tkzTab`              | `object`                       |     built-in style defaults | Automatic native `tkz-tab` defaults and helper macros   |

---

### `assetBaseUrl`

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax"
};
```

`assetBaseUrl` is used to resolve runtime assets such as:

```text
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

When omitted, TikZJax derives it from the directory containing the loaded `tikzjax.js` or `tikzjax.min.js` file.

For example:

```text
https://cdn.example.com/tikzjax/dist/tikzjax.min.js
```

produces the default asset root:

```text
https://cdn.example.com/tikzjax/dist
```

!!! important
    Configure `assetBaseUrl` before loading TikZJax.

    The resolved asset root is established during TikZJax initialization.

---

### `workerUrl`

```js
window.TikzJaxOptions = {
    workerUrl: "/vendor/tikzjax/run-tex.js"
};
```

A relative `workerUrl` is resolved against `assetBaseUrl`.

The nested alias is:

```js
window.TikzJaxOptions = {
    worker: {
        url: "/vendor/tikzjax/run-tex.js"
    }
};
```

When both are present, the root value takes precedence:

```js
window.TikzJaxOptions = {
    workerUrl: "/workers/root-worker.js",

    worker: {
        url: "/workers/nested-worker.js"
    }
};
```

The effective URL is:

```text
/workers/root-worker.js
```

---

### `workerMode`

Supported values are:

```text
auto
direct
blob
```

Invalid values produce a warning and fall back to `"auto"`.

#### `"auto"`

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

Behavior:

| Worker URL   | Startup behavior                    |
| ------------ | ----------------------------------- |
| Same origin  | Direct `Worker`                     |
| Cross origin | Fetch script and create Blob Worker |

This is the recommended default for CDN usage.

#### `"direct"`

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

TikZJax starts the worker with:

```js
new Worker(workerUrl)
```

Use direct mode for same-origin deployments or CSP policies that do not allow Blob workers.

#### `"blob"`

```js
window.TikzJaxOptions = {
    workerMode: "blob"
};
```

TikZJax:

1. fetches the worker JavaScript;
2. creates a JavaScript `Blob`;
3. creates a temporary Blob URL;
4. starts the worker from that URL.

This requires a CSP that allows:

```http
worker-src blob:;
```

#### Nested alias

```js
window.TikzJaxOptions = {
    worker: {
        mode: "auto"
    }
};
```

Root `workerMode` takes precedence over `worker.mode`.

---

## Worker-pool options

### `workerPool`

Recommended configuration:

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

Supported nested alias:

```js
window.TikzJaxOptions = {
    worker: {
        pool: {
            enabled: true,
            maxWorkers: 3,
            reserveCpuCores: 1,
            useDeviceMemory: true,
            initializationRetries: 1
        }
    }
};
```

A root `workerPool` object takes precedence over `worker.pool`.

---

### `workerPool.enabled`

| Type      | Default |
| --------- | ------: |
| `boolean` |  `true` |

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: false
    }
};
```

When disabled, TikZJax uses one rendering worker.

It does not disable Web Worker rendering entirely.

Equivalent shorthand:

```js
window.TikzJaxOptions = {
    workerPool: false
};
```

---

### `workerPool.maxWorkers`

| Type     | Default | Minimum |
| -------- | ------: | ------: |
| `number` |     `3` |     `1` |

```js
window.TikzJaxOptions = {
    workerPool: {
        maxWorkers: 3
    }
};
```

This is the hard upper limit for concurrently initialized rendering workers.

The effective count can be lower because of:

* the current workload;
* available logical CPU cores;
* `reserveCpuCores`;
* the device-memory limit.

---

### `workerPool.reserveCpuCores`

| Type     | Default | Minimum |
| -------- | ------: | ------: |
| `number` |     `1` |     `0` |

```js
window.TikzJaxOptions = {
    workerPool: {
        reserveCpuCores: 1
    }
};
```

TikZJax calculates a CPU-based limit similar to:

```text
max(
    1,
    navigator.hardwareConcurrency - reserveCpuCores
)
```

When `navigator.hardwareConcurrency` is unavailable or invalid, TikZJax uses `4` as its fallback processor count.

---

### `workerPool.useDeviceMemory`

| Type      | Default |
| --------- | ------: |
| `boolean` |  `true` |

```js
window.TikzJaxOptions = {
    workerPool: {
        useDeviceMemory: true
    }
};
```

When the browser exposes `navigator.deviceMemory`, TikZJax applies this memory-based limit:

| Reported memory                  | Worker limit |
| -------------------------------- | -----------: |
| `2 GiB` or less                  |          `1` |
| More than `2 GiB`, up to `4 GiB` |          `2` |
| More than `4 GiB`, up to `8 GiB` |          `3` |
| More than `8 GiB`                |          `4` |

When device-memory information is unavailable, no memory-specific limit is added.

---

### `workerPool.initializationRetries`

| Type     | Default | Minimum |
| -------- | ------: | ------: |
| `number` |     `1` |     `0` |

```js
window.TikzJaxOptions = {
    workerPool: {
        initializationRetries: 1
    }
};
```

The value is the number of retries after the initial worker-initialization attempt.

With:

```text
initializationRetries = 1
```

TikZJax can make:

```text
initial attempt
+ one retry
```

Initialization retries are separate from diagram-render retries.

---

### Effective worker count

For an active workload, the effective worker count is bounded by:

```text
pending and active workload
maxWorkers
CPU limit
memory limit
```

Conceptually:

```text
effective workers =
max(
    1,
    min(
        workload,
        maxWorkers,
        CPU limit,
        memory limit
    )
)
```

When no work is pending:

```text
effective workers = 0
```

Workers are initialized lazily when rendering work exists.

See [Parallel Rendering and the Worker Pool](parallel-rendering.md).

---

## Render-safety options

### `renderTimeout`

| Type     | Default | Minimum |
| -------- | ------: | ------: |
| `number` | `15000` |     `1` |

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

The value is expressed in milliseconds and applies to each rendering attempt.

A local value has the highest priority:

```html
<script
  type="text/tikz"
  data-render-timeout="45000"
>
...
</script>
```

Priority:

```text
local data-render-timeout
> root renderTimeout
> tex.renderTimeout
> 15000
```

---

### `maxRetries`

| Type     | Default | Minimum |
| -------- | ------: | ------: |
| `number` |     `0` |     `0` |

```js
window.TikzJaxOptions = {
    maxRetries: 1
};
```

This is the number of retries after the initial rendering attempt.

With:

```text
maxRetries = 1
```

TikZJax can make:

```text
initial attempt
+ one retry
```

Priority:

```text
local data-max-retries
> root maxRetries
> tex.maxRetries
> 0
```

---

### `restartWorkerOnFail`

| Type      | Default |
| --------- | ------: |
| `boolean` |  `true` |

```js
window.TikzJaxOptions = {
    restartWorkerOnFail: true
};
```

When enabled, TikZJax can replace a worker after a render failure.

A timeout always requires the affected worker runtime to be restarted before reuse.

Priority:

```text
local data-restart-worker-on-fail
> root restartWorkerOnFail
> tex.restartWorkerOnFail
> true
```

---

### Nested `tex` safety aliases

The following legacy-compatible form remains supported:

```js
window.TikzJaxOptions = {
    tex: {
        renderTimeout: 30000,
        maxRetries: 1,
        restartWorkerOnFail: true
    }
};
```

Root-level values take precedence:

```js
window.TikzJaxOptions = {
    renderTimeout: 10000,

    tex: {
        renderTimeout: 30000
    }
};
```

The effective timeout is:

```text
10000
```

---

## Cache and loader options

### `brokenImageSrc`

| Type     | Default                                                |
| -------- | ------------------------------------------------------ |
| `string` | `assets/broken-image.svg` resolved from the asset root |

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/images/tikz-error.svg"
};
```

Local override:

```html
<script
  type="text/tikz"
  data-broken-image-src="/images/local-error.svg"
>
...
</script>
```

See [Fallback and Error Images](fallback-error-images.md).

---

### `disableCache`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

Global cache bypass:

```js
window.TikzJaxOptions = {
    disableCache: true
};
```

Local cache bypass:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
>
...
</script>
```

When enabled:

* TikZJax does not read the persistent SVG cache for the diagram;
* it does not write the result to the persistent SVG cache;
* pending-job grouping is not used for that cache-disabled rendering identity.

Use this primarily during debugging.

---

### `width`

| Type     | Default |
| -------- | ------: |
| `number` |    `75` |

Sets the minimum width of the loading placeholder in TeX points.

```js
window.TikzJaxOptions = {
    width: 180
};
```

Local value:

```html
<script
  type="text/tikz"
  data-width="320"
>
...
</script>
```

TikZJax applies the value as:

```text
320pt
```

It does not resize the final SVG.

---

### `height`

| Type     | Default |
| -------- | ------: |
| `number` |    `75` |

Sets the minimum height of the loading placeholder in TeX points.

```html
<script
  type="text/tikz"
  data-height="180"
>
...
</script>
```

It does not resize the final SVG.

---

## Timing options

### `debugTimings`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

```js
window.TikzJaxOptions = {
    debugTimings: true
};
```

Local value:

```html
<script
  type="text/tikz"
  data-debug-timings="true"
>
...
</script>
```

The worker logs stages such as:

```text
[TikZJax timing] TeX compilation: 123.4 ms
[TikZJax timing] DVI to HTML: 18.7 ms
```

---

### `showTimings`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

`showTimings` enables the same worker timing measurements as `debugTimings`.

```html
<script
  type="text/tikz"
  data-show-timings="true"
>
...
</script>
```

Either option is sufficient.

---

## Theme options

TikZJax can detect a theme from:

* a configured selector and attribute;
* configured dark and light classes;
* nearby `data-theme` attributes;
* `data-bs-theme`;
* `data-color-scheme`;
* MkDocs Material's `data-md-color-scheme`;
* the configured fallback;
* the operating-system preference when enabled.

See [Themes](themes.md) for complete behavior.

---

### `theme.selector`

| Type     | Default |
| -------- | ------- |
| `string` | none    |

```js
window.TikzJaxOptions = {
    theme: {
        selector: "html"
    }
};
```

TikZJax queries all matching elements and checks whether one contains the rendered diagram.

An invalid selector produces a browser-console warning.

---

### `theme.attribute`

| Type     | Default        |
| -------- | -------------- |
| `string` | `"data-theme"` |

```js
window.TikzJaxOptions = {
    theme: {
        attribute: "data-color-mode"
    }
};
```

---

### `theme.darkValue`

| Type     | Default  |
| -------- | -------- |
| `string` | `"dark"` |

```js
window.TikzJaxOptions = {
    theme: {
        darkValue: "night"
    }
};
```

---

### `theme.lightValue`

| Type     | Default   |
| -------- | --------- |
| `string` | `"light"` |

```js
window.TikzJaxOptions = {
    theme: {
        lightValue: "day"
    }
};
```

---

### `theme.darkClass`

| Type     | Default  |
| -------- | -------- |
| `string` | `"dark"` |

```js
window.TikzJaxOptions = {
    theme: {
        darkClass: "theme-dark"
    }
};
```

---

### `theme.lightClass`

| Type     | Default   |
| -------- | --------- |
| `string` | `"light"` |

```js
window.TikzJaxOptions = {
    theme: {
        lightClass: "theme-light"
    }
};
```

---

### `theme.fallbackTheme`

| Type                  | Default   |
| --------------------- | --------- |
| `"light"` or `"dark"` | `"light"` |

```js
window.TikzJaxOptions = {
    theme: {
        fallbackTheme: "dark"
    }
};
```

`fallbackTheme` takes precedence over `defaultTheme`.

---

### `theme.defaultTheme`

| Type                  | Default   |
| --------------------- | --------- |
| `"light"` or `"dark"` | `"light"` |

Legacy-compatible alias used when `fallbackTheme` is not defined.

---

### `theme.followSystemTheme`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

```js
window.TikzJaxOptions = {
    theme: {
        followSystemTheme: true
    }
};
```

The system preference is used only when a valid `fallbackTheme` or `defaultTheme` has not already selected the result.

---

### Attribute-based theme example

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

---

### Class-based theme example

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

## TeX options

### `tex.texPackages`

| Accepted type          | Description                            |
| ---------------------- | -------------------------------------- |
| Plain object           | Package names mapped to option strings |
| Array                  | Package names without options          |
| Comma-separated string | Package names without options          |
| JSON object string     | Package names mapped to option strings |

Recommended global form:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsfonts: "",
            amssymb: "",
            xcolor: "dvipsnames"
        }
    }
};
```

Conceptual TeX output:

```latex
\usepackage{amsfonts}
\usepackage{amssymb}
\usepackage[dvipsnames]{xcolor}
```

Values equal to:

```text
undefined
null
false
""
```

produce a package without options.

---

### Global package array

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: [
            "amsfonts",
            "physics"
        ]
    }
};
```

---

### Global comma-separated packages

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: "amsfonts,physics"
    }
};
```

---

### Local packages

One package:

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
...
</script>
```

Several packages:

```html
<script
  type="text/tikz"
  data-tex-packages="physics,chemfig"
>
...
</script>
```

Packages with options:

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "physics": "",
    "xcolor": "dvipsnames"
  }'
>
...
</script>
```

If the same package exists globally and locally, the local option string replaces the global option string for that diagram.

---

### `tex.tikzLibraries`

| Accepted type          | Description                    |
| ---------------------- | ------------------------------ |
| Array                  | Recommended global form        |
| Comma-separated string | Supported global or local form |

Array:

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

String:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries:
            "arrows.meta,calc,positioning"
    }
};
```

Local libraries:

```html
<script
  type="text/tikz"
  data-tikz-libraries="calc,positioning"
>
...
</script>
```

Global and local libraries are combined without duplicate entries.

---

### `tex.addToPreamble`

| Type     | Default |
| -------- | ------- |
| `string` | `""`    |

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

The custom source is inserted before:

```latex
\begin{document}
```

#### Local preamble

```html
<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\localR}{\mathbb{R}}"
>
...
</script>
```

!!! important "Replacement behavior"
    `addToPreamble` is a scalar string.

    Therefore, a local `data-add-to-preamble` value replaces the global custom `tex.addToPreamble` value for that diagram.

    It is not automatically appended to the global custom preamble.

    The TikZJax-generated `tkz-tab` preamble, including helper macros and automatic native defaults, is still placed before the resulting custom preamble.

---

### Legacy root TeX aliases

These aliases remain supported:

```js
window.TikzJaxOptions = {
    texPackages: {
        amsfonts: ""
    },

    tikzLibraries:
        "arrows.meta,calc",

    addToPreamble:
        "\\newcommand{\\R}{\\mathbb{R}}"
};
```

The recommended form is:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsfonts: ""
        },

        tikzLibraries: [
            "arrows.meta",
            "calc"
        ],

        addToPreamble:
            "\\newcommand{\\R}{\\mathbb{R}}"
    }
};
```

---

## `tkzTab` options

The `tkzTab` object centralizes defaults for `tkz-tab` tables.

It has two distinct roles:

1. it generates public `\tikzjaxTkzTab...` helper macros;
2. when `autoApply` is enabled, it converts supported values into native `tkz-tab` defaults.

The styling object does not load the LaTeX package by itself. Load `tkz-tab` globally through `tex.texPackages`, or locally with `data-tex-packages="tkz-tab"`.

### `tkzTab` priority

The effective priority is:

```text
native tkz-tab defaults
< built-in TikZJax tkzTab defaults
< initial global configuration
< later partial global configuration
< local data-tkz-tab configuration
< explicit TeX options such as \tkzTabInit[lw=...]
```

Values on the right have higher priority.

Within one merged `tkzTab` object, keys in `tkzTab.init` override the corresponding automatically derived `lgt`, `espcl`, and `lw` values.

### `tkzTab` option summary

| Option                           | Type      | Default    | Automatic behavior |
| -------------------------------- | --------- | ---------- | ------------------ |
| `tkzTab.autoApply`               | `boolean` | `true`     | Enables conversion into native `tkz-tab` defaults |
| `tkzTab.lineWidth`               | scalar    | `"1.2pt"`  | Sets native `lw`, refreshes package line styles, and defines `\tikzjaxTkzTabLineWidth` |
| `tkzTab.font`                    | scalar    | `"\\Large"` | Appends the font to every node in the current `tkz-tab` render and defines `\tikzjaxTkzTabFont` |
| `tkzTab.lgt`                     | scalar    | `10`       | Used as the first-column width when `firstColumnWidth` is absent; also defines `\tikzjaxTkzTabLgt` |
| `tkzTab.firstColumnWidth`        | scalar    | `undefined` | Overrides the automatic native `lgt` value and defines `\tikzjaxTkzTabFirstColumnWidth` |
| `tkzTab.espcl`                   | scalar    | `3.2`      | Sets native `espcl` and defines `\tikzjaxTkzTabEspcl` |
| `tkzTab.init`                    | object    | `{}`       | Adds or overrides native `\tkzTabInit` preset keys |
| `tkzTab.setup`                   | object    | `{}`       | Passes options to native `\tkzTabSetup` |
| `tkzTab.colors`                  | object    | `{}`       | Passes options to native `\tkzTabColors` |
| `tkzTab.variableRowHeight`       | scalar    | `1.2`      | Defines a helper macro only |
| `tkzTab.signRowHeight`           | scalar    | `2.2`      | Defines a helper macro only |
| `tkzTab.variationRowHeight`      | scalar    | `2.2`      | Defines a helper macro only |
| `tkzTab.imageRowHeight`          | scalar    | `2.2`      | Defines a helper macro only |
| `tkzTab.antecedentRowHeight`     | scalar    | `2.2`      | Defines a helper macro only |

A scalar value may be a string, number, or boolean accepted by the corresponding TeX key.

### Automatic global defaults

Example:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            "tkz-tab": ""
        }
    },

    tkzTab: {
        lineWidth: "1.6pt",
        font: "\\large",
        lgt: 5,
        espcl: 2.6
    }
};
```

With `autoApply: true`, the following source automatically receives those values even though it contains no TikZJax helper macros:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \tkzTabInit
        {$x$/1,$f'(x)$/1,$f(x)$/2}
        {$-\infty$,$0$,$+\infty$}

    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/$+\infty$,-/$0$,+/$+\infty$}
\end{tikzpicture}
</script>
```

An explicit option remains higher priority:

```latex
\tkzTabInit[
    lw=0.6pt,
    lgt=3
]
```

### `tkzTab.autoApply`

| Type      | Default |
| --------- | ------: |
| `boolean` |  `true` |

Disable automatic native defaults with:

```js
window.TikzJaxOptions = {
    tkzTab: {
        autoApply: false
    }
};
```

The public helper macros are still generated when `autoApply` is disabled.

### `tkzTab.lineWidth`

| Type     | Default   |
| -------- | --------- |
| scalar   | `"1.2pt"` |

When automatic application is enabled, this value:

- becomes the default `lw` value of `\tkzTabInit`;
- replaces the package default line width used when native styles are refreshed;
- remains available as `\tikzjaxTkzTabLineWidth`.

Example:

```js
window.TikzJaxOptions = {
    tkzTab: {
        lineWidth: "2pt"
    }
};
```

### `tkzTab.font`

| Type   | Default    |
| ------ | ---------- |
| scalar | `"\\Large"` |

The font is appended to the `every node` TikZ style for a render that loads `tkz-tab`.

It remains available as:

```text
\tikzjaxTkzTabFont
```

### `tkzTab.lgt` and `tkzTab.firstColumnWidth`

The effective automatic first-column width is:

```text
tkzTab.firstColumnWidth
?? tkzTab.lgt
```

Therefore:

```js
window.TikzJaxOptions = {
    tkzTab: {
        lgt: 5
    }
};
```

automatically sets native `lgt=5`.

This form separates the native first-column width from the reusable `lgt` helper:

```js
window.TikzJaxOptions = {
    tkzTab: {
        lgt: 5,
        firstColumnWidth: 6
    }
};
```

The native table default becomes `lgt=6`, while `\tikzjaxTkzTabLgt` remains `5`.

### `tkzTab.espcl`

| Type   | Default |
| ------ | ------: |
| scalar |   `3.2` |

The value becomes the native `espcl` default and remains available as:

```text
\tikzjaxTkzTabEspcl
```

### `tkzTab.init`

`tkzTab.init` is serialized as native `\tkzTabInit` preset keys.

Example:

```js
window.TikzJaxOptions = {
    tkzTab: {
        lineWidth: "1.6pt",
        lgt: 5,
        espcl: 2.6,

        init: {
            lw: "2pt",
            lgt: 6,
            deltacl: 0.8
        }
    }
};
```

In this example, the `init` values `lw=2pt` and `lgt=6` override the automatically derived values from `lineWidth` and `lgt`.

Only scalar values are serialized. Invalid key names and nested objects are ignored.

### `tkzTab.setup`

`tkzTab.setup` is serialized and passed to native `\tkzTabSetup`.

Example:

```js
window.TikzJaxOptions = {
    tkzTab: {
        setup: {
            arrowlinewidth: "1.2pt",
            fromstyle: "dashed"
        }
    }
};
```

Only scalar values are serialized. Invalid key names and nested objects are ignored.

### `tkzTab.colors`

`tkzTab.colors` is serialized and passed to native `\tkzTabColors`.

Example:

```js
window.TikzJaxOptions = {
    tkzTab: {
        colors: {
            color: "black",
            backgroundcolor: "white"
        }
    }
};
```

Only scalar values are serialized. Invalid key names and nested objects are ignored.

### Row-height helper macros

Row heights are part of the mandatory `label/height` list passed directly to `\tkzTabInit`.

TikZJax cannot safely infer which row is a variable row, sign row, variation row, image row, or antecedent row. These values therefore remain explicit helper macros:

| Option                           | Generated macro                     |
| -------------------------------- | ----------------------------------- |
| `tkzTab.variableRowHeight`       | `\tikzjaxTkzTabVariableRowHeight`   |
| `tkzTab.signRowHeight`           | `\tikzjaxTkzTabSignRowHeight`       |
| `tkzTab.variationRowHeight`      | `\tikzjaxTkzTabVariationRowHeight`  |
| `tkzTab.imageRowHeight`          | `\tikzjaxTkzTabImageRowHeight`      |
| `tkzTab.antecedentRowHeight`     | `\tikzjaxTkzTabAntecedentRowHeight` |

Example:

```latex
\tkzTabInit
    {
        $x$/\tikzjaxTkzTabVariableRowHeight,
        $f'(x)$/\tikzjaxTkzTabSignRowHeight,
        $f(x)$/\tikzjaxTkzTabVariationRowHeight
    }
    {$-\infty$,$0$,$+\infty$}
```

### Complete helper-macro list

The following macros remain available:

```text
\tikzjaxTkzTabLineWidth
\tikzjaxTkzTabFont
\tikzjaxTkzTabLgt
\tikzjaxTkzTabFirstColumnWidth
\tikzjaxTkzTabEspcl
\tikzjaxTkzTabVariableRowHeight
\tikzjaxTkzTabSignRowHeight
\tikzjaxTkzTabVariationRowHeight
\tikzjaxTkzTabImageRowHeight
\tikzjaxTkzTabAntecedentRowHeight
```

### Local `tkzTab` configuration

A diagram can override or extend the merged global values with `data-tkz-tab`:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-tkz-tab='{
    "lineWidth": "1.4pt",
    "font": "\\Large",
    "firstColumnWidth": 5,
    "espcl": 3,
    "init": {
      "deltacl": 0.8
    },
    "setup": {
      "arrowlinewidth": "1pt"
    }
  }'
>
...
</script>
```

Local values affect only that diagram.

See the [`tkz-tab` examples](examples/tkz-tab.md).

---

## Local diagram attributes

Local attributes are normally placed on:

```html
<script type="text/tikz">
...
</script>
```

They affect only the current diagram.

---

### Attribute summary

| HTML attribute                | Dataset key           | Type                   | Purpose                          |
| ----------------------------- | --------------------- | ---------------------- | -------------------------------- |
| `data-options`                | `options`             | JSON object            | Legacy general local options     |
| `data-tikzjax-options`        | `tikzjaxOptions`      | JSON object            | General local TikZJax options    |
| `data-tex`                    | `tex`                 | JSON object            | Local nested `tex` configuration |
| `data-tex-packages`           | `texPackages`         | string or JSON         | Local LaTeX packages             |
| `data-tikz-libraries`         | `tikzLibraries`       | comma-separated string | Local TikZ libraries             |
| `data-add-to-preamble`        | `addToPreamble`       | string                 | Local custom preamble            |
| `data-tkz-tab`                | `tkzTab`              | JSON object            | Local `tkzTab` values            |
| `data-render-timeout`         | `renderTimeout`       | number                 | Local timeout                    |
| `data-max-retries`            | `maxRetries`          | number                 | Local retry count                |
| `data-restart-worker-on-fail` | `restartWorkerOnFail` | boolean                | Local restart policy             |
| `data-broken-image-src`       | `brokenImageSrc`      | string                 | Local error image                |
| `data-disable-cache`          | `disableCache`        | boolean                | Bypass SVG cache                 |
| `data-width`                  | `width`               | number                 | Loader width in points           |
| `data-height`                 | `height`              | number                 | Loader height in points          |
| `data-debug-timings`          | `debugTimings`        | boolean                | Log worker timings               |
| `data-show-timings`           | `showTimings`         | boolean                | Log worker timings               |
| `data-show-console`           | `showConsole`         | boolean-like           | Stream TeX console output        |
| `data-render-priority`        | `renderPriority`      | number                 | Explicit queue-priority hint     |

---

### Local parsing order

Local configuration is interpreted in this order:

```text
data-options
< data-tikzjax-options
< data-tex
< data-tex-packages
< data-tikz-libraries
< data-add-to-preamble
< data-tkz-tab
< dedicated scalar attributes
```

Later entries have higher local priority when they define the same property.

Dedicated scalar attributes are:

```text
data-render-timeout
data-max-retries
data-restart-worker-on-fail
data-broken-image-src
data-disable-cache
data-width
data-height
data-debug-timings
data-show-timings
```

`data-show-console` and `data-render-priority` are carried as direct runtime or scheduler values rather than being merged through the same scalar-option list.

---

### `data-options`

Legacy JSON configuration attribute:

```html
<script
  type="text/tikz"
  data-options='{
    "renderTimeout": 30000
  }'
>
...
</script>
```

`data-tikzjax-options` is preferred for new documentation.

---

### `data-tikzjax-options`

```html
<script
  type="text/tikz"
  data-tikzjax-options='{
    "renderTimeout": 30000,
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
...
</script>
```

The value must be a valid JSON object.

---

### `data-tex`

Provides a local nested `tex` object:

```html
<script
  type="text/tikz"
  data-tex='{
    "texPackages": {
      "physics": ""
    },
    "tikzLibraries": [
      "arrows.meta"
    ],
    "addToPreamble":
      "\\newcommand{\\localR}{\\mathbb{R}}"
  }'
>
...
</script>
```

---

### `data-tex-packages`

Simple syntax:

```html
data-tex-packages="physics"
```

Comma-separated syntax:

```html
data-tex-packages="physics,chemfig"
```

JSON syntax:

```html
data-tex-packages='{
  "physics": "",
  "xcolor": "dvipsnames"
}'
```

---

### `data-tikz-libraries`

```html
data-tikz-libraries="arrows.meta,calc,positioning"
```

Whitespace is removed around individual library names.

---

### `data-add-to-preamble`

```html
data-add-to-preamble="\newcommand{\localR}{\mathbb{R}}"
```

This replaces the configured global custom `addToPreamble` string for the current diagram.

---

### `data-tkz-tab`

The value must be a valid JSON object:

```html
data-tkz-tab='{
  "lineWidth": "1.4pt",
  "font": "\\Large",
  "firstColumnWidth": 5,
  "espcl": 3,
  "init": {
    "deltacl": 0.8
  },
  "setup": {
    "arrowlinewidth": "1pt"
  },
  "colors": {
    "color": "black",
    "backgroundcolor": "white"
  }
}'
```

The object is recursively merged with the global `tkzTab` configuration.

When `autoApply` is enabled, supported local values become native `tkz-tab` defaults for this diagram. Explicit TeX options in `\tkzTabInit[...]` still have higher priority.

Backslashes inside JSON strings must be escaped.


---

### `data-render-timeout`

```html
data-render-timeout="45000"
```

The minimum valid value is `1`.

Invalid values fall back to the next available configured value.

---

### `data-max-retries`

```html
data-max-retries="1"
```

The minimum valid value is `0`.

---

### `data-restart-worker-on-fail`

```html
data-restart-worker-on-fail="true"
```

Common accepted values include:

```text
true
false
1
0
yes
no
on
off
```

---

### `data-broken-image-src`

```html
data-broken-image-src="/images/local-error.svg"
```

The value applies only if this diagram fails.

---

### `data-disable-cache`

```html
data-disable-cache="true"
```

Use this during development when every reload should trigger a new TeX compilation.

---

### `data-width`

```html
data-width="420"
```

The loader reserves a minimum width of:

```text
420pt
```

---

### `data-height`

```html
data-height="220"
```

The loader reserves a minimum height of:

```text
220pt
```

---

### `data-debug-timings`

```html
data-debug-timings="true"
```

Enables worker timing logs.

---

### `data-show-timings`

```html
data-show-timings="true"
```

Alias that enables the same timing logs.

---

### `data-show-console`

```html
data-show-console="true"
```

Streams TeX console output to the browser console.

This can produce a large amount of output.

!!! important
    Enable this option with:

    ```html
    data-show-console="true"
    ```

    Omit the attribute to disable it.

    Do not rely on `data-show-console="false"` as a disabling form.

---

### `data-render-priority`

```html
<script
  type="text/tikz"
  data-render-priority="-10"
>
...
</script>
```

This advanced attribute overrides the scheduler's automatically calculated viewport priority.

Lower numeric values are processed before higher values.

Default automatic priority classes are:

| Priority | Situation                 |
| -------: | ------------------------- |
|      `0` | Intersects the viewport   |
|      `1` | Near the viewport         |
|      `2` | Farther from the viewport |
|      `3` | Hidden or disconnected    |

`data-render-priority` affects scheduling only.

It is removed from the worker dataset and does not affect the SVG cache key.

Use automatic viewport priority unless a specific application requires an explicit override.

---

### Boolean parsing

Options processed through the TikZJax boolean parser accept:

#### Enabled

```text
true
1
yes
on
empty attribute
```

#### Disabled

```text
false
0
no
off
```

Example:

```html
<script
  type="text/tikz"
  data-disable-cache="yes"
>
...
</script>
```

`data-show-console` is a direct worker flag and should use `"true"` or be omitted.

---

### Global-only options

The following options should be configured globally:

```text
assetBaseUrl
workerMode
workerUrl
worker
workerPool
theme
```

Although a JSON local attribute can syntactically contain arbitrary keys, worker-pool sizing and asset initialization are controlled by the global runtime.

Do not attempt to configure a separate worker pool for one diagram.

---

## Source formats

### HTML source

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

This format supports local `data-*` attributes.

---

### Markdown fenced source

````markdown
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

Fenced blocks cannot carry local HTML attributes.

They use global configuration.

---

### Recognized fenced-block classes

TikZJax recognizes `<pre>` elements with these classes:

| Class              | Typical Markdown source |
| ------------------ | ----------------------- |
| `language-tikzjax` | ` ```tikzjax `          |
| `tikzjax`          | Custom Markdown output  |
| `language-tikz`    | ` ```tikz `             |
| `tikz`             | Custom Markdown output  |

TikZJax extracts source text from a nested `<code>` element when present.

---

## Scheduler and rendering behavior

### Viewport priority

Pending diagrams are ordered by their viewport priority.

Among jobs with the same priority, TikZJax may prefer a worker whose dependency cache matches the job.

Dependency affinity is a tie-breaker after priority, not a replacement for load balancing.

---

### Pending-job deduplication

Pending diagrams with the same source and worker dataset can share one rendering group.

The completed SVG output is then applied to every target in that group.

Cache-disabled jobs are not grouped through the persistent-cache identity.

---

### Cache key

The persistent cache identity is formed from:

```text
serialized worker dataset
+
exact TikZ source
```

Relevant configuration changes therefore create a different cache entry.

`data-render-priority` is removed before the worker dataset and does not alter the cache identity.

---

### Persistent cache

TikZJax uses IndexedDB:

```text
database: TikzJax
version: 2
object store: svgImages
```

Clear it with:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

See [Cache and Performance](cache-performance.md).

---

## CSS helper classes

### `tikzjax-container`

```html
<div class="tikzjax-container">
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) rectangle (4,2);
    \end{tikzpicture}
    </script>
</div>
```

The generated SVG receives visible overflow behavior.

---

### `tikzjax-scaled-container`

```html
<div class="tikzjax-scaled-container">
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) rectangle (4,2);
    \end{tikzpicture}
    </script>
</div>
```

The generated SVG receives behavior equivalent to:

```text
overflow: visible
width: 100%
height: 100%
```

---

## Generated wrapper classes

TikZJax places generated output inside a wrapper similar to:

```html
<span class="tikzjax-wrapper mathjax_ignore">
    <svg>...</svg>
</span>
```

While loading, the wrapper also contains:

```text
tikzjax-loading
```

The `mathjax_ignore` class reduces the risk of MathJax processing generated TikZJax SVG content during a later rescan.

---

## Render-completion event

After a successful SVG is inserted, TikZJax dispatches:

```text
tikzjax-load-finished
```

The event:

* is dispatched from the generated SVG;
* bubbles through the document;
* is emitted for each rendered target;
* may occur in a different order from the HTML source order.

```js
document.addEventListener(
    "tikzjax-load-finished",
    function (event) {
        const svg = event.target;

        console.log(
            "TikZJax SVG ready:",
            svg
        );
    }
);
```

The event is also dispatched when cached SVG HTML is inserted successfully.

---

## Dynamic content

TikZJax observes DOM mutations and detects newly added source blocks.

Recognized dynamic sources include:

```text
script[type="text/tikz"]
pre.language-tikzjax
pre.tikzjax
pre.language-tikz
pre.tikz
```

No manual render call is required for normal dynamically inserted content.

TikZJax also schedules rescans for MkDocs Material content-tab interactions.

---

## Runtime assets

The npm distribution includes files such as:

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

The JavaScript bundle, worker, WebAssembly runtime, core dump, and `tex_files` directory should come from the same TikZJax release.

---

### Runtime asset resolution

With:

```text
assetBaseUrl = https://example.com/tikzjax/dist
```

TikZJax resolves:

```text
https://example.com/tikzjax/dist/run-tex.js
https://example.com/tikzjax/dist/tex.wasm.gz
https://example.com/tikzjax/dist/core.dump.gz
https://example.com/tikzjax/dist/tex_files/
https://example.com/tikzjax/dist/assets/broken-image.svg
```

---

### Worker runtime caching

Each initialized worker retains:

* its compiled WebAssembly module;
* its loaded core dump;
* a worker-local cache of downloaded and decompressed TeX files.

The cache is not shared directly between workers.

A worker restart clears that worker's local runtime state.

---

## CDN configuration

### jsDelivr

```html
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

In most cases, no explicit `assetBaseUrl` is required.

---

### unpkg

```html
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

---

### Same-origin hosting

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

Expected files:

```text
/vendor/tikzjax/tikzjax.min.js
/vendor/tikzjax/run-tex.js
/vendor/tikzjax/fonts.min.css
/vendor/tikzjax/tex.wasm.gz
/vendor/tikzjax/core.dump.gz
/vendor/tikzjax/tex_files/
/vendor/tikzjax/assets/broken-image.svg
```

---

## Content Security Policy

### CDN and Blob workers

A typical policy can include:

```http
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

---

### Same-origin direct workers

```http
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

The complete CSP must be adapted to the rest of the site.

---

## Common configuration checks

### Inspect the global configuration

```js
window.TikzJaxOptions
```

### Inspect the worker pool

```js
window.TikzJaxOptions?.workerPool
```

### Inspect packages

```js
window.TikzJaxOptions?.tex?.texPackages
```

### Inspect TikZ libraries

```js
window.TikzJaxOptions?.tex?.tikzLibraries
```

### Inspect `tkzTab` defaults

```js
window.TikzJaxOptions?.tkzTab
```

Inspect one effective value:

```js
window.TikzJaxOptions?.tkzTab?.lineWidth
```

### Apply a partial update

```js
window.TikzJaxConfigure({
    renderTimeout: 45000
});
```

### Force a fresh render

```html
data-disable-cache="true"
```

### Show TeX output

```html
data-show-console="true"
```

### Show timing output

```html
data-debug-timings="true"
```

---

## Related documentation

* [Configuration](configuration.md)
* [Global and Local Configuration](configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](parallel-rendering.md)
* [Themes](themes.md)
* [Fallback and Error Images](fallback-error-images.md)
* [Cache and Performance](cache-performance.md)
* [Runtime Architecture](architecture.md)
* [Troubleshooting](troubleshooting.md)
* [Examples](examples/index.md)

