# Usage

TikZJax recognizes two families of sources:

1. `<script type="text/tikz">` HTML tags;
2. Markdown code blocks converted to `<pre>` elements by MkDocs or another Markdown engine.

## HTML tag

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
</script>
```

This is the historical TikZJax syntax.

## Markdown block

In MkDocs, the most convenient form is a fenced code block.

````markdown
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

The recognized classes are:

- `language-tikzjax`
- `tikzjax`
- `language-tikz`
- `tikz`

Depending on the Markdown engine, these classes can be generated automatically from the language name.

## Local overrides with `data-*`

Each block can override part of the global configuration.

### Add a package locally

```html
<script
  type="text/tikz"
  data-tex-packages='{"xcolor":"dvipsnames"}'
>
\begin{tikzpicture}
    \draw[red] (0,0) -- (2,1);
\end{tikzpicture}
</script>
```

### Add a TikZ library locally

```html
<script
  type="text/tikz"
  data-tikz-libraries="arrows.meta,calc"
>
\begin{tikzpicture}
    \draw[-{Latex[length=4mm]}] (0,0) -- (2,0);
\end{tikzpicture}
</script>
```

### Add local preamble content

```html
<script
  type="text/tikz"
  data-add-to-preamble="\newcommand{\R}{\mathbb{R}}"
>
\begin{tikzpicture}
    \node {$\R$};
\end{tikzpicture}
</script>
```

### Disable cache for one block

```html
<script type="text/tikz" data-disable-cache="true">
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
\end{tikzpicture}
</script>
```

This option is useful during development or while diagnosing a rendering issue.

## Loader width and height

The `data-width` and `data-height` attributes define the size of the loader displayed during rendering.

```html
<script type="text/tikz" data-width="120" data-height="80">
\begin{tikzpicture}
    \draw (0,0) rectangle (4,2);
\end{tikzpicture}
</script>
```

These values are expressed in TeX points (`pt`) for the loader.

## Merging global and local configuration

TikZJax merges global and local options.

- Global and local packages are merged.
- Local packages can override the options of a global package.
- TikZ libraries are concatenated without duplicates.
- Local preamble content is appended after the global preamble.

## Rendering dynamically added content

TikZJax observes the DOM with a `MutationObserver`.

This means TikZ blocks added after the initial page load are detected automatically. No manual API call is required to restart rendering.
