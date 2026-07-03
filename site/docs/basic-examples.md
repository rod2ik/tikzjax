# Basic Examples

This page shows the basic ways to write TikZJax blocks.

For installation details, see [Installation](installation/index.md).
For advanced examples, see [Advanced Examples](advanced-examples.md).
For all configuration options, see [API Reference](api-reference.md).

## 1. TikZ usage with `<script>` tags

### Direct insertion in HTML

A TikZ circle:

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
    \end{tikzpicture}     </script>
    ````

A TikZ line:

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
    ````html     
    <script type="text/tikz">
    \begin{tikzpicture}
        \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
        \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
        \draw[thick] (0,0) -- (3,2);
        \node at (1.5,1.7) {$y=\dfrac 13 x$};
    \end{tikzpicture}
    </script>
    ````

### In MkDocs admonitions

Non-collapsible:

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
    ````html
    !!! success
        <script type="text/tikz">
        \begin{tikzpicture}
            \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
            \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
            \draw[thick] (0,0) -- (3,2);
            \node at (1.5,1.7) {$y=\dfrac 13 x$};
        \end{tikzpicture}
        </script>
    ````

Collapsible:

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
    ````html
    ??? success
    <script type="text/tikz">
        \begin{tikzpicture}
            \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
            \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
            \draw[thick] (0,0) -- (3,2);
            \node at (1.5,1.7) {$y=\dfrac 13 x$};
        \end{tikzpicture}
    </script>
    ````

### In MkDocs Content Tabs

#### Root Content Tabs

=== "Rendering"
    === "Question"
        Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

    === "Solution"
        Here is the orthonormal frame and function:

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
        Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

    === "Solution"
        Here is the orthonormal frame and function:

        <script type="text/tikz">
        \begin{tikzpicture}
            \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
            \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
            \draw[thick] (0,0) -- (3,2);
            \node at (1.5,1.7) {$y=\dfrac 13 x$};
        \end{tikzpicture}
        </script>
    ````

#### Content Tabs in admonitions

Non-collapsible:

=== "Rendering"
    !!! success
        1. 

            === "Question"
                Draw a circle.

            === "Solution"
                Here is a circle:

                <script type="text/tikz">
                \begin{tikzpicture}
                    \draw (0,0) circle (1in);
                \end{tikzpicture}
                </script>

        2. 

            === "Question"
                Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

            === "Solution"
                Here is the orthonormal frame and function:

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
                Draw a circle.

            === "Solution"
                Here is a circle:

                <script type="text/tikz">
                \begin{tikzpicture}
                    \draw (0,0) circle (1in);
                \end{tikzpicture}
                </script>

        2. 

            === "Question"
                Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

            === "Solution"
                Here is the orthonormal frame and function:

                <script type="text/tikz">
                \begin{tikzpicture}
                    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                    \draw[thick] (0,0) -- (3,2);
                    \node at (1.5,1.7) {$y=\dfrac 13 x$};
                \end{tikzpicture}
                </script>
    ````

Collapsible:

=== "Rendering"
    ??? success
        1. 

            === "Question"
                Draw a circle.

            === "Solution"
                Here is a circle:

                <script type="text/tikz">
                \begin{tikzpicture}
                    \draw (0,0) circle (1in);
                \end{tikzpicture}
                </script>

        2. 

            === "Question"
                Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

            === "Solution"
                Here is the orthonormal frame and function:

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
                Draw a circle.

            === "Solution"
                Here is a circle:

                <script type="text/tikz">
                \begin{tikzpicture}
                    \draw (0,0) circle (1in);
                \end{tikzpicture}
                </script>

        2. 

            === "Question"
                Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

            === "Solution"
                Here is the orthonormal frame and function:

                <script type="text/tikz">
                \begin{tikzpicture}
                    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                    \draw[thick] (0,0) -- (3,2);
                    \node at (1.5,1.7) {$y=\dfrac 13 x$};
                \end{tikzpicture}
                </script>
    ````

## 2. TikZ usage in MkDocs Markdown

### Compatible with the `<script>` tag

Any example using the `<script type="text/tikz">` syntax can be written directly in an MkDocs Markdown page.

You can also use a fenced `tikzjax` code block, which is more Markdown-oriented and convenient inside MkDocs.

