# Parallel Rendering and the Worker Pool

TikZJax renders diagrams in Web Workers so that TeX compilation does not block the browser's main user-interface thread.

When a page contains several diagrams, TikZJax can distribute them across an adaptive pool of workers:

```text
global render queue
    |
    +-- worker 1 --> diagram A
    +-- worker 2 --> diagram B
    +-- worker 3 --> diagram C
```

This allows independent diagrams to compile concurrently while the page remains responsive.

A single diagram is always compiled by one worker. TikZJax does not split one TeX document across several workers.

For the complete option reference, see the [API Reference](api-reference.md).

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

This configuration:

* enables parallel rendering;
* allows at most three workers;
* attempts to leave one logical CPU core available for the browser and other work;
* uses device-memory information when the browser exposes it;
* retries a failed worker initialization once;
* allows one render retry after a job failure;
* restarts a failed worker when appropriate.

The effective number of workers may be lower than `maxWorkers`.

---

## Rendering lifecycle

The main rendering lifecycle is:

```text
page scan
    |
    v
diagram discovery
    |
    +-- cached diagram --------> insert cached SVG
    |
    +-- uncached diagram ------> add job to render queue
                                      |
                                      v
                               select free worker
                                      |
                                      v
                                compile diagram
                                      |
                         +------------+------------+
                         |                         |
                      success                    failure
                         |                         |
                    insert SVG          timeout/retry/restart
```

The important steps are:

1. TikZJax scans the document for diagrams.
2. It computes the rendering identity of each diagram.
3. Cached SVG output is reused immediately when available.
4. Uncached diagrams are added to the global render queue.
5. Free workers receive jobs from that queue.
6. Each completed SVG is inserted into its original document position.
7. Failed jobs follow the configured timeout and retry policy.

---

## Lazy worker initialization

TikZJax does not immediately create every possible worker when its JavaScript bundle loads.

Workers are initialized after TikZJax has scanned the page and determined that rendering work exists.

```text
page without TikZJax diagrams
    |
    v
no rendering workers required
```

```text
page with TikZJax diagrams
    |
    v
create the workers required for pending work
```

This avoids paying the cost of worker and TeX-engine initialization on pages that contain no diagrams.

The effective pool may also remain smaller when the page contains fewer pending diagrams than the maximum configured worker count.

!!! note

```
A worker is a relatively expensive resource.

It contains a TeX runtime, a WebAssembly module, a virtual filesystem, and worker-local dependency caches.

A larger pool is not automatically faster on every device.
```

---

## Adaptive pool sizing

The pool is bounded by:

```js
workerPool.maxWorkers
```

but TikZJax also considers runtime information supplied by the browser.

Relevant settings include:

```js
workerPool: {
    maxWorkers: 3,
    reserveCpuCores: 1,
    useDeviceMemory: true
}
```

### `maxWorkers`

`maxWorkers` is the hard upper limit requested by the application:

```js
workerPool: {
    maxWorkers: 3
}
```

TikZJax will not intentionally create more rendering workers than this limit.

### `reserveCpuCores`

When processor information is available, TikZJax can leave some logical cores unused by the rendering pool:

```js
workerPool: {
    reserveCpuCores: 1
}
```

The goal is to avoid assigning every reported logical core to TeX compilation.

This leaves capacity for:

* browser layout and painting;
* JavaScript running on the main thread;
* user interaction;
* other browser tabs;
* operating-system tasks.

### `useDeviceMemory`

When enabled, TikZJax can use the browser's device-memory hint to avoid creating an unnecessarily large pool on a memory-constrained device:

```js
workerPool: {
    useDeviceMemory: true
}
```

Each worker has its own TeX runtime and caches, so memory consumption grows with the number of workers.

!!! note

```
Browser hardware information is advisory.

Some browsers do not expose `deviceMemory`, and values such as `hardwareConcurrency` may be rounded or limited for privacy and implementation reasons.

`maxWorkers` remains the explicit upper bound.
```

---

## The global render queue

All uncached diagrams are coordinated through one central queue.

```text
diagram A ─┐
diagram B ─┼──> global queue ──> available workers
diagram C ─┤
diagram D ─┘
```

Each worker processes one job at a time.

When a worker finishes, fails, or is restarted, the scheduler can assign another pending job.

The queue avoids creating a separate worker for every diagram.

A page containing fifty diagrams may still use only three workers:

```text
50 diagrams
    |
    v
3 workers
    |
    +-- worker 1: A, D, G, ...
    +-- worker 2: B, E, H, ...
    +-- worker 3: C, F, I, ...
```

