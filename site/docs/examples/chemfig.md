# `chemfig` Examples

[`chemfig`](https://ctan.org/pkg/chemfig) is a LaTeX package for drawing chemical structures with TikZ.

It can represent:

* linear molecules;
* branched molecules;
* cyclic structures;
* single, double, and triple bonds;
* stereochemical bonds;
* reaction schemes;
* molecule names and annotations.

The package is included in the TikZJax runtime, but it is not automatically loaded into every diagram.

For the best performance, load it locally only where it is needed:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```

For other supported packages, return to the [Examples overview](index.md).

---

## Recommended local loading

Use:

```html
data-tex-packages="chemfig"
```

on each block that uses `\chemfig`, `\chemname`, or the reaction-scheme commands.

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H-C(-[2]H)(-[6]H)-O-H}
</script>
```

Local package declarations are merged with globally configured packages.

They do not replace the global configuration.

!!! tip "Why local loading is recommended"

```
`chemfig` is a specialized graphical package.

Loading it only for chemical diagrams:

- keeps ordinary TikZ diagrams lighter;
- reduces unnecessary TeX processing;
- limits package interactions;
- avoids loading chemical-drawing commands into every worker task.
```

---

## Important usage rule

Use `\chemfig` directly inside the TikZJax block:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```

Do not unnecessarily place it inside another TikZ node:

```latex
\begin{tikzpicture}
    \node {\chemfig{H_3C-CH_2-OH}};
\end{tikzpicture}
```

Although some nested constructions may work, wrapping `\chemfig` inside an additional node can interfere with bond layout, dimensions, or positioning.

For a single molecule, the direct form is simpler and more reliable.

---

## Basic molecule

This example represents a methanol-like structure with visible bonds.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H-C(-[2]H)(-[6]H)-O-H}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H-C(-[2]H)(-[6]H)-O-H}
</script>
```
````

The directions:

```text
[2]
[6]
```

place the branches above and below the main molecular chain.

---

## Ethanol

A compact formula can be written directly with atom groups:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```
````

The hyphens represent visible single bonds.

---

## Branched molecule

This example represents a three-carbon chain with an alcohol branch.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH(-[2]OH)-CH_3}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH(-[2]OH)-CH_3}
</script>
```
````

The fragment:

```latex
(-[2]OH)
```

creates a branch pointing upward.

---

## Molecule with several branches

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{
    CH_3
    -C(
        -[2]CH_3
    )(
        -[6]CH_3
    )
    -CH_2
    -OH
}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{
    CH_3
    -C(
        -[2]CH_3
    )(
        -[6]CH_3
    )
    -CH_2
    -OH
}
</script>
```
````

Whitespace and line breaks can be used to make long `chemfig` source easier to read.

---

## Double bond

A double bond is written with:

```latex
=
```

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_2C=CH-CH_3}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_2C=CH-CH_3}
</script>
```
````

---

## Triple bond

A triple bond is written with:

```latex
~
```

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H-C~C-CH_3}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H-C~C-CH_3}
</script>
```
````

---

## Benzene ring

The following compact syntax creates a six-membered aromatic ring:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{*6(-=-=-=)}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{*6(-=-=-=)}
</script>
```
````

The expression:

```latex
*6(...)
```

creates a regular six-membered ring.

The alternating `-` and `=` symbols create alternating single and double bonds.

---

## Substituted benzene ring

A substituent can be attached to one of the ring positions.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{*6(-=-(-OH)=-=)}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{*6(-=-(-OH)=-=)}
</script>
```
````

This example adds an `OH` group to the aromatic ring.

---

## Carboxylic acid group

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-C(=[2]O)-OH}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-C(=[2]O)-OH}
</script>
```
````

The fragment:

```latex
(=[2]O)
```

creates a double-bonded oxygen above the carbon atom.

---

## Naming a molecule

Use `\chemname` to place a name below a chemical structure.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemname{
    \chemfig{H_3C-CH_2-OH}
}{
    Ethanol
}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemname{
    \chemfig{H_3C-CH_2-OH}
}{
    Ethanol
}
</script>
```
````

---

## Several named molecules

Several structures can be placed in the same block.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
  data-width="620"
  data-height="220"
>
\chemname{
    \chemfig{H_3C-OH}
}{
    Methanol
}
\qquad
\chemname{
    \chemfig{H_3C-CH_2-OH}
}{
    Ethanol
}
\qquad
\chemname{
    \chemfig{H_3C-CH(-[2]OH)-CH_3}
}{
    Propan-2-ol
}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
  data-width="620"
  data-height="220"
>
\chemname{
    \chemfig{H_3C-OH}
}{
    Methanol
}
\qquad
\chemname{
    \chemfig{H_3C-CH_2-OH}
}{
    Ethanol
}
\qquad
\chemname{
    \chemfig{H_3C-CH(-[2]OH)-CH_3}
}{
    Propan-2-ol
}
</script>
```
````

