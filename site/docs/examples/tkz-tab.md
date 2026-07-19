# `tkz-tab` Examples

[`tkz-tab`](https://ctan.org/pkg/tkz-tab) creates sign tables, variation tables, and related mathematical tables using TikZ.

The package is included in the TikZJax runtime, but it is not automatically loaded into every diagram.

For the best performance, load it locally only where it is needed:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
>
% tkz-tab source
</script>
```

For other supported packages, return to the [Examples overview](index.md).

---

## Recommended local loading

Use the `data-tex-packages` attribute:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
>
\begin{tikzpicture}
    \tkzTabInit
        {$x$/1,$f'(x)$/1,$f(x)$/2}
        {$0$,$\dfrac{2}{3}$,$+\infty$}

    \tkzTabLine{,+,z,-,}
    \tkzTabVar{-/$0$,+/$1$,-/$0$}
\end{tikzpicture}
</script>
```

Local package declarations are merged with globally configured packages.

They do not replace the global configuration.

!!! tip

    Local loading is recommended because `tkz-tab` is added only to diagrams that actually need it.  
    This keeps unrelated TikZ diagrams faster and reduces unnecessary work in each TeX worker.

---

## Basic sign and variation table

This example shows:

* the variable row;
* the sign of the derivative;
* the variations of the function.

=== "Rendering"

    <script
    type="text/tikz"
    data-tex-packages="tkz-tab, amsmath"
    >
    \begin{tikzpicture}
        \tkzTabInit[lgt=4]
        {$x$/1.5,$f'(x)$/1,$f(x)=\tan(x)$/2}
        {$0$,$\dfrac{\pi}{2}$,$\pi$}
        
        \tkzTabLine{,+,d,+,}
        \tkzTabVar{-/$0$,+D-/$+\infty$/$-\infty$,+/$0$}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
    type="text/tikz"
    data-tex-packages="tkz-tab, amsmath"
    >
    \begin{tikzpicture}
        \tkzTabInit[lgt=4]
        {$x$/1.5,$f'(x)$/1,$f(x)=\tan(x)$/2}
        {$0$,$\dfrac{\pi}{2}$,$\pi$}
        
        \tkzTabLine{,+,d,+,}
        \tkzTabVar{-/$0$,+D-/$+\infty$/$-\infty$,+/$0$}
    \end{tikzpicture}
    </script>
    ```

---

## Polynomial variation table

Consider:

$f(x)=x^3-3x^2+2.$

Its derivative is:

$f'(x)=3x(x-2).$

The critical values are $0$ and $2$.

=== "Rendering"

    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    >
    \begin{tikzpicture}[
        line width=1.1pt,
        font=\large
    ]
        \tkzTabInit[
            lgt=5,
            espcl=2.6,
            lw=1.1pt
        ]
            {
                $x$/1.3,
                $f'(x)=3x(x-2)$/1.5,
                $f(x)=x^3-3x^2+2$/2.4
            }
            {
                $-\infty$,
                $0$,
                $2$,
                $+\infty$
            }

        \tkzTabLine{
            ,+,
            z,
            -,
            z,
            +,
        }

        \tkzTabVar{
            -/$-\infty$,
            +/$2$,
            -/$-2$,
            +/$+\infty$
        }
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    >
    \begin{tikzpicture}[
        line width=1.1pt,
        font=\large
    ]
        \tkzTabInit[
            lgt=5,
            espcl=2.6,
            lw=1.1pt
        ]
            {
                $x$/1.3,
                $f'(x)=3x(x-2)$/1.5,
                $f(x)=x^3-3x^2+2$/2.4
            }
            {
                $-\infty$,
                $0$,
                $2$,
                $+\infty$
            }

        \tkzTabLine{
            ,+,
            z,
            -,
            z,
            +,
        }

        \tkzTabVar{
            -/$-\infty$,
            +/$2$,
            -/$-2$,
            +/$+\infty$
        }
    \end{tikzpicture}
    </script>
    ```

---

## Sign table only

A variation row is not mandatory.

This example displays only the sign of:

$g(x)=(x+2)(x-1).$

=== "Rendering"

    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    >
    \begin{tikzpicture}
        \tkzTabInit[
            lgt=4,
            espcl=2.3
        ]
            {
                $x$/1.2,
                $x+2$/1.1,
                $x-1$/1.1,
                $g(x)$/1.2
            }
            {
                $-\infty$,
                $-2$,
                $1$,
                $+\infty$
            }

        \tkzTabLine{
            ,-,
            z,
            +,
            t,
            +,
        }

        \tkzTabLine{
            ,-,
            t,
            -,
            z,
            +,
        }

        \tkzTabLine{
            ,+,
            z,
            -,
            z,
            +,
        }
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    >
    \begin{tikzpicture}
        \tkzTabInit[
            lgt=4,
            espcl=2.3
        ]
            {
                $x$/1.2,
                $x+2$/1.1,
                $x-1$/1.1,
                $g(x)$/1.2
            }
            {
                $-\infty$,
                $-2$,
                $1$,
                $+\infty$
            }

        \tkzTabLine{
            ,-,
            z,
            +,
            t,
            +,
        }

        \tkzTabLine{
            ,-,
            t,
            -,
            z,
            +,
        }

        \tkzTabLine{
            ,+,
            z,
            -,
            z,
            +,
        }
    \end{tikzpicture}
    </script>
    ```

In a sign row:

```text
+  positive
-  negative
z  zero
t  ordinary separator
```

---

## Larger variation table

This example contains several critical points.

=== "Rendering"

    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    data-width="650"
    data-height="260"
    >
    \begin{tikzpicture}[
        line width=1.1pt,
        font=\large
    ]
        \tkzTabInit[
            lgt=3.5,
            espcl=2.4,
            lw=1.1pt
        ]
            {
                $x$/1.3,
                $f'(x)$/1.3,
                $f(x)$/2.3
            }
            {
                $-\infty$,
                $-1$,
                $0$,
                $1$,
                $+\infty$
            }

        \tkzTabLine{
            ,+,
            z,
            -,
            z,
            -,
            z,
            +,
        }

        \tkzTabVar{
            -/$-\infty$,
            +/$3$,
            R/,
            -/$-1$,
            +/$+\infty$
        }
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    data-width="650"
    data-height="260"
    >
    \begin{tikzpicture}[
        line width=1.1pt,
        font=\large
    ]
        \tkzTabInit[
            lgt=3.5,
            espcl=2.4,
            lw=1.1pt
        ]
            {
                $x$/1.3,
                $f'(x)$/1.3,
                $f(x)$/2.3
            }
            {
                $-\infty$,
                $-1$,
                $0$,
                $1$,
                $+\infty$
            }

        \tkzTabLine{
            ,+,
            z,
            -,
            z,
            -,
            z,
            +,
        }

        \tkzTabVar{
            -/$-\infty$,
            +/$3$,
            R/,
            -/$-1$,
            +/$+\infty$
        }
    \end{tikzpicture}
    </script>
    ```

The `R/` marker reserves a position in the variation row without displaying a value.

---

## Global package loading

You may load `tkz-tab` globally when it is required by most diagrams on the site:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            "tkz-tab": ""
        }
    }
};
```

After global loading, a block does not need `data-tex-packages`:

```html
<script type="text/tikz">
\begin{tikzpicture}
    \tkzTabInit
        {$x$/1,$f'(x)$/1,$f(x)$/2}
        {$-\infty$,$0$,$+\infty$}

    \tkzTabLine{,+,z,-,}
    \tkzTabVar{-/$-\infty$,+/$1$,-/$-\infty$}
\end{tikzpicture}
</script>
```

Package loading and table styling are separate concerns:

* `tex.texPackages["tkz-tab"]` controls whether the package is loaded;
* `tkzTab` controls the defaults applied to tables when the package is present.

!!! warning "Performance"

    A globally configured package is added to the preamble of every diagram.

    Loading `tkz-tab` globally is convenient, but it makes even unrelated TikZ diagrams process:

    ```latex
    \usepackage{tkz-tab}
    ```

    Prefer local loading unless `tkz-tab` is used extensively throughout the site.

---

## MkDocs fenced blocks

A fenced `tikzjax` block cannot contain HTML `data-*` attributes.

Therefore, fenced syntax works only when `tkz-tab` is enabled globally.

The **Rendering** tab below contains a live HTML source without Markdown fences. The **Markdown** tab shows the fenced syntax that authors can use when the package is globally loaded.

=== "Rendering"

    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    >
    \begin{tikzpicture}
        \tkzTabInit[
            lgt=4,
            espcl=2.4
        ]
            {
                $x$/1.2,
                $f'(x)$/1.2,
                $f(x)$/2
            }
            {
                $-\infty$,
                $2$,
                $+\infty$
            }

        \tkzTabLine{,-,z,+,}

        \tkzTabVar{
            +/$+\infty$,
            -/$-3$,
            +/$+\infty$
        }
    \end{tikzpicture}
    </script>

=== ":fa-markdown: Markdown"

    ````markdown
    ```tikzjax
    \begin{tikzpicture}
        \tkzTabInit[
            lgt=4,
            espcl=2.4
        ]
            {
                $x$/1.2,
                $f'(x)$/1.2,
                $f(x)$/2
            }
            {
                $-\infty$,
                $2$,
                $+\infty$
            }

        \tkzTabLine{,-,z,+,}

        \tkzTabVar{
            +/$+\infty$,
            -/$-3$,
            +/$+\infty$
        }
    \end{tikzpicture}
    ```
    ````

!!! important

    When `tkz-tab` is not globally configured, use:

    ```html
    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    >
    ...
    </script>
    ```

    instead of a fenced block.

---

## MkDocs Content Tabs

The `<script>` syntax can be placed inside Material for MkDocs content tabs.

=== "Rendering"

    === "Question"

        Draw the variation table of:

        \[
        f(x)=x^3-3x^2+2.
        \]

    === "Solution"

        <script
        type="text/tikz"
        data-tex-packages="tkz-tab"
        >
        \begin{tikzpicture}
            \tkzTabInit[
                lgt=5,
                espcl=2.5
            ]
                {
                    $x$/1.2,
                    $f'(x)$/1.3,
                    $f(x)$/2.1
                }
                {
                    $-\infty$,
                    $0$,
                    $2$,
                    $+\infty$
                }

            \tkzTabLine{,+,z,-,z,+,}

            \tkzTabVar{
                -/$-\infty$,
                +/$2$,
                -/$-2$,
                +/$+\infty$
            }
        \end{tikzpicture}
        </script>

=== ":fa-markdown: Markdown"

    ````markdown
    === "Question"

        Draw the variation table of:

        \[
        f(x)=x^3-3x^2+2.
        \]

    === "Solution"

        <script
        type="text/tikz"
        data-tex-packages="tkz-tab"
        >
        \begin{tikzpicture}
            \tkzTabInit[
                lgt=5,
                espcl=2.5
            ]
                {
                    $x$/1.2,
                    $f'(x)$/1.3,
                    $f(x)$/2.1
                }
                {
                    $-\infty$,
                    $0$,
                    $2$,
                    $+\infty$
                }

            \tkzTabLine{,+,z,-,z,+,}

            \tkzTabVar{
                -/$-\infty$,
                +/$2$,
                -/$-2$,
                +/$+\infty$
            }
        \end{tikzpicture}
        </script>
    ````

TikZJax automatically rescans content tabs when their contents become visible.

---

## MkDocs admonitions

=== "Rendering"

    !!! example "Variation table"

        <script
        type="text/tikz"
        data-tex-packages="tkz-tab"
        >
        \begin{tikzpicture}
            \tkzTabInit[
                lgt=4,
                espcl=2.4
            ]
                {
                    $x$/1.2,
                    $f'(x)$/1.2,
                    $f(x)$/2
                }
                {
                    $-\infty$,
                    $1$,
                    $+\infty$
                }

            \tkzTabLine{,-,z,+,}

            \tkzTabVar{
                +/$+\infty$,
                -/$-2$,
                +/$+\infty$
            }
        \end{tikzpicture}
        </script>

=== ":fa-markdown: Markdown"

    ````markdown
    !!! example "Variation table"

        <script
        type="text/tikz"
        data-tex-packages="tkz-tab"
        >
        \begin{tikzpicture}
            \tkzTabInit[
                lgt=4,
                espcl=2.4
            ]
                {
                    $x$/1.2,
                    $f'(x)$/1.2,
                    $f(x)$/2
                }
                {
                    $-\infty$,
                    $1$,
                    $+\infty$
                }

            \tkzTabLine{,-,z,+,}

            \tkzTabVar{
                +/$+\infty$,
                -/$-2$,
                +/$+\infty$
            }
        \end{tikzpicture}
        </script>
    ````

---

## Automatic global `tkz-tab` defaults

TikZJax now converts the global `tkzTab` configuration into native `tkz-tab` defaults.

This means that the source of each table no longer needs to reference `\tikzjaxTkzTab...` macros for the common layout and style options.

Example configuration:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            "tkz-tab": ""
        }
    },

    tkzTab: {
        lineWidth: "1.6pt",
        font: "\\large",
        lgt: 4.5,
        espcl: 2.6
    }
};
```

With this configuration, the following source automatically receives the configured line width, font, first-column width, and column spacing:

=== "Rendering"

    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    >
    \begin{tikzpicture}
        \tkzTabInit
            {
                $x$/1.3,
                $f'(x)=2x-4$/1.3,
                $f(x)=x^2-4x+1$/2.2
            }
            {
                $-\infty$,
                $2$,
                $+\infty$
            }

        \tkzTabLine{,-,z,+,}

        \tkzTabVar{
            +/$+\infty$,
            -/$-3$,
            +/$+\infty$
        }
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    >
    \begin{tikzpicture}
        \tkzTabInit
            {
                $x$/1.3,
                $f'(x)=2x-4$/1.3,
                $f(x)=x^2-4x+1$/2.2
            }
            {
                $-\infty$,
                $2$,
                $+\infty$
            }

        \tkzTabLine{,-,z,+,}

        \tkzTabVar{
            +/$+\infty$,
            -/$-3$,
            +/$+\infty$
        }
    \end{tikzpicture}
    </script>
    ```

The main automatic options are:

| TikZJax option | Native effect |
| --- | --- |
| `tkzTab.lineWidth` | Default `tkz-tab` line width and default `lw` value |
| `tkzTab.font` | Default font applied to table nodes |
| `tkzTab.lgt` | Default first-column width |
| `tkzTab.firstColumnWidth` | Explicit alias that takes priority over `lgt` |
| `tkzTab.espcl` | Default spacing between columns |
| `tkzTab.init` | Additional native defaults for `\tkzTabInit` |
| `tkzTab.setup` | Options passed to `\tkzTabSetup` |
| `tkzTab.colors` | Options passed to `\tkzTabColors` |
| `tkzTab.autoApply` | Enables or disables native automatic application; default: `true` |

For example:

```js
window.TikzJaxOptions = {
    tkzTab: {
        lineWidth: "1.4pt",

        init: {
            deltacl: 0.8
        },

        setup: {
            arrowlinewidth: "1.2pt"
        },

        colors: {
            color: "black",
            backgroundcolor: "white"
        }
    }
};
```

Within the same `tkzTab` object, values in `init` take priority over the equivalent shortcut values. For example, `init.lw` takes priority over `lineWidth` for the default `\tkzTabInit` option.

The complete precedence order is:

```text
native tkz-tab defaults
< built-in TikZJax defaults
< tikzjax.config.js
< local data-tkz-tab
< explicit TeX options such as \tkzTabInit[lw=...]
```

Therefore, an explicit local TeX option still wins:

```latex
\tkzTabInit[
    lgt=3,
    espcl=2,
    lw=0.6pt
]
```

To keep the helper macros but disable automatic native application:

```js
window.TikzJaxOptions = {
    tkzTab: {
        autoApply: false
    }
};
```

### Reusable helper macros

TikZJax still exposes the following macros:

```text
\tikzjaxTkzTabLineWidth
\tikzjaxTkzTabFont
\tikzjaxTkzTabLgt
\tikzjaxTkzTabFirstColumnWidth
\tikzjaxTkzTabEspcl
\tikzjaxTkzTabVariableRowHeight
\tikzjaxTkzTabSignRowHeight
\tikzjaxTkzTabVariationRowHeight
\tikzjaxTkzTabImageRowHeight
\tikzjaxTkzTabAntecedentRowHeight
```

The row-height options remain helper macros rather than automatic package defaults.

Row heights are embedded in the mandatory first argument of `\tkzTabInit`, and TikZJax cannot reliably infer whether a custom row is a variable, sign, variation, image, or antecedent row.

Example:

=== "Rendering"

    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    >
    \begin{tikzpicture}
        \tkzTabInit
            {
                $x$/\tikzjaxTkzTabVariableRowHeight,
                Sign of $f'(x)=2x-4$/\tikzjaxTkzTabSignRowHeight,
                Variations of $f(x)=x^2-4x+1$/\tikzjaxTkzTabVariationRowHeight
            }
            {
                $-\infty$,
                $2$,
                $+\infty$
            }

        \tkzTabLine{,-,z,+,}

        \tkzTabVar{
            +/$+\infty$,
            -/$-3$,
            +/$+\infty$
        }
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
    type="text/tikz"
    data-tex-packages="tkz-tab"
    >
    \begin{tikzpicture}
        \tkzTabInit
            {
                $x$/\tikzjaxTkzTabVariableRowHeight,
                Sign of $f'(x)=2x-4$/\tikzjaxTkzTabSignRowHeight,
                Variations of $f(x)=x^2-4x+1$/\tikzjaxTkzTabVariationRowHeight
            }
            {
                $-\infty$,
                $2$,
                $+\infty$
            }

        \tkzTabLine{,-,z,+,}

        \tkzTabVar{
            +/$+\infty$,
            -/$-3$,
            +/$+\infty$
        }
    \end{tikzpicture}
    </script>
    ```

!!! note

    The global `tkzTab` styling configuration is applied whenever the package is present, even when `tkz-tab` itself is loaded locally with `data-tex-packages`.

    Package loading and styling configuration remain separate concerns.

---

## Local `tkzTab` configuration

A single diagram can override or extend the global `tkzTab` settings with `data-tkz-tab`.

The local values are also applied automatically, so the TikZ source does not need to reference the helper macros:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-tkz-tab='{
    "lineWidth": "1.4pt",
    "font": "\\Large",
    "lgt": 5,
    "espcl": 3
  }'
