# Fallback Error Images

TikZJax displays a fallback image when a TikZ or `tkz-tab` block is detected, but rendering fails.

This usually happens when the TikZ code contains an error, when a LaTeX package is missing, when a TikZ library is missing, or when rendering times out.

The fallback image is configured with the `brokenImageSrc` option.

## 1. Default fallback image

By default, TikZJax uses:

```text
broken-image.svg
```

If you want to keep the default image, you do not need to configure anything.

```js
window.TikzJaxOptions = {};
```

You may also set it explicitly:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "./img/broken-image.svg"
};
```

## 2. Available fallback images

The following fallback images are available.

They are assumed to be stored in the `./img` folder, next to this Markdown file.

| Name       | File                           | Preview                                                          |
| ---------- | ------------------------------ | ---------------------------------------------------------------- |
| Default    | `broken-image.svg`             | ![Default fallback image](./img/broken-image.svg)                |
| Gradient   | `broken-image-degrade.svg`     | ![Gradient fallback image](./img/broken-image-degrade.svg)       |
| Emoji      | `broken-image-emoji.svg`       | ![Emoji fallback image](./img/broken-image-emoji.svg)            |
| Clean      | `broken-image-epuree.svg`      | ![Clean fallback image](./img/broken-image-epuree.svg)           |
| Sketch     | `broken-image-esquisse.svg`    | ![Sketch fallback image](./img/broken-image-esquisse.svg)        |
| Material   | `broken-image-materielle.svg`  | ![Material fallback image](./img/broken-image-materielle.svg)    |
| Minimalist | `broken-image-minimaliste.svg` | ![Minimalist fallback image](./img/broken-image-minimaliste.svg) |
| Modern     | `broken-image-moderne.svg`     | ![Modern fallback image](./img/broken-image-moderne.svg)         |

## 3. Configuration

Choose one image and set `brokenImageSrc` in `tikzjax.config.js`.

The configuration file must be loaded before `tikzjax.js`.

```html
<script src="/path/to/you/local/tikzjax.config.js"></script>
<link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

## 4. Examples

### 4.1 Use the default image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image.svg"
};
```

### 4.2 Use the gradient image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-degrade.svg"
};
```

### 4.3 Use the emoji image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-emoji.svg"
};
```

### 4.4 Use the clean image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-epuree.svg"
};
```

### 4.5 Use the sketch image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-esquisse.svg"
};
```

### 4.6 Use the material image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-materielle.svg"
};
```

### 4.7 Use the minimalist image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-minimaliste.svg"
};
```

### 4.8 Use the modern image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-moderne.svg"
};
```

### 4.9 Custom Images

You can of course use your own custom images as fallback error images.  
You only need to use a value for the key `brokenImageSrc` :

* any internet URL leading to an image
* your own custom relative path ( relatively to where you placed your `tikzjac.config.js` )

## 5. Complete example

```js
window.TikzJaxOptions = {
    renderTimeout: 15000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-moderne.svg",

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
    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) -- (2,2);
    ```
=== ":fa-markdown: Markdown"
    ````latex
    # Any broken `TikZ` or `tkz-tab` code
    
    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) -- (2,2);
    ```
    ````

This block is missing `\end{tikzpicture}`, so TikZJax should display the configured fallback image.

## 7. Troubleshooting

### The fallback image is not displayed

Check that the path is correct.

For example, if this Markdown file is next to the `img` folder, this path is valid:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image.svg"
};
```

### The browser shows a missing image icon

Open the browser DevTools and check the Network tab.

Make sure the SVG file is reachable and that no CSP or server rule blocks it.

### The default image is displayed instead of the selected one

Check that `tikzjax.config.js` is loaded before `tikzjax.js`.

```html
<script src="/path/to/your/local/tikzjax.config.js"></script>
<link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```
