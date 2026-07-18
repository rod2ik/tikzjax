# Standalone HTML Installation

This page explains how to install TikZJax on a standalone HTML page or a custom website.

TikZJax can be loaded:

* from jsDelivr;
* from unpkg;
* from files hosted on the same origin as the page.

No server-side LaTeX installation is required.

---

## Recommended CDN installation

For most standalone pages, load:

1. the optional global configuration;
2. the TikZJax font stylesheet;
3. the TikZJax JavaScript bundle.

=== "With configuration"

````
```html
<script src="./tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script
  src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"
  defer
></script>
```
````

=== "Without configuration"

````
```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script
  src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"
  defer
></script>
```
````

Using `defer` allows the browser to download TikZJax while continuing to parse the document.

The configuration file must still appear before the deferred TikZJax bundle.

---

## Equivalent unpkg installation

```html id="n1kf57"
<script src="./tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script
  src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"
  defer
></script>
```

For normal jsDelivr or unpkg usage, TikZJax automatically resolves its runtime files from the same `dist/` directory as the loaded JavaScript bundle.

An explicit `assetBaseUrl` is usually unnecessary.

---

## Minimal standalone page

The following page renders one standard TikZ diagram and one `tkz-tab` table.

The specialized `tkz-tab` package is loaded locally only for the table that requires it.

```html id="kspzdm"
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    >

    <title>TikZJax Standalone Example</title>

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
    >

    <script
      src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"
      defer
    ></script>
</head>

<body>
    <h1>TikZJax Standalone Example</h1>

    <h2>Standard TikZ</h2>

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[very thick]
            (0,0) -- (2,1);

        \fill
            (0,0) circle (2pt)
            (2,1) circle (2pt);
    \end{tikzpicture}
    </script>

    <h2>tkz-tab</h2>

    <script
      type="text/tikz"
      data-tex-packages="tkz-tab"
      data-width="520"
      data-height="220"
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
</body>

</html>
```

The standard diagram uses the default TikZ runtime.

The variation table explicitly declares:

```html id="3zv3nv"
data-tex-packages="tkz-tab"
```

This avoids loading `tkz-tab` into every diagram.

---

## Minimal rendered diagram

After TikZJax has loaded, this source:

```html id="4jehyq"
<script type="text/tikz">
\begin{tikzpicture}
    \draw[very thick]
        (0,0) circle (1);
\end{tikzpicture}
</script>
```

is replaced with a generated SVG.

<script type="text/tikz">
\begin{tikzpicture}
    \draw[very thick]
        (0,0) circle (1);
\end{tikzpicture}
</script>

---

## Configuration file

A separate configuration file keeps runtime options out of the HTML page.

Create:

```text id="cwswdl"
tikzjax.config.js
```

with:

```js id="ac48f1"
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

Then load it before TikZJax:

```html id="lo81qx"
<script src="./tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script
  src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"
  defer
></script>
```

This configuration enables:

* bounded parallel rendering;
* adaptive worker-pool sizing;
* one retry after a transient failure;
* replacement of failed workers;
* a finite rendering timeout.

See [Configuration](../configuration.md).

---

## Inline configuration

A separate file is recommended, but the configuration can also be defined inline:

```html id="a90x2y"
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
    }
};
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script
  src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"
  defer
></script>
```

Define only one complete initial `window.TikzJaxOptions` object before loading TikZJax.

---

## Local package loading

Load a specialized LaTeX package on the diagram that uses it:

```html id="8ymr1k"
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

For several packages or package options, use compact JSON:

```html id="r3usg9"
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

Local packages are merged with globally configured packages for that diagram only.

They do not mutate the global configuration.

---

## Local TikZ libraries

TikZ libraries use:

```html id="dygk7q"
data-tikz-libraries
```

Example:

```html id="8fgi4o"
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

Do not declare a TikZ library as a TeX package.

For example, `braids` uses:

```html id="2cnkwc"
data-tikz-libraries="braids"
```

See [Global and Local Configuration](../configuration-scopes.md).

---

## Local preamble

Define a command for one diagram with:

```html id="t8r54r"
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

The command exists only inside this diagram's generated TeX document.

A local preamble replaces the configured global custom `addToPreamble` string for that diagram, so include all required custom definitions in the local value.

---

## Loader dimensions

Reserve more room while a large diagram is compiling:

```html id="90ju0w"
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

The values control the loading placeholder.

They do not resize the final SVG.

---

## Local debugging

Use the following attributes while diagnosing one diagram:

```html id="cpr3yj"
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

This:

* bypasses the persistent SVG cache;
* prints TeX console output;
* prints worker timing information;
* increases the timeout for this diagram.

Remove these attributes after testing.

---

# Runtime asset resolution

TikZJax requires runtime assets in addition to the main script:

```text id="zh9r7y"
tikzjax.min.js
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
fonts.min.css
assets/broken-image.svg
```

With a CDN bundle such as:

```text id="x10t6c"
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js
```

TikZJax normally resolves assets from:

```text id="g4a7ts"
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/
```

For example:

```text id="mupn7d"
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/run-tex.js
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tex.wasm.gz
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/core.dump.gz
```

---

## Custom asset base URL

Use `assetBaseUrl` when the runtime files are hosted somewhere other than the JavaScript bundle's directory:

```html id="y8d202"
<script>
window.TikzJaxOptions = {
    assetBaseUrl:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist"
};
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script
  src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"
  defer
