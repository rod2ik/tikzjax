# rod2ik/TikZJax

## Introduction

[rod2ik/tikzjax](https://github.com/rod2ik/tikzjax), is a [GPLv3](https://opensource.org/license/gpl-3.0) opensource project, that natively renders **TikZ/LaTeX** AND **tkz-tab/LaTeX** for **maths variation tables** and **maths sign tables** , directly inside an HTML page AND/OR inside usual documentation websites, notably **MkDocs** with **Material theme**.

| ⚠️ Documentation Link ⚠️ |
|---|
| Please refer to this **MkDocs demo site, with documentation** for thorough documentation and more info: [https:/rod2ik.github.io/tikzjax](https:/rod2ik.github.io/tikzjax) |

[rod2ik/tikzjax](https://github.com/rod2ik/tikzjax) is originally a fork from the great works 👏👏👏 of :

* [kisone/tikzjax](https://github.com/kisonecat/tikzjax) by [Jim Fowler](https://github.com/kisonecat)
* [drgrice1/tikzjax](https://github.com/drgrice1/tikzjax) by [Glenn Rice](https://github.com/drgrice1) 

Both latter projects are based on their own **web2js** and **dvi2html** projects.  
Note that [rod2ik/tikzjax](https://github.com/rod2ik/tikzjax) is based on custom forks [rod2ik/web2js](https://github.com/rod2ik/web2js) and [rod2ik/dvi2html](https://github.com/rod2ik/dvi2html).

Please also note, that [rod2ik/tikzjax](https://github.com/rod2ik/tikzjax) has been, since then been massively :

* **refactored as an ESM project**
* **extended**, to render both **TikZ Figures** **AND** [NEW] `tkz-tab` macros for **math variations tables** / **math sign tables** :
    * [NEW] a **global configuration file** `tikzjax.config.js` through `window.TikzJaxOptions`;  
    * inside a **custom HTML Bloc**, using a `<script type="text/tikz">` tag syntax:
        * [OLD] automatic rendering of **TikZ** Figures (THE historical functionnality of [kisone/tikzjax](https://github.com/kisonecat/tikzjax))
        * [NEW] ❗📢❗ automatic rendering of `tkz-tab` macros for **maths variations tables** / **math sign tables** ❗📢❗
        * [NEW] Light/Dark Themes via the ***global customisation file*** 
        * the `<script>` syntax is natively compatible inside an Mkdocs Markdown Page:
            * [NEW] natively compatible with **Material Light/Dark Themes**
            * [NEW] compatibility with **Material Admonitions**: collapsable or not
            * [NEW] compatibility with **Material Content Tabs** 
    * inside **MkDocs**, with **Material** (or without it..), using a `tikzjax` code bloc syntax, **natively**:
        * [NEW] automatic rendering of **TikZ** Figures
        * [NEW] ❗📢❗ automatic rendering of `tkz-tab` macros for **maths variations tables** / **math sign tables** ❗📢❗
        * [NEW] Compatibility with **Material Light/Dark Themes** (possibly customizable via the ***global customisation file***)
        * [NEW] compatibility with **Material Admonitions**: collapsable or not
        * [NEW] compatibility with **Material Content Tabs** 
    * **Other Documentation Sites**:
        * Possibly all functionnalities of MkDocs, if your documentation tools uses python-markdown.

All the latter syntaxes also offer:

* [NEW] a **global configuration file** `tikzjax.config.js` through `window.TikzJaxOptions`;
* [NEW] **per-table local overrides** through `data-*` attributes;
* [NEW] native and customizable **Light/Dark themes** support, including **Material for MkDocs**;
* [HALF NEW] **browser-side cache** through IndexedD ( [OLD] for **TikZ Figures** and [NEW] for `tkz-tab` tables )
* [HALF NEW] **Spinner animation** ( [OLD] for **TikZ Figures** and [NEW] for `tkz-tab` tables )
* [HALF NEW] timeout, worker restart, retry handling ( [OLD] for **TikZ Figures** and [NEW] for `tkz-tab` tables )
* [NEW] A customizable **fallback error image**