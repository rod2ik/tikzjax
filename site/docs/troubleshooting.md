# Troubleshooting

This page lists common TikZJax problems, their likely causes, and the recommended diagnostic steps.

When investigating a diagram, start with this local debugging configuration:

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
* shows rendering timings;
* gives the diagram a longer timeout.

Remove the debugging attributes after the problem is solved.

---

## Quick diagnostic checklist

Before investigating a package-specific problem, verify:

1. `tikzjax.config.js` is loaded before `tikzjax.min.js`.
2. `fonts.min.css` loads successfully.
3. `tikzjax.min.js` loads successfully.
4. `run-tex.js` is reachable.
5. `tex.wasm.gz` is reachable.
6. `core.dump.gz` is reachable.
7. `tex_files/` is reachable.
8. All runtime files come from the same TikZJax release.
9. The browser Console contains no JavaScript or TeX error.
10. The Network panel contains no `404`, CORS, or CSP failure.
11. Cache is disabled while reproducing the problem.
12. The required package or TikZ library is declared in the correct category.
13. The diagram is complete and syntactically valid.
14. A fenced block is not relying on undeclared local dependencies.
15. The issue still occurs with one worker.

---

## Recommended loading order

The configuration file is optional, but when present it must be loaded before TikZJax.

```html
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

For debugging, use the non-minified assets:

```html
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.js"></script>
```

---

## Nothing is displayed

### Symptoms

* the original source disappears;
* no loader is shown;
* no SVG appears;
* no fallback image appears;
* TikZJax seems inactive.

### Checks

Open the browser developer tools.

#### Console

Look for:

* JavaScript syntax errors;
* an exception while loading TikZJax;
* an invalid configuration object;
* a CSP error;
* a failed worker constructor;
* an IndexedDB error.

#### Network

Verify that these resources return successful responses:

```text
tikzjax.min.js
fonts.min.css
run-tex.js
tex.wasm.gz
core.dump.gz
```

Also verify that requests under:

```text
tex_files/
```

are not blocked.

#### Source format

Confirm that the source is one of the recognized forms:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

or a recognized fenced block:

````markdown
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

---

## The loading indicator never disappears

Possible causes include:

* worker initialization never completed;
* a runtime request is stalled;
* TeX entered a long-running state;
* the timeout is too high or disabled incorrectly;
* worker messages are blocked by a JavaScript error;
* the page was replaced during rendering.

Use a finite timeout:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

Test the affected block with:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-render-timeout="30000"
>
...
</script>
```

Check the Network panel for requests that remain pending.

---

## The fallback error image is displayed

This means that TikZJax detected the source but could not produce a valid SVG after the permitted attempts.

Common causes include:

* invalid TeX syntax;
* undefined commands;
* incomplete environments;
* missing packages;
* missing TikZ libraries;
* missing runtime `.gz` files;
* a render timeout;
* worker failure;
* blocked WebAssembly or worker assets;
* a DVI conversion failure.

Enable TeX console output:

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

A complete but invalid document is usually better for testing fallback behavior than an unclosed TeX environment.

An unclosed environment may cause TeX to wait for more input until the render timeout expires.

---

## Configuration appears to be ignored

### Initial configuration loaded too late

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

### Several assignments before TikZJax loads

Before TikZJax installs its configuration API, normal JavaScript assignment rules apply.

This replaces the first object:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};

window.TikzJaxOptions = {
    brokenImageSrc: "/images/error.svg"
};
```

Use one complete initial object:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    brokenImageSrc: "/images/error.svg"
};
```

After TikZJax has loaded, use:

```js
window.TikzJaxConfigure({
    brokenImageSrc: "/images/error.svg"
});
```

### Local value overrides global value

A local attribute has higher priority:

```html
<script
  type="text/tikz"
  data-render-timeout="45000"
>
...
</script>
```

This diagram does not use the global timeout.

See [Global and Local Configuration](configuration-scopes.md).

---

## Inspecting the active configuration

Global configuration:

```js
window.TikzJaxOptions
```

Worker-pool configuration:

```js
window.TikzJaxOptions?.workerPool
```

Global TeX packages:

