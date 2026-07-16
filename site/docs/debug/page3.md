# TikZJax package and library runtime tests

This page tests the current supported TikZJax package set:

```json
[
    "tkz-tab",
    "physics",
    "circuitikz",
    "chemfig",
    "yquant",
    "braids",
    "tikz-feynhand",
    "pgf-spectra",
    "kinematikz"
]
```

It also tests selected built-in TikZ libraries.

This page intentionally does **not** load:

* `mathtools`
* `mhchem`
* `cancel`
* `bm`
* `amssymb`

Those packages should normally be handled by MathJax when used in ordinary Markdown mathematics, unless they are explicitly required inside a TikZJax rendering.

All diagrams use:

```html
data-disable-cache="true"
```

so that changes are visible immediately.

New or potentially problematic package tests also use:

```html
data-show-console="true"
```

If a test fails with a broken image, open the browser console and look for missing files such as:

```text
GET /tex_files/some-file.sty.gz 404
```

```text
GET /tex_files/some-file.tex.gz 404
```

```text
GET /tex_files/some-file.code.tex.gz 404
```

---

# Part A — External TeX/TikZ packages

## 1. `tkz-tab`

Expected result:

* a sign and variation table is rendered.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-tex-packages="tkz-tab"
>
\begin{tikzpicture}
\tkzTabInit
  {$x$/1,$f'(x)$/1,$f(x)$/2}
  {$0$,$\dfrac 23$,$+\infty$}

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
  data-show-console="true"
  data-tex-packages="physics"
  data-tikz-libraries="arrows.meta,positioning"
>
\begin{tikzpicture}[>=Stealth, thick]

\draw[->] (-0.5,0) -- (5,0)
  node[right] {$x$};

\node[
  draw,
  fill=blue!8,
  rounded corners,
  minimum width=1cm,
  minimum height=0.8cm
] (m) at (3,0) {$m$};

\draw[
  ->,
  red!70!black,
  very thick
] (m.west) -- ++(-1.2,0)
  node[midway, above]
  {$\vb{F}=-k\vb{x}$};

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

* molecules are drawn with visible chemical bonds;
* not only the atom letters should appear.

Important:

Use `\chemfig` directly. Do **not** wrap it inside another TikZ node.

### 3.1 Methanol-like structure

<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-tex-packages="chemfig"
>
\chemfig{H-C(-[2]H)(-[6]H)-O-H}
</script>

### 3.2 Branched molecule

<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH(-[2]OH)-CH_3}
</script>

### 3.3 Benzene ring

<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-tex-packages="chemfig"
>
\chemfig{*6(-=-=-=)}
</script>

---

## 4. `circuitikz`

Expected result:

* a circuit is rendered with a battery, resistor, and capacitor;
* component labels are visible;
* no `/tikz/l` error appears.

Important:

Do not globally activate these built-in TikZ libraries when testing `circuitikz`:

```text
circuits
circuits.ee
circuits.ee.IEC
```

They must only be loaded locally in the dedicated built-in TikZ circuit test.

### 4.1 Easy package syntax

<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
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

### 4.2 JSON package syntax

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

---

## 5. `yquant`

Expected result:

* two quantum wires are rendered;
* a Hadamard gate is placed on the first wire;
* a controlled-NOT operation connects the two wires;
* measurement symbols appear at the end.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-tex-packages="yquant"
>
\begin{tikzpicture}
\begin{yquant}
qubit q[2];

h q[0];
cnot q[1] | q[0];

measure q;
\end{yquant}
\end{tikzpicture}
</script>

---

## 6. `braids`

Expected result:

* a three-strand braid is rendered;
* the three strands use different colors;
* over-crossings and under-crossings are visible.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-tikz-libraries="braids"
>
\begin{tikzpicture}[
  every braid/.style={
    ultra thick,
    braid/strand 1/.style={red},
    braid/strand 2/.style={green!60!black},
    braid/strand 3/.style={blue},
    braid/anchor=center
  }
]
\pic {
  braid={
    s_1
    s_2^{-1}
    s_1
    s_2
  }
};
\end{tikzpicture}
</script>

