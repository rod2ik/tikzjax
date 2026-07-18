# MkDocs Installation

This page explains how to install TikZJax on an MkDocs site, particularly one using Material for MkDocs.

The recommended integration uses:

1. a local TikZJax configuration file;
2. the TikZJax font stylesheet;
3. the TikZJax JavaScript bundle;
4. an optional Superfences configuration for fenced `tikzjax` blocks.

TikZJax renders diagrams entirely in the browser. It does not require a server-side LaTeX installation.

---

## Installation overview

Add the following files to the MkDocs project:

```text
mkdocs.yml
docs/
    assets/
        javascripts/
            tikzjax.config.js
overrides/
    main.html
```

The exact documentation directory may differ when `docs_dir` is customized.

The recommended loading order is:

```text
1. tikzjax.config.js
2. fonts.min.css
3. tikzjax.min.js
```

The configuration must be loaded before the TikZJax bundle.

---

## Recommended installation

### `overrides/main.html`

Create or update:

```text
overrides/main.html
```

with:

```html
{% extends "base.html" %}

{% block libs %}
    {{ super() }}

    <script src="{{ 'assets/javascripts/tikzjax.config.js' | url }}"></script>

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
    >

    <script
      src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"
      defer
    ></script>
{% endblock %}
```

This is normally the only Material template override required by TikZJax.

!!! important "Preserve the parent template"

````
Keep:

```html
{{ super() }}
```

inside the `libs` block.

It preserves the scripts and resources loaded by Material for MkDocs.
````

---

## Enable the Material override directory

Configure the custom template directory in `mkdocs.yml`:

```yaml
theme:
  name: material
  custom_dir: overrides
```

A minimal configuration is:

```yaml
site_name: My Documentation

theme:
  name: material
  custom_dir: overrides
```

---

## Recommended TikZJax configuration

Create:

```text
docs/assets/javascripts/tikzjax.config.js
```

with:

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

This configuration provides:

* bounded parallel rendering;
* adaptive worker-pool sizing;
* one retry after a transient failure;
* replacement of failed workers;
* a finite render timeout;
* a small global TeX preamble.

Specialized packages and TikZ libraries should normally be declared locally on the diagrams that require them.

See [Configuration](../configuration.md).

---

## Minimal HTML diagram

TikZJax directly recognizes:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw[very thick]
        (0,0) circle (1);
\end{tikzpicture}
</script>
```

Rendered result:

<script type="text/tikz">
\begin{tikzpicture}
    \draw[very thick]
        (0,0) circle (1);
\end{tikzpicture}
</script>

This syntax requires no special Markdown extension.

It is also the preferred syntax when a diagram needs local packages, libraries, macros, timeouts, or debugging attributes.

---

# Fenced `tikzjax` blocks

## Configure Superfences

To use fenced Markdown blocks, configure `pymdownx.superfences` in `mkdocs.yml`:

```yaml
markdown_extensions:
  - pymdownx.superfences:
      custom_fences:
        - name: tikzjax
          class: language-tikzjax
          format: !!python/name:pymdownx.superfences.fence_code_format
```

You can then write:

````markdown
```tikzjax
\begin{tikzpicture}
    \draw[->]
        (0,0) -- (3,0)
        node[right] {$x$};

    \draw[->]
        (0,0) -- (0,2)
        node[above] {$y$};

    \draw[very thick]
        (0,0) -- (2.5,1.5);
\end{tikzpicture}
```
````

Rendered result:

```tikzjax
\begin{tikzpicture}
    \draw[->]
        (0,0) -- (3,0)
        node[right] {$x$};

    \draw[->]
        (0,0) -- (0,2)
        node[above] {$y$};

    \draw[very thick]
        (0,0) -- (2.5,1.5);
\end{tikzpicture}
```

---

## HTML blocks versus fenced blocks

| Capability            | HTML `<script>` block | Fenced `tikzjax` block |
| --------------------- | --------------------: | ---------------------: |
| Standard TikZ source  |                   Yes |                    Yes |
| Local TeX packages    |                   Yes |                     No |
| Local TikZ libraries  |                   Yes |                     No |
| Local custom preamble |                   Yes |                     No |
| Local timeout         |                   Yes |                     No |
| Cache bypass          |                   Yes |                     No |
| Debug console         |                   Yes |                     No |
| Loader dimensions     |                   Yes |                     No |

Fenced blocks contain only the TeX source.

They cannot carry HTML `data-*` attributes.

Use a fenced block when the source depends only on globally available packages and libraries.

Use `<script type="text/tikz">` when the diagram needs specialized local configuration.

---

## Package dependencies in fenced blocks

Suppose a fenced block uses `tkz-tab`:

````markdown
```tikzjax
\begin{tikzpicture}
    \tkzTabInit
        {$x$/1,$f(x)$/2}
        {$-\infty$,$0$,$+\infty$}

    \tkzTabVar{
        -/$-\infty$,
        +/$2$,
        -/$-\infty$
    }
