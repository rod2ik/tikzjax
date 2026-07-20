# Light and Dark Themes

TikZJax adapts generated SVG diagrams to the active light or dark theme.

The main goal is to preserve readability without recompiling TeX when the page palette changes.

The theme system handles three complementary cases:

* TikZ's ordinary black and white output follows the page foreground and background conventions;
* very light SVG fills can be converted into darker fills in dark mode;
* explicit colors such as blue, red, or green can be transformed into vivid, lighter variants of the same perceived color family.

For example, a dark blue used in Light mode can become a sky-blue variant in Dark mode, while the original dark blue is restored exactly when the page returns to Light mode.

TikZJax can also verify the contrast between a light foreground and a detected filled shape. The foreground may be SVG text, a bright outline on the same shape, or a small light-neutral vector detail painted over a larger filled shape. When the contrast is too low in Dark mode, the background fill can be darkened automatically.

For standalone HTML pages, TikZJax may additionally apply configured light or dark background and text colors directly to selected page containers. This target styling is optional and disabled by default.

For the complete option reference, see the [API Reference](api-reference.md).

---

## How theme adaptation works

TeX compilation produces SVG markup.

After the SVG is inserted into the page, TikZJax detects the active theme and applies several independent transformations.

Typical transformations include:

* black fills and strokes changed to `currentColor`;
* ordinary black or white mathematical text changed to the active foreground color;
* selected white backgrounds made transparent;
* very light non-text fills converted into darker dark-mode fills;
* explicit chromatic colors converted into brighter, vivid variants in Dark mode;
* automatic darkening of a detected filled background when its contrast with foreground text, a bright outline, or a light-neutral vector detail is too low;
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
    +--> black/white normalization
    |
    +--> light-fill adaptation
    |
    +--> explicit-color adaptation
    |
    +--> foreground/background contrast correction
```

Theme adaptation happens after TeX rendering.

Changing the site theme does not require recompiling the diagram. TikZJax recomputes the dark-mode transformations from stored original SVG colors, so repeated Light → Dark → Light switches do not accumulate color changes.

The Light mode output restores the original chromatic SVG colors after the existing black/white normalization.

---

## Suitable diagrams

Automatic adaptation works well for:

* mathematical figures;
* axes and coordinate systems;
* labels and annotations;
* geometric constructions;
* graphs using default strokes;
* graphs using explicit blue, red, green, orange, or similar colors;
* variation tables;
* sign tables;
* diagrams containing colored text on filled shapes;
* diagrams containing bright outlines or small light-neutral vector details on filled shapes;
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

    \draw[very thick,blue]
        (0,0) -- (3,2);

    \node[text=blue]
        at (2.2,1.8) {
            Blue curve
        };
\end{tikzpicture}
</script>
```

The default axes and labels follow the page foreground color.

The explicit blue line and label keep their original blue in Light mode and receive a brighter blue-family color in Dark mode.

---

## What TikZJax does not do

TikZJax performs automatic color adaptation, but it does not redesign an illustration semantically.

It does not attempt to:

* infer the meaning of each color;
* create a complete hand-designed palette for every theme;
* preserve exact brand or scientific reference colors in Dark mode while adaptation is enabled;
* guarantee contrast for every possible SVG composition;
* recolor gradients, patterns, paint servers, CSS variables, or raster images;
* understand every clipping, masking, filtering, or overlapping-shape arrangement;
* restyle arbitrary buttons, code blocks, borders, warnings, or other page components outside a configured target.

The contrast correction is intentionally conservative. It handles common filled SVG shapes in three frequent situations: text painted over a filled shape, a bright outline belonging to the same filled shape, and a small light-neutral vector detail painted over a larger filled shape. It darkens only the detected background fill and does not recolor the foreground during this stage.

Complex illustrations may still require:

* custom tuning;
* colors chosen specifically for both themes;
* separate Light and Dark source versions.

---

## Configuration

Theme configuration belongs in the global TikZJax options:

```js
window.TikzJaxOptions = {
    theme: {
        fallbackTheme: "light",

        adaptiveColors: {
            enabled: true,
            strength: 1
        }
    }
};
```

`adaptiveColors` is enabled by default, so the explicit block above is optional.

When using a separate configuration file, load it before TikZJax:

```html
<script src="tikzjax.config.js"></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/fonts.min.css"
>

<script src="https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/tikzjax.min.js"></script>
```

Theme detection and SVG color adaptation are global runtime concerns.

They are not configured separately for each diagram.

---

### Theme-option summary

#### Theme detection and standalone target styling

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

#### Explicit-color adaptation

| Option                                            | Default | Purpose |
| ------------------------------------------------- | ------- | ------- |
| `theme.adaptiveColors`                            | object  | Dark-mode explicit-color configuration; may also be set directly to `true` or `false` |
| `theme.adaptiveColors.enabled`                    | `true`  | Enable explicit-color adaptation and its contrast stage |
| `theme.adaptiveColors.strength`                   | `1`     | Blend between the original color (`0`) and the fully adapted color (`1`) |
| `theme.adaptiveColors.minimumPerceptualLightness` | `0.60`  | Minimum target perceptual lightness for adapted dark or medium colors |
| `theme.adaptiveColors.maximumPerceptualLightness` | `0.82`  | Maximum target perceptual lightness, preventing washed-out pastel results |
| `theme.adaptiveColors.saturationBoost`            | `0.18`  | Increase applied to chromatic saturation |
| `theme.adaptiveColors.minimumSaturation`          | `0.52`  | Minimum saturation used for adapted chromatic colors |
| `theme.adaptiveColors.maximumSaturation`          | `0.90`  | Maximum saturation used for adapted chromatic colors |
| `theme.adaptiveColors.chromaticThreshold`         | `0.08`  | Saturation below which a color is treated as approximately neutral |
| `theme.adaptiveColors.hueShift.red`               | `0`     | Hue rotation, in degrees, around the red family |
| `theme.adaptiveColors.hueShift.green`             | `0`     | Hue rotation, in degrees, around the green family |
| `theme.adaptiveColors.hueShift.blue`              | `-40`   | Hue rotation, in degrees, around the blue family |
| `theme.adaptiveColors.hueShiftRange`              | `60`    | Angular influence range of each red, green, or blue family |
| `theme.adaptiveColors.hueShiftStrength`           | `1`     | Global multiplier for all configured hue shifts |

#### Foreground/background contrast correction

| Option                                                     | Default | Purpose |
| ---------------------------------------------------------- | ------- | ------- |
| `theme.adaptiveColors.contrast.enabled`                    | `true`  | Enable dark-mode foreground/background contrast correction |
| `theme.adaptiveColors.contrast.minimumRatio`               | `4.5`   | Minimum requested luminance contrast ratio |
| `theme.adaptiveColors.contrast.strength`                   | `1`     | Blend between the current fill and the required darker fill |
| `theme.adaptiveColors.contrast.minimumBackgroundLightness` | `0.04`  | Lowest HSL lightness allowed while darkening a background |
| `theme.adaptiveColors.contrast.containmentTolerance`       | `1`     | Screen-space tolerance used when associating separate text or vector details with a containing shape |

#### Very-light fill adaptation

| Option                                   | Default | Purpose |
| ---------------------------------------- | ------- | ------- |
| `theme.adaptiveFills.enabled`            | `true`  | Convert very light non-text fills into dark-mode fills |
| `theme.adaptiveFills.lightnessThreshold` | `0.82`  | Minimum HSL lightness at which a fill is considered very light |
| `theme.adaptiveFills.darkLightness`      | `0.23`  | Target HSL lightness for converted light fills |
| `theme.adaptiveFills.minimumSaturation`  | `0.18`  | Minimum saturation for converted chromatic fills |
| `theme.adaptiveFills.maximumSaturation`  | `0.46`  | Maximum saturation for converted chromatic fills |

---

## Adaptive explicit colors in Dark mode

### Enabled by default

