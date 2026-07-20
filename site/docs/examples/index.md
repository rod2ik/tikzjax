# Examples

TikZJax can render standard TikZ diagrams and several optional LaTeX or TikZ packages directly in the browser.

The examples are organized into separate pages so that each package can document its own syntax, requirements, limitations, and recommended configuration. A complete standalone HTML example is also available for testing theme detection, target styling, and several supported packages outside MkDocs.

## Available example pages

<div class="grid cards" markdown>

* :material-language-html5:{ .lg .middle } **Standalone HTML**

  ---

  Complete HTML page with light and dark themes, `theme.selector`, optional target styling, package loading, cache debugging, and multiple TikZ-based examples.

  [:octicons-arrow-right-24: Open the standalone HTML example](advanced.html)

* :material-vector-circle:{ .lg .middle } **TikZ**

  ---

  Standard TikZ drawings, local TikZ libraries, HTML `<script>` blocks, MkDocs fenced blocks, admonitions, and content tabs.

  [:octicons-arrow-right-24: Open TikZ examples](tikz.md)

* :material-table-large:{ .lg .middle } **tkz-tab**

  ---

  Sign tables, variation tables, automatic native defaults, local or global configuration, and reusable row-height helper macros.

  [:octicons-arrow-right-24: Open tkz-tab examples](tkz-tab.md)

* :material-atom:{ .lg .middle } **physics**

  ---

  Vectors, derivatives, automatic delimiters, and physics notation inside TikZ diagrams.

  [:octicons-arrow-right-24: Open physics examples](physics.md)

* :material-electric-switch:{ .lg .middle } **circuitikz**

  ---

  Electrical circuits using batteries, resistors, capacitors, sources, switches, and component labels.

  [:octicons-arrow-right-24: Open circuitikz examples](circuitikz.md)

* :material-flask-outline:{ .lg .middle } **chemfig**

  ---

  Chemical structures, molecular chains, branches, rings, and visible chemical bonds.

  [:octicons-arrow-right-24: Open chemfig examples](chemfig.md)

* :material-state-machine:{ .lg .middle } **yquant**

  ---

  Quantum circuits with qubits, gates, controlled operations, and measurements.

  [:octicons-arrow-right-24: Open yquant examples](yquant.md)

* :material-chart-timeline-variant:{ .lg .middle } **tikz-feynhand**

  ---

  Feynman diagrams with fermions, photons, propagators, interaction vertices, and annotations.

  [:octicons-arrow-right-24: Open tikz-feynhand examples](tikz-feynhand.md)

* :material-gradient-horizontal:{ .lg .middle } **pgf-spectra**

  ---

  Atomic emission and absorption spectra across the visible wavelength range.

  [:octicons-arrow-right-24: Open pgf-spectra examples](pgf-spectra.md)

* :material-cog-transfer-outline:{ .lg .middle } **kinematikz**

  ---

  Kinematic chains, mechanical links, frames, pivots, and revolute joints.

  [:octicons-arrow-right-24: Open kinematikz examples](kinematikz.md)

</div>

## Supported optional packages

The distributed TikZJax runtime currently includes the files required by these optional packages:

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

These packages are available to the browser runtime, but they are not automatically loaded into every diagram.

## Recommended: load packages locally

Load an optional package only for the diagrams that need it:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```

Several packages can be loaded locally with a comma-separated list:

```html
<script
  type="text/tikz"
  data-tex-packages="physics,chemfig"
>
% Diagram source
</script>
```

You can also use JSON when package options are required:

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "physics": "",
    "xcolor": "dvipsnames"
  }'
>
% Diagram source
</script>
```

Local package declarations are merged with the global configuration. They do not remove globally configured packages.

!!! tip "Why local loading is recommended"

    Local loading keeps each TeX preamble as small as possible.

    This generally provides:

    - faster cold rendering;
    - fewer downloaded runtime files;
    - less work for the TeX engine;
    - fewer package and TikZ-library conflicts;
    - more predictable diagrams.

## Local TikZ libraries

TikZ libraries are loaded separately from LaTeX packages:

```html
<script
  type="text/tikz"
  data-tikz-libraries="arrows.meta,calc,positioning"
>
\begin{tikzpicture}
    % Diagram source
\end{tikzpicture}
</script>
```

Several libraries can be declared in the same attribute.

Local libraries are added to globally configured libraries.

