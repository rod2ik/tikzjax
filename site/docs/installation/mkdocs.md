# Installation on an MkDocs Site

This page explains how to install **TikZJax** on an MkDocs site, especially with Material for MkDocs.

The installation is still a CDN installation, as with a standalone HTML page, but the CDN files should be loaded from your MkDocs template so that the loading order is controlled.

!!! success "Installation summary"

    **Required:** add the TikZJax stylesheet and script to your `overrides/main.html`.

    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
    ```

    **Recommended:** add a global configuration file before loading TikZJax.

    ```html
    <script src="{{ 'assets/javascripts/tikzjax.config.js' | url }}"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
    ```

    **Optional:** add a Superfences configuration in `mkdocs.yml` if you want to use fenced `tikzjax` code blocks.

    ````yaml
    markdown_extensions:
      - pymdownx.superfences:
          custom_fences:
            - name: tikzjax
              class: language-tikzjax
              format: !!python/name:pymdownx.superfences.fence_code_format
    ````

## 1. Recommended loading order

The recommended loading order is:

1. optional `tikzjax.config.js`;
2. `fonts.min.css`;
3. `tikzjax.min.js`;
4. page content containing TikZ blocks.

In practice, TikZJax also observes the DOM. If TikZ blocks are added after the initial page load, they are automatically detected and rendered.

!!! warning

    The configuration file must be loaded before `tikzjax.min.js`.

    Avoid putting the main TikZJax script directly in `extra_javascript` unless you have verified the final loading order.

## 2. Configure CDN files in `overrides/main.html`

TikZJax CDN references should be loaded from your MkDocs template, usually:

```text
overrides/main.html
```

### 2.1 Recommended setup with a global config file

This is the recommended setup for real documentation sites.

```html
{% extends "base.html" %}

{% block htmltitle %}
{{ super() }}
<title>{{ base_url }}</title>
{% endblock %}

{% block content %}
    {{ super() }}
{% endblock %}

{% block libs %}
    {{ super() }}

    <script src="{{ 'assets/javascripts/tikzjax.config.js' | url }}"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
{% endblock %}

{% block footer scoped %}
{% include "partials/footer.html" with context %}
{% endblock %}
```

The path:

```text
assets/javascripts/tikzjax.config.js
```

is relative to your MkDocs `docs_dir`.

For example:

| File location | Template path |
| --- | --- |
| `docs/assets/javascripts/tikzjax.config.js` | `assets/javascripts/tikzjax.config.js` |
| `site/assets/javascripts/tikzjax.config.js` when `docs_dir` is `site` or `.` | `assets/javascripts/tikzjax.config.js` |

### 2.2 Minimal setup without a global config file

Use this only if you do not need global packages, TikZ libraries, fallback images, or custom runtime options.

```html
{% extends "base.html" %}

{% block htmltitle %}
{{ super() }}
<title>{{ base_url }}</title>
{% endblock %}

{% block content %}
    {{ super() }}
{% endblock %}

{% block libs %}
    {{ super() }}

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
{% endblock %}

{% block footer scoped %}
{% include "partials/footer.html" with context %}
{% endblock %}
```

## 3. jsDelivr and unpkg

Recommended jsDelivr loading:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Equivalent unpkg loading:

```html
<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

For debugging only, you may use the non-minified files:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.js"></script>
```

For production documentation, prefer:

```text
fonts.min.css
tikzjax.min.js
```

## 4. `mkdocs.yml` and Superfences

TikZJax works immediately with the HTML syntax:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) -- (2,1);
\end{tikzpicture}
</script>
```

If you also want to use fenced Markdown code blocks such as:

````latex
```tikzjax
\begin{tikzpicture}
    \draw (0,0) -- (2,1);
\end{tikzpicture}
```
````

then add `pymdownx.superfences` to `mkdocs.yml`:

```yaml
markdown_extensions:
  - pymdownx.superfences:
      custom_fences:
        - name: tikzjax
          class: language-tikzjax
          format: !!python/name:pymdownx.superfences.fence_code_format
```

