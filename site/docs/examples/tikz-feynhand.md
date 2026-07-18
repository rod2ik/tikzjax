# `tikz-feynhand` Examples

[`tikz-feynhand`](https://ctan.org/pkg/tikz-feynhand) is a TikZ-based package for drawing Feynman diagrams with manually positioned vertices.

It supports:

* fermion and anti-fermion propagators;
* photons and other bosons;
* gluons;
* scalar particles;
* ghosts and Majorana particles;
* interaction vertices;
* particle and propagator labels;
* momentum arrows;
* curved propagators;
* insertions;
* crossing propagators;
* custom colors and dimensions.

The package is included in the TikZJax runtime, but it is not automatically loaded into every diagram.

For the best performance, load it locally only where it is needed:

```html
<script
  type="text/tikz"
  data-tex-packages="tikz-feynhand"
>
\begin{tikzpicture}
\begin{feynhand}
    % Vertices and propagators
\end{feynhand}
\end{tikzpicture}
</script>
```

For other supported packages, return to the [Examples overview](index.md).

---

## Recommended local loading

Use:

```html
data-tex-packages="tikz-feynhand"
```

on each diagram containing a `feynhand` environment.

```html
<script
  type="text/tikz"
  data-tex-packages="tikz-feynhand"
>
\begin{tikzpicture}
\begin{feynhand}

    \vertex (a) at (-1.5,0);
    \vertex (b) at (1.5,0);

    \propag[fermion] (a) to (b);

\end{feynhand}
\end{tikzpicture}
</script>
```

Local packages are merged with globally configured packages.

They do not replace the global configuration.

!!! tip "Why local loading is recommended"

    `tikz-feynhand` is required only by Feynman diagrams.

    Loading it locally:

    - keeps ordinary TikZ diagrams lighter;
    - avoids processing particle styles in unrelated diagrams;
    - reduces unnecessary package initialization;
    - limits possible package interactions;
    - keeps the configuration of each diagram explicit.

---

## Basic interaction vertex

This example contains:

* an incoming fermion;
* an incoming anti-fermion;
* an outgoing photon;
* a visible interaction vertex.

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-1.5,-1);
        \vertex (b) at (1.5,-1);
        \vertex (c) at (0,1.5);

        \vertex[dot] (o) at (0,0) {};

        \propag[fermion]
            (a) to (o);

        \propag[anti fermion]
            (b) to (o);

        \propag[photon]
            (o) to (c);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-1.5,-1);
        \vertex (b) at (1.5,-1);
        \vertex (c) at (0,1.5);

        \vertex[dot] (o) at (0,0) {};

        \propag[fermion]
            (a) to (o);

        \propag[anti fermion]
            (b) to (o);

        \propag[photon]
            (o) to (c);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

No additional TikZ library is required for this example.

---

## Diagram structure

A standard diagram uses:

```latex
\begin{tikzpicture}
\begin{feynhand}

    % Vertices

    % Propagators

\end{feynhand}
\end{tikzpicture}
```

The `feynhand` environment must be placed inside `tikzpicture`.

All `\vertex` and `\propag` commands must end with a semicolon:

```latex
\vertex (a) at (0,0);
\vertex (b) at (2,0);

\propag[fermion] (a) to (b);
```

!!! warning

    A missing semicolon can prevent the whole diagram from compiling.

---

## Manually positioned vertices

`TikZ-FeynHand` uses manually positioned vertices.

```latex
\vertex (a) at (-2,0);
\vertex (b) at (0,0);
\vertex (c) at (2,0);
```

The names:

```text
a
b
c
```

are internal references.

They are not displayed in the final diagram unless content or a particle label is explicitly added.

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-2,0);
        \vertex[dot] (b) at (0,0) {};
        \vertex (c) at (2,0);

        \propag[fermion]
            (a) to (b);

        \propag[fermion]
            (b) to (c);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-2,0);
        \vertex[dot] (b) at (0,0) {};
        \vertex (c) at (2,0);

        \propag[fermion]
            (a) to (b);

        \propag[fermion]
            (b) to (c);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

