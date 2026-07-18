# `physics` Examples

The [`physics`](https://ctan.org/pkg/physics) package provides convenient commands for mathematical notation commonly used in physics:

* vectors and unit vectors;
* derivatives and partial derivatives;
* automatic delimiters;
* absolute values and norms;
* differential elements;
* bra-ket notation;
* commutators and expectation values.

The package is included in the TikZJax runtime, but it is not automatically loaded into every diagram.

For the best performance, load it locally only where it is needed:

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
% TikZ source using physics commands
</script>
```

For other supported packages, return to the [Examples overview](index.md).

---

## Recommended local loading

Use:

```html
data-tex-packages="physics"
```

on each diagram that uses commands provided by the package.

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}
    \node {$\vb{F}=m\vb{a}$};
\end{tikzpicture}
</script>
```

Local packages are merged with globally configured packages.

They do not replace the global configuration.

!!! tip "Why local loading is recommended"

```
The `physics` package affects mathematical notation but is not required by ordinary TikZ drawings.

Loading it only where necessary keeps unrelated diagrams lighter and reduces the amount of work performed by each TeX worker.
```

---

## Force vector

The command `\vb` typesets a vector.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="arrows.meta"
>
\begin{tikzpicture}[
    >=Stealth,
    line width=1.1pt
]

    \fill[
        blue!12,
        draw=blue!70!black,
        rounded corners
    ]
        (0,-0.6) rectangle (2,0.6);

    \node[
        font=\Large
    ] at (1,0) {
        $m$
    };

    \draw[
        -{Stealth[length=4mm]},
        red!75!black,
        very thick
    ]
        (2,0) -- (4.5,0)
        node[
            midway,
            above
        ] {
            $\vb{F}$
        };

    \draw[
        -{Stealth[length=4mm]},
        green!50!black,
        very thick
    ]
        (1,-0.6) -- (1,-2.2)
        node[
            midway,
            right
        ] {
            $\vb{P}=m\vb{g}$
        };

    \node[
        below,
        align=center
    ] at (1,-2.5) {
        $\displaystyle \vb{F}_{\mathrm{net}}=m\vb{a}$
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="arrows.meta"
>
\begin{tikzpicture}[
    >=Stealth,
    line width=1.1pt
]

    \fill[
        blue!12,
        draw=blue!70!black,
        rounded corners
    ]
        (0,-0.6) rectangle (2,0.6);

    \node[
        font=\Large
    ] at (1,0) {
        $m$
    };

    \draw[
        -{Stealth[length=4mm]},
        red!75!black,
        very thick
    ]
        (2,0) -- (4.5,0)
        node[
            midway,
            above
        ] {
            $\vb{F}$
        };

    \draw[
        -{Stealth[length=4mm]},
        green!50!black,
        very thick
    ]
        (1,-0.6) -- (1,-2.2)
        node[
            midway,
            right
        ] {
            $\vb{P}=m\vb{g}$
        };

    \node[
        below,
        align=center
    ] at (1,-2.5) {
        $\displaystyle \vb{F}_{\mathrm{net}}=m\vb{a}$
    };

\end{tikzpicture}
</script>
```
````

This example also uses the TikZ library:

```html
data-tikz-libraries="arrows.meta"
```

The package and the TikZ library are declared separately.

---

## Spring and harmonic oscillator

This example uses:

* `\vb` for vectors;
* `\dv` for derivatives;
* `\qty` for automatic delimiters;
* the TikZ libraries `arrows.meta` and `positioning`.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="arrows.meta,positioning,decorations.pathmorphing"
  data-width="520"
  data-height="280"
>
\begin{tikzpicture}[
    >=Stealth,
    thick,
    mass/.style={
        draw=blue!70!black,
        fill=blue!10,
        rounded corners,
        minimum width=1.4cm,
        minimum height=1cm
    }
]

    \draw[
        very thick
    ]
        (-3,-0.8) -- (-3,0.8);

    \foreach \y in {-0.7,-0.4,...,0.8}
        \draw[
            gray
        ]
            (-3.25,\y-0.2) -- (-3,\y);

    \draw[
        decorate,
        decoration={
            coil,
            aspect=0.45,
            segment length=5pt,
            amplitude=5pt
        },
        blue!70!black,
        very thick
    ]
        (-3,0) -- (0,0);

    \node[
        mass
    ] (m) at (0.8,0) {
        $m$
    };

    \draw[
        -{Stealth[length=4mm]},
        red!75!black,
        very thick
    ]
        (m.west) -- ++(-1.4,0)
        node[
            midway,
            above
        ] {
            $\vb{F}=-k\vb{x}$
        };

    \draw[
        ->,
        gray!70!black
    ]
        (-3,-1.2) -- (3,-1.2)
        node[right] {$x$};

    \node[
        draw,
        rounded corners,
        fill=yellow!12,
        below=1.6cm of m,
        align=center,
        inner sep=7pt
    ] {
        $\displaystyle m\dv[2]{x}{t}+kx=0$\\[4pt]
        $\displaystyle x(t)=A\cos\qty(\omega t+\varphi)$
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="arrows.meta,positioning,decorations.pathmorphing"
  data-width="520"
  data-height="280"
>
\begin{tikzpicture}[
    >=Stealth,
    thick,
    mass/.style={
        draw=blue!70!black,
        fill=blue!10,
        rounded corners,
        minimum width=1.4cm,
        minimum height=1cm
    }
]

    \draw[
        very thick
    ]
        (-3,-0.8) -- (-3,0.8);

    \foreach \y in {-0.7,-0.4,...,0.8}
        \draw[
            gray
        ]
            (-3.25,\y-0.2) -- (-3,\y);

    \draw[
        decorate,
        decoration={
            coil,
            aspect=0.45,
            segment length=5pt,
            amplitude=5pt
        },
        blue!70!black,
        very thick
    ]
        (-3,0) -- (0,0);

    \node[
        mass
    ] (m) at (0.8,0) {
        $m$
    };

    \draw[
        -{Stealth[length=4mm]},
        red!75!black,
        very thick
    ]
        (m.west) -- ++(-1.4,0)
        node[
            midway,
            above
        ] {
            $\vb{F}=-k\vb{x}$
        };

    \draw[
        ->,
        gray!70!black
    ]
        (-3,-1.2) -- (3,-1.2)
        node[right] {$x$};

    \node[
        draw,
        rounded corners,
        fill=yellow!12,
        below=1.6cm of m,
        align=center,
        inner sep=7pt
    ] {
        $\displaystyle m\dv[2]{x}{t}+kx=0$\\[4pt]
        $\displaystyle x(t)=A\cos\qty(\omega t+\varphi)$
    };

\end{tikzpicture}
</script>
```
````

---

## First and second derivatives

The `physics` package provides a compact derivative syntax.

```latex
\dv{f}{x}
\dv[2]{f}{x}
\dv{x}
\dv[2]{x}{t}
```

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}[
    formula/.style={
        draw,
        rounded corners,
        very thick,
        minimum width=4.3cm,
        minimum height=1.1cm,
        align=center
    }
]

    \node[
        formula,
        draw=blue!70!black,
        fill=blue!8
    ] at (0,1.4) {
        $\displaystyle v(t)=\dv{x}{t}$
    };

    \node[
        formula,
        draw=red!70!black,
        fill=red!8
    ] at (0,0) {
        $\displaystyle a(t)=\dv[2]{x}{t}$
    };

    \node[
        formula,
        draw=green!50!black,
        fill=green!8
    ] at (0,-1.4) {
        $\displaystyle \dv{}{t}\qty(\frac12 mv^2)=mva$
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}[
    formula/.style={
        draw,
        rounded corners,
        very thick,
        minimum width=4.3cm,
        minimum height=1.1cm,
        align=center
    }
]

    \node[
        formula,
        draw=blue!70!black,
        fill=blue!8
    ] at (0,1.4) {
        $\displaystyle v(t)=\dv{x}{t}$
    };

    \node[
        formula,
        draw=red!70!black,
        fill=red!8
    ] at (0,0) {
        $\displaystyle a(t)=\dv[2]{x}{t}$
    };

    \node[
        formula,
        draw=green!50!black,
        fill=green!8
    ] at (0,-1.4) {
        $\displaystyle \dv{}{t}\qty(\frac12 mv^2)=mva$
    };

\end{tikzpicture}
</script>
```
````

---

## Partial derivatives

Use `\pdv` for partial derivatives.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="positioning"
>
\begin{tikzpicture}[
    equation/.style={
        draw,
        rounded corners,
        very thick,
        inner sep=8pt,
        minimum width=4cm
    }
]

    \node[
        equation,
        draw=purple!70!black,
        fill=purple!8
    ] (gradient) {
        $\displaystyle
        \vb{\nabla} f
        =
        \qty(
            \pdv{f}{x},
            \pdv{f}{y},
            \pdv{f}{z}
        )
        $
    };

    \node[
        equation,
        draw=orange!80!black,
        fill=orange!10,
        below=0.8cm of gradient
    ] {
        $\displaystyle
        \pdv[2]{u}{t}
        =
        c^2\pdv[2]{u}{x}
        $
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="positioning"
>
\begin{tikzpicture}[
    equation/.style={
        draw,
        rounded corners,
        very thick,
        inner sep=8pt,
        minimum width=4cm
    }
]

    \node[
        equation,
        draw=purple!70!black,
        fill=purple!8
    ] (gradient) {
        $\displaystyle
        \vb{\nabla} f
        =
        \qty(
            \pdv{f}{x},
            \pdv{f}{y},
            \pdv{f}{z}
        )
        $
    };

    \node[
        equation,
        draw=orange!80!black,
        fill=orange!10,
        below=0.8cm of gradient
    ] {
        $\displaystyle
        \pdv[2]{u}{t}
        =
        c^2\pdv[2]{u}{x}
        $
    };

\end{tikzpicture}
</script>
```
````

---

## Automatic delimiters

The command `\qty` automatically adjusts delimiters to their contents.

```latex
\qty(x+1)
\qty[\frac{a}{b}]
\qty{\sum_{n=1}^{\infty} a_n}
```

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}

    \node[
        draw=blue!70!black,
        fill=blue!8,
        rounded corners,
        very thick,
        inner sep=10pt,
        align=center
    ] {
        $\displaystyle
        E
        =
        \qty[
            \frac12 mv^2
            +
            \frac12 kx^2
        ]
        $\\[8pt]
        $\displaystyle
        A\cos\qty(\omega t+\varphi)
        $
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}

    \node[
        draw=blue!70!black,
        fill=blue!8,
        rounded corners,
        very thick,
        inner sep=10pt,
        align=center
    ] {
        $\displaystyle
        E
        =
        \qty[
            \frac12 mv^2
            +
            \frac12 kx^2
        ]
        $\\[8pt]
        $\displaystyle
        A\cos\qty(\omega t+\varphi)
        $
    };