This bounds CPU and memory usage while retaining concurrency.

---

## One job per worker

A worker never compiles two diagrams simultaneously.

```text
worker 1:
    diagram A
        |
        v
    diagram D
        |
        v
    diagram G
```

Parallelism occurs between workers, not within one worker.

With three available workers, up to three uncached diagrams can be actively compiled at the same time.

A fourth diagram waits in the queue until a worker becomes available.

---

## Viewport-based priority

TikZJax gives higher priority to diagrams that are visible or close to the current browser viewport.

A simplified pending queue might look like:

```text
1. visible diagram
2. diagram immediately below the viewport
3. diagram slightly above the viewport
4. diagram near the bottom of the page
```

This improves perceived performance because users see the diagrams they are currently reading before distant content.

!!! note

```
Priority affects pending jobs.

A diagram that is already compiling is not normally interrupted merely because another diagram enters the viewport.
```

The queue can be reprioritized as the user scrolls and as new diagrams are discovered.

---

## Completion order

Parallel rendering does not guarantee that diagrams finish in document order.

Suppose the page contains:

```text
diagram A: complex package and many paths
diagram B: simple circle
diagram C: medium-sized graph
```

With several workers, the visible result may appear in this order:

```text
B finishes first
C finishes second
A finishes last
```

Each SVG is still inserted into the correct original position in the document.

Only the completion time differs.

!!! important

```
Do not write application logic that assumes the first diagram in the HTML will be the first diagram to finish.
```

Use the `tikzjax-load-finished` event when code must react to an individual completed diagram.

---

## Render-completion event

TikZJax dispatches a `tikzjax-load-finished` event from each completed SVG:

```js
document.addEventListener(
    "tikzjax-load-finished",
    function (event) {
        const svg = event.target;

        console.log(
            "TikZJax diagram finished:",
            svg
        );
    }
);
```

This event is useful for:

* post-processing generated SVG elements;
* attaching interactions;
* recording application-specific metrics;
* integrating TikZJax with another frontend component;
* detecting when one particular diagram becomes available.

Because diagrams finish independently, the event may be dispatched in a different order from the HTML source order.

---

## Pending-job deduplication

When several identical diagrams are discovered while the same render is still pending, TikZJax can group them into one compilation job.

```text
diagram A ─┐
diagram A ─┼──> one pending compilation --> reuse SVG result
diagram A ─┘
```

This prevents multiple workers from compiling the same source and configuration unnecessarily.

After the job completes, the resulting SVG can be used for every matching target.

The diagrams must have the same rendering identity, including the exact source and relevant local dataset.

Differences such as these produce distinct jobs:

```html
data-tex-packages
data-tikz-libraries
data-add-to-preamble
data-render-timeout
data-tkzjax-options
data-tkz-tab
```

Even visually similar diagrams may therefore be compiled independently when their source or configuration differs.

---

## Persistent SVG cache

Before adding a job to the worker queue, TikZJax checks its persistent SVG cache.

```text
diagram discovered
    |
    +-- cache hit  --> reuse SVG without TeX compilation
    |
    +-- cache miss --> enqueue worker job
```

A cache hit does not require a rendering worker.

The persistent cache key includes the exact diagram source and its relevant dataset, so a changed source or changed configuration produces a different cache entry.

Use:

```html
data-disable-cache="true"
```

to bypass the persistent SVG cache for one diagram:

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

See [Cache and Performance](cache-performance.md) for complete cache behavior.

---

## Worker-local dependency caches

Each worker maintains its own in-memory cache of downloaded and decompressed TeX files.

For example:

```text
worker 1 cache:
- physics.sty
- amsmath.sty
- tikzlibrarypositioning.code.tex

worker 2 cache:
- chemfig.sty
- simplekv.sty
- tikzlibrarycalc.code.tex
```

A later job assigned to the same worker may reuse those files without downloading and decompressing them again.

This can make subsequent diagrams faster.

### Worker caches are isolated

Workers do not directly share their in-memory TeX file caches.

If two workers independently need `chemfig`, each worker may have to prepare its own local copy:

```text
worker 1 --> download/decompress chemfig dependencies
worker 2 --> download/decompress chemfig dependencies
```

The browser's HTTP cache may still avoid a full network transfer, but each worker maintains its own decompressed runtime state.

---

## Compiled WebAssembly state

Each initialized worker can retain its compiled WebAssembly module and TeX-engine runtime for later jobs.

This avoids recreating the complete runtime for every diagram.

```text
worker initialization
    |
    +-- compile or receive WASM module
    +-- initialize TeX runtime
    +-- prepare virtual filesystem
    |
    v
render several jobs sequentially
```