---

## Bare and visible vertices

### Bare vertex

A bare vertex defines a coordinate without drawing a symbol:

```latex
\vertex (a) at (0,0);
```

Do not add an empty content argument to a bare vertex.

### Dot vertex

A visible interaction dot uses:

```latex
\vertex[dot] (v) at (0,0) {};
```

The final empty argument is important for visible vertex styles.

### Other vertex styles

Examples include:

```latex
\vertex[ringdot] (v) at (0,0) {};
\vertex[squaredot] (v) at (0,0) {};
\vertex[crossdot] (v) at (0,0) {};
\vertex[blob] (v) at (0,0) {};
\vertex[ringblob] (v) at (0,0) {};
```

---

## Vertex styles

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="620"
      data-height="190"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[dot]
            (a) at (-3,0) {};

        \vertex[ringdot]
            (b) at (-1.5,0) {};

        \vertex[squaredot]
            (c) at (0,0) {};

        \vertex[crossdot]
            (d) at (1.5,0) {};

        \vertex[blob]
            (e) at (3,0) {};

        \node[below=7pt] at (a) {dot};
        \node[below=7pt] at (b) {ringdot};
        \node[below=7pt] at (c) {squaredot};
        \node[below=7pt] at (d) {crossdot};
        \node[below=7pt] at (e) {blob};

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="620"
      data-height="190"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[dot]
            (a) at (-3,0) {};

        \vertex[ringdot]
            (b) at (-1.5,0) {};

        \vertex[squaredot]
            (c) at (0,0) {};

        \vertex[crossdot]
            (d) at (1.5,0) {};

        \vertex[blob]
            (e) at (3,0) {};

        \node[below=7pt] at (a) {dot};
        \node[below=7pt] at (b) {ringdot};
        \node[below=7pt] at (c) {squaredot};
        \node[below=7pt] at (d) {crossdot};
        \node[below=7pt] at (e) {blob};

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

Ordinary TikZ commands such as `\node` remain available inside the environment.

---

## Particle labels

Use the `particle` vertex style for incoming and outgoing particle labels:

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="520"
      data-height="250"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[particle]
            (e1) at (-2,-1)
            {$e^-$};

        \vertex[particle]
            (e2) at (-2,1)
            {$e^+$};

        \vertex[dot]
            (v) at (0,0) {};

        \vertex[particle]
            (g) at (2,0)
            {$\gamma$};

        \propag[fermion]
            (e1) to (v);

        \propag[anti fermion]
            (e2) to (v);

        \propag[photon]
            (v) to (g);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="520"
      data-height="250"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[particle]
            (e1) at (-2,-1)
            {$e^-$};

        \vertex[particle]
            (e2) at (-2,1)
            {$e^+$};

        \vertex[dot]
            (v) at (0,0) {};

        \vertex[particle]
            (g) at (2,0)
            {$\gamma$};

        \propag[fermion]
            (e1) to (v);

        \propag[anti fermion]
            (e2) to (v);

        \propag[photon]
            (v) to (g);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

Particle labels are generally most useful for external incoming or outgoing lines.

---

## Propagator styles

Common long-form propagator styles include:

```text
plain
fermion
anti fermion
photon
boson
charged boson
anti charged boson
gluon
scalar
charged scalar
anti charged scalar
ghost
charged ghost
anti charged ghost
majorana
anti majorana
```

`TikZ-FeynHand` also provides shorter aliases:

| Short style | Long style            |
| ----------- | --------------------- |
| `fer`       | `fermion`             |
| `antfer`    | `anti fermion`        |
| `pho`       | `photon`              |
| `bos`       | `boson`               |
| `chabos`    | `charged boson`       |
| `antbos`    | `anti charged boson`  |
| `glu`       | `gluon`               |
| `sca`       | `scalar`              |
| `chasca`    | `charged scalar`      |
| `antsca`    | `anti charged scalar` |
| `gho`       | `ghost`               |
| `chagho`    | `charged ghost`       |
| `antgho`    | `anti charged ghost`  |
| `maj`       | `majorana`            |
| `antmaj`    | `anti majorana`       |

