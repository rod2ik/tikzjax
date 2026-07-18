# Fallback and Error Images

TikZJax displays a fallback image when it detects a diagram but cannot produce a valid SVG after the configured rendering attempts.

Possible causes include:

* invalid TikZ or LaTeX source;
* an undefined command;
* a missing TeX package;
* a missing TikZ library;
* an unavailable runtime dependency;
* a render timeout;
* a worker failure;
* a WebAssembly failure;
* a DVI conversion error;
* runtime assets blocked by CORS or Content Security Policy.

The fallback image is controlled by:

```js
brokenImageSrc
```

It can be configured:

* globally for the complete page;
* through a later partial global update;
* locally for one diagram.

---

## Failure lifecycle

A fallback image is not necessarily displayed after the first worker error.

The rendering lifecycle can include retries and worker replacement:

```text
render attempt
    |
    +-- success
    |      |
    |      v
    |   insert SVG
    |
    +-- failure
           |
           +-- retry available
           |      |
           |      v
           |   restart worker when required
           |      |
           |      v
           |   retry render
           |
           +-- no attempt remaining
                  |
                  v
             display fallback image
```

The fallback is displayed only after TikZJax determines that the diagram cannot be rendered successfully under the configured retry policy.

---

## Recommended safety configuration

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg",

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

* limits each rendering attempt to 30 seconds;
* permits one retry after the initial failure;
* replaces a failed worker when appropriate;
* displays the selected fallback after all attempts fail.

---

## Default fallback image

TikZJax includes a default fallback image:

```text
dist/assets/broken-image.svg
```

No configuration is required to use it:

```js
window.TikzJaxOptions = {};
```

The default image is resolved relative to the TikZJax runtime asset directory.

When the JavaScript bundle is loaded from:

```text
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js
```

the default image is resolved from:

```text
https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg
```

---

### Explicit jsDelivr URL

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

---

### Explicit unpkg URL

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

An explicit URL is useful when the error image is intentionally hosted separately from the other runtime assets.

---

## Included fallback images

The package includes several fallback designs.

| Name       | Runtime path                               |
| ---------- | ------------------------------------------ |
| Default    | `dist/assets/broken-image.svg`             |
| Gradient   | `dist/assets/broken-image-degrade.svg`     |
| Emoji      | `dist/assets/broken-image-emoji.svg`       |
| Clean      | `dist/assets/broken-image-epuree.svg`      |
| Sketch     | `dist/assets/broken-image-esquisse.svg`    |
| Material   | `dist/assets/broken-image-materielle.svg`  |
| Minimalist | `dist/assets/broken-image-minimaliste.svg` |
| Modern     | `dist/assets/broken-image-moderne.svg`     |

When this documentation site contains local preview copies under `img/`, they can be displayed as:

| Name       | Preview                                                          |
| ---------- | ---------------------------------------------------------------- |
| Default    | ![Default TikZJax fallback](img/broken-image.svg)                |
| Gradient   | ![Gradient TikZJax fallback](img/broken-image-degrade.svg)       |
| Emoji      | ![Emoji TikZJax fallback](img/broken-image-emoji.svg)            |
| Clean      | ![Clean TikZJax fallback](img/broken-image-epuree.svg)           |
| Sketch     | ![Sketch TikZJax fallback](img/broken-image-esquisse.svg)        |
| Material   | ![Material TikZJax fallback](img/broken-image-materielle.svg)    |
| Minimalist | ![Minimalist TikZJax fallback](img/broken-image-minimaliste.svg) |
| Modern     | ![Modern TikZJax fallback](img/broken-image-moderne.svg)         |

The preview paths are documentation assets. The runtime images remain under the package's `dist/assets/` directory.

---

## Global configuration

Set one fallback for every diagram in `tikzjax.config.js`:

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-moderne.svg"
};
```

Load the configuration before TikZJax:

```html
<script src="/assets/javascripts/tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

---

### Global examples

#### Default

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

