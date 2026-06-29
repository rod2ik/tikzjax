/* DynaBadges global configuration */
/* This file must be loaded BEFORE dynabadges.js */

window.DYNABADGES_CONF = {
  badges: {
    /*
     * Recognized badge tags.
     *
     * You can add your own tags here without modifying dynabadges.css.
     *
     * Example:
     *
     * tagNames: ["bd", "bad", "badge", "pastille"]
     */
    tagNames: ["bd", "bad", "badge"],

    /*
     * Class automatically added by dynabadges.js to every processed badge.
     *
     * The CSS also uses data-dynabadge, so changing this class name does not
     * require changing dynabadges.css.
     */
    className: "dynabadge",

    /*
     * Visual style defaults.
     *
     * These values are converted by dynabadges.js into CSS variables:
     *
     * --dynabadges-display
     * --dynabadges-radius
     * --dynabadges-padding-x
     * --dynabadges-padding-y
     * --dynabadges-font-weight
     * --dynabadges-font-size
     * --dynabadges-font-family
     * --dynabadges-line-height
     * --dynabadges-vertical-align
     * --dynabadges-white-space
     * --dynabadges-box-decoration-break
     * --dynabadges-border-size
     * --dynabadges-border-style
     */
    style: {
      display: "inline-block",
      radius: "7px",
      paddingX: "0.5em",
      paddingY: "0",
      fontWeight: "500",
      fontSize: "inherit",
      fontFamily: "inherit",
      lineHeight: "1.55",
      verticalAlign: "baseline",
      whiteSpace: "normal",
      boxDecorationBreak: "clone",
      borderSize: "2px",
      borderStyle: "solid"
    },

    /*
     * Default dynamic badge color.
     *
     * <bad>Text</bad>
     *
     * behaves like:
     *
     * <bad @deeppink>Text</bad>
     */
    default: "deeppink",

    /*
     * Default gradient.
     *
     * <bad gradient>Text</bad>
     */
    gradient: {
      from: "deeppink",
      to: "blue",
      angle: "90deg",

      /*
       * true:
       *   from/to follow Light/Dark palettes.
       *
       * false:
       *   from/to remain static.
       */
      dynamic: true,

      /*
       * null:
       *   border and text are calculated automatically from `from`.
       *
       * Examples:
       *
       * border: "black"
       * text: "white"
       *
       * or dynamic:
       *
       * border: "@deeppink"
       * text: "@deeppink"
       */
      border: null,
      text: null
    }
  },

  paletteOptions: {
    /*
     * If the Light background is too dark for black text,
     * it will be progressively lightened.
     */
    backgroundCorrectionAmount: 0.30,

    /*
     * BorderLight = BgLight darkened by this amount.
     * BorderDark  = BgDark lightened by this amount.
     */
    borderCorrectionAmount: 0.40,

    /*
     * Minimal contrast ratio used during automatic correction.
     */
    minContrastRatio: 4.5,

    /*
     * Maximum number of correction passes.
     */
    maxCorrectionPasses: 8,

    /*
     * Default generated text colors.
     */
    textLight: "#000000",
    textDark: "#ffffff"
  },

  colors: {
    /*
     * Automatically generated palette.
     *
     * Usage:
     *
     * <bad fluo>Static fluo</bad>
     * <bad @fluo>Dynamic fluo</bad>
     */
    fluo: "#ccff00",

    /*
     * Fully manual palette.
     *
     * Format:
     *
     * [
     *   BgLight,
     *   BgDark,
     *   BorderLight,
     *   BorderDark,
     *   TextLight,
     *   TextDark
     * ]
     */
    custompink: [
      "#ff99dd",
      "#882255",
      "#aa4488",
      "#ffbbdd",
      "#000000",
      "#ffffff"
    ]
  }
};