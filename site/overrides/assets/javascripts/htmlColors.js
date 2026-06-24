/* License: GNU GPLv3+, Rodrigo Schwencke (Copyleft) */
/* BADGES - htmlColors.js */
/* Projet indépendant de massilia.js */

/*
 * Une couleur peut être définie de deux manières :
 *
 * 1. Automatique :
 *    "deeppink": "#ff1493"
 *
 *    Le script génère automatiquement :
 *    [BgLight, BgDark, BorderLight, BorderDark, TextLight, TextDark]
 *
 * 2. Manuelle, contrôle absolu :
 *    "maCouleur": [
 *      "#ffee00", // BgLight
 *      "#442200", // BgDark
 *      "#aa9900", // BorderLight
 *      "#ffcc66", // BorderDark
 *      "#111111", // TextLight
 *      "#ffffff"  // TextDark
 *    ]
 *
 * Avec badges.js :
 *
 * SANS @ :
 *   <bad deeppink>Texte</bad>
 *   utilise une couleur statique, identique en mode Light/Dark.
 *
 * AVEC @ :
 *   <bad @deeppink>Texte</bad>
 *   utilise la palette dynamique complète deeppink.
 *
 * AVEC deux @ :
 *   <bad @deeppink @blue>Texte</bad>
 *   utilise deeppink en Light et blue en Dark.
 */

export const PALETTE_INDEX = {
  BG_LIGHT: 0,
  BG_DARK: 1,
  BORDER_LIGHT: 2,
  BORDER_DARK: 3,
  TEXT_LIGHT: 4,
  TEXT_DARK: 5
};

const DEFAULT_PALETTE_OPTIONS = {
  /*
   * Si BgLight est trop sombre pour un texte noir,
   * on l'éclaircit progressivement de cette quantité.
   */
  backgroundCorrectionAmount: 0.30,

  /*
   * BorderLight = BgLight assombri.
   * BorderDark  = BgDark éclairci.
   */
  borderCorrectionAmount: 0.40,

  /*
   * Contraste minimal recommandé.
   * 4.5 correspond au seuil WCAG AA pour du texte normal.
   */
  minContrastRatio: 4.5,

  /*
   * Nombre maximal de corrections successives.
   */
  maxCorrectionPasses: 8,

  textLight: "#000000",
  textDark: "#ffffff"
};

/*
 * Couleurs CSS standard.
 * Toutes les clés historiques sont conservées.
 */