```js
window.TikzJaxOptions?.tex?.texPackages
```

Global TikZ libraries:

```js
window.TikzJaxOptions?.tex?.tikzLibraries
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

## Invalid local JSON

Attributes such as:

```text
data-tikzjax-options
data-options
data-tex
data-tex-packages
data-tkz-tab
```

may contain JSON.

Incorrect:

```html
data-tikzjax-options='{
  renderTimeout: 30000,
}'
```

Problems:

* the property name is not quoted;
* the final property has a trailing comma.

Correct:

```html
data-tikzjax-options='{
  "renderTimeout": 30000
}'
```

Use single quotes around the HTML attribute and double quotes inside the JSON.

---

## Dedicated attributes override local JSON

This source defines the timeout twice:

```html
<script
  type="text/tikz"
  data-tikzjax-options='{
    "renderTimeout": 30000
  }'
  data-render-timeout="45000"
>
...
</script>
```

The dedicated attribute wins:

```text
45000 milliseconds
```

Avoid defining the same option in two places unless the override is intentional.

---

## A TikZ library is missing

Symptoms may include:

```text
I do not know the key ...
```

or:

```text
Undefined control sequence
```

Load a library locally:

```html
<script
  type="text/tikz"
  data-tikz-libraries="decorations.pathreplacing"
>
\begin{tikzpicture}
    \draw[
        decorate,
        decoration={
            brace,
            amplitude=6pt
        }
    ]
        (0,0) -- (4,0);
\end{tikzpicture}
</script>
```

Or globally when nearly every diagram needs it:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: [
            "decorations.pathreplacing"
        ]
    }
};
```

---

## A LaTeX package is missing

Load one package locally:

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

For several packages or package options, use JSON:

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

Global package configuration:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            physics: "",
            xcolor: "dvipsnames"
        }
    }
};
```

Use an empty string when a package has no options.

---

## Package or TikZ library?

A LaTeX package is normally loaded with:

```latex
\usepackage{package-name}
```

Declare it with:

```html
data-tex-packages="package-name"
```

A TikZ library is normally loaded with:

```latex
\usetikzlibrary{library-name}
```

Declare it with:

```html
data-tikz-libraries="library-name"
```

For example, `braids` is a TikZ library:

```html
data-tikz-libraries="braids"
```

It is not:

```html
data-tex-packages="braids"
```

---

## A runtime package file returns `404`

The browser Console or Network panel may show:

```text
GET .../tex_files/chemfig.sty.gz 404
```

or another missing file ending in:

```text
.sty.gz
.tex.gz
.def.gz
.code.tex.gz
```

This means the worker requested a runtime dependency that is not available at the resolved path.

Check:

1. the file exists under the deployed `tex_files/` directory;
2. the filename matches the TeX request exactly;
3. the JavaScript bundle and `tex_files/` directory use the same release;
4. the CDN package version is correct;
5. the server preserves filename case;
6. the request is not rewritten to an HTML fallback page;
7. the file is served with a successful HTTP status.

Use the exact failed URL from the Network panel. Do not guess the missing filename.

---

## A custom command is undefined

Global macro:

```js
window.TikzJaxOptions = {
    tex: {
        addToPreamble: String.raw`
\newcommand{\R}{\mathbb{R}}
`
    }
};
```

Local macro:

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

### Local preamble replacement

`data-add-to-preamble` is a scalar override.

A local value replaces the global custom `tex.addToPreamble` value for that diagram.

Suppose the global preamble defines:

```latex
\newcommand{\R}{\mathbb{R}}
```

This local source:

```html
<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\N}{\mathbb{N}}"
>
...
</script>
```

does not automatically retain the global `\R` definition.

Include all required definitions in the local value:

```html
<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\R}{\mathbb{R}}\newcommand{\N}{\mathbb{N}}"
>
...
</script>
```

---

## `tkz-tab` configuration appears to be ignored

First verify that the LaTeX package is loaded. The `tkzTab` configuration does not load `tkz-tab` by itself.

Global loading:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            "tkz-tab": ""
        }
    }
};
```

