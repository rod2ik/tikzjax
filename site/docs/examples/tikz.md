# TikZ Examples

TikZ is included in the TikZJax core runtime.

For standard TikZ drawings, you do not need to declare an additional LaTeX package:

```html
<script type="text/tikz">
\begin{tikzpicture}
    % TikZ source
\end{tikzpicture}
</script>
```

Additional TikZ libraries can be loaded globally or, preferably, only for the diagrams that need them.

For other supported packages, return to the [Examples overview](index.md).

## Basic HTML usage

### Circle

=== "Rendering"

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[very thick, blue] (0,0) circle (1);
        \fill[orange] (0,0) circle (2pt);
    \end{tikzpicture}
    </script>


=== ":fa-html5: HTML"

    ```html
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[very thick, blue] (0,0) circle (1);
        \fill[orange] (0,0) circle (2pt);
    \end{tikzpicture}
    </script>
    ```


### Coordinate system and line

=== "Rendering"

    <script type="text/tikz">
    \begin{tikzpicture}[scale=0.9]
        \draw[->, thick] (-1,0) -- (5,0)
            node[right] {$x$};

        \draw[->, thick] (0,-1) -- (0,4)
            node[above] {$y$};

        \draw[
            domain=0:4,
            smooth,
            variable=\x,
            blue,
            very thick
        ]
            plot ({\x},{0.75*\x});

        \node[
            blue,
            above
        ] at (2.7,2.2) {
            $y=\dfrac{3}{4}x$
        };
    \end{tikzpicture}
    </script>


=== ":fa-html5: HTML"

    ```html
    <script type="text/tikz">
    \begin{tikzpicture}[scale=0.9]
        \draw[->, thick] (-1,0) -- (5,0)
            node[right] {$x$};

        \draw[->, thick] (0,-1) -- (0,4)
            node[above] {$y$};

        \draw[
            domain=0:4,
            smooth,
            variable=\x,
            blue,
            very thick
        ]
            plot ({\x},{0.75*\x});

        \node[
            blue,
            above
        ] at (2.7,2.2) {
            $y=\dfrac{3}{4}x$
        };
    \end{tikzpicture}
    </script>
    ```


## MkDocs fenced blocks

When using MkDocs, TikZJax diagrams can also be written with a fenced `tikzjax` block.

=== "Rendering"

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[
            rounded corners,
            very thick,
            fill=blue!10,
            draw=blue!70!black
        ]
            (0,0) rectangle (4,2);

        \node[
            font=\Large,
            text=blue!70!black
        ] at (2,1) {
            TikZJax
        };
    \end{tikzpicture}
    </script>


=== ":fa-markdown: Markdown"

    ````markdown
    ```tikzjax
    \begin{tikzpicture}
        \draw[
            rounded corners,
            very thick,
            fill=blue!10,
            draw=blue!70!black
        ]
            (0,0) rectangle (4,2);

        \node[
            font=\Large,
            text=blue!70!black
        ] at (2,1) {
            TikZJax
        };
    \end{tikzpicture}
    ```
    ````


!!! note

    A fenced `tikzjax` block is convenient for a plain TikZ diagram.

    Use a `<script type="text/tikz">` block when the diagram needs local `data-*` attributes such as:

    ```text
    data-tikz-libraries
    data-tex-packages
    data-render-timeout
    data-disable-cache
    data-show-console
    ```


## MkDocs admonitions

### Standard admonition

=== "Rendering"

    !!! success "Rendered with TikZJax"

        <script type="text/tikz">
        \begin{tikzpicture}
            \draw[
                very thick,
                green!60!black,
                fill=green!10
            ]
                (0,0) circle (1);

            \node[
                green!40!black,
                font=\bfseries
            ] at (0,0) {
                OK
            };
        \end{tikzpicture}
        </script>


=== ":fa-markdown: Markdown"

    ````markdown
    !!! success "Rendered with TikZJax"

        ```tikzjax
        \begin{tikzpicture}
            \draw[
                very thick,
                green!60!black,
                fill=green!10
            ]
                (0,0) circle (1);

            \node[
                green!40!black,
                font=\bfseries
            ] at (0,0) {
                OK
            };
        \end{tikzpicture}
        ```
    ````


### Collapsible admonition

