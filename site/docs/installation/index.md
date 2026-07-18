# Installation

TikZJax renders TikZ and supported LaTeX packages directly in the browser.

It can be installed on:

* a standalone HTML page;
* an MkDocs site;
* another static documentation site;
* a self-hosted application;
* any site capable of loading JavaScript, CSS, Web Workers, and WebAssembly.

No server-side LaTeX installation is required.

---

## Choose an installation method

### Standalone HTML

Use this method for:

* a custom website;
* a single HTML page;
* a static site without MkDocs;
* testing TikZJax in a minimal environment.

See [Standalone HTML Installation](html.md).

### MkDocs

Use this method for:

* MkDocs Material;
* fenced `tikzjax` code blocks;
* diagrams inside tabs and admonitions;
* client-side MkDocs navigation;
* a documentation site with light and dark themes.

See [MkDocs Installation](mkdocs.md).

### Other static-site generators

For another documentation framework:

1. load the TikZJax configuration before the runtime;
2. load the TikZJax font stylesheet;
3. load the JavaScript bundle;
4. ensure Web Worker and WebAssembly assets are reachable;
5. adapt theme detection to the site's HTML structure;
6. use `<script type="text/tikz">` blocks for locally configured diagrams.

The standalone HTML installation provides the closest general-purpose setup.

---

## Recommended CDN installation

The simplest installation uses the npm package through jsDelivr:

```html id="ig2mvg"
<script src="/assets/javascripts/tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

The loading order is important:

```text id="my4n2o"
1. TikZJax configuration
2. TikZJax stylesheet
3. TikZJax JavaScript bundle
```

The configuration file is optional, but when present it must be loaded before the TikZJax bundle.

---

## Minimal diagram

After installation, add a diagram with:

```html id="ypo5rs"
<script type="text/tikz">
\begin{tikzpicture}
    \draw[very thick]
        (0,0) circle (1);
\end{tikzpicture}
</script>
```

TikZJax replaces the source with a generated SVG.

---

## Recommended configuration

A good starting configuration is:

```js id="9bjv57"
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

* bounded parallel rendering;
* adaptive worker-pool sizing;
* finite rendering timeouts;
* one retry after a transient failure;
* replacement of failed workers.

See [Configuration](../configuration.md).

---

## Local package loading

Specialized packages should normally be loaded only on the diagrams that require them.

```html id="cjxpoy"
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```

TikZ libraries use a separate attribute:

```html id="2u33p7"
<script
  type="text/tikz"
  data-tikz-libraries="arrows.meta,positioning"
>
\begin{tikzpicture}
    \node (A) {A};
    \node[right=1.5cm of A] {B};

    \draw[-{Stealth}]
        (A) -- (B);
\end{tikzpicture}
</script>
```

For the difference between global and local configuration, see [Global and Local Configuration](../configuration-scopes.md).

---

## CDN runtime assets

TikZJax requires more than the main JavaScript file.

The package includes runtime assets such as:

```text id="axjwk4"
tikzjax.min.js
run-tex.js
fonts.min.css
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

When TikZJax is loaded from jsDelivr or unpkg, these files are normally resolved automatically from the same `dist/` directory.

An explicit `assetBaseUrl` is not usually required.

---

## Self-hosting

TikZJax can also be hosted on the same origin as the website.

A typical deployment directory contains:

```text id="j00zfx"
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

Recommended configuration:

```js id="elvhdt"
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

All runtime files must come from the same TikZJax release.

---

## Browser requirements

TikZJax requires a browser with support for:

* JavaScript modules and modern browser APIs;
* Web Workers;
* WebAssembly;
* IndexedDB;
* SVG;
* `MutationObserver`.

For cross-origin CDN workers, the browser must also allow the required CORS and Content Security Policy behavior.

---

## Content Security Policy

A CDN deployment using Blob workers commonly requires directives such as:

```http id="gfiq97"
script-src 'self' https://cdn.jsdelivr.net 'wasm-unsafe-eval';
style-src 'self' https://cdn.jsdelivr.net 'unsafe-inline';
worker-src 'self' blob:;
connect-src 'self' https://cdn.jsdelivr.net;
img-src 'self' https://cdn.jsdelivr.net data: blob:;
font-src 'self' https://cdn.jsdelivr.net;
```

A same-origin deployment using direct workers can usually use:

```http id="alum8y"
script-src 'self' 'wasm-unsafe-eval';
style-src 'self' 'unsafe-inline';
worker-src 'self';
connect-src 'self';
img-src 'self' data:;
font-src 'self';
```

Adapt these examples to the complete security policy of the site.

---

## Production and debugging files

Use the minified files in production:

```text id="6pr0q3"
fonts.min.css
tikzjax.min.js
```

Use the readable files while debugging:

```text id="iowmrz"
fonts.css
tikzjax.js
```

A diagram can also enable local diagnostics:

```html id="i3q0zp"
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-debug-timings="true"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

Remove these diagnostic attributes before publishing the page.

---

## Verify the installation

After loading TikZJax, verify the following in the browser developer tools.

### Network

These files should load successfully:

```text id="2ep1j2"
tikzjax.min.js
fonts.min.css
run-tex.js
tex.wasm.gz
core.dump.gz
```

Package-heavy diagrams may also request files under:

```text id="yv1uqc"
tex_files/
```

### Console

There should be no:

* JavaScript loading error;
* worker creation error;
* WebAssembly error;
* CSP violation;
* CORS failure;
* missing runtime file;
* TeX compilation error.

### Output

The minimal circle example should be replaced with an SVG.

---

## Installation checklist

1. Choose CDN or same-origin hosting.
2. Pin one TikZJax package version.
3. Load the configuration before TikZJax.
4. Load the font stylesheet.
5. Load the JavaScript bundle.
6. Verify that worker and WebAssembly files are reachable.
7. Configure the Content Security Policy.
8. Test a basic TikZ diagram.
9. Test a package-loaded diagram when required.
10. Keep all runtime files on the same release.
11. Remove cache-bypass and debug attributes before production.

---

## Next steps

* [Standalone HTML Installation](html.md)
* [MkDocs Installation](mkdocs.md)
* [Configuration](../configuration.md)
* [Global and Local Configuration](../configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](../parallel-rendering.md)
* [Cache and Performance](../cache-performance.md)
* [Troubleshooting](../troubleshooting.md)
