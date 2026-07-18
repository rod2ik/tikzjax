# rod2ik/TikZJax

[![GitHub repository](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github\&logoColor=white)](https://github.com/rod2ik/tikzjax)
[![npm package](https://img.shields.io/badge/npm-%40rod2ik%2Ftikzjax-CB3837?logo=npm\&logoColor=white)](https://www.npmjs.com/package/@rod2ik/tikzjax)
[![License: GPL v3+](https://img.shields.io/badge/License-GPLv3%2B-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

TikZJax renders **TikZ and supported LaTeX packages directly in the browser**.

It can be used inside:

* standalone HTML pages;
* MkDocs documentation;
* Material for MkDocs sites;
* static websites;
* other browser-based documentation systems.

TikZJax runs TeX through WebAssembly inside Web Workers. It does not require a server-side LaTeX installation or a remote rendering service.

---

## Documentation and test projects

| Resource                                  | Link                                                                              |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| Documentation and live demonstration site | [rod2ik.github.io/tikzjax](https://rod2ik.github.io/tikzjax)                      |
| Minimal MkDocs test repository            | [rod2ik/minimal-mkdocs-tikzjax](https://github.com/rod2ik/minimal-mkdocs-tikzjax) |
| Source repository                         | [rod2ik/tikzjax](https://github.com/rod2ik/tikzjax)                               |
| npm package                               | [@rod2ik/tikzjax](https://www.npmjs.com/package/@rod2ik/tikzjax)                  |

The minimal MkDocs repository can be cloned and run locally to test the integration in an isolated project.

---

# Project lineage

`rod2ik/TikZJax` is based on the historical work of:

* [kisonecat/tikzjax](https://github.com/kisonecat/tikzjax), created by [Jim Fowler](https://github.com/kisonecat);
* [drgrice1/tikzjax](https://github.com/drgrice1/tikzjax), created by [Glenn Rice](https://github.com/drgrice1).

Those projects are themselves based on browser ports of TeX and DVI conversion tools.

This project uses its own related forks:

* [rod2ik/web2js](https://github.com/rod2ik/web2js);
* [rod2ik/dvi2html](https://github.com/rod2ik/dvi2html).

The original projects provided the foundation for rendering TikZ in a browser. This fork preserves that capability while adding a larger configuration, package, documentation, performance, and integration layer.

---

# Feature labels

The following labels are used throughout this page:

* **🧱 ORIGINAL** — inherited from the historical TikZJax projects;
* **🛠 EXTENDED** — an inherited feature substantially expanded in this fork;
* **🆕 NEW** — functionality added by `rod2ik/TikZJax`.

---

# What is different in `rod2ik/TikZJax`?

## Core rendering

* **🧱 ORIGINAL** Browser-side TikZ rendering through TeX compiled to WebAssembly.
* **🧱 ORIGINAL** Support for `<script type="text/tikz">` source blocks.
* **🧱 ORIGINAL** DVI conversion to browser-compatible SVG and HTML.
* **🛠 EXTENDED** The original TikZ rendering pipeline has been refactored into a modern ESM-based project.
* **🛠 EXTENDED** Runtime TeX assets and optional dependencies are organized for dynamic browser loading.

## LaTeX and diagram support

* **🆕 NEW** Native support for `tkz-tab` variation tables and sign tables.
* **🆕 NEW** Support for optional LaTeX packages loaded at runtime.
* **🆕 NEW** Support for package-specific examples including:

  * `physics`;
  * `circuitikz`;
  * `chemfig`;
  * `yquant`;
  * `tikz-feynhand`;
  * `pgf-spectra`;
  * `kinematikz`.
* **🆕 NEW** Support for additional TikZ libraries such as `braids`.
* **🆕 NEW** Per-diagram TeX package declarations with `data-tex-packages`.
* **🆕 NEW** Per-diagram TikZ library declarations with `data-tikz-libraries`.
* **🆕 NEW** Per-diagram custom LaTeX preambles with `data-add-to-preamble`.
* **🆕 NEW** Global and local configuration for generated `tkz-tab` macros.

## Configuration

* **🆕 NEW** Global configuration through `window.TikzJaxOptions`.
* **🆕 NEW** Runtime partial updates through `window.TikzJaxConfigure()`.
* **🆕 NEW** Recursive configuration merging for plain objects.
* **🆕 NEW** Array merging with duplicate removal.
* **🆕 NEW** Separate global and local configuration scopes.
* **🛠 EXTENDED** Per-diagram `data-*` options now cover packages, libraries, preambles, timeouts, retries, caching, diagnostics, loader dimensions, and fallback images.
* **🆕 NEW** Complex local configuration through `data-tikzjax-options`.
* **🆕 NEW** Local nested TeX configuration through `data-tex`.

## MkDocs and documentation integration

* **🆕 NEW** Native recognition of fenced `tikzjax` Markdown blocks.
* **🆕 NEW** Compatibility with Material for MkDocs light and dark palettes.
* **🆕 NEW** Compatibility with Material admonitions.
* **🆕 NEW** Compatibility with collapsible details and admonitions.
* **🆕 NEW** Compatibility with Material content tabs.
* **🆕 NEW** Detection of diagrams added through client-side navigation.
* **🆕 NEW** Centralized DOM observation for dynamically inserted content.
* **🆕 NEW** Delayed rescanning and reprioritization when hidden content becomes visible.
* **🆕 NEW** Generated wrappers include `mathjax_ignore` to reduce conflicts with MathJax rescans.

## Themes

* **🆕 NEW** Automatic light and dark theme adaptation for generated SVGs.
* **🆕 NEW** Detection of common theme attributes such as:

  * `data-theme`;
  * `data-bs-theme`;
  * `data-color-scheme`;
  * `data-md-color-scheme`.
* **🆕 NEW** Support for class-based theme detection.
* **🆕 NEW** Optional fallback to `prefers-color-scheme`.
* **🆕 NEW** Dynamic updates of existing SVGs when the site theme changes.
* **🆕 NEW** Cached SVGs are adapted to the current theme after insertion without recompiling TeX.

## Rendering performance

* **🆕 NEW** Adaptive bounded Web Worker pool.
* **🆕 NEW** Parallel rendering of independent diagrams.
* **🆕 NEW** Configurable maximum worker count.
* **🆕 NEW** CPU-aware worker-pool sizing.
* **🆕 NEW** Optional device-memory-aware worker-pool sizing.
* **🆕 NEW** Lazy worker initialization only when uncached work exists.
* **🆕 NEW** One active TeX job per worker.
* **🆕 NEW** Global rendering queue shared by all diagrams.
* **🆕 NEW** Viewport-based render priority.
* **🆕 NEW** Reprioritization when diagrams become visible.
* **🆕 NEW** Dependency-cache affinity as a worker-selection tie-breaker.
* **🆕 NEW** Pending-job deduplication for identical diagrams.
* **🆕 NEW** Partial worker-pool recovery when one worker fails.

## Caching

* **🛠 EXTENDED** Persistent browser-side SVG caching through IndexedDB.
* **🆕 NEW** Cache identities include the exact source and effective worker dataset.
* **🆕 NEW** Pending identical diagrams can share one active compilation.
* **🆕 NEW** Each worker retains its initialized WebAssembly runtime.
* **🆕 NEW** Each worker maintains its own decompressed TeX dependency cache.
* **🆕 NEW** Cache bypass can be enabled for an individual diagram with `data-disable-cache`.

## Reliability and diagnostics

* **🛠 EXTENDED** Finite rendering timeouts.
* **🛠 EXTENDED** Configurable retry handling.
* **🛠 EXTENDED** Worker restart after failure.
* **🆕 NEW** Worker initialization retries.
* **🆕 NEW** Failed workers can be replaced without stopping healthy workers.
* **🆕 NEW** Per-diagram TeX console output with `data-show-console`.
* **🆕 NEW** Per-diagram timing diagnostics with `data-debug-timings`.
* **🆕 NEW** Custom global fallback error images.
* **🆕 NEW** Custom per-diagram fallback images.
* **🆕 NEW** Several fallback image designs are included in the package.
* **🆕 NEW** A `tikzjax-load-finished` event is dispatched for each inserted SVG.

---

# Feature comparison

| Feature                            | Historical TikZJax | `rod2ik/TikZJax` |
| ---------------------------------- | -----------------: | ---------------: |
| Browser-side TikZ rendering        |    **🧱 ORIGINAL** |              Yes |
| `<script type="text/tikz">` blocks |    **🧱 ORIGINAL** |              Yes |
| `tkz-tab` support                  |                  — |       **🆕 NEW** |
| Optional runtime LaTeX packages    |                  — |       **🆕 NEW** |
| Fenced MkDocs `tikzjax` blocks     |                  — |       **🆕 NEW** |
| Global configuration API           |                  — |       **🆕 NEW** |
| Per-diagram package configuration  |                  — |       **🆕 NEW** |
| Per-diagram TikZ libraries         |                  — |       **🆕 NEW** |
| Light and dark theme adaptation    |                  — |       **🆕 NEW** |
| Dynamic Material theme updates     |                  — |       **🆕 NEW** |
| Material tabs and admonitions      |                  — |       **🆕 NEW** |
| Adaptive worker pool               |                  — |       **🆕 NEW** |
| Parallel TeX rendering             |                  — |       **🆕 NEW** |
| Viewport-priority scheduling       |                  — |       **🆕 NEW** |
| Pending-job deduplication          |                  — |       **🆕 NEW** |
| IndexedDB SVG cache                |    **🧱 ORIGINAL** |  **🛠 EXTENDED** |
| Timeout and restart handling       |    **🧱 ORIGINAL** |  **🛠 EXTENDED** |
| Custom fallback images             |                  — |       **🆕 NEW** |
| TeX console diagnostics            |                  — |       **🆕 NEW** |
| Worker timing diagnostics          |                  — |       **🆕 NEW** |

---

# Quick installation

## jsDelivr

```html
<script src="/assets/javascripts/tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script
  src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"
  defer
></script>
```

## unpkg

```html
<script src="/assets/javascripts/tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script
  src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"
  defer
></script>
```

## npm

```bash
npm install @rod2ik/tikzjax
```

## Yarn

```bash
yarn add @rod2ik/tikzjax
```

See:

* [Installation overview](installation/index.md);
* [Standalone HTML installation](installation/html.md);
* [MkDocs installation](installation/mkdocs.md).

---

# Recommended configuration

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

This enables:

* **🆕 NEW** bounded parallel rendering;
* **🆕 NEW** adaptive worker-pool sizing;
* **🆕 NEW** worker initialization retries;
* **🛠 EXTENDED** rendering retries;
* **🛠 EXTENDED** failed-worker replacement;
* **🛠 EXTENDED** finite rendering timeouts.

See [Configuration](configuration.md).

---

# Basic TikZ example

## HTML syntax

**🧱 ORIGINAL**, retained and extended:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw[->,very thick]
        (0,0) -- (4,0)
        node[right] {$x$};

    \draw[->,very thick]
        (0,0) -- (0,3)
        node[above] {$y$};

    \draw[very thick]
        (0,0) -- (3,2);
\end{tikzpicture}
</script>
```

On the documentation site, TikZJax replaces this source with a generated SVG.

---

## MkDocs fenced syntax

**🆕 NEW** in `rod2ik/TikZJax`:

````markdown
```tikzjax
\begin{tikzpicture}
    \draw[->,very thick]
        (0,0) -- (4,0)
        node[right] {$x$};

    \draw[->,very thick]
        (0,0) -- (0,3)
        node[above] {$y$};

    \draw[very thick]
        (0,0) -- (3,2);
\end{tikzpicture}
```
````

Fenced blocks use globally configured packages and TikZ libraries.

Use an HTML source block when local `data-*` configuration is required.

---

# `tkz-tab` example

Native `tkz-tab` rendering is **🆕 NEW** in `rod2ik/TikZJax`.

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-width="760"
  data-height="260"
>
\begin{tikzpicture}[
    line width=1.2pt,
    font=\Large
]
    \tkzTabInit[
        lgt=6,
        espcl=3,
        lw=1.2pt
    ]
        {
            $x$/1.5,
            $f'(x)=3(x+1)(x-2)$/1.5,
            $f(x)=x^3-3x^2-6x+1$/2.5
        }
        {
            $-\infty$,
            $-1$,
            $2$,
            $+\infty$
        }

    \tkzTabLine{
        ,+,
        z,
        -,
        z,
        +,
    }

    \tkzTabVar{
        -/$-\infty$,
        +/$3$,
        -/$-15$,
        +/$+\infty$
    }
\end{tikzpicture}
</script>
```

The package is loaded locally with:

```html
data-tex-packages="tkz-tab"
```

See the [`tkz-tab` examples](examples/tkz-tab.md).

---

# Optional package example

Per-diagram package loading is **🆕 NEW**.

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}
    \node[
        draw,
        rounded corners,
        inner sep=8pt
    ] {
        $\vb{F}=m\vb{a}$
    };
\end{tikzpicture}
</script>
```

Several packages or package options can be declared with compact JSON:

```html
<script
  type="text/tikz"
  data-tex-packages='{"physics":"","xcolor":"dvipsnames"}'
>
\begin{tikzpicture}
    \node[text=NavyBlue] {
        $\vb{F}=m\vb{a}$
    };
\end{tikzpicture}
</script>
```

See [Global and Local Configuration](configuration-scopes.md).

---

# TikZ library example

Per-diagram TikZ libraries are **🆕 NEW**.

```html
<script
  type="text/tikz"
  data-tikz-libraries="arrows.meta,positioning"
>
\begin{tikzpicture}
    \node (A) {
        Start
    };

    \node[
        right=2cm of A
    ] (B) {
        End
    };

    \draw[-{Stealth}]
        (A) -- (B);
\end{tikzpicture}
</script>
```

TikZ libraries and LaTeX packages use separate configuration fields.

For example, `braids` is a TikZ library:

```html
data-tikz-libraries="braids"
```

---

# Light and dark themes

Theme adaptation is **🆕 NEW**.

A Material for MkDocs configuration can use:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default",
        fallbackTheme: "light",
        followSystemTheme: true
    }
};
```

TikZJax can update already-rendered and cached SVGs after a theme change without recompiling TeX.

See [Light and Dark Themes](themes.md).

---

# Parallel rendering

The adaptive Web Worker pool is **🆕 NEW**.

```text
global render queue
    |
    +-- worker 1 --> diagram A
    +-- worker 2 --> diagram B
    +-- worker 3 --> diagram C
```

The pool:

* renders independent diagrams concurrently;
* limits the maximum number of workers;
* reserves CPU capacity for the browser;
* can account for device memory;
* initializes workers lazily;
* replaces failed workers;
* prioritizes visible diagrams;
* avoids compiling identical pending jobs several times.

See [Parallel Rendering and the Worker Pool](parallel-rendering.md).

---

# Cache and performance

Browser-side SVG caching is an **🛠 EXTENDED** historical capability.

The current implementation also provides:

* **🆕 NEW** rendering identities based on exact source and effective options;
* **🆕 NEW** pending-job deduplication;
* **🆕 NEW** worker-local TeX dependency caches;
* **🆕 NEW** worker runtime reuse;
* **🆕 NEW** viewport-priority scheduling;
* **🆕 NEW** local cache bypass.

Disable the persistent SVG cache for one debugging block with:

```html
data-disable-cache="true"
```

See [Cache and Performance](cache-performance.md).

---

# Error handling

Timeout, retry, and worker-restart behavior are **🛠 EXTENDED**.

Custom fallback images are **🆕 NEW**.

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

A local fallback can be configured with:

```html
data-broken-image-src="/assets/images/local-error.svg"
```

See [Fallback and Error Images](fallback-error-images.md).

---

# Intentionally invalid example

The following source is intentionally invalid so that the fallback path can be tested.

Using a complete document with an undefined command produces a more predictable failure than omitting an environment terminator.

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

The configured fallback image should appear after all permitted attempts fail.

---

# Documentation

## Getting started

* [Installation overview](installation/index.md)
* [Standalone HTML installation](installation/html.md)
* [MkDocs installation](installation/mkdocs.md)
* [Configuration](configuration.md)
* [Global and Local Configuration](configuration-scopes.md)

## Rendering and performance

* [Parallel Rendering and the Worker Pool](parallel-rendering.md)
* [Cache and Performance](cache-performance.md)
* [Runtime Architecture](architecture.md)

## Appearance and errors

* [Light and Dark Themes](themes.md)
* [Fallback and Error Images](fallback-error-images.md)
* [Troubleshooting](troubleshooting.md)

## Reference and examples

* [API Reference](api-reference.md)
* [Examples](examples/index.md)
* [TikZ examples](examples/tikz.md)
* [`tkz-tab` examples](examples/tkz-tab.md)
* [`physics` examples](examples/physics.md)
* [`circuitikz` examples](examples/circuitikz.md)
* [`chemfig` examples](examples/chemfig.md)
* [`yquant` examples](examples/yquant.md)
* [`tikz-feynhand` examples](examples/tikz-feynhand.md)
* [`pgf-spectra` examples](examples/pgf-spectra.md)
* [`kinematikz` examples](examples/kinematikz.md)

---

# Credits

TikZJax exists because of the foundational work of the original TikZJax, Web2JS, and DVI-to-HTML projects and their contributors.

`rod2ik/TikZJax` preserves the original browser-side TikZ rendering concept while adding **🆕 NEW** functionality for:

* `tkz-tab`;
* optional package loading;
* global and local configuration;
* MkDocs fenced blocks;
* light and dark themes;
* adaptive parallel rendering;
* dynamic content;
* expanded caching;
* diagnostics;
* fallback images.

Please also visit and credit the upstream projects:

* [kisonecat/tikzjax](https://github.com/kisonecat/tikzjax);
* [drgrice1/tikzjax](https://github.com/drgrice1/tikzjax).