This Superfences configuration is only required for the fenced `tikzjax` Markdown syntax. It is not required for `<script type="text/tikz">` blocks.

## 5. Minimal MkDocs setup

### 5.1 `overrides/main.html`

```html
{% extends "base.html" %}

{% block htmltitle %}
{{ super() }}
<title>{{ base_url }}</title>
{% endblock %}

{% block content %}
    {{ super() }}
{% endblock %}

{% block libs %}
    {{ super() }}

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
{% endblock %}

{% block footer scoped %}
{% include "partials/footer.html" with context %}
{% endblock %}
```

### 5.2 Minimal `mkdocs.yml`

```yaml
site_name: Your Site Name
site_url: https://example.com/

theme:
  name: material
  custom_dir: overrides

nav:
  - Home: index.md

markdown_extensions:
  - pymdownx.superfences:
      custom_fences:
        - name: tikzjax
          class: language-tikzjax
          format: !!python/name:pymdownx.superfences.fence_code_format
```

## 6. Recommended MkDocs setup with config file

### 6.1 `overrides/main.html`

```html
{% extends "base.html" %}

{% block htmltitle %}
{{ super() }}
<title>{{ base_url }}</title>
{% endblock %}

{% block content %}
    {{ super() }}
{% endblock %}

{% block libs %}
    {{ super() }}

    <script src="{{ 'assets/javascripts/tikzjax.config.js' | url }}"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
{% endblock %}

{% block footer scoped %}
{% include "partials/footer.html" with context %}
{% endblock %}
```

### 6.2 `assets/javascripts/tikzjax.config.js`

```js
window.TikzJaxOptions = {
    renderTimeout: 10000,
    maxRetries: 0,
    restartWorkerOnFail: true,

    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg",

    tex: {
        texPackages: {
            amsmath: "",
            amsfonts: "",
            amssymb: "",
            "tkz-tab": ""
        },
        tikzLibraries: [
            "arrows.meta",
            "calc",
            "positioning"
        ]
    },

    tkzTab: {
        lineWidth: "1.2pt",
        font: "\\Large",

        lgt: 10,
        espcl: 3.2,

        variableRowHeight: 1.2,
        signRowHeight: 2.2,
        variationRowHeight: 2.2,

        imageRowHeight: 2.2,
        antecedentRowHeight: 2.2
    }
};
```

This global configuration is used as the default for every TikZJax diagram on the site.

### 6.3 Recommended `mkdocs.yml`

```yaml
site_name: Your Site Name
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

## 7. Configuration merge rules

TikZJax merges configuration in this order:

```text
default TikZJax options
< global configuration
< later partial global configuration
< local diagram configuration
```

This means that a later partial configuration can change one option without erasing the previous global configuration.

Example:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: [
            "arrows.meta"
        ]
    }
};

window.TikzJaxOptions = {
    brokenImageSrc: "/images/custom-tikz-error.svg"
};
```

The second assignment changes only `brokenImageSrc`.

It does not erase `tex.tikzLibraries`.

!!! warning

    A complete global configuration should be loaded before `tikzjax.min.js`.

    Later partial assignments are intended for code that runs after TikZJax has loaded.

## 8. Local options on one diagram

A single diagram can add or override options locally with `data-*` attributes.

Local options affect only the current diagram.

They do not mutate `window.TikzJaxOptions`.

### 8.1 Local TikZ libraries

```html
<script
    type="text/tikz"
    data-tikz-libraries="decorations.pathreplacing"
>
\begin{tikzpicture}
    \draw[decorate, decoration={brace, amplitude=6pt}] (0,0) -- (4,0);
\end{tikzpicture}
</script>
```

The local TikZ library is added to the global libraries.

It does not erase them.

### 8.2 Local TeX packages

