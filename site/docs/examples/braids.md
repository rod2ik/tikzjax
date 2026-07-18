# `braids` Examples

[`braids`](https://ctan.org/pkg/braids) is a TikZ library for drawing braid diagrams from words in braid groups.

It can represent:

* positive and negative braid generators;
* braids with any number of strands;
* crossings between adjacent or non-adjacent strands;
* several crossings at the same level;
* identity levels without crossings;
* individually styled strands;
* floors behind selected parts of a braid;
* named coordinates along strands;
* transformed, rotated, or reflected braid diagrams;
* annotated braid-group calculations.

The maintained implementation is the TikZ library loaded with:

```latex
\usetikzlibrary{braids}
```

The historical `braids.sty` package is retained for compatibility with old documents, but new diagrams should use the TikZ-library interface.

In TikZJax, load the library locally:

```html
<script
  type="text/tikz"
  data-tikz-libraries="braids"
>
\begin{tikzpicture}
    \pic {braid={s_1 s_2^{-1} s_1}};
\end{tikzpicture}
</script>
```

For other supported examples, return to the [Examples overview](index.md).

---

## Recommended local loading

Use:

```html
data-tikz-libraries="braids"
```

on every diagram containing a `braid` pic:

```html
<script
  type="text/tikz"
  data-tikz-libraries="braids"
>
\begin{tikzpicture}
    \pic {braid={s_1 s_2^{-1}}};
\end{tikzpicture}
</script>
```

Local TikZ-library declarations are merged with globally configured libraries.

They do not replace the global configuration.

!!! tip "Why local loading is recommended"

    The `braids` library is unnecessary for ordinary TikZ diagrams.

    Loading it only for braid diagrams:

    - keeps unrelated diagrams lighter;
    - avoids initializing braid keys and pic definitions everywhere;
    - reduces unnecessary TeX processing;
    - makes the requirements of each diagram explicit;
    - limits interactions with unrelated TikZ libraries.

!!! warning "Do not use `data-tex-packages`"

    For the maintained interface, do not write:

    ```html
    data-tex-packages="braids"
    ```

    Use:

    ```html
    data-tikz-libraries="braids"
    ```

    The first form requests the historical LaTeX package. The second loads the maintained TikZ library.

---

## Basic three-strand braid

A braid is drawn with the TikZ `pic` syntax:

```latex
\pic {braid={braid word}};
```

The following word uses two generators and one inverse generator.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="420"
      data-height="300"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            every strand/.style={ultra thick},
            strand 1/.style={red},
            strand 2/.style={green!60!black},
            strand 3/.style={blue}
        ] {
            braid={
                s_1
                s_2^{-1}
                s_1
                s_2^{-1}
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="420"
      data-height="300"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            every strand/.style={ultra thick},
            strand 1/.style={red},
            strand 2/.style={green!60!black},
            strand 3/.style={blue}
        ] {
            braid={
                s_1
                s_2^{-1}
                s_1
                s_2^{-1}
            }
        };
    \end{tikzpicture}
    </script>
    ```

The number of strands is inferred from the largest strand index used in the braid word.

---

## Positive and negative generators

With the default crossing convention:

```text
s_1        strand 1 crosses over strand 2
s_1^{-1}  strand 2 crosses over strand 1
```

The exponent may be omitted for a positive generator.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="500"
      data-height="260"
    >
    \begin{tikzpicture}[
        every braid/.style={
            ultra thick,
            braid/anchor=center,
            braid/strand 1/.style={red},
            braid/strand 2/.style={blue}
        }
    ]
        \pic at (-1.5,0) {
            braid={s_1}
        };

        \pic at (1.5,0) {
            braid={s_1^{-1}}
        };

        \node[above] at (-1.5,1.1) {$s_1$};
        \node[above] at (1.5,1.1) {$s_1^{-1}$};
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="500"
      data-height="260"
    >
    \begin{tikzpicture}[
        every braid/.style={
            ultra thick,
            braid/anchor=center,
            braid/strand 1/.style={red},
            braid/strand 2/.style={blue}
        }
    ]
        \pic at (-1.5,0) {
            braid={s_1}
        };

        \pic at (1.5,0) {
            braid={s_1^{-1}}
        };

        \node[above] at (-1.5,1.1) {$s_1$};
        \node[above] at (1.5,1.1) {$s_1^{-1}$};
    \end{tikzpicture}
    </script>
    ```

The letter used before the subscript is not significant to the parser.

For example, `a_1` and `s_1` describe the same crossing pattern.

---

## Braid-word syntax

A braid word is a sequence of generators:

```latex
s_1 s_2^{-1} s_1
```

The common forms are:

| Syntax | Meaning |
| --- | --- |
| `s_1` | Positive adjacent crossing |
| `s_1^{-1}` | Inverse adjacent crossing |
| `s_{1,3}` | Crossing involving selected non-adjacent strands |
| `s_{1-4}` | Range shorthand for `s_{1,2,3,4}` |
| `s_1-s_3` | Crossings rendered at the same level |
| `1` | Identity level with no crossing |
| `|` | Insert a floor behind a level |

The exponent is read as a TeX token.

Use braces around the negative exponent:

```latex
s_1^{-1}
```

---

## Simultaneous crossings

Separate compatible generators with a hyphen to render them at the same height:

```latex
s_1-s_3
```

No automatic mathematical-validity check is performed, so only combine crossings that can coexist at the same level.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="520"
      data-height="290"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            number of strands=4,
            every strand/.style={very thick},
            strand 1/.style={red},
            strand 2/.style={orange!80!black},
            strand 3/.style={green!50!black},
            strand 4/.style={blue}
        ] {
            braid={
                s_1-s_3
                s_2^{-1}
                s_1-s_3
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="520"
      data-height="290"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            number of strands=4,
            every strand/.style={very thick},
            strand 1/.style={red},
            strand 2/.style={orange!80!black},
            strand 3/.style={green!50!black},
            strand 4/.style={blue}
        ] {
            braid={
                s_1-s_3
                s_2^{-1}
                s_1-s_3
            }
        };
    \end{tikzpicture}
    </script>
    ```

---

## Non-adjacent crossings

A comma-separated subscript can involve non-adjacent strands:

```latex
s_{1,3}
```

The selected strands move cyclically through their positions.

Intermediate strands remain behind the strands involved in the crossing.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="560"
      data-height="300"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            number of strands=4,
            every strand/.style={very thick},
            strand 1/.style={red},
            strand 2/.style={orange},
            strand 3/.style={blue},
            strand 4/.style={purple}
        ] {
            braid={
                s_{1,3}
                s_{1,4}^{-1}
                s_2
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="560"
      data-height="300"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            number of strands=4,
            every strand/.style={very thick},
            strand 1/.style={red},
            strand 2/.style={orange},
            strand 3/.style={blue},
            strand 4/.style={purple}
        ] {
            braid={
                s_{1,3}
                s_{1,4}^{-1}
                s_2
            }
        };
    \end{tikzpicture}
    </script>
    ```

---

## Range notation

A hyphen inside a braced subscript expands a consecutive range:

```latex
s_{1-4}
```

This is equivalent to:

```latex
s_{1,2,3,4}
```

Ranges may be combined with explicit indices:

```latex
s_{1-3,5}
```
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="620"
      data-height="300"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            number of strands=5,
            every strand/.style={very thick},
            strand 1/.style={red},
            strand 2/.style={orange},
            strand 3/.style={green!50!black},
            strand 4/.style={blue},
            strand 5/.style={purple}
        ] {
            braid={
                s_{1-4}
                s_{1-3,5}^{-1}
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="620"
      data-height="300"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            number of strands=5,
            every strand/.style={very thick},
            strand 1/.style={red},
            strand 2/.style={orange},
            strand 3/.style={green!50!black},
            strand 4/.style={blue},
            strand 5/.style={purple}
        ] {
            braid={
                s_{1-4}
                s_{1-3,5}^{-1}
            }
        };
    \end{tikzpicture}
    </script>
    ```

---

## Identity levels

The token:

```latex
1
```

adds one complete braid level without a crossing.

It is useful for spacing crossings or aligning diagrams.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="460"
      data-height="330"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            every strand/.style={ultra thick},
            strand 1/.style={red},
            strand 2/.style={green!60!black},
            strand 3/.style={blue}
        ] {
            braid={
                s_1
                1
                s_2^{-1}
                1
                s_1
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="460"
      data-height="330"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            every strand/.style={ultra thick},
            strand 1/.style={red},
            strand 2/.style={green!60!black},
            strand 3/.style={blue}
        ] {
            braid={
                s_1
                1
                s_2^{-1}
                1
                s_1
            }
        };
    \end{tikzpicture}
    </script>
    ```

---

## Setting the number of strands

The library normally infers the strand count from the braid word.

Use `number of strands` to set a minimum explicitly:

```latex
braid/number of strands=5
```

This is especially useful for an identity braid or when some strands never participate in a crossing.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="560"
      data-height="280"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            number of strands=5,
            every strand/.style={very thick},
            strand 1/.style={red},
            strand 2/.style={orange},
            strand 3/.style={green!50!black},
            strand 4/.style={blue},
            strand 5/.style={purple}
        ] {
            braid={
                s_2
                s_3^{-1}
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="560"
      data-height="280"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            number of strands=5,
            every strand/.style={very thick},
            strand 1/.style={red},
            strand 2/.style={orange},
            strand 3/.style={green!50!black},
            strand 4/.style={blue},
            strand 5/.style={purple}
        ] {
            braid={
                s_2
                s_3^{-1}
            }
        };
    \end{tikzpicture}
    </script>
    ```

---

## Styling strands

Options placed directly on the braid pic are applied to all strands.

The braid namespace also provides:

```text
every strand
strand 1
strand 2
strand 3
...
```

The strand number refers to its starting position.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="520"
      data-height="330"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            every strand/.style={
                line width=4pt,
                line cap=round
            },
            strand 1/.style={red},
            strand 2/.style={green!60!black,dashed},
            strand 3/.style={blue}
        ] {
            braid={
                s_1
                s_2^{-1}
                s_1
                s_2
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="520"
      data-height="330"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            every strand/.style={
                line width=4pt,
                line cap=round
            },
            strand 1/.style={red},
            strand 2/.style={green!60!black,dashed},
            strand 3/.style={blue}
        ] {
            braid={
                s_1
                s_2^{-1}
                s_1
                s_2
            }
        };
    \end{tikzpicture}
    </script>
    ```

The ordinary TikZ drawing options remain available:

```text
draw
line width
dashed
dotted
opacity
line cap
```

Explicit colors remain explicit when the surrounding site changes theme.

---

## Strand separation and crossing height

The primary geometry keys are:

```text
width
crossing height
border height
```

`width` controls horizontal strand separation.

`crossing height` controls the vertical space occupied by one braid element.

`border height` extends the straight portions at the beginning and end.

!!! warning "Use `crossing height`, not the legacy `height` key"

    The historical `height` key is kept for compatibility but has counter-intuitive sign behavior.

    New diagrams should use:

    ```latex
    crossing height=14mm
    ```

    Change braid direction with a TikZ transformation such as `rotate`, `yscale`, or `xscale`.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="620"
      data-height="360"
    >
    \begin{tikzpicture}
        \pic[
            ultra thick,
            braid/.cd,
            width=13mm,
            crossing height=12mm,
            border height=5mm,
            strand 1/.style={red},
            strand 2/.style={green!60!black},
            strand 3/.style={blue}
        ] {
            braid={
                s_1
                s_2^{-1}
                s_1
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="620"
      data-height="360"
    >
    \begin{tikzpicture}
        \pic[
            ultra thick,
            braid/.cd,
            width=13mm,
            crossing height=12mm,
            border height=5mm,
            strand 1/.style={red},
            strand 2/.style={green!60!black},
            strand 3/.style={blue}
        ] {
            braid={
                s_1
                s_2^{-1}
                s_1
            }
        };
    \end{tikzpicture}
    </script>
    ```

---

## Crossing gap and curvature

The under-strand is interrupted at each crossing.

Use:

```text
gap
control factor
nudge factor
```

`gap` controls the interrupted section and should be strictly between `0` and `.5`.

`control factor` changes the Bézier curvature of crossing segments.

`nudge factor` offsets adjacent crossing segments slightly to avoid renderer artifacts.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="620"
      data-height="330"
    >
    \begin{tikzpicture}
        \pic[
            draw=purple,
            line width=3pt,
            braid/.cd,
            width=12mm,
            crossing height=11mm,
            gap=.28,
            control factor=.35,
            nudge factor=.08,
            border height=4mm
        ] {
            braid={
                s_1
                s_2
                s_1^{-1}
                s_2^{-1}
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="620"
      data-height="330"
    >
    \begin{tikzpicture}
        \pic[
            draw=purple,
            line width=3pt,
            braid/.cd,
            width=12mm,
            crossing height=11mm,
            gap=.28,
            control factor=.35,
            nudge factor=.08,
            border height=4mm
        ] {
            braid={
                s_1
                s_2
                s_1^{-1}
                s_2^{-1}
            }
        };
    \end{tikzpicture}
    </script>
    ```

Avoid setting `nudge factor=0` in published diagrams because some SVG or PDF rendering paths can show small visual artifacts at certain scales.

---

## Straight crossing segments

Set:

```latex
control factor=0
```

to use straight crossing segments.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="540"
      data-height="300"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            number of strands=3,
            every strand/.style={line width=6pt},
            strand 1/.style={red},
            strand 2/.style={green!60!black},
            strand 3/.style={blue},
            gap=.12,
            control factor=0,
            nudge factor=.02
        ] {
            braid={
                s_2
                s_1
                s_2^{-1}
                s_1
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="540"
      data-height="300"
    >
    \begin{tikzpicture}
        \pic[
            braid/.cd,
            number of strands=3,
            every strand/.style={line width=6pt},
            strand 1/.style={red},
            strand 2/.style={green!60!black},
            strand 3/.style={blue},
            gap=.12,
            control factor=0,
            nudge factor=.02
        ] {
            braid={
                s_2
                s_1
                s_2^{-1}
                s_1
            }
        };
    \end{tikzpicture}
    </script>
    ```

---

## Rotating and reflecting braids

The default braid flows down the page.

Use ordinary TikZ transformations to change its direction:

```text
rotate=90
rotate=180
yscale=-1
xscale=-1
```

For consistent positioning, combine the transformation with:

```latex
braid/anchor=center
```
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="720"
      data-height="280"
    >
    \begin{tikzpicture}[
        every braid/.style={
            ultra thick,
            braid/anchor=center,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue}
        }
    ]
        \pic at (-3,0) {
            braid={s_1 s_2^{-1}}
        };

        \pic[
            rotate=90
        ] at (0,0) {
            braid={s_1 s_2^{-1}}
        };

        \pic[
            yscale=-1
        ] at (3,0) {
            braid={s_1 s_2^{-1}}
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="720"
      data-height="280"
    >
    \begin{tikzpicture}[
        every braid/.style={
            ultra thick,
            braid/anchor=center,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue}
        }
    ]
        \pic at (-3,0) {
            braid={s_1 s_2^{-1}}
        };

        \pic[
            rotate=90
        ] at (0,0) {
            braid={s_1 s_2^{-1}}
        };

        \pic[
            yscale=-1
        ] at (3,0) {
            braid={s_1 s_2^{-1}}
        };
    \end{tikzpicture}
    </script>
    ```

---

## Crossing conventions

The default convention treats a positive generator as an over-crossing.

The braid namespace provides:

```text
crossing convention
flip crossing convention
set symbols
flip symbols
```

The accepted convention values include:

```text
over
under
down
up
```

`over` and `down` are synonyms.

`under` and `up` are synonyms.

`crossing convention` changes how each crossing is drawn.

`set symbols` changes the braid element represented by each symbol, which matters for multi-strand generator forms.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="720"
      data-height="300"
    >
    \begin{tikzpicture}[
        every braid/.style={
            ultra thick,
            braid/anchor=center,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue}
        }
    ]
        \pic at (-3,0) {
            braid={s_{1-3}}
        };

        \pic[
            braid/crossing convention=under
        ] at (0,0) {
            braid={s_{1-3}}
        };

        \pic[
            braid/set symbols=under
        ] at (3,0) {
            braid={s_{1-3}}
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="720"
      data-height="300"
    >
    \begin{tikzpicture}[
        every braid/.style={
            ultra thick,
            braid/anchor=center,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue}
        }
    ]
        \pic at (-3,0) {
            braid={s_{1-3}}
        };

        \pic[
            braid/crossing convention=under
        ] at (0,0) {
            braid={s_{1-3}}
        };

        \pic[
            braid/set symbols=under
        ] at (3,0) {
            braid={s_{1-3}}
        };
    \end{tikzpicture}
    </script>
    ```

---

## Floors

A vertical bar in the braid word inserts a floor behind the corresponding level:

```latex
| s_1 s_2 | s_1^{-1}
```

The standard floor is a rectangular pic behind the strands.

Style all floors with:

```text
every floor
```

Style a selected level with:

```text
floor 1
floor 2
floor 3
```
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="560"
      data-height="360"
    >
    \begin{tikzpicture}
        \pic[
            line width=2pt,
            braid/.cd,
            every floor/.style={
                fill=yellow!25,
                draw=black
            },
            floor 3/.style={
                fill=blue!12,
                draw=blue,
                dashed
            },
            strand 1/.style={red},
            strand 2/.style={green!60!black},
            strand 3/.style={blue}
        ] {
            braid={
                | s_1
                s_2
                | s_1^{-1}
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="560"
      data-height="360"
    >
    \begin{tikzpicture}
        \pic[
            line width=2pt,
            braid/.cd,
            every floor/.style={
                fill=yellow!25,
                draw=black
            },
            floor 3/.style={
                fill=blue!12,
                draw=blue,
                dashed
            },
            strand 1/.style={red},
            strand 2/.style={green!60!black},
            strand 3/.style={blue}
        ] {
            braid={
                | s_1
                s_2
                | s_1^{-1}
            }
        };
    \end{tikzpicture}
    </script>
    ```

A more general floor can be added with:

```latex
braid/add floor={x,y,width,height,name}
```

The values use the braid's natural units:

* strand separation horizontally;
* crossing levels vertically.

The optional name allows a matching style such as:

```latex
braid/floor highlight/.style={fill=pink}
```

---

## Named braid coordinates

Name the braid pic to expose coordinates along every strand:

```latex
\pic (demo) {braid={s_1 s_2}};
```

Coordinate names include:

```text
demo-1-s
demo-1-e
demo-1-0
demo-1-1
demo-rev-1-s
demo-rev-1-e
```

The first number identifies a strand by its initial position.

The `rev` form identifies it by its final position.

The crossing identifier may be a number, `s` for the start, or `e` for the end.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="620"
      data-height="340"
    >
    \begin{tikzpicture}
        \pic[
            ultra thick,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue}
        ] (coords) {
            braid={
                s_1
                s_2^{-1}
            }
        };

        \node[
            left,
            red!70!black
        ] at (coords-1-s) {
            strand 1 start
        };

        \node[
            right,
            red!70!black
        ] at (coords-1-e) {
            strand 1 end
        };

        \fill[black]
            (coords-2-1) circle (2pt);
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="620"
      data-height="340"
    >
    \begin{tikzpicture}
        \pic[
            ultra thick,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue}
        ] (coords) {
            braid={
                s_1
                s_2^{-1}
            }
        };

        \node[
            left,
            red!70!black
        ] at (coords-1-s) {
            strand 1 start
        };

        \node[
            right,
            red!70!black
        ] at (coords-1-e) {
            strand 1 end
        };

        \fill[black]
            (coords-2-1) circle (2pt);
    \end{tikzpicture}
    </script>
    ```

---

## Bounding anchors

A named braid also exposes rectangular anchors around the complete braid:

```text
north
south
east
west
north east
north west
south east
south west
center
```

Use them as ordinary TikZ coordinates:

```latex
(coords.east)
(coords.south)
```
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="620"
      data-height="360"
    >
    \begin{tikzpicture}
        \pic[
            ultra thick,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue}
        ] (anchors) {
            braid={
                s_1
                s_2^{-1}
                s_1
            }
        };

        \draw[<-]
            (anchors.east)
            -- +(1,0)
            node[right] {east};

        \draw[<-]
            (anchors.west)
            -- +(-1,0)
            node[left] {west};

        \draw[<-]
            (anchors.north)
            -- +(0,1)
            node[above] {north};

        \draw[<-]
            (anchors.south)
            -- +(0,-1)
            node[below] {south};
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="620"
      data-height="360"
    >
    \begin{tikzpicture}
        \pic[
            ultra thick,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue}
        ] (anchors) {
            braid={
                s_1
                s_2^{-1}
                s_1
            }
        };

        \draw[<-]
            (anchors.east)
            -- +(1,0)
            node[right] {east};

        \draw[<-]
            (anchors.west)
            -- +(-1,0)
            node[left] {west};

        \draw[<-]
            (anchors.north)
            -- +(0,1)
            node[above] {north};

        \draw[<-]
            (anchors.south)
            -- +(0,-1)
            node[below] {south};
    \end{tikzpicture}
    </script>
    ```

---

## Positioning with `braid/anchor`

The `anchor` key selects the point placed at the pic coordinate.

A rectangular anchor may be used:

```latex
braid/anchor=center
```

A strand-level coordinate may also be used:

```latex
braid/anchor=3-2
```

The latter aligns strand 3 at level 2 with the `at (...)` position.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="600"
      data-height="330"
    >
    \begin{tikzpicture}
        \fill[purple]
            (0,0) circle (3mm);

        \pic[
            rotate=90,
            braid/anchor=3-2,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue},
            ultra thick
        ] at (0,0) {
            braid={
                s_2
                s_1
                s_2
                s_1
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="600"
      data-height="330"
    >
    \begin{tikzpicture}
        \fill[purple]
            (0,0) circle (3mm);

        \pic[
            rotate=90,
            braid/anchor=3-2,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue},
            ultra thick
        ] at (0,0) {
            braid={
                s_2
                s_1
                s_2
                s_1
            }
        };
    \end{tikzpicture}
    </script>
    ```

---

## Several braids in one diagram

Several braid pics can share one TikZ picture.

Use a common `every braid` style for consistent geometry and colors.
=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="760"
      data-height="340"
    >
    \begin{tikzpicture}[
        every braid/.style={
            ultra thick,
            braid/anchor=center,
            braid/width=9mm,
            braid/crossing height=9mm,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue}
        }
    ]
        \pic at (-3,0) {
            braid={s_1 s_2^{-1} s_1}
        };

        \pic at (0,0) {
            braid={s_2 s_1^{-1} s_2}
        };

        \pic at (3,0) {
            braid={s_1-s_3 s_2^{-1}}
        };
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
      data-width="760"
      data-height="340"
    >
    \begin{tikzpicture}[
        every braid/.style={
            ultra thick,
            braid/anchor=center,
            braid/width=9mm,
            braid/crossing height=9mm,
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue}
        }
    ]
        \pic at (-3,0) {
            braid={s_1 s_2^{-1} s_1}
        };

        \pic at (0,0) {
            braid={s_2 s_1^{-1} s_2}
        };

        \pic at (3,0) {
            braid={s_1-s_3 s_2^{-1}}
        };
    \end{tikzpicture}
    </script>
    ```

The third example needs at least four strands because it uses `s_3`.

The library increases the strand count automatically.

---

## Combining `braids` with other TikZ libraries

Declare several local TikZ libraries with a comma-separated list:

```html
data-tikz-libraries="braids,decorations.markings"
```

Only request libraries used by the current diagram.

!!! warning

    Additional libraries enlarge the generated preamble and may increase compilation time.

    A missing optional library can also make an otherwise valid braid fail.

---

## Global loading

Load `braids` globally only when it is needed by most diagrams:

```js
window.TikzJaxOptions = {
    tex: {
        tikzLibraries: [
            "braids"
        ]
    }
};
```

After global loading, individual diagrams do not need:

```html
data-tikz-libraries="braids"
```

!!! warning "Performance"

    Global loading inserts:

    ```latex
    \usetikzlibrary{braids}
    ```

    into every TikZJax document.

    Ordinary TikZ diagrams will therefore initialize the braid library even when they contain no braid.

    Prefer local loading unless braid diagrams are common across the site.

---

## MkDocs fenced blocks

A fenced `tikzjax` block cannot contain HTML `data-*` attributes.

A fenced braid therefore works only when the `braids` library is configured globally.

=== "Rendering"

    <script
      type="text/tikz"
      data-tikz-libraries="braids"
    >
    \begin{tikzpicture}
        \pic[
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue},
            ultra thick
        ] {
            braid={
                s_1
                s_2^{-1}
                s_1
            }
        };
    \end{tikzpicture}
    </script>