#### Gradient

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-degrade.svg"
};
```

#### Emoji

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-emoji.svg"
};
```

#### Clean

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-epuree.svg"
};
```

#### Sketch

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-esquisse.svg"
};
```

#### Material

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-materielle.svg"
};
```

#### Minimalist

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-minimaliste.svg"
};
```

#### Modern

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-moderne.svg"
};
```

---

## Custom fallback image

`brokenImageSrc` can reference:

* an absolute HTTPS URL;
* a root-relative path;
* a page-relative path;
* a `data:` URL.

### Root-relative path

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "/assets/images/tikz-error.svg"
};
```

### Relative path

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "./images/tikz-error.svg"
};
```

A relative path is interpreted by the browser relative to the current page URL.

It is not automatically resolved relative to `tikzjax.config.js`.

### Absolute URL

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "https://example.com/assets/tikz-error.svg"
};
```

---

### Choosing an image format

SVG is generally recommended because it:

* remains sharp at different display sizes;
* is usually small;
* works well with documentation layouts;
* can contain accessible text or symbols;
* can be designed for both light and dark backgrounds.

PNG, WebP, and other browser-supported image formats can also be used.

The image URL must be permitted by the site's Content Security Policy.

---

## Fallback priority

TikZJax resolves the fallback source in this order:

```text
bundled default image
< initial global brokenImageSrc
< later global brokenImageSrc update
< local data-broken-image-src
```

The last defined applicable value wins.

A local fallback:

* affects only the current diagram;
* does not mutate `window.TikzJaxOptions`;
* does not change other pending or future diagrams.

---

## Local fallback image

Set a fallback for one diagram with:

```html
<script
  type="text/tikz"
  data-broken-image-src="/assets/images/local-tikz-error.svg"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

Other diagrams continue to use the global fallback.

The attribute must be placed directly on the TikZJax source element.

Incorrect:

```html
<div data-broken-image-src="/assets/images/local-error.svg">
    <script type="text/tikz">
    ...
    </script>
</div>
```

Correct:

```html
<script
  type="text/tikz"
  data-broken-image-src="/assets/images/local-error.svg"
>
...
</script>
```

---

### Local data URL

A compact inline SVG can be provided as a `data:` URL:

```html
<script
  type="text/tikz"
  data-broken-image-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='110' viewBox='0 0 220 110'%3E%3Crect width='220' height='110' rx='12' fill='%23fff7ed' stroke='%23ea580c' stroke-width='5'/%3E%3Ctext x='110' y='48' text-anchor='middle' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='%23c2410c'%3ERENDER ERROR%3C/text%3E%3Ctext x='110' y='74' text-anchor='middle' font-family='Arial,sans-serif' font-size='13' fill='%239a3412'%3ETikZJax%3C/text%3E%3C/svg%3E"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

The site's CSP must permit `data:` images:

```http
img-src 'self' data:;
```

Long data URLs can make Markdown and HTML difficult to maintain. A regular SVG file is usually preferable.

---

## Runtime global updates

After TikZJax has loaded, update the global fallback with:

```js
window.TikzJaxConfigure({
    brokenImageSrc:
        "/assets/images/new-tikz-error.svg"
});
```

This does not erase unrelated options.

The equivalent later assignment is:

```js
window.TikzJaxOptions = {
    brokenImageSrc:
        "/assets/images/new-tikz-error.svg"
};
```

`window.TikzJaxConfigure()` is recommended because it makes the partial-update intent explicit.

!!! warning

    Before TikZJax installs its configuration API, normal JavaScript assignment rules apply.

    Use one complete initial `window.TikzJaxOptions` object before loading the bundle.

---

### Effect of a runtime update

A runtime update affects diagrams whose effective configuration is built after the update.

It does not retroactively replace a fallback image that has already been inserted into the document.

To replace an existing error image, update the DOM directly or trigger a fresh render of the source.

---

## Fenced blocks

Fenced `tikzjax` blocks cannot carry local HTML attributes.

