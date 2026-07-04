# Fallback Error Images

TikZJax displays a fallback image when a TikZ or `tkz-tab` block is detected, but rendering fails.

This usually happens when:

* the TikZ code contains a syntax error;
* a LaTeX package is missing;
* a TikZ library is missing;
* rendering times out;
* the TeX worker fails.

The fallback image is configured with the `brokenImageSrc` option.

## 1. Default fallback image

By default, TikZJax uses the fallback image bundled in the package:

```text
dist/assets/broken-image.svg
```

If you want to keep the default image, you do not need to configure anything.

```js
window.TikzJaxOptions = {};
```

You may also set it explicitly with jsDelivr:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

Or with unpkg:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

## 2. Available fallback images

The following fallback images are available in the package.

| Name       | CDN path                                   |
| ---------- | ------------------------------------------ |
| Default    | `dist/assets/broken-image.svg`             |
| Gradient   | `dist/assets/broken-image-degrade.svg`     |
| Emoji      | `dist/assets/broken-image-emoji.svg`       |
| Clean      | `dist/assets/broken-image-epuree.svg`      |
| Sketch     | `dist/assets/broken-image-esquisse.svg`    |
| Material   | `dist/assets/broken-image-materielle.svg`  |
| Minimalist | `dist/assets/broken-image-minimaliste.svg` |
| Modern     | `dist/assets/broken-image-moderne.svg`     |

If this documentation site also stores local preview files in `./img`, you can display them with Markdown:

| Name       | Preview                                                          |
| ---------- | ---------------------------------------------------------------- |
| Default    | ![Default fallback image](./img/broken-image.svg)                |
| Gradient   | ![Gradient fallback image](./img/broken-image-degrade.svg)       |
| Emoji      | ![Emoji fallback image](./img/broken-image-emoji.svg)            |
| Clean      | ![Clean fallback image](./img/broken-image-epuree.svg)           |
| Sketch     | ![Sketch fallback image](./img/broken-image-esquisse.svg)        |
| Material   | ![Material fallback image](./img/broken-image-materielle.svg)    |
| Minimalist | ![Minimalist fallback image](./img/broken-image-minimaliste.svg) |
| Modern     | ![Modern fallback image](./img/broken-image-moderne.svg)         |

## 3. Configuration

Choose one image and set `brokenImageSrc` in `tikzjax.config.js`.

The configuration file must be loaded before `tikzjax.min.js`.

```html
<script src="/path/to/your/local/tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Equivalent unpkg loading:

```html
<script src="/path/to/your/local/tikzjax.config.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

## 4. Examples

### 4.1 Use the default image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

### 4.2 Use the gradient image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-degrade.svg"
};
```

### 4.3 Use the emoji image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-emoji.svg"
};
```

### 4.4 Use the clean image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-epuree.svg"
};
```

### 4.5 Use the sketch image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-esquisse.svg"
};
```

### 4.6 Use the material image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-materielle.svg"
};
```

### 4.7 Use the minimalist image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-minimaliste.svg"
};
```

### 4.8 Use the modern image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-moderne.svg"
};
```

### 4.9 Use a custom image

You can use your own image as a fallback error image.

`brokenImageSrc` can be:

* an absolute URL;
* a root-relative path;
* a relative path resolved from the current page.

Examples:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/assets/images/tikz-error.svg"
};
```

```js
window.TikzJaxOptions = {
    brokenImageSrc: "./img/broken-image.svg"
};
```

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://example.com/assets/tikz-error.svg"
};
```

## 5. Complete example

```js
window.TikzJaxOptions = {
    renderTimeout: 15000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-moderne.svg",

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

## 6. Test the fallback image

You can test the configured fallback image with intentionally invalid TikZ code.

=== "Rendering"
`tikzjax
    \begin{tikzpicture}
        \draw (0,0) -- (2,2);
    `

=== ":fa-markdown: Markdown"
````latex
# Any broken TikZ or tkz-tab code

`````
```tikzjax
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
```
````
`````

This block is missing `\end{tikzpicture}`, so TikZJax should display the configured fallback image.

## 7. Troubleshooting

### The fallback image is not displayed

Check that the path is correct.

For example, this path uses the package default image from jsDelivr:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

And this path uses the package default image from unpkg:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

### The browser shows a missing image icon

Open the browser DevTools and check the Network tab.

Make sure the SVG file is reachable and that no CSP or server rule blocks it.

If you use a Content Security Policy, make sure `img-src` allows the image location.

For jsDelivr or unpkg:

```http
img-src 'self' https://cdn.jsdelivr.net https://unpkg.com data: blob:;
```

### The default image is displayed instead of the selected one

Check that `tikzjax.config.js` is loaded before `tikzjax.min.js`.

```html
<script src="/path/to/your/local/tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Also check that no later script overwrites `window.TikzJaxOptions`.

### The image works locally but not in MkDocs

Check the final generated URL in the browser.

For MkDocs, local paths are relative to the generated page URL, not necessarily to the Markdown source file. For reliable paths, use a root-relative path or a CDN URL:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```