\end{tikzpicture}
</script>
```
````

---

## Absolute values and norms

Use:

```latex
\abs{x}
\norm{\vb{v}}
```

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="arrows.meta"
>
\begin{tikzpicture}[
    >=Stealth
]

    \coordinate (O) at (0,0);
    \coordinate (V) at (3,2);

    \draw[
        ->,
        gray!70!black
    ]
        (-0.5,0) -- (4,0)
        node[right] {$x$};

    \draw[
        ->,
        gray!70!black
    ]
        (0,-0.5) -- (0,3)
        node[above] {$y$};

    \draw[
        -{Stealth[length=4mm]},
        blue,
        very thick
    ]
        (O) -- (V)
        node[
            midway,
            above left
        ] {
            $\vb{v}$
        };

    \draw[
        dashed,
        gray
    ]
        (V) -- (3,0);

    \draw[
        dashed,
        gray
    ]
        (V) -- (0,2);

    \node[
        draw,
        fill=yellow!12,
        rounded corners,
        below
    ] at (2,-0.7) {
        $\displaystyle
        \norm{\vb{v}}
        =
        \sqrt{v_x^2+v_y^2}
        $
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="arrows.meta"
>
\begin{tikzpicture}[
    >=Stealth
]

    \coordinate (O) at (0,0);
    \coordinate (V) at (3,2);

    \draw[
        ->,
        gray!70!black
    ]
        (-0.5,0) -- (4,0)
        node[right] {$x$};

    \draw[
        ->,
        gray!70!black
    ]
        (0,-0.5) -- (0,3)
        node[above] {$y$};

    \draw[
        -{Stealth[length=4mm]},
        blue,
        very thick
    ]
        (O) -- (V)
        node[
            midway,
            above left
        ] {
            $\vb{v}$
        };

    \draw[
        dashed,
        gray
    ]
        (V) -- (3,0);

    \draw[
        dashed,
        gray
    ]
        (V) -- (0,2);

    \node[
        draw,
        fill=yellow!12,
        rounded corners,
        below
    ] at (2,-0.7) {
        $\displaystyle
        \norm{\vb{v}}
        =
        \sqrt{v_x^2+v_y^2}
        $
    };

\end{tikzpicture}
</script>
```
````

