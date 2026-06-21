# Light/dark themes

TikZJax adapts generated SVGs to the current theme.

The goal is simple: a black TikZ drawing on a light background should remain readable on a dark background without rewriting the TikZ code.

## Principle

After rendering, TikZJax inspects the generated SVG and normalizes some attributes:

- black fills become `currentColor`;
- black strokes become `currentColor`;
- SVG text becomes `currentColor`;
- some white backgrounds become transparent;
- the wrapper receives a black or white color depending on the detected theme.

## Material for MkDocs configuration

Material for MkDocs usually uses the `data-md-color-scheme` attribute on `body`.

```js
window.TikzJaxOptions = {
    theme: {
        selector: "body",
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default"
    }
};
```

## Generic class-based configuration

```js
window.TikzJaxOptions = {
    theme: {
        darkClass: "dark",
        lightClass: "light"
    }
};
```

TikZJax then looks for an ancestor with the `dark` or `light` class.

## Attribute-based configuration

```js
window.TikzJaxOptions = {
    theme: {
        selector: "html",
        attribute: "data-theme",
        darkValue: "dark",
        lightValue: "light"
    }
};
```

## Automatic compatibility

Even without explicit configuration, TikZJax recognizes several common conventions:

- `data-theme="dark"` or `data-theme="light"`;
- `data-bs-theme="dark"` or `data-bs-theme="light"`;
- `data-color-scheme="dark"` or `data-color-scheme="light"`;
- `data-md-color-scheme="slate"` for Material for MkDocs.

## Default theme

```js
window.TikzJaxOptions = {
    theme: {
        fallbackTheme: "light"
    }
};
```

## Follow the system theme

```js
window.TikzJaxOptions = {
    theme: {
        followSystemTheme: true
    }
};
```

If no theme is detected in the DOM, TikZJax uses `prefers-color-scheme`.

## Dynamic theme changes

TikZJax observes attribute and class changes on `body`, `html`, and the elements targeted by `theme.selector`. When the theme changes, already-rendered SVGs are updated automatically.