const STANDARD_COLOR_DEFINITIONS = {
  "aliceblue": "#f0f8ff",
  "antiquewhite": "#faebd7",
  "aqua": "#00ffff",
  "aquamarine": "#7fffd4",
  "azure": "#f0ffff",
  "beige": "#f5f5dc",
  "bisque": "#ffe4c4",
  "black": "#000000",
  "blanchedalmond": "#ffebcd",
  "blue": "#0000ff",
  "blueviolet": "#8a2be2",
  "brown": "#a52a2a",
  "burlywood": "#deb887",
  "cadetblue": "#5f9ea0",
  "chartreuse": "#7fff00",
  "chocolate": "#d2691e",
  "coral": "#ff7f50",
  "cornflowerblue": "#6495ed",
  "cornsilk": "#fff8dc",
  "crimson": "#dc143c",
  "cyan": "#00ffff",
  "darkblue": "#00008b",
  "darkcyan": "#008b8b",
  "darkgoldenrod": "#b8860b",
  "darkgray": "#a9a9a9",
  "darkgreen": "#006400",
  "darkgrey": "#a9a9a9",
  "darkkhaki": "#bdb76b",
  "darkmagenta": "#8b008b",
  "darkolivegreen": "#556b2f",
  "darkorange": "#ff8c00",
  "darkorchid": "#9932cc",
  "darkred": "#8b0000",
  "darksalmon": "#e9967a",
  "darkseagreen": "#8fbc8f",
  "darkslateblue": "#483d8b",
  "darkslategray": "#2f4f4f",
  "darkslategrey": "#2f4f4f",
  "darkturquoise": "#00ced1",
  "darkviolet": "#9400d3",
  "deeppink": "#ff1493",
  "deepskyblue": "#00bfff",
  "dimgray": "#696969",
  "dimgrey": "#696969",
  "dodgerblue": "#1e90ff",
  "firebrick": "#b22222",
  "floralwhite": "#fffaf0",
  "forestgreen": "#228b22",
  "fuchsia": "#ff00ff",
  "gainsboro": "#dcdcdc",
  "ghostwhite": "#f8f8ff",
  "goldenrod": "#daa520",
  "gold": "#ffd700",
  "gray": "#808080",
  "green": "#008000",
  "greenyellow": "#adff2f",
  "grey": "#808080",
  "honeydew": "#f0fff0",
  "hotpink": "#ff69b4",
  "indianred": "#cd5c5c",
  "indigo": "#4b0082",
  "ivory": "#fffff0",
  "khaki": "#f0e68c",
  "lavenderblush": "#fff0f5",
  "lavender": "#e6e6fa",
  "lawngreen": "#7cfc00",
  "lemonchiffon": "#fffacd",
  "lightblue": "#add8e6",
  "lightcoral": "#f08080",
  "lightcyan": "#e0ffff",
  "lightgoldenrodyellow": "#fafad2",
  "lightgray": "#d3d3d3",
  "lightgreen": "#90ee90",
  "lightgrey": "#d3d3d3",
  "lightpink": "#ffb6c1",
  "lightsalmon": "#ffa07a",
  "lightseagreen": "#20b2aa",
  "lightskyblue": "#87cefa",
  "lightslategray": "#778899",
  "lightslategrey": "#778899",
  "lightsteelblue": "#b0c4de",
  "lightyellow": "#ffffe0",
  "lime": "#00ff00",
  "limegreen": "#32cd32",
  "linen": "#faf0e6",
  "magenta": "#ff00ff",
  "maroon": "#800000",
  "mediumaquamarine": "#66cdaa",
  "mediumblue": "#0000cd",
  "mediumorchid": "#ba55d3",
  "mediumpurple": "#9370db",
  "mediumseagreen": "#3cb371",
  "mediumslateblue": "#7b68ee",
  "mediumspringgreen": "#00fa9a",
  "mediumturquoise": "#48d1cc",
  "mediumvioletred": "#c71585",
  "midnightblue": "#191970",
  "mintcream": "#f5fffa",
  "mistyrose": "#ffe4e1",
  "moccasin": "#ffe4b5",
  "navajowhite": "#ffdead",
  "navy": "#000080",
  "oldlace": "#fdf5e6",
  "olive": "#808000",
  "olivedrab": "#6b8e23",
  "orange": "#ffa500",
  "orangered": "#ff4500",
  "orchid": "#da70d6",
  "palegoldenrod": "#eee8aa",
  "palegreen": "#98fb98",
  "paleturquoise": "#afeeee",
  "palevioletred": "#db7093",
  "papayawhip": "#ffefd5",
  "peachpuff": "#ffdab9",
  "peru": "#cd853f",
  "pink": "#ffc0cb",
  "plum": "#dda0dd",
  "powderblue": "#b0e0e6",
  "purple": "#800080",
  "rebeccapurple": "#663399",
  "red": "#ff0000",
  "rosybrown": "#bc8f8f",
  "royalblue": "#4169e1",
  "saddlebrown": "#8b4513",
  "salmon": "#fa8072",
  "sandybrown": "#f4a460",
  "seagreen": "#2e8b57",
  "seashell": "#fff5ee",
  "sienna": "#a0522d",
  "silver": "#c0c0c0",
  "skyblue": "#87ceeb",
  "slateblue": "#6a5acd",
  "slategray": "#708090",
  "slategrey": "#708090",
  "snow": "#fffafa",
  "springgreen": "#00ff7f",
  "steelblue": "#4682b4",
  "tan": "#d2b48c",
  "teal": "#008080",
  "thistle": "#d8bfd8",
  "tomato": "#ff6347",
  "turquoise": "#40e0d0",
  "violet": "#ee82ee",
  "wheat": "#f5deb3",
  "white": "#ffffff",
  "whitesmoke": "#f5f5f5",
  "yellow": "#ffff00",
  "yellowgreen": "#9acd32"
};

/*
 * Couleurs personnalisées historiques.
 * Les clés existantes sont conservées.
 */
const CUSTOM_COLOR_DEFINITIONS = {
  "gris": "#808080",
  "bleu": "#00e4ff",
  "vert": "#7fff00",
  "jaune": "#ffff00",
  "test": "#ff0000",

  /*
   * Alias tolérant pour la faute fréquente :
   * deepink -> deeppink
   */
  "deepink": "#ff1493",

  /*
   * Exemples de contrôle manuel absolu.
   */
  "demo2": ["#ffff00", "#00ffff", "#b0b000", "#fdfd75", "#00ffff", "#ff00ff"],
  "demo3": ["#DC143C", "#9932CC", "#9a0e2a", "#cda0e6", "#000000", "#ffffff"],
  "demo4": ["#ff000077", "#0000ff77", "#99000077", "#9999ff77", "#ffffff", "#ff0000"],
  "demo5": ["#0000ff77", "#ff000077", "#00009977", "#ff999977", "#000000", "#ffffff"],
  "demo6": ["#FFA50077", "#ff00ff77", "#99630077", "#ff99ff77", "#000000", "#ffffff"]
};

