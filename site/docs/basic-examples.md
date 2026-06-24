# Basic Examples

This page shows the basic ways to write TikZJax blocks.

For installation details, see [Installation](installation.md).  
For advanced examples, see [Advanced Examples](advanced-examples.md).  
For all configuration options, see [API Reference](api-reference.md).

## 1. Tikz Usage with `<script>` tags

### Direct Insertion in HTML

A TIKZ CIRCLE:

=== "Rendering"
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    </script>
=== ":fa-html5: HTML5"
    ````html
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    </script>
    ````

A TIKZ LINE :

=== "Rendering"
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    </script>
=== ":fa-html5: HTML5"
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

### in MkDocs Admonitions

NOT COLLAPSIBLE :

=== "Rendering"
    !!! success
        <script type="text/tikz">
        \begin{tikzpicture}
            \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
            \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
            \draw[thick] (0,0) -- (3,2);
            \node at (1.5,1.7) {$y=\dfrac 13 x$};
        \end{tikzpicture}
        </script>
=== ":fa-markdown: Markdown"
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

COLLAPSIBLE :

=== "Rendering"
    ??? success
        <script type="text/tikz">
        \begin{tikzpicture}
            \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
            \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
            \draw[thick] (0,0) -- (3,2);
            \node at (1.5,1.7) {$y=\dfrac 13 x$};
        \end{tikzpicture}
        </script>
=== ":fa-markdown: Markdown"
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

### in MkDocs Content Tabs

#### Root Content Tabs

=== "Rendering"
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
=== ":fa-markdown: Markdown"
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

#### Content Tabs in Admonitions

NON COLLAPSIBLE :

=== "Rendering"
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
=== ":fa-markdown: Markdown"
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

COLLAPSIBLE :

=== "Rendering"
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
=== ":fa-markdown: Markdown"
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

## 2. TikZ Usage in MkDocs Markdown

### Compatible with the `<script>` tag

Please note that ANY latter syntax with the `<script>` tag is compatible and can be written directly in a MkDocs Markdown page.

OR you can use a `tikzjax` code block, wich is more markdown-minded (and also more stable in mkdocs, just in case).

### `tikzjax` Code Block Insertion in MkDocs Markdown

A TIKZ CIRCLE :

=== "Rendering"
    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    ```
=== ":fa-markdown: Markdown"
    The classical tikzjax example:

    ````latex
    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    ```
    ````

A TIKZ LINE :

=== "Rendering"
    ```tikzjax
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    ```
=== ":fa-markdown: Markdown"
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

### in MkDocs Admonitions

NON COLLAPSIBLE :

=== "Rendering"
    !!! success
        ```tikzjax
        \begin{tikzpicture}
            \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
            \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
            \draw[thick] (0,0) -- (3,2);
            \node at (1.5,1.7) {$y=\dfrac 13 x$};
        \end{tikzpicture}
        ```
=== ":fa-markdown: Markdown"
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

COLLAPSIBLE :

=== "Rendering"
    ??? success
        ```tikzjax
        \begin{tikzpicture}
            \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
            \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
            \draw[thick] (0,0) -- (3,2);
            \node at (1.5,1.7) {$y=\dfrac 13 x$};
        \end{tikzpicture}
        ```
=== ":fa-markdown: Markdown"
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

### in MkDocs Content Tabs

#### Root Content Tabs

=== "Rendering"
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
=== ":fa-markdown: Markdown"
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

#### Content Tabs in Admonitions

NOT COLLAPSIBLE :

=== "Rendering"
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
=== ":fa-markdown: Markdown"
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

COLLAPSIBLE :

=== "Rendering"
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
=== ":fa-markdown: Markdown"
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

## 3. [tkz-tab](https://ctan.org/pkg/tkz-tab) Usage with `<script>` tags

In a General HTML Page, you can directly use a `<script>` tag to automatically render `tkz-tab` macros.

=== "Rendering"
    <script type="text/tikz">
    \begin{tikzpicture}[line width=1.2pt, font=\Large]
        \tkzTabInit[lgt=5, espcl=3, lw=1.2pt]
            {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
            {$-\infty$, $0$, $2$, $+\infty$}
        \tkzTabLine{,+,z,-,z,+,}
        \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
    \end{tikzpicture}
    </script>
=== ":fa-markdown: Markdown"
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

## 4. [tkz-tab](https://ctan.org/pkg/tkz-tab) Usage with `tikjax` Code blocks

### `tikjax` Code Block Insertion in MkDocs Markdown

In a MkDocs page, with the Material Theme (or without it..), use a fenced code block with the `tikzjax` language to automatically render `tkz-tab` macros.

=== "Rendering"
    ```tikzjax
    \begin{tikzpicture}[line width=1.2pt, font=\Large]
        \tkzTabInit[lgt=5, espcl=3, lw=1.2pt]
            {$x$/1.5 , $f'(x)=3x(x-2)$/1.5 , $f(x)=x^3-3x^2+2$/2.5}
            {$-\infty$, $0$, $2$, $+\infty$}
        \tkzTabLine{,+,z,-,z,+,}
        \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-2$, +/ $+\infty$}
    \end{tikzpicture}
    ```
=== ":fa-markdown: Markdown"
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

### in MkDocs Content Tabs

#### Root Content Tabs

=== "Rendering"
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
=== ":fa-markdown: Markdown"
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

##### Content Tabs in Admonitions

NOT COLLAPSIBLE :

=== "Rendering"
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
=== ":fa-markdown: Markdown"
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

COLLAPSIBLE :

=== "Rendering"
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
=== ":fa-markdown: Markdown"
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

## Error test

This block is intentionally broken. It should display the configured error image.

=== "Rendering"
    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) -- (2,2);
    ```
=== ":fa-markdown: Markdown"
    ````markdown
    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) -- (2,2);
    ```
    ````

## 9. What to try next

* Use [Advanced Examples](advanced-examples.md) for local preambles, TikZ libraries, cache options, and reusable `tkz-tab` macros.
* Use [API Reference](api-reference.md) for all global options and `data-*` attributes.