Both forms are supported:

```latex
\propag[fermion] (a) to (b);
\propag[fer] (a) to (b);
```

The long forms are often clearer in documentation.

---

## Propagator gallery

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="640"
      data-height="430"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a1) at (-2,3);
        \vertex (b1) at (2,3);
        \propag[fermion,blue]
            (a1) to (b1);
        \node[left] at (a1) {fermion};

        \vertex (a2) at (-2,2);
        \vertex (b2) at (2,2);
        \propag[anti fermion,red]
            (a2) to (b2);
        \node[left] at (a2) {anti fermion};

        \vertex (a3) at (-2,1);
        \vertex (b3) at (2,1);
        \propag[photon,orange]
            (a3) to (b3);
        \node[left] at (a3) {photon};

        \vertex (a4) at (-2,0);
        \vertex (b4) at (2,0);
        \propag[gluon,green!50!black]
            (a4) to (b4);
        \node[left] at (a4) {gluon};

        \vertex (a5) at (-2,-1);
        \vertex (b5) at (2,-1);
        \propag[scalar,purple]
            (a5) to (b5);
        \node[left] at (a5) {scalar};

        \vertex (a6) at (-2,-2);
        \vertex (b6) at (2,-2);
        \propag[ghost,cyan!60!black]
            (a6) to (b6);
        \node[left] at (a6) {ghost};

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="640"
      data-height="430"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a1) at (-2,3);
        \vertex (b1) at (2,3);
        \propag[fermion,blue]
            (a1) to (b1);
        \node[left] at (a1) {fermion};

        \vertex (a2) at (-2,2);
        \vertex (b2) at (2,2);
        \propag[anti fermion,red]
            (a2) to (b2);
        \node[left] at (a2) {anti fermion};

        \vertex (a3) at (-2,1);
        \vertex (b3) at (2,1);
        \propag[photon,orange]
            (a3) to (b3);
        \node[left] at (a3) {photon};

        \vertex (a4) at (-2,0);
        \vertex (b4) at (2,0);
        \propag[gluon,green!50!black]
            (a4) to (b4);
        \node[left] at (a4) {gluon};

        \vertex (a5) at (-2,-1);
        \vertex (b5) at (2,-1);
        \propag[scalar,purple]
            (a5) to (b5);
        \node[left] at (a5) {scalar};

        \vertex (a6) at (-2,-2);
        \vertex (b6) at (2,-2);
        \propag[ghost,cyan!60!black]
            (a6) to (b6);
        \node[left] at (a6) {ghost};

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

---

## Electron scattering through a photon

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="560"
      data-height="330"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[particle]
            (i1) at (-2.5,1.5)
            {$e^-$};

        \vertex[particle]
            (i2) at (-2.5,-1.5)
            {$e^-$};

        \vertex[dot]
            (v1) at (0,1) {};

        \vertex[dot]
            (v2) at (0,-1) {};

        \vertex[particle]
            (f1) at (2.5,1.5)
            {$e^-$};

        \vertex[particle]
            (f2) at (2.5,-1.5)
            {$e^-$};

        \propag[fermion]
            (i1) to (v1);

        \propag[fermion]
            (v1) to (f1);

        \propag[fermion]
            (i2) to (v2);

        \propag[fermion]
            (v2) to (f2);

        \propag[photon,blue]
            (v1) to
            [edge label=$\gamma$]
            (v2);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="560"
      data-height="330"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[particle]
            (i1) at (-2.5,1.5)
            {$e^-$};

        \vertex[particle]
            (i2) at (-2.5,-1.5)
            {$e^-$};

        \vertex[dot]
            (v1) at (0,1) {};

        \vertex[dot]
            (v2) at (0,-1) {};

        \vertex[particle]
            (f1) at (2.5,1.5)
            {$e^-$};

        \vertex[particle]
            (f2) at (2.5,-1.5)
            {$e^-$};

        \propag[fermion]
            (i1) to (v1);

        \propag[fermion]
            (v1) to (f1);

        \propag[fermion]
            (i2) to (v2);

        \propag[fermion]
            (v2) to (f2);

        \propag[photon,blue]
            (v1) to
            [edge label=$\gamma$]
            (v2);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