This block uses the global fallback:

````markdown
```tikzjax
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
```
````

To use `data-broken-image-src`, use an HTML source block instead:

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

---

## Fallbacks and parallel rendering

Each queued diagram has its own effective configuration.

When several diagrams render in parallel:

```text
worker 1 --> diagram A --> success
worker 2 --> diagram B --> failure
worker 3 --> diagram C --> success
```

Only diagram B displays its fallback.

A failure in one worker does not require successful diagrams from other workers to be replaced.

When worker restart is enabled, TikZJax can replace the affected worker while the rest of the pool continues processing.

See [Parallel Rendering and the Worker Pool](parallel-rendering.md).

---

### Grouped identical diagrams

Identical diagrams discovered while one matching render is pending may share a single compilation job.

```text
target A ─┐
target B ─┼──> one pending rendering job
target C ─┘
```

If the shared job succeeds, its SVG is inserted into every target.

If the job fails after all permitted attempts, each associated target enters the corresponding failure-display path.

Diagrams with different effective fallback configuration do not necessarily have the same rendering identity and should not be assumed to share one job.

---

## Fallbacks and caching

A previously cached successful SVG can be inserted without executing TeX again.

This can hide a current failure while testing a changed runtime or missing dependency.

Force a fresh rendering attempt with:

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

Or clear IndexedDB:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

When testing fallback behavior, always bypass or clear an existing successful SVG cache entry.

See [Cache and Performance](cache-performance.md).

---

## Testing the global fallback

Use a structurally complete document containing an invalid command:

=== "Rendering"

    <script
      type="text/tikz"
      data-disable-cache="true"
      data-show-console="true"
    >
    \begin{tikzpicture}
        \ThisCommandDoesNotExist
    \end{tikzpicture}
    </script>

=== ":fa-markdown: Markdown"

    ````markdown
    ```tikzjax
    \begin{tikzpicture}
        \ThisCommandDoesNotExist
    \end{tikzpicture}
    ```
    ````

The invalid command should produce a deterministic TeX error.

The diagram should display the configured global fallback after all attempts fail.

!!! warning "Avoid incomplete test documents"

    Do not test fallback behavior by removing:

    ```latex
    \end{tikzpicture}
    ```

    An incomplete document can cause TeX to wait for more input until the timeout expires instead of producing an immediate error.

---

## Testing a local fallback

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-broken-image-src="/assets/images/local-tikz-error.svg"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

Only this source uses:

```text
/assets/images/local-tikz-error.svg
```

---

## Testing retries and fallback timing

Use:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-render-timeout="15000"
  data-max-retries="1"
  data-restart-worker-on-fail="true"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

With `data-max-retries="1"`, TikZJax can perform:

```text
initial attempt
+ one retry
```

The fallback appears only after the retry also fails.

For a deterministic syntax error, the retry is expected to fail in the same way.

---

## Custom fallback design

A useful fallback image should:

* clearly indicate that rendering failed;
* remain legible in light and dark themes;
* avoid excessive dimensions;
* use a stable aspect ratio;
* avoid misleading the reader into thinking it is the intended diagram;
* provide enough contrast;
* avoid relying on external fonts;
* use an accessible textual label when appropriate.

The fallback should not expose sensitive TeX source or internal error details.

Detailed diagnostics belong in the browser Console, not inside the public error image.

---

## Accessibility

Consider using an SVG that contains visible text such as:

```text
Diagram unavailable
```

Keep the wording concise.

Do not encode the complete TeX error message inside the image because:

* it may be too long;
* it may expose implementation details;
* it may not be accessible to assistive technology;
* it can make the page difficult to scan.

Provide surrounding explanatory text when the diagram is essential to understanding the page.

---

## Content Security Policy

### CDN fallback images

For jsDelivr or unpkg:

```http
img-src 'self' https://cdn.jsdelivr.net https://unpkg.com data: blob:;
```

### Same-origin fallback images

```http
img-src 'self' data: blob:;
```