=== "Rendering"

    ??? example "Open the diagram"

        <script type="text/tikz">
        \begin{tikzpicture}
            \draw[
                very thick,
                purple,
                fill=purple!10
            ]
                (-1,-1) rectangle (1,1);

            \draw[
                very thick,
                orange
            ]
                (-1,-1) -- (1,1);

            \draw[
                very thick,
                orange
            ]
                (-1,1) -- (1,-1);
        \end{tikzpicture}
        </script>


=== ":fa-markdown: Markdown"

    ````markdown
    ??? example "Open the diagram"

        ```tikzjax
        \begin{tikzpicture}
            \draw[
                very thick,
                purple,
                fill=purple!10
            ]
                (-1,-1) rectangle (1,1);

            \draw[
                very thick,
                orange
            ]
                (-1,-1) -- (1,1);

            \draw[
                very thick,
                orange
            ]
                (-1,1) -- (1,-1);
        \end{tikzpicture}
        ```
    ````


## MkDocs Content Tabs

TikZJax automatically rescans MkDocs Material content tabs when their content becomes visible.

=== "Rendering"

    === "Question"

        Draw a triangle with three differently colored vertices.

    === "Solution"

        <script type="text/tikz">
        \begin{tikzpicture}
            \coordinate (A) at (0,0);
            \coordinate (B) at (4,0);
            \coordinate (C) at (1.5,2.5);

            \draw[
                very thick,
                fill=blue!8
            ]
                (A) -- (B) -- (C) -- cycle;

            \fill[red] (A) circle (3pt);
            \fill[green!60!black] (B) circle (3pt);
            \fill[blue] (C) circle (3pt);

            \node[below left] at (A) {$A$};
            \node[below right] at (B) {$B$};
            \node[above] at (C) {$C$};
        \end{tikzpicture}
        </script>


=== ":fa-markdown: Markdown"

    ````markdown
    === "Question"

        Draw a triangle with three differently colored vertices.

    === "Solution"

        ```tikzjax
        \begin{tikzpicture}
            \coordinate (A) at (0,0);
            \coordinate (B) at (4,0);
            \coordinate (C) at (1.5,2.5);

            \draw[
                very thick,
                fill=blue!8
            ]
                (A) -- (B) -- (C) -- cycle;

            \fill[red] (A) circle (3pt);
            \fill[green!60!black] (B) circle (3pt);
            \fill[blue] (C) circle (3pt);

            \node[below left] at (A) {$A$};
            \node[below right] at (B) {$B$};
            \node[above] at (C) {$C$};
        \end{tikzpicture}
        ```
    ````


## Cartesian coordinate system

This larger example uses only standard TikZ functionality.

=== "Rendering"

    <script
      type="text/tikz"
      data-width="420"
      data-height="320"
    >
    \begin{tikzpicture}[scale=0.7]

        \draw[
            step=1cm,
            gray!25,
            very thin
        ]
            (-5,-5) grid (5,5);

        \draw[->, thick]
            (-5,0) -- (5,0)
            node[right] {$x$};

        \draw[->, thick]
            (0,-5) -- (0,5)
            node[above] {$y$};

        \foreach \x in {-4,-3,-2,-1,1,2,3,4}
            \draw
                (\x,0.08) --
                (\x,-0.08)
                node[below] {$\x$};

        \foreach \y in {-4,-3,-2,-1,1,2,3,4}
            \draw
                (0.08,\y) --
                (-0.08,\y)
                node[left] {$\y$};

        \draw[
            domain=-0.5:4.5,
            smooth,
            variable=\x,
            blue,
            very thick
        ]
            plot ({\x},{2*\x-4});

        \fill[red] (2,0) circle (3pt);
        \fill[red] (3,2) circle (3pt);

        \node[
            blue,
            fill=white,
            inner sep=2pt
        ] at (3.5,3.4) {
            $y=2x-4$
        };

    \end{tikzpicture}
    </script>


