# TikZJax package runtime tests

This page tests the current supported TikZJax package set:

```json
[
    "tkz-tab",
    "physics",
    "circuitikz",
    "chemfig"
]
```

It also tests selected TikZ libraries.

This page intentionally does **not** load:

* `mathtools`
* `mhchem`
* `cancel`
* `bm`
* `amssymb`

Those packages should be handled by MathJax when used in normal Markdown math, not by TikZJax, unless they are explicitly needed inside a TikZ picture.

All diagrams use `data-disable-cache="true"` so that changes are visible immediately.

If a test fails with a broken image, open the browser console and look for missing files such as:

```text
GET /tex_files/some-file.sty.gz 404
```

or:

```text
GET /tex_files/some-file.tex.gz 404
```

---

## 1. `tkz-tab`

Expected result:

* a variation table is rendered.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tex-packages="tkz-tab"
>
\begin{tikzpicture}
\tkzTabInit{$x$/1,$f'(x)$/1,$f(x)$/2}{$0$,$1$,$+\infty$}
\tkzTabLine{,+,z,-,}
\tkzTabVar{-/$0$,+/$1$,-/$0$}
\end{tikzpicture}
</script>

---

## 2. `physics`

Expected result:

* vector notation works with `\vb`;
* derivatives work with `\dv`;
* automatic delimiters work with `\qty`;
* TikZ positioning and `Stealth` arrows work.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tex-packages="physics"
  data-tikz-libraries="arrows.meta,positioning"
>
\begin{tikzpicture}[>=Stealth, thick]

\draw[->] (-0.5,0) -- (5,0) node[right] {$x$};

\node[
  draw,
  fill=blue!8,
  rounded corners,
  minimum width=1cm,
  minimum height=0.8cm
] (m) at (3,0) {$m$};

\draw[->, red!70!black, very thick] (m.west) -- ++(-1.2,0)
  node[midway, above] {$\vb{F}=-k\vb{x}$};

\node[
  draw,
  rounded corners,
  fill=yellow!10,
  below=1cm of m,
  align=center
] {
$\displaystyle m\dv[2]{x}{t}+kx=0$\\
$\displaystyle x(t)=A\cos\qty(\omega t+\varphi)$
};

\end{tikzpicture}
</script>

---

## 3. `chemfig`

Expected result:

* molecules are drawn with bonds;
* not only letters should appear.

Important: use `\chemfig` directly. Do **not** wrap it inside a TikZ node.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tex-packages="chemfig"
>
\chemfig{H-C(-[2]H)(-[6]H)-O-H}
</script>

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH(-[2]OH)-CH_3}
</script>

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tex-packages="chemfig"
>
\chemfig{*6(-=-=-=)}
</script>

---

## 4. `circuitikz`

Expected result:

* a circuit is rendered with a battery, resistor, and capacitor.

This test uses the external `circuitikz` package.

NEW :

<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-tex-packages='{"circuitikz":""}'
>
\begin{circuitikz}
\draw
  (0,0) to[battery1,l=$V$] (0,2)
        to[R,l=$R$] (3,2)
        to[C,l=$C$] (3,0)
        -- (0,0);
\end{circuitikz}
</script>

OLD:

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tex-packages="circuitikz"
>
\begin{circuitikz}
\draw
  (0,0) to[battery1,l=$V$] (0,2)
        to[R,l=$R$] (3,2)
        to[C,l=$C$] (3,0)
        -- (0,0);
\end{circuitikz}
</script>

---

## 5. Built-in TikZ circuits

Expected result:

* a circuit is rendered using only built-in PGF/TikZ circuit libraries;
* this does **not** use the external `circuitikz` package.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="circuits,circuits.ee,circuits.ee.IEC"
>
\begin{tikzpicture}[
  circuit ee IEC,
  every circuit symbol/.style={draw,thick},
  thick
]
  \draw (0,0)
    to [battery={info=$9\,\mathrm{V}$}] (0,2)
    to [resistor={info=$R_1$}] (3,2)
    to [capacitor={info=$C$}] (3,0)
    -- (0,0);

  \draw (3,2) -- (5,2)
    to [resistor={info=$R_2$}] (5,0)
    -- (3,0);

  \node at (2.5,-0.6) {Built-in TikZ \texttt{circuits.ee.IEC}};
\end{tikzpicture}
</script>

---

## 6. Basic TikZ

Expected result:

* a simple coordinate system is rendered.

<script
  type="text/tikz"
  data-disable-cache="true"
>
\begin{tikzpicture}
\draw[->] (-5,0) -- (5,0) node[right] {$x$};
\draw[->] (0,-5) -- (0,5) node[above] {$y$};