Local loading:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
>
...
</script>
```

### Check automatic application

Automatic native defaults require:

```js
window.TikzJaxOptions = {
    tkzTab: {
        autoApply: true
    }
};
```

When `autoApply` is enabled, supported values such as `lineWidth`, `font`, `lgt`, `firstColumnWidth`, `espcl`, `init`, `setup`, and `colors` are applied without requiring the source to reference the public helper macros.

Inspect the active global object:

```js
window.TikzJaxOptions?.tkzTab
```

For a local override, verify that `data-tkz-tab` contains valid JSON:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-tkz-tab='{
    "autoApply": true,
    "lineWidth": "1.4pt",
    "firstColumnWidth": 5,
    "espcl": 3,
    "init": {
      "deltacl": 0.8
    }
  }'
>
...
</script>
```

### Check option priority

Explicit TeX options have higher priority than configured defaults.

For example:

```latex
\tkzTabInit[
    lw=0.8pt,
    lgt=4
]
```

overrides the configured native `lw` and `lgt` defaults for that table.

Within the merged `tkzTab` object, values in `init` override the corresponding values automatically derived from `lineWidth`, `lgt`, `firstColumnWidth`, or `espcl`.

### Check row heights

Row-height values are not applied automatically. They remain explicit helper macros because TikZJax cannot infer the semantic type of each required `label/height` row:

```text
\tikzjaxTkzTabVariableRowHeight
\tikzjaxTkzTabSignRowHeight
\tikzjaxTkzTabVariationRowHeight
\tikzjaxTkzTabImageRowHeight
\tikzjaxTkzTabAntecedentRowHeight
```

### Force a fresh render

A cached SVG can hide a changed `tkzTab` configuration.

Use:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-disable-cache="true"
  data-show-console="true"
>
...
</script>
```

or clear IndexedDB:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

See the [`tkz-tab` examples](examples/tkz-tab.md) and the [API Reference](api-reference.md).

---

## A fenced block works as HTML but not as Markdown

Fenced `tikzjax` blocks cannot carry local HTML attributes.

This fenced block:

````markdown
```tikzjax
\chemfig{H_3C-CH_2-OH}
```
````

works only when `chemfig` is loaded globally.

For local loading, use an HTML block:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```

Use fenced blocks only when all required dependencies are already present in the global configuration.

---

## MkDocs fenced blocks are not detected

Configure `pymdownx.superfences`:

```yaml
markdown_extensions:
  - pymdownx.superfences:
      custom_fences:
        - name: tikzjax
          class: language-tikzjax
          format: !!python/name:pymdownx.superfences.fence_code_format
```

Use:

````markdown
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

The generated `<pre>` element should contain one of these classes:

```text
language-tikzjax
tikzjax
language-tikz
tikz
```

Inspect the generated HTML in DevTools when unsure.

---

## Blocks inside tabs or admonitions are not rendered

Check Markdown indentation carefully.

Admonition:

````markdown
!!! success "Example"

    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) circle (1);
    \end{tikzpicture}
    ```
````

Content tab:

````markdown
=== "Solution"

    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) circle (1);
    \end{tikzpicture}
    ```
````

If the source is present in the final DOM but remains unprocessed:

* check for a JavaScript error that stopped DOM observation;
* check whether the source class is recognized;
* activate the tab and inspect the element;
* test the same source as an HTML `<script>` block;
* verify that client-side navigation did not load a second incompatible TikZJax bundle.

Dynamic sources use the same central queue and worker pool as initial sources.

---

## Dynamically inserted content is not rendered

TikZJax detects newly inserted sources through a central DOM observer.

Verify that the inserted element:

* is connected to the active document;
* uses `type="text/tikz"` or a recognized `<pre>` class;
* contains non-empty source text;
* is not immediately removed or replaced;
* is not inside an iframe with a separate JavaScript context;
* is inserted after TikZJax has loaded.

Example:

```js
const source = document.createElement("script");

source.type = "text/tikz";
source.textContent = String.raw`
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
`;

document.body.appendChild(source);
```

No manual render call should be required for normal document insertion.

---

## A diagram does not change after editing

TikZJax may be inserting a cached SVG.

Temporarily use:

```html
data-disable-cache="true"
```

Complete example:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
>
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
\end{tikzpicture}
</script>
```

Or clear the complete cache:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

Also check the Network panel to confirm that the browser loaded the expected version of `tikzjax.min.js`.

---

## A cached diagram hides a current runtime failure

A previously stored SVG can continue to appear even if a package file is now missing.

Force a fresh render:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
>
...
</script>
```

This is important when testing:

* a new npm release;
* changed `tex_files/`;
* CDN propagation;
* a new package catalogue;
* worker changes.

---

## A repeated diagram renders more than once

Pending-job grouping and persistent cache reuse require the exact same rendering identity.

Check for differences in:

* whitespace;
* comments;
* local package declarations;
* TikZ libraries;
* local preamble;
* `data-tkz-tab`;
* JSON formatting and values;
* loader dimensions;
* cache behavior.

These sources are different:

```latex
\draw (0,0) circle (1);
```

```latex
\draw
    (0,0)
    circle (1);
```

Even when their visual output is identical.

---

## Rendering is slow

### Check global dependencies

Avoid this unless every diagram needs the packages:

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

Prefer local loading:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```

### Check cache bypass

Search for diagrams that still contain:

```html
data-disable-cache="true"
```

### Check worker restarts

Repeated worker failures destroy worker-local package caches and runtime state.

Look for repeated initialization or restart messages.

### Check worker count

Too many workers can increase memory pressure and CPU contention.

Recommended baseline:

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: true,
        maxWorkers: 3,
        reserveCpuCores: 1,
        useDeviceMemory: true
    }
};
```

### Measure a fresh render

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-debug-timings="true"
>
...
</script>
```

See [Cache and Performance](cache-performance.md).

---

## The first package-heavy diagram is slow

The assigned worker may need to:

* download package files;
* download dependencies;
* decompress runtime files;
* insert them into its virtual filesystem;
* process a larger TeX preamble.

Later diagrams using the same package on the same worker may be faster.

Another worker may still experience its own first-use cost because worker dependency caches are isolated.

This is expected behavior.

---

## The same package is prepared by several workers

Workers do not directly share their decompressed TeX files or virtual filesystems.

Several workers can therefore prepare the same package independently.

The browser HTTP cache may reduce the network transfer, but the worker-local decompression and setup still occur.

This is not a package-loading loop unless the same worker repeatedly requests the file for every job.

---

## Increasing `maxWorkers` made rendering slower

Possible causes:

* CPU contention;
* memory pressure;
* duplicated TeX runtimes;
* simultaneous decompression;
* duplicated worker-local package caches;
* thermal throttling;
* browser scheduling overhead.

Return to a modest configuration:

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: true,
        maxWorkers: 3,
        reserveCpuCores: 1,
        useDeviceMemory: true
    }
};
```

Then compare with a one-worker setup.

---

## Testing with one worker

Use:

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

This helps distinguish:

* a general TeX error;
* a package error;
* a cache problem;
* a concurrency-sensitive issue;
* application code that assumes source-order completion.

For normal production use, restore the adaptive pool.

---

## Only some diagrams render

Possible causes:

* one or more workers failed to initialize;
* some diagrams require a missing package;
* only uncached diagrams expose the failure;
* one worker repeatedly fails on a specific dependency;
* a local timeout is too short;
* source blocks were removed during navigation;
* invalid JSON affects only selected blocks.

Test the failing diagram with:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-render-timeout="45000"
>
...
</script>
```

Then test the page with one worker.

---

## Diagrams finish in an unexpected order

Parallel rendering does not guarantee document-order completion.

For example:

```text
source order:
A, B, C