=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-width="420"
      data-height="320"
    >
    \begin{tikzpicture}[scale=0.7]

        \draw[
            step=1cm,
            gray!25,
            very thin
        ]
            (-5,-5) grid (5,5);

        \draw[->, thick]
            (-5,0) -- (5,0)
            node[right] {$x$};

        \draw[->, thick]
            (0,-5) -- (0,5)
            node[above] {$y$};

        \foreach \x in {-4,-3,-2,-1,1,2,3,4}
            \draw
                (\x,0.08) --
                (\x,-0.08)
                node[below] {$\x$};

        \foreach \y in {-4,-3,-2,-1,1,2,3,4}
            \draw
                (0.08,\y) --
                (-0.08,\y)
                node[left] {$\y$};

        \draw[
            domain=-0.5:4.5,
            smooth,
            variable=\x,
            blue,
            very thick
        ]
            plot ({\x},{2*\x-4});

        \fill[red] (2,0) circle (3pt);
        \fill[red] (3,2) circle (3pt);

        \node[
            blue,
            fill=white,
            inner sep=2pt
        ] at (3.5,3.4) {
            $y=2x-4$
        };

    \end{tikzpicture}
    </script>
    ```


## Local TikZ libraries

Use `data-tikz-libraries` when a diagram needs one or more optional TikZ libraries.

```html
<script
  type="text/tikz"
  data-tikz-libraries="calc,positioning"
>
% Diagram source
</script>
```

Multiple library names are separated with commas.

Local libraries are merged with globally configured libraries. They do not replace them.

## `shapes.geometric`

The `shapes.geometric` library provides additional node shapes.

=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="shapes.geometric"
    >
    \begin{tikzpicture}

        \node[
            star,
            star points=5,
            star point ratio=2.4,
            minimum size=2.2cm,
            draw=orange!80!black,
            fill=yellow!55,
            very thick
        ] {};

    \end{tikzpicture}
    </script>


=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="shapes.geometric"
    >
    \begin{tikzpicture}

        \node[
            star,
            star points=5,
            star point ratio=2.4,
            minimum size=2.2cm,
            draw=orange!80!black,
            fill=yellow!55,
            very thick
        ] {};

    \end{tikzpicture}
    </script>
    ```


## `calc`

The `calc` library provides coordinate calculations.

=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="calc"
    >
    \begin{tikzpicture}

        \coordinate (A) at (-2,0);
        \coordinate (B) at (2,0);

        \draw[
            blue,
            very thick
        ]
            (A) -- (B);

        \fill[red]
            ($(A)!0.5!(B)$)
            circle (4pt);

        \node[below] at (A) {$A$};
        \node[below] at (B) {$B$};

        \node[
            above,
            red
        ] at ($(A)!0.5!(B)$) {
            midpoint
        };

    \end{tikzpicture}
    </script>


=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="calc"
    >
    \begin{tikzpicture}

        \coordinate (A) at (-2,0);
        \coordinate (B) at (2,0);

        \draw[
            blue,
            very thick
        ]
            (A) -- (B);

        \fill[red]
            ($(A)!0.5!(B)$)
            circle (4pt);

        \node[below] at (A) {$A$};
        \node[below] at (B) {$B$};

        \node[
            above,
            red
        ] at ($(A)!0.5!(B)$) {
            midpoint
        };

    \end{tikzpicture}
    </script>
    ```


## `positioning`

The `positioning` library places nodes relative to other nodes.

=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="positioning,arrows.meta"
    >
    \begin{tikzpicture}[
        box/.style={
            draw=blue!70!black,
            fill=blue!8,
            rounded corners,
            very thick,
            minimum width=2.2cm,
            minimum height=1cm
        }
    ]

        \node[box] (A) {
            Start
        };

        \node[
            box,
            right=1.8cm of A
        ] (B) {
            Process
        };

        \node[
            box,
            right=1.8cm of B
        ] (C) {
            Result
        };

        \draw[
            -{Stealth[length=4mm]},
            very thick,
            orange!80!black
        ]
            (A) -- (B);

        \draw[
            -{Stealth[length=4mm]},
            very thick,
            green!60!black
        ]
            (B) -- (C);

    \end{tikzpicture}
    </script>


=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="positioning,arrows.meta"
    >
    \begin{tikzpicture}[
        box/.style={
            draw=blue!70!black,
            fill=blue!8,
            rounded corners,
            very thick,
            minimum width=2.2cm,
            minimum height=1cm
        }
    ]

        \node[box] (A) {
            Start
        };

        \node[
            box,
            right=1.8cm of A
        ] (B) {
            Process
        };

        \node[
            box,
            right=1.8cm of B
        ] (C) {
            Result
        };

        \draw[
            -{Stealth[length=4mm]},
            very thick,
            orange!80!black
        ]
            (A) -- (B);

        \draw[
            -{Stealth[length=4mm]},
            very thick,
            green!60!black
        ]
            (B) -- (C);

    \end{tikzpicture}
    </script>
    ```


