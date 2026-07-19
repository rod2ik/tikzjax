# `yquant` Examples

[`yquant`](https://ctan.org/pkg/yquant) is a LaTeX package for drawing quantum circuits with a readable, logic-oriented syntax.

It can represent:

* quantum and classical registers;
* single-qubit gates;
* controlled gates;
* multi-qubit gates;
* measurements;
* initialization and output labels;
* swaps;
* custom operators;
* quantum algorithms and circuit fragments.

`yquant` is built on TikZ and does not require an external circuit-generation program.

The package is included in the TikZJax runtime, but it is not automatically loaded into every diagram.

For the best performance, load it locally only where it is needed:

```html
<script
  type="text/tikz"
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
```

For other supported packages, return to the [Examples overview](index.md).

---

## Recommended local loading

Use:

```html
data-tex-packages="yquant"
```

on every diagram containing a `yquant` environment.

```html
<script
  type="text/tikz"
  data-tex-packages="yquant"
>
\begin{tikzpicture}
\begin{yquant}
    qubit q;
    h q;
    measure q;
\end{yquant}
\end{tikzpicture}
</script>
```

Local packages are merged with globally configured packages.

They do not replace the global configuration.

!!! tip "Why local loading is recommended"

    `yquant` is useful only for quantum-circuit diagrams.

    Loading it locally:

    - keeps ordinary TikZ diagrams lighter;
    - reduces unnecessary TeX processing;
    - limits possible package interactions;
    - avoids adding quantum-circuit definitions to every diagram;
    - allows each circuit to declare exactly what it needs.

---

## Basic circuit

This example creates:

* a two-qubit register;
* a Hadamard gate on the first qubit;
* a controlled-NOT gate;
* a measurement on both qubits.

=== "Rendering"

    <script
      type="text/tikz"
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

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
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
    ```

---

## Circuit structure

A standard `yquant` diagram uses this structure:

```latex
\begin{tikzpicture}
\begin{yquant}

    % Register declarations

    % Quantum operations

\end{yquant}
\end{tikzpicture}
```

Every `yquant` statement ends with a semicolon:

```latex
qubit q[2];
h q[0];
measure q;
```

!!! warning

    Missing semicolons are a common source of compilation errors.

---

## Declaring registers

### One qubit

```latex
qubit q;
```

### Several qubits

```latex
qubit q[3];
```

This creates:

```text
q[0]
q[1]
q[2]
```

### Named input state

A label can be supplied when the register is declared:

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\lvert\psi\rangle$} q;

        h q;
        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\lvert\psi\rangle$} q;

        h q;
        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Several labeled qubits

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="520"
      data-height="220"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\lvert 0\rangle$} a;
        qubit {$\lvert 1\rangle$} b;
        qubit {$\lvert\psi\rangle$} c;

        h a;
        x b;
        z c;

        measure a, b, c;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="520"
      data-height="220"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\lvert 0\rangle$} a;
        qubit {$\lvert 1\rangle$} b;
        qubit {$\lvert\psi\rangle$} c;

        h a;
        x b;
        z c;

        measure a, b, c;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Single-qubit gates

Common built-in gate commands include:

```text
h    Hadamard
x    Pauli X
y    Pauli Y
z    Pauli Z
s    phase gate S
t    phase gate T
```

### Several gates on one register

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\lvert 0\rangle$} q;

        h q;
        x q;
        z q;
        h q;

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\lvert 0\rangle$} q;

        h q;
        x q;
        z q;
        h q;

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Gates on selected qubits

A vector register can be addressed with indices:

```latex
qubit q[3];

h q[0];
x q[1];
z q[2];
```

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q[0];
        x q[1];
        z q[2];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q[0];
        x q[1];
        z q[2];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Gates on a complete register

A command can address the entire vector register:

```latex
h q;
measure q;
```

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q;
        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q;
        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

The operation is applied independently to each sub-register.

---

## Controlled-NOT gate

The controlled-NOT syntax is:

```latex
cnot <target> | <control>;
```

Example:

```latex
cnot q[1] | q[0];
```

Here:

```text
q[0] is the control
q[1] is the target
```

=== "Rendering"

    <script
      type="text/tikz"
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

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
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
    ```

!!! important

    The target appears before the vertical bar.

    The control appears after the vertical bar:

    ```latex
    cnot target | control;
    ```

---

## Bell-state circuit

A Hadamard gate followed by a controlled-NOT gate produces the standard Bell-state circuit layout.

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="440"
      data-height="220"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\lvert 0\rangle$} q[2];

        h q[0];
        cnot q[1] | q[0];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="440"
      data-height="220"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\lvert 0\rangle$} q[2];

        h q[0];
        cnot q[1] | q[0];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Multiple controlled operations

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="560"
      data-height="250"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q[0];

        cnot q[1] | q[0];
        cnot q[2] | q[1];

        x q[0];
        z q[2];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="560"
      data-height="250"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q[0];

        cnot q[1] | q[0];
        cnot q[2] | q[1];

        x q[0];
        z q[2];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Controlled custom gate