Use larger loader dimensions when displaying several molecules in the same block.

---

## Reaction scheme

`chemfig` also provides commands for reaction schemes.

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
  data-width="600"
  data-height="180"
>
\schemestart
    \chemfig{H_3C-CH_2-OH}
    \arrow{->}
    \chemfig{H_3C-CHO}
\schemestop
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
  data-width="600"
  data-height="180"
>
\schemestart
    \chemfig{H_3C-CH_2-OH}
    \arrow{->}
    \chemfig{H_3C-CHO}
\schemestop
</script>
```
````

The commands:

```latex
\schemestart
\arrow{->}
\schemestop
```

create the reaction layout and arrow.

---

## Reversible reaction

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
  data-width="620"
  data-height="180"
>
\schemestart
    \chemfig{A}
    \+
    \chemfig{B}
    \arrow{<=>}
    \chemfig{C}
\schemestop
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
  data-width="620"
  data-height="180"
>
\schemestart
    \chemfig{A}
    \+
    \chemfig{B}
    \arrow{<=>}
    \chemfig{C}
\schemestop
</script>
```
````

---

## Colored molecule

TikZJax includes the standard color support required by TikZ.

A color can be applied to the entire molecule:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
{\color{blue!70!black}
    \chemfig{H_3C-CH(-[2]OH)-CH_3}
}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
{\color{blue!70!black}
    \chemfig{H_3C-CH(-[2]OH)-CH_3}
}
</script>
```
````

The explicit color is preserved when TikZJax adapts ordinary black text and strokes to the site theme.

---

## Adjusting molecule dimensions

The `\setchemfig` command changes drawing parameters for the current TeX document.

For example:

=== "Rendering"

```
<script
  type="text/tikz"
  data-tex-packages="chemfig"
  data-width="520"
  data-height="220"
>
\setchemfig{
    atom sep=2.6em,
    bond offset=2pt,
    double bond sep=3pt
}

\chemfig{H_3C-CH(-[2]OH)-CH_2-CH_3}
</script>
```

=== ":fa-html5: HTML"

````
```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
  data-width="520"
  data-height="220"
>
\setchemfig{
    atom sep=2.6em,
    bond offset=2pt,
    double bond sep=3pt
}

\chemfig{H_3C-CH(-[2]OH)-CH_2-CH_3}
</script>
```
````

Common settings include:

| Setting           | Purpose                              |
| ----------------- | ------------------------------------ |
| `atom sep`        | Distance between atoms               |
| `bond offset`     | Gap between a bond and an atom label |
| `double bond sep` | Distance between double-bond lines   |

These settings affect only the current TikZJax compilation.

---

## Loading several packages

Several packages can be loaded with a comma-separated list:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig,physics"
>
% Source using both packages
</script>
```

They can also be declared with JSON:

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "chemfig": "",
    "physics": ""
  }'
>
% Diagram source
</script>
```

Only include packages required by the current block.

!!! warning

```
More packages produce a larger TeX preamble and can increase rendering time.

Package combinations may also expose conflicts that do not occur when each package is used separately.
```

---

## Global loading

Load `chemfig` globally only when most diagrams on the site use it:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            chemfig: ""
        }
    }
};
```

After global loading, diagrams do not need:

```html
data-tex-packages="chemfig"
```

!!! warning "Performance"

````
Global loading inserts:

```latex
\usepackage{chemfig}
```

into every diagram.

This means that standard TikZ diagrams also process `chemfig`, even when they contain no chemical structure.

Prefer local loading unless chemical diagrams are used throughout the site.
````

---

## MkDocs fenced blocks

A fenced `tikzjax` block cannot contain HTML `data-*` attributes.

Therefore, fenced blocks using `chemfig` work only when the package is loaded globally.

=== "Rendering"

````
```tikzjax
\chemfig{H_3C-CH_2-OH}
```
````

=== ":fa-markdown: Markdown"

`````
````markdown
```tikzjax
\chemfig{H_3C-CH_2-OH}
```
````
`````

!!! important

````
For portable local loading, prefer:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
>
\chemfig{H_3C-CH_2-OH}
</script>
```
````

---

## MkDocs Content Tabs

=== "Rendering"

```
=== "Question"

    Draw the structural formula of ethanol.

=== "Solution"

    <script
      type="text/tikz"
      data-tex-packages="chemfig"
    >
    \chemname{
        \chemfig{H_3C-CH_2-OH}
    }{
        Ethanol
    }
    </script>
```

=== ":fa-markdown: Markdown"

`````
````markdown
=== "Question"

    Draw the structural formula of ethanol.

