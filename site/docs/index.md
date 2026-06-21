# TikZJax

TikZJax permet de rendre du code TikZ/LaTeX directement dans une page HTML.

## Exemple rapide

```tikzjax
\begin{tikzpicture}
    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
    \draw[thick] (0,0) -- (3,2);
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
            Signe de $f'(x)=2x-4$/\tikzjaxTkzTabSignRowHeight,
            Variations de $f(x)=x^2-4x+1$/\tikzjaxTkzTabVariationRowHeight
        }
        {$-\infty$, $2$, $+\infty$}
    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/ $+\infty$, -/ $-3$, +/ $+\infty$}
\end{tikzpicture}
```