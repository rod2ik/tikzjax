# Examples

## TikZ libraries

This block uses `arrows.meta`, `calc`, and `positioning`.

```tikzjax
\begin{tikzpicture}[
    node distance=2.2cm,
    every node/.style={draw, rounded corners, inner sep=5pt}
]
    \node (A) {$A$};
    \node[right=of A] (B) {$B$};
    \node[below=of $(A)!0.5!(B)$] (C) {$C$};

    \draw[-{Latex[length=4mm]}] (A) -- (B);
    \draw[-{Latex[length=4mm]}] (A) -- (C);
    \draw[-{Latex[length=4mm]}] (B) -- (C);
\end{tikzpicture}
```

## Axes and line

```tikzjax
\begin{tikzpicture}
    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
    \draw[thick] (0,0) -- (3,2);
\end{tikzpicture}
```

## Figure with colors

```tikzjax
\begin{tikzpicture}
    \draw[thick] (0,0) rectangle (4,2);
    \draw[fill=gray!20] (0.5,0.5) circle (0.4);
    \node at (2,1) {$Area$};
\end{tikzpicture}
```

## Variation table

```tikzjax
\begin{tikzpicture}[line width=\tikzjaxTkzTabLineWidth, font=\tikzjaxTkzTabFont]
    \tkzTabInit[
        lgt=\tikzjaxTkzTabLgt,
        espcl=\tikzjaxTkzTabEspcl,
        lw=\tikzjaxTkzTabLineWidth
    ]
        {
            $x$/\tikzjaxTkzTabVariableRowHeight,
            Sign of $f'(x)=2x$/\tikzjaxTkzTabSignRowHeight,
            Variations of $f(x)=x^2$/\tikzjaxTkzTabVariationRowHeight
        }
        {$-\infty$, $0$, $+\infty$}
    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/ $+\infty$, -/ $0$, +/ $+\infty$}
\end{tikzpicture}
```

## Inside an open admonition

!!! example "TikZ inside an admonition"
    This block should be rendered inside an open admonition.

    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (3,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,2) node[above] {$y$};
    \end{tikzpicture}
    ```

## Inside a collapsible admonition

??? example "TikZ inside a collapsible admonition"
    This block should be rendered when the admonition is opened.

    ```tikzjax
    \begin{tikzpicture}
        \node[draw, rounded corners, inner sep=6pt] {$TikZJax$};
    \end{tikzpicture}
    ```

## Error test

This block is intentionally broken. It should display the configured error image.

```tikzjax
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
```
