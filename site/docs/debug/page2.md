# TikZJax partial global configuration test

This page verifies that a partial global configuration can be merged after TikZJax has loaded.

Expected priority:

    global configuration
    < partial global configuration
    < local diagram configuration

---

## Step 1 — Apply a partial global fallback image

This script changes only `brokenImageSrc`.

It must not erase `texPackages`, `tikzLibraries`, or `tkzTab`.

<script>
window.TikzJaxOptions = {
    brokenImageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='110' viewBox='0 0 220 110'%3E%3Crect width='220' height='110' rx='12' fill='%23dbeafe' stroke='%232563eb' stroke-width='5'/%3E%3Ctext x='110' y='50' text-anchor='middle' font-family='Arial,sans-serif' font-size='18' font-weight='700' fill='%231e40af'%3EGLOBAL PARTIAL%3C/text%3E%3Ctext x='110' y='74' text-anchor='middle' font-family='Arial,sans-serif' font-size='13' fill='%231e3a8a'%3EbrokenImageSrc only%3C/text%3E%3C/svg%3E"
};
</script>

---

## Test A — Broken diagram uses partial global fallback

This diagram is intentionally broken and does not define a local fallback.

Expected result if it works: a blue image with the text `GLOBAL PARTIAL` is displayed.

If it fails: the partial global `brokenImageSrc` was not applied.

<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>

---

## Test B — Global TeX configuration still works

This table proves that changing only `brokenImageSrc` did not erase the global TeX configuration.

Expected result if it works: the variation table is rendered normally.

If it fails: the partial global configuration erased `texPackages` or `tkzTab`.

<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \tkzTabInit{$x$/1, $p(x)$/2}{$-\infty$, $3$, $+\infty$}
    \tkzTabVar{-/ $-\infty$, +/ $10$, -/ $-\infty$}
\end{tikzpicture}
</script>

---

## Test C — Local fallback overrides partial global fallback

This diagram is intentionally broken and defines its own local fallback image.

Expected result if it works: a green image with the text `LOCAL FALLBACK` is displayed.

If it fails: if the blue `GLOBAL PARTIAL` image is displayed instead, the local fallback did not override the partial global fallback.

<script
    type="text/tikz"
    data-disable-cache="true"
    data-broken-image-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='110' viewBox='0 0 220 110'%3E%3Crect width='220' height='110' rx='12' fill='%23dcfce7' stroke='%2316a34a' stroke-width='5'/%3E%3Ctext x='110' y='50' text-anchor='middle' font-family='Arial,sans-serif' font-size='18' font-weight='700' fill='%23166534'%3ELOCAL FALLBACK%3C/text%3E%3Ctext x='110' y='74' text-anchor='middle' font-family='Arial,sans-serif' font-size='13' fill='%2314532d'%3Ediagram override%3C/text%3E%3C/svg%3E"
>
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
</script>

---

## Test D — Global TeX configuration still works after local override

This final table proves that the local fallback override did not damage the global TeX configuration.

Expected result if it works: the variation table is rendered normally.

If it fails: the local fallback option polluted the global configuration.

<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \tkzTabInit{$x$/1, $q(x)$/2}{$-\infty$, $4$, $+\infty$}
    \tkzTabVar{-/ $-\infty$, +/ $12$, -/ $-\infty$}
\end{tikzpicture}
</script>