---

## Differential elements and integrals

The package provides `\dd` for differential elements.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}

    \node[
        draw=green!50!black,
        fill=green!8,
        rounded corners,
        very thick,
        inner sep=10pt,
        align=center
    ] {
        $\displaystyle
        W
        =
        \int_A^B
        \vb{F}\cdot\dd{\vb{r}}
        $\\[8pt]
        $\displaystyle
        Q
        =
        \int_{t_0}^{t_1}
        I(t)\dd{t}
        $
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}

    \node[
        draw=green!50!black,
        fill=green!8,
        rounded corners,
        very thick,
        inner sep=10pt,
        align=center
    ] {
        $\displaystyle
        W
        =
        \int_A^B
        \vb{F}\cdot\dd{\vb{r}}
        $\\[8pt]
        $\displaystyle
        Q
        =
        \int_{t_0}^{t_1}
        I(t)\dd{t}
        $
    };

\end{tikzpicture}
</script>
```
````

---

## Bra-ket notation

The `physics` package also provides common quantum-mechanics notation.

```latex
\ket{\psi}
\bra{\psi}
\braket{\phi}{\psi}
\mel{\phi}{\hat{A}}{\psi}
\expval{\hat{A}}
```

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="positioning,arrows.meta"
>
\begin{tikzpicture}[
    state/.style={
        draw=purple!70!black,
        fill=purple!8,
        rounded corners,
        very thick,
        minimum width=2.3cm,
        minimum height=1.1cm
    }
]

    \node[
        state
    ] (psi) {
        $\ket{\psi}$
    };

    \node[
        state,
        right=2.5cm of psi,
        fill=blue!8,
        draw=blue!70!black
    ] (phi) {
        $\ket{\phi}$
    };

    \draw[
        -{Stealth[length=4mm]},
        very thick,
        orange!80!black
    ]
        (psi) -- (phi)
        node[
            midway,
            above
        ] {
            $\hat{U}$
        };

    \node[
        below=1cm of psi,
        align=center
    ] {
        $\displaystyle
        \braket{\psi}{\psi}=1
        $
    };

    \node[
        below=1cm of phi,
        align=center
    ] {
        $\displaystyle
        \mel{\phi}{\hat{A}}{\psi}
        $
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="positioning,arrows.meta"
>
\begin{tikzpicture}[
    state/.style={
        draw=purple!70!black,
        fill=purple!8,
        rounded corners,
        very thick,
        minimum width=2.3cm,
        minimum height=1.1cm
    }
]

    \node[
        state
    ] (psi) {
        $\ket{\psi}$
    };

    \node[
        state,
        right=2.5cm of psi,
        fill=blue!8,
        draw=blue!70!black
    ] (phi) {
        $\ket{\phi}$
    };

    \draw[
        -{Stealth[length=4mm]},
        very thick,
        orange!80!black
    ]
        (psi) -- (phi)
        node[
            midway,
            above
        ] {
            $\hat{U}$
        };

    \node[
        below=1cm of psi,
        align=center
    ] {
        $\displaystyle
        \braket{\psi}{\psi}=1
        $
    };

    \node[
        below=1cm of phi,
        align=center
    ] {
        $\displaystyle
        \mel{\phi}{\hat{A}}{\psi}
        $
    };

\end{tikzpicture}
</script>
```
````

