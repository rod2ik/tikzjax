/* License: GNU GPLv3+, Rodrigo Schwencke (Copyleft) */
/* BADGES - badges.js */
/* Projet indépendant de massilia.js */

import htmlColors, { conf, standardColorNames } from "./htmlColors.js";

const color = htmlColors;

/*
 * Les mots reconnus comme balises HTML de badge.
 *
 * Pour ajouter une nouvelle balise, ajoute simplement le mot ici :
 *
 * export const BADGE_TAG_NAMES = ["bd", "bad", "badge", "tag"];
 */
export const BADGE_TAG_NAMES = ["bd", "bad", "badge"];

/*
 * Index dans htmlColors :
 * [BgLight, BgDark, BorderLight, BorderDark, TextLight, TextDark]
 */
const BG_LIGHT = 0;
const BG_DARK = 1;
const BORDER_LIGHT = 2;
const BORDER_DARK = 3;
const TEXT_LIGHT = 4;
const TEXT_DARK = 5;

const BADGE_SELECTOR = BADGE_TAG_NAMES
  .map((tagName) => `.md-typeset ${tagName}`)
  .join(", ");

const IGNORED_ATTRIBUTES = new Set([
  "style",
  "class",
  "id",
  "title",
  "role",
  "tabindex"
]);

/* ============================================================
   VALEURS PAR DÉFAUT
   ============================================================ */

const BADGES_DEFAULTS = {
  /*
   * Couleur dynamique par défaut pour :
   *
   * <bd>Texte</bd>
   * <bad>Texte</bad>
   * <badge>Texte</badge>
   *
   * Équivaut à :
   * <bad @deeppink>Texte</bad>
   */
  color: "deeppink",

  /*
   * Dégradé par défaut pour :
   *
   * <bd gradient>Texte</bd>
   * <bad gradient>Texte</bad>
   * <badge gradient>Texte</badge>
   */
  gradient: {
    from: "deeppink",
    to: "blue",
    angle: "90deg",

    /*
     * dynamic = true :
     *   from/to suivent Light/Dark.
     *
     * dynamic = false :
     *   from/to restent statiques.
     */
    dynamic: true,

    /*
     * null = calcul automatique depuis la couleur from.
     * Tu peux mettre une couleur :
     *   border: "black"
     *   border: "@deeppink"
     *   text: "white"
     *   text: "@deeppink"
     */
    border: null,
    text: null
  }
};

let DEFAULT = BADGES_DEFAULTS.color;
let DEFAULT_GRADIENT = { ...BADGES_DEFAULTS.gradient };

let observerReady = false;

/* ============================================================
   CONFIG OPTIONNELLE
   ============================================================ */

function setDefaultsFromConf(cfg = {}) {
  if (!cfg.badges || typeof cfg.badges !== "object") {
    return;
  }

  if (
    typeof cfg.badges.default === "string" &&
    color[cfg.badges.default.toLowerCase()]
  ) {
    DEFAULT = cfg.badges.default.toLowerCase();
  }

  if (
    cfg.badges.gradient &&
    typeof cfg.badges.gradient === "object"
  ) {
    DEFAULT_GRADIENT = {
      ...DEFAULT_GRADIENT,
      ...cfg.badges.gradient
    };

    if (typeof DEFAULT_GRADIENT.from === "string") {
      DEFAULT_GRADIENT.from = DEFAULT_GRADIENT.from.toLowerCase();
    }

    if (typeof DEFAULT_GRADIENT.to === "string") {
      DEFAULT_GRADIENT.to = DEFAULT_GRADIENT.to.toLowerCase();
    }
  }
}

/* ============================================================
   THÈME MKDOCS MATERIAL
   ============================================================ */

function getThemeElement() {
  if (
    document.body &&
    document.body.hasAttribute("data-md-color-scheme")
  ) {
    return document.body;
  }

  if (
    document.documentElement &&
    document.documentElement.hasAttribute("data-md-color-scheme")
  ) {
    return document.documentElement;
  }

  return document.body || document.documentElement;
}

function getColorScheme() {
  const themeElement = getThemeElement();

  return (
    themeElement?.getAttribute("data-md-color-scheme") ||
    document.body?.getAttribute("data-md-color-scheme") ||
    document.documentElement?.getAttribute("data-md-color-scheme") ||
    "default"
  );
}

