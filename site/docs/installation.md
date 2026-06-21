# Installation

## CDN

Dans une page HTML classique :

```html
<link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

## Avec configuration globale

Le fichier de configuration doit être chargé avant `tikzjax.js`.

```html
<script src="tikzjax.config.js"></script>
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

## Exemple HTML minimal

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
\end{tikzpicture}
</script>
```

## Exemple Markdown avec MkDocs

Dans une page Markdown :

```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```