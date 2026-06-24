# Installation

## CDN installation

In a regular HTML page, load the font stylesheet first, then the TikZJax script.

```html
<link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

TikZJax automatically infers its base URL from the loaded script URL. The files required by the TeX WebAssembly engine are therefore looked up next to `tikzjax.js`.

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

## Optional global configuration file `tikzjax.config.js`

The optional configuration file must be loaded before `tikzjax.js`.

```html
<script src="tikzjax.config.js"></script>
<link rel="stylesheet" href="https://rod2ik.github.io/cdn/tikzjax/fonts.css">
<script src="https://rod2ik.github.io/cdn/tikzjax/tikzjax.js"></script>
```

## Minimal Working HTML example

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

## Installation in MkDocs

### Required CDN Files in `main.html`

To be placed in


In `mkdocs.yml`, add the optional configuration file and TikZJax to the extra JavaScript files.

```yaml
extra_javascript:
  - tikzjax.config.js

```

!!! important
    It is important to note that **TikzJax** css  & javascript references to CDN **MUST** be loaded into the `main.html` file, for example inside your `overrides` directory (if you have one) in a specific order.  
    They **CANNOT** be set on normal `extra_css` and `extra_javascript` entries on `mkdocs.yml`, as if so, the loading order may not be precisely controlled.

Hereafter are two config examples : 

* With Material Light / Dark themes
* Without Material Light / Dark themes

!!! info
    Please note that, stricto sensu, loading **MathJax** as CDN, as well as the following `markdown_extensions` : `admonition`, `pymdownx.arithmatex`, `pymdownx.tabbed`, are NOT needed for the **TikZJax** project to work in MkDocs.  
    However, they are often loaded together, and some examples on this site required them, so they are left as example configs.

### With Material Light and Dark themes

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
=== "mkdocs.yml"
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

### Without Material Light and Dark themes

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
=== "mkdocs.yml"
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



If your theme or MkDocs setup blocks scripts, also check your CSP policy and theme options.

## Minimal Markdown example

````markdown
```tikzjax
\begin{tikzpicture}
    \draw (0,0) circle (1);
\end{tikzpicture}
```
````

## Recommended loading order

1. `tikzjax.config.js`
2. `fonts.css`
3. `tikzjax.js`
4. the page content containing TikZ blocks

In practice, TikZJax also observes the DOM: if TikZ blocks are added after the initial page load, they are automatically detected and rendered.
