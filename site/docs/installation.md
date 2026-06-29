# Installation

In one word, the installation is a **CDN Installation**, both in :

* Custom Standalone HTML Pages
* MkDocs with Material Documentation Site
* Other Documentation Sites

## 1. Installation in Custom Standalone HTML Pages

### 1.1 CDN Installation in Custom Standalone HTML Pages

In a regular Standalone HTML Page, load the font stylesheet first, then the TikZJax script.

=== "WITHOUT the optional global config file"
    ```html
    <link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
    <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
    ```
=== "WITH the optional global config file `tikzjax.config.js`"
    ```html
    <script src="/path/to/your/local/tikzjax.config.js"></script>
    <link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
    <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
    ```

TikZJax automatically infers its base URL from the loaded script URL. The files required by the TeX WebAssembly engine are therefore looked up next to `tikzjax.js`.

!!! info
    The CDN must contain at least:

    ```text
    tikzjax.js
    run-tex.js
    tex.wasm.gz
    core.dump.gz
    fonts.css
    assets/broken-image.svg
    ```

    If you only plan to use TikJaX in your personnal pages (HTML Pages / MkDocs Pages / other Documentation Pages), you can safely ignore this information.

### 1.2 Minimal Working Standalone HTML Page Example

This Minimal Working HTML Page Example:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
    <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js" defer></script>
</head>
<body>
    <script type="text/tikz">
    \begin{tikzpicture}
      \tkzTabInit{$x$/1, $f(x)$/2}{$-\infty$, $0$, $+\infty$}
      \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-\infty$}
    \end{tikzpicture}
    </script>
