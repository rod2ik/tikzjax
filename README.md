# rod2ik/TikZJax

[![GitHub repository](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github\&logoColor=white)](https://github.com/rod2ik/tikzjax)
[![npm package](https://img.shields.io/badge/npm-%40rod2ik%2Ftikzjax-CB3837?logo=npm\&logoColor=white)](https://www.npmjs.com/package/@rod2ik/tikzjax)
[![License: GPL v3+](https://img.shields.io/badge/License-GPLv3%2B-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Material themes](https://img.shields.io/badge/Material-Light%20%2F%20Dark-success?style=flat-square&logo=materialformkdocs&logoColor=white)](themes.md)
[![Web Workers](https://img.shields.io/badge/rendering-adaptive%20worker%20pool-success?style=flat-square)](parallel-rendering.md)
[![Packages](https://img.shields.io/badge/optional%20packages-8-success?style=flat-square&logo=latex&logoColor=white)](#supported-optional-packages)
[![Browser TeX](https://img.shields.io/badge/TeX-WebAssembly-success?style=flat-square)](architecture.md)

**TikZJax** renders **TikZ and supported TikZ-based LaTeX packages directly in the browser**.  
It focuses on singular TikZ-based LaTeX packages, that do NOT already exist on: 

* **MathJax**, 
* neither on other main web drawing libraries, e.g. **Graphviz**, or **Mermaid**, etc..

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
| Source repository                         | [rod2ik/tikzjax](https://github.com/rod2ik/tikzjax)                      |
| npm package                               | [@rod2ik/tikzjax](https://www.npmjs.com/package/@rod2ik/tikzjax)                  |
| jsDeliver CDN                             | [@rod2ik/tikzjax](https://www.jsdelivr.com/package/npm/@rod2ik/tikzjax)                  |

The minimal MkDocs repository can be cloned and run locally to test the integration in an isolated project.

---

## Examples

### Pure TikZ

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/tikz-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/tikz-dark.png)

### tkz-tab

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/tkz-tab-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/tkz-tab-dark.png)

### Physics

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/physics-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/physics-dark.png)

### Circuitikz

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/circuitikz-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/circuitikz-dark.png)

### Kinematikz

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/kinematikz-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/kinematikz-dark.png)

### Chemfig

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/chemfig-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/chemfig-dark.png)

### Yquant

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/yquant-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/yquant-dark.png)

### Tikz-feynhand

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/tikz-feynhand-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/tikz-feynhand-dark.png)

### Braids

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/braids-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/braids-dark.png)

### Pgf-spectra

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/pgf-spectra-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/pgf-spectra-dark.png)

---

## Project lineage

`rod2ik/TikZJax` is based on the historical great works 👏👏👏 of:

* [kisonecat/tikzjax](https://github.com/kisonecat/tikzjax), created by [Jim Fowler](https://github.com/kisonecat);
* [drgrice1/tikzjax](https://github.com/drgrice1/tikzjax), created by [Glenn Rice](https://github.com/drgrice1).

Those projects are themselves based on browser ports of TeX and DVI conversion tools.

This project uses its own related forks:

* [rod2ik/web2js](https://github.com/rod2ik/web2js);
* [rod2ik/dvi2html](https://github.com/rod2ik/dvi2html).

The original projects provided the foundation for rendering TikZ in a browser. This fork preserves that capability while adding a larger configuration, package, documentation, performance, and integration layer.

---

## Visual feature badges

The following Shields badges identify the origin of the features described on this page:

* [![ORIGINAL](https://img.shields.io/badge/ORIGINAL-blue?style=flat-square)](https://github.com/rod2ik/tikzjax) inherited from the historical TikZJax projects;
* [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) inherited behavior substantially expanded in this fork;
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) functionality added by `rod2ik/TikZJax`.

The badges are ordinary linked images generated by [Shields.io](https://shields.io/) and render correctly in Material for MkDocs.

---

## Supported optional packages

The distributed browser runtime includes the files required by all of these optional packages:

[![tkz-tab](https://img.shields.io/badge/tkz--tab-supported-success?style=flat-square&logo=latex&logoColor=white)](examples/tkz-tab.md)
[![physics](https://img.shields.io/badge/physics-supported-success?style=flat-square&logo=latex&logoColor=white)](examples/physics.md)
[![circuitikz](https://img.shields.io/badge/circuitikz-supported-success?style=flat-square&logo=latex&logoColor=white)](examples/circuitikz.md)
[![chemfig](https://img.shields.io/badge/chemfig-supported-success?style=flat-square&logo=latex&logoColor=white)](examples/chemfig.md)
[![yquant](https://img.shields.io/badge/yquant-supported-success?style=flat-square&logo=latex&logoColor=white)](examples/yquant.md)
[![tikz-feynhand](https://img.shields.io/badge/tikz--feynhand-supported-success?style=flat-square&logo=latex&logoColor=white)](examples/tikz-feynhand.md)
[![pgf-spectra](https://img.shields.io/badge/pgf--spectra-supported-success?style=flat-square&logo=latex&logoColor=white)](examples/pgf-spectra.md)
[![kinematikz](https://img.shields.io/badge/kinematikz-supported-success?style=flat-square&logo=latex&logoColor=white)](examples/kinematikz.md)

```json
[
    "tkz-tab",
    "physics",
    "circuitikz",
    "chemfig",
    "yquant",
    "tikz-feynhand",
    "pgf-spectra",
    "kinematikz"
]
```

The runtime files are available, but packages are loaded into a diagram only when declared globally or with `data-tex-packages`.

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```

See the [complete examples catalogue](examples/index.md).

---

## What is different in `rod2ik/TikZJax`?

### Core rendering

* [![ORIGINAL](https://img.shields.io/badge/ORIGINAL-blue?style=flat-square)](https://github.com/rod2ik/tikzjax) Browser-side TikZ rendering through TeX compiled to WebAssembly.
* [![ORIGINAL](https://img.shields.io/badge/ORIGINAL-blue?style=flat-square)](https://github.com/rod2ik/tikzjax) Support for `<script type="text/tikz">` source blocks.
* [![ORIGINAL](https://img.shields.io/badge/ORIGINAL-blue?style=flat-square)](https://github.com/rod2ik/tikzjax) DVI conversion to browser-compatible SVG and HTML.
* [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) The original TikZ rendering pipeline has been refactored into a modern ESM-based project.
* [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) Runtime TeX assets and optional dependencies are organized for dynamic browser loading.

### LaTeX and diagram support

* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Native support for `tkz-tab` variation tables and sign tables.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Support for optional LaTeX packages loaded at runtime.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Support for package-specific examples including:

    * `physics`;
    * `circuitikz`;
    * `chemfig`;
    * `yquant`;
    * `tikz-feynhand`;
    * `pgf-spectra`;
    * `kinematikz`.

* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Support for additional TikZ libraries such as `braids`.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Per-diagram TeX package declarations with `data-tex-packages`.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Per-diagram TikZ library declarations with `data-tikz-libraries`.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Per-diagram custom LaTeX preambles with `data-add-to-preamble`.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Global and local `tkz-tab` configuration with public helper macros and automatic native defaults.

### Configuration

* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Global configuration through `window.TikzJaxOptions`.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Runtime partial updates through `window.TikzJaxConfigure()`.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Recursive configuration merging for plain objects.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Array merging with duplicate removal.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Separate global and local configuration scopes.
* [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) Per-diagram `data-*` options now cover packages, libraries, preambles, timeouts, retries, caching, diagnostics, loader dimensions, and fallback images.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Complex local configuration through `data-tikzjax-options`.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Local nested TeX configuration through `data-tex`.

### MkDocs and documentation integration

* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Native recognition of fenced `tikzjax` Markdown blocks.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Compatibility with Material for MkDocs light and dark palettes.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Compatibility with Material admonitions.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Compatibility with collapsible details and admonitions.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Compatibility with Material content tabs.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Detection of diagrams added through client-side navigation.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Centralized DOM observation for dynamically inserted content.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Delayed rescanning and reprioritization when hidden content becomes visible.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Generated wrappers include `mathjax_ignore` to reduce conflicts with MathJax rescans.

### Themes

* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Automatic light and dark theme adaptation for generated SVGs.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Detection of common theme attributes such as:

    * `data-theme`;
    * `data-bs-theme`;
    * `data-color-scheme`;
    * `data-md-color-scheme`.

* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Support for class-based theme detection.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Any valid CSS selector can identify one or more configured theme targets.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Optional standalone target styling with configurable light and dark background and text colors.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Target styling is disabled by default so existing integrations, including MkDocs Material, keep control of page-level colors.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Optional fallback to `prefers-color-scheme`.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Dynamic updates of existing SVGs when the site theme changes.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Cached SVGs are adapted to the current theme after insertion without recompiling TeX.

### Rendering performance

* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Adaptive bounded Web Worker pool.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Parallel rendering of independent diagrams.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Configurable maximum worker count.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) CPU-aware worker-pool sizing.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Optional device-memory-aware worker-pool sizing.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Lazy worker initialization only when uncached work exists.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) One active TeX job per worker.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Global rendering queue shared by all diagrams.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Viewport-based render priority.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Reprioritization when diagrams become visible.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Dependency-cache affinity as a worker-selection tie-breaker.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Pending-job deduplication for identical diagrams.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Partial worker-pool recovery when one worker fails.

### Caching

* [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) Persistent browser-side SVG caching through IndexedDB.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Cache identities include the exact source and effective worker dataset.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Pending identical diagrams can share one active compilation.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Each worker retains its initialized WebAssembly runtime.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Each worker maintains its own decompressed TeX dependency cache.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Cache bypass can be enabled for an individual diagram with `data-disable-cache`.

### Reliability and diagnostics

* [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) Finite rendering timeouts.
* [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) Configurable retry handling.
* [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) Worker restart after failure.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Worker initialization retries.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Failed workers can be replaced without stopping healthy workers.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Per-diagram TeX console output with `data-show-console`.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Per-diagram timing diagnostics with `data-debug-timings`.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Custom global fallback error images.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Custom per-diagram fallback images.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) Several fallback image designs are included in the package.
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) A `tikzjax-load-finished` event is dispatched for each inserted SVG.

---

## Feature comparison

| Feature                            | Historical TikZJax | `rod2ik/TikZJax` |
| ---------------------------------- | -----------------: | ---------------: |
| Browser-side TikZ rendering        |    [![ORIGINAL](https://img.shields.io/badge/ORIGINAL-blue?style=flat-square)](https://github.com/rod2ik/tikzjax) |              Yes |
| `<script type="text/tikz">` blocks |    [![ORIGINAL](https://img.shields.io/badge/ORIGINAL-blue?style=flat-square)](https://github.com/rod2ik/tikzjax) |              Yes |
| `tkz-tab` support                  |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Optional runtime LaTeX packages    |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Fenced MkDocs `tikzjax` blocks     |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Global configuration API           |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Per-diagram package configuration  |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Per-diagram TikZ libraries         |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Light and dark theme adaptation    |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Configurable standalone palettes   |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Dynamic Material theme updates     |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Material tabs and admonitions      |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Adaptive worker pool               |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Parallel TeX rendering             |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Viewport-priority scheduling       |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Pending-job deduplication          |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| IndexedDB SVG cache                |    [![ORIGINAL](https://img.shields.io/badge/ORIGINAL-blue?style=flat-square)](https://github.com/rod2ik/tikzjax) |  [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Timeout and restart handling       |    [![ORIGINAL](https://img.shields.io/badge/ORIGINAL-blue?style=flat-square)](https://github.com/rod2ik/tikzjax) |  [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Custom fallback images             |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| TeX console diagnostics            |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |
| Worker timing diagnostics          |                  — |       [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) |

---

## Quick installation

### jsDelivr

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

### unpkg

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

### npm

```bash
npm install @rod2ik/tikzjax
```

### Yarn

```bash
yarn add @rod2ik/tikzjax
```

See:

* [Installation overview](installation/index.md);
* [Standalone HTML installation](installation/html.md);
* [MkDocs installation](installation/mkdocs.md).

---

## Recommended configuration

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

* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) bounded parallel rendering;
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) adaptive worker-pool sizing;
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) worker initialization retries;
* [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) rendering retries;
* [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) failed-worker replacement;
* [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) finite rendering timeouts.

See [Configuration](configuration.md).

---

## Basic TikZ example

### HTML syntax

[![ORIGINAL](https://img.shields.io/badge/ORIGINAL-blue?style=flat-square)](https://github.com/rod2ik/tikzjax), retained and extended:

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

### MkDocs fenced syntax

[![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) in `rod2ik/TikZJax`:

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

## `tkz-tab` example

Native `tkz-tab` rendering is [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) in `rod2ik/TikZJax`.

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-tkz-tab='{
    "autoApply": true,
    "lineWidth": "1.2pt",
    "font": "\\Large",
    "firstColumnWidth": 6,
    "espcl": 3
  }'
  data-width="760"
  data-height="260"
>
\begin{tikzpicture}
    \tkzTabInit
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

Package loading and table configuration are separate:

```html
data-tex-packages="tkz-tab"
data-tkz-tab='{ ... }'
```

With `autoApply` enabled, the source does not need to repeat native `lw`, `lgt`, `espcl`, or node-font settings.

See the [`tkz-tab` examples](examples/tkz-tab.md).

---

## Optional package example

Per-diagram package loading is [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax).

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

## TikZ library example

Per-diagram TikZ libraries are [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax).

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

## Light and dark themes

Theme adaptation is [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax).

TikZJax can update already-rendered and cached SVGs after a theme change without recompiling TeX.

### Material for MkDocs

A Material configuration can use:

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

`applyTargetStyles` defaults to `false`. Material therefore remains responsible for the page background, text, navigation, cards, code blocks, tables, and admonitions.

### Standalone HTML

A custom standalone page can ask TikZJax to style one or more selected targets:

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

`theme.selector` accepts any valid CSS selector. Every matching target receives the resolved background and text colors only when `applyTargetStyles` is enabled.

See [Light and Dark Themes](themes.md) and the [standalone advanced example](examples/advanced.html).

---

## Parallel rendering

The adaptive Web Worker pool is [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax).

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

## Cache and performance

Browser-side SVG caching is an [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax) historical capability.

The current implementation also provides:

* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) rendering identities based on exact source and effective options;
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) pending-job deduplication;
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) worker-local TeX dependency caches;
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) worker runtime reuse;
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) viewport-priority scheduling;
* [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) local cache bypass.

Disable the persistent SVG cache for one debugging block with:

```html
data-disable-cache="true"
```

See [Cache and Performance](cache-performance.md).

---

## Error handling

Timeout, retry, and worker-restart behavior are [![EXTENDED](https://img.shields.io/badge/EXTENDED-orange?style=flat-square)](https://github.com/rod2ik/tikzjax).

Custom fallback images are [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax).

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

## Intentionally invalid example

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

## Documentation

### Getting started

* [Installation overview](installation/index.md)
* [Standalone HTML installation](installation/html.md)
* [MkDocs installation](installation/mkdocs.md)
* [Configuration](configuration.md)
* [Global and Local Configuration](configuration-scopes.md)

### Rendering and performance

* [Parallel Rendering and the Worker Pool](parallel-rendering.md)
* [Cache and Performance](cache-performance.md)
* [Runtime Architecture](architecture.md)

### Appearance and errors

* [Light and Dark Themes](themes.md)
* [Fallback and Error Images](fallback-error-images.md)
* [Troubleshooting](troubleshooting.md)

### Reference and examples

* [API Reference](api-reference.md)
* [Examples](examples/index.md)
* [Standalone advanced HTML example](examples/advanced.html)
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

## Credits

TikZJax exists because of the foundational work of the original TikZJax, Web2JS, and DVI-to-HTML projects and their contributors.

`rod2ik/TikZJax` preserves the original browser-side TikZ rendering concept while adding [![NEW](https://img.shields.io/badge/NEW-success?style=flat-square)](https://github.com/rod2ik/tikzjax) functionality for:

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
