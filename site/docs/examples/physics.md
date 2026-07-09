# Physics Library

UN:

$$
m\dv[2]{x}{t}+kx=0 \\
\vb{F}=-k\vb{x}
$$

<script type="text/tikz" data-tex-packages="physics" data-show-console="true">
\begin{tikzpicture}
\node[draw] at (0,0) {hello};
\end{tikzpicture}
</script>

DEUX:

<script type="text/tikz" data-tex-packages="physics">
\begin{tikzpicture}[>=Stealth, thick]

\draw[->] (-0.5,0) -- (5,0) node[right] {$x$};

\node[draw, fill=blue!8, rounded corners, minimum width=1cm, minimum height=0.8cm] (m) at (3,0) {$m$};

\draw[->, red!70!black, very thick] (m.west) -- ++(-1.2,0)
  node[midway, above] {$\vb{F}=-k\vb{x}$};

\node[draw, rounded corners, fill=yellow!10, below=1cm of m, align=center] {
$\displaystyle m\dv[2]{x}{t}+kx=0$\\
$\displaystyle x(t)=A\cos\qty(\omega t+\varphi)$
};

\end{tikzpicture}
</script>