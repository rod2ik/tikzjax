# Cache and Performance

TikZJax uses several complementary mechanisms to avoid unnecessary work and keep pages responsive:

1. a persistent SVG cache in IndexedDB;
2. pending-job deduplication for identical diagrams;
3. worker-local caches for TeX runtime files;
4. the browser's normal HTTP cache.

These mechanisms solve different problems.

```text
diagram discovered
    |
    v
persistent SVG cache lookup
    |
    +-- cache hit  --> insert SVG
    |
    +-- cache miss --> check pending jobs
                          |
                          +-- identical job exists
                          |       |
                          |       v
                          |   join existing render
                          |
                          +-- no identical job
                                  |
                                  v
                           global render queue
                                  |
                                  v
                           available worker
                                  |
                                  v
                             TeX compilation
```

For worker scheduling and pool sizing, see [Parallel Rendering and the Worker Pool](parallel-rendering.md).

---

## Cache layers at a glance

| Mechanism                   | Scope                | Purpose                                                  |
| --------------------------- | -------------------- | -------------------------------------------------------- |
| Persistent SVG cache        | Browser profile      | Reuse a previously generated SVG                         |
| Pending-job deduplication   | Current page runtime | Avoid compiling identical pending diagrams several times |
| Worker-local TeX file cache | One worker           | Reuse downloaded and decompressed TeX dependencies       |
| Worker runtime reuse        | One worker           | Reuse the initialized WebAssembly and TeX engine         |
| Browser HTTP cache          | Browser              | Reduce repeated network transfers                        |

A cache hit at the SVG level is the fastest result because no TeX compilation is required.

---

# Persistent SVG cache

## IndexedDB storage

TikZJax stores rendered SVG output in IndexedDB.

The current storage uses:

```text
Database: TikzJax
Object store: svgImages
```

The cached value is the generated SVG markup.

On a later page visit, TikZJax can insert that SVG without sending the diagram to a rendering worker.

---

## Cache lookup flow

For each discovered diagram, TikZJax determines whether the persistent cache may be used.

```text
source discovered
    |
    v
build rendering identity
    |
    v
look up IndexedDB entry
    |
    +-- found --> insert cached SVG
    |
    +-- absent --> enqueue rendering job
```

A cached diagram:

* does not occupy a rendering worker;
* does not recompile its TeX source;
* does not reload its diagram-specific dependencies;
* can appear before uncached diagrams finish.

---

## Cache identity

The persistent cache identity includes:

```text
exact TikZ source
+
serialized effective diagram dataset
```

The dataset represents the configuration sent to the rendering worker.

Relevant inputs can include:

* TeX packages;
* TikZ libraries;
* custom preamble content;
* `tkz-tab` configuration;
* rendering timeout and retry values;
* fallback and debugging options;
* other local rendering attributes.

Two diagrams can share a cache entry only when their effective rendering input is identical.

---

## Exact source matters

These two sources may produce the same visual result, but they are different cache inputs:

```latex
\draw (0,0) circle (1);
```

```latex
\draw
    (0,0)
    circle
    (1);
```

Whitespace, comments, and formatting are part of the exact source string.

For the best cache reuse, keep repeated diagrams byte-for-byte identical when possible.

---

## Local configuration matters

These diagrams have identical TikZ source but different package datasets:

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

They are treated as distinct rendering inputs.

The same applies to changes in attributes such as:

```text
data-tex-packages
data-tikz-libraries
data-add-to-preamble
data-tkz-tab
data-tikzjax-options
```

---

## Global configuration and cache identity

Local effective configuration is built from:

```text
TikZJax defaults
< global configuration
< later global updates
< local diagram configuration
```

Changes to relevant global TeX settings can therefore produce new cache identities.

