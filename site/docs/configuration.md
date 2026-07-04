# `tikzjax.config.js` Configuration

This page explains how to configure TikZJax globally, partially, and locally.

The recommended setup is:

1. define global options in `tikzjax.config.js`;
2. load the TikZJax stylesheet;
3. load `tikzjax.min.js`.

The configuration file must be loaded before `tikzjax.min.js` or `tikzjax.js`.

Recommended CDN loading with minified files:

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Equivalent unpkg loading:

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

## Configuration priority

TikZJax merges options in this order:

```text
default TikZJax options
< global configuration
< later partial global configuration
< local diagram configuration
```

This means that a local option can override one diagram without erasing the global configuration.

It also means that a later partial global configuration can update one option without replacing the whole previous configuration.

Example:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsmath: "",
            amsfonts: ""
        },
        tikzLibraries: [
            "arrows.meta"
        ]
    }
};

window.TikzJaxOptions = {
    brokenImageSrc: "/images/custom-tikz-error.svg"
};
```

The second assignment only changes `brokenImageSrc`.

It does not erase `tex.texPackages` or `tex.tikzLibraries`.

!!! warning "Important loading note"

    TikZJax can merge later assignments only after its configuration API has been installed.

    The recommended pattern is therefore:

    ```html
    <script src="tikzjax.config.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
    ```

    Use one complete `tikzjax.config.js` before loading TikZJax.

    Later partial assignments such as `window.TikzJaxOptions = { brokenImageSrc: "..." }` should be used after TikZJax has loaded.

## Merge behavior

TikZJax uses a deep merge strategy.

| Option type | Behavior |
| --- | --- |
| Plain objects | Merged recursively |
| Arrays | Merged without duplicate entries |
| Strings, numbers, booleans | Later value replaces earlier value |
| Local `data-*` options | Merged with global options for the current diagram only |

For example, this global configuration:

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

can be extended locally:

```html
<script type="text/tikz" data-tikz-libraries="decorations.pathreplacing">
\begin{tikzpicture}
    \draw[-{Stealth[length=4mm]}] (0,0) -- (4,0);
    \draw[decorate, decoration={brace, amplitude=6pt}] (0,-0.5) -- (4,-0.5);
\end{tikzpicture}
</script>
```

The final diagram gets:

```text
arrows.meta
calc
decorations.pathreplacing
```

## 1. Minimal configuration

Use this if you only need standard TikZ figures and a few common TikZ libraries.

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: [
            "arrows.meta"
        ]
    }
};
```

## 2. Recommended MkDocs configuration

Use this as a good default for a MkDocs site with Material theme.

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

This configuration provides:

- common AMS packages;
- useful TikZ libraries;
- `tkz-tab` support;
- a rendering timeout;
- a custom broken-image fallback;
- global styling for `tkz-tab` tables.

## 3. `tkz-tab` focused configuration

Use this if your documentation mostly contains variation tables or sign tables.

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsmath: "",
            "tkz-tab": ""
        }
    },

    tkzTab: {
        lineWidth: "1.2pt",
        font: "\\Large",

        lgt: 10,
        espcl: 3.2,

        variableRowHeight: 1.5,
        signRowHeight: 2.5,
        variationRowHeight: 2.5
    }
};
```

!!! note

    Some TikZJax builds may include extra runtime support for `tkz-tab`.

    Keeping `"tkz-tab": ""` in your configuration is still useful because it makes your setup explicit and easier to understand.

## 4. Configuration with custom LaTeX commands

Use `String.raw` for LaTeX preambles. It avoids escaping every backslash.

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsmath: "",
            amsfonts: "",
            amssymb: ""
        },

        addToPreamble: String.raw`
