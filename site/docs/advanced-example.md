# Reference

## 1. Tikz Usage with `<script>` tags

### Direct Insertion in HTML

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
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    </script>
    ```

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    </script>

### in MkDocs Admonitions

```html
!!! success
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    </script>
```

!!! success
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    </script>

```html
??? success
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    </script>
```

??? success
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    </script>

### in MkDocs Content Tabs

#### Root Content Tabs

````markdown
=== "Question"
    Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

=== "Solution"
    Here is the orthononal frame and function:

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    </script>
````

=== "Question"
    Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

=== "Solution"
    Here is the orthononal frame and function:

    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    </script>

#### Content Tabs in Admonitions

````markdown
!!! success
    1. 

        === "Question"
            Draw a circle

        === "Solution"
            Here is a circle

            <script type="text/tikz">
            \begin{tikzpicture}
                \draw (0,0) circle (1in);
            \end{tikzpicture}
            </script>

    2. 

        === "Question"
            Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

        === "Solution"
            Here is the orthononal frame and function:

            <script type="text/tikz">
            \begin{tikzpicture}
                \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                \draw[thick] (0,0) -- (3,2);
                \node at (1.5,1.7) {$y=\dfrac 13 x$};
            \end{tikzpicture}
            </script>
````

!!! success
    1. 

        === "Question"
            Draw a circle

        === "Solution"
            Here is a circle

            <script type="text/tikz">
            \begin{tikzpicture}
                \draw (0,0) circle (1in);
            \end{tikzpicture}
            </script>

    2. 

        === "Question"
            Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

        === "Solution"
            Here is the orthononal frame and function:

            <script type="text/tikz">
            \begin{tikzpicture}
                \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                \draw[thick] (0,0) -- (3,2);
                \node at (1.5,1.7) {$y=\dfrac 13 x$};
            \end{tikzpicture}
            </script>

````markdown
??? success
    1. 

        === "Question"
            Draw a circle

        === "Solution"
            Here is a circle

            <script type="text/tikz">
            \begin{tikzpicture}
                \draw (0,0) circle (1in);
            \end{tikzpicture}
            </script>

    2. 

        === "Question"
            Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

        === "Solution"
            Here is the orthogonal frame and function:

            <script type="text/tikz">
            \begin{tikzpicture}
                \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                \draw[thick] (0,0) -- (3,2);
                \node at (1.5,1.7) {$y=\dfrac 13 x$};
            \end{tikzpicture}
            </script>
````

??? success
    1. 

        === "Question"
            Draw a circle

        === "Solution"
            Here is a circle

            <script type="text/tikz">
            \begin{tikzpicture}
                \draw (0,0) circle (1in);
            \end{tikzpicture}
            </script>

    2. 

        === "Question"
            Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

        === "Solution"
            Here is the orthogonal frame and function:

            <script type="text/tikz">
            \begin{tikzpicture}
                \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                \draw[thick] (0,0) -- (3,2);
                \node at (1.5,1.7) {$y=\dfrac 13 x$};
            \end{tikzpicture}
            </script>

## 2. TikZ Usage in MkDocs Markdown

### Compatible with the `<script>` tag

Please note that ANY latter sytnax with the `<script>` tag is compatible and can be written directly in a MkDocs Markdown page.

OR you can use a `tikzjax` code block, wich is more markdown-minded (and also more stable in mkdocs, just in case).

### `tikzjax` Code Block Insertion in MkDocs Markdown

!!! col __50
    The classical tikzjax example:

    ````latex
    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    ```
    ````

    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    ```

!!! col __50 clear
    ````latex
    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    ```
    ````

    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    ```

### in MkDocs Admonitions

````latex
!!! success
    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    ```
````

!!! success
    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    ```

````latex
??? success
    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    ```
````

??? success
    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    ```

### in MkDocs Content Tabs

#### Root Content Tabs

````markdown
=== "Question"
    Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

=== "Solution"
    Here is the orthononal frame and function:

    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    ```
````

=== "Question"
    Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