Explicit-color adaptation is active without any configuration:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            enabled: true
        }
    }
};
```

The following shorter form is equivalent:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: true
    }
};
```

To disable the complete explicit-color and contrast feature:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: false
    }
};
```

or:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            enabled: false
        }
    }
};
```

Disabling `adaptiveColors` does not disable the older `adaptiveFills` stage. Very light non-text fills may still be converted unless `theme.adaptiveFills.enabled` is also set to `false`.

---

### Light mode is never recolored

In Light mode, TikZJax restores the original chromatic SVG values stored after the existing black/white normalization.

This applies to adapted:

* `fill`;
* `stroke`;
* `color`;
* text colors;
* shape colors;
* colors restored after an automatic contrast correction.

For example:

```latex
\draw[blue,very thick] (0,0) -- (3,0);
```

keeps the exact generated blue in Light mode.

The transformation is recomputed from that stored original value each time Dark mode is activated.

---

### Perceptual-lightness inversion

TikZJax does not use a literal RGB negative.

A literal negative would change the color family:

```text
blue  -> yellow
red   -> cyan
green -> magenta
```

Instead, TikZJax preserves the perceived family and reflects dark colors towards a lighter perceptual luminance:

```text
dark blue  -> vivid light blue
dark red   -> vivid light red
dark green -> vivid light green
```

Already bright colors are not deliberately darkened by this stage.

The default lightness bounds are:

```js
adaptiveColors: {
    minimumPerceptualLightness: 0.60,
    maximumPerceptualLightness: 0.82
}
```

Increase `minimumPerceptualLightness` when medium colors remain too dark:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            minimumPerceptualLightness: 0.68
        }
    }
};
```

Reduce `maximumPerceptualLightness` when the result looks too pale:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            maximumPerceptualLightness: 0.76
        }
    }
};
```

---

### Adaptation strength

`strength` controls the interpolation between the original and adapted explicit color:

```text
0     original explicit color
0.5   partial adaptation
1     full adaptation
```

Example:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            strength: 0.75
        }
    }
};
```

!!! note

    `adaptiveColors.strength` controls explicit-color adaptation.

    The contrast correction has its own independent `adaptiveColors.contrast.strength` option. Therefore, setting only `adaptiveColors.strength: 0` does not disable contrast correction.

---

### Vivid saturation

TikZJax boosts chromatic saturation so that adapted colors remain vivid on a dark page.

The defaults are:

```js
adaptiveColors: {
    saturationBoost: 0.18,
    minimumSaturation: 0.52,
    maximumSaturation: 0.90,
    chromaticThreshold: 0.08
}
```

A stronger, more vivid result can use:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            saturationBoost: 0.28,
            minimumSaturation: 0.60,
            maximumSaturation: 0.96
        }
    }
};
```

A softer result can use:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            saturationBoost: 0.08,
            minimumSaturation: 0.42,
            maximumSaturation: 0.78
        }
    }
};
```

Colors whose saturation is below `chromaticThreshold` are treated as approximately neutral. Their hue is not shifted and their saturation is not forced into the chromatic minimum range.

---

### Hue-family tuning

Hue shifts are applied gradually around the red, green, and blue families.

The built-in configuration is:

```js
adaptiveColors: {
    hueShift: {
        red: 0,
        green: 0,
        blue: -40
    },
    hueShiftRange: 60,
    hueShiftStrength: 1
}
```

The blue shift is intentionally negative. In HSL hue space, pure blue is near `240°`; moving it approximately `-40°` places it near `200°`, producing a more sky-blue result instead of a violet-looking light blue.

A less cyan blue:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            hueShift: {
                blue: -25
            }
        }
    }
};
```

A more cyan or sky-blue result:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            hueShift: {
                blue: -50
            }
        }
    }
};
```

Red and green families can be tuned independently:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            hueShift: {
                red: 4,
                green: -8,
                blue: -40
            }
        }
    }
};
```

`hueShiftRange` controls how far around each primary family the influence extends.