>
\begin{tikzpicture}
    \tkzTabInit
        {
            $x$/1.4,
            $f'(x)$/1.4,
            $f(x)$/2.4
        }
        {
            $-\infty$,
            $0$,
            $+\infty$
        }

    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/$+\infty$,-/$0$,+/$+\infty$}
\end{tikzpicture}
</script>
```

The local settings are merged with the global TikZJax configuration for this diagram only.

An explicit TeX value remains the final override:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-tkz-tab='{"lineWidth":"1.4pt"}'
>
\begin{tikzpicture}
    \tkzTabInit[lw=0.5pt]
        {$x$/1,$f'(x)$/1,$f(x)$/2}
        {$-\infty$,$0$,$+\infty$}

    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/$+\infty$,-/$0$,+/$+\infty$}
\end{tikzpicture}
</script>
```

In this last example, `lw=0.5pt` takes priority over the local `data-tkz-tab` value.

---

## Combining local options

A diagram can load `tkz-tab`, set a longer timeout, disable the SVG cache, and enable TeX logs at the same time:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-render-timeout="30000"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    \tkzTabInit
        {$x$/1,$f'(x)$/1,$f(x)$/2}
        {$-\infty$,$0$,$+\infty$}

    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/$+\infty$,-/$0$,+/$+\infty$}
