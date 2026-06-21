# `tikzjax.config.js` file

This page provides a complete `tikzjax.config.js` file that you can adapt for a MkDocs site.

The important point: this file must be loaded before `tikzjax.js`.

## Recommended example

```js
console.log("[TIKZJAX.CONFIG] loaded");

window.TikzJaxOptions = {
    renderTimeout: 10000,
    maxRetries: 1,
    restartWorkerOnFail: true,

    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-esquisse.svg",

    theme: {
        selector: "body",
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default",
        fallbackTheme: "light",
        followSystemTheme: false
    },

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

        addToPreamble: String.raw`
% Custom global commands
`
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

## Minimal variant

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            amsmath: ""
        },
        tikzLibraries: [
            "arrows.meta"
        ]
    }
};
```

## `tkz-tab`-oriented variant

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

## Why use `String.raw`?

LaTeX preambles contain many backslashes. In JavaScript, `String.raw` avoids having to double every `\`.

```js
addToPreamble: String.raw`
\newcommand{\vect}[1]{\overrightarrow{#1}}
\newcommand{\R}{\mathbb{R}}
`
```

Without `String.raw`, some backslashes would need to be escaped.

## Location in a MkDocs project

Example structure:

```text
.
├── docs/
│   ├── index.md
│   ├── installation.md
│   └── examples.md
├── overrides/
├── mkdocs.yml
└── tikzjax.config.js
```

In `mkdocs.yml`:

```yaml
extra_javascript:
  - tikzjax.config.js
  - https://rod2ik.github.io/cdn/tikzjax/tikzjax.js

extra_css:
  - https://rod2ik.github.io/cdn/tikzjax/fonts.css
```

If `tikzjax.config.js` is stored in `docs/javascripts/`, use:

```yaml
extra_javascript:
  - javascripts/tikzjax.config.js
  - https://rod2ik.github.io/cdn/tikzjax/tikzjax.js
```
