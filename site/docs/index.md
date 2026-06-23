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

## Example Usage of `<script>` tags

### 1. TikZ

#### Direct Insertion in HTML

!!! col __50
    The classical tikzjax example:

    ```html
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    </script>
    ```

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    </script>

!!! col __50 clear
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
        \node at (2,1.5) {$f(x)=\dfrac{3x-1}{2\sqrt{x}}$};
    \end{tikzpicture}
    </script>

#### in MkDocs Admonitions

!!! success
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
    \end{tikzpicture}
    </script>

??? success
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
    \end{tikzpicture}
    </script>

#### in MkDocs Content Tabs

<script type="text/tikz">
\begin{tikzpicture}[line width=1.2pt, font=\Large]
    \tkzTabInit[lgt=8, espcl=4, lw=1.2pt]
        {$x$/1.5 , Signe de $f'(x)=3x(x-2)$/1.5 , Variations de $f(x)=x^3-3x^2+2$/2.5}
        {$-\infty$, $0$, $2$, $+\infty$}
    \tkzTabLine{,+,z,-,z,+,}
    \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
\end{tikzpicture}
</script>


=== "Question"
    Deduce the variation table of $f$ on $\mathbb{R}$.

=== "Solution"
    We deduce the variation table below. (see below)

    Moreover, we compute:

    $$
    f(0)=2
    $$

    and:

    $$
    f(2)=-2
    $$

    Hence the variation table below :

    <script type="text/tikz">
    \begin{tikzpicture}[line width=1.2pt, font=\Large]
        \tkzTabInit[lgt=8, espcl=4, lw=1.2pt]
            {$x$/1.5 , Signe de $f'(x)=3x(x-2)$/1.5 , Variations de $f(x)=x^3-3x^2+2$/2.5}
            {$-\infty$, $0$, $2$, $+\infty$}
        \tkzTabLine{,+,z,-,z,+,}
        \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
    \end{tikzpicture}
    </script>


!!! note
    Let $f$ be the function defined on $\mathbb{R}$ by:

    $$
    f(x)=x^3-3x^2+2
    $$

    1. 

        === "Question"
            Determine the derivative function $f'$ of $f$ on $\mathbb{R}$.

        === "Solution"
            We have:

            $$
            f(x)=x^3-3x^2+2
            $$

            We differentiate each term separately:

            $$
            \begin{align*}
            f'(x) &= (x^3)'-(3x^2)'+(2)' \\
                  &= 3x^2-3\times 2x+0 \\
                  &= 3x^2-6x
            \end{align*}
            $$

            We factor:

            $$
            f'(x)=3x(x-2)
            $$

            Finally:

            $$
            \boxed{f'(x)=3x(x-2)}
            $$

    2. 

        === "Question"
            Solve the inequality $f'(x)\geq 0$ on $\mathbb{R}$.

        === "Solution"
            We know that:

            $$
            f'(x)=3x(x-2)
            $$

            The roots of $f'$ are:

            $$
            x=0
            \qquad
            \text{and}
            \qquad
            x=2
            $$

            We study the sign of the product of factors.

            Conclusion:

            $$
            \boxed{f'(x)\geq 0 \Longleftrightarrow x\in]-\infty;0]\cup[2;+\infty[}
            $$

    3. 

        === "Question"
            Deduce the variation table of $f$ on $\mathbb{R}$.

        === "Solution"
            We deduce the variation table below. (see below)

            Moreover, we compute:

            $$
            f(0)=2
            $$

            and:

            $$
            f(2)=-2
            $$

            Hence the variation table below :

            <script type="text/tikz">
            \begin{tikzpicture}[line width=1.2pt, font=\Large]
                \tkzTabInit[lgt=8, espcl=4, lw=1.2pt]
                    {$x$/1.5 , Signe de $f'(x)=3x(x-2)$/1.5 , Variations de $f(x)=x^3-3x^2+2$/2.5}
                    {$-\infty$, $0$, $2$, $+\infty$}
                \tkzTabLine{,+,z,-,z,+,}
                \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
            \end{tikzpicture}
            </script>

!!! note
    Let $f$ be the function defined on $\mathbb{R}$ by:

    $$
    f(x)=x^3-3x^2+2
    $$

    1. 

        === "Question"
            Determine the derivative function $f'$ of $f$ on $\mathbb{R}$.

        === "Solution"
            We have:

            $$
            f(x)=x^3-3x^2+2
            $$

            We differentiate each term separately:

            $$
            \begin{align*}
            f'(x) &= (x^3)'-(3x^2)'+(2)' \\
                  &= 3x^2-3\times 2x+0 \\
                  &= 3x^2-6x
            \end{align*}
            $$

            We factor:

            $$
            f'(x)=3x(x-2)
            $$

            Finally:

            $$
            \boxed{f'(x)=3x(x-2)}
            $$

    2. 

        === "Question"
            Solve the inequality $f'(x)\geq 0$ on $\mathbb{R}$.

        === "Solution"
            We know that:

            $$
            f'(x)=3x(x-2)
            $$

            The roots of $f'$ are:

            $$
            x=0
            \qquad
            \text{and}
            \qquad
            x=2
            $$

            We study the sign of the product of factors.

            Conclusion:

            $$
            \boxed{f'(x)\geq 0 \Longleftrightarrow x\in]-\infty;0]\cup[2;+\infty[}
            $$

    3. 

        === "Question"
            Deduce the variation table of $f$ on $\mathbb{R}$.

        === "Solution"
            We deduce the variation table below. (see below)

            Moreover, we compute:

            $$
            f(0)=2
            $$

            and:

            $$
            f(2)=-2
            $$

            Hence the variation table below :

            ```tikzjax
            \begin{tikzpicture}[line width=1.2pt, font=\Large]
                \tkzTabInit[lgt=8, espcl=4, lw=1.2pt]
                    {$x$/1.5 , Signe de $f'(x)=3x(x-2)$/1.5 , Variations de $f(x)=x^3-3x^2+2$/2.5}
                    {$-\infty$, $0$, $2$, $+\infty$}
                \tkzTabLine{,+,z,-,z,+,}
                \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
            \end{tikzpicture}
            ```

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