function themeIsDark() {
  return getColorScheme() === "slate";
}

function chooseDynamicColor(lightValue, darkValue) {
  return themeIsDark() ? darkValue : lightValue;
}

/* ============================================================
   UTILITAIRES COULEURS
   ============================================================ */

function normalizeColorName(name) {
  if (!name || typeof name !== "string") {
    return "";
  }

  return name.trim().toLowerCase();
}

function isHexWithoutSharp(value) {
  return /^[0-9a-f]{3,8}$/i.test(value);
}

function stripDynamicMarker(value) {
  return typeof value === "string" ? value.replace(/^@/, "") : value;
}

function isStandardCssColor(value) {
  return standardColorNames.has(normalizeColorName(value));
}

/*
 * Couleur statique :
 *
 * <bd deeppink>Texte</bd>
 * <bad red black white>Texte</bad>
 * <badge deepink>Texte</badge>
 *
 * Règle :
 * - pas de @ => couleur identique en Light/Dark.
 * - pour les couleurs CSS standard, on garde le mot CSS exact.
 * - pour les couleurs personnalisées, on prend la colonne Light.
 */
function normalizeStaticColor(value, paletteIndex = BG_LIGHT) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const name = normalizeColorName(value);

  if (!name) {
    return null;
  }

  if (isHexWithoutSharp(name)) {
    return `#${name}`;
  }

  if (name.startsWith("#")) {
    return name;
  }

  if (isStandardCssColor(name)) {
    return name;
  }

  if (color[name]) {
    return color[name][paletteIndex] || color[name][BG_LIGHT];
  }

  return value;
}

/*
 * Couleur dynamique :
 *
 * <bd @deeppink>Texte</bd>
 * <bad @gris>Texte</bad>
 * <badge @deepink>Texte</badge>
 *
 * Règle :
 * - avec @ => utilise Light en thème clair, Dark en thème sombre.
 */
function normalizeDynamicColor(
  value,
  lightIndex = BG_LIGHT,
  darkIndex = BG_DARK
) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const name = normalizeColorName(stripDynamicMarker(value));

  if (!name) {
    return null;
  }

  if (color[name]) {
    return chooseDynamicColor(color[name][lightIndex], color[name][darkIndex]);
  }

  if (isHexWithoutSharp(name)) {
    return `#${name}`;
  }

  if (name.startsWith("#")) {
    return name;
  }

  return stripDynamicMarker(value);
}

/*
 * Couleur automatique :
 *
 * - @couleur => dynamique
 * - couleur  => statique
 */
function normalizeAutoColor(
  value,
  staticIndex = BG_LIGHT,
  dynamicLightIndex = BG_LIGHT,
  dynamicDarkIndex = BG_DARK
) {
  if (!value || typeof value !== "string") {
    return null;
  }

  if (value.startsWith("@")) {
    return normalizeDynamicColor(value, dynamicLightIndex, dynamicDarkIndex);
  }

  return normalizeStaticColor(value, staticIndex);
}

function getDynamicPalette(name) {
  const normalizedName = normalizeColorName(name);
  return color[normalizedName] || null;
}

function getDefaultDynamicPalette() {
  return color[DEFAULT] || color.deeppink || color.deepink || color.gris;
}

/* ============================================================
   ATTRIBUTS HTML
   ============================================================ */

function getBadgeAttributes(badge) {
  return badge
    .getAttributeNames()
    .filter((attributeName) => {
      const name = normalizeColorName(attributeName);

      if (!name) {
        return false;
      }

      if (IGNORED_ATTRIBUTES.has(name)) {
        return false;
      }

      if (name.startsWith("data-")) {
        return false;
      }

      if (name.startsWith("aria-")) {
        return false;
      }

      return true;
    });
}

function isGradientKeyword(value) {
  const name = normalizeColorName(value);

  return (
    name === "gradient" ||
    name === "grad" ||
    name === "degrade" ||
    name === "dégradé" ||
    name === "degradé"
  );
}

function isAngleValue(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  const name = normalizeColorName(value);

  return (
    name.endsWith("deg") ||
    name.endsWith("rad") ||
    name.endsWith("turn") ||
    name === "to-top" ||
    name === "to-bottom" ||
    name === "to-left" ||
    name === "to-right" ||
    name === "to-top-right" ||
    name === "to-top-left" ||
    name === "to-bottom-right" ||
    name === "to-bottom-left"
  );
}

