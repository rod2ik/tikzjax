# Installation on an MkDocs Site

This page explains how to install **TikZJax** on an MkDocs site, especially with Material for MkDocs.

The installation is still a CDN installation, as with a standalone HTML page, but the CDN files should be loaded from your MkDocs template so that the loading order is controlled.

!!! success "Installation summary"
    **Required:** add the TikZJax stylesheet and script to your `overrides/main.html`.

    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
    ```

    **Optional but recommended:** add a global configuration file before loading TikZJax.

    ```html
    <script src="{{ 'local/path/to/your/tikzjax.config.js' | url }}"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
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

## 1. Configure CDN files in `overrides/main.html`

!!! warning
    TikZJax CDN references should be loaded from your MkDocs template, usually `overrides/main.html`.

    Avoid putting the main TikZJax script directly in `extra_javascript` unless you have verified the final loading order. The configuration file must be defined before `tikzjax.min.js`.

### 1.1 Without a global config file

Create or edit:

```text
overrides/main.html
```

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

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
{% endblock %}

{% block footer scoped %}
{% include "partials/footer.html" with context %}
{% endblock %}
```

### 1.2 With a global config file

This is the recommended setup for real documentation sites.

The configuration file must be loaded before `tikzjax.min.js`.

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

    <script src="{{ 'local/path/to/your/tikzjax.config.js' | url }}"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
{% endblock %}

{% block footer scoped %}
{% include "partials/footer.html" with context %}
{% endblock %}
```

The path:

```text
local/path/to/your/tikzjax.config.js
```

is relative to your MkDocs `docs_dir`.

For example, if your file is:

```text
docs/javascripts/tikzjax.config.js
```

then use:

```html
<script src="{{ 'javascripts/tikzjax.config.js' | url }}"></script>
```

## 2. jsDelivr and unpkg

Recommended jsDelivr loading:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
```

Equivalent unpkg loading:

```html
<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
```

For debugging only, you may use the non-minified files:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.js"></script>
```

For production documentation, prefer:

```text
fonts.min.css
tikzjax.min.js
```

## 3. `mkdocs.yml` and Superfences

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

## 4. Minimal MkDocs setup

### 4.1 `overrides/main.html`

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

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
{% endblock %}

{% block footer scoped %}
{% include "partials/footer.html" with context %}
{% endblock %}
```

### 4.2 Minimal `mkdocs.yml`

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

## 5. Recommended MkDocs setup with config file

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

    <script src="{{ 'javascripts/tikzjax.config.js' | url }}"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
{% endblock %}

{% block footer scoped %}
{% include "partials/footer.html" with context %}
{% endblock %}
```

### 5.2 `docs/javascripts/tikzjax.config.js`

```js
window.TikzJaxOptions = {
    renderTimeout: 15000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/assets/broken-image.svg",

    tex: {
        texPackages: {
            amsmath: "",
            "tkz-tab": ""
        },
        tikzLibraries: [
            "arrows.meta",
            "calc",
            "positioning"
        ],
        addToPreamble: ""
    },

    tkzTab: {
        lineWidth: "1.2pt",
        font: "\\Large",

        lgt: 10,
        firstColumnWidth: 10,
        espcl: 3.2,

        variableRowHeight: 1.5,
        signRowHeight: 2.5,
        variationRowHeight: 2.5,
        imageRowHeight: 2.5,
        antecedentRowHeight: 2.5
    }
};
```

### 5.3 Recommended `mkdocs.yml`

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

## 6. MathJax is optional

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

## 7. Minimal Markdown `tikzjax` code block example

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

## 8. Recommended loading order

The recommended loading order is:

1. optional `tikzjax.config.js`;
2. `fonts.min.css`;
3. `tikzjax.min.js`;
4. page content containing TikZ blocks.

In practice, TikZJax also observes the DOM. If TikZ blocks are added after the initial page load, they are automatically detected and rendered.

## 9. `assetBaseUrl` in MkDocs

For normal jsDelivr or unpkg usage, you usually do not need `assetBaseUrl`.

TikZJax automatically loads runtime files from the same `dist/` directory as `tikzjax.min.js`.

However, if you serve the main script from one place and runtime assets from another place, define `assetBaseUrl` before loading TikZJax.

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist"
};
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
```

Runtime files include:

```text
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

## 10. Same-origin MkDocs installation

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

## 11. Worker modes in MkDocs

TikZJax supports three worker modes.

| Mode       | Description                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------- |
| `"auto"`   | Default mode. Uses a direct Worker for same-origin files and a Blob Worker for cross-origin files. |
| `"blob"`   | Always creates a Blob Worker. Useful for CDN-hosted worker scripts.                                |
| `"direct"` | Always creates a direct Worker. Best for same-origin installations.                                |

Recommended choices:

| Situation                                                | Recommended mode                  |
| -------------------------------------------------------- | --------------------------------- |
| MkDocs site using jsDelivr or unpkg                      | `"auto"`                          |
| MkDocs site with CSP allowing `blob:` workers            | `"auto"` or `"blob"`              |
| MkDocs site serving TikZJax locally from the same origin | `"direct"`                        |
| Strict CSP without `blob:` workers                       | `"direct"` with same-origin files |

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

## 12. CSP notes

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

* `worker-src blob:` is required for Blob Worker mode.
* `'wasm-unsafe-eval'` is usually required because TikZJax uses WebAssembly.
* `style-src 'unsafe-inline'` may be required because bundled CSS is injected by the JavaScript bundle.

## 13. Interactions with MathJax and MkDocs extensions

MathJax, Arithmatex, admonitions, details, and tabs are not required by TikZJax. They are common MkDocs extensions, so TikZJax tries to remain compatible with them.

### 13.1 MathJax

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

* `<script type="text/tikz">...</script>` is inside a `script` tag.
* fenced `tikzjax` blocks are converted to `pre` / `code` blocks before TikZJax processes them.

After rendering, TikZJax wraps generated SVGs in a `mathjax_ignore` container to reduce the risk of MathJax processing them again during later rescans.

### 13.2 Arithmatex

Some MkDocs/Material setups wrap math expressions in Arithmatex markup.

TikZJax includes cleanup logic for script-based TikZ sources. It removes some Arithmatex wrappers, converts `\(...\)` back into `$...$`, converts `\[...\]` back into `$$...$$`, and decodes HTML entities before sending the source to TeX.

### 13.3 Admonitions

Admonitions are containers around content. TikZJax scans nested DOM content, so TikZ blocks inside admonitions are detected.

### 13.4 Collapsible admonitions with `pymdownx.details`

TikZJax uses a `MutationObserver` to watch for added content. It detects:

```text
script[type="text/tikz"]
pre.language-tikzjax
pre.tikzjax
pre.language-tikz
pre.tikz
```

It also performs a delayed rescan after the initial load to catch content inserted or revealed by MkDocs/Material.

### 13.5 Content tabs with `pymdownx.tabbed`

Material content tabs can insert, move, or reveal content after the first page scan.

TikZJax listens to tab interactions and schedules a rescan when tabbed content changes. This helps render TikZ blocks inside tabs without requiring a manual render call.

If your theme or MkDocs setup blocks scripts, also check your CSP policy and the `workerMode` / `assetBaseUrl` options.
