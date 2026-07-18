# Global and Local Configuration

TikZJax configuration can be defined at several levels.

Some options apply to the complete page, while others apply to only one diagram. Understanding these scopes helps avoid unnecessary package loading, unexpected overrides, and slower rendering.

The effective configuration of a diagram is built in this order:

```text
TikZJax defaults
< initial global configuration
< later partial global configuration
< local diagram configuration
```

Values on the right have higher priority than values on the left.

For a complete list of available options, see the [API Reference](api-reference.md).

---

## Configuration scopes at a glance

| Scope                        | Applies to                                  | Recommended use                               |
| ---------------------------- | ------------------------------------------- | --------------------------------------------- |
| TikZJax defaults             | Every page                                  | Internal fallback values                      |
| Initial global configuration | Every diagram on the page                   | Site-wide defaults                            |
| Partial global configuration | Future and unprocessed diagrams on the page | Runtime-wide adjustments                      |
| Local diagram configuration  | One diagram only                            | Specialized packages, libraries, or overrides |

A typical site uses:

* a small global configuration for common behavior;
* local package and library declarations for specialized diagrams;
* local overrides only when one diagram needs different behavior.

---

## Recommended strategy

Keep the global configuration small:

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
        tikzLibraries: [
            "arrows.meta"
        ],

        texPackages: {}
    }
};
```

Then load specialized dependencies locally:

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="positioning"
>
\begin{tikzpicture}
    \node (A) {$\vb{F}$};
    \node[right=1.5cm of A] {$m\vb{a}$};
\end{tikzpicture}
</script>
```

This approach provides:

* predictable configuration;
* smaller TeX preambles;
* fewer package conflicts;
* faster simple diagrams;
* clearer dependency declarations.

---

## Initial global configuration

Define `window.TikzJaxOptions` before loading TikZJax:

```html
<script>
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    tex: {
        tikzLibraries: [
            "arrows.meta"
        ],

        texPackages: {
            amsfonts: ""
        }
    }
};
</script>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax/dist/tikzjax.js"></script>
```

The global configuration becomes the base configuration for every diagram on the page.

!!! tip

```
Global configuration is appropriate for options that genuinely apply to most or all diagrams.

Do not globally load a large package merely because one diagram needs it.
```

---

## Global configuration does not need to be complete

You may define only the options that differ from the TikZJax defaults:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

TikZJax supplies its default values for all omitted options.

You do not need to copy the entire default configuration.

---

## Partial global configuration

After TikZJax has loaded, assigning another plain object to `window.TikzJaxOptions` merges it into the existing configuration.

For example:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/assets/images/tikz-error.svg"
};
```

This updates `brokenImageSrc` without erasing existing settings such as:

```text
renderTimeout
workerPool
tex.texPackages
tex.tikzLibraries
theme
tkzTab
```

The explicit configuration function provides the same behavior:

```js
window.TikzJaxConfigure({
    brokenImageSrc: "/assets/images/tikz-error.svg"
});
```

`window.TikzJaxConfigure()` returns the resulting global configuration object.

```js
const options = window.TikzJaxConfigure({
    renderTimeout: 45000
});

console.log(options);
```

!!! tip

```
Prefer `window.TikzJaxConfigure()` for runtime updates because it makes the merge operation explicit.
```

---

## Global updates are recursive

Nested objects are merged recursively.

Initial configuration:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: [
            "arrows.meta"
        ],

        texPackages: {
            amsfonts: ""
        }
    },

    workerPool: {
        enabled: true,
        maxWorkers: 3
    }
};
```

Later update:

```js
window.TikzJaxConfigure({
    workerPool: {
        reserveCpuCores: 1
    }
});
```

The resulting worker-pool configuration contains:

```js
{
    enabled: true,
    maxWorkers: 3,
    reserveCpuCores: 1
}
```

The update does not replace the complete `workerPool` object.

---

## Arrays are combined and deduplicated

When both the existing and new values are arrays, TikZJax combines them and removes duplicates.

Initial configuration:

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

Later update:

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

The resulting list is equivalent to:

```js
[
    "arrows.meta",
    "calc",
    "positioning"
]
```

