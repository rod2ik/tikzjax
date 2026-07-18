# API Reference

This page is the complete reference for TikZJax configuration, local diagram attributes, source formats, events, and runtime files.

For practical examples, see:

* [Configuration](configuration.md)
* [Global and Local Configuration](configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](parallel-rendering.md)

---

## Global configuration object

TikZJax reads its global configuration from:

```js id="dms5kn"
window.TikzJaxOptions = {};
```

Define the initial configuration before loading `tikzjax.js` or `tikzjax.min.js`.

```html id="wxv6d9"
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

For debugging, use the non-minified files:

```html id="4egp7s"
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

```text id="8c4glc"
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

```js id="gk8b7q"
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

```js id="sw4j8o"
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

```js id="lg3uki"
[
    "arrows.meta",
    "calc",
    "positioning"
]
```

!!! warning "Partial updates are additive"

````
The merge API is not a reset API.

For example, assigning an empty array does not remove libraries that were already configured:

```js
window.TikzJaxConfigure({
    tex: {
        tikzLibraries: []
    }
});
```
````

---

## `window.TikzJaxConfigure()`

After TikZJax has loaded, update part of the global configuration with:

```js id="ev6mvu"
window.TikzJaxConfigure({
    brokenImageSrc: "/images/custom-tikz-error.svg"
});
```

The function expects a plain JavaScript object.

It returns the resulting merged configuration:

```js id="4z8e04"
const options = window.TikzJaxConfigure({
    renderTimeout: 45000
});

console.log(options);
```

A later assignment to `window.TikzJaxOptions` also uses the merge API after TikZJax has installed it:

```js id="klnytn"
window.TikzJaxOptions = {
    renderTimeout: 45000
};
```

For clarity, prefer `window.TikzJaxConfigure()` for runtime changes.

---

## Supported configuration structure

The following example shows the supported configuration groups.

You do not need to define every property:

```js id="550trn"
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
        lineWidth: undefined,
        font: undefined,

        lgt: undefined,
        firstColumnWidth: undefined,
        espcl: undefined,

        variableRowHeight: undefined,
        signRowHeight: undefined,
        variationRowHeight: undefined,
        imageRowHeight: undefined,
        antecedentRowHeight: undefined
    }
};
```

`workerPool` is the recommended pool configuration location.

`worker.pool` is a supported nested alias.

---

# Global options

## Root-option summary

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
| `tkzTab`              | `object`                       |                        `{}` | Values used to generate `tkz-tab` macros                |

---

## `assetBaseUrl`

```js id="sl7bup"
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax"
};
```

`assetBaseUrl` is used to resolve runtime assets such as:

```text id="db799x"
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

When omitted, TikZJax derives it from the directory containing the loaded `tikzjax.js` or `tikzjax.min.js` file.

For example:

```text id="tyfpqt"
https://cdn.example.com/tikzjax/dist/tikzjax.min.js
```

produces the default asset root:

```text id="ql9o3w"
https://cdn.example.com/tikzjax/dist
```

!!! important

```
Configure `assetBaseUrl` before loading TikZJax.

The resolved asset root is established during TikZJax initialization.
```

---

## `workerUrl`

```js id="d77hq6"
window.TikzJaxOptions = {
    workerUrl: "/vendor/tikzjax/run-tex.js"
};
```

A relative `workerUrl` is resolved against `assetBaseUrl`.

The nested alias is:

```js id="28ej55"
window.TikzJaxOptions = {
    worker: {
        url: "/vendor/tikzjax/run-tex.js"
    }
};
```

When both are present, the root value takes precedence:

```js id="k1dsh9"
window.TikzJaxOptions = {
    workerUrl: "/workers/root-worker.js",

    worker: {
        url: "/workers/nested-worker.js"
    }
};
```

The effective URL is:

```text id="uu5c1d"
/workers/root-worker.js
```

---

## `workerMode`

Supported values are:

```text id="a9ed7o"
auto
direct
blob
```

Invalid values produce a warning and fall back to `"auto"`.

### `"auto"`

```js id="f0k5pa"
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

### `"direct"`

```js id="nhk4a6"
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

TikZJax starts the worker with:

```js id="fe6i6e"
new Worker(workerUrl)
```

Use direct mode for same-origin deployments or CSP policies that do not allow Blob workers.

### `"blob"`

```js id="2zjbq2"
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

```http id="gu3cdn"
worker-src blob:;
```

### Nested alias

```js id="228gml"
window.TikzJaxOptions = {
    worker: {
        mode: "auto"
    }
};
```

Root `workerMode` takes precedence over `worker.mode`.

---

# Worker-pool options

## `workerPool`

Recommended configuration:

```js id="snfgwk"
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

```js id="1rynjr"
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

## `workerPool.enabled`

| Type      | Default |
| --------- | ------: |
| `boolean` |  `true` |

```js id="c5arjp"
window.TikzJaxOptions = {
    workerPool: {
        enabled: false
    }
};
```

When disabled, TikZJax uses one rendering worker.

It does not disable Web Worker rendering entirely.

Equivalent shorthand:

```js id="0sm96x"
window.TikzJaxOptions = {
    workerPool: false
};
```

---

## `workerPool.maxWorkers`

| Type     | Default | Minimum |
| -------- | ------: | ------: |
| `number` |     `3` |     `1` |

```js id="69fmya"
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

## `workerPool.reserveCpuCores`

| Type     | Default | Minimum |
| -------- | ------: | ------: |
| `number` |     `1` |     `0` |

```js id="nci9aq"
window.TikzJaxOptions = {
    workerPool: {
        reserveCpuCores: 1
    }
};
```

TikZJax calculates a CPU-based limit similar to:

```text id="ay5ub7"
max(
    1,
    navigator.hardwareConcurrency - reserveCpuCores
)
```

When `navigator.hardwareConcurrency` is unavailable or invalid, TikZJax uses `4` as its fallback processor count.

---

## `workerPool.useDeviceMemory`

| Type      | Default |
| --------- | ------: |
| `boolean` |  `true` |

```js id="hbnq0p"
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

## `workerPool.initializationRetries`

| Type     | Default | Minimum |
| -------- | ------: | ------: |
| `number` |     `1` |     `0` |

```js id="whmcps"
window.TikzJaxOptions = {
    workerPool: {
        initializationRetries: 1
    }
};
```

The value is the number of retries after the initial worker-initialization attempt.

With:

```text id="g2gbbk"
initializationRetries = 1
```

TikZJax can make:

```text id="ipdyvo"
initial attempt
+ one retry
```

Initialization retries are separate from diagram-render retries.

---

## Effective worker count

For an active workload, the effective worker count is bounded by:

```text id="a4wl4i"
pending and active workload
maxWorkers
CPU limit
memory limit
```

Conceptually:

```text id="bdnu4k"
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

```text id="x5x13j"
effective workers = 0
```

Workers are initialized lazily when rendering work exists.

See [Parallel Rendering and the Worker Pool](parallel-rendering.md).

---

# Render-safety options

## `renderTimeout`

| Type     | Default | Minimum |
| -------- | ------: | ------: |
| `number` | `15000` |     `1` |

```js id="2u6815"
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

The value is expressed in milliseconds and applies to each rendering attempt.

A local value has the highest priority:

```html id="u36hhv"
<script
  type="text/tikz"
  data-render-timeout="45000"