></script>
```

For ordinary jsDelivr or unpkg installation, this is normally unnecessary.

---

# Same-origin installation

TikZJax can be hosted entirely on the same domain as the page.

Recommended directory:

```text id="e12gxh"
/vendor/tikzjax/
    tikzjax.min.js
    run-tex.js
    fonts.min.css
    tex.wasm.gz
    core.dump.gz
    tex_files/
    assets/
        broken-image.svg
```

Configuration:

```html id="3ah88x"
<script>
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
</script>

<link
  rel="stylesheet"
  href="/vendor/tikzjax/fonts.min.css"
>

<script
  src="/vendor/tikzjax/tikzjax.min.js"
  defer
></script>
```

All runtime files must come from the same TikZJax release.

---

## Custom worker URL

When the worker file is not located directly under `assetBaseUrl`, set:

```js id="bnmujh"
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerUrl: "/vendor/tikzjax/workers/run-tex.js",
    workerMode: "direct"
};
```

The nested form is also supported:

```js id="tlyw4s"
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",

    worker: {
        url: "/vendor/tikzjax/workers/run-tex.js",
        mode: "direct"
    }
};
```

Root-level `workerUrl` and `workerMode` take precedence over nested worker values.

---

# Worker modes

TikZJax supports three worker startup modes.

| Mode       | Behavior                                                                        |
| ---------- | ------------------------------------------------------------------------------- |
| `"auto"`   | Uses direct mode for same-origin workers and Blob mode for cross-origin workers |
| `"blob"`   | Fetches the worker source and creates a Blob Worker                             |
| `"direct"` | Starts the worker directly with `new Worker(workerUrl)`                         |

## CDN installation

Use:

```js id="fm8t9r"
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

This is the default.

## Same-origin installation

Use:

```js id="km5nnv"
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

## Strict CSP with no Blob workers

Host the runtime on the same origin and use direct mode.

See the [API Reference](../api-reference.md).

---

# Content Security Policy

## CDN with Blob workers

A typical policy includes:

```http id="l25xka"
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

```http id="1v2jcw"
default-src 'self';
script-src 'self' 'wasm-unsafe-eval';
style-src 'self' 'unsafe-inline';
worker-src 'self';
connect-src 'self';
img-src 'self' data:;
font-src 'self';
object-src 'none';
```

Adapt these examples to the site's complete security policy.

---

# Light and dark themes

For a custom site that stores the active theme in an attribute:

```js id="e7wmui"
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

```js id="lv5buv"
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        darkClass: "theme-dark",
        lightClass: "theme-light",
        fallbackTheme: "light"
    }
};
```

See [Themes](../themes.md).

---

# Advanced standalone example

The advanced example demonstrates:

* a custom theme switcher;
* local storage for the selected theme;
* global TikZJax configuration;
* several diagrams;
* light and dark rendering;
* package-loaded examples.

Source page:

[Advanced Standalone HTML Page](./advanced.html)

Rendered page:

[View the Advanced Standalone HTML Page](https://rod2ik.github.io/tikzjax/installation/advanced.html)

Minimal rendered example:

[View the Minimal Standalone HTML Page](https://rod2ik.github.io/tikzjax/installation/minimal.html)

---

# Verify the installation

Open the browser developer tools.

## Network panel

Verify successful requests for:

```text id="gn9jia"
fonts.min.css
tikzjax.min.js
run-tex.js
tex.wasm.gz
core.dump.gz
```

Package-heavy diagrams may also request files under:

```text id="4uz41s"
tex_files/
```

## Console

Check for:

* CSP violations;
* CORS failures;
* worker initialization errors;
* WebAssembly errors;
* missing runtime files;
* TeX errors.

## Basic test

Use:

```html id="3sg6x6"
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

If this works, add specialized packages and libraries one at a time.

---

# Common installation problems

## The configuration is ignored

Verify that the configuration appears before the TikZJax bundle:

```html id="fsoad0"
<script src="./tikzjax.config.js"></script>
<script src=".../tikzjax.min.js" defer></script>
```

## The worker cannot start

Check:

* `workerMode`;
* `workerUrl`;
* CSP `worker-src`;
* CORS;
* the final `run-tex.js` URL.

## WebAssembly does not initialize

Check:

* `tex.wasm.gz`;
* `core.dump.gz`;
* CSP WebAssembly permissions;
* response content;
* release consistency.

## Optional packages fail

Inspect failed requests under:

```text id="jpkh9t"
tex_files/
```

Use local package declarations and verify that the corresponding compressed files exist in the deployed release.

## Cached output hides a failure

Use:

```html id="b1r37i"
data-disable-cache="true"
```

or clear IndexedDB:

```js id="rbu2us"
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

See [Troubleshooting](../troubleshooting.md).

---

# Related documentation

* [Installation Overview](index.md)
* [MkDocs Installation](mkdocs.md)
* [Configuration](../configuration.md)
* [Global and Local Configuration](../configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](../parallel-rendering.md)
* [Cache and Performance](../cache-performance.md)
* [Themes](../themes.md)
* [API Reference](../api-reference.md)
* [Troubleshooting](../troubleshooting.md)
* [Examples](../examples/index.md)