---

## Commutators and expectation values

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}

    \node[
        draw=red!70!black,
        fill=red!7,
        rounded corners,
        very thick,
        inner sep=10pt,
        align=center
    ] {
        $\displaystyle
        \comm{\hat{x}}{\hat{p}}
        =
        i\hbar
        $\\[8pt]
        $\displaystyle
        \expval{\hat{H}}{\psi}
        =
        \bra{\psi}\hat{H}\ket{\psi}
        $
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="physics"
>
\begin{tikzpicture}

    \node[
        draw=red!70!black,
        fill=red!7,
        rounded corners,
        very thick,
        inner sep=10pt,
        align=center
    ] {
        $\displaystyle
        \comm{\hat{x}}{\hat{p}}
        =
        i\hbar
        $\\[8pt]
        $\displaystyle
        \expval{\hat{H}}{\psi}
        =
        \bra{\psi}\hat{H}\ket{\psi}
        $
    };

\end{tikzpicture}
</script>
```
````

---

## Loading several packages locally

Several packages can be supplied as a comma-separated list:

```html
<script
  type="text/tikz"
  data-tex-packages="physics,chemfig"
>
% Source using both packages
</script>
```

They can also be declared with JSON:

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "physics": "",
    "xcolor": "dvipsnames"
  }'
>
% Diagram source
</script>
```

Use JSON when a package requires options.

!!! note

```
Loading packages together does not guarantee that every possible combination is conflict-free.

Keep package declarations local and include only the packages required by the diagram.
```

---

## Global loading

Load `physics` globally when most diagrams on the site use it:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            physics: ""
        }
    }
};
```

After global loading, individual diagrams do not need:

```html
data-tex-packages="physics"
```

!!! warning "Performance"

````
A globally configured package is inserted into the preamble of every diagram:

```latex
\usepackage{physics}
```

This is convenient, but it also affects diagrams that do not use any `physics` command.

Prefer local loading unless the package is required throughout the site.
````

---

## MkDocs fenced blocks

A fenced `tikzjax` block cannot declare `data-tex-packages`.

Therefore, fenced blocks using `physics` commands work only when the package is loaded globally.

=== "Rendering"

````
```tikzjax
\begin{tikzpicture}
    \node[
        draw,
        rounded corners,
        fill=blue!8,
        inner sep=8pt
    ] {
        $\displaystyle
        \vb{F}=m\vb{a}
        $
    };