The existing order is preserved, and newly added values are appended.

---

## Partial updates are additive

The global merge API is designed for extending or overriding configuration.

It is not a reset API.

For example, this does not remove previously configured libraries:

```js
window.TikzJaxConfigure({
    tex: {
        tikzLibraries: []
    }
});
```

Because arrays are combined, an empty array adds nothing.

Likewise, assigning a new nested object does not erase unspecified keys from the existing object.

!!! warning

```
Configure the final global dependency list before loading TikZJax whenever possible.

Partial updates are useful for additions and scalar overrides, but they are not intended for removing previously registered packages, libraries, or nested settings.
```

---

## Scalar values are replaced

When a value is not an object or array, the later value replaces the earlier value.

Initial configuration:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

Later update:

```js
window.TikzJaxConfigure({
    renderTimeout: 45000
});
```

The resulting global timeout is:

```text
45000 milliseconds
```

---

## Local diagram configuration

A `<script type="text/tikz">` element can define options with `data-*` attributes.

```html
<script
  type="text/tikz"
  data-render-timeout="45000"
  data-disable-cache="true"
>
\begin{tikzpicture}
    \draw[thick] (0,0) circle (1);
\end{tikzpicture}
</script>
```

These options affect only this diagram.

They do not mutate `window.TikzJaxOptions` and do not affect other diagrams on the page.

---

## Local configuration is merged with global configuration

Suppose the global configuration contains:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,

    tex: {
        tikzLibraries: [
            "arrows.meta"
        ],

        texPackages: {
            amsfonts: ""
        }
    }
};
```

A diagram adds local dependencies:

```html
<script
  type="text/tikz"
  data-tikz-libraries="calc,positioning"
  data-tex-packages="physics"
  data-render-timeout="45000"
>
\begin{tikzpicture}
    % Diagram source
\end{tikzpicture}
</script>
```

The effective configuration for this diagram contains:

```text
Render timeout:
- 45000

TikZ libraries:
- arrows.meta
- calc
- positioning

TeX packages:
- amsfonts
- physics
```

The local timeout replaces the global timeout.

The local libraries and packages are added to the global dependencies.

---

## Local configuration does not modify global configuration

After processing the previous diagram, this remains unchanged:

```js
window.TikzJaxOptions.tex.tikzLibraries
```

It still contains only the globally configured libraries:

```js
[
    "arrows.meta"
]
```

The local `calc` and `positioning` libraries belong only to the effective configuration created for that diagram.

---

## Dedicated local attributes

TikZJax provides dedicated attributes for common local settings.

| Attribute                     | Purpose                               |
| ----------------------------- | ------------------------------------- |
| `data-tex-packages`           | Load LaTeX packages                   |
| `data-tikz-libraries`         | Load TikZ libraries                   |
| `data-add-to-preamble`        | Define a local preamble               |
| `data-tkz-tab`                | Define local `tkz-tab` style settings |
| `data-render-timeout`         | Override the render timeout           |
| `data-max-retries`            | Override retry count                  |
| `data-restart-worker-on-fail` | Control worker restart behavior       |
| `data-broken-image-src`       | Set a local error image               |
| `data-disable-cache`          | Bypass the SVG cache                  |
| `data-width`                  | Reserve loader width                  |
| `data-height`                 | Reserve loader height                 |
| `data-debug-timings`          | Enable detailed timing output         |
| `data-show-timings`           | Display or log rendering timings      |

Additional runtime attributes, such as `data-show-console`, may be consumed directly by the rendering worker.

For all attributes, see the [API Reference](api-reference.md).

---

## Local TeX packages

Use `data-tex-packages` for LaTeX packages.

### One package

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
...
</script>
```

### Several packages

Package names can be separated with commas:

```html
<script
  type="text/tikz"
  data-tex-packages="physics,chemfig"
>
...
</script>
```

Whitespace around package names is ignored.

### Package options

Use JSON when a package requires options:

```html
<script
  type="text/tikz"
  data-tex-packages='{"xcolor":"dvipsnames"}'
>
...
</script>
```

### Several packages with options

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "xcolor": "dvipsnames",
    "physics": ""
  }'