For example, changing:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: [
            "arrows.meta"
        ]
    }
};
```

to:

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

changes the effective dataset of diagrams using the global configuration.

Those diagrams may be rendered again and stored under new cache entries.

See [Global and Local Configuration](configuration-scopes.md).

---

## Loader dimensions and cache entries

Attributes such as:

```html
data-width="600"
data-height="240"
```

primarily control the loading placeholder.

They do not resize the generated SVG.

Because local dataset values participate in the rendering identity, changing them may still produce a different cache lookup.

For consistent reuse, keep repeated diagram attributes consistent.

---

# Disabling the persistent cache

## Local cache bypass

Use:

```html
data-disable-cache="true"
```

to bypass persistent SVG caching for one diagram:

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

This is useful while testing:

* changes to TikZJax itself;
* package-loading behavior;
* generated TeX preambles;
* missing runtime dependencies;
* timeout and retry behavior;
* worker scheduling;
* TeX console output;
* theme conversion.

Keep the cache enabled for normal production pages.

---

## What cache bypass means

With cache disabled, TikZJax does not reuse an existing persistent SVG result for that diagram.

The source is sent through the rendering path again.

```text
data-disable-cache="true"
    |
    v
skip persistent SVG reuse
    |
    v
enqueue fresh rendering work
```

It does not disable:

* the browser's HTTP cache;
* the worker's in-memory dependency cache;
* the worker's initialized WebAssembly runtime.

A fresh SVG compilation may therefore still benefit from previously prepared worker state.

---

## Do not leave cache bypass enabled in production

This configuration forces unnecessary TeX compilations on every page visit:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
>
...
</script>
```

Remove the attribute after debugging.

For a documentation page containing many diagrams, leaving it enabled can significantly increase:

* page rendering time;
* CPU use;
* memory pressure;
* worker activity;
* repeated package processing.

---

# Clearing the persistent cache

Delete the complete TikZJax IndexedDB database from the browser console:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

This removes all stored SVG entries for the current browser profile and origin.

Use this when:

* testing a new TikZJax release;
* changing global package configuration;
* debugging an unexpected cached result;
* validating first-render performance;
* checking fallback behavior;
* investigating cache migration problems.

!!! note

```
IndexedDB storage is origin-specific.

Clearing the cache on a local development origin does not clear the cache for the deployed documentation site.
```

---

# Pending-job deduplication

The persistent SVG cache helps after a diagram has already been rendered.

Pending-job deduplication helps when identical diagrams are discovered before the first compilation has finished.

```text
diagram A ─┐
diagram A ─┼──> one worker job
diagram A ─┘          |
                      v
                 one SVG result
                      |
             reused for all targets
```

This prevents several workers from compiling the same rendering input simultaneously.

---

## Deduplication requirements

Diagrams can join the same pending render only when their rendering identity matches.

This includes:

* exact source;
* effective TeX packages;
* effective TikZ libraries;
* effective preamble;
* local configuration dataset.

These diagrams can normally share one pending job:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>

<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

These cannot:

```html
<script
  type="text/tikz"
  data-tikz-libraries="calc"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>

<script
  type="text/tikz"
  data-tikz-libraries="positioning"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

---

## Deduplication is not the persistent cache

The two mechanisms operate at different times:

```text
persistent cache:
reuse a completed result from an earlier render

pending-job deduplication:
share a render that is currently in progress
```

After a successful pending job completes, its generated SVG can also be stored in the persistent cache.

---

# Worker-local TeX caches

Each rendering worker maintains an in-memory cache of TeX files that it has downloaded and decompressed.

For example:

```text
worker 1:
- physics.sty
- amsmath.sty
- tikzlibrarypositioning.code.tex

