# Installation TikZJax on Custom Standalone HTML Pages

This page details how to install TikZJax on a Custom Standalone HTML Page.

## 1. Installation on a Custom Standalone HTML Page

### 1.1 CDN Installation on a Custom Standalone HTML Page

In a regular Standalone HTML Page, load the `font.css` stylesheet first, then the TikZJax script ( `tikjax.js` )

=== "WITHOUT the optional global config file"
    ```html
    <link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
    <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
    ```
=== "WITH the optional global config file `tikzjax.config.js`"
    ```html
    <script src="./path/to/your/local/tikzjax.config.js"></script>    <!-- Relative to THIS HTML file -->
    <link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
    <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
    ```

TikZJax automatically infers its base URL from the loaded script URL. The files required by the TeX WebAssembly engine are therefore looked up next to `tikzjax.js`.

!!! info
    The CDN must contain at least:

    ```text
    tikzjax.js
    run-tex.js
    tex.wasm.gz
    core.dump.gz
    fonts.css
    assets/broken-image.svg
    ```

    If you only plan to use TikJaX in your personnal pages (HTML Pages / MkDocs Pages / other Documentation Pages), you can safely ignore this information.

### 1.2 Minimal Working Standalone HTML Page Example

This Minimal Working HTML Page Example (no custom global configuration file here) should work :

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
    <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
</head>
<body>
    <script type="text/tikz">
    \begin{tikzpicture}
      \tkzTabInit{$x$/1, $f(x)$/2}{$-\infty$, $0$, $+\infty$}
      \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-\infty$}
    \end{tikzpicture}
    </script>
</body>
</html>
```

renders as:

<script type="text/tikz">
\begin{tikzpicture}
  \tkzTabInit{$x$/1, $f(x)$/2}{$-\infty$, $0$, $+\infty$}
  \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-\infty$}
\end{tikzpicture}
</script>

YOU CAN SEE THE RENDERING IN THIS **MINIMAL STANDALONE HTML PAGE HERE**:

[https://rod2ik.github.io/tikzjax/installation/minimal.html](https://rod2ik.github.io/tikzjax/installation/minimal.html)

!!! info
    If the scripts don't load, and the table does NOT render, you may need to add a `defer`: 

    ```html
    <link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
    <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js" defer></script>
    ```

### 1.3 Advanced Custom Standalone HTML Page

If you want to see how [rod2ik/TikZJax](https://github.com/rod2ik/tikzjax) is rendered, and can be configured with Light/Dark themes, on a **TOTALLY CUSTOM STANDALONE HTML PAGE**, completely independently of MkDocs, please have a look to this more complex page : [Custom Standalone HTML Page](./custom.html).

Note that in this case, Light and Dark themes are stored on `localStorage`, thus locally, on your web Browser.
The page shows how to integrate TikZJax on your custom standalone Web project.

YOU CAN SEE THE RENDERING IN THIS **ADVANCED STANDALONE HTML PAGE HERE**:

[https://rod2ik.github.io/tikzjax/installation/advanced.html](https://rod2ik.github.io/tikzjax/installation/advanced.html)

!!! info
    If the scripts don't load, and the table does NOT render, you may need to add a `defer`: 

    ```html
    <link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
    <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js" defer></script>
    ```
