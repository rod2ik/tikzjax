# TikZJax

[rod2ik/tikzjax](https://github.com/rod2ik/tikzjax), is a GPLv3 opensource project, that renders **TikZ/LaTeX** and **tkz-tab/LaTeX** codes natively (**maths variation tables** and **maths sign tables**) , directly inside an HTML page.

See an **mkdocs demo site** at [https:/rod2ik.github.io/tikzjax](https:/rod2ik.github.io/tikzjax)

[rod2ik/tikzjax](https://github.com/rod2ik/tikzjax) is originally a fork from the great works of :

* [kisone/tkizjax](https://github.com/kisonecat/tikzjax) by [Jim Fowler](https://github.com/kisonecat), and
* [drgrice1/tikzjax](https://github.com/drgrice1/tikzjax) by [Glenn Rice](https://github.com/drgrice1) 

However, [rod2ik/tikzjax](https://github.com/rod2ik/tikzjax) has, since then, been massively refactored and extended, adding a more convenient integration with for custom websites dark themes, and for documentation websites, notably a native integration with **MkDocs** with **Material light/dark themes**, with:

- automatic rendering of `<script type="text/tikz">` **HTML blocks**;
- automatic rendering of **Markdown code blocks** using keywords `tikzjax`, `tikz`, `language-tikzjax`, or `language-tikz
- automatic rendering of `tkz-tab` macros, for **maths variation tables** and **maths sign tables**
- a **global configuration file** through `window.TikzJaxOptions`;
- **per-table local overrides** through `data-*` attributes;
- native and customizable **light/dark theme** support, including **Material for MkDocs**;
- **browser-side cache** through IndexedDB;
- **Spinner animation** for tikz and tkz-tab figures and tables.
- timeout, worker restart, retry handling, and 
- A customizable **fallback error image**

Native compatibility with MkDocs includes:

- compatibility with **Material Admonitions**
- compatibility with **Material Content Tabs** 

## Direct HTML examples

### 1. TikZ

<script type="text/tikz">
\begin{tikzpicture}
    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
    \draw[thick] (0,0) -- (3,2);
    \node at (2,1.5) {$f(x)=\dfrac{3x-1}{2\sqrt{x}}$};
\end{tikzpicture}
</script>
    
<script type="text/tikz">
    \begin{tikzpicture}
    \draw[-{Stealth}, thick] (0,0) -- (4,0) node[right] {$x$};
    \draw[-{Stealth}, thick] (0,0) -- (0,3) node[above] {$y$};
    \draw[thick] (0,0) -- (3,2);
    \node at (2,1.5) {$f(x)=\dfrac{3x-1}{2\sqrt{x}}$};
\end{tikzpicture}
</script>

=== "Example 1"
    ```html
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    </script>
    ```

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (2,1.5) {$f(x)=\dfrac{3x-1}{2\sqrt{x}}$};
    \end{tikzpicture}
    </script>

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    </script>

    <script type="text/tikz">
    \begin{tikzpicture}[line width=1.2pt, font=\Large]
        \tkzTabInit[lgt=5, espcl=4, lw=1.2pt]
            {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
            {$-\infty$, $0$, $2$, $+\infty$}
        \tkzTabLine{,+,z,-,z,+,}
        \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
    \end{tikzpicture}
    </script>

=== "Example 2"
    ```html
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
    \end{tikzpicture}
    </script>
    ```

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
    \end{tikzpicture}
    </script>

!!! success
    AVANT

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
    \end{tikzpicture}
    </script>

    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
    \end{tikzpicture}
    ```

    APRES

??? success
    AVANT

    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
    \end{tikzpicture}
    ```

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
    \end{tikzpicture}
    </script>

    APRES

### 2. [tkz-tab](https://ctan.org/pkg/tkz-tab) CTAN package

```html
<script type="text/tikz">
\begin{tikzpicture}[line width=1.2pt, font=\Large]
    \tkzTabInit[lgt=5, espcl=4, lw=1.2pt]
        {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
        {$-\infty$, $0$, $2$, $+\infty$}
    \tkzTabLine{,+,z,-,z,+,}
    \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
\end{tikzpicture}
</script>
```

<script type="text/tikz">
\begin{tikzpicture}[line width=1.2pt, font=\Large]
    \tkzTabInit[lgt=5, espcl=4, lw=1.2pt]
        {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
        {$-\infty$, $0$, $2$, $+\infty$}
    \tkzTabLine{,+,z,-,z,+,}
    \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
\end{tikzpicture}
</script>

## Markdown example with MkDocs

In a MkDocs page, use a fenced code block with the `tikzjax` language.

````markdown
```tikzjax
\begin{tikzpicture}
\tkzTabInit{
$x$/1,
$f'(x)$/1,
$f(x)$/2
}{
$-\infty$, $\dfrac 32$, $+\infty$
}
\tkzTabLine{,-,z,+,}
\tkzTabVar{+/$+\infty$, -/$0$, +/$+\infty$}
\end{tikzpicture}
```
````

```tikzjax
\begin{tikzpicture}
\tkzTabInit{
$x$/1,
$f'(x)$/1,
$f(x)$/2
}{
$-\infty$, $\dfrac 32$, $+\infty$
}
\tkzTabLine{,-,z,+,}
\tkzTabVar{+/$+\infty$, -/$0$, +/$+\infty$}
\end{tikzpicture}
```

````markdown
```tikzjax
\begin{tikzpicture}
    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
    \draw[thick] (0,0) -- (3,2);
\end{tikzpicture}
```
````

## Variation table with `tkz-tab`

When `tkz-tab` is enabled in the global configuration, the `\tikzjaxTkzTab...` macros make it easy to centralize the table style.

```tikzjax
\begin{tikzpicture}[line width=\tikzjaxTkzTabLineWidth, font=\tikzjaxTkzTabFont]
    \tkzTabInit[
        lgt=\tikzjaxTkzTabLgt,
        espcl=\tikzjaxTkzTabEspcl,
        lw=\tikzjaxTkzTabLineWidth
    ]
        {
            $x$/\tikzjaxTkzTabVariableRowHeight,
            Sign of $f'(x)=2x-4$/\tikzjaxTkzTabSignRowHeight,
            Variations of $f(x)=x^2-4x+1$/\tikzjaxTkzTabVariationRowHeight
        }
        {$-\infty$, $2$, $+\infty$}
    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/ $+\infty$, -/ $-3$, +/ $+\infty$}
\end{tikzpicture}
```

## Intentionally invalid Tikz Code

The following block is intentionally incomplete. It lets you check that the configured error image is displayed properly.

```tikzjax
\begin{tikzpicture}
    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
```

## Where to go next

- [Installation](installation.md): load TikZJax on a page or in MkDocs.
- [Configuration](configuration.md): understand all global options.
- [`tikzjax.config.js`](tikzjax-config.md): a complete configuration file you can adapt.
- [Usage](usage.md): HTML tags, Markdown blocks, and `data-*` attributes.
- [Themes](themes.md): light/dark rendering and Material for MkDocs.
- [Troubleshooting](troubleshooting.md): common issues and fixes.