\end{tikzpicture}
</script>
```

Use these debugging options only when necessary.

---

## Rendering performance

`tkz-tab` diagrams are generally more expensive than very simple TikZ drawings because the package must:

* initialize its table commands;
* calculate the table layout;
* draw multiple cells, separators, arrows, and labels;
* process mathematical content in each row.

TikZJax renders independent diagrams asynchronously using its worker pool.

For example, three `tkz-tab` diagrams may be compiled concurrently by three workers:

```text
worker 1 -> table A
worker 2 -> table B
worker 3 -> table C
```

Each worker maintains its own in-memory cache of downloaded and decompressed TeX files.

The first `tkz-tab` diagram handled by a worker may therefore take longer than later `tkz-tab` diagrams handled by that same worker.

!!! tip

    Avoid globally loading many unrelated packages together with `tkz-tab`.

    A smaller preamble generally gives faster and more predictable rendering.

---

## Loader size for large tables

Large tables may be wider than the default loading placeholder.

Use `data-width` and `data-height` to reserve more space:

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-width="700"
  data-height="280"
>
\begin{tikzpicture}
    % Large table
\end{tikzpicture}
</script>
```

These values affect only the loading placeholder.

They do not resize the final SVG.

---

## Debugging

### Enable TeX logs

```html
<script
  type="text/tikz"
  data-tex-packages="tkz-tab"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    \tkzTabInit
        {$x$/1,$f'(x)$/1}
        {$-\infty$,$0$,$+\infty$}

    \tkzTabLine{,-,z,+,}
\end{tikzpicture}
</script>
```

