# Installation

## CDN installation

In a regular HTML page, load the font stylesheet first, then the TikZJax script.

```html
<link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

TikZJax automatically infers its base URL from the loaded script URL. The files required by the TeX WebAssembly engine are therefore looked up next to `tikzjax.js`.

The CDN must contain at least:

```text
tikzjax.js
run-tex.js
tex.wasm.gz
core.dump.gz
fonts.css
assets/broken-image.svg
```

## With global configuration

The configuration file must be loaded before `tikzjax.js`.

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

## Minimal HTML example

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
    <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js" defer></script>
</head>
<body>
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) -- (2,2);
    \end{tikzpicture}
    </script>
</body>
</html>
```

## Installation in MkDocs

In `mkdocs.yml`, add the configuration file and TikZJax to the extra JavaScript files.

```yaml
extra_javascript:
  - tikzjax.config.js
  - https://rod2ik.github.io/cdn/tikzjax/tikzjax.js

extra_css:
  - https://rod2ik.github.io/cdn/tikzjax/fonts.css
```

If your theme or MkDocs setup blocks scripts, also check your CSP policy and theme options.

## Minimal Markdown example

````markdown
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

## Recommended loading order

1. `tikzjax.config.js`
2. `fonts.css`
3. `tikzjax.js`
4. the page content containing TikZ blocks

In practice, TikZJax also observes the DOM: if TikZ blocks are added after the initial page load, they are automatically detected and rendered.