\foreach \x in {-4,-3,-2,-1,1,2,3,4}
    \draw (\x cm,1pt) -- (\x cm,-1pt) node[anchor=north] {$\x$};

\foreach \y in {-4,-3,-2,-1,1,2,3,4}
    \draw (1pt,\y cm) -- (-1pt,\y cm) node[anchor=east] {$\y$};

\draw[domain=-2:3,smooth,variable=\x,blue] plot ({\x},{2*\x - 4});
\end{tikzpicture}
</script>

---

## 7. TikZ library `shapes.geometric`

Expected result:

* a star shape is rendered.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="shapes.geometric"
>
\begin{tikzpicture}
  \node[
    star,
    star points=5,
    star point ratio=2.5,
    minimum size=2in,
    draw=orange,
    fill=yellow!50,
    thick
  ] at (0,0) {};
\end{tikzpicture}
</script>

---

## 8. TikZ library `calc`

Expected result:

* a red dot appears exactly between points `A` and `B`.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="calc"
>
\begin{tikzpicture}
    \coordinate (A) at (-2,0);
    \coordinate (B) at (2,0);

    \draw[thick] (A) -- (B);
    \fill[red] ($(A)!0.5!(B)$) circle (3pt);

    \node[below] at (A) {$A$};
    \node[below] at (B) {$B$};
    \node[above] at ($(A)!0.5!(B)$) {midpoint from calc};
\end{tikzpicture}
</script>

---

## 9. TikZ library `positioning`

Expected result:

* three boxes are placed using `right=of` and `below=of`;
* arrows connect the boxes.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="positioning"
>
\begin{tikzpicture}[
    box/.style={draw, rounded corners, inner sep=6pt}
]
    \node[box] (A) {Start};
    \node[box, right=1.5cm of A] (B) {Middle};
    \node[box, below=1cm of B] (C) {End};

    \draw[->, thick] (A) -- (B);
    \draw[->, thick] (B) -- (C);
\end{tikzpicture}
</script>

---

## 10. TikZ library `patterns`

Expected result:

* one rectangle is filled with diagonal hatching;
* another rectangle is filled with dots.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="patterns"
>
\begin{tikzpicture}
    \draw[thick, pattern=north east lines] (-2,0) rectangle (0,1);
    \draw[thick, pattern=dots] (0.5,0) rectangle (2.5,1);

    \node at (-1,-0.5) {north east lines};
    \node at (1.5,-0.5) {dots};
\end{tikzpicture}
</script>

---

## 11. TikZ library `arrows.meta`

Expected result:

* the arrow tip is a modern `Stealth` arrow tip.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="arrows.meta"
>
\begin{tikzpicture}
    \draw[-{Stealth[length=5mm]}, very thick] (-2,0) -- (2,0);

    \node[above] at (0,0) {Stealth arrow from arrows.meta};
\end{tikzpicture}
</script>

---

## 12. Combined TikZ libraries

Expected result:

* two positioned boxes are rendered;
* a modern arrow connects them;
* a brace is drawn under the arrow;
* a midpoint label is placed using `calc`.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="arrows.meta,calc,positioning,decorations.pathreplacing"
>
\begin{tikzpicture}[
    box/.style={draw, rounded corners, inner sep=6pt}
]
    \node[box] (A) {Input};
    \node[box, right=3cm of A] (B) {Output};

    \draw[-{Stealth[length=4mm]}, very thick] (A) -- (B);

    \draw[decorate, decoration={brace, amplitude=6pt}]
        ($(A.south)+(0,-0.3)$) -- ($(B.south)+(0,-0.3)$)
        node[midway, below=8pt] {combined libraries};

    \node[above] at ($(A)!0.5!(B)$) {midpoint from calc};
\end{tikzpicture}
</script>

---

## 13. Cache bypass sanity check

Expected result:

* a simple diagram is rendered normally;
* repeated reloads should re-render the diagram instead of relying on IndexedDB cache.

<script
  type="text/tikz"
  data-disable-cache="true"
>
\begin{tikzpicture}
    \draw[thick] (0,0) circle (1);
    \node at (0,0) {cache bypass};
\end{tikzpicture}
</script>

---

## Notes

`mathtools` is intentionally not tested here.

If you need `mathtools` for normal Markdown formulas, configure it in MathJax instead of TikZJax.

If you need `mathtools` inside a TikZJax node, then you must add it back to the TikZJax package bundle and make sure `mhsetup.sty.gz` is present.

To clear TikZJax SVG cache in the browser console:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```