`hueShiftStrength` scales all family shifts without changing their individual values:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            hueShiftStrength: 0.65
        }
    }
};
```

---

### Values intentionally excluded

The explicit-color transformation does not replace:

* pure black;
* pure white;
* `currentColor`;
* `none`;
* transparent values;
* `var(...)` paint values;
* `url(...)` paint servers such as gradients and patterns.

Black and white continue to use TikZJax's existing foreground/background normalization.

---

## Automatic foreground/background contrast

### Default behavior

Contrast correction is enabled by default together with `adaptiveColors`:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            contrast: {
                enabled: true,
                minimumRatio: 4.5
            }
        }
    }
};
```

No additional configuration option is required for the expanded foreground detection.

In Dark mode, TikZJax evaluates three common foreground/background arrangements:

1. an SVG `<text>` element painted over a previously painted filled shape;
2. a bright neutral `stroke` belonging to the same element as its background `fill`;
3. a small bright-neutral vector shape painted over a larger previously painted filled shape.

The third case covers light paths, circles, marks, and similar vector details that visually play the same role as text. The heuristic deliberately ignores chromatic accents, such as a red target point, so that a colored marker does not unnecessarily force the complete background towards black.

For each supported case, TikZJax:

1. resolves the visible foreground and background colors;
2. accounts for fill opacity, stroke opacity, element opacity, and the page background;
3. computes the relative-luminance contrast ratio;
4. darkens the detected background fill when the ratio is below `minimumRatio`.

The foreground color, stroke, text, or vector detail is not replaced by the contrast stage.

The background hue and saturation are preserved while its fill lightness is reduced.

---

### Minimum contrast ratio

The default requested ratio is:

```js
minimumRatio: 4.5
```

A stronger requirement:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            contrast: {
                minimumRatio: 5.5
            }
        }
    }
};
```

A less aggressive requirement:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            contrast: {
                minimumRatio: 3.5
            }
        }
    }
};
```

The accepted numeric range is from `1` to `21`.

---

### Contrast-correction strength

`contrast.strength` controls how far TikZJax moves the background fill towards the calculated darker value:

```text
0     keep the current fill
0.5   apply half of the required darkening
1     apply the complete calculated darkening
```

Example:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            contrast: {
                strength: 0.8
            }
        }
    }
};
```

---

### Darkening limit

`minimumBackgroundLightness` prevents the background fill from being reduced below a configured HSL lightness:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            contrast: {
                minimumBackgroundLightness: 0.04
            }
        }
    }
};
```

A higher value preserves more of the original background brightness but may prevent the requested ratio from being reached.

A lower value permits darker backgrounds.

---

### Shape detection tolerance

For separate foreground and background elements, TikZJax compares their screen-space bounding boxes and painting order.

`containmentTolerance` adds a small margin around candidate background shapes:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            contrast: {
                containmentTolerance: 2
            }
        }
    }
};
```

The default is `1`.

This may help with tiny rounding differences when associating text or a small vector detail with a containing shape.

The direct `fill`/`stroke` check on the same SVG element does not depend on `containmentTolerance`.

---

### Supported foreground and background shapes

Candidate background fills are searched on common SVG shapes:

* `path`;
* `rect`;
* `circle`;
* `ellipse`;
* `polygon`;
* `polyline`.

Supported foreground cases include:

* any parseable SVG `<text>` fill painted over a detected background;
* a bright neutral outline stroke on the same filled shape;
* a bright neutral fill or stroke on a smaller vector shape contained by a larger filled shape.

The vector-detail heuristic focuses on light neutral colors, such as white and light gray. Chromatic foreground accents are left to the ordinary explicit-color adaptation and do not trigger background darkening through this heuristic.

---

### Contrast-detection limits

Automatic correction may not identify the intended background when:

* the background or foreground uses a gradient or pattern;
* clipping paths, masks, or filters substantially change the final visible result;
* several overlapping shapes are equally plausible backgrounds;
* the true visual background is outside the SVG;
* the SVG uses an unusual painting order or geometry;
* a vector foreground is not light and approximately neutral;
* a foreground and its visual background do not have a usable geometric containment relationship.

In these cases, use explicit theme-compatible colors or separate Light and Dark diagrams.

---

## Very-light fill adaptation

Very light non-text fills have a separate adaptation stage named `adaptiveFills`.

This stage is enabled by default and predates `adaptiveColors`.

Its purpose is different:

* `adaptiveFills` converts very light fills into darker fills suitable for a dark page;
* `adaptiveColors` converts ordinary dark or medium explicit colors into brighter variants;
* the contrast stage may then darken a filled shape further when foreground text, a bright outline, or a light-neutral vector detail is not readable enough.

Default behavior:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveFills: {
            enabled: true,
            lightnessThreshold: 0.82,
            darkLightness: 0.23,
            minimumSaturation: 0.18,
            maximumSaturation: 0.46
        }
    }
};
```