\end{tikzpicture}
```
````

Because the fenced block cannot declare a local package, `tkz-tab` must be loaded globally:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            "tkz-tab": ""
        }
    }
};
```

Alternatively, use an HTML block and load the package locally:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
>
\begin{tikzpicture}
    \tkzTabInit
        {$x$/1,$f(x)$/2}
        {$-\infty$,$0$,$+\infty$}

    \tkzTabVar{
        -/$-\infty$,
        +/$2$,
        -/$-\infty$
    }
\end{tikzpicture}
</script>
```

Local loading is preferable when only a small number of diagrams require the package.

---

# Complete `mkdocs.yml` example

The following example enables common Material features and fenced TikZJax blocks:

```yaml
site_name: My Documentation
site_url: https://example.com/

theme:
  name: material
  custom_dir: overrides
  language: en

  features:
    - navigation.sections
    - navigation.top
    - content.code.copy

  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
      primary: blue
      accent: blue

      toggle:
        icon: material/weather-night
        name: Switch to dark mode

    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      primary: pink
      accent: pink

      toggle:
        icon: material/weather-sunny
        name: Switch to light mode

nav:
  - Home: index.md

markdown_extensions:
  - admonition
  - attr_list
  - md_in_html
  - pymdownx.details

  - pymdownx.superfences:
      custom_fences:
        - name: tikzjax
          class: language-tikzjax
          format: !!python/name:pymdownx.superfences.fence_code_format

  - pymdownx.tabbed:
      alternate_style: true
```

TikZJax does not require every extension in this example.

Only the custom Superfences configuration is required for fenced `tikzjax` syntax.

HTML `<script type="text/tikz">` blocks work without Superfences.

---

# Local diagram configuration

## Local TeX package

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}
    \node[
        draw,
        rounded corners,
        inner sep=7pt
    ] {
        $\vb{F}=m\vb{a}$
    };
\end{tikzpicture}
</script>
```

---

## Several local packages

Use compact JSON:

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

The package names are mapped to their option strings.

An empty string means no package options.

---

## Local TikZ libraries

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

TikZ libraries must not be declared as TeX packages.

For example, `braids` is loaded with:

```html
data-tikz-libraries="braids"
```

---

## Local preamble

```html
<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\localR}{\mathbb{R}}"
>
\begin{tikzpicture}
    \node {
        $f:\localR\to\localR$
    };
\end{tikzpicture}
</script>
```

A local `data-add-to-preamble` value replaces the configured global custom preamble for that diagram.

Include every custom definition required by the local source.

---

## Local timeout

```html
<script
  type="text/tikz"
  data-render-timeout="45000"
>
\begin{tikzpicture}
    % Complex diagram
\end{tikzpicture}
</script>
```

The timeout applies only to this diagram.

---

## Loader dimensions

```html
<script
  type="text/tikz"
  data-width="620"
  data-height="300"
>
\begin{tikzpicture}
    % Large diagram
\end{tikzpicture}
</script>
```

These values reserve space while the diagram is compiling.

They do not resize the generated SVG.

---

## Local debugging

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-debug-timings="true"
  data-render-timeout="45000"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

This configuration:

* bypasses the persistent SVG cache;
* shows TeX console output;
* shows worker timings;
* increases the local timeout.

Remove these debugging attributes before publishing the page.

---

# Diagrams inside Material components

## Admonitions

TikZJax scans nested DOM content, so diagrams can be used inside admonitions.

````markdown
!!! success "Rendered diagram"

    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) circle (1);
    \end{tikzpicture}
    ```
````

Indentation must be valid Markdown.

---

## Collapsible admonitions

````markdown
??? example "Open the diagram"

    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) rectangle (3,2);
    \end{tikzpicture}
    ```
````

TikZJax observes dynamically revealed and inserted content.

---

## Content tabs

````markdown
=== "Question"

    Determine the length of the segment.

=== "Diagram"

    ```tikzjax
    \begin{tikzpicture}
        \draw[very thick]
            (0,0) -- (4,0);

        \fill
            (0,0) circle (2pt)
            (4,0) circle (2pt);
    \end{tikzpicture}
    ```
````

When tab content becomes visible, TikZJax can rescan and reprioritize its diagrams.

The diagram joins the same global render queue and worker pool as the rest of the page.

---

# Client-side navigation

Material for MkDocs can replace page content without performing a complete browser reload.

TikZJax uses centralized DOM observation to detect newly inserted source blocks.

This supports:

* client-side page navigation;
* content tabs;
* dynamically inserted Markdown;
* delayed components;
* collapsible sections.

TikZJax should be loaded once in the site template.