\end{tikzpicture}
```
````

=== ":fa-markdown: Markdown"

`````
````markdown
```tikzjax
\begin{tikzpicture}
    \node[
        draw,
        rounded corners,
        fill=blue!8,
        inner sep=8pt
    ] {
        $\displaystyle
        \vb{F}=m\vb{a}
        $
    };
\end{tikzpicture}
```
````
`````

!!! important

````
For portable local loading, prefer:

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
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

    Represent a force and write Newton's second law.

=== "Solution"

    <script
      type="text/tikz"
      data-tex-packages="physics"
      data-tikz-libraries="arrows.meta"
    >
    \begin{tikzpicture}

        \node[
            draw,
            fill=blue!10,
            rounded corners,
            minimum width=1.5cm,
            minimum height=1cm
        ] (m) {
            $m$
        };

        \draw[
            -{Stealth[length=4mm]},
            red,
            very thick
        ]
            (m.east) -- ++(2,0)
            node[
                midway,
                above
            ] {
                $\vb{F}$
            };

        \node[
            below=0.9cm
        ] at (m) {
            $\vb{F}_{\mathrm{net}}=m\vb{a}$
        };

    \end{tikzpicture}
    </script>
```

=== ":fa-markdown: Markdown"

`````
````markdown
=== "Question"

    Represent a force and write Newton's second law.

=== "Solution"

    <script
      type="text/tikz"
      data-tex-packages="physics"
      data-tikz-libraries="arrows.meta"
    >
    \begin{tikzpicture}

        \node[
            draw,
            fill=blue!10,
            rounded corners,
            minimum width=1.5cm,
            minimum height=1cm
        ] (m) {
            $m$
        };

        \draw[
            -{Stealth[length=4mm]},
            red,
            very thick
        ]
            (m.east) -- ++(2,0)
            node[
                midway,
                above
            ] {
                $\vb{F}$
            };

        \node[
            below=0.9cm
        ] at (m) {
            $\vb{F}_{\mathrm{net}}=m\vb{a}$
        };

    \end{tikzpicture}
    </script>
````
`````

TikZJax automatically rescans MkDocs Material content tabs when they become visible.

---

## Local timeout and debugging