=== ":fa-markdown: Markdown"

    ````markdown
    ```tikzjax
    \begin{tikzpicture}
        \pic[
            braid/strand 1/.style={red},
            braid/strand 2/.style={green!60!black},
            braid/strand 3/.style={blue},
            ultra thick
        ] {
            braid={
                s_1
                s_2^{-1}
                s_1
            }
        };
    \end{tikzpicture}
    ```
    ````

!!! important

    For portable local loading, prefer:

    ```html
    <script
      type="text/tikz"
      data-tikz-libraries="braids"
    >
    ...
    </script>
    ```

---

## MkDocs Content Tabs

=== "Rendering"

    === "Question"

        Draw the braid word \(s_1s_2^{-1}s_1\) with three colored strands.

    === "Solution"

        <script
          type="text/tikz"
          data-tikz-libraries="braids"
          data-width="460"
          data-height="300"
        >
        \begin{tikzpicture}
            \pic[
                ultra thick,
                braid/strand 1/.style={red},
                braid/strand 2/.style={green!60!black},
                braid/strand 3/.style={blue}
            ] {
                braid={
                    s_1
                    s_2^{-1}
                    s_1
                }
            };
        \end{tikzpicture}
        </script>

=== ":fa-markdown: Markdown"

    ````markdown
    === "Question"

        Draw the braid word \(s_1s_2^{-1}s_1\) with three colored strands.

    === "Solution"

        <script
          type="text/tikz"
          data-tikz-libraries="braids"
          data-width="460"
          data-height="300"
        >
        \begin{tikzpicture}
            \pic[
                ultra thick,
                braid/strand 1/.style={red},
                braid/strand 2/.style={green!60!black},
                braid/strand 3/.style={blue}
            ] {
                braid={
                    s_1
                    s_2^{-1}
                    s_1
                }
            };
        \end{tikzpicture}
        </script>
    ````