---

## Propagator labels

A label can be added to the `to` operation:

```latex
\propag[fermion]
    (a) to
    [edge label=$p$]
    (b);
```

Use the primed version to place the label on the other side:

```latex
\propag[fermion]
    (a) to
    [edge label'=$p$]
    (b);
```

The left and right sides are relative to the propagator direction.

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="520"
      data-height="240"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a1) at (-2,-1);
        \vertex (a2) at (0,1);

        \vertex (b1) at (0,1);
        \vertex (b2) at (2,-1);

        \propag[
            fermion,
            blue
        ]
            (a1) to
            [edge label=$p$]
            (a2);

        \propag[
            fermion,
            red
        ]
            (b1) to
            [edge label'=$q$]
            (b2);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="520"
      data-height="240"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a1) at (-2,-1);
        \vertex (a2) at (0,1);

        \vertex (b1) at (0,1);
        \vertex (b2) at (2,-1);

        \propag[
            fermion,
            blue
        ]
            (a1) to
            [edge label=$p$]
            (a2);

        \propag[
            fermion,
            red
        ]
            (b1) to
            [edge label'=$q$]
            (b2);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

---

## Momentum arrows

Use `momentum` or the shorter `mom` key:

```latex
\propag[
    fermion,
    mom={$p$}
]
    (a) to (b);
```

A reversed momentum arrow can use:

```latex
reversed momentum
```

or the shorter form:

```latex
revmom
```

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="520"
      data-height="230"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-2,0);
        \vertex[dot] (v) at (0,0) {};
        \vertex (b) at (2,0);

        \propag[
            fermion,
            blue,
            mom={$p$}
        ]
            (a) to (v);

        \propag[
            fermion,
            red,
            revmom'={$q$}
        ]
            (v) to (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="520"
      data-height="230"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-2,0);
        \vertex[dot] (v) at (0,0) {};
        \vertex (b) at (2,0);

        \propag[
            fermion,
            blue,
            mom={$p$}
        ]
            (a) to (v);

        \propag[
            fermion,
            red,
            revmom'={$q$}
        ]
            (v) to (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

!!! note

    `edge label` is an option of the `to` path:

    ```latex
    to [edge label=$p$]
    ```

    Momentum is an option of `\propag`:

    ```latex
    \propag[mom={$p$}]
    ```

---

## Curved propagators

TikZ path options can control the propagator curvature.

Use:

```text
out
in
looseness
```

Example:

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="520"
      data-height="280"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[dot]
            (a) at (-2,0) {};

        \vertex[dot]
            (b) at (2,0) {};

        \propag[
            fermion,
            blue
        ]
            (a) to
            [
                out=70,
                in=110,
                looseness=1.4,
                edge label=$e^-$
            ]
            (b);

        \propag[
            photon,
            orange
        ]
            (a) to
            [
                out=-70,
                in=-110,
                looseness=1.4,
                edge label'=$\gamma$
            ]
            (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="520"
      data-height="280"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[dot]
            (a) at (-2,0) {};

        \vertex[dot]
            (b) at (2,0) {};

        \propag[
            fermion,
            blue
        ]
            (a) to
            [
                out=70,
                in=110,
                looseness=1.4,
                edge label=$e^-$
            ]
            (b);

        \propag[
            photon,
            orange
        ]
            (a) to
            [
                out=-70,
                in=-110,
                looseness=1.4,
                edge label'=$\gamma$
            ]
            (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

Angles use the standard TikZ coordinate system:

```text
0°   right
90°  up
180° left
270° down
```

---

## Half-circle propagator

Convenience keys include:

```text
half left
half right
quarter left
quarter right
```

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="500"
      data-height="270"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[dot]
            (a) at (-2,0) {};

        \vertex[dot]
            (b) at (2,0) {};

        \propag[
            fermion,
            blue
        ]
            (a) to
            [
                half left,
                looseness=1.2
            ]
            (b);

        \propag[
            anti fermion,
            red
        ]
            (a) to
            [
                half right,
                looseness=1.2
            ]
            (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="500"
      data-height="270"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[dot]
            (a) at (-2,0) {};

        \vertex[dot]
            (b) at (2,0) {};

        \propag[
            fermion,
            blue
        ]
            (a) to
            [
                half left,
                looseness=1.2
            ]
            (b);

        \propag[
            anti fermion,
            red
        ]
            (a) to
            [
                half right,
                looseness=1.2
            ]
            (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

---

## Crossing propagators

The `top` style places one propagator visually above another.

Draw the lower propagator first, then draw the propagator that must cross on top.

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="460"
      data-height="260"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-2,-1);
        \vertex (b) at (2,1);

        \vertex (c) at (-2,1);
        \vertex (d) at (2,-1);

        \propag[
            charged boson,
            orange
        ]
            (c) to (d);

        \propag[
            fermion,
            blue,
            top
        ]
            (a) to (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="460"
      data-height="260"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-2,-1);
        \vertex (b) at (2,1);

        \vertex (c) at (-2,1);
        \vertex (d) at (2,-1);

        \propag[
            charged boson,
            orange
        ]
            (c) to (d);

        \propag[
            fermion,
            blue,
            top
        ]
            (a) to (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

The crossing does not create an interaction vertex.

---

## Propagator insertions

Insertion marks can be placed at selected fractions of a propagator length:

```latex
insertion=0.25
insertion=0.75
```

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="500"
      data-height="200"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[dot]
            (a) at (-2,0) {};

        \vertex[dot]
            (b) at (2,0) {};

        \propag[
            charged boson,
            red,
            insertion=0.25,
            insertion=0.75
        ]
            (a) to (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="500"
      data-height="200"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[dot]
            (a) at (-2,0) {};

        \vertex[dot]
            (b) at (2,0) {};

        \propag[
            charged boson,
            red,
            insertion=0.25,
            insertion=0.75
        ]
            (a) to (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

Values range from `0` at the beginning to `1` at the end of the propagator.

---

## Custom diagram dimensions

The package provides length commands for changing the appearance of diagrams:

```latex
\setlength{\feynhanddotsize}{2mm}
\setlength{\feynhandblobsize}{10mm}
\setlength{\feynhandlinesize}{1.2pt}
\setlength{\feynhandarrowsize}{8pt}
\setlength{\feynhandtopsep}{8pt}
```

Example:

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
    >
    \setlength{\feynhanddotsize}{2mm}
    \setlength{\feynhandlinesize}{1.1pt}
    \setlength{\feynhandarrowsize}{8pt}

    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-2,0);
        \vertex[dot] (v) at (0,0) {};
        \vertex (b) at (2,0);

        \propag[
            fermion,
            blue
        ]
            (a) to (v);

        \propag[
            fermion,
            red
        ]
            (v) to (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
    >
    \setlength{\feynhanddotsize}{2mm}
    \setlength{\feynhandlinesize}{1.1pt}
    \setlength{\feynhandarrowsize}{8pt}

    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-2,0);
        \vertex[dot] (v) at (0,0) {};
        \vertex (b) at (2,0);

        \propag[
            fermion,
            blue
        ]
            (a) to (v);

        \propag[
            fermion,
            red
        ]
            (v) to (b);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

Each TikZJax block is compiled as an independent TeX document, so these changes affect only the current diagram.

---

## Colored interaction diagram

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="560"
      data-height="300"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[particle]
            (a) at (-2.5,-1)
            {$e^-$};

        \vertex[particle]
            (b) at (-2.5,1)
            {$e^+$};

        \vertex[
            dot,
            fill=purple,
            draw=purple
        ]
            (v) at (0,0) {};

        \vertex[particle]
            (c) at (2.5,1)
            {$\mu^-$};

        \vertex[particle]
            (d) at (2.5,-1)
            {$\mu^+$};

        \propag[
            fermion,
            blue,
            very thick
        ]
            (a) to (v);

        \propag[
            anti fermion,
            blue,
            very thick
        ]
            (b) to (v);

        \propag[
            fermion,
            red,
            very thick
        ]
            (v) to (c);

        \propag[
            anti fermion,
            red,
            very thick
        ]
            (v) to (d);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
      data-width="560"
      data-height="300"
    >
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex[particle]
            (a) at (-2.5,-1)
            {$e^-$};

        \vertex[particle]
            (b) at (-2.5,1)
            {$e^+$};

        \vertex[
            dot,
            fill=purple,
            draw=purple
        ]
            (v) at (0,0) {};

        \vertex[particle]
            (c) at (2.5,1)
            {$\mu^-$};

        \vertex[particle]
            (d) at (2.5,-1)
            {$\mu^+$};

        \propag[
            fermion,
            blue,
            very thick
        ]
            (a) to (v);

        \propag[
            anti fermion,
            blue,
            very thick
        ]
            (b) to (v);

        \propag[
            fermion,
            red,
            very thick
        ]
            (v) to (c);

        \propag[
            anti fermion,
            red,
            very thick
        ]
            (v) to (d);

    \end{feynhand}
    \end{tikzpicture}
    </script>
    ```

Explicit colors are preserved by TikZJax theme adaptation.

---

## Loading several packages

Several packages can be loaded locally with a comma-separated list:

```html
<script
  type="text/tikz"
  data-tex-packages="tikz-feynhand,physics"
>
% Diagram using both packages
</script>
```

They can also be declared with JSON:

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "tikz-feynhand": "",
    "physics": ""
  }'
>
% Diagram source
</script>
```

Only include packages required by the current diagram.

!!! warning

    Loading several packages creates a larger TeX preamble.

    Package combinations may increase rendering time or introduce conflicts.

---

## Global loading

Load `tikz-feynhand` globally only when it is required by most diagrams on the site:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            "tikz-feynhand": ""
        }
    }
};
```

After global loading, individual diagrams do not need:

```html
data-tex-packages="tikz-feynhand"
```

!!! warning "Performance"

    Global loading inserts:

    ```latex
    \usepackage{tikz-feynhand}
    ```

    into every TikZJax document.

    Ordinary TikZ diagrams will therefore process the package even when they contain no Feynman diagram.

    Prefer local loading unless the package is used throughout the site.

---

## MkDocs fenced blocks

A fenced `tikzjax` block cannot contain HTML `data-*` attributes.

Therefore, fenced blocks using `tikz-feynhand` work only when the package is loaded globally.

=== "Rendering"

    <script type="text/tikz">
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-1.5,-1);
        \vertex (b) at (1.5,-1);
        \vertex (c) at (0,1.5);

        \vertex[dot] (v) at (0,0) {};

        \propag[fermion]
            (a) to (v);

        \propag[anti fermion]
            (b) to (v);

        \propag[photon]
            (v) to (c);

    \end{feynhand}
    \end{tikzpicture}
    </script>

=== ":fa-markdown: Markdown"

    ````markdown
    ```tikzjax
    \begin{tikzpicture}
    \begin{feynhand}

        \vertex (a) at (-1.5,-1);
        \vertex (b) at (1.5,-1);
        \vertex (c) at (0,1.5);

        \vertex[dot] (v) at (0,0) {};

        \propag[fermion]
            (a) to (v);

        \propag[anti fermion]
            (b) to (v);

        \propag[photon]
            (v) to (c);

    \end{feynhand}
    \end{tikzpicture}
    ```
    ````

!!! important

    For portable local loading, prefer:

    ```html
    <script
      type="text/tikz"
      data-tex-packages="tikz-feynhand"
    >
    ...
    </script>
    ```

---

## MkDocs Content Tabs

=== "Rendering"

    === "Question"

        Draw a fermion–anti-fermion interaction producing a photon.

    === "Solution"

        <script
          type="text/tikz"
          data-tex-packages="tikz-feynhand"
        >
        \begin{tikzpicture}
        \begin{feynhand}

            \vertex (a) at (-1.5,-1);
            \vertex (b) at (1.5,-1);
            \vertex (c) at (0,1.5);

            \vertex[dot] (v) at (0,0) {};

            \propag[fermion]
                (a) to (v);

            \propag[anti fermion]
                (b) to (v);

            \propag[photon]
                (v) to (c);

        \end{feynhand}
        \end{tikzpicture}
        </script>

=== ":fa-markdown: Markdown"

    ````markdown
    === "Question"

        Draw a fermion–anti-fermion interaction producing a photon.

    === "Solution"

        <script
          type="text/tikz"
          data-tex-packages="tikz-feynhand"
        >
        \begin{tikzpicture}
        \begin{feynhand}

            \vertex (a) at (-1.5,-1);
            \vertex (b) at (1.5,-1);
            \vertex (c) at (0,1.5);

            \vertex[dot] (v) at (0,0) {};

            \propag[fermion]
                (a) to (v);

            \propag[anti fermion]
                (b) to (v);

            \propag[photon]
                (v) to (c);

        \end{feynhand}
        \end{tikzpicture}
        </script>
    ````

TikZJax automatically rescans MkDocs Material content tabs when they become visible.

---

## MkDocs admonitions

=== "Rendering"

    !!! example "Feynman interaction"

        <script
          type="text/tikz"
          data-tex-packages="tikz-feynhand"
        >
        \begin{tikzpicture}
        \begin{feynhand}

            \vertex (a) at (-1.5,-1);
            \vertex (b) at (1.5,-1);
            \vertex (c) at (0,1.5);

            \vertex[dot] (v) at (0,0) {};

            \propag[fermion]
                (a) to (v);

            \propag[anti fermion]
                (b) to (v);

            \propag[photon]
                (v) to (c);

        \end{feynhand}
        \end{tikzpicture}
        </script>

=== ":fa-markdown: Markdown"

    ````markdown
    !!! example "Feynman interaction"

        <script
          type="text/tikz"
          data-tex-packages="tikz-feynhand"
        >
        \begin{tikzpicture}
        \begin{feynhand}

            \vertex (a) at (-1.5,-1);
            \vertex (b) at (1.5,-1);
            \vertex (c) at (0,1.5);

            \vertex[dot] (v) at (0,0) {};

            \propag[fermion]
                (a) to (v);

            \propag[anti fermion]
                (b) to (v);

            \propag[photon]
                (v) to (c);

        \end{feynhand}
        \end{tikzpicture}
        </script>
    ````

---

## Loader dimensions

Feynman diagrams may be wider or taller than the default loader.

Reserve additional space with:

```html
data-width="600"
data-height="320"
```

Example:

```html
<script
  type="text/tikz"
  data-tex-packages="tikz-feynhand"
  data-width="600"
  data-height="320"
>
\begin{tikzpicture}
\begin{feynhand}
    % Large diagram
\end{feynhand}
\end{tikzpicture}
</script>
```

These attributes affect only the loading placeholder.

They do not resize the final SVG.

---

## Timeout and debugging options

A diagram can combine several local runtime options:

```html
<script
  type="text/tikz"
  data-tex-packages="tikz-feynhand"
  data-render-timeout="30000"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
\begin{feynhand}

    \vertex (a) at (-1.5,0);
    \vertex (b) at (1.5,0);

    \propag[fermion]
        (a) to (b);

\end{feynhand}
\end{tikzpicture}
</script>
```

Use:

```html
data-disable-cache="true"
```

while modifying an example.

Use:

```html
data-show-console="true"
```

when diagnosing a TeX, package, or runtime error.

---

## Parallel rendering

TikZJax places uncached diagrams in a global rendering queue.

Several Feynman diagrams can be compiled concurrently:

```text
worker 1 -> Feynman diagram A
worker 2 -> Feynman diagram B
worker 3 -> another TikZ diagram
```

Each worker renders one diagram at a time.

When a worker finishes, it takes another diagram from the queue.

Each worker also maintains its own in-memory cache of downloaded and decompressed TeX files.

The first `tikz-feynhand` diagram handled by a worker may therefore take longer than later diagrams assigned to the same worker.

!!! tip

    Local package loading remains fully compatible with parallel rendering.

    The package declaration travels with the individual diagram when it is assigned to a worker.

---

## Debugging

### Enable TeX logs

```html
<script
  type="text/tikz"
  data-tex-packages="tikz-feynhand"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
\begin{feynhand}

    \vertex (a) at (-1.5,-1);
    \vertex (b) at (1.5,-1);
    \vertex (c) at (0,1.5);

    \vertex[dot] (v) at (0,0) {};

    \propag[fermion]
        (a) to (v);

    \propag[anti fermion]
        (b) to (v);

    \propag[photon]
        (v) to (c);

\end{feynhand}
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
GET .../tex_files/tikz-feynhand.sty.gz 404
```

Another dependency may appear as a missing:

```text
.sty.gz
.tex.gz
.def.gz
.code.tex.gz
```

Use the TikZJax JavaScript bundle, WebAssembly runtime, core dump, and `tex_files` directory from the same release.

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

### Undefined environment `feynhand`

The package was not loaded.

Add:

```html
data-tex-packages="tikz-feynhand"
```

or enable it globally.

### A visible dot or blob is missing

Visible vertex styles require an empty content argument:

```latex
\vertex[dot] (v) at (0,0) {};
```

Not:

```latex
\vertex[dot] (v) at (0,0);
```

### A bare vertex displays unexpected content

A bare vertex should generally be written without an empty content argument:

```latex
\vertex (v) at (0,0);
```

### The particle arrow points in the wrong direction

The arrow follows the direction from the first vertex to the second:

```latex
\propag[fermion] (a) to (b);
```

Reverse the vertex order or use an anti-particle style when appropriate.

### The line is straight instead of curved

Add path options after `to`:

```latex
\propag[fermion]
    (a) to
    [
        out=60,
        in=120,
        looseness=1.3
    ]
    (b);
```

### The propagator label is on the wrong side

Use the primed label form:

```latex
edge label'=$p$
```

instead of:

```latex
edge label=$p$
```

### A crossing looks like an interaction

Do not create a dot at the crossing.

Draw the lower line first, then add `top` to the line that should pass visually above it.

### A fenced block fails

Fenced `tikzjax` blocks cannot declare local packages.

Load `tikz-feynhand` globally or replace the fenced block with an HTML `<script>` block.

### The loading placeholder is too small

Increase:

```html
data-width
data-height
```

These attributes reserve more room while the diagram is compiling.

### The first diagram is slower

The first worker rendering `tikz-feynhand` must download and decompress the package and its dependencies.

Later diagrams assigned to the same worker can reuse those files from memory.

### Changes are not visible

The previously rendered SVG may be stored in IndexedDB.

Use:

```html
data-disable-cache="true"
```

while debugging, or clear the TikZJax database manually.

---

## Official documentation

* [`tikz-feynhand` on CTAN](https://ctan.org/pkg/tikz-feynhand)
* [TikZ-FeynHand Basic User Guide](https://mirrors.ctan.org/graphics/pgf/contrib/tikz-feynhand/tikz-feynhand.userguide.pdf)

---

## Related documentation

* [Examples overview](index.md)
* [TikZ examples](tikz.md)
* [`physics` examples](physics.md)
* [`circuitikz` examples](circuitikz.md)
* [`chemfig` examples](chemfig.md)
* [`yquant` examples](yquant.md)
* [Installation](../installation/index.md)
* [Configuration](../configuration.md)
* [API Reference](../api-reference.md)