>
...
</script>
```

Priority:

```text id="qy7p46"
local data-render-timeout
> root renderTimeout
> tex.renderTimeout
> 15000
```

---

## `maxRetries`

| Type     | Default | Minimum |
| -------- | ------: | ------: |
| `number` |     `0` |     `0` |

```js id="hpvqrx"
window.TikzJaxOptions = {
    maxRetries: 1
};
```

This is the number of retries after the initial rendering attempt.

With:

```text id="3ow3e7"
maxRetries = 1
```

TikZJax can make:

```text id="r0q7pm"
initial attempt
+ one retry
```

Priority:

```text id="wdyl4v"
local data-max-retries
> root maxRetries
> tex.maxRetries
> 0
```

---

## `restartWorkerOnFail`

| Type      | Default |
| --------- | ------: |
| `boolean` |  `true` |

```js id="hrumhx"
window.TikzJaxOptions = {
    restartWorkerOnFail: true
};
```

When enabled, TikZJax can replace a worker after a render failure.

A timeout always requires the affected worker runtime to be restarted before reuse.

Priority:

```text id="mc1m4e"
local data-restart-worker-on-fail
> root restartWorkerOnFail
> tex.restartWorkerOnFail
> true
```

---

## Nested `tex` safety aliases

The following legacy-compatible form remains supported:

```js id="f9dt4r"
window.TikzJaxOptions = {
    tex: {
        renderTimeout: 30000,
        maxRetries: 1,
        restartWorkerOnFail: true
    }
};
```

Root-level values take precedence:

```js id="ojf55d"
window.TikzJaxOptions = {
    renderTimeout: 10000,

    tex: {
        renderTimeout: 30000
    }
};
```

The effective timeout is:

```text id="ixmpbo"
10000
```

---

# Cache and loader options

## `brokenImageSrc`

| Type     | Default                                                |
| -------- | ------------------------------------------------------ |
| `string` | `assets/broken-image.svg` resolved from the asset root |

```js id="9mbh3y"
window.TikzJaxOptions = {
    brokenImageSrc: "/images/tikz-error.svg"
};
```

Local override:

```html id="56qwra"
<script
  type="text/tikz"
  data-broken-image-src="/images/local-error.svg"
>
...
</script>
```

See [Fallback and Error Images](fallback-error-images.md).

---

## `disableCache`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

Global cache bypass:

```js id="r971wb"
window.TikzJaxOptions = {
    disableCache: true
};
```

Local cache bypass:

```html id="qm6ev1"
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

## `width`

| Type     | Default |
| -------- | ------: |
| `number` |    `75` |

Sets the minimum width of the loading placeholder in TeX points.

```js id="1xjams"
window.TikzJaxOptions = {
    width: 180
};
```

Local value:

```html id="dq8rdj"
<script
  type="text/tikz"
  data-width="320"
>
...
</script>
```

TikZJax applies the value as:

```text id="g7vo0j"
320pt
```

It does not resize the final SVG.

---

## `height`

| Type     | Default |
| -------- | ------: |
| `number` |    `75` |

Sets the minimum height of the loading placeholder in TeX points.

```html id="noeoxg"
<script
  type="text/tikz"
  data-height="180"
>
...
</script>
```

It does not resize the final SVG.

---

# Timing options

## `debugTimings`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

```js id="w989cp"
window.TikzJaxOptions = {
    debugTimings: true
};
```

Local value:

```html id="b3879f"
<script
  type="text/tikz"
  data-debug-timings="true"
>
...
</script>
```

The worker logs stages such as:

```text id="6t7rqh"
[TikZJax timing] TeX compilation: 123.4 ms
[TikZJax timing] DVI to HTML: 18.7 ms
```

---

## `showTimings`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

`showTimings` enables the same worker timing measurements as `debugTimings`.

```html id="u8zgbh"
<script
  type="text/tikz"
  data-show-timings="true"
>
...
</script>
```

Either option is sufficient.

---

# Theme options

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

## `theme.selector`

| Type     | Default |
| -------- | ------- |
| `string` | none    |

```js id="kodvz8"
window.TikzJaxOptions = {
    theme: {
        selector: "html"
    }
};
```

TikZJax queries all matching elements and checks whether one contains the rendered diagram.

An invalid selector produces a browser-console warning.