A complex diagram can combine several local options:

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-tikz-libraries="arrows.meta,positioning"
  data-render-timeout="30000"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    \node {$\vb{F}=m\vb{a}$};
\end{tikzpicture}
</script>
```

Use:

```html
data-disable-cache="true"
```

while changing an example, and:

```html
data-show-console="true"
```

when diagnosing a TeX error.

---

## Rendering performance

The `physics` package is relatively lightweight compared with large graphical packages, but it still adds commands to the TeX preamble.

TikZJax renders independent diagrams with an adaptive pool of workers:

```text
worker 1 -> physics diagram A
worker 2 -> physics diagram B
worker 3 -> another TikZ diagram
```

Each worker maintains its own cache of downloaded and decompressed TeX files.

The first `physics` diagram handled by a worker can therefore take longer than later diagrams assigned to the same worker.

Packages loaded globally are processed by every worker for every diagram, including diagrams that do not use their commands.

---

## Common commands

| Command               | Purpose              | Example                 |
| --------------------- | -------------------- | ----------------------- |
| `\vb{v}`              | Vector               | `$\vb{v}$`              |
| `\vu{x}`              | Unit vector          | `$\vu{x}$`              |
| `\dv{f}{x}`           | Derivative           | `$\dv{f}{x}$`           |
| `\dv[2]{f}{x}`        | Second derivative    | `$\dv[2]{f}{x}$`        |
| `\pdv{f}{x}`          | Partial derivative   | `$\pdv{f}{x}$`          |
| `\qty(...)`           | Automatic delimiters | `$\qty(\frac{a}{b})$`   |
| `\abs{x}`             | Absolute value       | `$\abs{x}$`             |
| `\norm{v}`            | Norm                 | `$\norm{\vb{v}}$`       |
| `\dd{x}`              | Differential element | `$\int f(x)\dd{x}$`     |
| `\ket{\psi}`          | Ket                  | `$\ket{\psi}$`          |
| `\bra{\psi}`          | Bra                  | `$\bra{\psi}$`          |
| `\braket{\phi}{\psi}` | Inner product        | `$\braket{\phi}{\psi}$` |
| `\comm{A}{B}`         | Commutator           | `$\comm{A}{B}$`         |
| `\expval{A}`          | Expectation value    | `$\expval{A}$`          |

---

## Debugging

### Enable engine logs

```html
<script
  type="text/tikz"
  data-tex-packages="physics"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    \node {$\dv[2]{x}{t}$};
\end{tikzpicture}
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

### Missing package file

A missing package generally appears as:

```text
GET .../tex_files/physics.sty.gz 404
```

Another dependency may also appear as a missing `.sty.gz`, `.tex.gz`, `.def.gz`, or `.code.tex.gz` file.

Use the TikZJax JavaScript bundle and `tex_files` directory from the same release.

### Timeout

A timeout appears as:

```text
TikZJax render timeout after 30000ms
```

Increase the timeout locally:

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

### Undefined control sequence `\vb`

The `physics` package was not loaded.

Add:

```html
data-tex-packages="physics"
```

or enable it globally.

### `Stealth` is unknown

`Stealth` belongs to the TikZ library `arrows.meta`, not to the `physics` package.

Add:

```html
data-tikz-libraries="arrows.meta"
```

### `right=of` or `below=of` does not work

Relative node placement belongs to the TikZ library `positioning`.

Add:

```html
data-tikz-libraries="positioning"
```

### Spring decorations do not work

A spring drawn with the `coil` decoration requires:

```html
data-tikz-libraries="decorations.pathmorphing"
```

### A fenced block fails

A fenced `tikzjax` block cannot declare local packages.

Load `physics` globally or replace the fenced block with a `<script type="text/tikz">` block.

### Changes are not visible

The previous SVG may be stored in IndexedDB.

Use:

```html
data-disable-cache="true"
```

while debugging, or clear the database manually.

---

## Related documentation

* [Examples overview](index.md)
* [TikZ examples](tikz.md)
* [`tkz-tab` examples](tkz-tab.md)
* [Installation](../installation/index.md)
* [Configuration](../configuration.md)
* [API Reference](../api-reference.md)
* [`physics` on CTAN](https://ctan.org/pkg/physics)