>
...
</script>
```

The JSON must be a valid object:

```text
package name -> package options
```

An empty string means that the package has no options.

---

## Merging TeX packages

Suppose the global configuration contains:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsfonts: "",
            xcolor: ""
        }
    }
};
```

A diagram declares:

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

The effective package configuration is equivalent to:

```js
{
    amsfonts: "",
    xcolor: "dvipsnames",
    physics: ""
}
```

The local `xcolor` options replace the global options for that package in this diagram only.

---

## Local TikZ libraries

Use `data-tikz-libraries` for TikZ libraries:

```html
<script
  type="text/tikz"
  data-tikz-libraries="arrows.meta,calc,positioning"
>
...
</script>
```

Local libraries are combined with global libraries and deduplicated.

Do not use `data-tex-packages` for a TikZ library.

For example, `braids` is a TikZ library:

```html
<script
  type="text/tikz"
  data-tikz-libraries="braids"
>
\begin{tikzpicture}
    % Braid diagram
\end{tikzpicture}
</script>
```

It is not a LaTeX package declaration:

```html
<!-- Incorrect -->
<script
  type="text/tikz"
  data-tex-packages="braids"
>
...
</script>
```

---

## Package or TikZ library?

A LaTeX package is normally loaded with:

```latex
\usepackage{package-name}
```

In TikZJax, declare it with:

```html
data-tex-packages="package-name"
```

Examples:

```text
physics
chemfig
circuitikz
yquant
tikz-feynhand
pgf-spectra
kinematikz
tkz-tab
```

A TikZ library is normally loaded with:

```latex
\usetikzlibrary{library-name}
```

In TikZJax, declare it with:

```html
data-tikz-libraries="library-name"
```

Examples:

```text
arrows.meta
calc
positioning
patterns
braids
decorations.pathreplacing
shapes.geometric
```

!!! warning

```
A package and a TikZ library can have very different runtime files and loading behavior.

Declaring a dependency in the wrong category may produce an undefined command, an unknown key, or a missing-file error.
```

---

## Local preamble

Use `data-add-to-preamble` for commands required by one diagram:

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

The macro is available only inside this diagram's TeX document.

It does not leak into later diagrams.

### Interaction with the global preamble

The local `data-add-to-preamble` value becomes the configured `tex.addToPreamble` value for this diagram.

Therefore, when a site already defines a global custom preamble, include the required global definitions again in a local replacement or use the local JSON configuration to supply the complete intended value.

TikZJax-generated `tkz-tab` macros are still inserted before the configured custom preamble.

!!! important

```
A local package list and a local preamble are separate settings.

Loading a package does not automatically define your custom macros, and adding a macro does not automatically load the package that provides its commands.
```

Example:

```html
<script
  type="text/tikz"
  data-tex-packages="xcolor"
  data-add-to-preamble="\newcommand{\important}[1]{\textcolor{red}{#1}}"
>
\begin{tikzpicture}
    \node {\important{Local macro}};
\end{tikzpicture}
</script>
```

---

## Local JSON configuration

Use `data-tikzjax-options` when a diagram needs several related options:

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

The attribute value must be valid JSON.

JSON requires:

* double quotes around property names;
* double quotes around string values;
* no trailing commas;
* valid escaping inside strings.

The HTML attribute is usually enclosed in single quotes so that JSON can use double quotes internally.

---

## Dedicated attributes override local JSON values

TikZJax first reads the general local JSON configuration and then applies dedicated `data-*` attributes.

For example:

```html
<script
  type="text/tikz"
  data-tikzjax-options='{
    "renderTimeout": 30000,
    "tex": {
      "tikzLibraries": [
        "calc"
      ]
    }
  }'
  data-render-timeout="45000"
  data-tikz-libraries="positioning"
>
...
</script>
```

The dedicated attributes have the final local priority.

The effective local values are:

```text
renderTimeout:
- 45000

local TikZ libraries:
- positioning
```

They are then merged with the global configuration.

!!! tip

```
Avoid defining the same option in both `data-tikzjax-options` and a dedicated attribute.

Even though the precedence is deterministic, using one local source per option makes the diagram easier to understand.
```

---

## Local configuration parsing order

