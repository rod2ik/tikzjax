# rod2ik/TikZJax

## Introduction

[rod2ik/tikzjax](https://github.com/rod2ik/tikzjax), is a [GPLv3](https://opensource.org/license/gpl-3.0) opensource project, that natively renders **TikZ/LaTeX** AND **tkz-tab/LaTeX** for **maths variation tables** and **maths sign tables** , directly inside an HTML page AND/OR inside usual documentation websites, notably **MkDocs** with **Material theme**.

Please refer to this **MkDocs demo site, with documentation** for more info: [https:/rod2ik.github.io/tikzjax](https:/rod2ik.github.io/tikzjax)

[rod2ik/tikzjax](https://github.com/rod2ik/tikzjax) is originally a fork from the great works 👏👏👏 of :

* [kisone/tikzjax](https://github.com/kisonecat/tikzjax) by [Jim Fowler](https://github.com/kisonecat)
* [drgrice1/tikzjax](https://github.com/drgrice1/tikzjax) by [Glenn Rice](https://github.com/drgrice1) 

Please note that [rod2ik/tikzjax](https://github.com/rod2ik/tikzjax) has since then, been **massively refactored as an ESM project**, and more notably, **extended and integrated** with **maths variation tables** and **maths sign tables** from the [CTAN `tkz-tab` package](https://ctan.org/pkg/tkz-tab).  

Moreover, [rod2ik/tikzjax](https://github.com/rod2ik/tikzjax) adds a more convenient integration for custom websites with dark themes, and for documentation websites, notably a native integration with **MkDocs** and **Material Light/Dark themes**, with these additional characteristics:

- ❗📢❗ automatic SVG rendering of `tkz-tab` macros for **maths variation tables** and **maths sign tables** ❗📢❗
- automatic SVG rendering of `<script type="text/tikz">` **HTML blocks**;
- automatic SVG rendering of **Markdown Code blocks** using keywords: `tikzjax`, `tikz`, `language-tikzjax`, or `language-tikz`.  
    Also note that native compatibility with MkDocs Material theme notably includes:

    - compatibility with **Material Admonitions**
    - compatibility with **Material Content Tabs** 

- a **global configuration file** `tikzjax.config.js` through `window.TikzJaxOptions`;
- **per-table local overrides** through `data-*` attributes;
- native and customizable **Light/Dark themes** support, including **Material for MkDocs**;
- **browser-side cache** through IndexedDB;
- **Spinner animation** for both tikz and tkz-tab figures and tables.
- timeout, worker restart, retry handling, and 
- A customizable **fallback error image**

## Tikz Figures Basic Examples

!!! info
    There are two syntaxes for drawing **TikZ Figures** and/or tkz-tab **math variations tables** / **math sign tables**.

    * In HTML Pages, you can use **`<script>` tag**s syntax for both **TikZ Figures** and/or **maths variations tables / maths sign tables**
    * In MkDocs Markdown Pages, you can use `tikzjax` **code blocks** syntax for both **TikZ Figures** and/or **maths variations tables / maths sign tables**

### 1. TikZ Figures Example with `<script>` tag

In HTML Pages, to draw TikZ Figures, you can basically use this syntax, which was the original TikZ syntax developed by [kisone/tikzjax](https://github.com/kisonecat/tikzjax).

This code :

```html
<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1in);
\end{tikzpicture}
</script>
```

renders as

<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1in);
\end{tikzpicture}
</script>

### 2. TikZ Figures Example with `tikzjax` code block

In MkDocs Markdown Pages, to draw TikZ Figures, you can also use the syntax with `tikzjax` code blocks:

This code :

````html
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1in);
\end{tikzpicture}
</script>
```
````

renders as:

<script type="text/tikz">
\begin{tikzpicture}
    \draw (0,0) circle (1in);
\end{tikzpicture}
</script>

### 3. `tkz-tab` Basic Example with `<script>` tag

In HTML Pages, to draw **tkz-tab** **math variation tables** / **math sign tables**, you can basically use this syntax :

This code :

```latex
<script type="text/tikz">
\begin{tikzpicture}[line width=1.2pt, font=\Large]
    \tkzTabInit[lgt=5, espcl=3, lw=1.2pt]
        {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
        {$-\infty$, $0$, $2$, $+\infty$}
    \tkzTabLine{,+,z,-,z,+,}
    \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
\end{tikzpicture}
</script>
```

renders as:

<script type="text/tikz">
\begin{tikzpicture}[line width=1.2pt, font=\Large]
    \tkzTabInit[lgt=5, espcl=3, lw=1.2pt]
        {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
        {$-\infty$, $0$, $2$, $+\infty$}
    \tkzTabLine{,+,z,-,z,+,}
    \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
\end{tikzpicture}
</script>

### 4. `tkz-tab` Basic Example with `tikzjax` code block

In MkDocs Markdown Pages, to draw **tkz-tab** **math variation tables** / **math sign tables**, you can basically use this syntax :

This code :

````latex
```tikzjax
\begin{tikzpicture}[line width=1.2pt, font=\Large]
    \tkzTabInit[lgt=5, espcl=3, lw=1.2pt]
        {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
        {$-\infty$, $0$, $2$, $+\infty$}
    \tkzTabLine{,+,z,-,z,+,}
    \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
\end{tikzpicture}
```
````

renders as:

<script type="text/tikz">
\begin{tikzpicture}[line width=1.2pt, font=\Large]
    \tkzTabInit[lgt=5, espcl=3, lw=1.2pt]
        {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
        {$-\infty$, $0$, $2$, $+\infty$}
    \tkzTabLine{,+,z,-,z,+,}
    \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
\end{tikzpicture}
</script>

### 5. More Advanced Examples

For more advanced exemples, please see the [Advanced Examples Page](./reference.md).

## Intentionally invalid Tikz Code

The following block is **intentionally wrong** (it has an **intentional syntax error**) to let you check the configured error image is displayed properly.

````latex
```tikzjax
\begin{tikzpicture}
    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
```
````

renders as:

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