worker 2:
- chemfig.sty
- simplekv.sty
- tikzlibrarycalc.code.tex
```

A later job assigned to the same worker can reuse those prepared files.

---

## Worker caches are isolated

One worker cannot directly read another worker's virtual filesystem or decompressed-file cache.

If two workers need the same package, each worker may need to prepare its own in-memory copy:

```text
worker 1 --> prepare circuitikz
worker 2 --> prepare circuitikz
```

The browser's HTTP cache may prevent a full network transfer the second time, but decompression and virtual-filesystem setup remain worker-local.

---

## Why specialized first renders are slower

The first diagram using an optional package may require the worker to:

1. request the package file;
2. request its dependencies;
3. decompress the files;
4. store them in its virtual filesystem;
5. build the TeX preamble;
6. compile the diagram.

For example:

```text
first chemfig job on worker 1:
dependency preparation + TeX compilation

later chemfig job on worker 1:
reuse dependencies + TeX compilation
```

A second worker may still experience its own first-use cost.

---

## Worker restart clears local caches

When a worker is restarted, its local runtime state is discarded:

* initialized TeX engine;
* virtual filesystem;
* decompressed package files;
* compiled WebAssembly state associated with that worker;
* other worker-local caches.

The replacement worker starts with a fresh runtime.

Other healthy workers keep their own state.

---

# WebAssembly runtime reuse

TikZJax does not create a new TeX WebAssembly runtime for every diagram.

An initialized worker can process several jobs sequentially:

```text
worker initialization
    |
    +-- initialize WebAssembly
    +-- load core dump
    +-- prepare virtual filesystem
    |
    v
diagram A
    |
    v
diagram D
    |
    v