\newcommand{\R}{\mathbb{R}}
\newcommand{\N}{\mathbb{N}}
\newcommand{\vect}[1]{\overrightarrow{#1}}
`
    }
};
```

You can then use the commands in any TikZJax block.

```html
<script type="text/tikz">
\begin{tikzpicture}
    \node[draw, rounded corners, inner sep=6pt] {$f:\R\to\R$};
\end{tikzpicture}
</script>
```

## 5. Configuration for a non-MkDocs dark theme

Use this when your site stores the current theme on an attribute or a class.

```js
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

For a class-based theme, use `darkClass` and `lightClass`.

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        darkClass: "theme-dark",
        lightClass: "theme-light",
        fallbackTheme: "light"
    }
};
```

## 6. Partial global configuration

A partial global configuration is useful when you want to change only one option after TikZJax has loaded.

Example:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/images/custom-tikz-error.svg"
};
```

This updates only the fallback image.

It does not erase previous options such as:

```text
tex.texPackages
tex.tikzLibraries
tkzTab
renderTimeout
workerMode
```

You can also use `window.TikzJaxConfigure()` after TikZJax has loaded.

```js
window.TikzJaxConfigure({
    brokenImageSrc: "/images/custom-tikz-error.svg"
});
```

This is equivalent to assigning a partial object to `window.TikzJaxOptions`.

## 7. Local diagram options

Global configuration defines defaults.

A single diagram can still add or override options locally with `data-*` attributes.

Local options affect only the current diagram.

They do not mutate `window.TikzJaxOptions`.

### Local TikZ libraries

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

The local library is added to the global libraries.

It does not erase them.

### Local TeX packages

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

### Local preamble

```html
<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\localname}{Local macro}"
>
\begin{tikzpicture}
    \node at (0,0) {\localname};
\end{tikzpicture}
</script>
```

The local preamble is appended to the global preamble for this diagram only.

### Local fallback image

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

If this diagram fails to render, it uses `/images/local-tikz-error.svg`.

Other diagrams still use the global fallback image.

### Local timeout

```html
<script
  type="text/tikz"
  data-render-timeout="30000"
>
\begin{tikzpicture}
    \draw (0,0) -- (10,0);
\end{tikzpicture}
</script>
```

This diagram gets a 30-second timeout.

Other diagrams keep the global timeout.

### Local cache disabling

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

Use this while debugging a diagram.

## 8. Supported local `data-*` options

The following local options can be used on a TikZJax block.

| Attribute | Option |
| --- | --- |
| `data-tex-packages` | Adds local TeX packages |
| `data-tikz-libraries` | Adds local TikZ libraries |
| `data-add-to-preamble` | Adds local LaTeX preamble |
| `data-broken-image-src` | Overrides fallback image for one diagram |
| `data-render-timeout` | Overrides render timeout for one diagram |
| `data-max-retries` | Overrides retry count for one diagram |
| `data-restart-worker-on-fail` | Overrides worker restart behavior |
| `data-disable-cache` | Disables cache for one diagram |
| `data-width` | Sets loader width |
| `data-height` | Sets loader height |
| `data-options` | JSON object with local options |
| `data-tikzjax-options` | JSON object with local options |

Example with `data-tikzjax-options`:

```html
<script
  type="text/tikz"
  data-tikzjax-options='{"renderTimeout":30000,"tex":{"tikzLibraries":["decorations.pathreplacing"]}}'
>
\begin{tikzpicture}
    \draw[decorate, decoration={brace, amplitude=6pt}] (0,0) -- (4,0);
\end{tikzpicture}
</script>
```

## 9. Broken image fallback

Use `brokenImageSrc` to configure the global fallback image.

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/images/tikz-error.svg"
};
```

This image is shown when a diagram fails to render.

You can also set a fallback image for a single diagram.

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

Priority:

```text
default broken image
< global brokenImageSrc
< partial global brokenImageSrc
< local data-broken-image-src
```

## 10. Render safety options

TikZJax supports render timeout and retry options.

```js
window.TikzJaxOptions = {
    renderTimeout: 15000,
    maxRetries: 1,
    restartWorkerOnFail: true
};
```

| Option | Meaning |
| --- | --- |
| `renderTimeout` | Maximum render time in milliseconds |
| `maxRetries` | Number of retry attempts after a failed render |
| `restartWorkerOnFail` | Whether to restart the worker after a render failure |

You can also configure them under `tex`:

```js
window.TikzJaxOptions = {
    tex: {
        renderTimeout: 15000,
        maxRetries: 1,
        restartWorkerOnFail: true
    }
};
```

Root-level values take precedence over nested `tex` values.

Local values take precedence over global values for one diagram.

```html
<script
  type="text/tikz"
  data-render-timeout="30000"
  data-max-retries="2"
  data-restart-worker-on-fail="true"
>
\begin{tikzpicture}
    \draw (0,0) -- (5,0);
\end{tikzpicture}
</script>
```

## 11. jsDelivr configuration

When using jsDelivr, no special `assetBaseUrl` configuration is required in most cases.

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

TikZJax automatically resolves runtime files from the same `dist/` directory as `tikzjax.min.js`:

```text
run-tex.js
tex.wasm.gz
core.dump.gz
tex_files/
assets/broken-image.svg
```

Equivalent explicit configuration:

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist",
    workerMode: "auto"
};
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

## 12. unpkg configuration

When using unpkg, the setup is similar.

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Equivalent explicit configuration:

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist",
    workerMode: "auto"
};
</script>

<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

## 13. Same-origin configuration

Use this setup when all TikZJax files are served from your own domain.

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

Your server should expose:

```text
/vendor/tikzjax/tikzjax.min.js
/vendor/tikzjax/run-tex.js
/vendor/tikzjax/fonts.min.css
/vendor/tikzjax/tex.wasm.gz
/vendor/tikzjax/core.dump.gz
/vendor/tikzjax/tex_files/
/vendor/tikzjax/assets/broken-image.svg
```

Use `workerMode: "direct"` for strict same-origin deployments.

## 14. Custom worker URL

Use `workerUrl` when the worker file is not located directly inside `assetBaseUrl`.

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerUrl: "/vendor/tikzjax/workers/run-tex.js",
    workerMode: "direct"
};
```

You can also use the nested form:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    worker: {
        url: "/vendor/tikzjax/workers/run-tex.js",
        mode: "direct"
    }
};
```

Root-level `workerMode` and `workerUrl` take precedence over nested `worker.mode` and `worker.url`.

## 15. Worker mode selection

TikZJax supports three worker modes.

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

| Mode | Behavior |
| --- | --- |
| `"auto"` | Same-origin workers use direct mode. Cross-origin workers use Blob mode. |
| `"blob"` | Always fetches the worker script and starts it as a Blob Worker. |
| `"direct"` | Always starts the worker with `new Worker(workerUrl)`. Best for same-origin hosting. |

Recommended choices:

| Situation | Recommended mode |
| --- | --- |
| jsDelivr or unpkg on a normal page | `"auto"` |
| CDN script with CSP allowing `blob:` workers | `"auto"` or `"blob"` |
| Fully local same-origin deployment | `"direct"` |
| Strict CSP without `blob:` workers | `"direct"` with same-origin files |

## 16. CSP-oriented configuration

For jsDelivr or unpkg with Blob Worker support:

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

Typical CSP directives:

```http
script-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'wasm-unsafe-eval';
style-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'unsafe-inline';
worker-src 'self' blob:;
connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
img-src 'self' https://cdn.jsdelivr.net https://unpkg.com data: blob:;
font-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
```

For local same-origin files without Blob Workers:

```js
window.TikzJaxOptions = {
    assetBaseUrl: "/vendor/tikzjax",
    workerMode: "direct"
};
```

Typical CSP directives:

```http
script-src 'self' 'wasm-unsafe-eval';
style-src 'self' 'unsafe-inline';
worker-src 'self';
connect-src 'self';
img-src 'self' data:;
font-src 'self';
```

## 17. Recommended loading order

Use the configuration file first, then the stylesheet, then the TikZJax script.

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

For debugging, you can use the non-minified files:

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.js"></script>
```

In MkDocs, keep the same order in your `overrides/main.html`.

```html
{% block libs %}
    {{ super() }}

    <script src="{{ 'assets/javascripts/tikzjax.config.js' | url }}"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
{% endblock %}
```