completion order:
B, C, A
```

Each SVG is still inserted in the correct document position.

Use the completion event rather than relying on source order:

```js
document.addEventListener(
    "tikzjax-load-finished",
    function (event) {
        console.log(
            "Diagram ready:",
            event.target
        );
    }
);
```

---

## A completion listener does not run

Listen on `document`, because the event bubbles from the generated SVG:

```js
document.addEventListener(
    "tikzjax-load-finished",
    function (event) {
        const svg = event.target;

        console.log(svg);
    }
);
```

Register the listener before the diagram is likely to finish.

The event is emitted for both freshly rendered and cached SVG insertion.

Do not assume events arrive in document order.

---

## A visible diagram renders after a distant diagram

Viewport priority applies to pending work.

A job that is already compiling is not normally interrupted when another source becomes visible.

Other factors can include:

* the distant diagram was cached;
* the distant job had already started;
* the visible diagram needed package initialization;
* an explicit `data-render-priority` value changed the order;
* the visible source was still hidden or disconnected when priority was calculated.

Remove explicit priority overrides unless they are required.

---

## Worker initialization fails

Possible symptoms include:

* no diagrams render;
* the fallback image appears immediately;
* repeated worker-start messages;
* an error mentioning WebAssembly or worker initialization;
* `run-tex.js` loads but the worker never becomes ready.

Check:

```text
run-tex.js
tex.wasm.gz
core.dump.gz
```

Also check:

* `assetBaseUrl`;
* `workerUrl`;
* `workerMode`;
* CORS;
* CSP;
* response MIME types;
* compressed-file integrity;
* release consistency.

Recommended initialization retry:

```js
window.TikzJaxOptions = {
    workerPool: {
        initializationRetries: 1
    }
};
```

Initialization retries are separate from diagram-render retries.

---

## A single worker repeatedly fails

A worker can become unusable after:

* a fatal WebAssembly error;
* a timeout;
* corrupted runtime state;
* an unexpected worker exception.

Keep restart enabled:

```js
window.TikzJaxOptions = {
    restartWorkerOnFail: true
};
```

TikZJax can terminate the affected worker and initialize a replacement.

Other workers can continue their current jobs.

Frequent restarts indicate an underlying problem and should not be treated as normal operation.

---

## A timeout occurs

Global timeout:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

Local timeout:

```html
<script
  type="text/tikz"
  data-render-timeout="45000"
>
...
</script>
```

A timeout is a safety limit, not a performance target.

Increasing it does not make the diagram faster.

Before increasing it, check:

* TeX console output;
* missing-file requests;
* unclosed environments;
* package initialization;
* repeated recursion or loops;
* excessive drawing complexity.

---

## A retry does not fix the diagram

Retries are intended for transient worker or runtime failures.

They do not fix:

* invalid TeX syntax;
* an undefined command;
* a missing package;
* a missing runtime file;
* an unsupported package feature.

With:

```js
window.TikzJaxOptions = {
    maxRetries: 1
};
```

TikZJax performs one initial attempt and at most one retry.

Do not use a large retry value to hide deterministic failures.

---

## Worker files are not loaded

Required runtime files include:

```text
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

When using jsDelivr or unpkg, TikZJax normally resolves them relative to the loaded bundle.

Explicit jsDelivr configuration:

```js
window.TikzJaxOptions = {
    assetBaseUrl:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist"
};
```

Same-origin configuration:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

Expected local files:

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

## Worker mode problems

### Automatic mode

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

TikZJax uses:

* direct worker startup for same-origin URLs;
* Blob worker startup for cross-origin URLs.

### Direct mode

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

Use this for same-origin hosting and CSP policies that do not allow Blob workers.

### Blob mode

```js
window.TikzJaxOptions = {
    workerMode: "blob"
};
```

Use this only when the CSP allows Blob workers and the browser can fetch the worker source.

Root `workerMode` and `workerUrl` take precedence over nested `worker.mode` and `worker.url`.

---

## CSP blocks TikZJax

Browser errors may mention:

```text
Refused to create a worker
Refused to connect
Refused to compile or instantiate WebAssembly
```

### CDN with Blob workers

A typical policy includes:

```http
script-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'wasm-unsafe-eval';
style-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'unsafe-inline';
worker-src 'self' blob:;
connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
img-src 'self' https://cdn.jsdelivr.net https://unpkg.com data: blob:;
font-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
```

### Same-origin direct workers

```http
script-src 'self' 'wasm-unsafe-eval';
style-src 'self' 'unsafe-inline';
worker-src 'self';
connect-src 'self';
img-src 'self' data:;
font-src 'self';
```

