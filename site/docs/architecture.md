# Runtime Architecture

This page describes how TikZJax detects, schedules, compiles, caches, and inserts diagrams in the browser.

TikZJax runs TeX entirely on the client. It does not require a server-side LaTeX installation or a remote rendering service.

For user-facing worker-pool behavior, see [Parallel Rendering and the Worker Pool](parallel-rendering.md).

---

## Architecture overview

A diagram follows this general pipeline:

```text
TikZ source in the document
        |
        v
source discovery and normalization
        |
        v
global and local configuration merge
        |
        v
render identity generation
        |
        +-- persistent SVG cache hit
        |           |
        |           v
        |      insert cached SVG
        |
        +-- cache miss
                    |
                    v
           pending-job deduplication
                    |
                    v
             global render queue
                    |
                    v
        adaptive Web Worker pool
                    |
                    v
          TeX WebAssembly engine
                    |
                    v
               DVI output
                    |
                    v
          DVI-to-SVG conversion
                    |
                    v
             SVG insertion
                    |
                    v
        theme adaptation and event
```

The main browser thread coordinates discovery, caching, scheduling, DOM updates, and theme handling.

TeX compilation and DVI conversion run inside isolated Web Workers.

---

## Main runtime components

TikZJax is divided into two principal execution environments.

### Main browser thread

The main TikZJax bundle runs in the page and manages:

* source discovery;
* configuration;
* persistent SVG caching;
* render scheduling;
* worker-pool lifecycle;
* DOM observation;
* generated SVG insertion;
* theme adaptation;
* error fallbacks;
* completion events.

### Rendering workers

Each rendering worker manages:

* WebAssembly initialization;
* the TeX runtime;
* the virtual filesystem;
* runtime TeX dependencies;
* generated LaTeX documents;
* TeX compilation;
* DVI output;
* DVI-to-SVG conversion;
* worker-local dependency caching.

The two environments communicate through worker messages.

---

## Main runtime files

The distribution contains files such as:

```text
dist/tikzjax.js
dist/tikzjax.min.js
dist/run-tex.js
dist/run-tex.min.js
dist/fonts.css
dist/fonts.min.css
dist/tex.wasm.gz
dist/core.dump.gz
dist/tex_files/
dist/assets/broken-image.svg
```

### Main-thread bundle

Production:

```text
tikzjax.min.js
```

Debugging:

```text
tikzjax.js
```

### Worker script

The rendering worker is normally created from:

```text
run-tex.js
```

The minified worker file may also be distributed for deployment workflows.

### TeX runtime

```text
tex.wasm.gz
core.dump.gz
```

These files provide the WebAssembly TeX engine and its initial dumped state.

### Runtime TeX files

```text
tex_files/
```

This directory contains compressed TeX packages, TikZ libraries, font data, and other files loaded on demand.

### Styling and fallback assets

```text
fonts.min.css
assets/broken-image.svg
```

The stylesheet supports generated SVG text and fonts. The image is used when rendering cannot complete successfully.

All runtime files should come from the same TikZJax release.

---

## Main-thread architecture

### Source discovery

TikZJax recognizes two source families.

#### HTML blocks

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

#### Fenced-block output

TikZJax recognizes generated `<pre>` elements with classes such as:

```text
language-tikzjax
tikzjax
language-tikz
tikz
```

For example, MkDocs can transform:

````markdown
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

into a recognizable HTML source element.

When a nested `<code>` element exists, TikZJax extracts its text content as the TeX source.

---

### Initial page scan

After initialization, TikZJax scans the document for supported source blocks.

For each newly discovered source, it:

1. extracts the exact source text;
2. reads local `data-*` attributes;
3. builds the effective configuration;
4. creates or updates the loading wrapper;
5. generates the rendering identity;
6. checks the persistent cache;
7. joins an existing pending job or creates a new one.

Workers are initialized lazily only when uncached rendering work exists.

