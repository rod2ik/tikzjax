# Exemples

## Bibliothèques TikZ

Ce bloc utilise `arrows.meta`, `calc` et `positioning`.

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

## Tableau de variations

```tikzjax
\begin{tikzpicture}[line width=\tikzjaxTkzTabLineWidth, font=\tikzjaxTkzTabFont]
    \tkzTabInit[
        lgt=\tikzjaxTkzTabLgt,
        espcl=\tikzjaxTkzTabEspcl,
        lw=\tikzjaxTkzTabLineWidth
    ]
        {
            $x$/\tikzjaxTkzTabVariableRowHeight,
            Signe de $f'(x)=2x$/\tikzjaxTkzTabSignRowHeight,
            Variations de $f(x)=x^2$/\tikzjaxTkzTabVariationRowHeight
        }
        {$-\infty$, $0$, $+\infty$}
    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/ $+\infty$, -/ $0$, +/ $+\infty$}
\end{tikzpicture}
```

## Dans une admonition ouverte

!!! example
    Ce bloc doit être rendu dans une admonition ouverte.

    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (3,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,2) node[above] {$y$};
    \end{tikzpicture}
    ```

## Dans une admonition repliable

??? example
    Ce bloc doit être rendu dans une admonition repliable.

    ```tikzjax
    \begin{tikzpicture}
        \node[draw, rounded corners] {$TikZJax$};
    \end{tikzpicture}
    ```

## Test d’erreur

Ce bloc est volontairement cassé. Il doit afficher l’image d’erreur configurée.

```tikzjax
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
```