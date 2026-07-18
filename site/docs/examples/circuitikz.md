# `circuitikz` Examples

[`circuitikz`](https://ctan.org/pkg/circuitikz) is a LaTeX package for drawing electrical and electronic circuits with TikZ.

It provides components such as:

* batteries and voltage sources;
* resistors;
* capacitors;
* inductors;
* switches;
* diodes and transistors;
* measurement devices;
* labeled connections and branches.

The package is included in the TikZJax runtime, but it is not automatically loaded into every diagram.

For the best performance, load it locally only where it is needed:

```html
<script
  type="text/tikz"
  data-tex-packages="circuitikz"
>
% circuitikz source
</script>
```

For other supported packages, return to the [Examples overview](index.md).

---

## Recommended local loading

Use:

```html
data-tex-packages="circuitikz"
```

on every diagram that uses the `circuitikz` environment or its component syntax.

```html
<script
  type="text/tikz"
  data-tex-packages="circuitikz"
>
\begin{circuitikz}
    \draw
        (0,0)
        to[battery1,l=$V$] (0,2)
        to[R,l=$R$] (3,2)
        -- (3,0)
        -- (0,0);
\end{circuitikz}
</script>
```

Local package declarations are merged with globally configured packages.

They do not replace the global configuration.

!!! tip "Why local loading is recommended"

    `circuitikz` is a large graphical package that is unnecessary for ordinary TikZ diagrams.

    Loading it only for circuit diagrams:

    - reduces unnecessary TeX processing;
    - limits package conflicts;
    - keeps unrelated diagrams faster;
    - avoids adding circuit-specific definitions to every worker task.

---

## Basic RC circuit

This example contains:

* a battery;
* a resistor;
* a capacitor;
* a closed electrical loop.

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="circuitikz"
    >
    \begin{circuitikz}
        \draw
            (0,0)
            to[battery1,l=$V$] (0,2.5)
            to[R,l=$R$] (3.5,2.5)
            to[C,l=$C$] (3.5,0)
            -- (0,0);
    \end{circuitikz}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="circuitikz"
    >
    \begin{circuitikz}
        \draw
            (0,0)
            to[battery1,l=$V$] (0,2.5)
            to[R,l=$R$] (3.5,2.5)
            to[C,l=$C$] (3.5,0)
            -- (0,0);
    \end{circuitikz}
    </script>
    ```

No additional TikZ library is required for this basic example.

---

## JSON package syntax

The package can also be declared with JSON:

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages='{"circuitikz":""}'
    >
    \begin{circuitikz}
        \draw
            (0,0)
            to[battery1,l=$V$] (0,2.5)
            to[R,l=$R$] (3.5,2.5)
            to[C,l=$C$] (3.5,0)
            -- (0,0);
    \end{circuitikz}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages='{"circuitikz":""}'
    >
    \begin{circuitikz}
        \draw
            (0,0)
            to[battery1,l=$V$] (0,2.5)
            to[R,l=$R$] (3.5,2.5)
            to[C,l=$C$] (3.5,0)
            -- (0,0);
    \end{circuitikz}
    </script>
    ```

The simple string form is usually sufficient:

```html
data-tex-packages="circuitikz"
```

Use JSON when package options or several packages must be declared.

---

## Two resistors in series

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="circuitikz"
    >
    \begin{circuitikz}
        \draw
            (0,0)
            to[battery1,l=$V$] (0,3)
            to[R,l=$R_1$] (3,3)
            to[R,l=$R_2$] (5.5,3)
            -- (5.5,0)
            -- (0,0);
    \end{circuitikz}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="circuitikz"
    >
    \begin{circuitikz}
        \draw
            (0,0)
            to[battery1,l=$V$] (0,3)
            to[R,l=$R_1$] (3,3)
            to[R,l=$R_2$] (5.5,3)
            -- (5.5,0)
            -- (0,0);
    \end{circuitikz}
    </script>
    ```

The two resistors are placed in the same branch.

---

## Two resistors in parallel

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="circuitikz"
      data-width="500"
      data-height="260"
    >
    \begin{circuitikz}

        \draw
            (0,0)
            to[battery1,l=$V$] (0,3)
            -- (1.5,3)
            to[R,l=$R_1$] (1.5,0)
            -- (0,0);

        \draw
            (1.5,3)
            -- (4,3)
            to[R,l=$R_2$] (4,0)
            -- (1.5,0);

    \end{circuitikz}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="circuitikz"
      data-width="500"
      data-height="260"
    >
    \begin{circuitikz}

        \draw
            (0,0)
            to[battery1,l=$V$] (0,3)
            -- (1.5,3)
            to[R,l=$R_1$] (1.5,0)
            -- (0,0);

        \draw
            (1.5,3)
            -- (4,3)
            to[R,l=$R_2$] (4,0)
            -- (1.5,0);

    \end{circuitikz}
    </script>
    ```

The two resistor branches share the same upper and lower electrical nodes.

---

## RLC series circuit

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="circuitikz"
      data-width="600"
      data-height="260"
    >
    \begin{circuitikz}
        \draw
            (0,0)
            to[battery1,l=$V$] (0,3)
            to[R,l=$R$] (2.5,3)
            to[L,l=$L$] (5,3)
            to[C,l=$C$] (7,3)
            -- (7,0)
            -- (0,0);
    \end{circuitikz}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="circuitikz"
      data-width="600"
      data-height="260"
    >
    \begin{circuitikz}
        \draw
            (0,0)
            to[battery1,l=$V$] (0,3)
            to[R,l=$R$] (2.5,3)
            to[L,l=$L$] (5,3)
            to[C,l=$C$] (7,3)
            -- (7,0)
            -- (0,0);
    \end{circuitikz}
    </script>
    ```

This circuit combines:

```text
R  resistor
L  inductor
C  capacitor
```

---

## Component labels

Component labels use the `l` key:

```latex
to[R,l=$R$]
to[C,l=$C$]
to[L,l=$L$]
to[battery1,l=$V$]
```

The label is part of the component options:

```html
<script
  type="text/tikz"
  data-tex-packages="circuitikz"
>
\begin{circuitikz}
    \draw
        (0,0)
        to[R,l=$R_1$] (3,0);
\end{circuitikz}
</script>
```

!!! warning

    If the browser console reports an error involving:

    ```text
    /tikz/l
    ```

    check that the built-in TikZ circuit libraries have not been loaded globally.

    This problem is generally caused by a conflict between two different circuit systems, not by the `l` label itself.

---

## External `circuitikz` versus built-in TikZ circuits

TikZJax supports two different electrical-circuit systems.

### External package

```html
data-tex-packages="circuitikz"
```

with:

```latex
\begin{circuitikz}
    ...
\end{circuitikz}
```

### Built-in TikZ libraries

```html
data-tikz-libraries="circuits,circuits.ee,circuits.ee.IEC"
```

with:

```latex
\begin{tikzpicture}[
    circuit ee IEC
]
    ...
\end{tikzpicture}
```

These systems are not interchangeable.

!!! danger "Do not load both systems globally"

    Do not globally activate:

    ```text
    circuits
    circuits.ee
    circuits.ee.IEC
    ```

    when the site also uses the external `circuitikz` package.

    The built-in libraries can redefine keys used by `circuitikz`, including component-label keys.

    Load the built-in circuit libraries locally only for the diagrams that intentionally use them.

For an example using the built-in circuit libraries, see [TikZ examples](tikz.md#built-in-tikz-electrical-circuits).

---

## Loading several packages

Several packages can be loaded locally with a comma-separated list:

```html
<script
  type="text/tikz"
  data-tex-packages="circuitikz,physics"
>
% Circuit using both circuitikz and physics notation
</script>
```

They can also be declared with JSON:

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "circuitikz": "",
    "physics": ""
  }'
>
% Diagram source
</script>
```

Only load packages that are actually required by the diagram.

Package combinations can increase compilation time and may introduce conflicts.

---

## Circuit with `physics` notation

This example uses:

* `circuitikz` for the circuit;
* `physics` for vector and derivative notation.

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="circuitikz,physics"
      data-width="520"
      data-height="280"
    >
    \begin{circuitikz}

        \draw
            (0,0)
            to[battery1,l=$V(t)$] (0,3)
            to[R,l=$R$] (3,3)
            to[C,l=$C$] (3,0)
            -- (0,0);

        \node[
            draw,
            rounded corners,
            fill=blue!8,
            inner sep=7pt
        ] at (5.4,1.5) {
            $\displaystyle
            i(t)=C\dv{u_C}{t}
            $
        };

    \end{circuitikz}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="circuitikz,physics"
      data-width="520"
      data-height="280"
    >
    \begin{circuitikz}

        \draw
            (0,0)
            to[battery1,l=$V(t)$] (0,3)
            to[R,l=$R$] (3,3)
            to[C,l=$C$] (3,0)
            -- (0,0);

        \node[
            draw,
            rounded corners,
            fill=blue!8,
            inner sep=7pt
        ] at (5.4,1.5) {
            $\displaystyle
            i(t)=C\dv{u_C}{t}
            $
        };

    \end{circuitikz}
    </script>
    ```

---

## Global loading

Load `circuitikz` globally only when it is required by most diagrams:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            circuitikz: ""
        }
    }
};
```

After global loading, individual diagrams do not need:

```html
data-tex-packages="circuitikz"
```

!!! warning "Performance"

    Global loading inserts:

    ```latex
    \usepackage{circuitikz}
    ```

    into the preamble of every diagram.

    This means that ordinary TikZ diagrams also process the package, even when they contain no electrical circuit.

    Prefer local loading unless the site is primarily dedicated to circuit diagrams.

---

## MkDocs fenced blocks

A fenced `tikzjax` block cannot contain HTML `data-*` attributes.

Therefore, fenced blocks using `circuitikz` work only when the package is loaded globally.

=== "Rendering"

    <script type="text/tikz">
    \begin{circuitikz}
        \draw
            (0,0)
            to[battery1,l=$V$] (0,2.5)
            to[R,l=$R$] (3.5,2.5)
            to[C,l=$C$] (3.5,0)
            -- (0,0);
    \end{circuitikz}
    </script>

=== ":fa-markdown: Markdown"

    ````markdown
    ```tikzjax
    \begin{circuitikz}
        \draw
            (0,0)
            to[battery1,l=$V$] (0,2.5)
            to[R,l=$R$] (3.5,2.5)
            to[C,l=$C$] (3.5,0)
            -- (0,0);
    \end{circuitikz}
    ```
    ````

!!! important

    For portable local loading, prefer:

    ```html
    <script
      type="text/tikz"
      data-tex-packages="circuitikz"
    >
    ...
    </script>
    ```

---

## MkDocs Content Tabs

=== "Rendering"

    === "Question"

        Draw a series circuit containing a battery, a resistor, and a capacitor.

    === "Solution"

        <script
          type="text/tikz"
          data-tex-packages="circuitikz"
        >
        \begin{circuitikz}
            \draw
                (0,0)
                to[battery1,l=$V$] (0,2.5)
                to[R,l=$R$] (3.5,2.5)
                to[C,l=$C$] (3.5,0)
                -- (0,0);
        \end{circuitikz}
        </script>

=== ":fa-markdown: Markdown"

    ````markdown
    === "Question"

        Draw a series circuit containing a battery, a resistor, and a capacitor.

    === "Solution"

        <script
          type="text/tikz"
          data-tex-packages="circuitikz"
        >
        \begin{circuitikz}
            \draw
                (0,0)
                to[battery1,l=$V$] (0,2.5)
                to[R,l=$R$] (3.5,2.5)
                to[C,l=$C$] (3.5,0)
                -- (0,0);
        \end{circuitikz}
        </script>
    ````

TikZJax automatically rescans MkDocs Material content tabs when they become visible.

---

## MkDocs admonitions

=== "Rendering"

    !!! example "RC circuit"

        <script
          type="text/tikz"
          data-tex-packages="circuitikz"
        >
        \begin{circuitikz}
            \draw
                (0,0)
                to[battery1,l=$V$] (0,2.5)
                to[R,l=$R$] (3.5,2.5)
                to[C,l=$C$] (3.5,0)
                -- (0,0);
        \end{circuitikz}
        </script>

=== ":fa-markdown: Markdown"

    ````markdown
    !!! example "RC circuit"

        <script
          type="text/tikz"
          data-tex-packages="circuitikz"
        >
        \begin{circuitikz}
            \draw
                (0,0)
                to[battery1,l=$V$] (0,2.5)
                to[R,l=$R$] (3.5,2.5)
                to[C,l=$C$] (3.5,0)
                -- (0,0);
        \end{circuitikz}
        </script>
    ````

---

## Loader dimensions

Circuit diagrams are often wider than the default loading placeholder.

Use:

```html
data-width="600"
data-height="280"
```

to reserve sufficient space:

```html
<script
  type="text/tikz"
  data-tex-packages="circuitikz"
  data-width="600"
  data-height="280"
>
\begin{circuitikz}
    % Large circuit
\end{circuitikz}
</script>
```

These values affect only the loading placeholder.

They do not resize the final SVG.

---

## Timeout and debugging options

A circuit can combine several local runtime options:

```html
<script
  type="text/tikz"
  data-tex-packages="circuitikz"
  data-render-timeout="30000"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{circuitikz}
    \draw
        (0,0)
        to[battery1,l=$V$] (0,2)
        to[R,l=$R$] (3,2)
        -- (3,0)
        -- (0,0);
\end{circuitikz}
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

when diagnosing a TeX or package error.

---

## Parallel rendering

TikZJax places all uncached diagrams in a global render queue.

Several circuit diagrams can be compiled concurrently:

```text
worker 1 -> circuit A
worker 2 -> circuit B
worker 3 -> another TikZ diagram
```

Each worker processes one diagram at a time.

When a worker finishes, it takes another diagram from the queue.

Each worker also maintains its own cache of downloaded and decompressed TeX files.

The first `circuitikz` diagram handled by a worker may therefore take longer than later circuit diagrams handled by the same worker.

!!! tip

    Loading `circuitikz` locally does not prevent parallel rendering.

    Each diagram carries its own package configuration into the worker assigned to it.

---

## Debugging

### Enable TeX logs

```html
<script
  type="text/tikz"
  data-tex-packages="circuitikz"
  data-disable-cache="true"
  data-show-console="true"
>
\begin{circuitikz}
    \draw
        (0,0)
        to[R,l=$R$] (3,0);
\end{circuitikz}
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
GET .../tex_files/circuitikz.sty.gz 404
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

### Undefined environment `circuitikz`

The package was not loaded.

Add:

```html
data-tex-packages="circuitikz"
```

or enable it globally.

### Error involving `/tikz/l`

Check the global TikZ library configuration.

Do not globally load:

```text
circuits
circuits.ee
circuits.ee.IEC
```

when using the external `circuitikz` package.

### Components appear without labels

Use the label key inside the component options:

```latex
to[R,l=$R$]
```

not outside the `to[...]` expression.

### A fenced block fails

Fenced `tikzjax` blocks cannot declare local packages.

Load `circuitikz` globally or replace the fenced block with an HTML `<script>` block.

### The loading placeholder is too small

Increase:

```html
data-width
data-height
```

### The first circuit is slower

The first worker rendering `circuitikz` must download and decompress the package and its dependencies.

Later diagrams assigned to the same worker can reuse those files from memory.

### Changes are not visible

The previously rendered SVG may be stored in IndexedDB.

Use:

```html
data-disable-cache="true"
```

while debugging, or clear the TikZJax database manually.

---

## Related documentation

* [Examples overview](index.md)
* [TikZ examples](tikz.md)
* [`physics` examples](physics.md)
* [Installation](../installation/index.md)
* [Configuration](../configuration.md)
* [API Reference](../api-reference.md)
* [`circuitikz` on CTAN](https://ctan.org/pkg/circuitikz)