---

## `theme.attribute`

| Type     | Default        |
| -------- | -------------- |
| `string` | `"data-theme"` |

```js id="ezc1pb"
window.TikzJaxOptions = {
    theme: {
        attribute: "data-color-mode"
    }
};
```

---

## `theme.darkValue`

| Type     | Default  |
| -------- | -------- |
| `string` | `"dark"` |

```js id="4a8zle"
window.TikzJaxOptions = {
    theme: {
        darkValue: "night"
    }
};
```

---

## `theme.lightValue`

| Type     | Default   |
| -------- | --------- |
| `string` | `"light"` |

```js id="c9rd21"
window.TikzJaxOptions = {
    theme: {
        lightValue: "day"
    }
};
```

---

## `theme.darkClass`

| Type     | Default  |
| -------- | -------- |
| `string` | `"dark"` |

```js id="5f5a26"
window.TikzJaxOptions = {
    theme: {
        darkClass: "theme-dark"
    }
};
```

---

## `theme.lightClass`

| Type     | Default   |
| -------- | --------- |
| `string` | `"light"` |

```js id="nh56tx"
window.TikzJaxOptions = {
    theme: {
        lightClass: "theme-light"
    }
};
```

---

## `theme.fallbackTheme`

| Type                  | Default   |
| --------------------- | --------- |
| `"light"` or `"dark"` | `"light"` |

```js id="ehxfmy"
window.TikzJaxOptions = {
    theme: {
        fallbackTheme: "dark"
    }
};
```

`fallbackTheme` takes precedence over `defaultTheme`.

---

## `theme.defaultTheme`

| Type                  | Default   |
| --------------------- | --------- |
| `"light"` or `"dark"` | `"light"` |

Legacy-compatible alias used when `fallbackTheme` is not defined.

---

## `theme.followSystemTheme`

| Type      | Default |
| --------- | ------: |
| `boolean` | `false` |

```js id="koxst5"
window.TikzJaxOptions = {
    theme: {
        followSystemTheme: true
    }
};
```

The system preference is used only when a valid `fallbackTheme` or `defaultTheme` has not already selected the result.

---

## Attribute-based theme example

```js id="vfrcnp"
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

## Class-based theme example

```js id="yuzwau"
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

# TeX options

## `tex.texPackages`

| Accepted type          | Description                            |
| ---------------------- | -------------------------------------- |
| Plain object           | Package names mapped to option strings |
| Array                  | Package names without options          |
| Comma-separated string | Package names without options          |
| JSON object string     | Package names mapped to option strings |

Recommended global form:

```js id="nhurc6"
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

```latex id="4th28v"
\usepackage{amsfonts}
\usepackage{amssymb}
\usepackage[dvipsnames]{xcolor}
```

Values equal to:

```text id="82whhx"
undefined
null
false
""
```

produce a package without options.

---

## Global package array

```js id="3m0h1p"
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

## Global comma-separated packages

```js id="sr50c8"
window.TikzJaxOptions = {
    tex: {
        texPackages: "amsfonts,physics"
    }
};
```

---

## Local packages

One package:

```html id="bopvwp"
<script
  type="text/tikz"
  data-tex-packages="physics"
>
...
</script>
```

Several packages:

```html id="8vcfbc"
<script
  type="text/tikz"
  data-tex-packages="physics,chemfig"
>
...
</script>
```

Packages with options:

```html id="w7ttjw"
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

## `tex.tikzLibraries`

| Accepted type          | Description                    |
| ---------------------- | ------------------------------ |
| Array                  | Recommended global form        |
| Comma-separated string | Supported global or local form |

Array:

```js id="5ghpju"
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

```js id="0qzt7l"
window.TikzJaxOptions = {
    tex: {
        tikzLibraries:
            "arrows.meta,calc,positioning"
    }
};
```

Local libraries:

```html id="8x3buf"
<script
  type="text/tikz"
  data-tikz-libraries="calc,positioning"
>
...
</script>
```

Global and local libraries are combined without duplicate entries.

---

## `tex.addToPreamble`

| Type     | Default |
| -------- | ------- |
| `string` | `""`    |

```js id="k4744g"
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

```latex id="rb7md4"
\begin{document}
```

### Local preamble

```html id="njcau7"
<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\localR}{\mathbb{R}}"
>
...
</script>
```

!!! important "Replacement behavior"

```
`addToPreamble` is a scalar string.

Therefore, a local `data-add-to-preamble` value replaces the global custom `tex.addToPreamble` value for that diagram.

It is not automatically appended to the global custom preamble.

TikZJax-generated `tkz-tab` macros are still placed before the resulting custom preamble.
```

---

## Legacy root TeX aliases

These aliases remain supported:

```js id="8p1dqp"
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

```js id="w2ql3j"
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

# `tkzTab` options

The `tkzTab` configuration generates reusable TeX macros.

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

```js id="5stjcl"
window.TikzJaxOptions = {
    tkzTab: {
        lineWidth: "1.2pt",
        font: "\\Large",
        lgt: "10",
        firstColumnWidth: "10",
        espcl: "3.2",

        variableRowHeight: "1.5",
        signRowHeight: "2.5",
        variationRowHeight: "2.5",
        imageRowHeight: "2.5",
        antecedentRowHeight: "2.5"
    }
};
```

Local configuration:

```html id="xlshw6"
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-tkz-tab='{
    "lineWidth": "1.4pt",
    "font": "\\Large",
    "lgt": "5",
    "espcl": "3"
  }'
>
...
</script>
```

Local `tkzTab` values are recursively merged with global `tkzTab` values.

See the [`tkz-tab` examples](examples/tkz-tab.md).

---

# Local diagram attributes

Local attributes are normally placed on:

```html id="llwtpf"
<script type="text/tikz">
...
</script>
```

They affect only the current diagram.

---

## Attribute summary

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

## Local parsing order

Local configuration is interpreted in this order:

```text id="qk5n69"
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

```text id="0j2z4p"
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

## `data-options`

Legacy JSON configuration attribute:

```html id="a23ea9"
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

## `data-tikzjax-options`

```html id="l63slp"
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

## `data-tex`

Provides a local nested `tex` object:

```html id="yputq5"
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

## `data-tex-packages`

Simple syntax:

```html id="1n0y3m"
data-tex-packages="physics"
```

Comma-separated syntax:

```html id="gdfyzc"
data-tex-packages="physics,chemfig"
```

JSON syntax:

```html id="w1zlmu"
data-tex-packages='{
  "physics": "",
  "xcolor": "dvipsnames"
}'
```

---

## `data-tikz-libraries`

```html id="h4w0gi"
data-tikz-libraries="arrows.meta,calc,positioning"
```

Whitespace is removed around individual library names.

---

## `data-add-to-preamble`

```html id="3qaj84"
data-add-to-preamble="\newcommand{\localR}{\mathbb{R}}"
```

This replaces the configured global custom `addToPreamble` string for the current diagram.

---

## `data-tkz-tab`

```html id="qq4bql"
data-tkz-tab='{
  "lineWidth": "1.4pt",
  "font": "\\Large",
  "espcl": "3"
}'
```

The object is recursively merged with global `tkzTab` values.

---

## `data-render-timeout`

```html id="w0k8bo"
data-render-timeout="45000"
```

The minimum valid value is `1`.

Invalid values fall back to the next available configured value.

---

## `data-max-retries`

```html id="6ieigk"
data-max-retries="1"
```

The minimum valid value is `0`.

---

## `data-restart-worker-on-fail`

```html id="0psl5s"
data-restart-worker-on-fail="true"
```

Common accepted values include:

```text id="mkjt6t"
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

## `data-broken-image-src`

```html id="mcbnre"
data-broken-image-src="/images/local-error.svg"
```

The value applies only if this diagram fails.

---

## `data-disable-cache`

```html id="q7rmtq"
data-disable-cache="true"
```

Use this during development when every reload should trigger a new TeX compilation.

---

## `data-width`

```html id="97f0qr"
data-width="420"
```

The loader reserves a minimum width of:

```text id="rwbil9"
420pt
```

---

## `data-height`

```html id="qf0xvz"
data-height="220"
```

The loader reserves a minimum height of:

```text id="rzwbfd"
220pt
```

---

## `data-debug-timings`

```html id="hzelz0"
data-debug-timings="true"
```

Enables worker timing logs.

---

## `data-show-timings`

```html id="epai70"
data-show-timings="true"
```

Alias that enables the same timing logs.

---

## `data-show-console`

```html id="hjd38w"
data-show-console="true"
```

Streams TeX console output to the browser console.

This can produce a large amount of output.

!!! important

````
Enable this option with:

```html
data-show-console="true"
```

Omit the attribute to disable it.

Do not rely on `data-show-console="false"` as a disabling form.
````

---

## `data-render-priority`

```html id="fg1xkk"
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

## Boolean parsing

Options processed through the TikZJax boolean parser accept:

### Enabled

```text id="x2onpf"
true
1
yes
on
empty attribute
```

### Disabled

```text id="kyihq8"
false
0
no
off
```

Example:

```html id="r8bhfv"
<script
  type="text/tikz"
  data-disable-cache="yes"
>
...
</script>
```

`data-show-console` is a direct worker flag and should use `"true"` or be omitted.

---

## Global-only options

The following options should be configured globally:

```text id="2fx701"
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

# Source formats

## HTML source

```html id="2hgb4o"
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

This format supports local `data-*` attributes.

---

## Markdown fenced source

````markdown id="hnplpv"
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

Fenced blocks cannot carry local HTML attributes.

They use global configuration.

---

## Recognized fenced-block classes

TikZJax recognizes `<pre>` elements with these classes:

| Class              | Typical Markdown source |
| ------------------ | ----------------------- |
| `language-tikzjax` | ` ```tikzjax `          |
| `tikzjax`          | Custom Markdown output  |
| `language-tikz`    | ` ```tikz `             |
| `tikz`             | Custom Markdown output  |

TikZJax extracts source text from a nested `<code>` element when present.

---

# Scheduler and rendering behavior

## Viewport priority

Pending diagrams are ordered by their viewport priority.

Among jobs with the same priority, TikZJax may prefer a worker whose dependency cache matches the job.

Dependency affinity is a tie-breaker after priority, not a replacement for load balancing.

---

## Pending-job deduplication

Pending diagrams with the same source and worker dataset can share one rendering group.

The completed SVG output is then applied to every target in that group.

Cache-disabled jobs are not grouped through the persistent-cache identity.

---

## Cache key

The persistent cache identity is formed from:

```text id="ljkxfm"
serialized worker dataset
+
exact TikZ source
```

Relevant configuration changes therefore create a different cache entry.

`data-render-priority` is removed before the worker dataset and does not alter the cache identity.

---

## Persistent cache

TikZJax uses IndexedDB:

```text id="xslcps"
database: TikzJax
version: 2
object store: svgImages
```

Clear it with:

```js id="z7vfhd"
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

See [Cache and Performance](cache-performance.md).

---

# CSS helper classes

## `tikzjax-container`

```html id="x3gi5w"
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

## `tikzjax-scaled-container`

```html id="g1cxmc"
<div class="tikzjax-scaled-container">
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) rectangle (4,2);
    \end{tikzpicture}
    </script>
</div>
```

The generated SVG receives behavior equivalent to:

```text id="xrij8o"
overflow: visible
width: 100%
height: 100%
```

---

# Generated wrapper classes

TikZJax places generated output inside a wrapper similar to:

```html id="5s7igf"
<span class="tikzjax-wrapper mathjax_ignore">
    <svg>...</svg>
</span>
```

While loading, the wrapper also contains:

```text id="j7ytbe"
tikzjax-loading
```

The `mathjax_ignore` class reduces the risk of MathJax processing generated TikZJax SVG content during a later rescan.

---

# Render-completion event

After a successful SVG is inserted, TikZJax dispatches:

```text id="ca4rbp"
tikzjax-load-finished
```

The event:

* is dispatched from the generated SVG;
* bubbles through the document;
* is emitted for each rendered target;
* may occur in a different order from the HTML source order.

```js id="mos99z"
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

# Dynamic content

TikZJax observes DOM mutations and detects newly added source blocks.

Recognized dynamic sources include:

```text id="qjnzsu"
script[type="text/tikz"]
pre.language-tikzjax
pre.tikzjax
pre.language-tikz
pre.tikz
```

No manual render call is required for normal dynamically inserted content.

TikZJax also schedules rescans for MkDocs Material content-tab interactions.

---

# Runtime assets

The npm distribution includes files such as:

```text id="pewh3x"
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

## Runtime asset resolution

With:

```text id="1eyxuh"
assetBaseUrl = https://example.com/tikzjax/dist
```

TikZJax resolves:

```text id="d49knm"
https://example.com/tikzjax/dist/run-tex.js
https://example.com/tikzjax/dist/tex.wasm.gz
https://example.com/tikzjax/dist/core.dump.gz
https://example.com/tikzjax/dist/tex_files/
https://example.com/tikzjax/dist/assets/broken-image.svg
```

---

## Worker runtime caching

Each initialized worker retains:

* its compiled WebAssembly module;
* its loaded core dump;
* a worker-local cache of downloaded and decompressed TeX files.

The cache is not shared directly between workers.

A worker restart clears that worker's local runtime state.

---

# CDN configuration

## jsDelivr

```html id="8eyimf"
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

In most cases, no explicit `assetBaseUrl` is required.

---

## unpkg

```html id="c5zh5y"
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

---

## Same-origin hosting

```js id="ac7aqc"
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

Expected files:

```text id="mrj50e"
/vendor/tikzjax/tikzjax.min.js
/vendor/tikzjax/run-tex.js
/vendor/tikzjax/fonts.min.css
/vendor/tikzjax/tex.wasm.gz
/vendor/tikzjax/core.dump.gz
/vendor/tikzjax/tex_files/
/vendor/tikzjax/assets/broken-image.svg
```

---

# Content Security Policy

## CDN and Blob workers

A typical policy can include:

```http id="bhb0wo"
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

## Same-origin direct workers

```http id="wbx4ym"
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

# Common configuration checks

## Inspect the global configuration

```js id="kmsy20"
window.TikzJaxOptions
```

## Inspect the worker pool

```js id="ll60yp"
window.TikzJaxOptions?.workerPool
```

## Inspect packages

```js id="q682fq"
window.TikzJaxOptions?.tex?.texPackages
```

## Inspect TikZ libraries

```js id="2u3m8g"
window.TikzJaxOptions?.tex?.tikzLibraries
```

## Apply a partial update

```js id="f6gh4p"
window.TikzJaxConfigure({
    renderTimeout: 45000
});
```

## Force a fresh render

```html id="oqae6d"
data-disable-cache="true"
```

## Show TeX output

```html id="3ozemg"
data-show-console="true"
```

## Show timing output

```html id="8bl45r"
data-debug-timings="true"
```

---

# Related documentation

* [Configuration](configuration.md)
* [Global and Local Configuration](configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](parallel-rendering.md)
* [Themes](themes.md)
* [Fallback and Error Images](fallback-error-images.md)
* [Cache and Performance](cache-performance.md)
* [Runtime Architecture](architecture.md)
* [Troubleshooting](troubleshooting.md)
* [Examples](examples/index.md)
