# rod2ik/TikZJax

## Introduction

[![Repo](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github&logoColor=white)](https://github.com/rod2ik/tikzjax) is a [![License: GPL v3+](https://img.shields.io/badge/License-GPLv3%2B-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) opensource project, that natively renders **TikZ/LaTeX** AND **tkz-tab/LaTeX** for **maths variation tables** and **maths sign tables** , directly inside an HTML page AND/OR inside usual documentation websites, notably **MkDocs** with **Material theme**.

Please refer to this **MkDocs Documentation & Demo Site** for more thorough documentation and more info: [https:/rod2ik.github.io/tikzjax](https:/rod2ik.github.io/tikzjax)

Example 1:

<script type="text/tikz">
\begin{tikzpicture}[line width=1.2pt, font=\Large]
    \tkzTabInit[lgt=6, espcl=3, lw=1.2pt]
        {$x$/1.5 , $f'(x)=3(x+1)(x-2)$/1.5 , $f(x)=x^3-3x^2-6x+1$/2.5}
        {$-\infty$, $-1$, $2$, $+\infty$}
    \tkzTabLine{,+,z,-,z,+,}
    \tkzTabVar{-/$-\infty$, +/$3$, -/$-15$, +/$+\infty$}
\end{tikzpicture}
</script>

Example 2:

<script type="text/tikz">
\begin{tikzpicture}[line width=1.2pt, font=\Large]
    \tkzTabInit[lgt=6, espcl=2.5, lw=1.2pt]
        {$x$/1.5 , $f'(x)=\dfrac{(x-1)(x-3)}{(x-2)^2}$/1.8 , $f(x)=x+1+\dfrac{1}{x-2}$/3}
        {$-\infty$, $1$, $2$, $3$, $+\infty$}
    \tkzTabLine{,+,z,-,d,-,z,+,}
    \tkzTabVar{-/$-\infty$, +/$1$, -D+/$-\infty$ / $+\infty$, -/$5$, +/$+\infty$}
\end{tikzpicture}
</script>

[![Repo](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github&logoColor=white)](https://github.com/rod2ik/tikzjax) is originally a fork from the great works 👏👏👏 of :

* [kisone/tikzjax](https://github.com/kisonecat/tikzjax) by [Jim Fowler](https://github.com/kisonecat)
* [drgrice1/tikzjax](https://github.com/drgrice1/tikzjax) by [Glenn Rice](https://github.com/drgrice1) 


Please note, that:

* Both latter projects are based on their own **web2js** and **dvi2html** projects.  
* [![Repo](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github&logoColor=white)](https://github.com/rod2ik/tikzjax) is based on its own custom forks [rod2ik/web2js](https://github.com/rod2ik/web2js) and [rod2ik/dvi2html](https://github.com/rod2ik/dvi2html).

Also note, that [![Repo](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github&logoColor=white)](https://github.com/rod2ik/tikzjax) has, since then, been massively :

* **refactored as an ESM project**
* **extended**, to render both <bad @dodgerblue>OLD</bad>**TikZ Figures** <bad @red>AND</bad> <bad>NEW</bad> `tkz-tab` macros, **LaTeX** style, for **math variations tables** / **math sign tables** :
    * <bad>NEW</bad> a **global configuration file** `tikzjax.config.js` through `window.TikzJaxOptions`;  
    * inside a **custom HTML Bloc**, using a `<script type="text/tikz">` tag syntax:
        * <bad @dodgerblue>OLD</bad> automatic rendering of **TikZ** Figures (THE historical functionnality of [kisone/tikzjax](https://github.com/kisonecat/tikzjax))
        * <bad>NEW</bad> ❗📢❗:warning: automatic rendering of `tkz-tab` macros, **LaTeX** style, for **maths variations tables** / **math sign tables** :warning:❗📢❗
        * <bad>NEW</bad> Light/Dark Themes via the ***global customisation file***, or direct configuration. 
        * the `<script>` syntax is also natively compatible inside an **Mkdocs Markdown** Page:
            * <bad>NEW</bad> natively $100\%$ compatible with **Material Light/Dark Themes**
            * <bad>NEW</bad> natively $100\%$ compatible with **Material Admonitions** (collapsible, or not)
            * <bad>NEW</bad> natively $100\%$ compatible with **Material Content Tabs** (inside Admonitions, or not)
    * inside **MkDocs**, with **Material** (or without it..), using a **`tikzjax` code bloc** syntax, **natively**:
        * <bad>NEW</bad> automatic rendering of **TikZ** Figures  
        (you could already this, but only via the `<script>` syntax, with kisone/tikzjax)
        * <bad>NEW</bad> ❗📢❗ automatic rendering of `tkz-tab` macros for **maths variations tables** / **math sign tables** ❗📢❗
        * <bad>NEW</bad> Compatibility with **Material Light/Dark Themes** (possibly customizable via the ***global customisation file***)
        * <bad>NEW</bad> compatibility with **Material Admonitions**: collapsable or not
        * <bad>NEW</bad> compatibility with **Material Content Tabs** 
    * **Other Documentation Sites**:
        * Possibly all functionnalities of MkDocs, if your documentation tools uses python-markdown.

All the latter syntaxes also offer:

* <bad>NEW</bad> a **global configuration file** `tikzjax.config.js` through `window.TikzJaxOptions`
* <bad @dodgerblue>OLD</bad> **per-table local overrides** through `data-*` attributes
* <bad>NEW</bad> native and customizable **Light/Dark themes** support for **Custom HTML blocs**, <bad @red>AND</bad> **Material for MkDocs**
* <bad @dodgerblue>OLD</bad> **browser-side cache** through IndexedD
* <bad @dodgerblue>OLD</bad> **Spinner animation**
* <bad @dodgerblue>OLD</bad> timeout, worker restart, retry handling
* <bad>NEW</bad> A customizable **fallback error image**

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

For more advanced exemples, please see the [Advanced Examples Page](./advanced-examples.md).

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
- [Basic Examples](basic-examples.md): for Basic Examples.
- [Advanced Examples](advanced-examples.md): for Advanced Examples.
- [Configuration Overview](configuration.md): understand all global options.
- [Themes](themes.md): light/dark rendering and Material for MkDocs.
- [Fallback Error Images](fallback-error-images.md): understand how to customize Fallback Error Images for broken codes.
- [Cache and Performance](cache-performance.md): understand cache and performance issues.
- [API Reference](api-reference.md): An exhaustive API-Reference.
- [Architecture](architecture.md): Some Information about the Architecture of the Project. For Devs.
- [Troubleshooting](troubleshooting.md): common issues and fixes.