Do not add the TikZJax bundle separately to individual Markdown pages.

Loading it several times can create:

* duplicate DOM observers;
* duplicate theme observers;
* conflicting worker pools;
* repeated processing;
* inconsistent configuration.

---

## Completion order

With several rendering workers, diagrams may finish in a different order from their source order.

```text
source order:
A, B, C

completion order:
B, C, A
```

Each SVG is still inserted in the correct document position.

Use the completion event when JavaScript must react to rendered output:

```js
document.addEventListener(
    "tikzjax-load-finished",
    function (event) {
        const svg = event.target;

        console.log(
            "TikZJax diagram ready:",
            svg
        );
    }
);
```

See [Parallel Rendering and the Worker Pool](../parallel-rendering.md).

---

# Theme integration

Material stores the active color scheme in:

```text
data-md-color-scheme
```

Common values are:

```text
default
slate
```

TikZJax can normally detect Material themes automatically.

An explicit configuration can be used when required:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default",
        fallbackTheme: "light"
    }
};
```

TikZJax can adapt common default black, white, stroke, fill, and text colors after SVG generation.

Theme changes do not require recompiling the TeX source.

See [Themes](../themes.md).

---

# MathJax integration

MathJax is optional.

TikZJax renders TikZ-based diagrams.

MathJax renders mathematical expressions in the surrounding documentation.

They use different configuration objects:

```js
window.TikzJaxOptions = {};
window.MathJax = {};
```

A typical MathJax setup might use:

```yaml
markdown_extensions:
  - pymdownx.arithmatex:
      generic: true
      smart_dollar: false

extra_javascript:
  - assets/javascripts/mathjax.js
  - https://cdn.jsdelivr.net/npm/mathjax@4.1.0/tex-mml-chtml.js
```

TikZJax source elements are normally protected from MathJax because:

* HTML TikZ source is placed inside a `script` element;
* fenced source is initially placed inside `pre` and `code`;
* generated output is wrapped in a `mathjax_ignore` container.

Load TikZJax once through the Material template and configure MathJax separately.

---

# Arithmatex compatibility

Some MkDocs configurations transform inline mathematics before TikZJax reads the page.

TikZJax includes source cleanup for common Arithmatex wrappers associated with script-based TikZ sources.

When a source still changes unexpectedly:

1. inspect the final HTML;
2. compare the source text before and after Markdown processing;
3. test the same source in a plain `<script type="text/tikz">` block;
4. avoid applying Markdown transformations inside the script source.

---

# CDN runtime assets

TikZJax requires files such as:

```text
tikzjax.min.js
run-tex.js
fonts.min.css
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

When loaded from:

```text
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js
```

TikZJax normally resolves the other assets from:

```text
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/
```

No explicit `assetBaseUrl` is normally required.

---

## unpkg

Replace the jsDelivr URLs with:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script
  src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"
  defer
></script>
```

Keep the configuration file before the TikZJax script.

---

# Same-origin MkDocs installation

TikZJax can be served from the MkDocs site itself.

Place the runtime files under the documentation directory:

```text
docs/
    vendor/
        tikzjax/
            tikzjax.min.js
            run-tex.js
            fonts.min.css
            tex.wasm.gz
            core.dump.gz
            tex_files/
            assets/
                broken-image.svg
```

MkDocs copies these files into the generated site.

---

## Root-hosted deployment

For a site hosted at the origin root:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct",

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

Load the assets in `overrides/main.html`:

```html
{% extends "base.html" %}

{% block libs %}
    {{ super() }}

    <script src="{{ 'assets/javascripts/tikzjax.config.js' | url }}"></script>

    <link
      rel="stylesheet"
      href="{{ 'vendor/tikzjax/fonts.min.css' | url }}"
    >

    <script
      src="{{ 'vendor/tikzjax/tikzjax.min.js' | url }}"
      defer
    ></script>
{% endblock %}
```

---

## Sites deployed under a subpath

A root-relative value such as:

```js
assetBaseUrl: "/vendor/tikzjax"
```

assumes that the site is hosted at the origin root.

For a site deployed under a subpath, define the asset base in the template so MkDocs resolves the correct URL:

```html
{% extends "base.html" %}