Restarting a worker discards its worker-local runtime state and caches.

The replacement worker must initialize a fresh runtime.

---

## Dependency affinity

When selecting a worker, TikZJax may consider whether a worker already has dependencies useful for the next job.

For example:

```text
pending job requires chemfig

worker 1:
- idle
- chemfig already prepared

worker 2:
- idle
- no chemfig files prepared
```

Worker 1 may be the more efficient choice.

However, dependency affinity is a secondary scheduling consideration.

The primary goal remains to keep useful workers busy and avoid unnecessary queue delays.

```text
primary criterion:
- available work capacity

secondary criterion:
- useful cached dependencies
```

TikZJax should not leave an available worker idle for a long time merely to wait for another worker with a better dependency cache.

---

## Why the first specialized diagram can be slower

The first diagram using a package such as `chemfig`, `circuitikz`, or `pgf-spectra` may require the assigned worker to:

1. request the package file;
2. request additional dependencies;
3. decompress the files;
4. add them to the worker's virtual filesystem;
5. process the larger TeX preamble;
6. compile the diagram.

A later diagram using the same package on that worker can reuse part of this preparation.

```text
first chemfig job on worker 1:
download + decompress + compile

later chemfig job on worker 1:
reuse prepared files + compile
```

Another worker may still need its own first-time preparation.

---

## Dynamic diagrams

TikZJax uses a central DOM observation queue to discover diagrams added after the initial page scan.

Examples include diagrams inserted by:

* client-side navigation;
* dynamically loaded content;
* MkDocs Material components;
* JavaScript applications;
* content tabs;
* collapsible interface elements.

A simplified lifecycle is:

```text
DOM mutation
    |
    v
central observer
    |
    v
new diagram discovery
    |
    +-- ignore already processed target
    |
    +-- cache lookup
    |
    +-- add new job to central queue
```

Centralized observation avoids creating a separate observer for every diagram.

It also helps prevent the same element from being enqueued repeatedly.

---

## MkDocs Material tabs and dynamic content

A diagram inside a hidden content tab may not be visible during the initial page view.

TikZJax can rescan or reprioritize it when the tab becomes active.

```markdown
=== "Question"

    Some text.

=== "Solution"

    <script type="text/tikz">
    ...
    </script>
```

When the solution becomes visible, its diagram joins the same global queue used by the rest of the page.

It does not create a separate worker pool.

---

## Timeouts

Each rendering job is bounded by:

```js
renderTimeout
```

Recommended configuration:

```js
window.TikzJaxOptions = {
    renderTimeout: 30000
};
```

The value is expressed in milliseconds.

A single complex diagram can override it:

```html
<script
  type="text/tikz"
  data-render-timeout="45000"
>
...
</script>
```

A timeout protects the queue from a job that:

* enters a problematic TeX state;
* waits for a missing or stalled dependency;
* requires unexpectedly long processing;
* encounters a runtime problem.

Without a timeout, one worker could remain occupied indefinitely.

---

## Retries

The global retry policy is controlled with:

```js
maxRetries
```

Example:

```js
window.TikzJaxOptions = {
    maxRetries: 1
};
```

With `maxRetries: 1`, TikZJax may attempt the job once more after the initial failure.

Conceptually:

```text
initial attempt
    |
    +-- success --> finish
    |
    +-- failure --> retry 1
                       |
                       +-- success --> finish
                       |
                       +-- failure --> show fallback
```

A retry does not correct invalid TeX source.

It is intended for transient worker, initialization, or runtime failures.

---

## Worker restart after failure

Use:

```js
restartWorkerOnFail
```

to allow TikZJax to replace a worker whose runtime may no longer be trustworthy:

```js
window.TikzJaxOptions = {
    restartWorkerOnFail: true
};
```

A restart discards:

* the failed worker instance;
* its TeX-engine state;
* its worker-local decompressed-file cache;
* its virtual filesystem;
* other worker-local runtime state.

A new worker is then initialized and can receive pending or retried jobs.

!!! note

```
Restarting one worker does not require restarting the entire pool.

Other healthy workers can continue rendering their current jobs.
```

---

## Worker initialization retries

Worker startup failures are separate from diagram-render failures.

Configure worker initialization retries with:

```js
workerPool: {
    initializationRetries: 1
}
```

This setting applies when TikZJax cannot successfully initialize a worker runtime.

Examples of initialization problems may include:

* failure to load the worker script;
* failure to load or initialize WebAssembly;
* invalid runtime paths;
* missing core files;
* transient resource-loading errors.