=== "Solution"

    <script
      type="text/tikz"
      data-tex-packages="chemfig"
    >
    \chemname{
        \chemfig{H_3C-CH_2-OH}
    }{
        Ethanol
    }
    </script>
````
`````

TikZJax automatically rescans MkDocs Material content tabs when they become visible.

---

## MkDocs admonitions

=== "Rendering"

```
!!! example "Benzene"

    <script
      type="text/tikz"
      data-tex-packages="chemfig"
    >
    \chemname{
        \chemfig{*6(-=-=-=)}
    }{
        Benzene
    }
    </script>
```

=== ":fa-markdown: Markdown"

`````
````markdown
!!! example "Benzene"

    <script
      type="text/tikz"
      data-tex-packages="chemfig"
    >
    \chemname{
        \chemfig{*6(-=-=-=)}
    }{
        Benzene
    }
    </script>
````
`````

---

## Loader dimensions

Chemical structures and reaction schemes can be wider than the default loader.

Reserve more space with:

```html
data-width="600"
data-height="220"
```

Example:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
  data-width="600"
  data-height="220"
>
\schemestart
    \chemfig{H_3C-CH_2-OH}
    \arrow{->}
    \chemfig{H_3C-CHO}
\schemestop
</script>
```

These values affect only the loading placeholder.

They do not resize the final SVG.

---

## Local timeout and debugging

A chemical diagram can combine several local runtime options:

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
  data-render-timeout="30000"
  data-disable-cache="true"
  data-show-console="true"
>
\chemfig{*6(-=-=-=)}
</script>
```

Use:

```html
data-disable-cache="true"
```

while changing the example.

Use:

```html
data-show-console="true"
```

when diagnosing a TeX or runtime error.

---

## Parallel rendering

TikZJax places uncached diagrams in a global rendering queue.

Several chemical structures can be compiled concurrently:

```text
worker 1 -> molecule A
worker 2 -> molecule B
worker 3 -> reaction scheme C
```

Each worker renders one diagram at a time.

When a worker finishes, it takes another diagram from the queue.

Each worker maintains its own in-memory cache of downloaded and decompressed TeX files.

The first `chemfig` diagram handled by a worker may therefore take longer than later `chemfig` diagrams assigned to the same worker.

!!! tip

```
Local package loading remains fully compatible with parallel rendering.

The `chemfig` package declaration travels with the individual diagram when it is assigned to a worker.
```

---

## Debugging

### Enable TeX logs

```html
<script
  type="text/tikz"
  data-tex-packages="chemfig"
  data-disable-cache="true"
  data-show-console="true"
>
\chemfig{H_3C-CH_2-OH}
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
GET .../tex_files/chemfig.sty.gz 404
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

### Undefined control sequence `\chemfig`

The package was not loaded.

Add:

```html
data-tex-packages="chemfig"
```

or enable it globally.

### Only atom letters appear

Check that:

* the source uses valid bond symbols;
* the package is loaded;
* `\chemfig` is used directly;
* the molecule has not been wrapped inside an incompatible TikZ node;
* no required runtime file returned a `404`.

A working example is:

```latex
\chemfig{H_3C-CH_2-OH}
```

### Bonds are missing or incomplete

Open the browser console and look for missing runtime files.

Also verify the molecular syntax. For example:

```latex
H_3C-CH_2-OH
```

contains explicit single bonds, while plain adjacent text does not necessarily create the expected structure.

### A fenced block fails

A fenced `tikzjax` block cannot declare local packages.

Load `chemfig` globally or replace the fenced block with an HTML `<script>` block.

### The reaction scheme is clipped while loading

Increase:

```html
data-width
data-height
```

These attributes reserve more room for the loading placeholder.

### The first molecule is slower

The first worker rendering `chemfig` must download and decompress the package and its dependencies.

Later diagrams assigned to the same worker can reuse those files from memory.

### Changes are not visible

The previous SVG may be stored in IndexedDB.

Use:

```html
data-disable-cache="true"
```

while debugging, or clear the TikZJax database manually.

---

## Common bond syntax

| Syntax     | Meaning                       |
| ---------- | ----------------------------- |
| `-`        | Single bond                   |
| `=`        | Double bond                   |
| `~`        | Triple bond                   |
| `-[2]`     | Single bond pointing upward   |
| `-[6]`     | Single bond pointing downward |
| `(-[2]OH)` | Upward branch                 |
| `*6(...)`  | Six-membered ring             |

---

## Related documentation

* [Examples overview](index.md)
* [TikZ examples](tikz.md)
* [`physics` examples](physics.md)
* [`circuitikz` examples](circuitikz.md)
* [Installation](../installation/index.md)
* [Configuration](../configuration.md)
* [API Reference](../api-reference.md)
* [`chemfig` on CTAN](https://ctan.org/pkg/chemfig)
