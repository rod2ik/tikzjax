# TikZJax local configuration tests

This page tests the merge between the global configuration and local per-diagram options.

It does not modify `window.TikzJaxOptions` inside the page.

Expected priority:

    global configuration
    < local diagram configuration

---

## Test 1 — Global TeX packages only

This diagram uses only the global configuration.

It does not use `tkz-tab`.

It checks that global TeX packages such as `amsmath` and `amsfonts` are available.

Expected result if it works: a formula with `\mathbb{R}` and an aligned equation is rendered.

If it fails: the global `texPackages` configuration is probably not loaded correctly.

<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \node at (0,0) {$\mathbb{R}$};

    \node at (0,-1.2) {$
        \begin{aligned}
            f(x) &= x^2 + 1 \\
            f'(x) &= 2x
        \end{aligned}
    $};
\end{tikzpicture}
</script>

---

## Test 2 — Local texPackages must not erase global texPackages

This diagram adds one local TeX package with `data-tex-packages`.

It still uses global TeX packages such as `amsmath` and `amsfonts`.

Expected result if it works: the formula is rendered, `\mathbb{R}` appears, and the aligned equation appears.

If it fails: the local `data-tex-packages` value probably erased the global `texPackages`.

<script type="text/tikz" data-disable-cache="true" data-tex-packages='{"xcolor": ""}'>
\begin{tikzpicture}
    \node at (0,0) {\textcolor{blue}{$\mathbb{R}$}};

    \node at (0,-1.2) {$
        \begin{aligned}
            g(x) &= x^3 - x \\
            g'(x) &= 3x^2 - 1
        \end{aligned}
    $};
\end{tikzpicture}
</script>

---

## Test 3 — Local tikzLibraries must not erase global tikzLibraries

This diagram uses:

- `arrows.meta` from the global configuration;
- `decorations.pathreplacing` from the local configuration.

Expected result if it works: both the `Stealth` arrow and the decorative brace are rendered.

If it fails: the local `data-tikz-libraries` value probably erased the global `tikzLibraries`.

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

## Test 4 — Local fallback image overrides global fallback image

This diagram is intentionally broken.

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

This diagram is rendered after the previous broken diagram.

It does not define any local fallback image.

Expected result if it works: the formula is rendered normally.

If it fails: the local fallback configuration probably polluted or damaged the global configuration.

<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \node at (0,0) {$\mathbb{N} \subset \mathbb{R}$};

    \node at (0,-1.2) {$
        \begin{aligned}
            h(x) &= x^2 - 4x + 3 \\
            h'(x) &= 2x - 4
        \end{aligned}
    $};
\end{tikzpicture}
</script>