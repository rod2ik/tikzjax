# Architecture

This page describes how the fork works internally.

## Overview

Rendering follows this path:

```text
TikZ block in the page
        ↓
detected by tikzjax.js
        ↓
dataset and preamble preparation
        ↓
run-tex.js worker
        ↓
TeX WebAssembly engine
        ↓
DVI file
        ↓
dvi2html conversion
        ↓
SVG injected into the page
```

## Role of `index.js`

The main browser-side file detects TikZ sources, temporarily replaces each source with a loader, builds the final rendering options, manages the IndexedDB cache, starts and restarts the worker, applies light/dark theme handling to SVGs, observes the DOM to render dynamically added blocks, and displays an error image if rendering fails.

## Role of `run-tex.js`

The worker loads `tex.wasm.gz` and `core.dump.gz`, decompresses files with `pako`, injects `input.tex` into the TeX environment, adds packages, TikZ libraries, and preamble content, executes the TeX WebAssembly engine, reads the generated `input.dvi`, converts the DVI to SVG/HTML with `@rod2ik/dvi2html`, and returns the generated HTML to the main thread.

## Generated preamble

For each render, the worker builds a complete LaTeX document:

```tex
\usepackage{amsmath}
\usepackage{...}
\usetikzlibrary{...}
% global and local preamble
\begin{document}
% user TikZ code
\end{document}
```

## Worker and CDN resources

The main script computes the CDN root from the `tikzjax.js` URL. If `tikzjax.js` is loaded from `https://rod2ik.github.io/cdn/tikzjax/tikzjax.js`, then the worker and resources are loaded from the same directory.

## Sequential rendering

Detected sources are placed in a queue and rendered one after another. This avoids launching several TeX WebAssembly compilations simultaneously in the same worker.

## Cleanup

After each render, the worker cleans the virtual file system. When the page unloads, TikZJax disconnects observers, cancels scheduled theme updates, and terminates the worker.