{% block libs %}
    {{ super() }}

    <script>
    window.TikzJaxOptions = {
        assetBaseUrl:
            "{{ 'vendor/tikzjax' | url }}",

        workerMode: "direct",

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
    </script>

    <link
      rel="stylesheet"
      href="{{ 'vendor/tikzjax/fonts.min.css' | url }}"
    >

    <script
      src="{{ 'vendor/tikzjax/tikzjax.min.js' | url }}"
      defer
    ></script>
{% endblock %}
```

This avoids hard-coding the deployment prefix.

All runtime files must come from the same TikZJax release.

---

# Worker modes

TikZJax supports:

| Mode       | Purpose                                                  |
| ---------- | -------------------------------------------------------- |
| `"auto"`   | Direct same-origin workers and Blob cross-origin workers |
| `"blob"`   | Force Blob-worker startup                                |
| `"direct"` | Force direct worker startup                              |

Recommended values:

| Deployment                               | Mode                 |
| ---------------------------------------- | -------------------- |
| jsDelivr or unpkg                        | `"auto"`             |
| CDN with Blob workers explicitly allowed | `"auto"` or `"blob"` |
| Same-origin MkDocs assets                | `"direct"`           |
| Strict CSP without `blob:`               | `"direct"`           |

Default CDN configuration:

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

Same-origin configuration:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

Root `workerMode` and `workerUrl` take precedence over nested `worker.mode` and `worker.url`.

---

# Content Security Policy

## CDN with Blob workers

A typical policy includes:

```http
default-src 'self';
script-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'wasm-unsafe-eval';
style-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'unsafe-inline';
worker-src 'self' blob:;
connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
img-src 'self' https://cdn.jsdelivr.net https://unpkg.com data: blob:;
font-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
object-src 'none';
```

## Same-origin direct workers

```http
default-src 'self';
script-src 'self' 'wasm-unsafe-eval';
style-src 'self' 'unsafe-inline';
worker-src 'self';
connect-src 'self';
img-src 'self' data:;
font-src 'self';
object-src 'none';
```

Adapt these examples to the complete site policy.

---

# Production and debugging assets

Use in production:

```text
fonts.min.css
tikzjax.min.js
```

Use while debugging:

```text
fonts.css
tikzjax.js
```

Example debug loading:

```html
{% extends "base.html" %}

{% block libs %}
    {{ super() }}

    <script src="{{ 'assets/javascripts/tikzjax.config.js' | url }}"></script>

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.css"
    >

    <script
      src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.js"
      defer
    ></script>
{% endblock %}
```

Restore the minified files before publishing.

---

# Verify the installation

## Build the documentation

```bash
mkdocs serve
```

Open the development site and verify the basic diagram.

---

## Check the Network panel

These resources should load successfully:

```text
tikzjax.min.js
fonts.min.css
run-tex.js
tex.wasm.gz
core.dump.gz
```

Package-heavy diagrams may request additional compressed files under:

```text
tex_files/
```

---

## Check the Console

There should be no:

* configuration syntax error;
* worker initialization failure;
* WebAssembly error;
* CSP violation;
* CORS error;
* missing runtime file;
* TeX compilation error.

---

## Test one local package

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    \node {$\vb{F}=m\vb{a}$};
\end{tikzpicture}
</script>
```

If the basic circle works but this example fails, inspect requests under `tex_files/`.

---

# Common MkDocs problems

## Configuration file returns `404`

Check that the file exists under the configured `docs_dir`.

Default location:

```text
docs/assets/javascripts/tikzjax.config.js
```

Template path:

```html
{{ 'assets/javascripts/tikzjax.config.js' | url }}
```

---

## Fenced blocks display as source code

Check the `pymdownx.superfences` custom fence configuration.

Inspect the generated `<pre>` element and verify that it contains:

```text
language-tikzjax
```

---

## HTML source is removed

Some Markdown or sanitization configurations may remove `<script>` elements.

Check:

* whether raw HTML is enabled;
* whether a hosting platform sanitizes generated HTML;
* whether an external Markdown processor removes script elements;
* the final generated HTML.

When script elements are forbidden, use fenced blocks and load their dependencies globally.

---

## Diagrams inside tabs are delayed

A hidden diagram may be assigned a lower viewport priority until the tab becomes visible.

Activating the tab triggers observation and reprioritization.

A job that already started is not normally interrupted merely because another tab becomes visible.

---

## A diagram renders twice

Check that:

* TikZJax is loaded only once;
* `overrides/main.html` does not include the bundle in several blocks;
* `extra_javascript` does not also contain TikZJax;
* another template override does not inject the same script;
* client-side navigation does not recreate the runtime manually.

---

## A package works in HTML but not in a fenced block

The HTML source probably declares the package locally.

The fenced block cannot carry that declaration.

Load the dependency globally or keep the diagram as an HTML block.

---

## A stale diagram remains visible

Force a fresh render:

```html
data-disable-cache="true"
```

or clear IndexedDB:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

---

# Related documentation

* [Installation Overview](index.md)
* [Standalone HTML Installation](html.md)
* [Configuration](../configuration.md)
* [Global and Local Configuration](../configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](../parallel-rendering.md)
* [Themes](../themes.md)
* [Cache and Performance](../cache-performance.md)
* [API Reference](../api-reference.md)
* [Troubleshooting](../troubleshooting.md)
* [Examples](../examples/index.md)
