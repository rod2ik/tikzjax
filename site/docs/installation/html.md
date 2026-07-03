# Installation on a Custom Standalone HTML Page

This page explains how to install **TikZJax** on a custom standalone HTML page.

## 1. CDN installation

On a regular standalone HTML page, load the stylesheet first, then the TikZJax script.

Recommended jsDelivr installation:

=== "Without a global config file"

````
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
```
````

=== "With a global config file"

````
```html
<script src="./path/to/your/local/tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
```
````

Equivalent unpkg installation:

```html
<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
```

TikZJax automatically infers its base URL from the loaded script URL. Runtime files are therefore loaded from the same `dist/` directory as `tikzjax.min.js`.

!!! info
    The npm/CDN package contains the runtime files required by TikZJax:

    ````
    ```text
    tikzjax.js
    tikzjax.min.js
    run-tex.js
    run-tex.min.js
    tex.wasm.gz
    core.dump.gz
    tex_files/
    fonts.css
    fonts.min.css
    assets/broken-image.svg
    ```

    If you use jsDelivr or unpkg, you normally do not need to manage these files manually.
    ````

## 2. Minimal working standalone HTML page

This minimal standalone HTML page uses jsDelivr and does not require a custom configuration file.

```html
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
</head>

<body>
    <h1>Minimal Standalone HTML Page</h1>

    <script type="text/tikz">
    \begin{tikzpicture}
      \draw (0,0) -- (2,1);
    \end{tikzpicture}
    </script>

    <script type="text/tikz">
    \begin{tikzpicture}
      \tkzTabInit{$x$/1, $f(x)$/2}{$-\infty$, $0$, $+\infty$}
      \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-\infty$}
    \end{tikzpicture}
    </script>
</body>

</html>
```

It renders both a regular TikZ figure and a `tkz-tab` variation table.

Rendered example:

<script type="text/tikz">
\begin{tikzpicture}
  \tkzTabInit{$x$/1, $f(x)$/2}{$-\infty$, $0$, $+\infty$}
  \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-\infty$}
\end{tikzpicture}
</script>

You can see the complete minimal standalone HTML page here:

[Minimal Standalone HTML Page](https://rod2ik.github.io/tikzjax/installation/minimal.html)

!!! info
    If your page loads TikZJax before the document body is ready, you can add `defer` to the script:

    ````
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js" defer></script>
    ```
    ````

## 3. Using a local configuration file

A custom configuration file must be loaded before `tikzjax.min.js`.

```html
<script src="./tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
```

Example `tikzjax.config.js`:

```js
window.TikzJaxOptions = {
    renderTimeout: 15000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    tex: {
        texPackages: {
            amsmath: "",
            "tkz-tab": ""
        },
        tikzLibraries: [
            "arrows.meta",
            "calc",
            "positioning"
        ]
    }
};
```

## 4. Custom asset base URL

Use `assetBaseUrl` when the main script is loaded from one place but the runtime assets are served from another place.

```html
<script>
window.TikzJaxOptions = {
    assetBaseUrl: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist"
};
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js"></script>
```

For normal jsDelivr or unpkg usage, this option is not required because TikZJax automatically resolves the runtime path.

## 5. Same-origin installation

You can also serve all files from your own domain.

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

Use `workerMode: "direct"` when the worker file is served from the same origin as the page.

## 6. Worker mode on standalone pages

The default worker mode is `"auto"`.

```js
window.TikzJaxOptions = {
    workerMode: "auto"
};
```

| Mode       | Description                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| `"auto"`   | Uses a direct Worker for same-origin files and a Blob Worker for cross-origin files. |
| `"blob"`   | Always creates a Blob Worker. Useful for CDN-hosted worker scripts.                  |
| `"direct"` | Always creates a direct Worker. Best for same-origin installations.                  |

For most standalone pages using jsDelivr or unpkg, keep the default `"auto"` mode.

## 7. Advanced standalone HTML page

If you want to see how [@rod2ik/tikzjax](https://github.com/rod2ik/tikzjax) can be configured with light and dark themes on a fully custom standalone HTML page, see:

[Advanced Standalone HTML Page](./advanced.html)

In this example, the light/dark theme is stored in `localStorage`, independently of MkDocs.

You can see the rendered page here:

[Advanced Standalone HTML Page](https://rod2ik.github.io/tikzjax/installation/advanced.html)

!!! info
    If the script loads too early and the table does not render, you can add `defer`:

    ````
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/fonts.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@1.1.7/dist/tikzjax.min.js" defer></script>
    ```
    ````