=== "Solution"
    Here is the orthononal frame and function:

    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    ```

#### Content Tabs in Admonitions

````markdown
!!! success
    1. 

        === "Question"
            Draw a circle

        === "Solution"
            Here is a circle

            ```tikzjax
            \begin{tikzpicture}
                \draw (0,0) circle (1in);
            \end{tikzpicture}
            ```

    2. 

        === "Question"
            Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

        === "Solution"
            Here is the orthononal frame and function:

            ```tikzjax
            \begin{tikzpicture}
                \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                \draw[thick] (0,0) -- (3,2);
                \node at (1.5,1.7) {$y=\dfrac 13 x$};
            \end{tikzpicture}
            ```
````

!!! success
    1. 

        === "Question"
            Draw a circle

        === "Solution"
            Here is a circle

            ```tikzjax
            \begin{tikzpicture}
                \draw (0,0) circle (1in);
            \end{tikzpicture}
            ```

    2. 

        === "Question"
            Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

        === "Solution"
            Here is the orthononal frame and function:

            ```tikzjax
            \begin{tikzpicture}
                \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                \draw[thick] (0,0) -- (3,2);
                \node at (1.5,1.7) {$y=\dfrac 13 x$};
            \end{tikzpicture}
            ```

````markdown
??? success
    1. 

        === "Question"
            Draw a circle

        === "Solution"
            Here is a circle

            ```tikzjax
            \begin{tikzpicture}
                \draw (0,0) circle (1in);
            \end{tikzpicture}
            ```

    2. 

        === "Question"
            Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

        === "Solution"
            Here is the orthononal frame and function:

            ```tikzjax
            \begin{tikzpicture}
                \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                \draw[thick] (0,0) -- (3,2);
                \node at (1.5,1.7) {$y=\dfrac 13 x$};
            \end{tikzpicture}
            ```
````

??? success
    1. 

        === "Question"
            Draw a circle

        === "Solution"
            Here is a circle

            ```tikzjax
            \begin{tikzpicture}
                \draw (0,0) circle (1in);
            \end{tikzpicture}
            ```

    2. 

        === "Question"
            Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$

        === "Solution"
            Here is the orthononal frame and function:

            ```tikzjax
            \begin{tikzpicture}
                \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                \draw[thick] (0,0) -- (3,2);
                \node at (1.5,1.7) {$y=\dfrac 13 x$};
            \end{tikzpicture}
            ```

## 3. [tkz-tab](https://ctan.org/pkg/tkz-tab) Usage with `<script>` tags

In a General HTML Page, you can directly use a `<script>` tag to automatically render `tkz-tab` macros.

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

<script type="text/tikz">
\begin{tikzpicture}[line width=1.2pt, font=\Large]
    \tkzTabInit[lgt=5, espcl=3, lw=1.2pt]
        {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
        {$-\infty$, $0$, $2$, $+\infty$}
    \tkzTabLine{,+,z,-,z,+,}
    \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
\end{tikzpicture}
</script>

## 4. [tkz-tab](https://ctan.org/pkg/tkz-tab) Usage with `tikjax` Code blocks

### `tikjax` Code Block Insertion in MkDocs Markdown

In a MkDocs page, with the Material Theme (or without it..), use a fenced code block with the `tikzjax` language to automatically render `tkz-tab` macros.

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

```tikzjax
\begin{tikzpicture}[line width=1.2pt, font=\Large]
    \tkzTabInit[lgt=5, espcl=3, lw=1.2pt]
        {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
        {$-\infty$, $0$, $2$, $+\infty$}
    \tkzTabLine{,+,z,-,z,+,}
    \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
\end{tikzpicture}
```

### in MkDocs Content Tabs

#### Root Content Tabs

````markdown
=== "Question"
    Draw the variation table of $f(x)=x^3-3x^2+2$ on $\mathbb{R}$.

=== "Solution"
    The variation table can be found below :

    ```tikzjax
    \begin{tikzpicture}[line width=1.2pt, font=\Large]
        \tkzTabInit[lgt=6, espcl=3, lw=1.2pt]
            {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
            {$-\infty$, $0$, $2$, $+\infty$}
        \tkzTabLine{,+,z,-,z,+,}
        \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
    \end{tikzpicture}
    ```
````

=== "Question"
    Draw the variation table of $f(x)=x^3-3x^2+2$ on $\mathbb{R}$.

=== "Solution"
    The variation table can be found below :

    ```tikzjax
    \begin{tikzpicture}[line width=1.2pt, font=\Large]
        \tkzTabInit[lgt=6, espcl=3, lw=1.2pt]
            {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
            {$-\infty$, $0$, $2$, $+\infty$}
        \tkzTabLine{,+,z,-,z,+,}
        \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
    \end{tikzpicture}
    ```

##### Content Tabs in Admonitions

````markdown
!!! success
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
            Deduce the variation table of $f$ on $\mathbb{R}$.
        === "Solution"
            The variation table can be found below :

            ```tikzjax
            \begin{tikzpicture}[line width=1.2pt, font=\Large]
                \tkzTabInit[lgt=6, espcl=3, lw=1.2pt]
                    {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
                    {$-\infty$, $0$, $2$, $+\infty$}
                \tkzTabLine{,+,z,-,z,+,}
                \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
            \end{tikzpicture}
            ```
````

!!! success
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
            Deduce the variation table of $f$ on $\mathbb{R}$.
        === "Solution"
            The variation table can be found below :

            ```tikzjax
            \begin{tikzpicture}[line width=1.2pt, font=\Large]
                \tkzTabInit[lgt=6, espcl=3, lw=1.2pt]
                    {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
                    {$-\infty$, $0$, $2$, $+\infty$}
                \tkzTabLine{,+,z,-,z,+,}
                \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
            \end{tikzpicture}
            ```

````markdown
??? success
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
            Deduce the variation table of $f$ on $\mathbb{R}$.
        === "Solution"
            The variation table can be found below :

            ```tikzjax
            \begin{tikzpicture}[line width=1.2pt, font=\Large]
                \tkzTabInit[lgt=6, espcl=3, lw=1.2pt]
                    {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
                    {$-\infty$, $0$, $2$, $+\infty$}
                \tkzTabLine{,+,z,-,z,+,}
                \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
            \end{tikzpicture}
            ```
````

??? success
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
            Deduce the variation table of $f$ on $\mathbb{R}$.
        === "Solution"
            The variation table can be found below :

            ```tikzjax
            \begin{tikzpicture}[line width=1.2pt, font=\Large]
                \tkzTabInit[lgt=6, espcl=3, lw=1.2pt]
                    {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
                    {$-\infty$, $0$, $2$, $+\infty$}
                \tkzTabLine{,+,z,-,z,+,}
                \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
            \end{tikzpicture}
            ```

## Configurable `\tikzjaxTkzTab...` macros

When `tkz-tab` is enabled in the global configuration, the `\tikzjaxTkzTab...` macros make it easy to centralize the table style.

````latex
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
````

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


## TikZ libraries

This block uses `arrows.meta`, `calc`, and `positioning`.

```tikzjax
\begin{tikzpicture}[
    node distance=2.2cm,
    every node/.style={draw, rounded corners, inner sep=5pt}
]
    \node (A) {$A$};
    \node[right=of A] (B) {$B$};
    \node[below=of $(A)!0.5!(B)$] (C) {$C$};

    \draw[-{Latex[length=4mm]}] (A) -- (B);
    \draw[-{Latex[length=4mm]}] (A) -- (C);
    \draw[-{Latex[length=4mm]}] (B) -- (C);
\end{tikzpicture}
```

## Axes and line

```tikzjax
\begin{tikzpicture}
    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
    \draw[thick] (0,0) -- (3,2);
\end{tikzpicture}
```

## Figure with colors

```tikzjax
\begin{tikzpicture}
    \draw[thick] (0,0) rectangle (4,2);
    \draw[fill=gray!20] (0.5,0.5) circle (0.4);
    \node at (2,1) {$Area$};
\end{tikzpicture}
```

## Variation table

```tikzjax
\begin{tikzpicture}[line width=\tikzjaxTkzTabLineWidth, font=\tikzjaxTkzTabFont]
    \tkzTabInit[
        lgt=\tikzjaxTkzTabLgt,
        espcl=\tikzjaxTkzTabEspcl,
        lw=\tikzjaxTkzTabLineWidth
    ]
        {
            $x$/\tikzjaxTkzTabVariableRowHeight,
            Sign of $f'(x)=2x$/\tikzjaxTkzTabSignRowHeight,
            Variations of $f(x)=x^2$/\tikzjaxTkzTabVariationRowHeight
        }
        {$-\infty$, $0$, $+\infty$}
    \tkzTabLine{,-,z,+,}
    \tkzTabVar{+/ $+\infty$, -/ $0$, +/ $+\infty$}
\end{tikzpicture}
```

## Inside an open admonition

!!! example "TikZ inside an admonition"
    This block should be rendered inside an open admonition.

    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (3,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,2) node[above] {$y$};
    \end{tikzpicture}
    ```

## Inside a collapsible admonition

??? example "TikZ inside a collapsible admonition"
    This block should be rendered when the admonition is opened.

    ```tikzjax
    \begin{tikzpicture}
        \node[draw, rounded corners, inner sep=6pt] {$TikZJax$};
    \end{tikzpicture}
    ```

## Error test

This block is intentionally broken. It should display the configured error image.

```tikzjax
\begin{tikzpicture}
    \draw (0,0) -- (2,2);
```