### Clear the SVG cache

Run this in the browser console:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

### Inspect global packages

```js
window.TikzJaxOptions?.tex?.texPackages
```

### Inspect the `tkzTab` style configuration

```js
window.TikzJaxOptions?.tkzTab
```

### Missing runtime file

A missing dependency generally appears as:

```text
GET .../tex_files/tkz-tab.sty.gz 404
```

or as another missing `.sty.gz`, `.tex.gz`, or `.code.tex.gz` dependency.

Use the JavaScript bundle and `tex_files` directory from the same TikZJax release.

### Timeout

A timeout appears as:

```text
TikZJax render timeout after 30000ms
```

You can increase the timeout locally:

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

### Undefined `\tkzTabInit`

The package was not loaded.

Use:

```html
data-tex-packages="tkz-tab"
```

or add it globally:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            "tkz-tab": ""
        }
    }
};
```

### A fenced block works locally but not elsewhere

The site where it fails probably does not load `tkz-tab` globally.

Fenced `tikzjax` blocks cannot declare `data-tex-packages`.

Use an HTML `<script>` block for portable local loading.

### The table is clipped while loading

Increase:

```html
data-width
data-height
```

These attributes reserve more space for the loader.

### The first table is slower

The first worker rendering `tkz-tab` must download and decompress its required runtime files.

Subsequent tables assigned to the same worker can reuse those files from memory.

### Changes are not visible

The previous SVG may be stored in IndexedDB.

Use:

```html
data-disable-cache="true"
```

while debugging, or clear the TikZJax database manually.

---

## Related documentation

* [Examples overview](index.md)
* [TikZ examples](tikz.md)
* [Installation](../installation/index.md)
* [Configuration](../configuration.md)
* [API Reference](../api-reference.md)
* [`tkz-tab` on CTAN](https://ctan.org/pkg/tkz-tab)

