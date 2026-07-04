# TikZJax local configuration tests

These tests verify that local per-diagram options do not erase the global configuration.

Expected priority:

    global configuration
    < local diagram configuration

---

## Test 1 — Global configuration only

This table uses only the global configuration from `tikzjax.config.js`.

Expected result if it works: the variation table is rendered.

If it fails: the global configuration is not loaded correctly, or `tkz-tab` is not available.

<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \tkzTabInit{$x$/1, $f(x)$/2}{$-\infty$, $0$, $+\infty$}
    \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-\infty$}
\end{tikzpicture}
</script>

---

## Test 2 — Local texPackages must not erase global texPackages

This diagram adds only one local TeX package with `data-tex-packages`.

Expected result if it works: the variation table is rendered.

If it fails: the local `data-tex-packages` erased the global `texPackages`, so `tkz-tab` disappeared.

<script type="text/tikz" data-disable-cache="true" data-tex-packages='{"xcolor": ""}'>
\begin{tikzpicture}
    \tkzTabInit{$x$/1, $g(x)$/2}{$-\infty$, $1$, $+\infty$}
    \tkzTabVar{-/ $-\infty$, +/ $5$, -/ $-\infty$}
\end{tikzpicture}
</script>

---

## Test 3 — Local tikzLibraries must not erase global tikzLibraries

This diagram uses `arrows.meta` from the global configuration and `decorations.pathreplacing` from the local configuration.

Expected result if it works: both the `Stealth` arrow and the decorative brace are rendered.

If it fails: the local `data-tikz-libraries` erased the global `tikzLibraries`.

<script type="text/tikz" data-disable-cache="true" data-tikz-libraries="decorations.pathreplacing">
\begin{tikzpicture}[line width=1.2pt]
    \draw[-{Stealth[length=4mm]}, thick] (0,0) -- (4,0)
        node[midway, above] {$arrows.meta$ from global config};

    \draw[decorate, decoration={brace, amplitude=6pt}]
        (0,-0.5) -- (4,-0.5)
        node[midway, below=8pt] {$decorations.pathreplacing$ from local config};
\end{tikzpicture}
</script>

---

## Test 4 — Local fallback image for one broken diagram

This diagram is intentionally broken with an unknown command.

It defines a local fallback image with `data-broken-image-src`.

Expected result if it works: an orange image with the text `LOCAL ERROR` is displayed.

If it fails: if the global fallback image is displayed instead, the local `data-broken-image-src` option was ignored.

<script
    type="text/tikz"
    data-disable-cache="true"
    data-broken-image-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='110' viewBox='0 0 220 110'%3E%3Crect width='220' height='110' rx='12' fill='%23fff7ed' stroke='%23ea580c' stroke-width='5'/%3E%3Ctext x='110' y='48' text-anchor='middle' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='%23c2410c'%3ELOCAL ERROR%3C/text%3E%3Ctext x='110' y='74' text-anchor='middle' font-family='Arial,sans-serif' font-size='13' fill='%239a3412'%3Edata-broken-image-src%3C/text%3E%3C/svg%3E"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>

---

## Test 5 — Global configuration still works after a local fallback

This table is rendered after the previous broken diagram.

Expected result if it works: the variation table is rendered normally.

If it fails: the local fallback configuration probably polluted or damaged the global configuration.

<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \tkzTabInit{$x$/1, $h(x)$/2}{$-\infty$, $2$, $+\infty$}
    \tkzTabVar{-/ $-\infty$, +/ $8$, -/ $-\infty$}
\end{tikzpicture}
</script>