!!! warning "Packages and TikZ libraries are different"

    Use:

    ```html
    data-tex-packages="circuitikz"
    ```

    for a LaTeX package, and:

    ```html
    data-tikz-libraries="calc,positioning"
    ```

    for TikZ libraries.

    Do not place package names in `data-tikz-libraries`.

## Global loading remains available

Packages and TikZ libraries can still be configured globally when they are required by most or all diagrams on a site:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            physics: "",
            "tkz-tab": ""
        },

        tikzLibraries: [
            "arrows.meta",
            "calc",
            "positioning"
        ]
    }
};
```

Global dependencies are merged into every diagram.

This is useful for sites with a consistent set of requirements, but it is a deliberate performance trade-off.

!!! warning "Global dependencies affect every diagram"

    Every globally configured package generates a `\usepackage{...}` instruction for every rendered diagram.

    Every globally configured TikZ library is added to every diagram with `\usetikzlibrary{...}`.

    A large global configuration can therefore:

    - increase initial download activity;
    - increase TeX compilation time;
    - increase memory usage in each worker;
    - introduce package or library conflicts.

    Keep the global list as small as reasonably possible and prefer local declarations for specialized packages.

## Multiple workers and parallel rendering

TikZJax uses an adaptive worker pool.

When a page contains several diagrams, independent TeX workers can compile several diagrams at the same time:

```text
global render queue
        |
        +-- worker 1 --> diagram A
        +-- worker 2 --> diagram B
        +-- worker 3 --> diagram C
```

Each worker renders one diagram at a time, while several workers may operate concurrently.

As soon as a worker finishes, it takes another diagram from the global queue.

This provides:

* asynchronous rendering;
* parallel compilation of independent diagrams;
* progressive insertion of completed SVG images;
* continued interaction with the page while TeX is running;
* faster rendering on pages containing several diagrams.

The number of workers is limited according to:

* the number of diagrams waiting to be rendered;
* `navigator.hardwareConcurrency`;
* available device memory when reported by the browser;
* the configured `workerPool.maxWorkers` limit.

A typical configuration is:

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

!!! note "Rendering order"

    Diagrams are inserted as soon as their own rendering finishes.

    A simpler diagram may therefore appear before an earlier but more complex diagram.

    TikZJax also gives higher priority to diagrams that are visible or close to the browser viewport.

## Lazy worker initialization

TikZJax scans the page before initializing the TeX workers.

If a page contains no TikZJax source, it does not need to initialize the worker pool or load the TeX WebAssembly runtime.

Workers are created only when uncached diagrams actually need to be rendered.

## Runtime and SVG caches

TikZJax uses two complementary cache levels.

### Rendered SVG cache

Completed SVG output is stored in IndexedDB and can be reused on later page loads.

Disable this cache for one diagram while debugging:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

### Worker runtime cache

Each worker keeps downloaded and decompressed TeX runtime files in memory.

When the same worker later needs the same package or dependency, it can reuse its local copy.

Because workers are independent, each worker maintains its own runtime cache.

## Debugging a package

Enable TeX console output for one diagram:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-tex-packages="yquant"
>
\begin{tikzpicture}
\begin{yquant}
qubit q;
h q;
measure q;
\end{yquant}
\end{tikzpicture}
</script>
```

When a diagram fails, inspect the browser console for:

```text
TikZJax render timeout after ...
```

or missing runtime files such as:

```text
GET .../tex_files/package-name.sty.gz 404
```

```text
GET .../tex_files/package-data.tex.gz 404
```

For debugging, the TikZJax IndexedDB cache can be cleared from the browser console:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

## Package compatibility notes

### `circuitikz`

Do not globally load the built-in TikZ electrical circuit libraries when using the external `circuitikz` package:

```text
circuits
circuits.ee
circuits.ee.IEC
```

Load those libraries locally only for diagrams that intentionally use the built-in PGF/TikZ circuit system.

### `chemfig`

Use `\chemfig` directly:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```

Wrapping `\chemfig` inside an additional TikZ node is generally unnecessary and can produce incorrect output.

### `pgf-spectra`

Spectral diagrams may require more data files and more compilation time than a basic TikZ drawing.

Use an appropriate render timeout and inspect the console if a spectrum produces the configured broken-image fallback.

## Related documentation

* [Installation](../installation/index.md)
* [Configuration](../configuration.md)
* [Global and Local Configuration](../configuration-scopes.md)
* [Themes](../themes.md)
* [Cache and Performance](../cache-performance.md)
* [Troubleshooting](../troubleshooting.md)
* [API Reference](../api-reference.md)
