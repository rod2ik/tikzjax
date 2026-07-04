# Fallback Error Images

TikZJax displays a fallback image when a TikZ or `tkz-tab` block is detected, but rendering fails.

This usually happens when:

- the TikZ code contains a syntax error;
- the LaTeX code contains an invalid command;
- a LaTeX package is missing;
- a TikZ library is missing;
- rendering times out;
- the TeX worker fails;
- runtime assets are blocked or unreachable.

The fallback image is configured with the `brokenImageSrc` option.

It can be configured globally for the whole page, partially after TikZJax has loaded, or locally for one diagram.

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
    brokenImageSrc: "https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSIONjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

Or with unpkg:

```js
window.Tikz__/dist/assets/broken-image.svg"
};
```

## 2. Available fallback images

The following fallback images are available in the package.

| Name | CDN path |
| --- | --- |
| Default | `dist/assets/broken-image.svg` |
| Gradient | `dist/assets/broken-image-degrade.svg` |
| Emoji | `dist/assets/broken-image-emoji.svg` |
| Clean | `dist/assets/broken-image-epuree.svg` |
| Sketch | `dist/assets/broken-image-esquisse.svg` |
| Material | `dist/assets/broken-image-materielle.svg` |
| Minimalist | `dist/assets/broken-image-minimaliste.svg` |
| Modern | `dist/assets/broken-image-moderne.svg` |

If this documentation site also stores local preview files in `./img`, you can display them with Markdown:

| Name | Preview |
| --- | --- |
| Default | ![Default fallback image](./img/broken-image.svg) |
| Gradient | ![Gradient fallback image](./img/broken-image-degrade.svg) |
| Emoji | ![Emoji fallback image](./img/broken-image-emoji.svg) |
| Clean | ![Clean fallback image](./img/broken-image-epuree.svg) |
| Sketch | ![Sketch fallback image](./img/broken-image-esquisse.svg) |
| Material | ![Material fallback image](./img/broken-image-materielle.svg) |
| Minimalist | ![Minimalist fallback image](./img/broken-image-minimaliste.svg) |
| Modern | ![Modern fallback image](./img/broken-image-moderne.svg) |

## 3. Global configuration

Choose one image and set `brokenImageSrc` in `tikzjax.config.js`.

The configuration file must be loaded before `tikzjax.min.js`.

Recommended jsDelivr loading:

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

Example `tikzjax.config.js`:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

## 4. Fallback priority

TikZJax resolves fallback images in this order:

```text
default broken image
< global brokenImageSrc
< partial global brokenImageSrc
< local data-broken-image-src
```

This means that a local diagram option has the highest priority.

A local fallback image affects only the current diagram.

It does not mutate `window.TikzJaxOptions`.

## 5. Global fallback examples

### 5.1 Use the default image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

### 5.2 Use the gradient image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-degrade.svg"
};
```

### 5.3 Use the emoji image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-emoji.svg"
};
```

### 5.4 Use the clean image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-epuree.svg"
};
```

### 5.5 Use the sketch image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-esquisse.svg"
};
```

### 5.6 Use the material image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-materielle.svg"
};
```

### 5.7 Use the minimalist image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-minimaliste.svg"
};
```

### 5.8 Use the modern image

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-moderne.svg"
};
```

### 5.9 Use a custom image

You can use your own image as a fallback error image.

`brokenImageSrc` can be:

- an absolute URL;
- a root-relative path;
- a relative path resolved from the current page;
- a `data:` URL.

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

## 6. Local fallback for one diagram

Use `data-broken-image-src` when one diagram should use its own fallback image.

This does not change the global fallback image.

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

You can also use a `data:` URL.

```html
<script
  type="text/tikz"
  data-broken-image-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='110' viewBox='0 0 220 110'%3E%3Crect width='220' height='110' rx='12' fill='%23fff7ed' stroke='%23ea580c' stroke-width='5'/%3E%3Ctext x='110' y='48' text-anchor='middle' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='%23c2410c'%3ELOCAL ERROR%3C/text%3E%3Ctext x='110' y='74' text-anchor='middle' font-family='Arial,sans-serif' font-size='13' fill='%239a3412'%3Edata-broken-image-src%3C/text%3E%3C/svg%3E"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

## 7. Partial global fallback after TikZJax has loaded

After TikZJax has loaded, you can update only the fallback image without erasing the rest of the global configuration.

```js
window.TikzJaxOptions = {
    brokenImageSrc: "/assets/images/tikz-error.svg"
};
```

This changes only `brokenImageSrc`.

It does not erase previous options such as:

```text
tex.texPackages
tex.tikzLibraries
tkzTab
renderTimeout
workerMode
```

You can also use:

```js
window.TikzJaxConfigure({
    brokenImageSrc: "/assets/images/tikz-error.svg"
});
```

!!! warning

    TikZJax can merge later assignments only after its configuration API has been installed.

    For the initial page setup, prefer one complete `tikzjax.config.js` loaded before `tikzjax.min.js`.

## 8. Complete global example

```js
window.TikzJaxOptions = {
    renderTimeout: 10000,
    maxRetries: 0,
    restartWorkerOnFail: true,

    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image-moderne.svg",

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

## 9. Test the fallback image

You can test the configured fallback image with intentionally invalid TikZ code.

Using an invalid command is usually more reliable than omitting `\end{tikzpicture}` because the document remains structurally complete.

=== "Rendering"

    <script type="text/tikz" data-disable-cache="true">
    \begin{tikzpicture}
        \ThisCommandDoesNotExist
    \end{tikzpicture}
    </script>

=== ":fa-markdown: Markdown"

    ````latex
    ```tikzjax
    \begin{tikzpicture}
        \ThisCommandDoesNotExist
    \end{tikzpicture}
    ```
    ````

This block contains an invalid command, so TikZJax should display the configured fallback image.

## 10. Test a local fallback image

This example intentionally fails and uses a local fallback image.

The local image should be used only for this diagram.

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-broken-image-src="/assets/images/local-tikz-error.svg"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>
```

## 11. Troubleshooting

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

For local SVG files:

```http
img-src 'self' data: blob:;
```

### The default image is displayed instead of the selected one

Check that `tikzjax.config.js` is loaded before `tikzjax.min.js`.

```html
<script src="/path/to/your/local/tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Also check that no later script changes `window.TikzJaxOptions.brokenImageSrc`.

A later partial configuration is allowed, but it has higher priority than the initial global value.

### A local fallback image is ignored

Check that the attribute is placed on the TikZJax block itself.

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

Also check that the diagram really fails.

If the diagram renders successfully, no fallback image is displayed.

### The image works locally but not in MkDocs

Check the final generated URL in the browser.

For MkDocs, local paths are relative to the generated page URL, not necessarily to the Markdown source file.

For reliable paths, use a root-relative path or a CDN URL:

```js
window.TikzJaxOptions = {
    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg"
};
```

### The fallback test keeps spinning

Prefer a complete but invalid TikZ document:

```latex
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
```

Avoid testing fallback behavior with a missing `\end{tikzpicture}` because incomplete documents can sometimes produce long-running TeX behavior instead of a clean failure.