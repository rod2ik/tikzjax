# Light and Dark Themes

TikZJax can adapt generated SVG diagrams to the active light or dark theme.

The main goal is to keep standard mathematical drawings readable when the page background changes.

For example, a diagram using TikZ's default black strokes and text can follow the site's foreground color instead of remaining black in dark mode.

For standalone HTML pages, TikZJax can also apply a configured light or dark background and text color directly to one or more selected page containers. This target styling is optional and disabled by default.

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
* a light or dark foreground color applied to the generated wrapper;
* optional background and text colors applied to configured standalone targets.

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
    +--> optional configured-target styling
    |
    +--> wrapper and SVG adaptation
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
* modify externally embedded raster images;
* restyle arbitrary buttons, code blocks, borders, warnings, or other page components outside the configured target.

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

| Option                               | Default        | Purpose |
| ------------------------------------ | -------------- | ------- |
| `theme.selector`                     | none           | CSS selector identifying one or more elements containing the theme state |
| `theme.attribute`                    | `"data-theme"` | Attribute holding the current theme |
| `theme.darkValue`                    | `"dark"`       | Attribute value representing dark mode |
| `theme.lightValue`                   | `"light"`      | Attribute value representing light mode |
| `theme.darkClass`                    | `"dark"`       | CSS class representing dark mode |
| `theme.lightClass`                   | `"light"`      | CSS class representing light mode |
| `theme.fallbackTheme`                | `"light"`      | Theme used when no DOM state is detected |
| `theme.defaultTheme`                 | none           | Legacy-compatible default-theme alias |
| `theme.followSystemTheme`            | `false`        | Use `prefers-color-scheme` as a fallback |
| `theme.applyTargetStyles`            | `false`        | Apply the resolved palette to elements matching `theme.selector` |
| `theme.lightBackgroundColor`         | `"#ffffff"`    | Background color used by the light palette |
| `theme.lightTextColor`               | `"#000000"`    | Text and default TikZ foreground color used by the light palette |
| `theme.darkBackgroundColor`          | `"#1b1e2b"`    | Background color used by the dark palette |
| `theme.darkTextColor`                | `"#ffffff"`    | Text and default TikZ foreground color used by the dark palette |

---

## CSS selector semantics

`theme.selector` is interpreted as a normal CSS selector and is passed to `document.querySelectorAll()`.

It can therefore be a simple class:

```js
selector: ".app"
```

or a more specific selector:

```js
selector: "div.tikzjax"
```

More complex valid selectors are also accepted:

```js
selector: "main > section.diagram-zone"
```

Every matching element is considered a configured theme target.

A wrapper uses the matching target that contains it. This allows several independent themed regions on the same page.

An invalid selector does not stop TikZJax. It produces a warning in the browser Console and no configured target is returned.

---

## Standalone HTML target styling

### Opt-in behavior

Target styling is deliberately disabled by default:

```js
theme: {
    applyTargetStyles: false
}
```

With the default value, `theme.selector` is used for theme detection only. TikZJax does not impose a background or text color on the selected page element.

Enable automatic target styling explicitly for a standalone HTML page:

```js
window.TikzJaxOptions = {
    theme: {
        selector: ".app",
        applyTargetStyles: true,

        lightBackgroundColor: "#ffffff",
        lightTextColor: "#000000",

        darkBackgroundColor: "#1b1e2b",
        darkTextColor: "#ffffff",

        darkClass: "dark",
        lightClass: "light",

        attribute: "data-theme",
        darkValue: "dark",
        lightValue: "light"
    }
};
```

The four color options may be omitted when the built-in values are suitable.

---

### Complete standalone loading order

Define `window.TikzJaxOptions` before loading `tikzjax.min.js`.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script>
window.TikzJaxOptions = {
    theme: {
        selector: ".app",
        applyTargetStyles: true,

        lightBackgroundColor: "#ffffff",
        lightTextColor: "#000000",

        darkBackgroundColor: "#1b1e2b",
        darkTextColor: "#ffffff",

        darkClass: "dark",
        lightClass: "light",

        attribute: "data-theme",
        darkValue: "dark",
        lightValue: "light"
    }
};
</script>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

The selected target then needs only layout-specific CSS:

```css
.app {
    padding: 2rem;
    border: 1px solid #888;
    border-radius: 1rem;
    transition:
        background-color 0.2s,
        color 0.2s;
}
```

Separate `.app.light` and `.app.dark` background and text rules are not required when `applyTargetStyles` is enabled.

---

### Styles applied to each target

For the active palette, TikZJax writes these inline properties on every element matching `theme.selector`:

```css
background-color: <resolved background color>;
color: <resolved text color>;
```

It also publishes these CSS custom properties:

```css
--tikzjax-theme-background-color
--tikzjax-theme-text-color
--tikzjax-background-color
```

`--tikzjax-background-color` is also used internally by generated SVG content, including masking strokes in packages such as `tkz-tab`.

The custom properties are inherited by descendants and can be reused by page-specific CSS:

```css
.custom-panel {
    color:
        var(
            --tikzjax-theme-text-color
        );

    border-color:
        var(
            --tikzjax-theme-text-color
        );
}
```

TikZJax does not automatically add or recolor borders. A border changes automatically only when the page CSS uses `currentColor` or one of the published variables.

Because the target styles are normal inline declarations without `!important`, an author rule using `!important` can override them.

---

### Styling scope

Only elements matching `theme.selector` receive target styles.

For example:

```html
<pre id="page-html-output"></pre>

<div class="app" data-theme="dark">
    <!-- TikZJax diagrams -->
</div>
```

with:

```js
theme: {
    selector: ".app",
    applyTargetStyles: true
}
```

does not style `#page-html-output`, because that element is outside `.app`.

Keep component-specific styling in the page's own CSS, or move a component inside the selected target when it should inherit the target palette.

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
        applyTargetStyles: false,
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

`applyTargetStyles` is `false` by default. Therefore, adding the new palette options does not make TikZJax restyle the Material page, and Material remains responsible for its own page background, text, navigation, code blocks, tables, cards, and admonitions.

The palette colors still provide TikZJax's own wrapper foreground colors and fallback background colors. Customizing them can therefore change diagram foreground behavior without applying page-level styles.

To style a region inside a Material site deliberately, use a dedicated container instead of the complete Material page:

```html
<div class="custom-tikz-zone">
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) circle (1);
    \end{tikzpicture}
    </script>
</div>
```

```js
window.TikzJaxOptions = {
    theme: {
        selector: ".custom-tikz-zone",
        applyTargetStyles: true,

        lightBackgroundColor: "#ffffff",
        lightTextColor: "#000000",

        darkBackgroundColor: "#1b1e2b",
        darkTextColor: "#ffffff"
    }
};
```

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

For a live application theme toggle, update a class or attribute that TikZJax observes. `followSystemTheme` supplies a fallback; it does not replace an application's own DOM theme state.

---

## Dynamic theme changes

TikZJax observes relevant page-level theme changes.

When the detected theme changes, already inserted SVG diagrams are updated without another TeX compilation.

When `applyTargetStyles` is enabled, the matching target colors and published CSS variables are updated during the same theme application.

```text
theme switch
    |
    v
attribute or class changes
    |
    v
TikZJax detects the new theme
    |
    +--> update configured target styles
    |
    +--> adapt existing SVGs
```

This supports theme switches performed without a full page reload.

Typical examples include:

* Material for MkDocs palette toggles;
* custom JavaScript theme controls;
* class changes on `html` or `body`;
* attribute changes such as `data-theme`.

`followSystemTheme` is used as a fallback whenever TikZJax resolves the active theme. An operating-system preference change by itself is not a substitute for changing the configured DOM class or attribute when a page provides its own theme switcher.

---

### Observed elements

TikZJax can observe:

* `html`;
* `body`;
* elements matching `theme.selector`;
* the configured theme attribute;
* relevant class changes.

The configured selector should identify the element or elements that actually store the relevant theme state.

The selector may match several independent targets. Each target can carry its own configured class or attribute, and wrappers contained by that target use its detected theme.

When `applyTargetStyles` is enabled, avoid a selector that is broader than intended because every matching element receives inline background and text colors.

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

### Standalone HTML page with automatic target colors

```js
window.TikzJaxOptions = {
    theme: {
        selector: ".app",
        applyTargetStyles: true,

        lightBackgroundColor: "#ffffff",
        lightTextColor: "#000000",

        darkBackgroundColor: "#1b1e2b",
        darkTextColor: "#ffffff",

        darkClass: "dark",
        lightClass: "light",

        attribute: "data-theme",
        darkValue: "dark",
        lightValue: "light"
    }
};
```

---

### Material for MkDocs

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        applyTargetStyles: false,
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default",
        fallbackTheme: "light",
        followSystemTheme: true
    }
};
```

`applyTargetStyles: false` is optional because it is the built-in default. It is shown here to make the Material compatibility behavior explicit.

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

### The configured standalone target does not change color

Verify that target styling is enabled:

```js
window.TikzJaxOptions = {
    theme: {
        selector: ".app",
        applyTargetStyles: true
    }
};
```

Then verify that:

* `theme.selector` matches the intended element;
* the matching element carries the configured class or attribute;
* the options are defined before `tikzjax.min.js` loads;
* no author declaration using `!important` overrides `background-color` or `color`.

In the browser Console:

```js
document.querySelectorAll(
    window.TikzJaxOptions.theme.selector
);
```

Inspect the resolved target variables:

```js
getComputedStyle(
    document.querySelector(".app")
).getPropertyValue(
    "--tikzjax-theme-background-color"
);
```

---

### Target styling affects too much of the page

`applyTargetStyles` applies background and text colors to every element matched by `theme.selector`.

Use a narrower selector:

```js
theme: {
    selector: ".custom-tikz-zone",
    applyTargetStyles: true
}
```

Do not target `body`, `html`, or a complete framework content root unless TikZJax is intentionally expected to style that whole area.

For MkDocs Material, keep `applyTargetStyles: false` or target a dedicated custom container.

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