```text
page scan
    |
    +-- no diagrams
    |       |
    |       v
    |   no worker initialization
    |
    +-- only cached diagrams
    |       |
    |       v
    |   insert cached SVGs
    |
    +-- uncached diagrams
            |
            v
       initialize required workers
```

---

### Source normalization and processing state

TikZJax tracks discovered source elements so that the same element is not processed repeatedly.

This is important because the document may be rescanned after:

* DOM mutations;
* MkDocs navigation;
* content-tab activation;
* delayed component rendering;
* theme-related updates.

A source that has already been converted into a TikZJax wrapper is not treated as a new source merely because an ancestor changed.

---

## Configuration architecture

### Effective configuration

The configuration of one diagram is constructed from:

```text
TikZJax defaults
< initial global configuration
< later partial global configuration
< local diagram configuration
```

Plain objects are merged recursively.

Arrays are combined without duplicate entries.

Scalar values are replaced by later values.

Local configuration affects only the current diagram.

See [Global and Local Configuration](configuration-scopes.md).

---

### Configuration responsibilities

Some options control the complete runtime:

```text
assetBaseUrl
workerMode
workerUrl
workerPool
theme
```

Other values become part of an individual rendering job:

```text
texPackages
tikzLibraries
addToPreamble
tkzTab
renderTimeout
maxRetries
restartWorkerOnFail
showConsole
debugTimings
```

A diagram cannot create an independent local worker pool. Pool sizing and worker initialization are global runtime concerns.

---

### Local attribute processing

Local attributes are interpreted in a deterministic order:

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

Dedicated attributes therefore override equivalent values from a general local JSON object.

The resulting effective configuration is serialized into the dataset sent to the worker.

### `tkz-tab` preamble generation

The effective `tkzTab` object belongs to the configuration of an individual rendering job.

TikZJax generates a dedicated preamble fragment before the effective custom `tex.addToPreamble` string.

This generated fragment has two roles.

#### Public helper macros

The configured values remain available through public TeX macros such as:

```text
\tikzjaxTkzTabLineWidth
\tikzjaxTkzTabFont
\tikzjaxTkzTabLgt
\tikzjaxTkzTabFirstColumnWidth
\tikzjaxTkzTabEspcl
\tikzjaxTkzTabVariableRowHeight
\tikzjaxTkzTabSignRowHeight
\tikzjaxTkzTabVariationRowHeight
\tikzjaxTkzTabImageRowHeight
\tikzjaxTkzTabAntecedentRowHeight
```

The row-height values remain helper macros because the runtime cannot infer the semantic type of every required `label/height` row passed to `\tkzTabInit`.

#### Automatic native defaults

When `tkzTab.autoApply` is enabled, supported values are also converted into native `tkz-tab` defaults.

The generated preamble can:

* refresh the package default line width;
* preset native `\tkzTabInit` keys such as `lw`, `lgt`, and `espcl`;
* pass serialized scalar options to `\tkzTabSetup`;
* pass serialized scalar options to `\tkzTabColors`;
* append the configured font to TikZ nodes used by the table.

The native first-column width is resolved from:

```text
tkzTab.firstColumnWidth
?? tkzTab.lgt
```

Values in `tkzTab.init` override corresponding automatically derived `lw`, `lgt`, and `espcl` values.

Explicit options written directly in the TeX source remain the highest-priority values:

```latex
\tkzTabInit[
    lw=0.8pt,
    lgt=4
]
```

Setting `tkzTab.autoApply` to `false` disables the native-default commands but keeps the public helper macros.

The generated commands are guarded so that ordinary diagrams remain valid when the `tkz-tab` package is not loaded.

---

## Rendering identity and caching

### Rendering identity

The persistent rendering identity is based on:

```text
exact source
+
serialized effective worker dataset
```

It distinguishes diagrams that have the same TeX source but different dependencies or local settings.

For example:

```html
<script
  type="text/tikz"
  data-tikz-libraries="calc"
>
...
</script>
```

and:

```html
<script
  type="text/tikz"
  data-tikz-libraries="positioning"
>
...
</script>
```

produce different rendering identities.

---

### Scheduler-only values

A value used only for main-thread scheduling does not need to affect the compiled SVG.

For example:

```html
data-render-priority="-10"
```

is consumed by the scheduler and removed before the worker dataset is serialized.

Changing only the explicit queue priority therefore does not change the generated diagram or its persistent SVG identity.

---

### Persistent SVG cache

TikZJax stores generated SVG markup in IndexedDB.

```text
Database: TikzJax
Object store: svgImages
```

On a cache hit:

```text
source discovery
    |
    v
IndexedDB lookup
    |
    v
cached SVG insertion
```

No worker compilation is required.

On a cache miss, the diagram continues to pending-job grouping and scheduling.

See [Cache and Performance](cache-performance.md).

---

### Cache bypass

A diagram with:

```html
data-disable-cache="true"
```

bypasses persistent SVG reuse and is sent through the rendering path again.

This does not disable:

* worker-local TeX dependency caching;
* WebAssembly runtime reuse;
* the browser HTTP cache.

---

## Pending-job architecture

### Pending-job deduplication

Several identical sources may be discovered before their first rendering has completed.

TikZJax groups matching targets around one pending job:

```text
target A ─┐
target B ─┼──> one pending render
target C ─┘
```

After the worker returns one SVG result, TikZJax applies it to every target in the group.

This prevents several workers from compiling the same rendering input simultaneously.

---

### Pending-job identity

Two targets can share one pending job only when they have the same:

* exact source;
* worker dataset;
* cache behavior;
* effective rendering configuration.

A different package list, preamble, library list, or relevant local option creates another job.

---

### Completed cache versus pending group

These mechanisms operate at different stages:

```text
persistent cache:
reuse an already completed SVG

pending-job deduplication:
share one render currently in progress
```

A successful pending job can subsequently populate the persistent cache.

---

## Render queue architecture

### Central queue

All uncached, non-duplicated jobs enter one global queue.

```text
source A ─┐
source B ─┼──> central queue ──> worker pool
source C ─┤
source D ─┘
```

The queue coordinates:

* priority;
* worker availability;
* dependency affinity;
* retries;
* timeouts;
* worker restarts;
* grouped targets.

There is no separate independent queue for each source block.

---

### Viewport priority

The scheduler calculates a priority from the source element's relationship with the current viewport.

Typical classes are:

| Priority | Source state              |
| -------: | ------------------------- |
|      `0` | Intersects the viewport   |
|      `1` | Near the viewport         |
|      `2` | Farther from the viewport |
|      `3` | Hidden or disconnected    |

Lower values are selected first.

An explicit `data-render-priority` value can override the automatic priority.

---

### Reprioritization

The queue can be reprioritized as:

* the user scrolls;
* a hidden tab becomes visible;
* dynamic content is inserted;
* an element moves into or away from the viewport.

Jobs that have already started are not normally interrupted solely because another source receives a better priority.

---

### Completion order

Parallel jobs can complete in any order.

```text
document order:
A, B, C

completion order:
B, C, A
```

Each SVG is still inserted into its correct target wrapper.

Application code must not assume source-order completion.

---

## Adaptive worker-pool architecture

### Pool purpose

A Web Worker can execute only one TeX compilation at a time.

TikZJax therefore uses several isolated workers to compile independent diagrams concurrently.

```text
global queue
    |
    +-- worker 1 --> diagram A
    +-- worker 2 --> diagram B
    +-- worker 3 --> diagram C
```

One diagram is never divided between workers.

---

### Pool configuration