Adapt these examples to the complete policy of the site.

---

## CORS blocks a CDN resource

Check the failed request in the Network panel.

Common causes include:

* a worker started in direct mode from another origin;
* the worker source cannot be fetched for Blob mode;
* redirects remove expected CORS headers;
* a proxy modifies the response;
* a local development server blocks cross-origin requests.

For cross-origin CDN usage, keep:

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

For strict same-origin hosting, copy all TikZJax runtime files locally and use direct mode.

---

## A response returns HTML instead of a runtime file

A missing asset may be rewritten by the server to an application HTML page.

For example, a request for:

```text
/vendor/tikzjax/tex.wasm.gz
```

may return the site's `index.html` with status `200`.

The request looks successful but the worker cannot parse the file.

Inspect:

* the response content type;
* the response body;
* rewrite rules;
* static-file exclusions;
* SPA fallback behavior.

Runtime asset paths must bypass HTML fallback rewrites.

---

## WebAssembly initialization fails

Check:

* `tex.wasm.gz` returns the expected binary data;
* the file is not an HTML error page;
* the gzip data is not corrupted;
* CSP allows WebAssembly execution;
* the bundle and runtime files use the same release;
* a proxy is not recompressing the `.gz` file incorrectly.

Test in a clean browser profile when cached network data may be stale.

---

## Dark mode looks incorrect

TikZJax adapts common default black, white, and text colors.

Explicitly selected colors are generally preserved.

Check the theme configuration:

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

Also check:

* the selector matches the element containing the theme state;
* the attribute changes when the site theme changes;
* dark and light values match the actual HTML;
* custom SVG or CSS rules are not overriding TikZJax styles.

See [Themes](themes.md).

---

## Explicit colors change unexpectedly

Use explicit TikZ colors for elements that must not follow automatic text-color adaptation:

```latex
\draw[red,very thick] (0,0) -- (2,0);
\node[text=blue] at (1,0.5) {Label};
```

Avoid relying on implicit black when the element must remain black in both themes.

Inspect the generated SVG to determine whether the affected value is a fill, stroke, text color, or CSS rule.

---

## The fallback image path is wrong

Global fallback:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/assets/images/tikz-error.svg"
};
```

Local fallback:

```html
<script
  type="text/tikz"
  data-broken-image-src="/assets/images/local-error.svg"
>
...
</script>
```

For MkDocs, a relative URL is resolved from the generated page location, not necessarily from the Markdown source file.

Prefer:

* a root-relative path;
* a URL produced by the MkDocs template system;
* a versioned CDN URL.

Inspect the final image request in the Network panel.

---

## The local fallback image is ignored

The attribute must be directly on the source element:

```html
<script
  type="text/tikz"
  data-broken-image-src="/assets/images/local-error.svg"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

This does not apply the local value:

```html
<div data-broken-image-src="/assets/images/local-error.svg">
    <script type="text/tikz">
    ...
    </script>
</div>
```

The fallback image is used only after the diagram fails.

A successfully rendered diagram never displays it.

---

## The default fallback appears instead of the configured image

Verify:

1. the configuration file loads before TikZJax;
2. `brokenImageSrc` is spelled correctly;
3. no later partial update replaces it;
4. no local `data-broken-image-src` overrides it;
5. the selected image itself loads successfully.

Inspect:

```js
window.TikzJaxOptions?.brokenImageSrc
```

---

## TeX console output does not appear

Use:

```html
data-show-console="true"
```

Example:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
>
...
</script>
```

A cached SVG does not run TeX again, so no new TeX output is produced.

Do not rely on:

```html
data-show-console="false"
```

to disable console output. Omit the attribute when it is not needed.

---

## Timing output does not appear

Use:

```html
data-debug-timings="true"
```

and force a fresh render:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-debug-timings="true"
>
...
</script>
```

A persistent SVG cache hit bypasses worker compilation and therefore does not produce fresh worker timing stages.

---

## A loader is too small

Set placeholder dimensions:

```html
<script
  type="text/tikz"
  data-width="620"
  data-height="300"
>
...
</script>
```

The values are interpreted as TeX points for the loading placeholder.