</body>
</html>
```

renders as:

<script type="text/tikz">
\begin{tikzpicture}
  \tkzTabInit{$x$/1, $f(x)$/2}{$-\infty$, $0$, $+\infty$}
  \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-\infty$}
\end{tikzpicture}
</script>

### 1.3 Custom Standalone HTML Page

If you want to see how [rod2ik/TikZJax](https://github.com/rod2ik/tikzjax) is rendered, and can be configured with Light/Dark themes, on a **TOTALLY CUSTOM STANDALONE HTML PAGE**, completely independently of MkDocs, please have a look to this more complex page : [Custom Standalone HTML Page](./custom.html).

Note that in this case, Light and Dark themes are stored on `localStorage`, thus locally, on your web Browser.
The page shows how to integrate TikZJax on your custom standalone Web project.

## 2. Installation in MkDocs

### 2.1 Configure CDN Files in `main.html`

!!! warning
    * **TikzJax** CDN references (css  & javascript) **MUST** be loaded into your `main.html` file (if you have one, otherwise, create it).  
    * **TikzJax** CDN references (css  & javascript) **CANNOT** be set on usual `extra_css` and `extra_javascript` entries on `mkdocs.yml`, because if done so, the loading order may not be precisely controlled.

!!! success "file overrides/main.html"
    === "WITHOUT optional global config file"
        ````html
        {% extends "base.html" %}

        {% block htmltitle %}
        {{ super() }}
        <title>{{ base_url }}</title>
        {% endblock %}

        {% block content %}
            {{ super() }}
        {% endblock %}

        {% block libs %}
            {{ super() }}    

            <link rel="stylesheet" type="text/css" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
            <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
        {% endblock %}

        {% block footer scoped %}
        {% include "partials/footer.html" with context %}
        {% endblock %}
        ````

    === "WITH optional global config file"
        Choose one ( **AND ONLY ONE** ) from the followings, to add a reference towards the global config file `tikzjax.config.js`. 

        * YOU MAY place `tikzjax.config.js` reference inside your `main.html` file :
            ⚠️ IMPORTANT : `tikzjax.config.js` file **MUST BE LOADED BEFORE** main `tikzjax.js` file (,and CSS) ⚠️

            ````html
            {% extends "base.html" %}

            {% block htmltitle %}
            {{ super() }}
            <title>{{ base_url }}</title>
            {% endblock %}

            {% block content %}
                {{ super() }}
            {% endblock %}

            {% block libs %}
                {{ super() }}

                <!-- IMPORTANT : `tikzjax.config.js` file MUST BE LOADED BEFORE main `tikzjax.js` file (,and CSS) -->
                <script src="{{ 'local/path/to/your/tikzjax.config.js' | url }}"></script>
                <link rel="stylesheet" type="text/css" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
                <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
            {% endblock %}

            {% block footer scoped %}
            {% include "partials/footer.html" with context %}
            {% endblock %}
            ````
        * YOU MAY ALSO (LESS SAFE) place the optional config file reference to `tikzjax.config.js` (it SHOULD work) under the `extra_javacript` entry of `mkdocs.yml` :

            ```yaml
            extra_javascript:
            - local/path/to/your/tikzjax.config.js
            ```

### 2.2 `mkdocs.yml` & Superfences

!!! success "Superfences Config for `tikzjax` bloc codes"
    If you already added the 2/3 CDN config lines to your `main.html`, then :

    * TikZJax is already working with the `<script type="text/tikz">` syntax.
    * However, IF you ADDITIONNALLY and OPTIONNALLY wish to use the `tikzjax` code block syntax inside MkDocs, then you MUST add a **superfences** entry in your `mkdocs.yml`. So, technically, Adding the following config lines for superfences in `mkdocs.yml` is OPTIONAL : TO BE ADDED ONLY IF YOU PLAN TO USE tikzjax code blocks inside markdown pages :

    ````yaml
    markdown_extensions:
      - pymdownx.superfences:   # REQUIRED for ```tikzjax ... ``` code block syntaxes
          custom_fences:
            - name: tikzjax
              class: language-tikzjax
              format: !!python/name:pymdownx.superfences.fence_code_format
    ````

Hereafter are some config examples for `mkdocs.yml`, which all use an existing `overrides/main.html` file. If you don't have one, create it: note that, of course, you may customize your personal `custom_dir` entry in your `mkdocs.yml` as you wish (it does not HAVE to be named `overrides`):

!!! danger "Minimal `mkdocs.yml`"
    Please note that, stricto sensu, the following functionnalities are **TOTALLY OPTIONNAL** for TikZJax :

    * <bad>MathJax</bad> :  
    MathJaX **IS NOT REQUIRED** for **TikzJax** in MkDocs (nor in a standalone custom HTML page).  
    Therefore, adding **MathJax** configs in `mkdocs.yml` **IS TOTALLY OPTIONAL** for [![Repo](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github&logoColor=white)](https://github.com/rod2ik/tikzjax)
    * <bad>Other `markdown_extensions`</bad> :  
    The following `markdown_extensions` **ARE NOT REQUIRED** for [![Repo](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github&logoColor=white)](https://github.com/rod2ik/tikzjax) :
        * `admonition`, 
        * `pymdownx.details`,    (for Collapsible admonitions)
        * `pymdownx.arithmatex`, (for Mathjax)
        * `pymdownx.tabbed`,     (for Content Tabs)
        
        However, these are often loaded together, and some examples on this site require them all to test their compatibility with TikzJaX, so an example of a more advanced `mkdocs.yml` has been left/added therefater.
    * <bad>Material Light/Dark Themes, with Palette</bad> :  
    The whole `palette` entry inside `mkdocs.yml` **IS NOT REQUIRED**.  
    You MAY, OR NOT, use a palette for Light/Dark Material Themes.  
    Of course, if no palette is defined,you lose Material Light/Dark Themes...hence you lose TikZJax Light/Dark themes too.

=== "overrides/main.html"
    ````html
    {% extends "base.html" %}

    {% block htmltitle %}
    {{ super() }}
    <title>{{ base_url }}</title>
    {% endblock %}

    {% block content %}
        {{ super() }}
    {% endblock %}

    {% block libs %}
        {{ super() }}    

        <link rel="stylesheet" type="text/css" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
        <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
    {% endblock %}

    {% block footer scoped %}
    {% include "partials/footer.html" with context %}
    {% endblock %}
    ````
=== "Minimal `mkdocs.yml`"
    ````yaml
    site_name: yourSiteName
    site_url: yourSiteUrl
    theme:
      name: material
      custom_dir: overrides
      language: fr
    nav:
      - Home: index.md

    markdown_extensions:
      - pymdownx.superfences:   # REQUIRED (only) for ```tikzjax ... ``` code block syntaxes
          custom_fences:
            - name: tikzjax
              class: language-tikzjax
              format: !!python/name:pymdownx.superfences.fence_code_format

    extra_javascript:
    - local/path/to/your/tikzjax.config.js
    ````
=== "Advanced `mkdocs.yml` WITH Material Light/Dark Themes (`palette`)"
    ````yaml
    site_name: yourSiteName
    site_description: yourDescription
    site_url: yourSiteUrl
    repo_url: yourRepoUrl

    theme:
      name: material
      custom_dir: overrides
      language: fr
      features:
        - navigation.sections
        - navigation.top
        - content.code.copy
      palette:                        # Palettes de couleurs jour/nuit
          - media: "(prefers-color-scheme: light)"
            scheme: default
            primary: blue
            accent: blue
            toggle:
                icon: material/weather-night
                name: Passer au mode nuit
          - media: "(prefers-color-scheme: dark)"
            scheme: slate
            primary: pink
            accent: pink
            toggle:
                icon: material/weather-sunny
                name: Passer au mode jour

    nav:
      - Home: index.md

    markdown_extensions:
      - admonition
      - attr_list
      - md_in_html
      - pymdownx.details
      - pymdownx.arithmatex:
          generic: true
          smart_dollar: false
      - pymdownx.superfences:   # REQUIRED (only) for ```tikzjax ... ``` code block syntaxes
          custom_fences:
            - name: tikzjax
              class: language-tikzjax
              format: !!python/name:pymdownx.superfences.fence_code_format
      - pymdownx.tabbed:
          alternate_style: true

    extra_javascript:
    - local/path/to/your/mathjax.js
    - https://cdn.jsdelivr.net/npm/mathjax@4.1.0/tex-mml-chtml.js
    - local/path/to/your/tikzjax.config.js
    ````

### 2.3 TikZJax Interferences with other Librairies & Extensions

We saw that MathJax, Arithmatex, etc.. are NOT REQUIRED, but, in case they *are* activated, what are their interferences with TikZJax ?

#### 2.3.1 TikZJax Interferences with MathJax

Let's repeat that, stricto sensu, MathJax **IS NOT REQUIRED** for **TikZJax**.  
Therefore, adding **MathJax** configs in `mkdocs.yml` **IS TOTALLY OPTIONAL AND INDEPENDENT** of [![Repo](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github&logoColor=white)](https://github.com/rod2ik/tikzjax):

* **MathJax** should render maths **OUTSIDE** maths variation/sign tables.
* **TikZJax** should render maths **INSIDE** maths variation/sign tables.

However, if not treated carefully, it seems legitimate to think that some problems could arise between MathJax and TikZJax:

* So, what prevents both TikZJax syntaxes from interfering with MathJax ?
* Sometimes MathJax can be launched again in modern sites,
* need to be  some agressive MathJaX configurations

Here are some precisions & answers:

<clear>

1. 

    **MathJax and TikZJax config files are totally independent** of one another and **do not conflict** with each other, because their config parameters are placed in different JavaScript objects: `window.MathJax` vs `window.TikzJaxOptions`.

2. 

    By default, at runtime, the [MathJax documentation](https://docs.mathjax.org/en/v4.0/options/document.html) states that the list of tags in the `skipHtmlTags` entry (customizable in MathJax config file), are those *"whose contents should not be processed by MathJax"*, and are by default:  

    <center>
    `script`, `noscript`, `style`, `textarea`, `pre`, `code`, `math`, `select`, `option`, `mjx-container`.
    </center>

    So, **at runtime**, this protects both TikZJax syntaxes from colliding with MathJax:

    * <bad>Script syntax is protected</bad> At runtime, MathJax should not conflict with `<script type="text/tikz">...</script>` tags, because `script` is skipped by default.

    * <bad>TikZJax code block syntax is protected</bad> At runtime, MkDocs / Markdown first parses this syntax to HTML, usually something like:

        ```html
        <pre><code class="language-tikzjax">
        \begin{tikzpicture}
        ...
        \end{tikzpicture}
        </code></pre>
        ```

        These blocks should then also be ignored by MathJax, because `pre` and `code` are skipped by default. Finally, TikZJax parses the HTML source and replaces it with an SVG.

3. 

    Additionally, both TikZJax syntaxes (script syntax and `tikzjax` code block syntax) are protected after TikZJax rendering, with MathJax's `mathjax_ignore` class, which is the recommended way for MathJax to *"mark elements whose contents should not be processed by MathJax again"*. This is useful because MathJax may sometimes be launched again in modern sites, or because of aggressive MathJax configs. This prevents the TikZJax wrapper from being read or parsed again by MathJax, and thus protects the DOM.

</clear>

#### 2.3.2 Interference with Arithmatex

In the project, some functions exist specifically to prevent **TikZJax** from interfering with **Arithmatex**, notably `cleanMkDocsMaterialTextArtifacts`.

This function notably cleans up **Arithmatex** wrappers, removes some `<span>` elements, converts `\(...\)` back into `$...$`, converts `\[...\]` back into `$$...$$`, and decodes HTML entities several times. This cleanup is applied specifically to `SCRIPT` sources inside `getTikzSourceText()`.

#### 2.3.3 Interference with Admonitions

Admonitions do not usually create a direct source-text conflict with TikZJax. They are mainly containers around content. TikZJax can still find `script[type="text/tikz"]` sources and TikZ `<pre>` code blocks inside admonitions, because it scans nested DOM content.

#### 2.3.4 Interference with Collapsible Admonitions (`pymdownx.details`)

To prevent the risk that TikZJax misses content that is initially hidden or inside a collapsible container, the **TikZJax** code has a `MutationObserver` that watches added nodes, finds `script[type="text/tikz"]`, finds TikZ `<pre>` blocks, and then schedules processing.

It also does a delayed second scan after 300 ms to give MkDocs / Material time to finish inserting content.

#### 2.3.5 Interference with Content Tabs (`pymdownx.tabbed`)

Tab content might be inserted, moved, revealed, or activated after the first TikZJax scan. Therefore, it needs to be rescanned.

This is why TikZJax has specific functions to deal with content tabs: `isMkDocsTabbedElement`, `scheduleMkDocsTabsRescan`, and `handleMkDocsTabsInteraction`.

TikZJax detects tab-related containers and listens to tab interactions with:

```javascript
document.addEventListener('change', handleMkDocsTabsInteraction, true);
document.addEventListener('click', handleMkDocsTabsInteraction, true);
```

When a tab interaction is detected, `scheduleMkDocsTabsRescan()` runs again and calls `processTikzSources(getTikzSources(document))`.

If your theme or MkDocs setup blocks scripts, also check your CSP policy and theme options.

### 2.4 Minimal Markdown `tikzjax` code block example

````latex
```tikzjax
\begin{tikzpicture}
  \tkzTabInit{$x$/1, $f(x)$/2}{$-\infty$, $0$, $+\infty$}
  \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-\infty$}
\end{tikzpicture}
```
````

renders as:

```tikzjax
\begin{tikzpicture}
  \tkzTabInit{$x$/1, $f(x)$/2}{$-\infty$, $0$, $+\infty$}
  \tkzTabVar{-/ $-\infty$, +/ $2$, -/ $-\infty$}
\end{tikzpicture}
```

## 3. Recommended loading order

1. `tikzjax.config.js`
2. `fonts.css`
3. `tikzjax.js`
4. the page content containing TikZ blocks

In practice, TikZJax also observes the DOM: if TikZ blocks are added after the initial page load, they are automatically detected and rendered.



