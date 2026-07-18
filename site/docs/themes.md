# Light and Dark Themes

TikZJax can adapt generated SVG diagrams to the active light or dark theme.

The main goal is to keep standard mathematical drawings readable when the page background changes.

For example, a diagram using TikZ's default black strokes and text can follow the site's foreground color instead of remaining black in dark mode.

For the complete option reference, see the [API Reference](api-reference.md).

---

## How theme adaptation works

TeX compilation produces SVG markup.

After the SVG is inserted into the page, TikZJax inspects common generated colors and adapts values that represent ordinary foreground or background content.

Typical transformations include:

* black fills changed to `currentColor`;
* black strokes changed to `currentColor`;
* text-like elements changed to `currentColor`;
* selected white backgrounds made transparent;
* a light or dark foreground color applied to the generated wrapper.

Conceptually:

```text
TeX source
    |
    v
SVG generation
    |
    v
SVG insertion
    |
    v
theme detection
    |
    v
foreground and background adaptation
```

Theme adaptation happens after TeX rendering.

Changing the site theme does not require recompiling the diagram.

---

## Suitable diagrams

Automatic adaptation works best for:

* mathematical figures;
* axes and coordinate systems;
* labels and annotations;
* geometric constructions;
* graphs using default strokes;
* variation tables;
* sign tables;
* mostly monochrome diagrams.

Example:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw[->,very thick]
        (0,0) -- (4,0)
        node[right] {$x$};

    \draw[->,very thick]
        (0,0) -- (0,3)
        node[above] {$y$};

    \draw[very thick]
        (0,0) -- (3,2);
\end{tikzpicture}
</script>
```

The default lines and labels can follow the page's active foreground color.

---

## What TikZJax does not do

TikZJax does not redesign a fully colored illustration.

It does not attempt to:

* calculate new palettes for every theme;
* change every explicit TikZ color;
* guarantee contrast for arbitrary custom colors;
* convert a light-themed illustration into a complete dark-themed variant;
* modify externally embedded raster images.

Explicit colors are normally preserved.

For example:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw[very thick,blue]
        (0,0) -- (4,0);

    \draw[very thick,red]
        (0,0) -- (0,3);

    \node[text=green!60!black]
        at (2,1.5) {
            Explicit colors
        };
\end{tikzpicture}
</script>
```

The blue, red, and green values remain intentional diagram colors.

Choose explicit colors that provide sufficient contrast in every supported theme.

---

## Configuration

Theme configuration belongs in the global TikZJax options:

```js
window.TikzJaxOptions = {
    theme: {
        fallbackTheme: "light"
    }
};
```

When using a separate configuration file, load it before TikZJax:

```html
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Theme detection is a global runtime concern.

It is not configured separately for each diagram.

---

### Theme-option summary

| Option                    | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `theme.selector`          | Element or elements containing the theme state |
| `theme.attribute`         | Attribute holding the current theme            |
| `theme.darkValue`         | Attribute value representing dark mode         |
| `theme.lightValue`        | Attribute value representing light mode        |
| `theme.darkClass`         | CSS class representing dark mode               |
| `theme.lightClass`        | CSS class representing light mode              |
| `theme.fallbackTheme`     | Theme used when no DOM state is detected       |
| `theme.defaultTheme`      | Legacy-compatible default-theme alias          |
| `theme.followSystemTheme` | Use `prefers-color-scheme` as a fallback       |

---

## Material for MkDocs

Material for MkDocs commonly stores the active palette in:

```text
data-md-color-scheme
```

Common values are:

```text
default
slate
```

A typical explicit configuration is:

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

A corresponding Material palette can be configured with:

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

TikZJax can normally recognize common Material conventions automatically.

Explicit configuration is useful when:

* the site uses a customized Material template;
* the theme state is stored on another element;
* custom scheme names are used;
* automatic detection produces an ambiguous result.

---

## Attribute-based themes

Use attribute-based detection when the site stores the active theme in an HTML attribute.

Example HTML:

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

---

### Bootstrap-style theme attribute

Example:

```html
<html data-bs-theme="dark">
```

Configuration:

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

---

### Custom attribute values

The attribute values do not have to be named `light` and `dark`.

Example HTML:

```html
<body data-color-mode="night">
```

Configuration:

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        attribute: "data-color-mode",
        darkValue: "night",
        lightValue: "day",
        fallbackTheme: "light"
    }
};
```

The configured values must exactly match the values present in the final HTML.

---

## Class-based themes

Use class detection when the active theme is represented by a CSS class.

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

```html
<html class="theme-dark">
```

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

---

## Automatic detection