```html
<script
    type="text/tikz"
    data-tex-packages='{"xcolor": ""}'
>
\begin{tikzpicture}
    \node at (0,0) {\textcolor{blue}{$\mathbb{R}$}};
\end{tikzpicture}
</script>
```

The local package is added to the global TeX packages.

It does not erase them.

### 8.3 Local fallback image

```html
<script
    type="text/tikz"
    data-broken-image-src="/images/local-tikz-error.svg"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

The local fallback image is used only for this diagram.

Other diagrams still use the global fallback image.

### 8.4 Local timeout and cache options

```html
<script
    type="text/tikz"
    data-render-timeout="30000"
    data-disable-cache="true"
>
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

This is useful while debugging a specific diagram.

## 9. MathJax is optional

MathJax is not required by TikZJax.

TikZJax renders TikZ and `tkz-tab` diagrams. MathJax renders regular mathematical expressions outside TikZJax diagrams. They are independent.

If your site also uses MathJax, you can configure it separately:

```yaml
markdown_extensions:
  - pymdownx.arithmatex:
      generic: true
      smart_dollar: false

extra_javascript:
  - javascripts/mathjax.js
  - https://cdn.jsdelivr.net/npm/mathjax@4.1.0/tex-mml-chtml.js
```

TikZJax configuration uses:

```js
window.TikzJaxOptions = {};
```

MathJax configuration uses:

```js
window.MathJax = {};
```

These are separate global objects and do not conflict.

## 10. Minimal Markdown `tikzjax` code block example

````latex
```tikzjax
\begin{tikzpicture}
  \draw[->] (0,0) -- (3,0) node[right] {$x$};
  \draw[->] (0,0) -- (0,2) node[above] {$y$};
  \draw[thick] (0,0) -- (2.5,1.5);
\end{tikzpicture}
```
````

renders as:

```tikzjax
\begin{tikzpicture}
  \draw[->] (0,0) -- (3,0) node[right] {$x$};
  \draw[->] (0,0) -- (0,2) node[above] {$y$};
  \draw[thick] (0,0) -- (2.5,1.5);
\end{tikzpicture}
```

## 11. `tkz-tab` Markdown example

If your global configuration includes `tkz-tab`, you can render variation tables.

````latex
```tikzjax
\begin{tikzpicture}
  \tkzTabInit{$x$/1, $f(x)$/2}{$-\infty$, $0$, $+\infty$}
  \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-\infty$}
\end{tikzpicture}
```
````

renders as:

```tikzjax
\begin{tikzpicture}
  \tkzTabInit{$x$/1, $f(x)$/2}{$-\infty$, $0$, $+\infty$}
  \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-\infty$}
\end{tikzpicture}
```

## 12. `assetBaseUrl` in MkDocs

For normal jsDelivr or unpkg usage, you usually do not need `assetBaseUrl`.

TikZJax automatically loads runtime files from the same `dist/` directory as `tikzjax.min.js`.

However, if you serve the main script from one place and runtime assets from another place, define `assetBaseUrl` before loading TikZJax.

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist"
};
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Runtime files include:

```text
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

## 13. Same-origin MkDocs installation

For strict deployments, you can serve all TikZJax files from your own MkDocs site.

Example:

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
</script>

<link rel="stylesheet" href="/vendor/tikzjax/fonts.min.css">
<script src="/vendor/tikzjax/tikzjax.min.js"></script>
```

Your site should expose:

```text
/vendor/tikzjax/tikzjax.min.js
/vendor/tikzjax/run-tex.js
/vendor/tikzjax/fonts.min.css
/vendor/tikzjax/tex.wasm.gz
/vendor/tikzjax/core.dump.gz
/vendor/tikzjax/tex_files/
/vendor/tikzjax/assets/broken-image.svg
```

Use `workerMode: "direct"` when `run-tex.js` is served from the same origin as the page.

## 14. Worker modes in MkDocs

TikZJax supports three worker modes.