---

## 7. `tikz-feynhand`

Expected result:

* three propagator lines meet at a central interaction vertex;
* two fermionic lines and one photon line are rendered;
* the central interaction point is visible.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-tex-packages="tikz-feynhand"
>
\begin{tikzpicture}
\begin{feynhand}

\vertex (a) at (-1.5,-1);
\vertex (b) at (1.5,-1);
\vertex (c) at (0,1.5);

\vertex[dot] (o) at (0,0) {};

\propag[fermion]      (a) to (o);
\propag[anti fermion] (b) to (o);
\propag[photon]       (o) to (c);

\end{feynhand}
\end{tikzpicture}
</script>

---

## 8. `pgf-spectra`

Expected result:

* the visible hydrogen emission spectrum is rendered;
* colored spectral lines are visible;
* an axis and an element label are displayed.

This package may require several spectrum data files. Check the console carefully for missing `.tex.gz`, `.def.gz`, or data files.

<script
  type="text/tikz"
  data-show-console="true"
  data-tex-packages="pgf-spectra"
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

---

## 9. `kinematikz`

Expected result:

* a fixed triangular frame is rendered;
* several mechanical links and revolute joints form a kinematic chain.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
  data-tex-packages="kinematikz"
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

---

# Part B — Built-in TikZ libraries

## 10. Built-in TikZ electrical circuits

Expected result:

* a circuit is rendered using only built-in PGF/TikZ circuit libraries;
* this test does **not** use the external `circuitikz` package.

The circuit libraries are intentionally loaded only for this diagram.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-show-console="true"
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
    to[resistor={info=$R_1$}] (3,2)
    to[capacitor={info=$C$}] (3,0)
    -- (0,0);

\draw
  (3,2) -- (5,2)
    to[resistor={info=$R_2$}] (5,0)
    -- (3,0);

\node at (2.5,-0.6) {
  Built-in TikZ \texttt{circuits.ee.IEC}
};

\end{tikzpicture}
</script>

---

## 11. Basic TikZ

Expected result:

* a Cartesian coordinate system is rendered;
* axis graduations and labels are visible;
* a blue straight-line graph is displayed.

<script
  type="text/tikz"
  data-disable-cache="true"
>
\begin{tikzpicture}

\draw[->] (-5,0) -- (5,0)
  node[right] {$x$};

\draw[->] (0,-5) -- (0,5)
  node[above] {$y$};

\foreach \x in {-4,-3,-2,-1,1,2,3,4}
  \draw
    (\x cm,1pt) --
    (\x cm,-1pt)
    node[anchor=north] {$\x$};

\foreach \y in {-4,-3,-2,-1,1,2,3,4}
  \draw
    (1pt,\y cm) --
    (-1pt,\y cm)
    node[anchor=east] {$\y$};

\draw[
  domain=-2:3,
  smooth,
  variable=\x,
  blue
]
  plot ({\x},{2*\x - 4});

\end{tikzpicture}
</script>

---

## 12. TikZ library `shapes.geometric`

Expected result:

* a five-point star shape is rendered.

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

## 13. TikZ library `calc`

Expected result:

* a red dot appears exactly between points `A` and `B`;
* the midpoint is calculated with TikZ coordinate arithmetic.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="calc"
>
\begin{tikzpicture}

\coordinate (A) at (-2,0);
\coordinate (B) at (2,0);

\draw[thick] (A) -- (B);

\fill[red]
  ($(A)!0.5!(B)$)
  circle (3pt);

\node[below] at (A) {$A$};
\node[below] at (B) {$B$};

\node[above] at ($(A)!0.5!(B)$) {
  midpoint from calc
};

\end{tikzpicture}
</script>

---

## 14. TikZ library `positioning`

Expected result:

* three boxes are placed using `right=of` and `below=of`;
* arrows connect the boxes.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="positioning"
>
\begin{tikzpicture}[
  box/.style={
    draw,
    rounded corners,
    inner sep=6pt
  }
]

\node[box] (A) {
  Start
};

\node[
  box,
  right=1.5cm of A
] (B) {
  Middle
};