To preserve all very-light fills exactly:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveFills: {
            enabled: false
        }
    }
};
```

Light mode restores the stored fill from before the `adaptiveFills` transformation.

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

When `applyTargetStyles` is enabled, matching target colors and published CSS variables are updated during the same theme application.

Explicit colors and contrast corrections are recomputed from stored original SVG values:

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
    +--> restore previous adaptive corrections
    |
    +--> apply black/white normalization
    |
    +--> recompute fills, colors, and contrast
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

### Light-mode behavior

Explicit TikZ colors remain exact in Light mode:

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

TikZJax stores the generated SVG color values and restores them whenever Light mode is active.

---

### Dark-mode behavior

In Dark mode, explicit colors are adapted by default.

The transformation preserves the perceived color family while increasing useful lightness and saturation.

For example:

```text
dark blue  -> vivid sky blue
dark red   -> vivid light red
dark green -> vivid light green
```

The exact output depends on the original SVG color and the active `adaptiveColors` options.

---

### Preserving exact explicit colors in both themes

Disable explicit-color adaptation globally:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: false
    }
};
```

This also disables the automatic contrast stage nested inside `adaptiveColors`.

To disable only color adaptation while retaining contrast correction, use:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            strength: 0,
            contrast: {
                enabled: true
            }
        }
    }
};
```

!!! warning

    Exact-color preservation is global.

    TikZJax does not currently provide a per-diagram or per-color opt-out marker for `adaptiveColors`.

For critical brand colors, scientific reference palettes, or complex illustrations, separate Light and Dark diagrams may be more appropriate.

---

### Colors that should follow the page

Use default TikZ foreground colors when an element should follow the page foreground rather than remain a chromatic explicit color:

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

### Black and white

Black and white use the existing TikZJax theme-normalization rules rather than `adaptiveColors`.

A normal black TikZ line can therefore follow the active page foreground:

```latex
\draw[very thick] (0,0) -- (3,0);
```

An explicitly generated pure-black value is also recognized by the black/white normalization stage when represented in one of the supported SVG forms.

Use a chromatic explicit color when a distinct colored line is intended.

---

## Separate light and dark diagrams

For illustrations whose palettes cannot be adapted reliably, provide two source versions.

This is especially useful when:

* exact brand colors must be preserved;
* a scientific palette has fixed semantic meaning;
* gradients, patterns, filters, or raster images dominate the illustration;
* the automatic foreground/background association is ambiguous;
* the two themes require genuinely different artistic choices.

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

### Dark-mode color and contrast tuning

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            enabled: true,
            strength: 1,

            minimumPerceptualLightness: 0.60,
            maximumPerceptualLightness: 0.82,

            saturationBoost: 0.18,
            minimumSaturation: 0.52,
            maximumSaturation: 0.90,
            chromaticThreshold: 0.08,

            hueShift: {
                red: 0,
                green: 0,
                blue: -40
            },
            hueShiftRange: 60,
            hueShiftStrength: 1,

            contrast: {
                enabled: true,
                minimumRatio: 4.5,
                strength: 1,
                minimumBackgroundLightness: 0.04,
                containmentTolerance: 1
            }
        }
    }
};
```