const COLOR_DEFINITIONS = {
  ...STANDARD_COLOR_DEFINITIONS,
  ...CUSTOM_COLOR_DEFINITIONS
};

export const standardColorNames = new Set(Object.keys(STANDARD_COLOR_DEFINITIONS));

/**
 * Configuration optionnelle, indépendante de massilia.js.
 *
 * Exemple possible AVANT badges.js :
 *
 * window.BADGES_CONF = {
 *   paletteOptions: {
 *     backgroundCorrectionAmount: 0.30,
 *     borderCorrectionAmount: 0.40,
 *     minContrastRatio: 4.5,
 *     textLight: "#000000",
 *     textDark: "#ffffff"
 *   },
 *
 *   badges: {
 *     default: "deeppink",
 *
 *     gradient: {
 *       from: "deeppink",
 *       to: "blue",
 *       angle: "90deg",
 *       dynamic: true,
 *       border: null,
 *       text: null
 *     }
 *   },
 *
 *   colors: {
 *     // Génération automatique :
 *     fluo: "#ccff00",
 *
 *     // Contrôle manuel absolu :
 *     perso: ["#ffee00", "#442200", "#aa9900", "#ffcc66", "#111111", "#ffffff"],
 *
 *     // Contrôle manuel absolu en chaîne :
 *     demo1: "ff0000 0000ff b0b000 fdfd75 0000ff ff0000"
 *   }
 * };
 */
function getBadgesConf() {
  if (
    typeof globalThis !== "undefined" &&
    globalThis.BADGES_CONF &&
    typeof globalThis.BADGES_CONF === "object"
  ) {
    return globalThis.BADGES_CONF;
  }

  if (typeof document === "undefined") {
    return {};
  }

  const tag = document.querySelector(
    'script[type="application/json"][data-badges-config], script[type="application/json"]#badges-config'
  );

  if (!tag) {
    return {};
  }

  try {
    return JSON.parse(tag.textContent || "{}");
  } catch (error) {
    console.warn("[badges] Configuration JSON invalide.", error);
    return {};
  }
}

function getPaletteOptions(cfg = {}) {
  const globalOptions =
    typeof globalThis !== "undefined" &&
    globalThis.BADGES_PALETTE_OPTIONS &&
    typeof globalThis.BADGES_PALETTE_OPTIONS === "object"
      ? globalThis.BADGES_PALETTE_OPTIONS
      : {};

  const configOptions =
    cfg.paletteOptions && typeof cfg.paletteOptions === "object"
      ? cfg.paletteOptions
      : cfg.palette && typeof cfg.palette === "object"
        ? cfg.palette
        : {};

  return {
    ...DEFAULT_PALETTE_OPTIONS,
    ...globalOptions,
    ...configOptions
  };
}

function clamp(value, min = 0, max = 255) {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function normalizeColorValue(value) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if (/^[0-9a-f]{3,8}$/i.test(trimmed)) {
    return `#${trimmed}`;
  }

  return trimmed;
}

function hexToRgba(hex) {
  if (typeof hex !== "string") {
    return null;
  }

  let value = hex.trim();

  if (!value.startsWith("#")) {
    if (/^[0-9a-f]{3,8}$/i.test(value)) {
      value = `#${value}`;
    } else {
      return null;
    }
  }

  value = value.slice(1);

  if (![3, 4, 6, 8].includes(value.length)) {
    return null;
  }

  if (value.length === 3 || value.length === 4) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hasAlpha = value.length === 8;

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const a = hasAlpha ? parseInt(value.slice(6, 8), 16) / 255 : 1;

  if ([r, g, b, a].some((item) => Number.isNaN(item))) {
    return null;
  }

  return { r, g, b, a };
}

function componentToHex(value) {
  return clamp(Math.round(value)).toString(16).padStart(2, "0");
}

function alphaToHex(value) {
  return clamp(Math.round(clamp01(value) * 255)).toString(16).padStart(2, "0");
}