Without an explicit selector, TikZJax can recognize common theme conventions.

Typical examples include:

```text
data-theme="dark"
data-theme="light"

data-bs-theme="dark"
data-bs-theme="light"

data-color-scheme="dark"
data-color-scheme="light"

data-md-color-scheme="slate"
data-md-color-scheme="default"
```

TikZJax can inspect common page-level elements such as:

```text
html
body
```

Explicit configuration remains preferable when the site's theme mechanism is known.

It prevents unrelated theme-like attributes elsewhere in the document from creating ambiguity.

---

## Fallback theme

Use `fallbackTheme` when no usable theme state can be detected:

```js
window.TikzJaxOptions = {
    theme: {
        fallbackTheme: "light"
    }
};
```

Dark fallback:

```js
window.TikzJaxOptions = {
    theme: {
        fallbackTheme: "dark"
    }
};
```

Accepted values are:

```text
light
dark
```

An invalid value is ignored in favor of another available theme source or the built-in default.

---

### `defaultTheme`

`defaultTheme` is supported as a compatibility alias:

```js
window.TikzJaxOptions = {
    theme: {
        defaultTheme: "light"
    }
};
```

Prefer `fallbackTheme` for new configuration.

When both are present, `fallbackTheme` should be treated as the explicit current configuration.

---

## System theme

Enable system-theme fallback with:

```js
window.TikzJaxOptions = {
    theme: {
        followSystemTheme: true
    }
};
```

TikZJax can then inspect:

```css
(prefers-color-scheme: dark)
```

This is useful when:

* the site has no manual theme switcher;
* no theme attribute or class is available;
* the site's default should follow the operating-system preference.

A typical configuration is:

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

The explicit DOM theme remains the preferred signal when it is available.

---

## Dynamic theme changes

TikZJax observes relevant page-level theme changes.

When the detected theme changes, already inserted SVG diagrams are updated without another TeX compilation.

```text
theme switch
    |
    v
attribute or class changes
    |
    v
TikZJax detects the new theme
    |
    v
existing SVGs are adapted
```

This supports theme switches performed without a full page reload.

Typical examples include:

* Material for MkDocs palette toggles;
* custom JavaScript theme controls;
* class changes on `html` or `body`;
* attribute changes such as `data-theme`;
* operating-system theme changes when system following is enabled.

---

### Observed elements

TikZJax can observe:

* `html`;
* `body`;
* elements matching `theme.selector`;
* the configured theme attribute;
* relevant class changes.

The configured selector should identify the element that actually stores the site's active theme.

Avoid selecting a decorative child element whose state does not represent the complete page.

---

## Parallel rendering

Diagrams can finish in a different order when the worker pool is enabled.

Theme adaptation is applied independently whenever each SVG is inserted:

```text
worker 1 finishes diagram A
    |
    v
insert A and apply current theme

worker 2 finishes diagram B
    |
    v
insert B and apply current theme
```

A later theme switch updates both diagrams.

Parallel rendering therefore does not require any special theme configuration.

See [Parallel Rendering and the Worker Pool](parallel-rendering.md).

---

## Cached SVGs

A diagram restored from the persistent SVG cache is also inserted into the current page and adapted to the current theme.

```text
persistent SVG cache hit
    |
    v
insert cached SVG
    |
    v
apply active theme
```

The page does not need to recompile TeX merely because the current theme differs from the theme used during an earlier visit.

See [Cache and Performance](cache-performance.md).

---

## Dynamic content

A diagram inserted after the initial page load follows the same theme process.

```text
new source detected
    |
    v
render or restore SVG
    |
    v
insert SVG
    |
    v
apply current theme
```

This includes diagrams appearing through:

* client-side navigation;
* Material content tabs;
* collapsible elements;
* dynamically inserted HTML;
* delayed Markdown rendering.

---

## Explicit colors

### Colors intended to remain fixed

Use explicit TikZ colors when a stroke or fill must retain its chosen color:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw[red,very thick]
        (0,0) -- (3,0);

    \fill[blue]
        (1.5,1) circle (5pt);
\end{tikzpicture}
</script>
```

TikZJax normally preserves these colors.

---

### Colors that should follow the page

Use default TikZ foreground colors when the element should adapt automatically:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw[very thick]
        (0,0) -- (3,0);

    \node at (1.5,0.5) {
        Adaptive label
    };
\end{tikzpicture}
</script>
```

The default line and label can be converted to `currentColor`.

---

### Avoid forcing black unnecessarily

This explicitly black line may remain intentionally black:

```latex
\draw[black,very thick] (0,0) -- (3,0);
```

When the line should follow the theme, prefer:

```latex
\draw[very thick] (0,0) -- (3,0);
```

The same principle applies to text and fills.

---

## Separate light and dark diagrams

For illustrations whose palettes cannot be adapted automatically, provide two source versions.

```html
<div class="only-light">
    <script type="text/tikz">
    \begin{tikzpicture}
        % Light-theme version
    \end{tikzpicture}
    </script>
</div>

<div class="only-dark">
    <script type="text/tikz">
    \begin{tikzpicture}
        % Dark-theme version
    \end{tikzpicture}
    </script>
</div>
```

Attribute-based visibility:

```css
html[data-theme="light"] .only-dark,
html[data-theme="dark"] .only-light {
    display: none;
}
```

Material for MkDocs example:

```css
body[data-md-color-scheme="default"] .only-dark,
body[data-md-color-scheme="slate"] .only-light {
    display: none;
}
```

Adapt the selectors and values to the site's actual theme state.

!!! note

    Both source blocks may still be discovered and rendered even when one container is hidden.

    When rendering both versions is undesirable, insert only the active version dynamically or use a site-specific content strategy.

---

## Recommended configurations

### Material for MkDocs

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

---

### Custom attribute-based site

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

---

### Class-based site

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        darkClass: "theme-dark",
        lightClass: "theme-light",
        fallbackTheme: "light",
        followSystemTheme: true
    }
};
```

---

### System-only site

```js
window.TikzJaxOptions = {
    theme: {
        followSystemTheme: true
    }
};
```

---

## Troubleshooting

### The diagram remains black in dark mode

Inspect the final page HTML.

Look for the element that stores the current theme:

```html
<body data-md-color-scheme="slate">
```

or:

```html
<html data-theme="dark">
```

Then configure the matching selector and attribute:

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

Also verify that the affected line or text does not explicitly force a custom black color.

---

### Theme changes only after a page reload

Check that the actual attribute or class changes when the theme toggle is activated.

In the browser Console:

```js
document.documentElement.getAttribute(
    "data-theme"
);
```

Material example:

```js
document.body.getAttribute(
    "data-md-color-scheme"
);
```

If the theme is stored on another element, update `theme.selector`.

Also check the Console for a JavaScript error that may have stopped the theme observer.

---

### The wrong theme is detected

Use explicit configuration instead of automatic detection:

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

Verify that:

* the selector matches the intended element;
* the attribute name is exact;
* the dark and light values are exact;
* the configuration loads before TikZJax.

---

### Explicit colors do not change

This is expected.

TikZJax preserves intentionally selected colors rather than replacing the entire diagram palette.

Use:

* colors that work in both themes;
* CSS variables where supported by the surrounding design;
* separate light and dark versions for critical illustrations.

---

### A white rectangle remains visible in dark mode

The rectangle may use an explicit fill that TikZJax does not classify as a default background.

Inspect the generated SVG and the original TikZ source.

Consider:

* removing the explicit white fill;
* using no fill;
* choosing a theme-compatible fill;
* providing separate diagram versions.

---

### A cached diagram uses the wrong theme

A cached SVG is adapted after insertion.

A stale theme usually indicates a detection or observer problem rather than a need to clear the TeX cache.

Verify:

* the active theme value;
* the configured selector;
* the theme observer;
* custom CSS overriding the SVG wrapper.

Clearing IndexedDB should not normally be required merely for a theme change.

---

### Only newly rendered diagrams change theme

Check whether older SVGs were:

* moved outside their TikZJax wrappers;
* replaced by application code;
* inserted into another document or iframe;
* modified so their adaptive color markers were lost;
* overridden by stronger custom CSS.

Theme updates operate on TikZJax-managed SVG output in the active document.

---

### The theme configuration is ignored

Confirm the loading order:

```html
<script src="tikzjax.config.js"></script>
<script src="tikzjax.min.js"></script>
```

Inspect the active options:

```js
window.TikzJaxOptions?.theme
```

If the theme configuration is added after TikZJax has loaded, apply it explicitly:

```js
window.TikzJaxConfigure({
    theme: {
        selector: "html",
        attribute: "data-theme",
        darkValue: "dark",
        lightValue: "light"
    }
});
```

---

## Related documentation

* [Configuration](configuration.md)
* [Global and Local Configuration](configuration-scopes.md)
* [Parallel Rendering and the Worker Pool](parallel-rendering.md)
* [Cache and Performance](cache-performance.md)
* [MkDocs Installation](installation/mkdocs.md)
* [API Reference](api-reference.md)
* [Runtime Architecture](architecture.md)
* [Troubleshooting](troubleshooting.md)
