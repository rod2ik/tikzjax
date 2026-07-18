# `kinematikz` Examples

[`kinematikz`](https://ctan.org/pkg/kinematikz) is a TikZ package for drawing kinematic chains and mechanism diagrams.

It provides reusable symbols for:

* fixed frames;
* links and bars;
* planar and spatial revolute joints;
* prismatic joints;
* pistons and linear joints;
* helical and cylindrical pairs;
* grippers;
* cams and followers;
* planar and spatial mechanisms.

Most KinemaTikZ elements are implemented as TikZ `pic` objects.

The package is intended for schematic kinematic diagrams. It does not solve direct or inverse kinematics, and it is not intended to replace mechanical CAD software.

The package is included in the TikZJax runtime, but it is not automatically loaded into every diagram.

For the best performance, load it locally only where it is needed:

```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}
    % KinemaTikZ source
\end{tikzpicture}
</script>
```

For other supported packages, return to the [Examples overview](index.md).

---

## Recommended local loading

Use:

```html
data-tex-packages="kinematikz"
```

on every diagram containing KinemaTikZ `pic` objects:

```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}
    \pic {frame pivot triangle};
\end{tikzpicture}
</script>
```

Local package declarations are merged with globally configured packages.

They do not replace the global configuration.

!!! tip "Why local loading is recommended"

```
`kinematikz` is useful only for mechanism diagrams.

Loading it locally:

- keeps ordinary TikZ diagrams lighter;
- avoids initializing mechanical symbols in unrelated diagrams;
- reduces unnecessary TeX processing;
- limits package interactions;
- makes the dependencies of each diagram explicit.
```

---

## Basic kinematic chain

This example contains:

* a fixed triangular frame;
* a generic bar link;
* two planar revolute pairs;
* a chain built by connecting the endpoint of one object to the next.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="520"
  data-height="300"
>
\begin{tikzpicture}

    \pic (MyB) {
        frame pivot triangle
    };

    \pic (MyL1) at (MyB-center) {
        link bar generic=20:30pt
    };

    \pic (MyL2) at (MyL1-end) {
        revolute pair planar=-45:30pt
    };

    \pic (MyL3) at (MyL2-end) {
        revolute pair planar=45:30pt
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="520"
  data-height="300"
>
\begin{tikzpicture}

    \pic (MyB) {
        frame pivot triangle
    };

    \pic (MyL1) at (MyB-center) {
        link bar generic=20:30pt
    };

    \pic (MyL2) at (MyL1-end) {
        revolute pair planar=-45:30pt
    };

    \pic (MyL3) at (MyL2-end) {
        revolute pair planar=45:30pt
    };

\end{tikzpicture}
</script>
```
````

---

## The `pic` syntax

A KinemaTikZ object generally follows this structure:

```latex
\pic (<name>) at (<position>) {
    <object>=<parameters>
};
```

For example:

```latex
\pic (Base) at (0,0) {
    frame pivot triangle
};
```

or:

```latex
\pic (Link) at (Base-center) {
    link bar generic=30:40pt
};
```

The three main parts are:

```text
(Base)                   object name
at (0,0)                 object position
{frame pivot triangle}   object type and parameters
```

The name and position are optional when they are not needed:

```latex
\pic {frame pivot triangle};
```

Every `\pic` command must end with a semicolon.

---

## Fixed triangular frame

The simplest fixed pivot frame is:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}
    \pic {frame pivot triangle};
\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}
    \pic {frame pivot triangle};
\end{tikzpicture}
</script>
```
````

The default position is `(0,0)`.

---

## Changing the frame width

The argument of `frame pivot triangle` controls its base width:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="520"
  data-height="270"
>
\begin{tikzpicture}

    \pic (A) at (-2,0) {
        frame pivot triangle
    };

    \pic (B) at (0,0) {
        frame pivot triangle=1.25cm
    };

    \pic (C) at (2.5,0) {
        frame pivot triangle=1.6cm
    };

    \node[below=6pt] at (A-south) {default};
    \node[below=6pt] at (B-south) {$1.25\,\mathrm{cm}$};
    \node[below=6pt] at (C-south) {$1.6\,\mathrm{cm}$};

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="520"
  data-height="270"
>
\begin{tikzpicture}

    \pic (A) at (-2,0) {
        frame pivot triangle
    };

    \pic (B) at (0,0) {
        frame pivot triangle=1.25cm
    };

    \pic (C) at (2.5,0) {
        frame pivot triangle=1.6cm
    };

    \node[below=6pt] at (A-south) {default};
    \node[below=6pt] at (B-south) {$1.25\,\mathrm{cm}$};
    \node[below=6pt] at (C-south) {$1.6\,\mathrm{cm}$};

\end{tikzpicture}
</script>
```
````

This changes the frame geometry directly.

It is not exactly equivalent to scaling the complete `pic`.

---

## Other fixed-frame shapes

KinemaTikZ provides several frame representations.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="680"
  data-height="280"
>
\begin{tikzpicture}

    \pic (A) at (-4.5,0) {
        frame pivot flat=1.2cm
    };

    \pic (B) at (-1.5,0) {
        frame pivot trapezium=1.2cm
    };

    \pic (C) at (1.5,0) {
        frame pivot triangle=1.2cm
    };

    \pic (D) at (4.5,0) {
        frame pivot rounded=1cm
    };

    \node[below=9pt] at (A-south) {flat};
    \node[below=9pt] at (B-south) {trapezium};
    \node[below=9pt] at (C-south) {triangle};
    \node[below=9pt] at (D-south) {rounded};

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="680"
  data-height="280"
>
\begin{tikzpicture}

    \pic (A) at (-4.5,0) {
        frame pivot flat=1.2cm
    };

    \pic (B) at (-1.5,0) {
        frame pivot trapezium=1.2cm
    };

    \pic (C) at (1.5,0) {
        frame pivot triangle=1.2cm
    };

    \pic (D) at (4.5,0) {
        frame pivot rounded=1cm
    };

    \node[below=9pt] at (A-south) {flat};
    \node[below=9pt] at (B-south) {trapezium};
    \node[below=9pt] at (C-south) {triangle};
    \node[below=9pt] at (D-south) {rounded};

\end{tikzpicture}
</script>
```
````

---

## Internal coordinates

A named KinemaTikZ `pic` exposes internal TikZ coordinates.

For a triangular frame named `Base`, useful coordinates include:

```text
Base-center
Base-in
Base-out
Base-start
Base-end
Base-left
Base-right
Base-south
```

For a generic bar link named `Link`, useful coordinates include:

```text
Link-start
Link-center
Link-end
Link-in
Link-out
Link-north
Link-south
```

These coordinates make it possible to connect elements without manually calculating every global position.

Example:

```latex
\pic (Base) {
    frame pivot triangle
};

\pic (Link) at (Base-center) {
    link bar generic=20:30pt
};

\pic (NextLink) at (Link-end) {
    link bar generic=-30:35pt
};
```

---

## Connecting a frame and a simple line

KinemaTikZ objects can be mixed with ordinary TikZ commands.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \draw[
        very thick,
        red
    ]
        (Base-center) -- (20:45pt);

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \draw[
        very thick,
        red
    ]
        (Base-center) -- (20:45pt);

\end{tikzpicture}
</script>
```
````

Standard TikZ paths, nodes, coordinates, loops, colors, and transformations remain available.

---

## Generic bar link

The `link bar generic` object represents a configurable planar link.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (Link) at (Base-center) {
        link bar generic=25:55pt
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (Link) at (Base-center) {
        link bar generic=25:55pt
    };

\end{tikzpicture}
</script>
```
````

The endpoint:

```latex
25:55pt
```

uses TikZ polar-coordinate syntax:

```text
angle:length
```

Here, the link is oriented at (25^\circ) and has a length of `55pt`.

---

## Generic bar parameters

The complete parameter structure is:

```text
endpoint / center of mass / start pivot / end pivot / crosshairs
```

For example:

```latex
link bar generic={30:50pt/1/1/1/0}
```

The parameters are:

| Position | Meaning                                          |
| -------- | ------------------------------------------------ |
| 1        | Endpoint coordinate                              |
| 2        | `1` displays the centre-of-mass symbol           |
| 3        | `1` displays a pivot at the start                |
| 4        | `1` displays a pivot at the end                  |
| 5        | `1` displays crosshairs on pivots or extremities |

The default values are equivalent to:

```latex
link bar generic={0:30pt/1/1/1/0}
```

Empty entries preserve the corresponding default.

---

## Bar-link configurations

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="650"
  data-height="360"
>
\begin{tikzpicture}

    \pic (BaseA) at (-3,1.6) {
        frame pivot triangle
    };

    \pic (LinkA) at (BaseA-center) {
        link bar generic={25:55pt/1/1/1/0}
    };

    \pic (BaseB) at (-3,-1.3) {
        frame pivot triangle
    };

    \pic (LinkB) at (BaseB-center) {
        link bar generic={25:55pt/0/1/0/1}
    };

    \node[
        right=8pt
    ] at (LinkA-end) {
        centre of mass and two pivots
    };

    \node[
        right=8pt,
        align=left
    ] at (LinkB-end) {
        no centre of mass,\\
        no terminal pivot, crosshairs
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="650"
  data-height="360"
>
\begin{tikzpicture}

    \pic (BaseA) at (-3,1.6) {
        frame pivot triangle
    };

    \pic (LinkA) at (BaseA-center) {
        link bar generic={25:55pt/1/1/1/0}
    };

    \pic (BaseB) at (-3,-1.3) {
        frame pivot triangle
    };

    \pic (LinkB) at (BaseB-center) {
        link bar generic={25:55pt/0/1/0/1}
    };

    \node[
        right=8pt
    ] at (LinkA-end) {
        centre of mass and two pivots
    };

    \node[
        right=8pt,
        align=left
    ] at (LinkB-end) {
        no centre of mass,\\
        no terminal pivot, crosshairs
    };

\end{tikzpicture}
</script>
```
````

---

## Local coordinates

A polar or Cartesian endpoint supplied directly to a link is interpreted relative to the starting position of that `pic`.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (FirstLink) at (Base-center) {
        link bar generic=20:40pt
    };

    \pic (SecondLink) at (FirstLink-end) {
        link bar generic=-45:40pt
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (FirstLink) at (Base-center) {
        link bar generic=20:40pt
    };

    \pic (SecondLink) at (FirstLink-end) {
        link bar generic=-45:40pt
    };

\end{tikzpicture}
</script>
```
````

The second endpoint is calculated relative to `FirstLink-end`.

---

## Named global coordinates

A named TikZ coordinate can be used as an endpoint:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}

    \coordinate (Target) at (3,1.5);

    \pic (Base) {
        frame pivot triangle
    };

    \pic (Link) at (Base-center) {
        link bar generic=Target
    };

    \fill[
        red
    ]
        (Target) circle (2pt);

    \node[
        above
    ] at (Target) {
        Target
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}

    \coordinate (Target) at (3,1.5);

    \pic (Base) {
        frame pivot triangle
    };

    \pic (Link) at (Base-center) {
        link bar generic=Target
    };

    \fill[
        red
    ]
        (Target) circle (2pt);

    \node[
        above
    ] at (Target) {
        Target
    };

\end{tikzpicture}
</script>
```
````

When passing a named coordinate as a KinemaTikZ parameter, omit parentheses:

```latex
link bar generic=Target
```

not:

```latex
link bar generic=(Target)
```

---

## Planar revolute pair

The `revolute pair planar` object represents two links connected by a planar rotational joint.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (Joint) at (Base-center) {
        revolute pair planar=30:55pt
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (Joint) at (Base-center) {
        revolute pair planar=30:55pt
    };

\end{tikzpicture}
</script>
```
````

The object accepts three parameters:

```text
endpoint / centre-of-mass mode / terminal pivot
```

For example:

```latex
revolute pair planar={100:1cm/0/1}
```

---

## Chain of planar revolute pairs

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="600"
  data-height="320"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (JointA) at (Base-out) {
        revolute pair planar={40:50pt/0/1}
    };

    \pic (JointB) at (JointA-out) {
        revolute pair planar={-35:45pt/1/1}
    };

    \pic[
        scale=0.7
    ] at (JointB-out) {
        gripper=0/0
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="600"
  data-height="320"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (JointA) at (Base-out) {
        revolute pair planar={40:50pt/0/1}
    };

    \pic (JointB) at (JointA-out) {
        revolute pair planar={-35:45pt/1/1}
    };

    \pic[
        scale=0.7
    ] at (JointB-out) {
        gripper=0/0
    };

\end{tikzpicture}
</script>
```
````

---

## Prismatic pair

The `prismatic pair` object represents a linear joint.

The alias `linear pair` produces the same type of object.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="580"
  data-height="250"
>
\begin{tikzpicture}[knLinkStyle]

    \pic[
        rotate=-90
    ] (Base) {
        frame
    };

    \pic[
        right=1cm of Base-out
    ] (JointA) {
        prismatic pair
    };

    \pic[
        right=1cm of JointA-out
    ] (JointB) {
        linear pair=-60:1cm/1
    };

    \draw
        (Base-out) -- (JointA-in);

    \draw
        (JointA-out) -- (JointB-in);

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="580"
  data-height="250"
>
\begin{tikzpicture}[knLinkStyle]

    \pic[
        rotate=-90
    ] (Base) {
        frame
    };

    \pic[
        right=1cm of Base-out
    ] (JointA) {
        prismatic pair
    };

    \pic[
        right=1cm of JointA-out
    ] (JointB) {
        linear pair=-60:1cm/1
    };

    \draw
        (Base-out) -- (JointA-in);

    \draw
        (JointA-out) -- (JointB-in);

\end{tikzpicture}
</script>
```
````

The parameter structure is:

```text
endpoint / end-arm position
```

---

## Linear piston

The `linear piston` object provides another schematic representation of a prismatic joint.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="660"
  data-height="270"
>
\begin{tikzpicture}

    \foreach \position [count=\index] in {
        0.2,
        0.4,
        0.6,
        0.8
    } {
        \pic[
            xshift=\index*2.2cm
        ] (P\index) {
            linear piston=\position
        };

        \node[
            below=10pt
        ] at (P\index-center) {
            \position
        };
    }

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="660"
  data-height="270"
>
\begin{tikzpicture}

    \foreach \position [count=\index] in {
        0.2,
        0.4,
        0.6,
        0.8
    } {
        \pic[
            xshift=\index*2.2cm
        ] (P\index) {
            linear piston=\position
        };

        \node[
            below=10pt
        ] at (P\index-center) {
            \position
        };
    }

\end{tikzpicture}
</script>
```
````

The first parameter is a number from `0` to `1` representing the piston insertion fraction.

The second optional parameter controls the piston-plate width:

```latex
linear piston={0.5/5pt}
```

---

## Piston mechanism with a gripper

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="620"
  data-height="360"
>
\begin{tikzpicture}[knLinkStyle]

    \pic (Base) {
        frame
    };

    \pic[
        above right=of Base-out
    ] (PistonA) {
        linear piston=0.2
    };

    \pic[
        below right=of PistonA-out,
        rotate=-90
    ] (PistonB) {
        linear piston={0.5/5pt}
    };

    \pic[
        scale=0.6
    ] (Grip) at (PistonB-out) {
        gripper=3/0
    };

    \draw
        (Base-out)
        |-
        (PistonA-in);

    \draw
        (PistonA-out)
        -|
        (PistonB-in);

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="620"
  data-height="360"
>
\begin{tikzpicture}[knLinkStyle]

    \pic (Base) {
        frame
    };

    \pic[
        above right=of Base-out
    ] (PistonA) {
        linear piston=0.2
    };

    \pic[
        below right=of PistonA-out,
        rotate=-90
    ] (PistonB) {
        linear piston={0.5/5pt}
    };

    \pic[
        scale=0.6
    ] (Grip) at (PistonB-out) {
        gripper=3/0
    };

    \draw
        (Base-out)
        |-
        (PistonA-in);

    \draw
        (PistonA-out)
        -|
        (PistonB-in);

\end{tikzpicture}
</script>
```
````

---

## Linear joint bar

The `linear joint bar` object is another two-dimensional representation of a linear or prismatic joint.

Its parameter structure is:

```text
insertion fraction / fixed-part length / curved base / curved tip
```

Example:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="620"
  data-height="280"
>
\begin{tikzpicture}

    \pic (A) at (-3,0) {
        linear joint bar={0.25/1cm/0/1}
    };

    \pic (B) at (0,0) {
        linear joint bar={0.5/1cm/1/1}
    };

    \pic (C) at (3,0) {
        linear joint bar={0.8/1cm/1/0}
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="620"
  data-height="280"
>
\begin{tikzpicture}

    \pic (A) at (-3,0) {
        linear joint bar={0.25/1cm/0/1}
    };

    \pic (B) at (0,0) {
        linear joint bar={0.5/1cm/1/1}
    };

    \pic (C) at (3,0) {
        linear joint bar={0.8/1cm/1/0}
    };

\end{tikzpicture}
</script>
```
````

---

## Gripper

The `gripper` object represents a simple two-finger end effector.

Its parameters are:

```text
orientation / perspective
```

The orientation is expressed as a multiple of (90^\circ):

```text
0  points right
1  points up
2  points left
3  points down
```

The second parameter is:

```text
0  planar representation
1  perspective representation
```

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="680"
  data-height="400"
>
\begin{tikzpicture}

    \foreach \perspective in {0,1} {
        \foreach \direction in {0,1,2,3} {
            \begin{scope}[
                xshift=\direction*2.3cm,
                yshift=-\perspective*2.4cm
            ]

                \pic (Grip) {
                    gripper={\direction/\perspective}
                };

                \node[
                    below=9pt
                ] at (Grip-center) {
                    \direction/\perspective
                };

            \end{scope}
        }
    }

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="680"
  data-height="400"
>
\begin{tikzpicture}

    \foreach \perspective in {0,1} {
        \foreach \direction in {0,1,2,3} {
            \begin{scope}[
                xshift=\direction*2.3cm,
                yshift=-\perspective*2.4cm
            ]

                \pic (Grip) {
                    gripper={\direction/\perspective}
                };

                \node[
                    below=9pt
                ] at (Grip-center) {
                    \direction/\perspective
                };

            \end{scope}
        }
    }

\end{tikzpicture}
</script>
```
````

Fractional orientation values are also accepted:

```latex
gripper={0.5/0}
```

This rotates the fingers by half of (90^\circ), or (45^\circ).

---

## Custom colors

Ordinary TikZ options can be applied to KinemaTikZ `pic` objects.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="560"
  data-height="300"
>
\begin{tikzpicture}

    \pic[
        blue!70!black
    ] (Base) {
        frame pivot triangle
    };

    \pic[
        red!75!black
    ] (LinkA) at (Base-center) {
        link bar generic={25:55pt/1/1/1/0}
    };

    \pic[
        green!50!black
    ] (LinkB) at (LinkA-end) {
        revolute pair planar={-40:45pt/0/1}
    };

    \pic[
        orange!80!black,
        scale=0.7
    ] at (LinkB-out) {
        gripper=0/0
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="560"
  data-height="300"
>
\begin{tikzpicture}

    \pic[
        blue!70!black
    ] (Base) {
        frame pivot triangle
    };

    \pic[
        red!75!black
    ] (LinkA) at (Base-center) {
        link bar generic={25:55pt/1/1/1/0}
    };

    \pic[
        green!50!black
    ] (LinkB) at (LinkA-end) {
        revolute pair planar={-40:45pt/0/1}
    };

    \pic[
        orange!80!black,
        scale=0.7
    ] at (LinkB-out) {
        gripper=0/0
    };

\end{tikzpicture}
</script>
```
````

---

## KinemaTikZ design styles

The package defines reusable TikZ styles for visual consistency:

```text
knLinkStyle
knJointStyle
knLineCap
```

`knLinkStyle` controls most link lines.

`knJointStyle` controls the main joint bodies.

`knLineCap` controls the ends of connecting lines.

Apply the base link style to the complete picture:

```latex
\begin{tikzpicture}[knLinkStyle]
```

---

## Customizing line styles

Styles can be extended locally with `\tikzset`.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="580"
  data-height="300"
>
\begin{tikzpicture}

    \tikzset{
        knLinkStyle/.append style={
            line width=1.5pt,
            blue!70!black
        },

        knJointStyle/.append style={
            line width=1.5pt,
            red!70!black
        },

        knLineCap/.style={
            line cap=round
        }
    }

    \pic (Base) {
        frame pivot triangle
    };

    \pic (JointA) at (Base-out) {
        revolute pair planar=30:55pt
    };

    \pic (JointB) at (JointA-out) {
        revolute pair planar=-35:45pt
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="580"
  data-height="300"
>
\begin{tikzpicture}

    \tikzset{
        knLinkStyle/.append style={
            line width=1.5pt,
            blue!70!black
        },

        knJointStyle/.append style={
            line width=1.5pt,
            red!70!black
        },

        knLineCap/.style={
            line cap=round
        }
    }

    \pic (Base) {
        frame pivot triangle
    };

    \pic (JointA) at (Base-out) {
        revolute pair planar=30:55pt
    };

    \pic (JointB) at (JointA-out) {
        revolute pair planar=-35:45pt
    };

\end{tikzpicture}
</script>
```
````

Because every TikZJax block is compiled independently, this local style modification affects only the current diagram.

---

## Scaling objects

An individual KinemaTikZ `pic` can be scaled:

```latex
\pic[
    scale=1.5
] {
    frame pivot triangle
};
```

For a complete mechanism, TikZ scaling can be combined with `transform shape`:

```latex
\begin{tikzpicture}[
    scale=1.2,
    transform shape
]
```

Example:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="580"
  data-height="310"
>
\begin{tikzpicture}[
    scale=1.2,
    transform shape
]

    \pic (Base) {
        frame pivot triangle
    };

    \pic (LinkA) at (Base-center) {
        link bar generic=25:45pt
    };

    \pic (LinkB) at (LinkA-end) {
        link bar generic=-35:40pt
    };

\end{tikzpicture}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="580"
  data-height="310"
>
\begin{tikzpicture}[
    scale=1.2,
    transform shape
]

    \pic (Base) {
        frame pivot triangle
    };

    \pic (LinkA) at (Base-center) {
        link bar generic=25:45pt
    };

    \pic (LinkB) at (LinkA-end) {
        link bar generic=-35:40pt
    };

\end{tikzpicture}
</script>
```
````

!!! note

````
Changing an object parameter such as:

```latex
frame pivot triangle=1.5cm
```

modifies the object geometry.

Applying:

```latex
scale=1.5
```

applies a TikZ transformation.

The two operations are not always visually equivalent.
````

---

## Loading additional packages

Several LaTeX packages can be loaded locally with a comma-separated list:

```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz,physics"
>
% Source using both packages
</script>
```

They can also be declared with JSON:

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "kinematikz": "",
    "physics": ""
  }'
>
% Diagram source
</script>
```

Only include packages required by the current diagram.

!!! warning

```
Loading more packages creates a larger TeX preamble.

It may increase rendering time, memory usage, and the possibility of package conflicts.
```

---

## Additional TikZ libraries

KinemaTikZ loads the TikZ libraries required by its own symbols.

The basic examples on this page do not need an additional:

```html
data-tikz-libraries
```

attribute.

A diagram may still load another TikZ library locally when its own custom TikZ additions require one:

```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-tikz-libraries="quotes"
>
% KinemaTikZ and custom TikZ source
</script>
```

Do not add libraries unnecessarily.

---

## Global loading

Load `kinematikz` globally only when most diagrams on the site use it:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            kinematikz: ""
        }
    }
};
```

After global loading, individual diagrams do not need:

```html
data-tex-packages="kinematikz"
```

!!! warning "Performance"

````
Global loading inserts:

```latex
\usepackage{kinematikz}
```

into every TikZJax document.

Ordinary TikZ diagrams will therefore initialize the package and its required TikZ libraries even when they contain no mechanism.

Prefer local loading unless KinemaTikZ is used throughout the site.
````

---

## MkDocs fenced blocks

A fenced `tikzjax` block cannot contain HTML `data-*` attributes.

Therefore, fenced blocks using KinemaTikZ work only when the package is loaded globally.

=== "Rendering"

````
```tikzjax
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (Link) at (Base-center) {
        link bar generic=25:55pt
    };

\end{tikzpicture}
```
````

=== ":fa-markdown: Markdown"

`````
````markdown
```tikzjax
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (Link) at (Base-center) {
        link bar generic=25:55pt
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
  data-tex-packages="kinematikz"
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

    Draw a simple mechanism containing a fixed pivot and two moving links.

=== "Solution"

    <script
      type="text/tikz"
      data-tex-packages="kinematikz"
      data-width="520"
      data-height="280"
    >
    \begin{tikzpicture}

        \pic (Base) {
            frame pivot triangle
        };

        \pic (LinkA) at (Base-center) {
            link bar generic=25:50pt
        };

        \pic (LinkB) at (LinkA-end) {
            revolute pair planar=-40:45pt
        };

    \end{tikzpicture}
    </script>
```

=== ":fa-markdown: Markdown"

`````
````markdown
=== "Question"

    Draw a simple mechanism containing a fixed pivot and two moving links.

=== "Solution"

    <script
      type="text/tikz"
      data-tex-packages="kinematikz"
      data-width="520"
      data-height="280"
    >
    \begin{tikzpicture}

        \pic (Base) {
            frame pivot triangle
        };

        \pic (LinkA) at (Base-center) {
            link bar generic=25:50pt
        };

        \pic (LinkB) at (LinkA-end) {
            revolute pair planar=-40:45pt
        };

    \end{tikzpicture}
    </script>
````
`````

TikZJax automatically rescans MkDocs Material content tabs when they become visible.

---

## MkDocs admonitions

=== "Rendering"

```
!!! example "Kinematic chain"

    <script
      type="text/tikz"
      data-tex-packages="kinematikz"
    >
    \begin{tikzpicture}

        \pic (Base) {
            frame pivot triangle
        };

        \pic (Link) at (Base-center) {
            link bar generic=25:55pt
        };

    \end{tikzpicture}
    </script>
```

=== ":fa-markdown: Markdown"

`````
````markdown
!!! example "Kinematic chain"

    <script
      type="text/tikz"
      data-tex-packages="kinematikz"
    >
    \begin{tikzpicture}

        \pic (Base) {
            frame pivot triangle
        };

        \pic (Link) at (Base-center) {
            link bar generic=25:55pt
        };

    \end{tikzpicture}
    </script>
````
`````

---

## Loader dimensions

Mechanism diagrams may be wider or taller than the default loading placeholder.

Reserve more space with:

```html
data-width="620"
data-height="340"
```

Example:

```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-width="620"
  data-height="340"
>
\begin{tikzpicture}
    % Large mechanism
\end{tikzpicture}
</script>
```

These values affect only the loading placeholder.

They do not resize the final SVG.

---

## Timeout and debugging options

A diagram can combine several local runtime options:

```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-render-timeout="30000"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (Link) at (Base-center) {
        link bar generic=25:55pt
    };

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

Use a larger timeout for a mechanism containing many links and symbols.

---

## Parallel rendering

TikZJax places all uncached diagrams in a global rendering queue.

Several mechanism diagrams can be compiled concurrently:

```text
worker 1 -> mechanism A
worker 2 -> mechanism B
worker 3 -> another TikZ diagram
```

Each worker renders one diagram at a time.

When a worker finishes, it takes another diagram from the queue.

Each worker maintains its own in-memory cache of downloaded and decompressed TeX files.

The first `kinematikz` diagram handled by a worker may therefore take longer than later diagrams assigned to the same worker.

!!! tip

```
Local package loading remains fully compatible with parallel rendering.

The package declaration travels with the individual diagram when it is assigned to a worker.
```

---

## Identical diagrams

When several identical mechanisms are discovered while the same render is still pending, TikZJax can group them into one rendering operation.

The resulting SVG is reused for all matching targets.

The source and complete local dataset must match, including:

* package declarations;
* TikZ libraries;
* local preamble;
* dimensions;
* timeout options;
* cache options.

---

## Debugging

### Enable TeX logs

```html
<script
  type="text/tikz"
  data-tex-packages="kinematikz"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}

    \pic (Base) {
        frame pivot triangle
    };

    \pic (Link) at (Base-center) {
        link bar generic=25:55pt
    };

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

### Inspect globally configured TikZ libraries

```js
window.TikzJaxOptions?.tex?.tikzLibraries
```

### Missing package file

A missing package generally appears as:

```text
GET .../tex_files/kinematikz.sty.gz 404
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

### Undefined `\pic` object

An error such as an unknown:

```text
frame pivot triangle
```

or:

```text
link bar generic
```

usually means that the package was not loaded.

Add:

```html
data-tex-packages="kinematikz"
```

or enable it globally.

---

### Missing semicolon

Every `\pic` command must end with a semicolon.

Incorrect:

```latex
\pic (Base) {
    frame pivot triangle
}
```

Correct:

```latex
\pic (Base) {
    frame pivot triangle
};
```

---

### A connection coordinate is unknown

The object must be named before its internal coordinates can be referenced.

Incorrect:

```latex
\pic {
    frame pivot triangle
};

\pic at (Base-center) {
    link bar generic=25:50pt
};
```

Correct:

```latex
\pic (Base) {
    frame pivot triangle
};

\pic at (Base-center) {
    link bar generic=25:50pt
};
```

---

### Parentheses around an endpoint parameter

When a named coordinate is passed as a KinemaTikZ parameter, do not include parentheses.

Incorrect:

```latex
link bar generic=(Target)
```

Correct:

```latex
link bar generic=Target
```

Parentheses remain necessary in ordinary TikZ position syntax:

```latex
at (Target)
```

---

### A link points in an unexpected direction

Polar coordinates use:

```text
angle:length
```

For example:

```latex
link bar generic=-45:40pt
```

means a link of length `40pt` oriented at (-45^\circ) relative to its starting point.

---

### A bar loses its centre-of-mass symbol

The second parameter controls that symbol:

```latex
link bar generic={30:50pt/1/1/1/0}
```

Use `1` to display it and `0` to hide it.

---

### A pivot is missing

For `link bar generic`, the third and fourth parameters control the start and end pivots:

```latex
endpoint / COM / start pivot / end pivot / crosshairs
```

Example with both pivots:

```latex
link bar generic={30:50pt/1/1/1/0}
```

---

### Relative positioning fails

KinemaTikZ loads the positioning support required by its documented examples, but relative TikZ syntax must still be valid:

```latex
right=1cm of Base-out
```

The referenced coordinate must already exist.

---

### The complete diagram does not scale as expected

For a complete picture, combine:

```latex
scale=1.2
```

with:

```latex
transform shape
```

when text and `pic` shapes should scale together.

For an individual component, apply `scale` directly to that `\pic`.

---

### A fenced block fails

Fenced `tikzjax` blocks cannot declare local packages.

Load `kinematikz` globally or replace the fenced block with an HTML `<script>` block.

---

### The loading placeholder is too small

Increase:

```html
data-width
data-height
```

These attributes reserve more room while the diagram is compiling.

They do not resize the final SVG.

---

### The first mechanism is slower

The first worker rendering `kinematikz` must download and decompress the package and its dependencies.

Later diagrams assigned to the same worker can reuse those files from memory.

---

### Changes are not visible

The previous SVG may be stored in IndexedDB.

Use:

```html
data-disable-cache="true"
```

while debugging, or clear the TikZJax database manually.

---

## Frequently used objects

| Object                  | Purpose                         |
| ----------------------- | ------------------------------- |
| `frame`                 | Generic fixed frame             |
| `frame pivot flat`      | Flat fixed pivot frame          |
| `frame pivot trapezium` | Trapezoidal fixed pivot frame   |
| `frame pivot triangle`  | Triangular fixed pivot frame    |
| `frame pivot rounded`   | Rounded fixed pivot frame       |
| `link bar generic`      | Configurable planar link        |
| `revolute pair planar`  | Planar revolute joint and links |
| `revolute pair spatial` | Spatial revolute pair           |
| `prismatic pair`        | Prismatic or linear pair        |
| `linear pair`           | Alias of `prismatic pair`       |
| `linear joint bar`      | Bar-style linear joint          |
| `linear piston`         | Piston-style linear joint       |
| `helical pair`          | Helical or screw pair           |
| `gripper`               | Two-finger end effector         |

The complete package reference contains additional frames, joints, links, cams, followers, spatial symbols, and accessories.

---

## Official documentation

* [`kinematikz` on CTAN](https://ctan.org/pkg/kinematikz)
* [`kinematikz` manual](https://mirrors.ctan.org/graphics/pgf/contrib/kinematikz/kinematikzmanual.pdf)
* [`kinematikz` source directory](https://ctan.org/tex-archive/graphics/pgf/contrib/kinematikz)

---

## Related documentation

* [Examples overview](index.md)
* [TikZ examples](tikz.md)
* [`physics` examples](physics.md)
* [`circuitikz` examples](circuitikz.md)
* [`chemfig` examples](chemfig.md)
* [`yquant` examples](yquant.md)
* [`tikz-feynhand` examples](tikz-feynhand.md)
* [`pgf-spectra` examples](pgf-spectra.md)
* [Installation](../installation/index.md)
* [Configuration](../configuration.md)
* [API Reference](../api-reference.md)