| Mode | Description |
| --- | --- |
| `"auto"` | Default mode. Uses a direct Worker for same-origin files and a Blob Worker for cross-origin files. |
| `"blob"` | Always creates a Blob Worker. Useful for CDN-hosted worker scripts. |
| `"direct"` | Always creates a direct Worker. Best for same-origin installations. |

Recommended choices:

| Situation | Recommended mode |
| --- | --- |
| MkDocs site using jsDelivr or unpkg | `"auto"` |
| MkDocs site with CSP allowing `blob:` workers | `"auto"` or `"blob"` |
| MkDocs site serving TikZJax locally from the same origin | `"direct"` |
| Strict CSP without `blob:` workers | `"direct"` with same-origin files |

Example:

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

Nested form:

```js
window.TikzJaxOptions = {
    worker: {
        mode: "auto",
        url: "run-tex.js"
    }
};
```

Root-level `workerMode` and `workerUrl` take precedence over nested `worker.mode` and `worker.url`.

## 15. CSP notes

If your MkDocs site has a Content Security Policy, make sure it allows TikZJax to load and run its runtime files.

For jsDelivr or unpkg with Blob Worker support:

```http
script-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'wasm-unsafe-eval';
style-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'unsafe-inline';
worker-src 'self' blob:;
connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
img-src 'self' https://cdn.jsdelivr.net https://unpkg.com data: blob:;
font-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
```

For local same-origin files with direct Worker mode:

```http
script-src 'self' 'wasm-unsafe-eval';
style-src 'self' 'unsafe-inline';
worker-src 'self';
connect-src 'self';
img-src 'self' data:;
font-src 'self';
```

Notes:

- `worker-src blob:` is required for Blob Worker mode.
- `'wasm-unsafe-eval'` is usually required because TikZJax uses WebAssembly.
- `style-src 'unsafe-inline'` may be required because bundled CSS is injected by the JavaScript bundle.

## 16. Interactions with MathJax and MkDocs extensions

MathJax, Arithmatex, admonitions, details, and tabs are not required by TikZJax. They are common MkDocs extensions, so TikZJax tries to remain compatible with them.

### 16.1 MathJax

MathJax and TikZJax use different configuration objects:

```js
window.MathJax = {};
window.TikzJaxOptions = {};
```

At runtime, MathJax normally ignores these HTML tags by default:

```text
script, noscript, style, textarea, pre, code, math, select, option, mjx-container
```

This helps avoid conflicts:

- `<script type="text/tikz">...</script>` is inside a `script` tag.
- fenced `tikzjax` blocks are converted to `pre` / `code` blocks before TikZJax processes them.

After rendering, TikZJax wraps generated SVGs in a `mathjax_ignore` container to reduce the risk of MathJax processing them again during later rescans.

### 16.2 Arithmatex

Some MkDocs/Material setups wrap math expressions in Arithmatex markup.

TikZJax includes cleanup logic for script-based TikZ sources. It removes some Arithmatex wrappers, converts `\(...\)` back into `$...$`, converts `\[...\]` back into `$$...$$`, and decodes HTML entities before sending the source to TeX.

### 16.3 Admonitions

Admonitions are containers around content. TikZJax scans nested DOM content, so TikZ blocks inside admonitions are detected.

### 16.4 Collapsible admonitions with `pymdownx.details`

TikZJax uses a `MutationObserver` to watch for added content. It detects:

```text
script[type="text/tikz"]
pre.language-tikzjax
pre.tikzjax
pre.language-tikz
pre.tikz
```

It also performs a delayed rescan after the initial load to catch content inserted or revealed by MkDocs/Material.

### 16.5 Content tabs with `pymdownx.tabbed`

Material content tabs can insert, move, or reveal content after the first page scan.

TikZJax listens to tab interactions and schedules a rescan when tabbed content changes. This helps render TikZ blocks inside tabs without requiring a manual render call.

If your theme or MkDocs setup blocks scripts, also check your CSP policy and the `workerMode` / `assetBaseUrl` options.