## `patterns`

The `patterns` library provides reusable fill patterns.

=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="patterns"
    >
    \begin{tikzpicture}

        \draw[
            very thick,
            blue,
            pattern=north east lines
        ]
            (-2,0) rectangle (0,1.4);

        \draw[
            very thick,
            red,
            pattern=dots
        ]
            (0.6,0) rectangle (2.6,1.4);

        \node at (-1,-0.45) {
            lines
        };

        \node at (1.6,-0.45) {
            dots
        };

    \end{tikzpicture}
    </script>


=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="patterns"
    >
    \begin{tikzpicture}

        \draw[
            very thick,
            blue,
            pattern=north east lines
        ]
            (-2,0) rectangle (0,1.4);

        \draw[
            very thick,
            red,
            pattern=dots
        ]
            (0.6,0) rectangle (2.6,1.4);

        \node at (-1,-0.45) {
            lines
        };

        \node at (1.6,-0.45) {
            dots
        };

    \end{tikzpicture}
    </script>
    ```


## `arrows.meta`

The `arrows.meta` library provides modern and configurable arrow tips.

=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="arrows.meta"
    >
    \begin{tikzpicture}

        \draw[
            -{Stealth[length=5mm]},
            blue,
            ultra thick
        ]
            (-2,0) -- (2,0);

        \node[
            above,
            blue!70!black
        ] at (0,0) {
            Stealth arrow
        };

    \end{tikzpicture}
    </script>


=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="arrows.meta"
    >
    \begin{tikzpicture}

        \draw[
            -{Stealth[length=5mm]},
            blue,
            ultra thick
        ]
            (-2,0) -- (2,0);

        \node[
            above,
            blue!70!black
        ] at (0,0) {
            Stealth arrow
        };

    \end{tikzpicture}
    </script>
    ```


## Combining several TikZ libraries

This diagram loads:

* `arrows.meta`;
* `calc`;
* `positioning`;
* `decorations.pathreplacing`.

=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="arrows.meta,calc,positioning,decorations.pathreplacing"
    >
    \begin{tikzpicture}[
        box/.style={
            draw,
            rounded corners,
            very thick,
            inner sep=7pt,
            fill=blue!8
        }
    ]

        \node[box] (A) {
            Input
        };

        \node[
            box,
            right=3cm of A,
            fill=green!10
        ] (B) {
            Output
        };

        \draw[
            -{Stealth[length=4mm]},
            very thick,
            purple
        ]
            (A) -- (B);

        \draw[
            decorate,
            decoration={
                brace,
                amplitude=6pt
            },
            orange!80!black,
            thick
        ]
            ($(A.south)+(0,-0.35)$) --
            ($(B.south)+(0,-0.35)$)
            node[
                midway,
                below=8pt
            ] {
                combined libraries
            };

        \fill[
            red
        ]
            ($(A)!0.5!(B)$)
            circle (3pt);

        \node[
            above=3pt,
            red
        ] at ($(A)!0.5!(B)$) {
            midpoint
        };

    \end{tikzpicture}
    </script>