function cssAngle(value) {
  if (!value) {
    return DEFAULT_GRADIENT.angle || "90deg";
  }

  const name = normalizeColorName(value);

  if (name.startsWith("to-")) {
    return name.replaceAll("-", " ");
  }

  return value;
}

/* ============================================================
   APPLICATION CSS
   ============================================================ */

function resetBadgeVisualState(badge) {
  /*
   * Évite qu'un ancien background gradient reste mélangé
   * avec un badge simple lors de navigation.instant.
   */
  badge.style.background = "";
  badge.style.backgroundColor = "";
}

function setBackgroundColor(badge, value) {
  if (!value) return;

  badge.style.background = "";
  badge.style.backgroundColor = value;
}

function setGradientBackground(badge, angle, from, to) {
  if (!from || !to) return;

  badge.style.backgroundColor = "";
  badge.style.background = `linear-gradient(${angle}, ${from}, ${to})`;
}

function setBorderColor(badge, value) {
  if (!value) return;

  badge.style.borderBottom = `2px solid ${value}`;
  badge.style.borderRight = `2px solid ${value}`;
}

function setTextColor(badge, value) {
  if (!value) return;

  badge.style.color = value;
}

/* ============================================================
   BADGES DYNAMIQUES SIMPLES
   ============================================================ */

function applyDynamicPalette(badge, palette) {
  if (!palette) return;

  resetBadgeVisualState(badge);

  setBackgroundColor(
    badge,
    chooseDynamicColor(palette[BG_LIGHT], palette[BG_DARK])
  );

  setBorderColor(
    badge,
    chooseDynamicColor(palette[BORDER_LIGHT], palette[BORDER_DARK])
  );

  setTextColor(
    badge,
    chooseDynamicColor(palette[TEXT_LIGHT], palette[TEXT_DARK])
  );
}

function applyDefaultDynamicBadge(badge) {
  applyDynamicPalette(badge, getDefaultDynamicPalette());
}

function applyNamedDynamicBadge(badge, dynamicAttributeName) {
  const paletteName = stripDynamicMarker(dynamicAttributeName);
  const palette = getDynamicPalette(paletteName);

  if (!palette) {
    console.warn(`[badges] Couleur dynamique inconnue : @${paletteName}`);
    applyDefaultDynamicBadge(badge);
    return;
  }

  applyDynamicPalette(badge, palette);
}

/*
 * Nouvelle syntaxe dynamique Light/Dark manuelle :
 *
 * <bd @deeppink @blue>Texte</bd>
 * <bad @deeppink @blue>Texte</bad>
 * <badge @deeppink @blue>Texte</badge>
 *
 * Interprétation :
 *
 * Light :
 *   couleur 1 => BgLight, BorderLight, TextLight
 *
 * Dark :
 *   couleur 2 => BgDark, BorderDark, TextDark
 *
 * Les bordures sont donc automatiquement calculées par htmlColors.js
 * à partir de chaque couleur.
 */
function applyManualLightDarkBadge(badge, attributes) {
  const lightName = stripDynamicMarker(attributes[0]);
  const darkName = stripDynamicMarker(attributes[1]);

  const lightPalette = getDynamicPalette(lightName);
  const darkPalette = getDynamicPalette(darkName);

  if (!lightPalette || !darkPalette) {
    console.warn(
      `[badges] Couleurs Light/Dark inconnues : @${lightName} @${darkName}`
    );
    applyDefaultDynamicBadge(badge);
    return;
  }

  resetBadgeVisualState(badge);

  if (themeIsDark()) {
    setBackgroundColor(badge, darkPalette[BG_DARK]);
    setBorderColor(badge, darkPalette[BORDER_DARK]);
    setTextColor(badge, darkPalette[TEXT_DARK]);
  } else {
    setBackgroundColor(badge, lightPalette[BG_LIGHT]);
    setBorderColor(badge, lightPalette[BORDER_LIGHT]);
    setTextColor(badge, lightPalette[TEXT_LIGHT]);
  }
}

/* ============================================================
   BADGES STATIQUES
   ============================================================ */

