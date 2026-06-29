# rod2ik/TikZJax

## Introduction

[![Repo](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github&logoColor=white)](https://github.com/rod2ik/tikzjax) is a [![License: GPL v3+](https://img.shields.io/badge/License-GPLv3%2B-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) opensource project, that natively renders **TikZ/LaTeX** AND **tkz-tab/LaTeX** for **maths variation tables** and **maths sign tables** , directly inside a Custom Standalone HTML Page AND/OR inside usual Documentation websites, notably **MkDocs** with **Material theme**. Star this project, if you like it 🫶🫶🫶 !

| ⚠️ Documentation Link & Testing Site ⚠️ |
|---|
| Please refer to this **MkDocs Documentation & Demo Site** for more thorough documentation and more info: [https://rod2ik.github.io/tikzjax](https://rod2ik.github.io/tikzjax) |
| A MINIMAL MKDOCS TIKZJAX TESTING REPOSITORY : [https://github.com/rod2ik/minimal-mkdocs-tikzjax](https://github.com/rod2ik/minimal-mkdocs-tikzjax) <br/> Clone It. Test it locally. |

Example 1:

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/example1-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/example1-dark.png)

Example 2:

![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/example2-light.png)
![](https://raw.githubusercontent.com/rod2ik/tikzjax/main/assets/example2-dark.png)

[![Repo](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github&logoColor=white)](https://github.com/rod2ik/tikzjax) is originally a fork from the great works 👏👏👏 of :

* [kisone/tikzjax](https://github.com/kisonecat/tikzjax) by [Jim Fowler](https://github.com/kisonecat)
* [drgrice1/tikzjax](https://github.com/drgrice1/tikzjax) by [Glenn Rice](https://github.com/drgrice1) 

Please note, that:

* Both latter projects are based on their own **web2js** and **dvi2html** projects.  
* [![Repo](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github&logoColor=white)](https://github.com/rod2ik/tikzjax) is based on its own custom forks [rod2ik/web2js](https://github.com/rod2ik/web2js) and [rod2ik/dvi2html](https://github.com/rod2ik/dvi2html).

Also note, that [![Repo](https://img.shields.io/badge/GitHub-rod2ik%2Ftikzjax-181717?logo=github&logoColor=white)](https://github.com/rod2ik/tikzjax) has, since then, been massively :

* **refactored as an ESM project**
* **extended**, to render both [![](https://img.shields.io/badge/OLD-blue)](https://github.com/rod2ik/tikzjax) **TikZ Figures** [![](https://img.shields.io/badge/AND-critical)](https://github.com/rod2ik/tikzjax) [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) `tkz-tab` macros, **LaTeX** style, for **math variations tables** / **math sign tables** :
    * [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) a **global configuration file** `tikzjax.config.js` through `window.TikzJaxOptions`;  
    * inside a **Custom Standalone HTML Page**, using a `<script type="text/tikz">` tag syntax:
        * [![](https://img.shields.io/badge/OLD-blue)](https://github.com/rod2ik/tikzjax) automatic rendering of **TikZ** Figures (THE historical functionnality of [kisone/tikzjax](https://github.com/kisonecat/tikzjax))
        * [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) ❗📢❗⚠️ automatic rendering of `tkz-tab` macros, **LaTeX** style, for **maths variations tables** / **math sign tables** ⚠️❗📢❗
        * [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) Light/Dark Themes via the ***global customisation file***, or direct configuration. 
        * the `<script>` syntax is also natively compatible inside an **Mkdocs Markdown** Page:
            * [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) natively 100% compatible with **Material Light/Dark Themes**
            * [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) natively 100% compatible with **Material Admonitions** (collapsible, or not)
            * [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) natively 100$% compatible with **Material Content Tabs** (inside Admonitions, or not)
    * inside **MkDocs**, with **Material** (or without it..), using a **`tikzjax` code bloc** syntax, **natively**:
        * [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) automatic rendering of **TikZ** Figures  
        (you could already this, but only via the `<script>` syntax, with kisone/tikzjax)
        * [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) ❗📢❗⚠️ automatic rendering of `tkz-tab` macros for **maths variations tables** / **math sign tables** ⚠️❗📢❗
        * [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) Compatibility with **Material Light/Dark Themes** (possibly customizable via the ***global customisation file***)
        * [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) compatibility with **Material Admonitions**: collapsable or not
        * [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) compatibility with **Material Content Tabs** 
    * **Other Documentation Sites**:
        * Possibly all functionnalities of MkDocs, if your documentation tools uses python-markdown.

All the latter syntaxes also offer:

* [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) a **global configuration file** `tikzjax.config.js` through `window.TikzJaxOptions`
* [![](https://img.shields.io/badge/OLD-blue)](https://github.com/rod2ik/tikzjax) [![](https://img.shields.io/badge/EXTENDED%20TO%20TKZ--TAB-orange)](https://github.com/rod2ik/tikzjax) **per-table local overrides** through `data-*` attributes
* [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) native and customizable **Light/Dark themes** support for **Custom Standalone HTML blocs**, [![](https://img.shields.io/badge/AND-critical)](https://github.com/rod2ik/tikzjax) **Material for MkDocs**
* [![](https://img.shields.io/badge/OLD-blue)](https://github.com/rod2ik/tikzjax) [![](https://img.shields.io/badge/EXTENDED%20TO%20TKZ--TAB-orange)](https://github.com/rod2ik/tikzjax) **browser-side cache** through IndexedD
* [![](https://img.shields.io/badge/OLD-blue)](https://github.com/rod2ik/tikzjax) [![](https://img.shields.io/badge/EXTENDED%20TO%20TKZ--TAB-orange)](https://github.com/rod2ik/tikzjax) **Spinner animation**
* [![](https://img.shields.io/badge/OLD-blue)](https://github.com/rod2ik/tikzjax) [![](https://img.shields.io/badge/EXTENDED%20TO%20TKZ--TAB-orange)](https://github.com/rod2ik/tikzjax) timeout, worker restart, retry handling
* [![](https://img.shields.io/badge/NEW-success)](https://github.com/rod2ik/tikzjax) A customizable **fallback error image**

## License

This project is Opensource: [![License: GPL v3+](https://img.shields.io/badge/License-GPLv3%2B-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)