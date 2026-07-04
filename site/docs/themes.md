# Light/Dark Themes

TikZJax can adapt generated SVGs to the current light or dark theme.

The goal is simple: a standard black TikZ drawing on a light background should remain readable on a dark background without rewriting the TikZ code.

For the complete list of theme options, see [API Reference](api-reference.md).

## 1. Principle

After rendering a TikZ block, TikZJax inspects the generated SVG and normalizes common colors.

In particular, it can:

* turn black fills into `currentColor`;
* turn black strokes into `currentColor`;
* turn SVG text into `currentColor`;
* make some white backgrounds transparent;
* apply a light or dark text color on the SVG wrapper.

This works best for usual mathematical figures, variation tables, sign tables, axes, labels, and simple diagrams.

## 2. Configuration location

Theme configuration is defined in the global TikZJax configuration object:

```js
window.TikzJaxOptions = {
    theme: {
        fallbackTheme: "light"
    }
};
```

If you use a separate configuration file, it must be loaded before `tikzjax.min.js`.

Example with jsDelivr:

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Equivalent example with unpkg:

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css">
<script src="https://unpkg.com/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

## 3. What TikZJax can and cannot adapt

TikZJax mainly adapts standard black, white, and text-like SVG elements.

It does not try to redesign a fully colored drawing.

For example, this kind of drawing usually adapts well:

```latex
\begin{tikzpicture}
    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
    \draw[thick] (0,0) -- (3,2);
\end{tikzpicture}
```

If your drawing uses many explicit colors, you should choose colors that work in both themes, or provide separate light and dark versions.

## 4. Material for MkDocs

Material for MkDocs usually stores the current color scheme on the `body` element with the `data-md-color-scheme` attribute.

A typical TikZJax configuration is:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default",
        fallbackTheme: "light",
        followSystemTheme: true
    }
};
```

With a standard Material palette:

```yaml
theme:
  name: material
  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
      primary: blue
      accent: blue
      toggle:
        icon: material/weather-night
        name: Switch to dark mode

    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      primary: pink
      accent: pink
      toggle:
        icon: material/weather-sunny
        name: Switch to light mode
```

## 5. Attribute-based themes

Use this when your site stores the theme in an HTML attribute.

Example:

```html
<html data-theme="dark">
```

Configuration:

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

This also works with other attributes.

Example with Bootstrap-style theme storage:

```html
<html data-bs-theme="dark">
```

```js
window.TikzJaxOptions = {
    theme: {
        selector: "html",
        attribute: "data-bs-theme",
        darkValue: "dark",
        lightValue: "light",
        fallbackTheme: "light",
        followSystemTheme: true
    }
};
```

## 6. Class-based themes

Use this when your site stores the theme as a CSS class.

Example:

```html
<body class="dark">
```

Configuration:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        darkClass: "dark",
        lightClass: "light",
        fallbackTheme: "light"
    }
};
```

Another common convention is:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "html",
        darkClass: "theme-dark",
        lightClass: "theme-light",
        fallbackTheme: "light"
    }
};
```

## 7. Automatic compatibility

Even without explicit configuration, TikZJax can recognize common theme conventions.

Typical examples include:

* `data-theme="dark"` or `data-theme="light"`;
* `data-bs-theme="dark"` or `data-bs-theme="light"`;
* `data-color-scheme="dark"` or `data-color-scheme="light"`;
* `data-md-color-scheme="slate"` for Material for MkDocs.

Explicit configuration is still recommended when you know exactly how your site stores its theme.

## 8. Default theme

Use `fallbackTheme` when no theme can be detected from the DOM.

```js
window.TikzJaxOptions = {
    theme: {
        fallbackTheme: "light"
    }
};
```

You can also use dark mode as fallback:

```js
window.TikzJaxOptions = {
    theme: {
        fallbackTheme: "dark"
    }
};
```

`defaultTheme` can also be used as an alias for the default theme:

```js
window.TikzJaxOptions = {
    theme: {
        defaultTheme: "light"
    }
};
```

## 9. Follow the system theme

Use `followSystemTheme` to fall back to the browser or operating system preference.

```js
window.TikzJaxOptions = {
    theme: {
        followSystemTheme: true,
        fallbackTheme: "light"
    }
};
```

If no theme is detected in the DOM, TikZJax uses `prefers-color-scheme`.

## 10. Dynamic theme changes

TikZJax observes theme changes and updates already-rendered SVGs when the detected theme changes.

This is useful with Material for MkDocs, where the user can switch between light and dark mode without reloading the page.

TikZJax watches:

* `html`;
* `body`;
* the element matched by `theme.selector`, when configured.

## 11. Colored figures

For highly colored figures, define colors explicitly in the TikZ code.

Example:

```latex
\begin{tikzpicture}
    \draw[very thick, blue] (0,0) -- (4,0);
    \draw[very thick, red] (0,0) -- (0,3);
    \node at (2,1.5) {Explicit colors};
\end{tikzpicture}
```

This gives you full control, but the colors may not be ideal in both themes.

For important diagrams, you may prefer to provide two separate versions:

```html
<div class="only-light">
    <script type="text/tikz">
    \begin{tikzpicture}
        % Light theme version
    \end{tikzpicture}
    </script>
</div>

<div class="only-dark">
    <script type="text/tikz">
    \begin{tikzpicture}
        % Dark theme version
    \end{tikzpicture}
    </script>
</div>
```

Then control visibility with your own CSS:

```css
html[data-theme="light"] .only-dark,
html[data-theme="dark"] .only-light {
    display: none;
}
```

Adapt the selectors to your own theme system.

## 12. Recommended configurations

For most MkDocs Material sites, this is enough:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default",
        fallbackTheme: "light",
        followSystemTheme: true
    }
};
```

For most custom sites, use an attribute-based setup:

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

For class-based themes:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        darkClass: "dark",
        lightClass: "light",
        fallbackTheme: "light",
        followSystemTheme: true
    }
};
```

## 13. Troubleshooting

### The SVG stays black in dark mode

Check that TikZJax can detect the current theme.

Open DevTools and inspect `html` or `body`. Look for attributes or classes such as:

```html
<body data-md-color-scheme="slate">
```

or:

```html
<html data-theme="dark">
```

Then configure:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default",
        fallbackTheme: "light"
    }
};
```

Adapt `selector`, `attribute`, `darkValue`, and `lightValue` to your site.

### Explicit colors do not change

This is expected. TikZJax does not rewrite every custom color.

Use colors that work in both themes, or provide separate light and dark versions.

### Theme changes only after page reload

Check that the theme attribute or class really changes on `html`, `body`, or the configured `theme.selector`.

If your site stores the theme somewhere else, configure `theme.selector` accordingly.

### The theme is detected incorrectly

Set an explicit configuration instead of relying on automatic detection.

Example:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "html",
        attribute: "data-theme",
        darkValue: "dark",
        lightValue: "light",
        fallbackTheme: "light"
    }
};
```