function applyStaticBadge(badge, attributes) {
  resetBadgeVisualState(badge);

  /*
   * Syntaxes :
   *
   * <bd deeppink>Texte</bd>
   * <bad deeppink black white>Texte</bad>
   * <badge deepink black white>Texte</badge>
   */
  const background = normalizeStaticColor(attributes[0], BG_LIGHT);
  const border = normalizeStaticColor(attributes[1], BORDER_LIGHT);
  const text = normalizeStaticColor(attributes[2], TEXT_LIGHT);

  if (background) {
    setBackgroundColor(badge, background);
  }

  if (border) {
    setBorderColor(badge, border);
  }

  if (text) {
    setTextColor(badge, text);
  }
}

/* ============================================================
   GRADIENTS
   ============================================================ */

/*
 * Syntaxes prévues :
 *
 * <bd gradient>Texte</bd>
 * <bad gradient>Texte</bad>
 * <badge gradient>Texte</badge>
 *
 * <bd gradient deeppink blue>Texte</bd>
 *   -> gradient statique.
 *
 * <bd gradient @deeppink @blue>Texte</bd>
 *   -> gradient dynamique Light/Dark.
 *
 * <bd gradient deeppink blue black white>Texte</bd>
 *   -> gradient statique + bordure + texte.
 *
 * <bd gradient @deeppink @blue @black @white>Texte</bd>
 *   -> gradient dynamique + bordure dynamique + texte dynamique.
 *
 * <bd gradient 45deg deeppink blue>Texte</bd>
 *   -> angle explicite.
 *
 * <bd gradient to-right deeppink blue>Texte</bd>
 *   -> direction CSS.
 */

function getDefaultGradientColors() {
  const dynamic = DEFAULT_GRADIENT.dynamic !== false;

  const from = dynamic
    ? normalizeDynamicColor(`@${DEFAULT_GRADIENT.from}`, BG_LIGHT, BG_DARK)
    : normalizeStaticColor(DEFAULT_GRADIENT.from, BG_LIGHT);

  const to = dynamic
    ? normalizeDynamicColor(`@${DEFAULT_GRADIENT.to}`, BG_LIGHT, BG_DARK)
    : normalizeStaticColor(DEFAULT_GRADIENT.to, BG_LIGHT);

  const border = DEFAULT_GRADIENT.border
    ? normalizeAutoColor(
        DEFAULT_GRADIENT.border,
        BORDER_LIGHT,
        BORDER_LIGHT,
        BORDER_DARK
      )
    : dynamic
      ? normalizeDynamicColor(`@${DEFAULT_GRADIENT.from}`, BORDER_LIGHT, BORDER_DARK)
      : normalizeStaticColor(DEFAULT_GRADIENT.from, BORDER_LIGHT);

  const text = DEFAULT_GRADIENT.text
    ? normalizeAutoColor(
        DEFAULT_GRADIENT.text,
        TEXT_LIGHT,
        TEXT_LIGHT,
        TEXT_DARK
      )
    : dynamic
      ? normalizeDynamicColor(`@${DEFAULT_GRADIENT.from}`, TEXT_LIGHT, TEXT_DARK)
      : normalizeStaticColor(DEFAULT_GRADIENT.from, TEXT_LIGHT);

  return {
    angle: cssAngle(DEFAULT_GRADIENT.angle),
    from,
    to,
    border,
    text
  };
}

function parseGradientAttributes(attributes) {
  /*
   * On retire gradient / grad / degrade / dégradé.
   */
  let parts = attributes.filter((attribute) => !isGradientKeyword(attribute));

  let angle = DEFAULT_GRADIENT.angle || "90deg";

  if (parts.length > 0 && isAngleValue(parts[0])) {
    angle = cssAngle(parts[0]);
    parts = parts.slice(1);
  } else {
    angle = cssAngle(angle);
  }

  /*
   * <bd gradient>
   */
  if (parts.length === 0) {
    return getDefaultGradientColors();
  }

  /*
   * parts[0] = couleur départ
   * parts[1] = couleur arrivée
   * parts[2] = bordure optionnelle
   * parts[3] = texte optionnel
   */
  const from = normalizeAutoColor(parts[0], BG_LIGHT, BG_LIGHT, BG_DARK);

  const to = normalizeAutoColor(
    parts[1] || DEFAULT_GRADIENT.to,
    BG_LIGHT,
    BG_LIGHT,
    BG_DARK
  );

  const border = parts[2]
    ? normalizeAutoColor(parts[2], BORDER_LIGHT, BORDER_LIGHT, BORDER_DARK)
    : normalizeAutoColor(parts[0], BORDER_LIGHT, BORDER_LIGHT, BORDER_DARK);

  const text = parts[3]
    ? normalizeAutoColor(parts[3], TEXT_LIGHT, TEXT_LIGHT, TEXT_DARK)
    : normalizeAutoColor(parts[0], TEXT_LIGHT, TEXT_LIGHT, TEXT_DARK);

  return {
    angle,
    from,
    to,
    border,
    text
  };
}

