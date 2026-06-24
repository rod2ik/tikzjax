# `tikzjax.config.js` Examples

This page provides simple configuration files you can copy and adapt.

The configuration file must be loaded before `tikzjax.js`.

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

    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image.svg",

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

## 6. Local overrides still remain possible

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

## 7. Recommended loading order

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

In MkDocs, keep the same order in your `overrides/main.html`.