This block reproduces the built-in `adaptiveColors` defaults and is useful as a starting point for project-specific tuning.

---

## Troubleshooting

### The diagram remains black in dark mode

Inspect the final page HTML and verify that TikZJax detects Dark mode.

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

Also inspect the generated SVG value.

TikZJax recognizes ordinary pure-black forms such as hexadecimal or RGB black. A color hidden inside a gradient, pattern, CSS variable, external stylesheet, filter, or unsupported paint representation may not be normalized automatically.

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

### An explicit color remains too dark

Confirm that explicit-color adaptation is enabled:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            enabled: true,
            strength: 1
        }
    }
};
```

Then verify that the generated SVG uses an ordinary parseable color value.

The adaptation intentionally skips:

* `currentColor`;
* `none`;
* transparent values;
* `var(...)`;
* `url(...)` gradients and patterns;
* pure black and white, which use separate normalization rules.

Increase the minimum target lightness when necessary:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            minimumPerceptualLightness: 0.68
        }
    }
};
```

---

### A white or very light rectangle remains visible in dark mode

The rectangle may use a fill that TikZJax cannot parse or classify as a normal SVG color.

Verify the very-light fill stage:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveFills: {
            enabled: true,
            lightnessThreshold: 0.82
        }
    }
};
```

Inspect the generated SVG and the original TikZ source.

Consider:

* lowering `adaptiveFills.lightnessThreshold`;
* removing an unnecessary explicit white fill;
* using no fill;
* avoiding gradients or patterns when automatic adaptation is required;
* providing separate diagram versions.

---

### Blue is too cyan or too violet

Tune the blue-family hue shift.

A smaller negative shift stays closer to ordinary blue:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            hueShift: {
                blue: -25
            }
        }
    }
};
```

A larger negative shift moves further towards sky blue and cyan:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            hueShift: {
                blue: -50
            }
        }
    }
};
```

You can also reduce every family shift with:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            hueShiftStrength: 0.7
        }
    }
};
```

---

### Adapted colors are too pale or too intense

For pale colors, reduce the maximum target lightness or increase saturation:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            maximumPerceptualLightness: 0.76,
            saturationBoost: 0.24
        }
    }
};
```

For colors that are too intense, reduce the saturation settings:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            saturationBoost: 0.08,
            minimumSaturation: 0.42,
            maximumSaturation: 0.78
        }
    }
};
```

---

### Foreground/background contrast is not corrected

Confirm that both adaptive colors and contrast correction are enabled:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            enabled: true,
            contrast: {
                enabled: true,
                minimumRatio: 4.5
            }
        }
    }
};
```

The automatic correction supports:

* SVG `<text>` painted over a common filled shape;
* a bright neutral stroke on the same element as its fill;
* a small bright-neutral vector detail painted over a larger filled shape.

For example, a gray filled bar with a white `currentColor` outline is evaluated directly as a same-element `fill`/`stroke` pair. Increasing `containmentTolerance` is not required for that case.

Inspect the generated SVG. A background changed by this stage receives:

```html
data-tikzjax-contrast-adjusted="true"
```

If that marker is absent, the foreground/background arrangement was not recognized.

Detection may fail when:

* a foreground or background is a gradient or pattern;
* a filter, clipping path, or complex mask changes the visible result;
* the background is not one of the supported common shape elements;
* the intended background is outside the SVG;
* a separate background is painted after the foreground;
* several competing background shapes overlap;
* a separate foreground is not geometrically associated with the intended background;
* a vector foreground is chromatic rather than light and approximately neutral.

For small geometric mismatches involving separate text or vector details, increase:

```js
window.TikzJaxOptions = {
    theme: {
        adaptiveColors: {
            contrast: {
                containmentTolerance: 2
            }
        }
    }
};
```

If the marker is present but the result remains too light, increase `minimumRatio`, keep `contrast.strength` near `1`, or lower `minimumBackgroundLightness`.

For an exact critical design, use explicit theme-specific colors instead of relying on automatic detection.

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