They do not resize the final SVG.

---

## Generated SVG is clipped

Wrap the source in:

```html
<div class="tikzjax-container">
    <script type="text/tikz">
    ...
    </script>
</div>
```

For a full-size responsive container:

```html
<div class="tikzjax-scaled-container">
    <script type="text/tikz">
    ...
    </script>
</div>
```

Also check parent elements for CSS such as:

```css
overflow: hidden;
```

---

## MathJax processes TikZJax output

TikZJax generated wrappers include:

```text
mathjax_ignore
```

If MathJax still processes generated SVG text:

* verify the wrapper class remains present;
* check whether another script removes or replaces the wrapper;
* inspect MathJax configuration;
* avoid manually moving generated SVG children outside the wrapper;
* ensure MathJax is not configured to ignore the standard exclusion class.

---

## Different results appear after client-side navigation

Possible causes include:

* TikZJax loaded more than once;
* global configuration was reassigned by the new page;
* old and new runtime versions coexist;
* the theme observer refers to a removed element;
* cached SVGs were generated with another configuration;
* page scripts execute in a different order.

Check the Network panel for duplicate TikZJax bundles.

Load TikZJax once in the site template rather than once per page.

---

## Runtime files come from different releases

Mixed versions can produce subtle failures.

For example:

```text
tikzjax.min.js from release A
run-tex.js from release B
tex.wasm.gz from release A
tex_files/ from release C
```

Possible symptoms include:

* worker initialization failure;
* missing message fields;
* unavailable package files;
* unexpected TeX errors;
* cache incompatibilities;
* incorrect worker-pool behavior.

Pin one exact package version and use it for every runtime URL.

---

## CDN changes are not visible

CDN and browser caches may still contain a previous immutable version.

Verify:

* the URL contains the intended package version;
* npm shows that exact release;
* the requested response has the expected content;
* the browser is not using a service-worker cache;
* IndexedDB is cleared when testing rendering changes.

Do not overwrite an already published immutable version and expect every cache to update immediately.

---

## Diagnostic configurations

### Standard diagnostic mode

```js
window.TikzJaxOptions = {
    renderTimeout: 45000,
    maxRetries: 0,
    restartWorkerOnFail: true,

    workerPool: {
        enabled: true,
        maxWorkers: 1,
        reserveCpuCores: 0,
        useDeviceMemory: false,
        initializationRetries: 1
    }
};
```

Use local diagnostics on the affected block:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-debug-timings="true"
>
...
</script>
```

### Restore recommended production mode

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

---

## Recommended debugging workflow

### Step 1: Test basic TikZ

```html
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

If this fails, the problem is probably runtime-wide.

### Step 2: Add the required dependency

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    \node {$\vb{F}$};
\end{tikzpicture}
</script>
```

### Step 3: Add options incrementally

Start with the smallest valid example and add:

* packages;
* libraries;
* preamble commands;
* styles;
* complex paths;

one at a time.

### Step 4: Inspect failed network requests

Focus on:

```text
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/*.gz
```

### Step 5: Test one worker

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: true,
        maxWorkers: 1
    }
};
```

### Step 6: Clear IndexedDB

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

### Step 7: Restore production settings

Remove debugging attributes and restore the normal worker-pool size.

---

## Information to collect for a bug report

Include:

* TikZJax version;
* browser name and version;
* operating system;
* deployment method;
* complete minimal source;
* effective global configuration;
* local `data-*` attributes;
* Console errors;
* failed Network requests;
* whether cache was disabled;
* whether the issue occurs with one worker;
* whether the issue occurs on a clean browser profile;
* whether the basic circle example works.

Minimal source template:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    % Minimal failing source
\end{tikzpicture}
</script>
```

Remove unrelated site code before reporting the problem.

---

## Related documentation

* [Configuration](configuration.md)
* [Global and Local Configuration](configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](parallel-rendering.md)
* [Cache and Performance](cache-performance.md)
* [Runtime Architecture](architecture.md)
* [Themes](themes.md)
* [Fallback and Error Images](fallback-error-images.md)
* [API Reference](api-reference.md)
* [Examples](examples/index.md)