function applyGradientBadge(badge, attributes) {
  resetBadgeVisualState(badge);

  const gradient = parseGradientAttributes(attributes);

  setGradientBackground(
    badge,
    gradient.angle,
    gradient.from,
    gradient.to
  );

  setBorderColor(badge, gradient.border);
  setTextColor(badge, gradient.text);
}

/* ============================================================
   ROUTEUR PRINCIPAL
   ============================================================ */

function applyBadge(badge) {
  const attributes = getBadgeAttributes(badge);

  /*
   * Badge sans attribut :
   *
   * <bd>Texte</bd>
   * <bad>Texte</bad>
   * <badge>Texte</badge>
   *
   * Dynamique par défaut : deeppink.
   * Équivaut à <bad @deeppink>.
   */
  if (attributes.length === 0) {
    applyDefaultDynamicBadge(badge);
    return;
  }

  /*
   * Badge gradient.
   *
   * Important :
   * <bad gradient @deeppink @blue>
   * signifie gradient dynamique deeppink -> blue,
   * et non pas Light deeppink / Dark blue.
   */
  if (attributes.some(isGradientKeyword)) {
    applyGradientBadge(badge, attributes);
    return;
  }

  const firstAttribute = attributes[0];
  const secondAttribute = attributes[1];

  /*
   * Nouvelle syntaxe :
   *
   * <bad @deeppink @blue>Texte</bad>
   *
   * Light = deeppink
   * Dark  = blue
   */
  if (
    firstAttribute &&
    secondAttribute &&
    firstAttribute.startsWith("@") &&
    secondAttribute.startsWith("@")
  ) {
    applyManualLightDarkBadge(badge, attributes);
    return;
  }

  /*
   * Syntaxe dynamique classique :
   *
   * <bd @deeppink>Texte</bd>
   * <bad @deeppink>Texte</bad>
   * <badge @deeppink>Texte</badge>
   */
  if (firstAttribute.startsWith("@")) {
    applyNamedDynamicBadge(badge, firstAttribute);
    return;
  }

  /*
   * Syntaxe statique :
   *
   * <bd deeppink>Texte</bd>
   * <bad deeppink>Texte</bad>
   * <badge deeppink>Texte</badge>
   *
   * Même couleur en Light/Dark.
   */
  applyStaticBadge(badge, attributes);
}

/* ============================================================
   API PUBLIQUE
   ============================================================ */

export function update_badges(root = document) {
  root.querySelectorAll(BADGE_SELECTOR).forEach(applyBadge);
}

export function updateBadges(root = document) {
  update_badges(root);
}

function installThemeObserver() {
  if (observerReady) {
    return;
  }

  const callback = (mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-md-color-scheme"
      ) {
        update_badges(document);
      }
    }
  };

  const observer = new MutationObserver(callback);

  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-md-color-scheme"]
    });
  }

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-md-color-scheme"]
    });
  }

  observerReady = true;
}

export function init(root = document) {
  setDefaultsFromConf(conf || {});
  update_badges(root);
  installThemeObserver();
}

function startBadges() {
  init(document);
}

/*
 * Compatibilité MkDocs Material avec navigation.instant :
 * document$ est réémis à chaque nouvelle page.
 */
const materialDocument =
  typeof document$ !== "undefined"
    ? document$
    : typeof window !== "undefined"
      ? window.document$
      : null;

if (
  materialDocument &&
  typeof materialDocument.subscribe === "function"
) {
  materialDocument.subscribe(() => {
    startBadges();
  });
} else if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    startBadges();
  });
} else {
  startBadges();
}