The main pool settings are:

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: true,
        maxWorkers: 3,
        reserveCpuCores: 1,
        useDeviceMemory: true,
        initializationRetries: 1
    }
};
```

The nested alias is:

```js
window.TikzJaxOptions = {
    worker: {
        pool: {
            enabled: true,
            maxWorkers: 3
        }
    }
};
```

The root `workerPool` value takes precedence.

---

### Effective pool size

The effective number of workers is bounded by:

* pending and active workload;
* `maxWorkers`;
* available logical processor information;
* `reserveCpuCores`;
* optional device-memory limits.

Conceptually:

```text
effective worker count =
max(
    1,
    min(
        active workload,
        configured maximum,
        CPU-based limit,
        memory-based limit
    )
)
```

When no uncached work exists, the runtime does not need to initialize rendering workers.

---

### Lazy initialization

Worker initialization is deferred until the queue contains work.

The pool can grow as required, up to its calculated limit.

```text
one pending job
    |
    v
one worker required
```

```text
many pending jobs
    |
    v
pool grows toward effective limit
```

TikZJax does not need to create every possible worker in advance.

---

### Worker states

A worker can conceptually be in one of these states:

```text
initializing
idle
busy
failed
restarting
terminated
```

#### Initializing

The worker script, WebAssembly module, core dump, and TeX environment are being prepared.

#### Idle

The worker is ready to receive a job.

#### Busy

The worker is processing one diagram.

#### Failed

The worker encountered an initialization, runtime, communication, or timeout failure.

#### Restarting

The failed worker is being replaced.

#### Terminated

The worker is no longer part of the active runtime.

---

### One active job per worker

A worker does not process two TeX compilations concurrently.

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

Concurrency exists between workers.

---

### Dependency affinity

When several workers are suitable for a job, the scheduler can prefer a worker that already has useful dependencies cached.

Example:

```text
job requires:
chemfig

worker 1:
idle
chemfig prepared

worker 2:
idle
chemfig not prepared
```

Worker 1 is the preferred candidate.

Dependency affinity is only a tie-breaker after scheduling priority and worker availability.

TikZJax does not intentionally leave useful capacity idle for a long period merely to wait for a better cache match.

---

## Worker initialization

### Worker startup mode

Workers can be created in one of three modes.

| Mode     | Behavior                                                |
| -------- | ------------------------------------------------------- |
| `auto`   | Direct for same-origin URLs, Blob for cross-origin URLs |
| `direct` | Use `new Worker(workerUrl)`                             |
| `blob`   | Fetch worker source and create a Blob URL               |

The configured worker mode applies to every member of the pool.

---

### Initialization message

After a worker is created, the main thread supplies initialization information such as:

* asset base URL;
* WebAssembly file location;
* core dump location;
* TeX file root;
* runtime behavior options.

The worker must report successful initialization before it becomes idle and eligible for jobs.

---

### Initialization retries

Worker startup failures are governed by:

```js
workerPool: {
    initializationRetries: 1
}
```

These retries are separate from `maxRetries`, which applies to diagram rendering.

If initialization cannot succeed after the allowed attempts, that worker cannot join the active pool.

---

## Worker runtime architecture

### WebAssembly TeX engine

Each worker initializes a TeX engine from:

```text
tex.wasm.gz
```

The worker also loads:

```text
core.dump.gz
```

The dump provides the base TeX state used by TikZJax.

The WebAssembly instance and TeX engine remain associated with that worker for subsequent jobs.

---

### Virtual filesystem

Each worker owns an isolated virtual filesystem.

It contains:

* base runtime files;
* files restored from the core dump;
* dynamically downloaded package files;
* generated `input.tex`;
* generated intermediate files;
* the output DVI file.

Another worker cannot directly access this filesystem.

---

### Worker-local TeX file cache

Optional packages and TikZ libraries are stored as compressed runtime files under:

```text
tex_files/
```

When TeX requests a missing file, the worker can:

1. resolve its runtime URL;
2. fetch the compressed file;
3. decompress it;
4. insert it into the virtual filesystem;
5. remember the prepared file for later jobs.

The in-memory prepared-file cache belongs to that worker.

```text
worker 1:
- physics.sty
- amsmath.sty