\node[
  box,
  below=1cm of B
] (C) {
  End
};

\draw[->, thick] (A) -- (B);
\draw[->, thick] (B) -- (C);

\end{tikzpicture}
</script>

---

## 15. TikZ library `patterns`

Expected result:

* one rectangle is filled with diagonal hatching;
* another rectangle is filled with dots.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="patterns"
>
\begin{tikzpicture}

\draw[
  thick,
  pattern=north east lines
]
  (-2,0) rectangle (0,1);

\draw[
  thick,
  pattern=dots
]
  (0.5,0) rectangle (2.5,1);

\node at (-1,-0.5) {
  north east lines
};

\node at (1.5,-0.5) {
  dots
};

\end{tikzpicture}
</script>

---

## 16. TikZ library `arrows.meta`

Expected result:

* a modern `Stealth` arrow tip is rendered.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="arrows.meta"
>
\begin{tikzpicture}

\draw[
  -{Stealth[length=5mm]},
  very thick
]
  (-2,0) -- (2,0);

\node[above] at (0,0) {
  Stealth arrow from arrows.meta
};

\end{tikzpicture}
</script>

---

## 17. Combined TikZ libraries

This test loads:

* `arrows.meta`
* `calc`
* `positioning`
* `decorations.pathreplacing`

Expected result:

* two positioned boxes are rendered;
* a modern arrow connects them;
* a brace is drawn below them;
* a midpoint label is positioned using `calc`.

<script
  type="text/tikz"
  data-disable-cache="true"
  data-tikz-libraries="arrows.meta,calc,positioning,decorations.pathreplacing"
>
\begin{tikzpicture}[
  box/.style={
    draw,
    rounded corners,
    inner sep=6pt
  }
]

\node[box] (A) {
  Input
};

\node[
  box,
  right=3cm of A
] (B) {
  Output
};

\draw[
  -{Stealth[length=4mm]},
  very thick
]
  (A) -- (B);

\draw[
  decorate,
  decoration={
    brace,
    amplitude=6pt
  }
]
  ($(A.south)+(0,-0.3)$) --
  ($(B.south)+(0,-0.3)$)
  node[
    midway,
    below=8pt
  ] {
    combined libraries
  };

\node[
  above
] at ($(A)!0.5!(B)$) {
  midpoint from calc
};

\end{tikzpicture}
</script>

---

# Part C — Runtime sanity tests

## 18. Cache bypass sanity check

Expected result:

* a simple circle is rendered normally;
* repeated reloads should trigger a new rendering instead of using the TikZJax IndexedDB SVG cache.

<script
  type="text/tikz"
  data-disable-cache="true"
>
\begin{tikzpicture}

\draw[thick]
  (0,0) circle (1);

\node at (0,0) {
  cache bypass
};

\end{tikzpicture}
</script>

---

# Debugging notes

## Clear the TikZJax IndexedDB cache

Run this in the browser console:

```js
indexedDB.deleteDatabase("TikzJax");
location.reload();
```

## Inspect all configured global packages

Run:

```js
window.TikzJaxOptions?.tex?.texPackages
```

## Inspect all configured global TikZ libraries

Run:

```js
window.TikzJaxOptions?.tex?.tikzLibraries
```

## Important `circuitikz` conflict

Do not place these libraries in the global TikZJax configuration:

```text
circuits
circuits.ee
circuits.ee.IEC
```

Load them locally only in the built-in TikZ circuits test.

Otherwise, they can conflict with the external `circuitikz` package.

## Missing runtime files

A missing file commonly appears as:

```text
GET /tex_files/package-name.sty.gz 404
```

```text
GET /tex_files/package-data.tex.gz 404
```

```text
GET /tex_files/tikzlibrary-name.code.tex.gz 404
```

When this happens:

1. inspect the corresponding generated package JSON in `web2js/tex_packages/`;
2. verify that the filename appears in `web2js/tex_files.generated.json`;
3. verify that it appears in `tikzjax/tex_files.json`;
4. regenerate the compressed files with `yarn gen-tex-files`;
5. rebuild TikZJax;
6. deploy the updated `dist/tex_files/` directory.