diagram G
```

This makes a persistent worker pool more efficient than repeatedly creating a new worker for each source block.

---

# Browser HTTP cache

Runtime files are fetched through the browser's normal networking layer.

These may include:

```text
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/*.gz
```

The browser can reuse HTTP responses according to the server's cache headers.

This reduces network transfer, but it does not replace the worker-local decompressed-file cache.

```text
browser HTTP cache:
compressed response bytes

worker cache:
decompressed TeX files and runtime state
```

Use appropriate immutable caching headers when self-hosting versioned TikZJax assets.

---

# Parallel rendering and performance

TikZJax uses a bounded pool of workers to render independent diagrams concurrently.

Recommended configuration:

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

The effective worker count can be lower than `maxWorkers`.

---

## More workers are not always faster

Increasing the worker count also increases:

* WebAssembly runtime memory;
* virtual-filesystem memory;
* duplicated dependency caches;
* simultaneous decompression;
* CPU contention;
* pressure on mobile devices.

A large pool may make rendering slower on constrained hardware.

Avoid selecting the worker count only from a high-end development computer.

---

## Recommended worker limit

For most documentation sites, begin with:

```js
workerPool: {
    enabled: true,
    maxWorkers: 3,
    reserveCpuCores: 1,
    useDeviceMemory: true
}
```

Measure representative pages before increasing `maxWorkers`.

A representative test should include:

* desktop and mobile devices;
* a cold browser cache;
* a warm browser cache;
* a cleared IndexedDB cache;
* simple and specialized diagrams;
* pages with several diagrams visible at once.

---

## One-worker comparison

To measure sequential worker performance while retaining the same scheduling system:

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

Compare this against the normal pool configuration.

This helps determine whether a slowdown is caused by:

* an individual diagram;
* package initialization;
* worker startup;
* excessive concurrency;
* completion-order assumptions.

---

## Dependency affinity

When workers are available for a queued job, TikZJax may prefer a worker that already has useful dependencies prepared.

For example:

```text
pending job:
- chemfig

worker 1:
- idle
- chemfig cached

worker 2:
- idle
- no chemfig cache
```

Worker 1 is the better candidate.

Dependency affinity is only a secondary scheduling criterion.

Keeping workers busy and respecting viewport priority remain more important than waiting indefinitely for a perfect cache match.

---

# Viewport priority

TikZJax prioritizes pending diagrams according to their relationship with the current viewport.

A simplified order is:

```text
visible diagrams
nearby diagrams
distant diagrams
hidden or disconnected diagrams
```

This improves perceived performance.

A diagram near the bottom of a long page may finish after a later-discovered diagram currently visible in a content tab.

Parallel rendering therefore does not guarantee completion in document order.

---

# Global versus local dependencies

Every globally configured package is inserted into every diagram's TeX preamble.

This configuration:

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

makes even a simple circle process all four packages:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

Prefer local loading for specialized dependencies:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```

This reduces unnecessary TeX preamble work.

---

## Global dependencies that make sense

A global dependency can be appropriate when nearly every diagram uses it.

Example:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: [
            "arrows.meta"
        ]
    }
};
```

Use global configuration for:

* broadly shared libraries;
* site-wide macros;
* dependencies required by fenced `tikzjax` blocks;
* common rendering behavior.

See [Global and Local Configuration](configuration-scopes.md).

---

## Fenced blocks and performance

A fenced block cannot declare local HTML attributes:

````markdown
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

Dependencies required by fenced blocks must be global.

If a specialized package is needed only once, an HTML block is usually more efficient:

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
>
\pgfspectra[element=H]
</script>
```

---

# Timeouts and performance

## Global timeout

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

The value is expressed in milliseconds and applies to each rendering attempt.

A timeout protects a worker from remaining occupied indefinitely.

---

## Local timeout

```html
<script
  type="text/tikz"
  data-render-timeout="45000"
>
...
</script>
```

Use a longer local timeout for a known complex diagram instead of increasing the limit for every source block.

Examples that may need more time include:

* large `tkz-tab` tables;
* complex `chemfig` structures;
* large `circuitikz` networks;
* extensive `pgf-spectra` data;
* diagrams using many external package files.

---

## Timeout is not a speed target

A timeout of `30000` does not mean that a normal diagram should take 30 seconds.

It is a safety limit.

Measure actual render timings separately.

Increasing the timeout does not make a diagram faster.

---

# Retries and worker restarts

## Retry configuration

```js
window.TikzJaxOptions = {
    maxRetries: 1,
    restartWorkerOnFail: true
};
```

With `maxRetries: 1`, TikZJax can perform:

```text
initial attempt
+ one retry
```

Retries are useful for transient worker or runtime problems.

They do not fix invalid TeX source.

---

## Local retry configuration

```html
<script
  type="text/tikz"
  data-render-timeout="45000"
  data-max-retries="1"
  data-restart-worker-on-fail="true"
>
...
</script>
```

These values apply only to the current diagram.

---

## Cost of restarting a worker

Restarting a worker improves failure isolation, but the replacement loses the failed worker's prepared state.

The replacement must initialize:

* its WebAssembly runtime;
* its core dump;
* its virtual filesystem;
* package files needed by later jobs.

Frequent worker restarts are therefore a sign that the underlying failure should be investigated.

---

# Measuring performance

## Measure cold and warm states separately

A useful performance test includes several states.

### Cold persistent cache

Clear IndexedDB:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

This measures fresh SVG compilation.

### Warm persistent cache

Reload the page without clearing IndexedDB.

This measures SVG reuse.

### Cold worker dependency state

Open the page in a new browser context or after a full runtime restart.

This measures first-use package preparation.

### Warm worker dependency state

Render several diagrams using the same package during one page session.

This measures worker-local dependency reuse.

---

## Timing output

Enable timing logs on one diagram:

```html
<script
  type="text/tikz"
  data-debug-timings="true"
  data-disable-cache="true"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

Timing output can include stages such as:

```text
TeX compilation
DVI conversion
total worker rendering time
```

`data-disable-cache="true"` is important when measuring compilation, because a persistent SVG cache hit bypasses the worker.

---

## Show TeX console output separately

Use:

```html
data-show-console="true"
```

when diagnosing TeX and file-loading behavior:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-debug-timings="true"
  data-show-console="true"
>
...
</script>
```

Console output can be extensive and should not remain enabled on every production diagram.

---

## Use representative diagrams

A simple circle is useful for measuring runtime overhead:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-debug-timings="true"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

It is not representative of package-heavy content.

Also test real examples from the site:

```text
tkz-tab
chemfig
circuitikz
yquant
tikz-feynhand
pgf-spectra
kinematikz
```

---

# Recommended configurations

## General documentation site

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

Load specialized dependencies locally.

---

## Memory-conscious site

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    workerPool: {
        enabled: true,
        maxWorkers: 2,
        reserveCpuCores: 1,
        useDeviceMemory: true,
        initializationRetries: 1
    }
};
```

---

## Debugging configuration

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

Then enable local diagnostics only on the diagram being tested:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-debug-timings="true"
  data-show-console="true"
>
...
</script>
```

---

# Performance recommendations

1. Keep the persistent SVG cache enabled in production.
2. Load specialized packages locally.
3. Load only the TikZ libraries that are needed.
4. Keep the global preamble small.
5. Use a modest worker limit.
6. Leave CPU capacity available for the browser.
7. Keep device-memory adaptation enabled.
8. Use finite render timeouts.
9. Use retries only for transient failures.
10. Avoid assuming document-order completion.
11. Keep repeated source and attributes identical when cache reuse matters.
12. Remove debugging attributes after testing.
13. Use versioned, cacheable runtime assets.
14. Test both desktop and mobile devices.
15. Measure cold and warm cache states independently.

---

# Common problems

## A diagram does not update

Temporarily disable the persistent cache:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
>
...
</script>
```

Or clear the complete IndexedDB database:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

Also verify that the browser is loading the expected JavaScript release.

---

## A repeated diagram is rendered more than once

Check whether the diagrams differ in:

* whitespace or comments;
* package declarations;
* TikZ libraries;
* custom preamble;
* local JSON configuration;
* loader attributes;
* cache-disabling attributes.

The exact source and effective dataset must match.

---

## The first specialized diagram is slow

The assigned worker may be downloading and preparing its package dependencies for the first time.

Later diagrams assigned to that worker can be faster.

This is expected.

---

## The same package is prepared by several workers

Worker TeX caches are isolated.

Each worker may need its own decompressed dependency files.

A lower worker count reduces duplicated worker state but may also reduce concurrency.

---

## Increasing `maxWorkers` made the page slower

The device may be limited by:

* CPU contention;
* memory pressure;
* simultaneous decompression;
* duplicated virtual filesystems;
* thermal throttling;
* browser scheduling.

Return to:

```js
workerPool: {
    maxWorkers: 3,
    reserveCpuCores: 1,
    useDeviceMemory: true
}
```

and compare again.

---

## A diagram times out only on its first render

The first attempt may include worker initialization and dependency preparation.

Use a suitable finite timeout and compare with a second uncached diagram using the same package.

Do not increase the global timeout unnecessarily when only one specialized diagram requires more time.

---

## Cached rendering is fast but fresh rendering fails

Clear IndexedDB or use:

```html
data-disable-cache="true"
```

A previously cached SVG can hide a current runtime or dependency problem.

Inspect the TeX console during a fresh render.

---

## Rendering is slow on every page

Check whether large optional packages are loaded globally.

Move them to local attributes:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
...
</script>
```

Also check:

* worker-pool size;
* repeated worker restarts;
* missing HTTP cache headers;
* runtime files served without compression;
* diagrams that always disable the SVG cache.

---

## Worker loading fails

Verify that these files come from the same TikZJax release:

```text
tikzjax.min.js
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
```

For same-origin direct workers, verify that the worker URL is served from the page's origin.

For CDN workers, verify the Blob-worker and connection rules in the site's Content Security Policy.

See [Troubleshooting](troubleshooting.md).

---

# Related documentation

* [Configuration](configuration.md)
* [Global and Local Configuration](configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](parallel-rendering.md)
* [Fallback and Error Images](fallback-error-images.md)
* [API Reference](api-reference.md)
* [Runtime Architecture](architecture.md)
* [Troubleshooting](troubleshooting.md)
* [Examples](examples/index.md)