### `tikzjax` code block insertion in MkDocs Markdown

A TikZ circle:

=== "Rendering"
    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    ```

=== ":fa-markdown: Markdown"
    The classical TikZJax example:

    ````latex
    ```tikzjax
    \begin{tikzpicture}
        \draw (0,0) circle (1in);
    \end{tikzpicture}
    ```
    ````

A TikZ line:

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
    \end{tikzpicture}     ```
    ```
    ````

### In MkDocs admonitions

Non-collapsible:

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

Collapsible:

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

### In MkDocs Content Tabs

#### Root Content Tabs

=== "Rendering"
    === "Question"
        Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

    === "Solution"
        Here is the orthonormal frame and function:

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
        Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

    === "Solution"
        Here is the orthonormal frame and function:  
        
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

Non-collapsible:

=== "Rendering"
    !!! success
        1. 

            === "Question"
                Draw a circle.

            === "Solution"
                Here is a circle:

                ```tikzjax
                \begin{tikzpicture}
                    \draw (0,0) circle (1in);
                \end{tikzpicture}
                ```

        2. 

            === "Question"
                Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

            === "Solution"
                Here is the orthonormal frame and function:

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
                Draw a circle.

            === "Solution"
                Here is a circle:

                ```tikzjax
                \begin{tikzpicture}
                    \draw (0,0) circle (1in);
                \end{tikzpicture}
                ```

        2. 

            === "Question"
                Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

            === "Solution"
                Here is the orthonormal frame and function:

                ```tikzjax
                \begin{tikzpicture}
                    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                    \draw[thick] (0,0) -- (3,2);
                    \node at (1.5,1.7) {$y=\dfrac 13 x$};
                \end{tikzpicture}
                ```
    ````

Collapsible:

=== "Rendering"
    ??? success
        1. 

            === "Question"
                Draw a circle.

            === "Solution"
                Here is a circle:

                ```tikzjax
                \begin{tikzpicture}
                    \draw (0,0) circle (1in);
                \end{tikzpicture}
                ```

        2. 

            === "Question"
                Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

            === "Solution"
                Here is the orthonormal frame and function:

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
                Draw a circle.

            === "Solution"
                Here is a circle:

                ```tikzjax
                \begin{tikzpicture}
                    \draw (0,0) circle (1in);
                \end{tikzpicture}
                ```

        2. 

            === "Question"
                Draw an orthonormal frame with a function $f(x)=\dfrac 13 x$.

            === "Solution"
                Here is the orthonormal frame and function:

                ```tikzjax
                \begin{tikzpicture}
                    \draw[->, thick] (0,0) -- (4,0) node[right] {$x$};
                    \draw[->, thick] (0,0) -- (0,3) node[above] {$y$};
                    \draw[thick] (0,0) -- (3,2);
                    \node at (1.5,1.7) {$y=\dfrac 13 x$};
                \end{tikzpicture}
                ```
    ````

## 3. [`tkz-tab`](https://ctan.org/pkg/tkz-tab) usage with `<script>` tags

In a general HTML page, you can directly use a `<script>` tag to automatically render `tkz-tab` macros.

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

## 4. [`tkz-tab`](https://ctan.org/pkg/tkz-tab) usage with `tikzjax` code blocks

### `tikzjax` code block insertion in MkDocs Markdown

In an MkDocs page, with or without the Material theme, use a fenced code block with the `tikzjax` language to automatically render `tkz-tab` macros.

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
    \end{tikzpicture}     ```
    ```
    ````

### In MkDocs Content Tabs

#### Root Content Tabs

=== "Rendering"
    === "Question"
        Draw the variation table of $f(x)=x^3-3x^2+2$ on $\mathbb{R}$.

    === "Solution"
        The variation table can be found below:

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
        The variation table can be found below:
        
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

#### Content Tabs in Admonitions

Non-collapsible:

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
                The variation table can be found below:

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
                The variation table can be found below:

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

Collapsible:

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
                The variation table can be found below:

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
                The variation table can be found below:

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

## 5. Error test

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

## 6. What to try next

* Use [Advanced Examples](advanced-examples.md) for local preambles, TikZ libraries, cache options, and reusable `tkz-tab` macros.
* Use [API Reference](api-reference.md) for all global options and `data-*` attributes.