=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="arrows.meta,calc,positioning,decorations.pathreplacing"
    >
    \begin{tikzpicture}[
        box/.style={
            draw,
            rounded corners,
            very thick,
            inner sep=7pt,
            fill=blue!8
        }
    ]

        \node[box] (A) {
            Input
        };

        \node[
            box,
            right=3cm of A,
            fill=green!10
        ] (B) {
            Output
        };

        \draw[
            -{Stealth[length=4mm]},
            very thick,
            purple
        ]
            (A) -- (B);

        \draw[
            decorate,
            decoration={
                brace,
                amplitude=6pt
            },
            orange!80!black,
            thick
        ]
            ($(A.south)+(0,-0.35)$) --
            ($(B.south)+(0,-0.35)$)
            node[
                midway,
                below=8pt
            ] {
                combined libraries
            };

        \fill[
            red
        ]
            ($(A)!0.5!(B)$)
            circle (3pt);

        \node[
            above=3pt,
            red
        ] at ($(A)!0.5!(B)$) {
            midpoint
        };

    \end{tikzpicture}
    </script>
    ```


## Built-in TikZ electrical circuits

PGF/TikZ includes its own electrical circuit libraries.

These are different from the external [`circuitikz`](circuitikz.md) package.

!!! warning

    Do not load these libraries globally when the external `circuitikz` package is also used:

    ```text
    circuits
    circuits.ee
    circuits.ee.IEC
    ```

    The two systems may conflict.

    Load the built-in TikZ circuit libraries locally only for the relevant diagram.


=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="circuits,circuits.ee,circuits.ee.IEC"
    >
    \begin{tikzpicture}[
        circuit ee IEC,
        every circuit symbol/.style={
            draw,
            thick
        },
        thick
    ]

        \draw
            (0,0)
            to[battery={info=$9\,\mathrm{V}$}] (0,2)
            to[resistor={info=$R$}] (3,2)
            to[capacitor={info=$C$}] (3,0)
            -- (0,0);

    \end{tikzpicture}
    </script>


=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="circuits,circuits.ee,circuits.ee.IEC"
    >
    \begin{tikzpicture}[
        circuit ee IEC,
        every circuit symbol/.style={
            draw,
            thick
        },
        thick
    ]

        \draw
            (0,0)
            to[battery={info=$9\,\mathrm{V}$}] (0,2)
            to[resistor={info=$R$}] (3,2)
            to[capacitor={info=$C$}] (3,0)
            -- (0,0);

    \end{tikzpicture}
    </script>
    ```


For the external package syntax, see the dedicated [circuitikz examples](circuitikz.md).

## Local preamble

Use `data-add-to-preamble` when a command is required by one diagram only.

The local `data-add-to-preamble` value replaces the configured custom `tex.addToPreamble` string for that diagram.

TikZJax-generated preamble content remains available.

=== "Rendering"

    <script
      type="text/tikz"
      data-add-to-preamble="\newcommand{\R}{\mathbb{R}}\newcommand{\vect}[1]{\overrightarrow{#1}}"
    >
    \begin{tikzpicture}

        \node[
            draw,
            rounded corners,
            fill=blue!8,
            very thick,
            inner sep=8pt
        ] {
            $f:\R\to\R$
        };

        \node[
            below=0.8cm
        ] at (0,0) {
            $\vect{AB}$
        };

    \end{tikzpicture}
    </script>


=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-add-to-preamble="\newcommand{\R}{\mathbb{R}}\newcommand{\vect}[1]{\overrightarrow{#1}}"
    >
    \begin{tikzpicture}

        \node[
            draw,
            rounded corners,
            fill=blue!8,
            very thick,
            inner sep=8pt
        ] {
            $f:\R\to\R$
        };

        \node[
            below=0.8cm
        ] at (0,0) {
            $\vect{AB}$
        };

    \end{tikzpicture}
    </script>
    ```


## Local JSON configuration

Use `data-tikzjax-options` when a diagram needs several local options.

```html
<script
  type="text/tikz"
  data-tikzjax-options='{
    "renderTimeout": 30000,
    "tex": {
      "tikzLibraries": [
        "arrows.meta",
        "positioning"
      ]
    }
  }'
>
\begin{tikzpicture}
    % Diagram source
\end{tikzpicture}
</script>
```

Local options are recursively merged with the global `window.TikzJaxOptions` configuration.

Arrays such as TikZ library lists are combined and deduplicated.

## Local render timeout

Use `data-render-timeout` when one complex diagram needs more time than the global timeout.

```html
<script
  type="text/tikz"
  data-render-timeout="30000"
>
\begin{tikzpicture}
    \draw[thick] (0,0) circle (1);
\end{tikzpicture}
</script>
```

The value is expressed in milliseconds.

## Loader dimensions

Use `data-width` and `data-height` to reserve space for the loading indicator before the diagram is ready.

```html
<script
  type="text/tikz"
  data-width="240"
  data-height="140"
>
\begin{tikzpicture}
    \draw[
        rounded corners,
        very thick
    ]
        (0,0) rectangle (5,2);

    \node at (2.5,1) {
        Custom loader size
    };
\end{tikzpicture}
</script>
```

The values control the placeholder size, not the final SVG dimensions.

## Disable the SVG cache

TikZJax stores successfully rendered SVG output in IndexedDB.

Use `data-disable-cache="true"` while actively debugging one diagram:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
>
\begin{tikzpicture}
    \draw[thick] (0,0) circle (1);
    \node at (0,0) {cache bypass};
\end{tikzpicture}
</script>
```