worker 2:
- chemfig.sty
- simplekv.sty
```

---

### Isolation between workers

Workers do not directly share:

* TeX virtual filesystems;
* decompressed package files;
* initialized TeX state;
* job-specific macros;
* generated files.

The browser may reuse compressed HTTP responses, but each worker maintains its own prepared runtime state.

---

### Runtime reuse

An initialized worker can process multiple diagrams:

```text
initialize worker
    |
    v
render diagram A
    |
    v
clean job files
    |
    v
render diagram D
```

Reusable runtime files remain available, while job-specific files are cleaned between compilations.

---

## Generated LaTeX document

### Document construction

For every job, the worker builds a complete LaTeX document.

Conceptually:

```latex
\documentclass{article}

% Required base packages
\usepackage{tikz}

% Effective TeX packages
\usepackage{amsfonts}
\usepackage{physics}
\usepackage[options]{another-package}

% Effective TikZ libraries
\usetikzlibrary{
    arrows.meta,
    positioning
}

% TikZJax-generated tkz-tab preamble
% - public helper macros
% - native defaults when autoApply is enabled

% Effective custom preamble
\newcommand{\R}{\mathbb{R}}

\begin{document}

% Exact user source

\end{document}
```

The exact order and support code are generated by the worker implementation.

---

### Package generation

The effective package object:

```js
{
    amsfonts: "",
    xcolor: "dvipsnames"
}
```

conceptually becomes:

```latex
\usepackage{amsfonts}
\usepackage[dvipsnames]{xcolor}
```

Packages loaded locally are merged with globally configured packages for the current job.

---

### TikZ-library generation

The effective library list:

```js
[
    "arrows.meta",
    "calc",
    "positioning"
]
```

conceptually becomes:

```latex
\usetikzlibrary{
    arrows.meta,
    calc,
    positioning
}
```

Duplicate names are removed during configuration merging.

---

### Custom preamble

The effective `tex.addToPreamble` string is inserted before `\begin{document}`.

A local `data-add-to-preamble` value is a scalar override of the global custom preamble for that diagram.

The complete TikZJax-generated `tkz-tab` preamble is inserted separately before the effective custom preamble. It contains the public helper macros and, when `tkzTab.autoApply` is enabled, the guarded native-default commands.

---

### User source

The exact extracted source is inserted into the document body.

TikZJax does not require the source to contain a `tikzpicture` environment in every case.

For example, some packages provide their own top-level commands:

```latex
\chemfig{H_3C-CH_2-OH}
```

or:

```latex
\pgfspectra[element=H]
```

---

## TeX execution

### Compilation

The worker writes the generated document to:

```text
input.tex
```

It then invokes the WebAssembly TeX engine.

The engine can request runtime files while compiling.

Successful compilation produces:

```text
input.dvi
```

Compilation failures can include:

* undefined commands;
* missing packages;
* missing TikZ libraries;
* malformed TeX;
* unavailable runtime files;
* resource exhaustion;
* timeout.

---

### Console forwarding

A diagram with:

```html
data-show-console="true"
```

can request forwarding of TeX console output to the browser console.

This is useful for identifying:

* missing files;
* package errors;
* undefined control sequences;
* TeX warnings;
* compilation stages.

---

### Timing collection

With timing diagnostics enabled, the worker can report stages such as:

```text
TeX compilation
DVI conversion
total worker processing
```

Timing information is sent back with or alongside the result and logged by the runtime.

---

## DVI conversion

### DVI output

The TeX engine produces a DVI document rather than directly generating browser SVG.

The worker reads the DVI bytes and passes them to the DVI conversion layer.

---

### `dvi2html`

TikZJax uses `@rod2ik/dvi2html` to convert the DVI output into HTML and SVG markup suitable for insertion into the page.

Conceptually:

```text
input.dvi
    |
    v
