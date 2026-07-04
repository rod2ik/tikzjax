# `tikzjax.config.js` Examples

This page provides simple configuration files you can copy and adapt.

The configuration file must be loaded before `tikzjax.min.js` or `tikzjax.js`.

Recommended CDN loading with minified files:

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Equivalent unpkg loading:

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

## 1. Minimal configuration

Use this if you only need standard TikZ figures.

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
    renderTimeout: 15000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg",

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

## 4. Configuration with custom LaTeX commands

Use `String.raw` for LaTeX preambles. It avoids escaping every backslash.

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsmath: "",
            amssymb: "",
            "tkz-tab": ""
        },

        addToPreamble: String.raw`
\newcommand{\R}{\mathbb{R}}
\newcommand{\vect}[1]{\overrightarrow{#1}}
`
    }
};
```

You can then use the commands in any TikZJax block.

````latex
```tikzjax
\begin{tikzpicture}
    \node[draw, rounded corners, inner sep=6pt] {$f:\R\to\R$};
\end{tikzpicture}
```
````

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

## 6. jsDelivr configuration

When using jsDelivr, no special configuration is required in most cases.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

TikZJax automatically resolves runtime files from the same `dist/` directory:

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

## 7. unpkg configuration

When using unpkg, the setup is similar.

```html
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

## 8. Same-origin configuration

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

## 9. Custom worker URL

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

## 10. Worker mode selection

TikZJax supports three worker modes.

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

| Mode       | Behavior                                                                             |
| ---------- | ------------------------------------------------------------------------------------ |
| `"auto"`   | Same-origin workers use direct mode. Cross-origin workers use Blob mode.             |
| `"blob"`   | Always fetches the worker script and starts it as a Blob Worker.                     |
| `"direct"` | Always starts the worker with `new Worker(workerUrl)`. Best for same-origin hosting. |

Recommended choices:

| Situation                                    | Recommended mode                  |
| -------------------------------------------- | --------------------------------- |
| jsDelivr or unpkg on a normal page           | `"auto"`                          |
| CDN script with CSP allowing `blob:` workers | `"auto"` or `"blob"`              |
| Fully local same-origin deployment           | `"direct"`                        |
| Strict CSP without `blob:` workers           | `"direct"` with same-origin files |

## 11. CSP-oriented configuration

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

## 12. Local overrides still remain possible

Global configuration defines defaults. A block can still override some options locally.

```html
<script
  type="text/tikz"
  data-tikz-libraries="decorations.pathmorphing"
  data-disable-cache="true"
>
\begin{tikzpicture}
    \draw[decorate, decoration=zigzag] (0,0) -- (4,0);
\end{tikzpicture}
</script>
```

## 13. Recommended loading order

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