TikZJax automatically rescans Material for MkDocs Content Tabs when they become visible.

---

## MkDocs admonitions

=== "Rendering"

    !!! example "Four-strand braid"

        <script
          type="text/tikz"
          data-tikz-libraries="braids"
          data-width="520"
          data-height="320"
        >
        \begin{tikzpicture}
            \pic[
                braid/.cd,
                number of strands=4,
                every strand/.style={very thick},
                strand 1/.style={red},
                strand 2/.style={orange},
                strand 3/.style={green!50!black},
                strand 4/.style={blue}
            ] {
                braid={
                    s_1-s_3
                    s_2^{-1}
                    s_1
                }
            };
        \end{tikzpicture}
        </script>

=== ":fa-markdown: Markdown"

    ````markdown
    !!! example "Four-strand braid"

        <script
          type="text/tikz"
          data-tikz-libraries="braids"
          data-width="520"
          data-height="320"
        >
        \begin{tikzpicture}
            \pic[
                braid/.cd,
                number of strands=4,
                every strand/.style={very thick},
                strand 1/.style={red},
                strand 2/.style={orange},
                strand 3/.style={green!50!black},
                strand 4/.style={blue}
            ] {
                braid={
                    s_1-s_3
                    s_2^{-1}
                    s_1
                }
            };
        \end{tikzpicture}
        </script>
    ````