DVI parser and converter
    |
    v
SVG/HTML string
```

The result is sent from the worker to the main thread.

---

## Result handling

### Successful result

The worker response contains the generated markup and associated job information.

The main thread:

1. validates the response;
2. resolves the pending job;
3. stores the result in IndexedDB when caching is enabled;
4. inserts the SVG into every grouped target;
5. applies wrapper and helper classes;
6. applies the active theme;
7. dispatches the completion event;
8. marks the worker idle;
9. schedules the next queued job.

---

### Generated wrapper

Output is placed inside a wrapper similar to:

```html
<span class="tikzjax-wrapper mathjax_ignore">
    <svg>...</svg>
</span>
```

While rendering, the wrapper also carries a loading state such as:

```text
tikzjax-loading
```

The `mathjax_ignore` class helps prevent later MathJax rescans from reprocessing generated TikZJax output.

---

### Helper containers

If a source is inside:

```html
<div class="tikzjax-container">
```

TikZJax applies visible overflow behavior to the generated SVG.

Inside:

```html
<div class="tikzjax-scaled-container">
```

the SVG also receives full-width and full-height behavior.

---

## Theme architecture

### Theme detection

After SVG insertion, TikZJax determines the applicable theme.

Theme detection can use:

* a configured selector;
* a configured attribute;
* configured dark and light classes;
* nearby theme attributes;
* MkDocs Material's color-scheme attribute;
* fallback settings;
* system theme preference when enabled.

See [Themes](themes.md).

---

### SVG adaptation

TikZJax can adapt common generated colors for dark and light backgrounds.

Typical adaptations include:

* default black text;
* black strokes;
* black fills;
* selected white backgrounds.

Explicitly chosen TikZ colors are generally preserved.

Theme adaptation happens after SVG generation and can be reapplied when the site's theme changes.

---

### Theme observation

TikZJax observes relevant theme changes and schedules updates to already rendered SVG elements.

Theme updates do not require recompiling the TeX source.

```text
theme attribute changes
    |
    v
detect new theme
    |
    v
adapt existing SVG
```

---

## Dynamic-content architecture

### Central MutationObserver

TikZJax uses a central DOM observer rather than creating one observer per diagram.

The observer detects added nodes that may contain:

```text
script[type="text/tikz"]
pre.language-tikzjax
pre.tikzjax
pre.language-tikz
pre.tikz
```

Detected candidates are added to a central processing queue.

---

### Mutation batching

DOM mutations may arrive in bursts.

TikZJax batches or schedules processing so that many related changes do not immediately trigger redundant full scans.

```text
mutation A ─┐
mutation B ─┼──> central mutation queue --> scheduled scan
mutation C ─┘
```

This is useful for frontend frameworks and documentation themes that insert several nodes at once.

---

### MkDocs content tabs

TikZJax listens for interactions commonly associated with MkDocs Material content tabs.

When hidden tab content becomes visible, TikZJax schedules a rescan and reprioritizes newly visible diagrams.

Those diagrams join the same global render queue and worker pool as the rest of the page.

---

### Client-side navigation

On sites using client-side page replacement, newly inserted page content is detected through the same DOM-observation system.

Previously processed elements are not rendered again unless they are replaced with new source elements.

---

## Error architecture

### Failure categories

A render can fail during:

* worker creation;
* worker initialization;
* asset loading;
* package loading;
* TeX compilation;
* DVI generation;
* DVI conversion;
* worker communication;
* timeout;
* result insertion.

The main thread associates failures with the relevant job and worker.

---

### Timeouts

Each rendering attempt has a finite timeout.

```text
job starts
    |
    v
timeout timer starts
    |
    +-- result arrives --> clear timer
    |
    +-- timer expires --> fail attempt