A custom rectangular gate can be created with `box`.

The syntax:

```latex
box {$U$} target | control;
```

creates a controlled (U) operation.

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[2];

        h q[0];
        box {$U$} q[1] | q[0];
        h q[0];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[2];

        h q[0];
        box {$U$} q[1] | q[0];
        h q[0];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Custom gates

The `box` command creates a gate with custom content:

```latex
box {$U$} q;
box {$R_x(\theta)$} q;
box {$\sqrt{X}$} q;
```

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="520"
      data-height="190"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q;

        box {$U$} q;
        box {$R_x(\theta)$} q;
        box {$\sqrt{X}$} q;

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="520"
      data-height="190"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q;

        box {$U$} q;
        box {$R_x(\theta)$} q;
        box {$\sqrt{X}$} q;

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Multi-qubit gate

Parentheses select several target wires for a multi-qubit operation:

```latex
box {$U$} (q[0-1]);
```

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="520"
      data-height="240"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q[0];

        box {$U$} (q[0-1]);
        box {$V$} (q[1-2]);

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="520"
      data-height="240"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q[0];

        box {$U$} (q[0-1]);
        box {$V$} (q[1-2]);

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Controlled multi-qubit gate

A multi-qubit target can also have a control:

```latex
box {$U$} (q[1-2]) | q[0];
```

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="560"
      data-height="250"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q[0];

        box {$U$} (q[1-2]) | q[0];

        h q[0];

        box {$V$} (q[0-1]) | q[2];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="560"
      data-height="250"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q[0];

        box {$U$} (q[1-2]) | q[0];

        h q[0];

        box {$V$} (q[0-1]) | q[2];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Addressing registers

Given:

```latex
qubit q[4];
```

the following forms are useful:

| Syntax     | Meaning                                                   |
| ---------- | --------------------------------------------------------- |
| `q[0]`     | First qubit                                               |
| `q[2]`     | Third qubit                                               |
| `q[0-2]`   | Range from `q[0]` to `q[2]`                               |
| `q[0,2]`   | Selected qubits `q[0]` and `q[2]`                         |
| `(q[0-2])` | Multi-register target                                     |
| `(q)`      | Complete register as one multi-register target            |
| `q`        | Apply an operation independently to the register elements |

The distinction between:

```latex
h q;
```

and:

```latex
box {$U$} (q);
```

is important.

The first applies a Hadamard gate separately to every qubit.

The second creates one multi-qubit box spanning the complete register.

---

## Gate on the complete register

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="480"
      data-height="250"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q;
        box {$U_{f(x,y)}$} (q);
        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="480"
      data-height="250"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[3];

        h q;
        box {$U_{f(x,y)}$} (q);
        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Swap gate

A swap exchanges two qubit wires:

```latex
swap (q[0,1]);
```

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[2];

        h q[0];
        x q[1];

        swap (q[0,1]);

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[2];

        h q[0];
        x q[1];

        swap (q[0,1]);

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

The swap is drawn as two connected crosses.

---

## Measurements

Measure one qubit:

```latex
measure q[0];
```

Measure a complete register:

```latex
measure q;
```

### Individually labeled measurements

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[2];

        h q[0];
        cnot q[1] | q[0];

        measure {$Z$} q[0];
        measure {$Z$} q[1];
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[2];

        h q[0];
        cnot q[1] | q[0];

        measure {$Z$} q[0];
        measure {$Z$} q[1];
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Colored gates

TikZ options can be applied locally to an individual operation by placing them before the operation:

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[2];

        [fill=blue!20, draw=blue!70!black]
        h q[0];

        [fill=orange!20, draw=orange!80!black]
        x q[1];

        [fill=green!15, draw=green!50!black]
        box {$U$} q[1] | q[0];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[2];

        [fill=blue!20, draw=blue!70!black]
        h q[0];

        [fill=orange!20, draw=orange!80!black]
        x q[1];

        [fill=green!15, draw=green!50!black]
        box {$U$} q[1] | q[0];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

The options apply only to the operation immediately following them.

---

## A three-qubit circuit

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="620"
      data-height="280"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\lvert 0\rangle$} q[3];

        h q[0];

        cnot q[1] | q[0];
        cnot q[2] | q[1];

        box {$R_z(\theta)$} q[0];
        box {$U$} (q[1-2]) | q[0];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
      data-width="620"
      data-height="280"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\lvert 0\rangle$} q[3];

        h q[0];

        cnot q[1] | q[0];
        cnot q[2] | q[1];

        box {$R_z(\theta)$} q[0];
        box {$U$} (q[1-2]) | q[0];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