Within one diagram, TikZJax processes local configuration in this general order:

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

Later entries have higher priority when they define the same value.

`data-tikzjax-options` is the recommended general JSON attribute.

Dedicated attributes remain the preferred syntax for simple local changes.

---

## Local `tkz-tab` configuration

TikZJax can generate reusable TeX macros from the `tkzTab` configuration.

Global example:

```js
window.TikzJaxOptions = {
    tkzTab: {
        lineWidth: "1.1pt",
        font: "\\large",
        lgt: "4.5",
        espcl: "2.6",
        variableRowHeight: "1.3",
        signRowHeight: "1.3",
        variationRowHeight: "2.2"
    }
};
```

These settings generate macros such as:

```text
\tikzjaxTkzTabLineWidth
\tikzjaxTkzTabFont
\tikzjaxTkzTabLgt
\tikzjaxTkzTabEspcl
\tikzjaxTkzTabVariableRowHeight
\tikzjaxTkzTabSignRowHeight
\tikzjaxTkzTabVariationRowHeight
```

A single diagram can provide local style values:

```html
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
\begin{tikzpicture}[
    line width=\tikzjaxTkzTabLineWidth,
    font=\tikzjaxTkzTabFont
]
    % tkz-tab source
\end{tikzpicture}
</script>
```

The local `tkzTab` object is recursively merged with the global `tkzTab` object for this diagram.

See the [`tkz-tab` examples](examples/tkz-tab.md) for complete tables.

---

## Fenced `tikzjax` blocks

A fenced block provides only the TeX source:

````markdown
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

It cannot carry HTML `data-*` attributes.

Therefore, a fenced block cannot directly declare:

```text
data-tex-packages
data-tikz-libraries
data-add-to-preamble
data-render-timeout
data-disable-cache
```

Dependencies required by a fenced block must already be available globally.

Example global configuration:

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

The fenced block can then use them:

````markdown
```tikzjax
\begin{tikzpicture}
    \draw[-{Stealth}] (0,0) -- (2,0)
        node[midway, above] {$\vb{F}$};
\end{tikzpicture}
```
````

!!! tip

```
Use fenced blocks for diagrams that depend only on the site's standard global configuration.

Use `<script type="text/tikz">` when the diagram requires specialized local dependencies or options.
```

---

## Choosing between global and local configuration

| Requirement                            | Recommended scope    |
| -------------------------------------- | -------------------- |
| Common timeout for the site            | Global               |
| Worker-pool configuration              | Global               |
| Site-wide theme behavior               | Global               |
| Default fallback image                 | Global               |
| Package used by nearly every diagram   | Global, with caution |
| Package used by one example            | Local                |
| TikZ library used by one diagram       | Local                |
| Macro used by one diagram              | Local preamble       |
| Longer timeout for one complex diagram | Local                |
| Cache bypass during debugging          | Local                |
| Custom loader dimensions               | Local                |
| Several related local options          | Local JSON           |
| Dependency required by a fenced block  | Global               |
| Dependency required by an HTML block   | Prefer local         |

---

## Performance implications

Every globally configured TeX package is included in every diagram's TeX document.

For example:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            physics: "",
            chemfig: "",
            circuitikz: "",
            yquant: ""
        }
    }
};
```

causes even a simple circle to process all four packages:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

A better configuration is:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {}
    }
};
```

with local declarations:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```

Local loading does not prevent worker caching or parallel rendering.

Each worker can retain downloaded and decompressed dependency files for later jobs assigned to that worker.

See [Cache and Performance](cache-performance.md) and [Parallel Rendering](parallel-rendering.md).

---

## Dependency conflicts

Keeping specialized dependencies local also reduces conflicts.

For example, the external `circuitikz` package and the built-in TikZ circuit libraries are different systems.

External package:

```html
<script
  type="text/tikz"
  data-tex-packages="circuitikz"
>
...
</script>
```

Built-in TikZ libraries:

```html
<script
  type="text/tikz"
  data-tikz-libraries="circuits,circuits.ee,circuits.ee.IEC"