Remove `data:` or `blob:` when they are not used and a stricter policy is desired.

The fallback image host must be explicitly permitted.

---

## MkDocs paths

In MkDocs, a relative URL is resolved from the generated page URL.

Suppose a page is generated at:

```text
/guide/installation/
```

Then:

```js
brokenImageSrc:
    "./images/tikz-error.svg"
```

is resolved relative to that page location.

For a site-wide global fallback, prefer:

* a root-relative path when the site is hosted at the origin root;
* a URL generated by an MkDocs template;
* a CDN URL.

---

### MkDocs site under a subpath

A root-relative URL such as:

```text
/assets/images/tikz-error.svg
```

does not include a deployment prefix such as:

```text
/project-name/
```

For a site deployed under a subpath, define the URL in the template:

```html
<script>
window.TikzJaxOptions = {
    brokenImageSrc:
        "{{ 'assets/images/tikz-error.svg' | url }}"
};
</script>
```

This allows MkDocs to generate the correct path for the deployment.

---

## Complete configuration example

```js
window.TikzJaxOptions = {
    renderTimeout: 30000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    brokenImageSrc:
        "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-moderne.svg",

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

Specialized packages should normally remain local to the diagrams that require them.

---

## Troubleshooting

### The fallback image is not displayed

First verify that the diagram actually reaches the failure path.

Use:

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

Then inspect the Console for the TeX or worker error.

---

### A missing-image icon appears

The render failed, but the fallback image URL also failed.

Open the Network panel and inspect the image request.

Check:

* HTTP status;
* final URL after redirects;
* response content type;
* CSP `img-src`;
* filename case;
* deployment prefix;
* static-site rewrite rules.

---

### The bundled default image is used

Inspect the active global value:

```js
window.TikzJaxOptions?.brokenImageSrc
```

Verify that:

* the configuration file loads before TikZJax;
* the property is spelled `brokenImageSrc`;
* no later global update replaces it;
* the source does not define another local fallback.

---

### A local fallback is ignored

Verify that:

* `data-broken-image-src` is directly on the source element;
* the diagram really fails;
* a previous successful SVG is not being restored from cache;
* the local URL loads successfully;
* the attribute value is not empty.

Force a fresh render with:

```html
data-disable-cache="true"
```

---

### The fallback appears only after a long delay

Possible causes include:

* a high render timeout;
* one or more retries;
* dependency requests waiting for network timeout;
* an incomplete TeX document;
* worker initialization retries.

Inspect:

```js
window.TikzJaxOptions?.renderTimeout
window.TikzJaxOptions?.maxRetries
window.TikzJaxOptions?.workerPool
```

Use a complete invalid command when testing.

---

### The fallback appears immediately

Possible causes include:

* invalid source;
* missing required package;
* missing TikZ library;
* worker initialization failure;
* an immediately rejected runtime request;
* invalid local JSON.

Enable:

```html
data-show-console="true"
```

and inspect the Network panel.

---

### The image works locally but not after deployment

Check:

* the final generated URL;
* case-sensitive filenames;
* site subpaths;
* CDN or proxy rewrites;
* CSP rules;
* whether the image was copied into the generated site;
* whether the deployment excludes SVG assets.

Use the browser's failed request URL as the source of truth.

---

### A cached diagram prevents the fallback test

Use:

```html
data-disable-cache="true"
```

or clear the TikZJax database:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

---

### Only one diagram displays a fallback

This is normally expected.

Each diagram has its own source, dependencies, timeout, retries, and local fallback configuration.

A failure in one worker does not imply that all diagrams should fail.

---

## Related documentation

* [Configuration](configuration.md)
* [Global and Local Configuration](configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](parallel-rendering.md)
* [Cache and Performance](cache-performance.md)
* [Runtime Architecture](architecture.md)
* [Themes](themes.md)
* [API Reference](api-reference.md)
* [Troubleshooting](troubleshooting.md)
* [Examples](examples/index.md)