---

## Loading several packages

Several packages can be loaded locally with a comma-separated list:

```html
<script
  type="text/tikz"
  data-tex-packages="yquant,physics"
>
% Source using yquant and physics notation
</script>
```

They can also be declared with JSON:

```html
<script
  type="text/tikz"
  data-tex-packages='{
    "yquant": "",
    "physics": ""
  }'
>
% Diagram source
</script>
```

Only include packages that are required by the current circuit.

!!! warning

    More packages produce a larger preamble and can increase compilation time.

    Package combinations may also introduce conflicts that do not occur when each package is used independently.

---

## `yquant` with `physics`

The `physics` package can provide bra-ket notation in custom gate labels.

=== "Rendering"

    <script
      type="text/tikz"
      data-tex-packages="yquant,physics"
      data-width="520"
      data-height="230"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\ket{0}$} q[2];

        h q[0];
        cnot q[1] | q[0];

        box {$\ket{\Phi^+}$} (q);

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-html5: HTML"

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant,physics"
      data-width="520"
      data-height="230"
    >
    \begin{tikzpicture}
    \begin{yquant}
        qubit {$\ket{0}$} q[2];

        h q[0];
        cnot q[1] | q[0];

        box {$\ket{\Phi^+}$} (q);

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>
    ```

Without the `physics` package, use standard LaTeX notation:

```latex
\lvert\Phi^+\rangle
```

instead of:

```latex
\ket{\Phi^+}
```

---

## Global loading

Load `yquant` globally only when it is required by most diagrams on the site:

```js
window.TikzJaxOptions = {
    tex: {
        texPackages: {
            yquant: ""
        }
    }
};
```

After global loading, diagrams do not need:

```html
data-tex-packages="yquant"
```

!!! warning "Performance"

    Global loading inserts:

    ```latex
    \usepackage{yquant}
    ```

    into every TikZJax document.

    This means that ordinary TikZ diagrams also process `yquant`, even when they contain no quantum circuit.

    Prefer local loading unless quantum circuits are used throughout the site.

---

## MkDocs fenced blocks

A fenced `tikzjax` block cannot contain HTML `data-*` attributes.

Therefore, fenced blocks using `yquant` work only when the package is loaded globally.

=== "Rendering"

    <script type="text/tikz">
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[2];

        h q[0];
        cnot q[1] | q[0];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    </script>

=== ":fa-markdown: Markdown"

    ````markdown
    ```tikzjax
    \begin{tikzpicture}
    \begin{yquant}
        qubit q[2];

        h q[0];
        cnot q[1] | q[0];

        measure q;
    \end{yquant}
    \end{tikzpicture}
    ```
    ````

!!! important

    For portable local loading, prefer:

    ```html
    <script
      type="text/tikz"
      data-tex-packages="yquant"
    >
    ...
    </script>
    ```

---

## MkDocs Content Tabs

=== "Rendering"

    === "Question"

        Draw a two-qubit circuit containing a Hadamard gate and a controlled-NOT gate.

    === "Solution"

        <script
          type="text/tikz"
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

=== ":fa-markdown: Markdown"

    ````markdown
    === "Question"

        Draw a two-qubit circuit containing a Hadamard gate and a controlled-NOT gate.

    === "Solution"

        <script
          type="text/tikz"
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
    ````

TikZJax automatically rescans MkDocs Material content tabs when they become visible.

---

## MkDocs admonitions

=== "Rendering"

    !!! example "Bell circuit"

        <script
          type="text/tikz"
          data-tex-packages="yquant"
        >
        \begin{tikzpicture}
        \begin{yquant}
            qubit {$\lvert 0\rangle$} q[2];

            h q[0];
            cnot q[1] | q[0];

            measure q;
        \end{yquant}
        \end{tikzpicture}
        </script>

=== ":fa-markdown: Markdown"

    ````markdown
    !!! example "Bell circuit"

        <script
          type="text/tikz"
          data-tex-packages="yquant"
        >
        \begin{tikzpicture}
        \begin{yquant}
            qubit {$\lvert 0\rangle$} q[2];

            h q[0];
            cnot q[1] | q[0];

            measure q;
        \end{yquant}
        \end{tikzpicture}
        </script>
    ````

---

## Loader dimensions

Quantum circuits may be wider than the default loading placeholder.

Reserve more space with:

```html
data-width="600"
data-height="280"
```

Example:

```html
<script
  type="text/tikz"
  data-tex-packages="yquant"
  data-width="600"
  data-height="280"
>
\begin{tikzpicture}
\begin{yquant}
    qubit q[3];

    h q;
    box {$U$} (q);
    measure q;
