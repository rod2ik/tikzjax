# TikZJax partial global configuration tests

This page tests a partial global configuration applied after TikZJax has loaded.

It verifies that a later partial global configuration is merged with the existing global configuration.

Expected priority:

    global configuration
    < partial global configuration
    < local diagram configuration

---

## Test setup — Apply a partial global fallback image

This page dynamically applies:

    window.TikzJaxOptions = {
        brokenImageSrc: "..."
    };

Only `brokenImageSrc` is changed.

The existing global `texPackages`, `tikzLibraries`, and other options must remain available.

<div id="partial-global-config-test"></div>

<script>
window.addEventListener("load", () => {
    window.TikzJaxOptions = {
        brokenImageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='110' viewBox='0 0 220 110'%3E%3Crect width='220' height='110' rx='12' fill='%23dbeafe' stroke='%232563eb' stroke-width='5'/%3E%3Ctext x='110' y='50' text-anchor='middle' font-family='Arial,sans-serif' font-size='18' font-weight='700' fill='%231e40af'%3EGLOBAL PARTIAL%3C/text%3E%3Ctext x='110' y='74' text-anchor='middle' font-family='Arial,sans-serif' font-size='13' fill='%231e3a8a'%3EbrokenImageSrc only%3C/text%3E%3C/svg%3E"
    };

    const container = document.getElementById("partial-global-config-test");

    const addParagraph = (text) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        container.appendChild(paragraph);
    };

    const addTikz = (source, dataset = {}) => {
        const script = document.createElement("script");

        script.type = "text/tikz";

        Object.entries(dataset).forEach(([key, value]) => {
            script.dataset[key] = value;
        });

        script.textContent = source;
        container.appendChild(script);
    };

    addParagraph("Test A — Broken diagram using the partial global fallback");
    addParagraph("Expected result if it works: a blue image with the text GLOBAL PARTIAL is displayed.");
    addParagraph("If it fails: the partial global brokenImageSrc option was not applied.");

    addTikz(String.raw`
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
`, {
        disableCache: "true"
    });

    addParagraph("Test B — Local fallback overrides the partial global fallback");
    addParagraph("Expected result if it works: a green image with the text LOCAL FALLBACK is displayed.");
    addParagraph("If it fails: if the blue GLOBAL PARTIAL image is displayed, the local data-broken-image-src option was ignored.");

    addTikz(String.raw`
\begin{tikzpicture}
    \ThisCommandDoesNotExist
\end{tikzpicture}
`, {
        disableCache: "true",
        brokenImageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='110' viewBox='0 0 220 110'%3E%3Crect width='220' height='110' rx='12' fill='%23dcfce7' stroke='%2316a34a' stroke-width='5'/%3E%3Ctext x='110' y='50' text-anchor='middle' font-family='Arial,sans-serif' font-size='18' font-weight='700' fill='%23166534'%3ELOCAL FALLBACK%3C/text%3E%3Ctext x='110' y='74' text-anchor='middle' font-family='Arial,sans-serif' font-size='13' fill='%2314532d'%3Ediagram override%3C/text%3E%3C/svg%3E"
    });

    addParagraph("Test C — Global TeX packages still work after the partial global configuration");
    addParagraph("Expected result if it works: a formula with mathbb and aligned equations is rendered.");
    addParagraph("If it fails: the partial global configuration erased global texPackages.");

    addTikz(String.raw`
\begin{tikzpicture}
    \node at (0,0) {$\mathbb{Q} \subset \mathbb{R}$};

    \node at (0,-1.2) {$
        \begin{aligned}
            p(x) &= x^4 - 1 \\
            p'(x) &= 4x^3
        \end{aligned}
    $};
\end{tikzpicture}
`, {
        disableCache: "true"
    });

    addParagraph("Test D — Global tikzLibraries still work after the partial global configuration");
    addParagraph("Expected result if it works: both the Stealth arrow and the decorative brace are rendered.");
    addParagraph("If it fails: the partial global configuration erased global tikzLibraries, or the local tikzLibraries were not merged.");

    addTikz(String.raw`
\begin{tikzpicture}[line width=1.2pt]
    \draw[-{Stealth[length=4mm]}, thick] (0,0) -- (4,0)
        node[midway, above] {$arrows.meta$ from global config};

    \draw[decorate, decoration={brace, amplitude=6pt}]
        (0,-0.5) -- (4,-0.5)
        node[midway, below=8pt] {$decorations.pathreplacing$ from local config};
\end{tikzpicture}
`, {
        disableCache: "true",
        tikzLibraries: "decorations.pathreplacing"
    });
});
</script>