---

## Loader dimensions

Braid diagrams can be tall, wide, or rotated.

Reserve suitable loading space with:

```html
data-width="620"
data-height="360"
```

Example:

```html
<script
  type="text/tikz"
  data-tikz-libraries="braids"
  data-width="620"
  data-height="360"
>
\begin{tikzpicture}
    \pic {
        braid={
            s_1
            s_2^{-1}
            s_1
            s_2
            s_1^{-1}
        }
    };
\end{tikzpicture}
</script>
```

These values affect only the loading placeholder.

They do not resize the final SVG.

The final dimensions are controlled by the TikZ picture, braid geometry, line widths, annotations, and transformations.

---

## Timeout and debugging options

A complex braid can combine several local runtime options:

```html
<script
  type="text/tikz"
  data-tikz-libraries="braids"
  data-render-timeout="30000"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    \pic[
        braid/number of strands=6
    ] {
        braid={
            s_1-s_3-s_5
            s_2^{-1}-s_4
            s_1-s_3
            s_2^{-1}-s_4^{-1}
        }
    };
\end{tikzpicture}
</script>
```

Use:

```html
data-disable-cache="true"
```

while changing the braid source.

Use:

```html
data-show-console="true"
```

when diagnosing a TeX, TikZ-library, or braid-word error.