\end{yquant}
\end{tikzpicture}
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
  data-tex-packages="yquant"
  data-render-timeout="30000"
  data-disable-cache="true"
  data-show-console="true"
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
```

Use:

```html
data-disable-cache="true"
```

while changing the circuit.

Use:

```html
data-show-console="true"
```

when diagnosing a TeX, package, or runtime error.

---

## Parallel rendering

TikZJax places all uncached diagrams in a global rendering queue.

Several quantum circuits can be compiled concurrently:

```text
worker 1 -> circuit A
worker 2 -> circuit B
worker 3 -> another TikZ diagram
```

Each worker renders one diagram at a time.

When a worker finishes, it takes another diagram from the queue.

Each worker also maintains its own in-memory cache of downloaded and decompressed TeX files.

The first `yquant` circuit handled by a worker may therefore take longer than later `yquant` circuits assigned to the same worker.

!!! tip

    Local package loading remains fully compatible with parallel rendering.

    The `yquant` package declaration travels with the individual diagram when it is assigned to a worker.

---

## Identical circuits

When several identical circuits are discovered while the same rendering is still pending, TikZJax can group them into one render operation.

The generated SVG is then reused for all matching targets.

The source and the complete diagram dataset must be identical, including:

* package declarations;
* TikZ libraries;
* local preamble;
* rendering options.

---

## Common commands

| Command                      | Purpose                               |
| ---------------------------- | ------------------------------------- |
| `qubit q;`                   | Declare one qubit                     |
| `qubit q[3];`                | Declare a three-qubit register        |
| `cbit c;`                    | Declare one classical bit             |
| `h q;`                       | Hadamard gate                         |
| `x q;`                       | Pauli X gate                          |
| `y q;`                       | Pauli Y gate                          |
| `z q;`                       | Pauli Z gate                          |
| `cnot target \| control;`    | Controlled-NOT gate                   |
| `box {$U$} q;`               | Custom gate                           |
| `box {$U$} (q);`             | Multi-qubit custom gate               |
| `swap (q[0,1]);`             | Swap two qubits                       |
| `measure q;`                 | Measure a register                    |
| `discard q;`                 | Terminate a register wire             |
| `init {$\lvert0\rangle$} q;` | Initialize or reinitialize a register |

---

## Debugging

### Enable TeX logs

```html
<script
  type="text/tikz"
  data-tex-packages="yquant"
  data-disable-cache="true"
  data-show-console="true"
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
GET .../tex_files/yquant.sty.gz 404
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

### Undefined environment `yquant`

The package was not loaded.

Add:

```html
data-tex-packages="yquant"
```

or enable it globally.

### Missing semicolon

Every `yquant` instruction must end with:

```text
;
```

Incorrect:

```latex
h q[0]
cnot q[1] | q[0]
```

Correct:

```latex
h q[0];
cnot q[1] | q[0];
```

### The control and target are reversed

Remember:

```latex
cnot target | control;
```

For example:

```latex
cnot q[1] | q[0];
```

means that `q[0]` controls a NOT gate on `q[1]`.

### A multi-qubit gate is displayed as separate gates

Use parentheses for one gate spanning several wires:

```latex
box {$U$} (q[0-2]);
```

Without parentheses, the register addressing may represent separate operations rather than one spanning gate.

### `\ket` is undefined

The command `\ket` is not part of basic LaTeX.

Either load a package that provides it, such as:

```html
data-tex-packages="yquant,physics"
```

or use standard notation:

```latex
\lvert\psi\rangle
```

### A fenced block fails

Fenced `tikzjax` blocks cannot declare local packages.

Load `yquant` globally or replace the fenced block with an HTML `<script>` block.

### The loading placeholder is too small

Increase:

```html
data-width
data-height
```

These attributes reserve more room while the circuit is compiling.

### The first circuit is slower

The first worker rendering `yquant` must download and decompress the package and its dependencies.

Later circuits assigned to the same worker can reuse those files from memory.

### Changes are not visible

The previously rendered SVG may be stored in IndexedDB.

Use:

```html
data-disable-cache="true"
```

while debugging, or clear the TikZJax database manually.

---

## Official documentation

* [`yquant` package page on CTAN](https://ctan.org/pkg/yquant)
* [`yquant` source repository](https://github.com/projekter/yquant)
* [`yquant` manual](https://mirrors.ctan.org/graphics/pgf/contrib/yquant/doc/yquant-doc.pdf)

---

## Related documentation

* [Examples overview](index.md)
* [TikZ examples](tikz.md)
* [`physics` examples](physics.md)
* [`circuitikz` examples](circuitikz.md)
* [`chemfig` examples](chemfig.md)
* [Installation](../installation/index.md)
* [Configuration](../configuration.md)
* [API Reference](../api-reference.md)