```

A timed-out worker is not considered safe for immediate reuse and is replaced before processing later work.

---

### Render retries

`maxRetries` controls retries after the initial attempt.

```text
initial attempt
    |
    +-- success
    |
    +-- failure
            |
            v
         retry 1
```

A retried job can be assigned after worker recovery or replacement.

Retries do not correct invalid TeX source.

---

### Worker restart

When restart behavior is enabled, a failed worker is terminated and replaced.

```text
worker failure
    |
    v
remove worker from active pool
    |
    v
terminate failed runtime
    |
    v
initialize replacement
    |
    v
continue queue
```

Other workers can continue their current jobs.

---

### Fallback image

After all permitted attempts fail, the target is replaced with the configured fallback image.

Priority:

```text
bundled fallback
< global brokenImageSrc
< later global update
< local data-broken-image-src
```

Grouped targets can each receive their appropriate fallback handling.

See [Fallback and Error Images](fallback-error-images.md).

---

## Completion event

After successful SVG insertion, TikZJax dispatches:

```text
tikzjax-load-finished
```

The event:

* originates from the generated SVG;
* bubbles through the document;
* is emitted for cached and freshly rendered SVGs;
* is emitted once for each target;
* does not guarantee document-order delivery.

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

---

## Cleanup and lifecycle

### Per-job cleanup

After compilation, a worker removes or resets job-specific files such as:

```text
input.tex
input.dvi
temporary TeX outputs
```

Reusable runtime files remain available in the worker cache.

---

### Worker restart cleanup

Terminating a worker discards:

* its WebAssembly runtime;
* its virtual filesystem;
* decompressed TeX files;
* job state;
* message handlers associated with that worker.

---

### Page cleanup

When the page unloads or TikZJax is torn down, the runtime can:

* disconnect DOM observers;
* disconnect theme observers;
* cancel scheduled scans;
* reject or clear pending jobs;
* clear timeout handles;
* revoke Blob worker URLs;
* terminate active workers.

This prevents page-level runtime state from surviving after the document is no longer active.

---

## End-to-end sequence

The following sequence summarizes a fresh uncached render:

```text
1. Main thread discovers source
2. Main thread extracts source and local attributes
3. Main thread merges global and local configuration
4. Main thread builds render identity
5. Main thread checks IndexedDB
6. Main thread checks matching pending jobs
7. Main thread creates a new queued job
8. Scheduler calculates viewport priority
9. Pool initializes or selects a worker
10. Main thread sends source and dataset
11. Worker builds input.tex
12. Worker resolves TeX dependencies
13. Worker runs WebAssembly TeX
14. Worker reads input.dvi
15. Worker converts DVI to SVG/HTML
16. Worker sends the result to the main thread
17. Main thread stores the SVG in IndexedDB
18. Main thread inserts the SVG into grouped targets
19. Main thread applies theme handling
20. Main thread dispatches tikzjax-load-finished
21. Worker returns to the idle pool
```

A cached render skips steps 6 through 16.

A target joining an existing pending job skips the creation of a duplicate queue entry.

---

## Design goals

The architecture is designed to provide:

* browser responsiveness;
* client-side rendering;
* bounded parallelism;
* predictable resource use;
* failure isolation;
* persistent SVG reuse;
* dynamic-content support;
* local dependency isolation;
* compatibility with documentation frameworks;
* progressive rendering of long pages.

The worker pool improves throughput, while viewport priority improves perceived performance.

Persistent SVG caching avoids compilation entirely when a matching result already exists.

Local package declarations reduce unnecessary TeX preamble work across the pool.

---

## Related documentation

* [Configuration](configuration.md)
* [Global and Local Configuration](configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](parallel-rendering.md)
* [Cache and Performance](cache-performance.md)
* [Themes](themes.md)
* [Fallback and Error Images](fallback-error-images.md)
* [API Reference](api-reference.md)
* [Troubleshooting](troubleshooting.md)
* [Examples](examples/index.md)