Use a larger timeout for a long braid with many strands, floors, annotations, or decorations.

---

## Parallel rendering

TikZJax places uncached diagrams in a global rendering queue.

Several braid diagrams can be compiled concurrently:

```text
worker 1 -> braid A
worker 2 -> braid B
worker 3 -> another TikZ diagram
```

Each worker renders one diagram at a time.

When a worker finishes, it takes another diagram from the queue.

Each worker maintains its own in-memory cache of downloaded and decompressed TeX files.

The first braid assigned to a worker may therefore take slightly longer than later braids handled by that worker.

!!! tip

    Local loading with `data-tikz-libraries="braids"` remains fully compatible with parallel rendering.

    The local library declaration travels with the individual diagram assigned to a worker.

---

## Identical diagrams

When several identical braid diagrams are discovered while the same render is still pending, TikZJax can group them into one rendering operation.

The resulting SVG is reused for all matching targets.

The source and complete local dataset must match, including:

* `data-tikz-libraries`;
* local package declarations;
* local preamble;
* dimensions;
* timeout options;
* cache options;
* the exact braid word;
* all TikZ and braid styles.

---

## Debugging

### Enable TeX logs

```html
<script
  type="text/tikz"
  data-tikz-libraries="braids"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{tikzpicture}
    \pic {
        braid={
            s_1
            s_2^{-1}
        }
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

### Inspect globally configured TikZ libraries

```js
window.TikzJaxOptions?.tex?.tikzLibraries
```

### Missing library file

A missing library generally appears as a request resembling:

```text
GET .../tex_files/tikzlibrarybraids.code.tex.gz 404
```

Use the exact failed request shown by the browser console when updating the runtime catalogue.

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

### Unknown `braid` pic

The TikZ library was not loaded.

Add:

```html
data-tikz-libraries="braids"
```

or configure it globally.

---

### `braids.sty` is loaded but new keys are missing

The document is using the historical package interface.

The maintained implementation is the TikZ library:

```latex
\usetikzlibrary{braids}
```

In TikZJax, use:

```html
data-tikz-libraries="braids"
```

---

### A crossing direction is reversed

Check whether the generator should be positive or negative:

```latex
s_1
s_1^{-1}
```

Also inspect:

```text
crossing convention
set symbols
flip crossing convention
flip symbols
```

---

### The strand count is too small

Set a minimum explicitly:

```latex
braid/number of strands=5
```

The library can automatically increase the count when a larger generator appears, but it cannot infer invisible unused strands.

---

### Simultaneous crossings overlap incorrectly

The library does not validate whether crossings separated by a hyphen can legally occupy the same level.

Replace:

```latex
s_1-s_2
```

with separate levels when the crossings share a strand:

```latex
s_1 s_2
```

---

### The under-strand gap is too wide or too narrow

Adjust:

```latex
braid/gap=.2
```

Keep the value strictly between `0` and `.5`.

---

### The braid flows in the wrong direction

Use a TikZ transformation:

```latex
rotate=90
```

or:

```latex
yscale=-1
```

Do not rely on a negative legacy `height` value.

---

### Named strand coordinates are missing

The braid pic must have a name:

```latex
\pic (demo) {
    braid={s_1 s_2}
};
```

Then use coordinates such as:

```latex
(demo-1-s)
(demo-1-e)
(demo-2-1)
```

---

### A floor does not appear

Check that the braid word contains a vertical bar:

```latex
| s_1
```

Also check whether the floor style has a visible `fill` or `draw` option.

---

### A fenced block fails

Fenced `tikzjax` blocks cannot declare local TikZ libraries.

Configure `braids` globally or replace the fenced block with an HTML `<script>` block containing:

```html
data-tikz-libraries="braids"
```

---

### The loading placeholder is too small

Increase:

```html
data-width
data-height
```

These attributes reserve more room while the braid is compiling.

They do not resize the final SVG.

---

### The first braid is slower

The first worker rendering a braid may need to download and decompress the TikZ-library file.

Later braid diagrams assigned to the same worker can reuse that file from memory.

---

### Changes are not visible

The previous SVG may be stored in IndexedDB.

Use:

```html
data-disable-cache="true"
```

while debugging, or clear the TikZJax database manually.

---

## Common braid keys

| Key | Purpose |
| --- | --- |
| `number of strands` | Set the minimum strand count |
| `width` | Set strand separation |
| `crossing height` | Set one crossing-level height |
| `border height` | Extend strands before and after the braid |
| `gap` | Set the under-strand interruption |
| `control factor` | Set crossing curvature |
| `nudge factor` | Offset neighboring crossing segments |
| `anchor` | Select the point aligned with the pic coordinate |
| `crossing convention` | Choose over/down or under/up behavior |
| `set symbols` | Change the braid element represented by symbols |
| `every strand` | Style every strand |
| `strand <n>` | Style one strand by its starting position |
| `every floor` | Style every floor |
| `floor <n>` | Style a selected floor level |
| `add floor` | Add a custom positioned floor |

---

## Common braid-word forms

| Form | Purpose |
| --- | --- |
| `s_1` | Positive crossing of strands 1 and 2 |
| `s_1^{-1}` | Inverse crossing of strands 1 and 2 |
| `s_{1,3}` | Crossing involving selected strands |
| `s_{1-4}` | Consecutive range shorthand |
| `s_1-s_3` | Compatible crossings at one level |
| `1` | Identity level |
| `|` | Add a floor |

---

## Official documentation

* [`braids` on CTAN](https://ctan.org/pkg/braids)
* [`braids` user manual](https://mirrors.ctan.org/graphics/pgf/contrib/braids/braids.pdf)
* [`braids` source repository](https://github.com/loopspace/braids)
* [`braids` issue tracker](https://github.com/loopspace/braids/issues)

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
* [`kinematikz` examples](kinematikz.md)
* [Installation](../installation/index.md)
* [Configuration](../configuration.md)
* [API Reference](../api-reference.md)
