# `pgf-spectra` Examples

[`pgf-spectra`](https://ctan.org/pkg/pgf-spectra) is a PGF/TikZ package for drawing continuous, emission, and absorption spectra.

It can represent:

* the continuous visible spectrum;
* emission spectra of chemical elements;
* absorption spectra;
* spectra containing several elements;
* neutral and ionized atoms;
* wavelength axes and labels;
* selected wavelength ranges;
* relative line intensities;
* ultraviolet, visible, and infrared ranges;
* custom spectral lines;
* redshifted or blueshifted spectra.

The package is included in the TikZJax runtime, but it is not automatically loaded into every diagram.

For the best performance, load it locally only where it is needed:

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
>
\pgfspectra[
  element=H,
  width=10cm,
  height=1.5cm,
  axis,
  label
]
</script>
```

For other supported packages, return to the [Examples overview](index.md).

---

## Recommended local loading

Use:

```html
data-tex-packages="pgf-spectra"
```

on every block that uses `\pgfspectra` or another command provided by the package:

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
>
\pgfspectra[element=H]
</script>
```

Local package declarations are merged with globally configured packages.

They do not replace the global configuration.

!!! tip "Why local loading is recommended"

```
`pgf-spectra` loads spectral data that ordinary TikZ diagrams do not need.

Loading it locally:

- keeps unrelated diagrams lighter;
- avoids processing spectral data in every TeX document;
- reduces unnecessary work in each worker;
- limits package interactions;
- makes the requirements of each spectrum explicit.
```

---

## Important syntax rule

The `\pgfspectra` command can be used directly:

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
>
\pgfspectra[element=H]
</script>
```

A surrounding `tikzpicture` environment is not required for a standard spectrum:

```latex
\pgfspectra[
    element=H,
    axis,
    label
]
```

This direct form is the simplest and most reliable syntax in TikZJax.

---

## Continuous visible spectrum

Calling `\pgfspectra` without an element produces a continuous visible spectrum.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="520"
  data-height="130"
>
\pgfspectra[
  width=10cm,
  height=1.3cm
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="520"
  data-height="130"
>
\pgfspectra[
  width=10cm,
  height=1.3cm
]
</script>
```
````

No additional `pgf-spectra` library is required.

---

## Basic hydrogen emission spectrum

An element symbol selects its spectral lines.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="560"
  data-height="180"
>
\pgfspectra[
  element=H,
  width=10cm,
  height=1.5cm,
  axis,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="560"
  data-height="180"
>
\pgfspectra[
  element=H,
  width=10cm,
  height=1.5cm,
  axis,
  label
]
</script>
```
````

The default emission spectrum uses colored spectral lines on a dark background.

---

## Helium emission spectrum

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="600"
  data-height="190"
>
\pgfspectra[
  element=He,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="600"
  data-height="190"
>
\pgfspectra[
  element=He,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```
````

The `axis step` option controls the distance between the major wavelength labels.

---

## Spectrum with a visible-color background

The `back` option controls the spectrum background.

The predefined values:

```text
visible5
visible10
visible15
...
visible100
```

place the visible-spectrum colors behind the emission lines.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=He,
  back=visible100,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=He,
  back=visible100,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```
````

!!! note "No additional rainbow library is required"

````
`back=visible100` uses the built-in visible-spectrum shading of the main `pgf-spectra` package.

It does not require:

```latex
\usepgfspectralibrary{rainbow}
```

The separate `rainbow` library provides the different `\pgfspectrarainbow` command.
````

---

## Hydrogen absorption spectrum

Use the `absorption` option to draw dark spectral lines over a continuous background.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=H,
  absorption,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=H,
  absorption,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```
````

No additional library is required for absorption spectra.

---

## Absorption spectrum of several elements

Several element symbols can be supplied in a list:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="650"
  data-height="210"
  data-render-timeout="30000"
>
\pgfspectra[
  element={H,He},
  absorption,
  width=11.5cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="650"
  data-height="210"
  data-render-timeout="30000"
>
\pgfspectra[
  element={H,He},
  absorption,
  width=11.5cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```
````

A spectrum containing several elements can require more processing than a single-element spectrum.

---

## Wavelength range

The default visible range can be restricted with:

```text
begin
end
```

Values are expressed in nanometres.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=H,
  begin=400,
  end=700,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=50,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=H,
  begin=400,
  end=700,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=50,
  label
]
</script>
```
````

The package supports spectral data beyond the visible region, from ultraviolet to infrared, when the required data is present in the runtime.

---

## Reversed wavelength direction

The `begin` wavelength may be greater than the `end` wavelength.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=He,
  begin=700,
  end=400,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=50,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=He,
  begin=700,
  end=400,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=50,
  label
]
</script>
```
````

This reverses the horizontal wavelength direction.

---

## Custom spectral lines

The `lines` option can draw explicitly selected wavelengths.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="190"
>
\pgfspectra[
  lines={410,434,486,656},
  width=11cm,
  height=1.5cm,
  axis,
  axis step=40
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="190"
>
\pgfspectra[
  lines={410,434,486,656},
  width=11cm,
  height=1.5cm,
  axis,
  axis step=40
]
</script>
```
````

In `pgf-spectra` 3.x, the `lines` list can also contain a continuous range:

```latex
lines={400 to 500}
```

or a mixture of ranges and individual values:

```latex
lines={380 to 500,555,633}
```

!!! warning "Version compatibility"

```
The `start to end` range syntax for `lines` was introduced in `pgf-spectra` 3.0.

If the console reports an unknown syntax or key, verify the version included in the deployed TikZJax runtime.
```

---

## Neutral and ionized atoms

The `charge` option selects the atomic charge represented by the spectral data.

Example with ionized helium:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=He,
  charge=1,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=He,
  charge=1,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```
````

Use:

```latex
charge=all
```

to include the available neutral and ionized lines for the selected element.

The available charges depend on the spectral dataset included with the package.

---

## Relative line intensity

Use `relative intensity` when the line height or intensity should reflect the available spectral data.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
  data-render-timeout="30000"
>
\pgfspectra[
  element=He,
  relative intensity,
  relative intensity threshold=.25,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
  data-render-timeout="30000"
>
\pgfspectra[
  element=He,
  relative intensity,
  relative intensity threshold=.25,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```
````

The threshold prevents weak lines from becoming completely invisible.

---

## Minimum line intensity

Use `Imin` to remove lines below a minimum intensity.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=He,
  Imin=.05,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=He,
  Imin=.05,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```
````

Higher values display fewer spectral lines.

---

## Brightness and gamma

The options:

```text
brightness
gamma
```

adjust the visual appearance of the spectrum.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="640"
  data-height="210"
>
\pgfspectra[
  element=He,
  back=visible50,
  brightness=.7,
  gamma=.8,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="640"
  data-height="210"
>
\pgfspectra[
  element=He,
  back=visible50,
  brightness=.7,
  gamma=.8,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label
]
</script>
```
````

Use these options carefully. Extreme values may make weak spectral lines difficult to see.

---

## Axis options

Common axis options include:

```text
axis
axis step
axis ticks
axis color
axis font
axis font color
axis unit
```

Example:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="650"
  data-height="220"
>
\pgfspectra[
  element=H,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  axis ticks=4,
  axis color=gray,
  axis font color=blue!60!black,
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="650"
  data-height="220"
>
\pgfspectra[
  element=H,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  axis ticks=4,
  axis color=gray,
  axis font color=blue!60!black,
  label
]
</script>
```
````

---

## Custom axis label

`pgf-spectra` 3.x provides:

```text
axis label
axis label text
axis label position
```

Example:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="660"
  data-height="240"
>
\pgfspectra[
  element=H,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  axis label,
  axis label text={wavelength in nanometres},
  label
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="660"
  data-height="240"
>
\pgfspectra[
  element=H,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  axis label,
  axis label text={wavelength in nanometres},
  label
]
</script>
```
````

!!! warning "Requires pgf-spectra 3.x"

````
`axis label`, `axis label text`, and `axis label position` were introduced in version 3.0.

If the browser console reports:

```text
I do not know the key '/pgfspectra/axis label text'
```

the deployed runtime probably contains an older package version.

Remove the option or update the runtime files.
````

---

## Element label options

The `label` option displays the chemical symbol associated with the spectrum.

Additional label options include:

```text
label position
label before text
label after text
label font
label font color
```

Example:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="650"
  data-height="220"
>
\pgfspectra[
  element=He,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label,
  label position=north west,
  label after text={ emission spectrum}
]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="650"
  data-height="220"
>
\pgfspectra[
  element=He,
  width=11cm,
  height=1.6cm,
  axis,
  axis step=40,
  label,
  label position=north west,
  label after text={ emission spectrum}
]
</script>
```
````

---

## Reusable spectrum style

Use `\pgfspectraStyle` to configure options shared by several spectra in the same TikZJax block.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="680"
  data-height="380"
  data-render-timeout="30000"
>
\pgfspectraStyle[
  width=11cm,
  height=1.3cm,
  axis,
  axis step=40,
  label
]

\pgfspectra[element=H]

\par\bigskip

\pgfspectra[element=He]
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="680"
  data-height="380"
  data-render-timeout="30000"
>
\pgfspectraStyle[
  width=11cm,
  height=1.3cm,
  axis,
  axis step=40,
  label
]

\pgfspectra[element=H]

\par\bigskip

\pgfspectra[element=He]
</script>
```
````

Reset the style with:

```latex
\pgfspectraStyleReset
```

Each TikZJax block is compiled as an independent TeX document, so a style declared inside one block does not affect another block.

---

## Several spectra versus several TikZJax blocks

Several spectra can be placed in one TeX block:

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
>
\pgfspectra[element=H]

\par\bigskip

\pgfspectra[element=He]
</script>
```

However, separate blocks can be distributed between several workers:

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
>
\pgfspectra[element=H]
</script>

<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
>
\pgfspectra[element=He]
</script>
```

Use separate blocks when independent parallel rendering is more important than sharing one TeX document.

Use one block when the spectra must share local TeX state or appear as one inseparable figure.

---

## Additional `pgf-spectra` libraries

The main `\pgfspectra` command does not require an additional `pgf-spectra` library.

The package also defines optional libraries:

```text
data
pgfplots
tempercolor
rainbow
```

They are loaded inside the TeX source with:

```latex
\usepgfspectralibrary{library-name}
```

Several libraries can be loaded together:

```latex
\usepgfspectralibrary{data,tempercolor}
```

!!! important "Runtime availability"

````
An optional library works in TikZJax only when its library file and all its dependencies are present in the deployed `dist/tex_files/` directory.

Loading:

```html
data-tex-packages="pgf-spectra"
```

loads the main package, but an optional library can still fail if its separate runtime file was not included in the generated package catalogue.

Test optional libraries with console output enabled before publishing them as rendered documentation examples.
````

---

## The optional `rainbow` library

The dedicated rainbow command is not the same feature as:

```latex
back=visible100
```

To use `\pgfspectrarainbow`, first load the optional library:

```latex
\usepgfspectralibrary{rainbow}
```

Then call:

```latex
\pgfspectrarainbow{2cm}
```

Complete TikZJax source:

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-show-console="true"
>
\usepgfspectralibrary{rainbow}

\pgfspectrarainbow{2cm}
</script>
```

!!! warning

````
Keep this as a source example until the generated TikZJax runtime has been checked for the corresponding rainbow-library file.

For a rainbow-colored spectrum that uses only the main package, prefer:

```latex
\pgfspectra[
  element=H,
  back=visible100
]
```
````

---

## Loading several LaTeX packages

Several packages can be declared with a comma-separated list:

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra,physics"
>
% Source using both packages
</script>
```

They can also be declared with JSON:

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "pgf-spectra": "",
    "physics": ""
  }'
>
% Diagram source
</script>
```

Only load packages required by the current block.

!!! warning

```
A larger package list creates a larger TeX preamble.

It can increase rendering time, memory usage, and the possibility of package conflicts.
```

---

## Global loading

Load `pgf-spectra` globally only when most diagrams on the site use it:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            "pgf-spectra": ""
        }
    }
};
```

After global loading, individual diagrams do not need:

```html
data-tex-packages="pgf-spectra"
```

!!! warning "Performance"

````
Global loading inserts:

```latex
\usepackage{pgf-spectra}
```

into every TikZJax document.

This means that ordinary TikZ diagrams also initialize the package and its spectral data.

Prefer local loading unless spectra are used throughout the site.
````

---

## MkDocs fenced blocks

A fenced `tikzjax` block cannot contain HTML `data-*` attributes.

Therefore, fenced blocks using `pgf-spectra` work only when the package is loaded globally.

=== "Rendering"

````
```tikzjax
\pgfspectra[
  element=H,
  width=10cm,
  height=1.5cm,
  axis,
  label
]
```
````

=== ":fa-markdown: Markdown"

`````
````markdown
```tikzjax
\pgfspectra[
  element=H,
  width=10cm,
  height=1.5cm,
  axis,
  label
]
```
````
`````

!!! important

````
For portable local loading, prefer:

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
>
...
</script>
```
````

---

## MkDocs Content Tabs

=== "Rendering"

```
=== "Question"

    Draw the visible hydrogen emission spectrum.

=== "Solution"

    <script
      type="text/tikz"
      data-tex-packages="pgf-spectra"
      data-width="600"
      data-height="190"
    >
    \pgfspectra[
      element=H,
      width=11cm,
      height=1.6cm,
      axis,
      axis step=40,
      label
    ]
    </script>
```

=== ":fa-markdown: Markdown"

`````
````markdown
=== "Question"

    Draw the visible hydrogen emission spectrum.

=== "Solution"

    <script
      type="text/tikz"
      data-tex-packages="pgf-spectra"
      data-width="600"
      data-height="190"
    >
    \pgfspectra[
      element=H,
      width=11cm,
      height=1.6cm,
      axis,
      axis step=40,
      label
    ]
    </script>
````
`````

TikZJax automatically rescans MkDocs Material content tabs when they become visible.

---

## MkDocs admonitions

=== "Rendering"

```
!!! example "Hydrogen absorption spectrum"

    <script
      type="text/tikz"
      data-tex-packages="pgf-spectra"
      data-width="600"
      data-height="190"
    >
    \pgfspectra[
      element=H,
      absorption,
      width=11cm,
      height=1.6cm,
      axis,
      axis step=40,
      label
    ]
    </script>
```

=== ":fa-markdown: Markdown"

`````
````markdown
!!! example "Hydrogen absorption spectrum"

    <script
      type="text/tikz"
      data-tex-packages="pgf-spectra"
      data-width="600"
      data-height="190"
    >
    \pgfspectra[
      element=H,
      absorption,
      width=11cm,
      height=1.6cm,
      axis,
      axis step=40,
      label
    ]
    </script>
````
`````

---

## Loader dimensions

Spectra are usually much wider than the default TikZJax loader.

Reserve suitable space with:

```html
data-width="620"
data-height="200"
```

Example:

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-width="620"
  data-height="200"
>
\pgfspectra[
  element=H,
  width=11cm,
  height=1.6cm,
  axis,
  label
]
</script>
```

These attributes affect only the loading placeholder.

They do not change the final spectrum dimensions.

The final dimensions are controlled by the package options:

```latex
width=11cm
height=1.6cm
```

---

## Timeout and debugging options

Spectral diagrams can require more data files and more processing than a basic TikZ drawing.

A debugging block can use:

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-render-timeout="30000"
  data-disable-cache="true"
  data-show-console="true"
>
\pgfspectra[
  element=H,
  axis,
  label
]
</script>
```

Use:

```html
data-disable-cache="true"
```

while changing an example.

Use:

```html
data-show-console="true"
```

when diagnosing TeX, package, data-file, or runtime errors.

Use:

```html
data-render-timeout="30000"
```

or a larger value for a complex spectrum.

---

## Parallel rendering

TikZJax places uncached diagrams in a global rendering queue.

Several spectra can be compiled concurrently:

```text
worker 1 -> hydrogen spectrum
worker 2 -> helium spectrum
worker 3 -> absorption spectrum
```

Each worker renders one diagram at a time.

When a worker finishes, it takes another diagram from the queue.

Each worker maintains its own in-memory cache of downloaded and decompressed TeX files.

The first `pgf-spectra` diagram handled by a worker may therefore take longer than later spectra assigned to the same worker.

!!! note

```
Spectral data cached by one worker is not automatically shared with the other workers.

This is an intentional consequence of worker isolation.
```

!!! tip

```
Local package loading remains fully compatible with parallel rendering.

The package declaration and spectrum options travel with the individual diagram when it is assigned to a worker.
```

---

## Identical spectra

When several identical spectra are discovered while the same render is still pending, TikZJax can group them into one rendering operation.

The resulting SVG is then reused for every matching target.

The complete source and diagram dataset must match, including:

* `data-tex-packages`;
* local TikZ libraries;
* dimensions;
* timeout options;
* cache options;
* the exact `\pgfspectra` source.

---

## Debugging

### Enable TeX logs

```html
<script
  type="text/tikz"
  data-tex-packages="pgf-spectra"
  data-disable-cache="true"
  data-show-console="true"
  data-render-timeout="30000"
>
\pgfspectra[
  element=H,
  width=11cm,
  height=1.6cm,
  axis,
  label
]
</script>
```

### Clear the TikZJax SVG cache

Run this in the browser console:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

### Inspect globally configured packages

```js
window.TikzJaxOptions?.tex?.texPackages
```

### Inspect the effective package version

The browser console may reveal the loaded package version in the TeX output when:

```html
data-show-console="true"
```

is enabled.

This is useful when an option exists in the current manual but fails in the deployed runtime.

### Missing main package file

A missing package generally appears as:

```text
GET .../tex_files/pgf-spectra.sty.gz 404
```

### Missing spectral data

A missing data dependency may appear as a request for a file such as:

```text
GET .../tex_files/pgf-spectra.data.NIST.tex.gz 404
```

The exact filename depends on the package version and selected dataset.

### Missing optional library

An optional library may produce a request resembling:

```text
GET .../tex_files/pgf-spectra.library.rainbow.tex.gz 404
```

The exact name should be taken from the browser console.

Do not guess the filename when updating the runtime catalogue. Use the actual failed request.

### Timeout

A timeout appears as:

```text
TikZJax render timeout after 30000ms
```

Increase it locally:

```html
data-render-timeout="45000"
```

or globally:

```js
window.TikzJaxOptions = {
    renderTimeout: 45000
};
```

---

## Common problems

### Undefined control sequence `\pgfspectra`

The package was not loaded.

Add:

```html
data-tex-packages="pgf-spectra"
```

or enable it globally.

---

### Unknown `/pgfspectra/...` key

The option may not exist in the deployed package version.

For example:

```text
I do not know the key '/pgfspectra/axis label text'
```

usually indicates that the runtime contains a version older than 3.0.

Check the package version, remove the unsupported option, or rebuild the runtime with the current package files.

---

### A broken image appears without a useful message

Enable:

```html
data-show-console="true"
```

and temporarily disable the SVG cache:

```html
data-disable-cache="true"
```

Then reload the page and inspect the browser console.

---

### A spectrum works without options but fails with advanced options

Start from the minimal form:

```latex
\pgfspectra[element=H]
```

Then add options one at a time:

```latex
\pgfspectra[element=H,axis]
```

```latex
\pgfspectra[element=H,axis,label]
```

```latex
\pgfspectra[
  element=H,
  axis,
  label,
  back=visible100
]
```

This makes it easier to identify the unsupported key or missing dependency.

---

### The dedicated rainbow command is undefined

The main package does not automatically load the optional rainbow library.

Add:

```latex
\usepgfspectralibrary{rainbow}
```

before:

```latex
\pgfspectrarainbow{2cm}
```

If the diagram still fails, inspect the console for a missing optional-library file.

---

### `back=visible100` fails

`back=visible100` belongs to the main `\pgfspectra` command and does not require the separate rainbow library.

A failure therefore more likely indicates:

* an older or incomplete `pgf-spectra` installation;
* a missing core package dependency;
* a missing shading-related runtime file;
* a TeX error elsewhere in the options;
* a render timeout.

Use the browser console to identify the exact cause.

---

### No spectral lines are visible

Check:

* that the element symbol is valid;
* that the selected wavelength range contains lines for the element;
* that `charge` is available in the selected dataset;
* that `Imin` is not too high;
* that `relative intensity threshold` is not hiding weak lines;
* that `brightness` and `gamma` are not making lines too dark.

Return temporarily to:

```latex
\pgfspectra[element=H]
```

to verify the basic runtime.

---

### The axis is too dense

Increase:

```latex
axis step=40
```

or:

```latex
axis step=50
```

You can also reduce the number of minor ticks with:

```latex
axis ticks=4
```

---

### The spectrum is clipped while loading

Increase:

```html
data-width
data-height
```

These attributes reserve more space for the loader.

They do not resize the final spectrum.

---

### The first spectrum is slower

The first worker rendering `pgf-spectra` must download and decompress the package, its spectral data, and its dependencies.

Later spectra assigned to the same worker can reuse those files from memory.

---

### Changes are not visible

The previous SVG may be stored in IndexedDB.

Use:

```html
data-disable-cache="true"
```

while debugging, or clear the TikZJax database manually.

---

## Common options

| Option                             | Purpose                                    |
| ---------------------------------- | ------------------------------------------ |
| `element=H`                        | Select an element                          |
| `element={H,He}`                   | Combine several elements                   |
| `charge=1`                         | Select an ionized spectrum                 |
| `charge=all`                       | Include all available charges              |
| `absorption`                       | Draw an absorption spectrum                |
| `back=visible100`                  | Use the full visible-color background      |
| `width=11cm`                       | Set the spectrum width                     |
| `height=1.6cm`                     | Set the spectrum height                    |
| `begin=400`                        | Set the starting wavelength                |
| `end=700`                          | Set the ending wavelength                  |
| `lines={410,434,486,656}`          | Draw selected wavelengths                  |
| `axis`                             | Display the wavelength axis                |
| `axis step=40`                     | Set major-axis spacing                     |
| `axis ticks=4`                     | Configure minor ticks                      |
| `label`                            | Display the element label                  |
| `relative intensity`               | Use relative line intensities              |
| `relative intensity threshold=.25` | Set the minimum relative display intensity |
| `Imin=.05`                         | Filter weak source lines                   |
| `brightness=.7`                    | Adjust brightness                          |
| `gamma=.8`                         | Adjust gamma                               |
| `line width=.8pt`                  | Set spectral-line width                    |

---

## Official documentation

* [`pgf-spectra` on CTAN](https://ctan.org/pkg/pgf-spectra)
* [`pgf-spectra` manual](https://mirrors.ctan.org/graphics/pgf/contrib/pgf-spectra/pgf-spectraManual.pdf)
* [`pgf-spectra` source directory](https://ctan.org/tex-archive/graphics/pgf/contrib/pgf-spectra)

---

## Related documentation

* [Examples overview](index.md)
* [TikZ examples](tikz.md)
* [`physics` examples](physics.md)
* [`circuitikz` examples](circuitikz.md)
* [`chemfig` examples](chemfig.md)
* [`yquant` examples](yquant.md)
* [`tikz-feynhand` examples](tikz-feynhand.md)
* [Installation](../installation/index.md)
* [Configuration](../configuration.md)
* [API Reference](../api-reference.md)