function rgbaToHex({ r, g, b, a = 1 }) {
  const rgb = `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;

  if (a < 1) {
    return `${rgb}${alphaToHex(a)}`;
  }

  return rgb;
}

function mixColor(hex, targetHex, amount) {
  const source = hexToRgba(hex);
  const target = hexToRgba(targetHex);

  if (!source || !target) {
    return hex;
  }

  const t = clamp01(amount);

  return rgbaToHex({
    r: source.r + (target.r - source.r) * t,
    g: source.g + (target.g - source.g) * t,
    b: source.b + (target.b - source.b) * t,

    /*
     * On conserve l'alpha de la couleur source.
     * Exemple : #ff000077 reste semi-transparent après correction.
     */
    a: source.a
  });
}

function lighten(hex, amount) {
  return mixColor(hex, "#ffffff", amount);
}

function darken(hex, amount) {
  return mixColor(hex, "#000000", amount);
}

function srgbToLinear(value) {
  const channel = value / 255;

  if (channel <= 0.03928) {
    return channel / 12.92;
  }

  return ((channel + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex) {
  const color = hexToRgba(hex);

  if (!color) {
    return 0;
  }

  const r = srgbToLinear(color.r);
  const g = srgbToLinear(color.g);
  const b = srgbToLinear(color.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(colorA, colorB) {
  const lumA = relativeLuminance(colorA);
  const lumB = relativeLuminance(colorB);

  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  return (lighter + 0.05) / (darker + 0.05);
}

function ensureContrastWithText(background, textColor, direction, options) {
  let result = background;

  const minContrast = options.minContrastRatio;
  const amount = options.backgroundCorrectionAmount;
  const maxPasses = options.maxCorrectionPasses;

  for (let i = 0; i < maxPasses; i += 1) {
    if (contrastRatio(result, textColor) >= minContrast) {
      return result;
    }

    result = direction === "lighten"
      ? lighten(result, amount)
      : darken(result, amount);
  }

  return result;
}

function normalizeManualPalette(value) {
  let parts;

  if (Array.isArray(value)) {
    parts = value.slice(0, 6);
  } else if (typeof value === "string") {
    parts = value.trim().split(/\s+/).slice(0, 6);
  } else {
    return null;
  }

  if (parts.length !== 6) {
    console.warn(
      "[badges] Une palette manuelle doit contenir exactement 6 valeurs :",
      value
    );
    return null;
  }

  return parts.map(normalizeColorValue);
}

function createAutomaticPalette(baseColor, options) {
  const normalizedBase = normalizeColorValue(baseColor);

  if (!hexToRgba(normalizedBase)) {
    /*
     * Si ce n'est pas une couleur hexadécimale, on ne peut pas calculer
     * intelligemment les contrastes. On garde donc une palette simple.
     */
    return [
      normalizedBase,
      normalizedBase,
      normalizedBase,
      normalizedBase,
      options.textLight,
      options.textDark
    ];
  }

  const bgLight = ensureContrastWithText(
    normalizedBase,
    options.textLight,
    "lighten",
    options
  );

  const bgDark = ensureContrastWithText(
    normalizedBase,
    options.textDark,
    "darken",
    options
  );

  const borderLight = darken(bgLight, options.borderCorrectionAmount);
  const borderDark = lighten(bgDark, options.borderCorrectionAmount);

  return [
    bgLight,
    bgDark,
    borderLight,
    borderDark,
    options.textLight,
    options.textDark
  ];
}

function buildPaletteFromDefinition(definition, options) {
  if (Array.isArray(definition)) {
    return normalizeManualPalette(definition);
  }

  if (typeof definition === "string") {
    const parts = definition.trim().split(/\s+/);

    if (parts.length === 6) {
      return normalizeManualPalette(definition);
    }

    return createAutomaticPalette(definition, options);
  }

  return null;
}

function cloneColors(colors) {
  return Object.fromEntries(
    Object.entries(colors).map(([name, values]) => [name, values.slice()])
  );
}

function buildHtmlColors(definitions, options) {
  const builtColors = {};

  Object.entries(definitions).forEach(([colorName, definition]) => {
    const normalizedName = colorName.toLowerCase();
    const palette = buildPaletteFromDefinition(definition, options);

    if (palette) {
      builtColors[normalizedName] = palette;
    }
  });

  return builtColors;
}

function setCustomDynamicColorsIn(baseColors, cfg = {}, options) {
  const newColors = cloneColors(baseColors);

  if (!cfg.colors || typeof cfg.colors !== "object") {
    return newColors;
  }

  Object.entries(cfg.colors).forEach(([colorName, colorDefinition]) => {
    const normalizedName = colorName.toLowerCase();
    const palette = buildPaletteFromDefinition(colorDefinition, options);

    if (palette) {
      newColors[normalizedName] = palette;
    }
  });

  return newColors;
}

export const conf = getBadgesConf();

export const paletteOptions = getPaletteOptions(conf);

const generatedHtmlColors = buildHtmlColors(COLOR_DEFINITIONS, paletteOptions);

const htmlColors = setCustomDynamicColorsIn(
  generatedHtmlColors,
  conf,
  paletteOptions
);

export default htmlColors;