!!! note

    This option disables the TikZJax IndexedDB SVG cache for the diagram.

    It does not disable the browser HTTP cache used for runtime files.


## TeX console output

Use `data-show-console="true"` to display TeX engine output in the browser console:

```html
<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    \draw[blue, very thick] (0,0) circle (1);
\end{tikzpicture}
</script>
```

This is especially useful for diagnosing:

* invalid TeX or TikZ syntax;
* missing package files;
* missing TikZ library files;
* runtime timeouts;
* package conflicts.

## Performance timings

Use `data-debug-timings="true"` or `data-show-timings="true"` to log rendering timings for one diagram:

```html
<script
  type="text/tikz"
  data-debug-timings="true"
>
\begin{tikzpicture}
    \draw[very thick] (0,0) circle (1);
\end{tikzpicture}
</script>
```

The worker can report timings for stages such as:

```text
TeX compilation
DVI to HTML
```

## Parallel rendering

When a page contains several diagrams, TikZJax places them in a global rendering queue.

Several independent workers can compile different diagrams concurrently:

```text
worker 1 -> diagram A
worker 2 -> diagram B
worker 3 -> diagram C
```

Each diagram is inserted into the document as soon as its own rendering finishes.

This means that a later but simpler diagram may appear before an earlier, more complex diagram.

TikZJax also prioritizes diagrams that are visible or close to the current browser viewport.

The worker pool is configured globally:

```js
window.TikzJaxOptions = {
    workerPool: {
        enabled: true,
        maxWorkers: 3,
        reserveCpuCores: 1,
        useDeviceMemory: true,
        initializationRetries: 1
    }
};
```

No worker is initialized on a page that contains no TikZJax diagram.

## Identical diagrams

When several identical diagrams are discovered at the same time, TikZJax can group them into one pending render operation.

The resulting SVG output is then reused for each matching target.

This avoids compiling the same source and configuration several times unnecessarily.

## Render-completion event

TikZJax dispatches a `tikzjax-load-finished` event from each completed SVG.

```js
document.addEventListener(
    "tikzjax-load-finished",
    function (event) {
        const svg = event.target;

        console.log(
            "TikZJax SVG rendered:",
            svg
        );
    }
);
```

This can be used to:

* post-process generated SVG elements;
* collect performance metrics;
* integrate TikZJax with another frontend component;
* run code after an individual diagram is available.

## Local broken-image fallback

A diagram can use its own error image with `data-broken-image-src`.

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

This changes only the fallback image for the current diagram.

## Intentional error example

The following source is intentionally invalid and should display the configured broken-image fallback.

=== "Rendering"

    <script
      type="text/tikz"
      data-disable-cache="true"
    >
    \begin{tikzpicture}
        \draw (0,0) -- (2,2);
    </script>


=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-disable-cache="true"
    >
    \begin{tikzpicture}
        \draw (0,0) -- (2,2);
    </script>
    ```


## Debugging

### Clear the TikZJax SVG cache

Run this in the browser console:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

### Inspect global TikZ libraries

```js
window.TikzJaxOptions?.tex?.tikzLibraries
```

### Inspect global TeX packages

```js
window.TikzJaxOptions?.tex?.texPackages
```

### Missing TikZ library file

A missing library commonly appears in the browser console as:

```text
GET .../tex_files/tikzlibraryname.code.tex.gz 404
```

Some TikZ libraries may also require a PGF implementation file:

```text
GET .../tex_files/pgflibraryname.code.tex.gz 404
```

When using the npm or jsDelivr distribution, use the runtime files shipped with the same TikZJax version as the JavaScript bundle.

When maintaining a custom CDN, verify that all generated files from `dist/tex_files/` are deployed together.

### Timeout

A timeout appears as:

```text
TikZJax render timeout after 30000ms
```

Possible solutions include:

* increasing `data-render-timeout` for the diagram;
* increasing the global `renderTimeout`;
* checking whether a runtime file request is slow or missing;
* reducing unnecessarily global packages and libraries.

## Related documentation

* [Examples overview](index.md)
* [Installation](../installation/index.md)
* [Configuration](../configuration.md)
* [API Reference](../api-reference.md)
* [circuitikz examples](circuitikz.md)

