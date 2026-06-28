# Installation

In one word, the installation is a **CDN Installation**, both in :

* Custom HTML Pages
* MkDocs with Material Documentation Site
* Other Documentation Sites

## 1. Installation in Custom HTML Pages

### 1.1 CDN Installation on Custom HTML Pages

In a regular HTML page, load the font stylesheet first, then the TikZJax script.

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

### 1.2 Minimal Working HTML example

This HTML code:

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

### 1.3 Custom HTML Page Rendering

If you want to see how [rod2ik/TikZJax](https://github.com/rod2ik/tikzjax) is rendered, and can be configured with Light/Dark themes, on a TOTALLY CUSTOM HTML PAGE, completely independently of MkDocs, please have a look to this more complex page : [Custom HTML Page](./custom.html).

Note that in this case, Light and Dark themes are stored on `localStorage`, thus locally, on your web Browser.
The page shows how to integrate on your custom project.

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
        Choose ( **AND ONLY ONE** ) from the followings, to add a reference towards the global config file `tikzjax.config.js`:

        * YOU MAY place `tikzjax.config.js` reference inside your `main.html` file :

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

                <script src="{{ 'local/path/to/your/tikzjax.config.js' | url }}"></script>
                <link rel="stylesheet" type="text/css" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
                <script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
            {% endblock %}

            {% block footer scoped %}
            {% include "partials/footer.html" with context %}
            {% endblock %}
            ````
        * YOU MAY ALSO (LESS SAFE) place the optional config file reference to `tikzjax.config.js` (AND ONLY THIS FILE) under the `extra_javacript` entry of `mkdocs.yml` :

            ```yaml
            extra_javascript:
            - local/path/to/your/tikzjax.config.js
            ```

### 2.2 `mkdocs.yml`: superfences

!!! success "Superfences Config for `tikzjax` bloc codes"
    * TikZJax is already working with the `<script type="text/tikz">` syntax.
    * However, if you wish to also use the `tikzjax` code block syntax inside MkDocs, then you MUST add a **superfences** entry in your `mkdocs.yml`:

    ````yaml
    markdown_extensions:
      - pymdownx.superfences:   # REQUIRED for ```tikzjax ... ``` code block syntaxes
          custom_fences:
            - name: tikzjax
              class: language-tikzjax
              format: !!python/name:pymdownx.superfences.fence_code_format
    ````

Hereafter are some config examples for `mkdocs.yml`, which all use an existing `overrides/main.html` file (if you have already none, otherwise, create it, you may customize your personal `custom_dir` in your `mkdocs.yml` as you wish):

!!! warning
    * Please note that, stricto sensu, the following extensions ARE NOT REQUIRED for the **TikZJax** project to work in MkDocs (which should work perfectly without those) :
        * loading **MathJax** as CDN, IS NOT REQUIRED (math formulas should render correctly inside math variations tables and math sign tables, without MathJaX)
        * the following `markdown_extensions` ARE NOT REQUIRED : 
            * `admonition`, 
            * `pymdownx.details`,    (for Collapsible admonitions)
            * `pymdownx.arithmatex`, (for Mathjax)
            * `pymdownx.tabbed`,     (for Content Tabs)
    * However, these are often loaded together, and some examples on this site require them all to test their compatibility with TikzJaX, so they are left as they are, as example configs.

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
=== "mkdocs.yml, Minimal"
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
      - pymdownx.superfences:   # required for ```tikzjax ... ``` code block syntaxes
          custom_fences:
            - name: tikzjax
              class: language-tikzjax
              format: !!python/name:pymdownx.superfences.fence_code_format

    extra_javascript:
    - assets/javascripts/tikzjax.config.js
    ````
=== "mkdocs.yml, WITH Material Light/Dark Themes (with palette)"
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
      - pymdownx.superfences:   # required for ```tikzjax ... ``` code block syntaxes
          custom_fences:
            - name: tikzjax
              class: language-tikzjax
              format: !!python/name:pymdownx.superfences.fence_code_format
      - pymdownx.tabbed:
          alternate_style: true

    extra_javascript:
    - assets/javascripts/mathjax.js
    - https://cdn.jsdelivr.net/npm/mathjax@4.1.0/tex-mml-chtml.js
    - assets/javascripts/tikzjax.config.js
    ````

!!! warning
    Please note that all the `palette` bloc inside `mkdocs.yml` IS NOT REQUIRED.  
    You MAY, OR NOT, use a palette. Of course, if no palette is defined,you lose Material Light/Dark Themes...

If your theme or MkDocs setup blocks scripts, also check your CSP policy and theme options.

### 2.3 Minimal Markdown `tikzjax` code block example

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

## Recommended loading order

1. `tikzjax.config.js`
2. `fonts.css`
3. `tikzjax.js`
4. the page content containing TikZ blocks

In practice, TikZJax also observes the DOM: if TikZ blocks are added after the initial page load, they are automatically detected and rendered.