After the initialization retry limit is exhausted, the worker cannot join the active pool.

---

## Failure isolation

One purpose of the worker pool is to isolate failures.

Suppose worker 2 encounters a fatal problem:

```text
worker 1 --> continues diagram A
worker 2 --> fails during diagram B
worker 3 --> continues diagram C
```

With worker restart enabled:

```text
worker 2 fails
    |
    v
terminate worker 2
    |
    v
initialize replacement worker
    |
    v
retry diagram B or continue queue
```

The other workers do not need to discard their state.

This limits the effect of one failed compilation.

---

## Broken-image fallback

When a diagram cannot be rendered after the configured attempts, TikZJax displays the configured error fallback.

Global example:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/assets/images/tikz-error.svg"
};
```

Local override:

```html
<script
  type="text/tikz"
  data-broken-image-src="/assets/images/local-error.svg"
>
...
</script>
```

See [Fallback and Error Images](fallback-error-images.md).

---

## Disabling the worker pool

Parallel rendering can be disabled globally:

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: false
    }
};
```

When the pool is disabled, diagrams are not distributed across several concurrent rendering workers.

This can be useful for:

* diagnosing concurrency-related behavior;
* comparing sequential and parallel performance;
* reducing memory use in a constrained environment;
* applications that intentionally require serialized compilation.

For most documentation sites, keeping the pool enabled is recommended.

---

## Limiting the pool to one worker

Another useful diagnostic configuration is:

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

This preserves the worker-pool scheduling path while allowing only one active rendering worker.

It can help distinguish:

* a general rendering problem;
* a package problem;
* a problem that appears only with several workers;
* a completion-order assumption in application code.

---

## Choosing `maxWorkers`

A good starting point for a documentation site is:

```js
workerPool: {
    maxWorkers: 3,
    reserveCpuCores: 1,
    useDeviceMemory: true
}
```

### Too few workers

With only one worker:

```text
diagram A --> diagram B --> diagram C --> diagram D
```

Complex pages may take longer to become fully rendered.

### Too many workers

A very large pool can increase:

* memory consumption;
* simultaneous WebAssembly runtime use;
* dependency decompression;
* CPU contention;
* main-thread competition;
* duplicated worker-local dependency state.

For example, this is rarely a good default:

```js
workerPool: {
    maxWorkers: 16
}
```

even when the browser reports many logical cores.

### Recommended approach

Use a modest hard limit and let runtime constraints reduce the effective count:

```js
workerPool: {
    maxWorkers: 3,
    reserveCpuCores: 1,
    useDeviceMemory: true
}
```

Increase the limit only after measuring a representative page on desktop and mobile devices.

---

## Example configurations

### General documentation site

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

### Memory-conscious configuration

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: true,
        maxWorkers: 2,
        reserveCpuCores: 1,
        useDeviceMemory: true
    }
};
```

### Sequential debugging

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

### Pool disabled

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: false
    }
};
```

---

## Local options and the worker pool

Package and library declarations belong to the diagram job:

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="arrows.meta,positioning"
>
...
</script>
```

When the scheduler assigns this diagram to a worker, the job includes its effective configuration.

Local configuration remains fully compatible with parallel rendering.

```text
diagram A:
- physics
- arrows.meta

diagram B:
- chemfig

diagram C:
- yquant
- positioning
```

The diagrams can be sent to different workers without changing the global configuration.

See [Global and Local Configuration](configuration-scopes.md).

---

## Global dependencies and every worker

A globally configured package applies to every diagram:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            chemfig: ""
        }
    }
};
```

Every worker processing any diagram must therefore support that global preamble.

Even a simple circle receives the package:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

Loading specialized packages locally reduces unnecessary work across the worker pool.

---

## What workers share

Workers can benefit indirectly from browser-level resources, but their TeX runtimes remain isolated.

| Resource                               | Shared?                           |
| -------------------------------------- | --------------------------------- |
| Global render queue                    | Coordinated centrally             |
| Persistent SVG cache                   | Available before worker rendering |
| Pending-job deduplication              | Coordinated centrally             |
| Browser HTTP cache                     | Managed by the browser            |
| Compiled worker runtime state          | Worker-local                      |
| Decompressed TeX file cache            | Worker-local                      |
| Worker virtual filesystem              | Worker-local                      |
| TeX macros defined during a job        | Job-local                         |
| Diagram source and local configuration | Passed with the job               |

Do not assume that a package prepared by one worker is immediately available in another worker's memory.

---

## What parallel rendering does not do

Parallel rendering does not:

* split one diagram across several workers;
* guarantee document-order completion;
* share TeX macro state between diagrams;
* share a worker's virtual filesystem with other workers;
* make invalid TeX source valid;
* eliminate package initialization costs;
* guarantee that more workers will always be faster;
* bypass the persistent SVG cache;
* remove the need for render timeouts.

Each diagram remains an independent TeX compilation.

---

## Measuring performance

A diagram can enable timing output locally:

```html
<script
  type="text/tikz"
  data-debug-timings="true"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

Depending on the configured logging mode, TikZJax can report stages such as:

```text
TeX compilation
DVI to HTML
total rendering time
```

Use timing output together with representative pages.

A page containing twenty simple diagrams behaves differently from a page containing:

* `chemfig` structures;
* `circuitikz` networks;
* `pgf-spectra` data;
* large `tkz-tab` tables;
* complex Feynman diagrams.

See [Cache and Performance](cache-performance.md).

---

## Debugging parallel rendering

### Start with one worker

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: true,
        maxWorkers: 1
    }
};
```

If the problem remains, it is probably not caused by concurrency.

### Disable the SVG cache

```html
data-disable-cache="true"
```

This forces the diagram to enter the render path again.

### Enable TeX console output

```html
data-show-console="true"
```

This helps identify missing files and TeX errors.

### Increase the timeout temporarily

```html
data-render-timeout="45000"
```

A larger timeout is useful for distinguishing a slow first render from a permanent failure.

### Inspect the worker configuration

```js
window.TikzJaxOptions?.workerPool
```

### Verify runtime files

Worker initialization and diagram rendering can fail when the JavaScript bundle, worker script, WebAssembly file, core dump, and `tex_files` directory do not come from the same release.

---

## Common problems

### Diagrams appear in a different order

Their positions are unchanged, but parallel jobs can finish in a different order.

This is expected.

React to individual SVG completion with:

```js
document.addEventListener(
    "tikzjax-load-finished",
    function (event) {
        console.log(event.target);
    }
);
```

---

### The first diagrams are slower

Workers must initialize their runtime and prepare their first dependencies.

Later diagrams may reuse worker-local state.

The persistent SVG cache can also make subsequent page visits much faster.

---

### One package is downloaded by several workers

Worker dependency caches are isolated.

Several workers may independently need to prepare the same package.

The browser HTTP cache can reduce network transfer, but decompressed TeX state remains worker-local.

---

### Increasing `maxWorkers` made rendering slower

The device may be limited by:

* memory;
* CPU contention;
* package decompression;
* duplicated runtime state;
* browser scheduling;
* thermal throttling.

Return to a modest value such as:

```js
maxWorkers: 3
```

and measure again.

---

### One diagram blocks a worker

Use a finite:

```js
renderTimeout
```

and enable:

```js
restartWorkerOnFail: true
```

A timed-out job can then release the failed worker path instead of occupying it indefinitely.

---

### Every worker fails during initialization

Check:

* the worker-script URL;
* WebAssembly runtime files;
* the core dump;
* Content Security Policy rules;
* cross-origin headers;
* deployment paths;
* version consistency between runtime files.

See [Troubleshooting](troubleshooting.md).

---

### A failed worker keeps losing its cache

A restarted worker is a new runtime.

Its previous decompressed dependency cache and virtual filesystem no longer exist.

This is expected failure isolation.

---

### A dynamic diagram is not rendered

Check that:

* the inserted element uses `type="text/tikz"`;
* it is added to the active document;
* its source is not empty;
* no frontend component removes it immediately;
* the browser console contains no observer or rendering error.

Dynamic diagrams use the same central queue and worker pool as initial diagrams.

---

### A diagram never enters the queue because it is cached

Use:

```html
data-disable-cache="true"
```

while testing queue or worker behavior.

A persistent SVG cache hit intentionally bypasses TeX compilation.

---

## Recommended practices

1. Keep `maxWorkers` modest.
2. Leave at least one logical core available when possible.
3. Keep `useDeviceMemory` enabled.
4. Use finite render timeouts.
5. Restart failed workers.
6. Load specialized packages locally.
7. Avoid assuming completion order.
8. Use the persistent SVG cache in production.
9. Use one worker when debugging concurrency.
10. Measure representative desktop and mobile pages before increasing the pool size.

---

## Related documentation

* [Global and Local Configuration](configuration-scopes.md)
* [Configuration](configuration.md)
* [Cache and Performance](cache-performance.md)
* [Runtime Architecture](architecture.md)
* [Fallback and Error Images](fallback-error-images.md)
* [API Reference](api-reference.md)
* [Troubleshooting](troubleshooting.md)
* [Examples](examples/index.md)