>
...
</script>
```

Do not globally load the built-in circuit libraries when external `circuitikz` diagrams are also present.

Load each system locally for the diagrams that use it.

---

## Invalid local JSON

Invalid JSON is ignored and produces a browser-console warning.

Incorrect:

```html
<script
  type="text/tikz"
  data-tikzjax-options='{
    renderTimeout: 30000,
  }'
>
...
</script>
```

Problems:

* `renderTimeout` is not quoted;
* the final property has a trailing comma.

Correct:

```html
<script
  type="text/tikz"
  data-tikzjax-options='{
    "renderTimeout": 30000
  }'
>
...
</script>
```

Enable browser-console inspection when debugging configuration parsing.

---

## Boolean local attributes

TikZJax accepts common boolean representations.

Examples interpreted as enabled:

```html
data-disable-cache
data-disable-cache=""
data-disable-cache="true"
data-disable-cache="1"
data-disable-cache="yes"
data-disable-cache="on"
```

Examples interpreted as disabled:

```html
data-disable-cache="false"
data-disable-cache="0"
data-disable-cache="no"
data-disable-cache="off"
```

For documentation and maintainability, prefer explicit values:

```html
data-disable-cache="true"
```

or:

```html
data-disable-cache="false"
```

---

## Complete example

Global configuration:

```html
<script>
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
        tikzLibraries: [
            "arrows.meta"
        ],

        texPackages: {
            amsfonts: ""
        }
    }
};
</script>
```

Simple diagram using only global configuration:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw[-{Stealth},very thick]
        (0,0) -- (3,0);
\end{tikzpicture}
</script>
```

Specialized local diagram:

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "physics": "",
    "xcolor": "dvipsnames"
  }'
  data-tikz-libraries="positioning"
  data-render-timeout="45000"
  data-width="420"
  data-height="180"
>
\begin{tikzpicture}
    \node[
        draw=NavyBlue,
        rounded corners
    ] (force) {
        $\vb{F}$
    };

    \node[
        draw=BrickRed,
        rounded corners,
        right=1.5cm of force
    ] {
        $m\vb{a}$
    };
\end{tikzpicture}
</script>
```

The second diagram receives:

```text
Global:
- arrows.meta
- amsfonts
- worker and runtime settings

Local:
- physics
- xcolor with dvipsnames
- positioning
- 45000 ms timeout
- custom loader dimensions
```

---

## Common mistakes

### Loading every optional package globally

This increases the preamble of every diagram.

Load specialized packages locally instead.

### Using `data-tex-packages` for a TikZ library

Use `data-tikz-libraries` for libraries such as `calc`, `positioning`, or `braids`.

### Expecting a fenced block to support local attributes

Fenced blocks have no HTML element on which to place the attributes.

Use a `<script>` block or load the dependency globally.

### Expecting a partial update to clear an array

Arrays are combined and deduplicated.

An empty array does not remove existing entries.

### Defining one local option twice

Dedicated attributes override the corresponding values from `data-tikzjax-options`.

Use one syntax per option where possible.

### Forgetting package options

Use JSON when a package requires options:

```html
data-tex-packages='{"xcolor":"dvipsnames"}'
```

### Invalid JSON escaping

Remember that JSON strings use backslashes.

For complex TeX preambles, a dedicated `data-add-to-preamble` attribute is often easier to read than deeply escaped JSON.

---

## Inspecting configuration

Inspect the current global configuration:

```js
window.TikzJaxOptions
```

Inspect globally configured packages:

```js
window.TikzJaxOptions?.tex?.texPackages
```

Inspect globally configured TikZ libraries:

```js
window.TikzJaxOptions?.tex?.tikzLibraries
```

Inspect the worker-pool configuration:

```js
window.TikzJaxOptions?.workerPool
```

Apply and inspect a partial update:

```js
const options = window.TikzJaxConfigure({
    renderTimeout: 45000
});

console.log(options);
```

Local effective configuration is created internally for each diagram and does not mutate these global objects.

---

## Related documentation

* [Configuration](configuration.md)
* [API Reference](api-reference.md)
* [Parallel Rendering](parallel-rendering.md)
* [Cache and Performance](cache-performance.md)
* [Runtime Architecture](architecture.md)
* [Troubleshooting](troubleshooting.md)
* [Examples](examples/index.md)
