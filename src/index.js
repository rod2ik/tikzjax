import { Worker, spawn, Thread } from 'threads';
import { openDB } from 'idb';
import '../css/container.css';

// =================================================
// BASE URL
// =================================================
if (document.currentScript === undefined) {
    const scripts = document.getElementsByTagName('script');
    document.currentScript = scripts[scripts.length - 1];
}

// =================================================
// OPTIONS MERGE HELPERS
// =================================================
const TIKZJAX_OPTIONS_STORE_KEY = '__TikzJaxOptionsStore';
const TIKZJAX_OPTIONS_API_INSTALLED_KEY = '__TikzJaxOptionsApiInstalled';

const isPlainObject = (value) => {
    return Object.prototype.toString.call(value) === '[object Object]';
};

const hasOwn = (object, key) => {
    return Object.prototype.hasOwnProperty.call(object || {}, key);
};

const cloneTikzJaxOptionValue = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => cloneTikzJaxOptionValue(item));
    }

    if (isPlainObject(value)) {
        const result = {};

        Object.entries(value).forEach(([key, item]) => {
            result[key] = cloneTikzJaxOptionValue(item);
        });

        return result;
    }

    return value;
};

const getMergeKey = (value) => {
    if (isPlainObject(value) || Array.isArray(value)) {
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }

    return `${typeof value}:${String(value)}`;
};

const mergeArrayOptions = (base = [], extra = []) => {
    const result = [];
    const seen = new Set();

    [...base, ...extra].forEach((value) => {
        const key = getMergeKey(value);

        if (seen.has(key)) {
            return;
        }

        seen.add(key);
        result.push(cloneTikzJaxOptionValue(value));
    });

    return result;
};

const mergeTikzJaxOptions = (base = {}, extra = {}) => {
    const result = isPlainObject(base) ? cloneTikzJaxOptionValue(base) : {};

    if (!isPlainObject(extra)) {
        return result;
    }

    Object.entries(extra).forEach(([key, value]) => {
        const existingValue = result[key];

        if (Array.isArray(existingValue) && Array.isArray(value)) {
            result[key] = mergeArrayOptions(existingValue, value);
            return;
        }

        if (isPlainObject(existingValue) && isPlainObject(value)) {
            result[key] = mergeTikzJaxOptions(existingValue, value);
            return;
        }

        result[key] = cloneTikzJaxOptionValue(value);
    });

    return result;
};

const DEFAULT_TKZ_TAB_OPTIONS = {
    // When true, values are converted into native tkz-tab
    // defaults. Explicit TeX options still have priority.
    autoApply: true,

    lineWidth: '1.2pt',
    font: '\\Large',

    lgt: 10,
    espcl: 3.2,

    // Additional native defaults accepted by \tkzTabInit,
    // \tkzTabSetup and \tkzTabColors.
    init: {},
    setup: {},
    colors: {},

    // These remain reusable semantic helpers. Row heights are
    // part of the mandatory \tkzTabInit row list, not native
    // package defaults, so they cannot be inferred safely.
    variableRowHeight: 1.2,
    signRowHeight: 2.2,
    variationRowHeight: 2.2,

    imageRowHeight: 2.2,
    antecedentRowHeight: 2.2
};

const DEFAULT_THEME_OPTIONS = {
    /*
     * Target styles are opt-in so existing integrations,
     * especially MkDocs Material, keep full control of
     * their page-level colors.
     */
    applyTargetStyles: false,

    lightBackgroundColor: '#ffffff',
    lightTextColor: '#000000',

    darkBackgroundColor: '#1b1e2b',
    darkTextColor: '#ffffff'
};

const DEFAULT_TIKZJAX_OPTIONS = {
    theme: DEFAULT_THEME_OPTIONS,
    tkzTab: DEFAULT_TKZ_TAB_OPTIONS
};

const getOptionsStore = () => {
    const currentOptions =
        isPlainObject(
            window[TIKZJAX_OPTIONS_STORE_KEY]
        )
            ? window[TIKZJAX_OPTIONS_STORE_KEY]
            : {};

    window[TIKZJAX_OPTIONS_STORE_KEY] =
        mergeTikzJaxOptions(
            DEFAULT_TIKZJAX_OPTIONS,
            currentOptions
        );

    return window[TIKZJAX_OPTIONS_STORE_KEY];
};

const getOptions = () => getOptionsStore();

const installTikzJaxOptionsApi = () => {
    const existingOptions = isPlainObject(window.TikzJaxOptions)
        ? window.TikzJaxOptions
        : {};

    if (window[TIKZJAX_OPTIONS_API_INSTALLED_KEY] !== true) {
        window[TIKZJAX_OPTIONS_STORE_KEY] = mergeTikzJaxOptions(
            getOptionsStore(),
            existingOptions
        );

        try {
            Object.defineProperty(window, 'TikzJaxOptions', {
                configurable: true,
                enumerable: true,
                get() {
                    return getOptionsStore();
                },
                set(value) {
                    if (!isPlainObject(value)) {
                        console.warn('TikZJax: TikzJaxOptions expects a plain object.');
                        return;
                    }

                    window[TIKZJAX_OPTIONS_STORE_KEY] = mergeTikzJaxOptions(
                        getOptionsStore(),
                        value
                    );
                }
            });

            window[TIKZJAX_OPTIONS_API_INSTALLED_KEY] = true;
        } catch (error) {
            console.warn('TikZJax: unable to install TikzJaxOptions merge API.', error);
            window.TikzJaxOptions = window[TIKZJAX_OPTIONS_STORE_KEY];
        }
    } else if (Object.getOwnPropertyDescriptor(window, 'TikzJaxOptions')?.set) {
        window.TikzJaxOptions = existingOptions;
    }

    window.TikzJaxConfigure = (options = {}) => {
        if (!isPlainObject(options)) {
            console.warn('TikZJax: TikzJaxConfigure expects a plain object.');
            return getOptionsStore();
        }

        window.TikzJaxOptions = options;

        return getOptionsStore();
    };
};

installTikzJaxOptionsApi();

const url = new URL(document.currentScript.src, document.baseURI);

const normalizeBaseUrl = (value, base = document.baseURI) =>
    new URL(value || '.', base).href.replace(/\/$/, '');

const getConfiguredAssetBaseUrl = () => {
    const options = getOptions();

    if (options.assetBaseUrl) {
        return normalizeBaseUrl(options.assetBaseUrl);
    }

    return normalizeBaseUrl('.', url);
};

const assetBaseUrl = getConfiguredAssetBaseUrl();

const resolveAssetUrl = (path) =>
    new URL(path, `${assetBaseUrl}/`).href;

// =================================================
// OPTIONS
// =================================================
const DEFAULT_BROKEN_IMAGE_SRC =
    resolveAssetUrl('assets/broken-image.svg');

const getThemeOptions = () => {
    const options = getOptions();

    return options.theme || {};
};

const normalizeThemeColorOption = (
    value,
    fallback
) => {
    const normalized =
        String(value ?? '').trim();

    return normalized || fallback;
};

const getThemePalette = (
    theme = 'light'
) => {
    const themeOptions =
        getThemeOptions();

    const isDark =
        theme === 'dark';

    return {
        backgroundColor:
            normalizeThemeColorOption(
                isDark
                    ? themeOptions
                        .darkBackgroundColor
                    : themeOptions
                        .lightBackgroundColor,
                isDark
                    ? DEFAULT_THEME_OPTIONS
                        .darkBackgroundColor
                    : DEFAULT_THEME_OPTIONS
                        .lightBackgroundColor
            ),

        textColor:
            normalizeThemeColorOption(
                isDark
                    ? themeOptions
                        .darkTextColor
                    : themeOptions
                        .lightTextColor,
                isDark
                    ? DEFAULT_THEME_OPTIONS
                        .darkTextColor
                    : DEFAULT_THEME_OPTIONS
                        .lightTextColor
            )
    };
};

const parseNumberOption = (
    value,
    fallback,
    minimum = Number.NEGATIVE_INFINITY
) => {
    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed >= minimum
        ? parsed
        : fallback;
};

const parseBooleanOption = (value, fallback = false) => {
    if (value === undefined || value === null) {
        return fallback;
    }

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'number') {
        return value !== 0;
    }

    const normalized = String(value).trim().toLowerCase();

    if (['', 'true', '1', 'yes', 'on'].includes(normalized)) {
        return true;
    }

    if (['false', '0', 'no', 'off'].includes(normalized)) {
        return false;
    }

    return fallback;
};

const getRenderTimeout = (dataset = {}) => {
    const options = getOptions();
    const texOptions = options.tex || {};

    const timeout =
        dataset.renderTimeout ??
        options.renderTimeout ??
        texOptions.renderTimeout ??
        15000;

    return parseNumberOption(timeout, 15000, 1);
};

const getMaxRetries = (dataset = {}) => {
    const options = getOptions();
    const texOptions = options.tex || {};

    const retries =
        dataset.maxRetries ??
        options.maxRetries ??
        texOptions.maxRetries ??
        0;

    return parseNumberOption(retries, 0, 0);
};

const shouldRestartWorkerOnFail = (dataset = {}) => {
    const options = getOptions();
    const texOptions = options.tex || {};

    const value =
        dataset.restartWorkerOnFail ??
        options.restartWorkerOnFail ??
        texOptions.restartWorkerOnFail ??
        true;

    return parseBooleanOption(value, true);
};

const getBrokenImageSrc = (dataset = {}) => {
    const options = getOptions();

    return (
        dataset.brokenImageSrc ||
        options.brokenImageSrc ||
        DEFAULT_BROKEN_IMAGE_SRC
    );
};

const parseJsonObject = (value) => {
    if (!value) return {};

    if (isPlainObject(value)) return value;

    try {
        const parsed = JSON.parse(value);

        return isPlainObject(parsed) ? parsed : {};
    } catch (error) {
        console.warn(
            'TikZJax: unable to parse JSON option:',
            value,
            error
        );

        return {};
    }
};

const stringifyTexPackages = (value) => {
    if (!value) return undefined;

    if (typeof value === 'string') return value;

    return JSON.stringify(value);
};

const normalizeTikzLibraries = (value) => {
    if (!value) return undefined;

    if (Array.isArray(value)) return value.join(',');

    return value;
};

// =================================================
// TKZ-TAB GLOBAL MACROS AND NATIVE DEFAULTS
// =================================================
const createTexMacro = (macroName, value) => {
    if (
        value === undefined ||
        value === null ||
        value === false
    ) {
        return '';
    }

    return `\\def\\${macroName}{${String(value)}}\n`;
};

const isTexScalarOptionValue = (value) => {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    );
};

const serializeTexKeyValueOptions = (
    options = {}
) => {
    if (!isPlainObject(options)) {
        return '';
    }

    return Object
        .entries(options)
        .filter(([key, value]) => {
            return (
                /^[A-Za-z][A-Za-z0-9@_-]*$/.test(key) &&
                isTexScalarOptionValue(value)
            );
        })
        .map(([key, value]) => {
            return `${key}={${String(value)}}`;
        })
        .join(',');
};

const getTkzTabNativeInitOptions = (
    tkzTab = {}
) => {
    const automaticOptions = {};

    const firstColumnWidth =
        tkzTab.firstColumnWidth ??
        tkzTab.lgt;

    if (
        firstColumnWidth !== undefined &&
        firstColumnWidth !== null &&
        firstColumnWidth !== false
    ) {
        automaticOptions.lgt =
            firstColumnWidth;
    }

    if (
        tkzTab.espcl !== undefined &&
        tkzTab.espcl !== null &&
        tkzTab.espcl !== false
    ) {
        automaticOptions.espcl =
            tkzTab.espcl;
    }

    if (
        tkzTab.lineWidth !== undefined &&
        tkzTab.lineWidth !== null &&
        tkzTab.lineWidth !== false
    ) {
        automaticOptions.lw =
            tkzTab.lineWidth;
    }

    return mergeTikzJaxOptions(
        automaticOptions,
        isPlainObject(tkzTab.init)
            ? tkzTab.init
            : {}
    );
};

const appendGuardedTexCommand = (
    preamble,
    guardName,
    command
) => {
    if (!command) {
        return preamble;
    }

    return (
        preamble +
        `\\ifdefined\\${guardName}\n` +
        `  ${command}\n` +
        '\\fi\n'
    );
};

const getTkzTabPreamble = (
    options = getOptions()
) => {
    const tkzTab = options.tkzTab || {};

    if (!isPlainObject(tkzTab)) {
        return '';
    }

    let preamble = '';

    preamble +=
        '% TikZJax tkz-tab global options\n';

    // Public helper macros remain available for source code that
    // explicitly references them.
    preamble += createTexMacro(
        'tikzjaxTkzTabLineWidth',
        tkzTab.lineWidth
    );

    preamble += createTexMacro(
        'tikzjaxTkzTabFont',
        tkzTab.font
    );

    preamble += createTexMacro(
        'tikzjaxTkzTabLgt',
        tkzTab.lgt
    );

    preamble += createTexMacro(
        'tikzjaxTkzTabFirstColumnWidth',
        tkzTab.firstColumnWidth ??
        tkzTab.lgt
    );

    preamble += createTexMacro(
        'tikzjaxTkzTabEspcl',
        tkzTab.espcl
    );

    preamble += createTexMacro(
        'tikzjaxTkzTabVariableRowHeight',
        tkzTab.variableRowHeight
    );

    preamble += createTexMacro(
        'tikzjaxTkzTabSignRowHeight',
        tkzTab.signRowHeight
    );

    preamble += createTexMacro(
        'tikzjaxTkzTabVariationRowHeight',
        tkzTab.variationRowHeight
    );

    preamble += createTexMacro(
        'tikzjaxTkzTabImageRowHeight',
        tkzTab.imageRowHeight
    );

    preamble += createTexMacro(
        'tikzjaxTkzTabAntecedentRowHeight',
        tkzTab.antecedentRowHeight
    );

    if (
        parseBooleanOption(
            tkzTab.autoApply,
            true
        ) === false
    ) {
        return preamble;
    }

    // tkz-tab is loaded before addToPreamble is inserted by the
    // worker. Every command below is guarded so ordinary TikZ
    // renders remain unaffected when tkz-tab is not loaded.
    if (
        tkzTab.lineWidth !== undefined &&
        tkzTab.lineWidth !== null &&
        tkzTab.lineWidth !== false
    ) {
        preamble = appendGuardedTexCommand(
            preamble,
            'tkzTabDefaultLineWidth',
            '\\def\\tkzTabDefaultLineWidth{' +
            String(tkzTab.lineWidth) +
            '}'
        );
    }

    const colorOptions =
        serializeTexKeyValueOptions(
            tkzTab.colors
        );

    if (colorOptions) {
        preamble = appendGuardedTexCommand(
            preamble,
            'tkzTabColors',
            `\\tkzTabColors[${colorOptions}]`
        );
    }

    const initOptions =
        serializeTexKeyValueOptions(
            getTkzTabNativeInitOptions(
                tkzTab
            )
        );

    if (initOptions) {
        preamble = appendGuardedTexCommand(
            preamble,
            'tkzTabInit',
            `\\presetkeys[TAB]{tbs}{${initOptions}}{}`
        );
    }

    // Calling tkzTabSetup after redefining the package defaults
    // refreshes its native TikZ styles. Values in tkzTab.setup
    // override those refreshed defaults for the current render.
    const setupOptions =
        serializeTexKeyValueOptions(
            tkzTab.setup
        );

    preamble = appendGuardedTexCommand(
        preamble,
        'tkzTabSetup',
        `\\tkzTabSetup[${setupOptions}]`
    );

    // Each TikZJax source is compiled in its own TeX document.
    // Applying every-node font here therefore affects only this
    // render, and only when the tkz-tab package is present.
    if (
        tkzTab.font !== undefined &&
        tkzTab.font !== null &&
        tkzTab.font !== false
    ) {
        preamble = appendGuardedTexCommand(
            preamble,
            'tkzTabInit',
            '\\tikzset{every node/.append style={font=' +
            String(tkzTab.font) +
            '}}'
        );
    }

    return preamble;
};

const getTexDatasetFromOptions = (options = getOptions()) => {
    const tex = options.tex || {};
    const dataset = {};

    const texPackages =
        tex.texPackages ||
        options.texPackages;

    const tikzLibraries =
        tex.tikzLibraries ||
        options.tikzLibraries;

    const addToPreamble =
        tex.addToPreamble ||
        options.addToPreamble;

    const tkzTabPreamble =
        getTkzTabPreamble(options);

    if (texPackages) {
        dataset.texPackages =
            stringifyTexPackages(texPackages);
    }

    if (tikzLibraries) {
        dataset.tikzLibraries =
            normalizeTikzLibraries(tikzLibraries);
    }

    if (tkzTabPreamble || addToPreamble) {
        dataset.addToPreamble =
            tkzTabPreamble +
            (addToPreamble || '');
    }

    return dataset;
};

const normalizeTexPackagesOption = (value) => {
    if (!value) return undefined;

    if (isPlainObject(value)) return value;

    if (Array.isArray(value)) {
        return value.reduce((result, packageName) => {
            const name = String(packageName || '').trim();

            if (name) {
                result[name] = '';
            }

            return result;
        }, {});
    }

    if (typeof value === 'string') {
        const parsed = parseJsonObject(value);

        if (Object.keys(parsed).length) {
            return parsed;
        }

        return value
            .split(',')
            .map((packageName) => packageName.trim())
            .filter(Boolean)
            .reduce((result, packageName) => {
                result[packageName] = '';
                return result;
            }, {});
    }

    return value;
};

const normalizeTikzLibrariesOption = (value) => {
    if (!value) return undefined;

    if (Array.isArray(value)) return value;

    if (typeof value === 'string') {
        return value
            .split(',')
            .map((library) => library.trim())
            .filter(Boolean);
    }

    return value;
};

const getLocalOptionsFromDataset = (dataset = {}) => {
    const localOptions = {};

    const mergeLocalOptions = (value) => {
        if (!isPlainObject(value)) {
            return;
        }

        Object.assign(
            localOptions,
            mergeTikzJaxOptions(localOptions, value)
        );
    };

    mergeLocalOptions(
        parseJsonObject(dataset.options)
    );

    mergeLocalOptions(
        parseJsonObject(dataset.tikzjaxOptions)
    );

    const texOption =
        parseJsonObject(dataset.tex);

    if (Object.keys(texOption).length) {
        localOptions.tex = mergeTikzJaxOptions(
            localOptions.tex || {},
            texOption
        );
    }

    if (hasOwn(dataset, 'texPackages')) {
        localOptions.tex = mergeTikzJaxOptions(
            localOptions.tex || {},
            {
                texPackages:
                    normalizeTexPackagesOption(
                        dataset.texPackages
                    )
            }
        );
    }

    if (hasOwn(dataset, 'tikzLibraries')) {
        localOptions.tex = mergeTikzJaxOptions(
            localOptions.tex || {},
            {
                tikzLibraries:
                    normalizeTikzLibrariesOption(
                        dataset.tikzLibraries
                    )
            }
        );
    }

    if (hasOwn(dataset, 'addToPreamble')) {
        localOptions.tex = mergeTikzJaxOptions(
            localOptions.tex || {},
            {
                addToPreamble:
                    dataset.addToPreamble
            }
        );
    }

    const tkzTabOption =
        parseJsonObject(dataset.tkzTab);

    if (Object.keys(tkzTabOption).length) {
        localOptions.tkzTab = mergeTikzJaxOptions(
            localOptions.tkzTab || {},
            tkzTabOption
        );
    }

    [
        'renderTimeout',
        'maxRetries',
        'restartWorkerOnFail',
        'brokenImageSrc',
        'disableCache',
        'width',
        'height',
        'debugTimings',
        'showTimings'
    ].forEach((key) => {
        if (hasOwn(dataset, key)) {
            localOptions[key] = dataset[key];
        }
    });

    return localOptions;
};

const getMergedOptionsForDataset = (dataset = {}) => {
    return mergeTikzJaxOptions(
        getOptions(),
        getLocalOptionsFromDataset(dataset)
    );
};

const copyOptionToDataset = (
    dataset,
    options,
    key
) => {
    if (hasOwn(options, key)) {
        dataset[key] = options[key];
    }
};

const copyRenderOptionsToDataset = (
    dataset,
    options
) => {
    const texOptions = options.tex || {};

    if (hasOwn(options, 'renderTimeout')) {
        dataset.renderTimeout =
            options.renderTimeout;
    } else if (hasOwn(texOptions, 'renderTimeout')) {
        dataset.renderTimeout =
            texOptions.renderTimeout;
    }

    if (hasOwn(options, 'maxRetries')) {
        dataset.maxRetries =
            options.maxRetries;
    } else if (hasOwn(texOptions, 'maxRetries')) {
        dataset.maxRetries =
            texOptions.maxRetries;
    }

    if (hasOwn(options, 'restartWorkerOnFail')) {
        dataset.restartWorkerOnFail =
            options.restartWorkerOnFail;
    } else if (
        hasOwn(texOptions, 'restartWorkerOnFail')
    ) {
        dataset.restartWorkerOnFail =
            texOptions.restartWorkerOnFail;
    }

    copyOptionToDataset(
        dataset,
        options,
        'brokenImageSrc'
    );

    copyOptionToDataset(
        dataset,
        options,
        'disableCache'
    );

    copyOptionToDataset(
        dataset,
        options,
        'width'
    );

    copyOptionToDataset(
        dataset,
        options,
        'height'
    );

    copyOptionToDataset(
        dataset,
        options,
        'debugTimings'
    );

    copyOptionToDataset(
        dataset,
        options,
        'showTimings'
    );
};

const cleanInternalDataset = (dataset) => {
    const cleaned = { ...dataset };

    delete cleaned.tikzjaxProcessed;

    return cleaned;
};

const cleanLocalDatasetForWorker = (dataset) => {
    const cleaned = { ...dataset };

    delete cleaned.options;
    delete cleaned.tikzjaxOptions;
    delete cleaned.tex;
    delete cleaned.texPackages;
    delete cleaned.tikzLibraries;
    delete cleaned.addToPreamble;
    delete cleaned.tkzTab;
    delete cleaned.renderPriority;

    return cleaned;
};

const getTikzDataset = (elt) => {
    const localDataset = cleanInternalDataset(
        Object.assign({}, elt.dataset || {})
    );

    const mergedOptions =
        getMergedOptionsForDataset(localDataset);

    const texDataset =
        getTexDatasetFromOptions(mergedOptions);

    const dataset = {
        ...texDataset,
        ...cleanLocalDatasetForWorker(localDataset)
    };

    copyRenderOptionsToDataset(
        dataset,
        mergedOptions
    );

    return dataset;
};

// =================================================
// CACHE
// =================================================
const dbPromise = openDB('TikzJax', 2, {
    upgrade(db) {
        if (
            !db.objectStoreNames.contains(
                'svgImages'
            )
        ) {
            db.createObjectStore('svgImages');
        }
    }
});

const getItem = async (key) =>
    (await dbPromise).get('svgImages', key);

const setItem = async (key, val) =>
    (await dbPromise).put(
        'svgImages',
        val,
        key
    );

// =================================================
// STATE
// =================================================
let observer;
let themeObserver;
let themeRaf = null;
let mkDocsTabsRescanTimer = null;
let sourceRescanTimer = null;
let shuttingDown = false;

const workerSlots = [];
const workerBlobUrls = new Map();
const renderQueue = [];
const pendingRenderGroups = new Map();
const scheduledSources = new Set();

let workerSequence = 0;
let renderSequence = 0;
let dispatchScheduled = false;

// =================================================
// TIMEOUT / FAILURE SAFETY
// =================================================
const withTimeout = (promise, ms) => {
    let timer;

    const timeout = new Promise(
        (_, reject) => {
            timer = window.setTimeout(() => {
                reject(
                    new Error(
                        `TikZJax render timeout after ${ms}ms`
                    )
                );
            }, ms);
        }
    );

    return Promise
        .race([promise, timeout])
        .finally(() => {
            window.clearTimeout(timer);
        });
};

const createDefaultBrokenImageSvg = () => {
    const frag = document
        .createRange()
        .createContextualFragment(
            '<svg class="tikzjax-broken-image" ' +
            'xmlns="http://www.w3.org/2000/svg" ' +
            'width="75pt" height="75pt" ' +
            'viewBox="0 0 75 75" ' +
            'role="img" ' +
            'aria-label="TikZJax rendering error">' +
            '<path d="M14 10 H50 L63 23 V56 ' +
            'C63 61 60 64 55 64 H20 ' +
            'C16 64 12 61 12 56 V16 ' +
            'C12 13 14 10 18 10 Z" ' +
            'fill="none" stroke="#3b82f6" ' +
            'stroke-width="3" ' +
            'stroke-linejoin="round"/>' +
            '<path d="M50 10 V23 H63" ' +
            'fill="none" stroke="#3b82f6" ' +
            'stroke-width="3" ' +
            'stroke-linejoin="round"/>' +
            '<circle cx="26" cy="27" r="6" ' +
            'fill="url(#tikzjax-broken-image-gradient-inline)" ' +
            'stroke="#3b82f6" stroke-width="3"/>' +
            '<path d="M14 56 L29 39 L39 49 ' +
            'L51 35 L63 49" ' +
            'fill="url(#tikzjax-broken-image-gradient-inline)" ' +
            'opacity="0.75" stroke="#3b82f6" ' +
            'stroke-width="3" ' +
            'stroke-linecap="round" ' +
            'stroke-linejoin="round"/>' +
            '<path d="M52 50 L66 64 ' +
            'M66 50 L52 64" ' +
            'stroke="#ef4444" ' +
            'stroke-width="5" ' +
            'stroke-linecap="round"/>' +
            '</svg>'
        );

    const svg = frag.firstChild;

    svg.style.display = 'inline-block';
    svg.style.width = '75pt';
    svg.style.height = '75pt';
    svg.style.minWidth = '75pt';
    svg.style.minHeight = '75pt';
    svg.style.verticalAlign = 'middle';

    return svg;
};

const createBrokenImageElement = (
    dataset = {}
) => {
    const img = document.createElement('img');

    img.className = 'tikzjax-broken-image';
    img.src = getBrokenImageSrc(dataset);
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');

    img.style.display = 'inline-block';
    img.style.width = '75pt';
    img.style.height = '75pt';
    img.style.minWidth = '75pt';
    img.style.minHeight = '75pt';
    img.style.objectFit = 'contain';
    img.style.verticalAlign = 'middle';

    img.onerror = () => {
        const fallback =
            createDefaultBrokenImageSvg();

        fallback.style.marginLeft = 'auto';
        fallback.style.marginRight = 'auto';

        img.replaceWith(fallback);
    };

    return img;
};

const createBrokenImage = (dataset = {}) => {
    const wrapper =
        document.createElement('span');

    wrapper.className =
        'tikzjax-wrapper ' +
        'tikzjax-broken-wrapper ' +
        'mathjax_ignore';

    wrapper.style.display = 'block';
    wrapper.style.width = '100%';
    wrapper.style.minWidth = '75pt';
    wrapper.style.minHeight = '75pt';
    wrapper.style.textAlign = 'center';
    wrapper.style.verticalAlign = 'middle';

    const img =
        createBrokenImageElement(dataset);

    img.style.marginLeft = 'auto';
    img.style.marginRight = 'auto';

    wrapper.appendChild(img);

    return wrapper;
};

// =================================================
// THEME SUPPORT
// =================================================
const isBlackValue = (value) => {
    if (!value) return false;

    const v = value
        .trim()
        .toLowerCase();

    return (
        v === 'black' ||
        v === '#000' ||
        v === '#000000' ||
        v === 'rgb(0,0,0)' ||
        v === 'rgb(0, 0, 0)'
    );
};

const isWhiteValue = (value) => {
    if (!value) return false;

    const v = value
        .trim()
        .toLowerCase();

    return (
        v === 'white' ||
        v === '#fff' ||
        v === '#ffffff' ||
        v === 'rgb(255,255,255)' ||
        v === 'rgb(255, 255, 255)'
    );
};

const isTransparentValue = (value) => {
    if (!value) return true;

    const v = value
        .trim()
        .toLowerCase();

    return (
        v === 'transparent' ||
        v === 'initial' ||
        v === 'inherit' ||
        /^rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0(?:\.0+)?\s*\)$/.test(v) ||
        /^rgba\(.*?,\s*0(?:\.0+)?\s*\)$/.test(v)
    );
};

const getEffectiveBackgroundColor = (
    element,
    fallbackTheme = 'light'
) => {
    const readBackgroundColor = (node) => {
        if (!(node instanceof Element)) {
            return '';
        }

        const backgroundColor =
            window
                .getComputedStyle(node)
                .backgroundColor;

        if (
            !backgroundColor ||
            isTransparentValue(
                backgroundColor
            )
        ) {
            return '';
        }

        return backgroundColor;
    };

    const readFinalBackgroundColor = (
        target
    ) => {
        if (
            !(target instanceof Element) ||
            !target.parentElement
        ) {
            return '';
        }

        /*
         * La cible réelle peut être en cours de transition.
         *
         * Une copie nouvellement insérée ne possède aucun
         * ancien état calculé : avec transition:none, son
         * background correspond immédiatement à la couleur
         * finale du nouveau thème.
         */
        const probe =
            target.cloneNode(false);

        probe.setAttribute(
            'aria-hidden',
            'true'
        );

        probe.style.setProperty(
            'position',
            'fixed',
            'important'
        );

        probe.style.setProperty(
            'left',
            '-100000px',
            'important'
        );

        probe.style.setProperty(
            'top',
            '-100000px',
            'important'
        );

        probe.style.setProperty(
            'visibility',
            'hidden',
            'important'
        );

        probe.style.setProperty(
            'pointer-events',
            'none',
            'important'
        );

        probe.style.setProperty(
            'transition',
            'none',
            'important'
        );

        probe.style.setProperty(
            'animation',
            'none',
            'important'
        );

        target.parentElement.appendChild(
            probe
        );

        const backgroundColor =
            readBackgroundColor(probe);

        probe.remove();

        return backgroundColor;
    };

    /*
     * Cas des pages standalone configurées avec :
     *
     * theme: {
     *     selector: ".app"
     * }
     *
     * On récupère directement la couleur finale de la
     * cible configurée, sans attendre sa transition.
     */
    const configuredTarget =
        element instanceof Element
            ? getConfiguredThemeTarget(
                element
            )
            : null;

    const configuredBackground =
        readFinalBackgroundColor(
            configuredTarget
        );

    if (configuredBackground) {
        return configuredBackground;
    }

    /*
     * Comportement historique conservé pour MkDocs et
     * les pages sans cible de thème configurée.
     */
    let node = element;

    while (node) {
        const backgroundColor =
            readBackgroundColor(node);

        if (backgroundColor) {
            return backgroundColor;
        }

        node = node.parentElement;
    }

    return getThemePalette(
        fallbackTheme
    ).backgroundColor;
};

const isTextNode = (node) => {
    const tag =
        node?.tagName?.toLowerCase();

    return tag === 'text' || tag === 'tspan';
};

const isCurrentColorValue = (value) => {
    if (!value) return false;

    const v = value
        .trim()
        .toLowerCase();

    return (
        v === 'currentcolor' ||
        v === 'current-color'
    );
};

const isNoneValue = (value) => {
    if (!value) return false;

    return value
        .trim()
        .toLowerCase() === 'none';
};

const isPaintServerValue = (value) => {
    if (!value) return false;

    const v = value
        .trim()
        .toLowerCase();

    return (
        v.startsWith('url(') ||
        v.startsWith('var(')
    );
};

const isExplicitColorValue = (value) => {
    if (!value) return false;

    const v = value
        .trim()
        .toLowerCase();

    return !(
        isBlackValue(v) ||
        isWhiteValue(v) ||
        isTransparentValue(v) ||
        isCurrentColorValue(v) ||
        isNoneValue(v) ||
        isPaintServerValue(v)
    );
};

const getStylePropertyValue = (
    styleText,
    property
) => {
    if (!styleText) return '';

    const match = styleText.match(
        new RegExp(
            `${property}\\s*:\\s*([^;]+)`,
            'i'
        )
    );

    return match ? match[1].trim() : '';
};

const getNodePresentationValue = (
    node,
    property
) => {
    return (
        node?.style?.getPropertyValue(property) ||
        node?.getAttribute?.(property) ||
        ''
    );
};

const getExplicitColorFromNode = (
    node,
    properties = ['fill', 'color']
) => {
    for (const property of properties) {
        const value =
            getNodePresentationValue(
                node,
                property
            );

        if (isExplicitColorValue(value)) {
            return value;
        }
    }

    return '';
};

const getInheritedExplicitColor = (
    node,
    properties = ['fill', 'color']
) => {
    let current = node?.parentElement;

    while (current) {
        if (
            current.tagName?.toLowerCase() ===
            'svg'
        ) {
            return '';
        }

        const value = getExplicitColorFromNode(
            current,
            properties
        );

        if (value) {
            return value;
        }

        current = current.parentElement;
    }

    return '';
};

const getTikzWrappers = (root = document) => {
    const wrappers = [];

    if (
        root instanceof Element &&
        root.matches('.tikzjax-wrapper')
    ) {
        wrappers.push(root);
    }

    root.querySelectorAll?.('.tikzjax-wrapper')
        ?.forEach((wrapper) => {
            wrappers.push(wrapper);
        });

    return [...new Set(wrappers)];
};

const normalizeStyleForTheme = (
    styleText,
    node
) => {
    if (!styleText) return styleText;

    let result = styleText;

    const ownColor =
        getStylePropertyValue(
            styleText,
            'color'
        );

    const inheritedFillColor =
        getInheritedExplicitColor(
            node,
            ['fill', 'color']
        );

    const inheritedStrokeColor =
        getInheritedExplicitColor(
            node,
            ['stroke', 'color']
        );

    const fillReplacement =
        isExplicitColorValue(ownColor)
            ? ownColor
            : inheritedFillColor ||
            'currentColor';

    const strokeReplacement =
        inheritedStrokeColor ||
        'currentColor';

    result = result.replace(
        /fill\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))\b/gi,
        `fill: ${fillReplacement}`
    );

    result = result.replace(
        /stroke\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))\b/gi,
        `stroke: ${strokeReplacement}`
    );

    result = result.replace(
        /color\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))\b/gi,
        'color: currentColor'
    );

    if (isTextNode(node)) {
        result = result.replace(
            /fill\s*:\s*(white|#ffffff|#fff|rgb\(255,\s*255,\s*255\))\b/gi,
            `fill: ${inheritedFillColor ||
            'currentColor'
            }`
        );
    } else {
        result = result.replace(
            /fill\s*:\s*(white|#ffffff|#fff|rgb\(255,\s*255,\s*255\))\b/gi,
            inheritedFillColor
                ? `fill: ${inheritedFillColor}`
                : 'fill: transparent'
        );
    }

    result = result.replace(
        /stroke\s*:\s*(white|#ffffff|#fff|rgb\(255,\s*255,\s*255\))\b/gi,
        inheritedStrokeColor
            ? `stroke: ${inheritedStrokeColor}`
            : 'stroke: var(--tikzjax-background-color)'
    );

    return result;
};

const normalizeSvgForTheme = (svg) => {
    if (
        !svg ||
        svg.dataset.tikzjaxThemeNormalized ===
        'true'
    ) {
        return;
    }

    /*
     * TeX représente certaines parties mathématiques par des
     * rectangles remplis :
     *
     * - barres de fractions ;
     * - barres de racines ;
     * - surlignements et règles typographiques.
     *
     * Ces rectangles sont généralement des frères directs
     * d'éléments <text> dans le même groupe SVG.
     */
    const isMathRuleNode = (node) => {
        if (
            node?.tagName?.toLowerCase() !==
            'rect'
        ) {
            return false;
        }

        const parent = node.parentElement;

        if (!parent) {
            return false;
        }

        return Array
            .from(parent.children)
            .some((child) => {
                return isTextNode(child);
            });
    };

    const isMathInkNode = (node) => {
        return (
            isTextNode(node) ||
            isMathRuleNode(node)
        );
    };

    /*
     * Détermine la couleur typographique avant toute
     * modification des groupes parents.
     */
    const getOriginalMathInkPaint = (node) => {
        let current = node;

        while (current && current !== svg) {
            const fill =
                current.style?.getPropertyValue(
                    'fill'
                ) ||
                current.getAttribute?.('fill') ||
                '';

            const color =
                current.style?.getPropertyValue(
                    'color'
                ) ||
                current.getAttribute?.('color') ||
                '';

            for (const value of [fill, color]) {
                if (
                    !value ||
                    isTransparentValue(value) ||
                    isNoneValue(value) ||
                    isPaintServerValue(value)
                ) {
                    continue;
                }

                /*
                 * Le noir ou le blanc TeX correspond à la couleur
                 * normale du texte du thème.
                 */
                if (
                    isBlackValue(value) ||
                    isWhiteValue(value) ||
                    isCurrentColorValue(value)
                ) {
                    return 'currentColor';
                }

                /*
                 * Une couleur réellement explicite, comme rouge,
                 * bleu ou gris, doit rester inchangée.
                 */
                if (isExplicitColorValue(value)) {
                    return value;
                }
            }

            current = current.parentElement;
        }

        return 'currentColor';
    };

    /*
     * Sauvegarde les couleurs de tous les éléments typographiques
     * avant de modifier les fills des groupes SVG.
     */
    const originalMathInkPaint = new Map();

    svg.querySelectorAll('text, tspan, rect')
        .forEach((node) => {
            if (!isMathInkNode(node)) {
                return;
            }

            originalMathInkPaint.set(
                node,
                getOriginalMathInkPaint(node)
            );
        });

    svg.dataset.tikzjaxThemeNormalized =
        'true';

    svg.classList.add('tikzjax', 'tikz');
    svg.style.color = 'currentColor';

    svg
        .querySelectorAll(
            '[fill], [stroke], [color], [style]'
        )
        .forEach((node) => {
            const inheritedFillColor =
                getInheritedExplicitColor(
                    node,
                    ['fill', 'color']
                );

            const inheritedStrokeColor =
                getInheritedExplicitColor(
                    node,
                    ['stroke', 'color']
                );

            if (node.hasAttribute('fill')) {
                const fill =
                    node.getAttribute('fill');

                if (isMathInkNode(node)) {
                    if (
                        isBlackValue(fill) ||
                        isWhiteValue(fill) ||
                        isCurrentColorValue(fill)
                    ) {
                        const replacement =
                            originalMathInkPaint.get(
                                node
                            ) ||
                            'currentColor';

                        node.setAttribute(
                            'fill',
                            replacement
                        );

                        node.style.setProperty(
                            'fill',
                            replacement,
                            'important'
                        );
                    }
                } else if (isBlackValue(fill)) {
                    node.setAttribute(
                        'fill',
                        inheritedFillColor ||
                        'currentColor'
                    );
                } else if (isWhiteValue(fill)) {
                    node.setAttribute(
                        'fill',
                        inheritedFillColor ||
                        'transparent'
                    );
                }
            }

            if (node.hasAttribute('stroke')) {
                const stroke =
                    node.getAttribute('stroke');

                if (isBlackValue(stroke)) {
                    node.setAttribute(
                        'stroke',
                        inheritedStrokeColor ||
                        'currentColor'
                    );
                } else if (
                    isWhiteValue(stroke)
                ) {
                    node.setAttribute(
                        'stroke',
                        inheritedStrokeColor ||
                        'var(--tikzjax-background-color)'
                    );
                }
            }

            if (node.hasAttribute('color')) {
                const color =
                    node.getAttribute('color');

                if (isBlackValue(color)) {
                    node.setAttribute(
                        'color',
                        'currentColor'
                    );
                }
            }

            if (node.hasAttribute('style')) {
                node.setAttribute(
                    'style',
                    normalizeStyleForTheme(
                        node.getAttribute('style'),
                        node
                    )
                );
            }
        });

    /*
     * Restaure les textes et les règles mathématiques après
     * la normalisation des groupes parents.
     */
    originalMathInkPaint.forEach(
        (replacement, node) => {
            if (!node.isConnected) {
                return;
            }

            node.setAttribute(
                'fill',
                replacement
            );

            node.style.setProperty(
                'fill',
                replacement,
                'important'
            );

            node.style.setProperty(
                'opacity',
                '1',
                'important'
            );
        }
    );
};

const getConfiguredThemeTargets = () => {
    const themeOptions =
        getThemeOptions();

    const selector =
        themeOptions.selector;

    if (!selector) return [];

    try {
        return Array.from(
            document.querySelectorAll(selector)
        );
    } catch (error) {
        console.warn(
            'TikZJax: invalid theme selector:',
            selector,
            error
        );

        return [];
    }
};

const getConfiguredThemeTarget = (
    wrapper
) => {
    const targets =
        getConfiguredThemeTargets();

    for (const target of targets) {
        if (
            target === wrapper ||
            target.contains(wrapper)
        ) {
            return target;
        }
    }

    return null;
};

const getThemeFromElement = (element) => {
    if (!element) return null;

    const themeOptions =
        getThemeOptions();

    const darkClass =
        themeOptions.darkClass ||
        'dark';

    const lightClass =
        themeOptions.lightClass ||
        'light';

    const attribute =
        themeOptions.attribute ||
        'data-theme';

    const darkValue =
        themeOptions.darkValue ||
        'dark';

    const lightValue =
        themeOptions.lightValue ||
        'light';

    if (
        attribute &&
        element.hasAttribute(attribute)
    ) {
        const value =
            element.getAttribute(attribute);

        if (value === darkValue) {
            return 'dark';
        }

        if (value === lightValue) {
            return 'light';
        }
    }

    if (
        element.classList?.contains(
            darkClass
        )
    ) {
        return 'dark';
    }

    if (
        element.classList?.contains(
            lightClass
        )
    ) {
        return 'light';
    }

    if (
        element.hasAttribute(
            'data-bs-theme'
        )
    ) {
        const value =
            element.getAttribute(
                'data-bs-theme'
            );
        if (value === 'dark') {
            return 'dark';
        }

        if (value === 'light') {
            return 'light';
        }
    }

    if (
        element.hasAttribute(
            'data-color-scheme'
        )
    ) {
        const value =
            element.getAttribute(
                'data-color-scheme'
            );

        if (
            value === 'dark' ||
            value === 'slate'
        ) {
            return 'dark';
        }

        if (
            value === 'light' ||
            value === 'default'
        ) {
            return 'light';
        }
    }

    return null;
};

const getFallbackTheme = () => {
    const themeOptions =
        getThemeOptions();

    const fallbackTheme =
        themeOptions.fallbackTheme ||
        themeOptions.defaultTheme;

    if (
        fallbackTheme === 'dark' ||
        fallbackTheme === 'light'
    ) {
        return fallbackTheme;
    }

    if (
        themeOptions.followSystemTheme ===
        true &&
        window.matchMedia?.(
            '(prefers-color-scheme: dark)'
        ).matches
    ) {
        return 'dark';
    }

    return 'light';
};

const getThemeForConfiguredTarget = (
    target
) => {
    const directTheme =
        getThemeFromElement(target);

    if (directTheme) {
        return directTheme;
    }

    const themeOptions =
        getThemeOptions();

    const darkClass =
        themeOptions.darkClass ||
        'dark';

    const lightClass =
        themeOptions.lightClass ||
        'light';

    const attribute =
        themeOptions.attribute ||
        'data-theme';

    let localThemeElement;

    try {
        localThemeElement =
            target?.parentElement?.closest(
                `.${darkClass}, ` +
                `.${lightClass}, ` +
                `[${attribute}], ` +
                '[data-bs-theme], ' +
                '[data-color-scheme]'
            );
    } catch {
        localThemeElement =
            target?.parentElement?.closest(
                '.dark, .light, ' +
                '[data-theme], ' +
                '[data-bs-theme], ' +
                '[data-color-scheme]'
            );
    }

    const localTheme =
        getThemeFromElement(
            localThemeElement
        );

    if (localTheme) {
        return localTheme;
    }

    const bodyTheme =
        document.body?.getAttribute(
            'data-md-color-scheme'
        );

    if (bodyTheme === 'slate') {
        return 'dark';
    }

    if (bodyTheme) {
        return 'light';
    }

    const bodyClassTheme =
        getThemeFromElement(
            document.body
        );

    if (bodyClassTheme) {
        return bodyClassTheme;
    }

    const htmlClassTheme =
        getThemeFromElement(
            document.documentElement
        );

    if (htmlClassTheme) {
        return htmlClassTheme;
    }

    return getFallbackTheme();
};

const applyConfiguredThemeTargetStyles = () => {
    const themeOptions =
        getThemeOptions();

    if (
        !parseBooleanOption(
            themeOptions.applyTargetStyles,
            false
        )
    ) {
        return;
    }

    getConfiguredThemeTargets()
        .forEach((target) => {
            const theme =
                getThemeForConfiguredTarget(
                    target
                );

            const palette =
                getThemePalette(theme);

            target.style.setProperty(
                '--tikzjax-theme-background-color',
                palette.backgroundColor
            );

            target.style.setProperty(
                '--tikzjax-theme-text-color',
                palette.textColor
            );

            /*
             * This variable is also inherited by TikZJax
             * wrappers and is used by tkz-tab masking strokes.
             */
            target.style.setProperty(
                '--tikzjax-background-color',
                palette.backgroundColor
            );

            target.style.setProperty(
                'background-color',
                palette.backgroundColor
            );

            target.style.setProperty(
                'color',
                palette.textColor
            );
        });
};

const getThemeForWrapper = (wrapper) => {
    const configuredTarget =
        getConfiguredThemeTarget(wrapper);

    const configuredTheme =
        getThemeFromElement(
            configuredTarget
        );

    if (configuredTheme) {
        return configuredTheme;
    }

    const themeOptions =
        getThemeOptions();

    const darkClass =
        themeOptions.darkClass ||
        'dark';

    const lightClass =
        themeOptions.lightClass ||
        'light';

    const attribute =
        themeOptions.attribute ||
        'data-theme';

    let localThemeElement;

    try {
        localThemeElement = wrapper.closest(
            `.${darkClass}, ` +
            `.${lightClass}, ` +
            `[${attribute}], ` +
            '[data-bs-theme], ' +
            '[data-color-scheme]'
        );
    } catch {
        localThemeElement = wrapper.closest(
            '.dark, .light, ' +
            '[data-theme], ' +
            '[data-bs-theme], ' +
            '[data-color-scheme]'
        );
    }

    const localTheme =
        getThemeFromElement(
            localThemeElement
        );

    if (localTheme) {
        return localTheme;
    }

    const bodyTheme =
        document.body?.getAttribute(
            'data-md-color-scheme'
        );

    if (bodyTheme === 'slate') {
        return 'dark';
    }

    if (bodyTheme) {
        return 'light';
    }

    const bodyClassTheme =
        getThemeFromElement(
            document.body
        );

    if (bodyClassTheme) {
        return bodyClassTheme;
    }

    const htmlClassTheme =
        getThemeFromElement(
            document.documentElement
        );

    if (htmlClassTheme) {
        return htmlClassTheme;
    }

    return getFallbackTheme();
};

const applyThemeToTikz = (
    root = document
) => {
    /*
     * Standalone target styling is explicitly opt-in.
     * With the default options this is a no-op, preserving
     * the existing MkDocs Material behavior.
     */
    applyConfiguredThemeTargetStyles();

    const clamp = (
        value,
        minimum,
        maximum
    ) => {
        return Math.min(
            maximum,
            Math.max(minimum, value)
        );
    };

    const parseSvgColor = (value) => {
        if (!value) {
            return null;
        }

        const normalized =
            String(value)
                .trim()
                .toLowerCase();

        if (
            isTransparentValue(normalized) ||
            isNoneValue(normalized) ||
            isCurrentColorValue(normalized) ||
            isPaintServerValue(normalized)
        ) {
            return null;
        }

        let match = normalized.match(
            /^#([0-9a-f]{3})$/i
        );

        if (match) {
            const digits = match[1];

            return {
                red: parseInt(
                    digits[0] + digits[0],
                    16
                ),
                green: parseInt(
                    digits[1] + digits[1],
                    16
                ),
                blue: parseInt(
                    digits[2] + digits[2],
                    16
                )
            };
        }

        match = normalized.match(
            /^#([0-9a-f]{6})$/i
        );

        if (match) {
            const digits = match[1];

            return {
                red: parseInt(
                    digits.slice(0, 2),
                    16
                ),
                green: parseInt(
                    digits.slice(2, 4),
                    16
                ),
                blue: parseInt(
                    digits.slice(4, 6),
                    16
                )
            };
        }

        match = normalized.match(
            /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i
        );

        if (match) {
            if (
                match[4] !== undefined &&
                Number(match[4]) <= 0
            ) {
                return null;
            }

            return {
                red: clamp(
                    Number(match[1]),
                    0,
                    255
                ),
                green: clamp(
                    Number(match[2]),
                    0,
                    255
                ),
                blue: clamp(
                    Number(match[3]),
                    0,
                    255
                )
            };
        }

        return null;
    };

    const rgbToHsl = (
        red,
        green,
        blue
    ) => {
        const r = red / 255;
        const g = green / 255;
        const b = blue / 255;

        const maximum = Math.max(r, g, b);
        const minimum = Math.min(r, g, b);
        const delta = maximum - minimum;

        let hue = 0;
        let saturation = 0;

        const lightness =
            (maximum + minimum) / 2;

        if (delta !== 0) {
            saturation =
                delta /
                (
                    1 -
                    Math.abs(
                        2 * lightness - 1
                    )
                );

            if (maximum === r) {
                hue =
                    60 *
                    (
                        (
                            (g - b) /
                            delta
                        ) % 6
                    );
            } else if (maximum === g) {
                hue =
                    60 *
                    (
                        (b - r) /
                        delta +
                        2
                    );
            } else {
                hue =
                    60 *
                    (
                        (r - g) /
                        delta +
                        4
                    );
            }
        }

        if (hue < 0) {
            hue += 360;
        }

        return {
            hue,
            saturation:
                Number.isFinite(saturation)
                    ? saturation
                    : 0,
            lightness
        };
    };

    const hslToRgb = (
        hue,
        saturation,
        lightness
    ) => {
        const chroma =
            (
                1 -
                Math.abs(
                    2 * lightness - 1
                )
            ) *
            saturation;

        const section = hue / 60;

        const intermediate =
            chroma *
            (
                1 -
                Math.abs(
                    section % 2 - 1
                )
            );

        let red = 0;
        let green = 0;
        let blue = 0;

        if (section >= 0 && section < 1) {
            red = chroma;
            green = intermediate;
        } else if (
            section >= 1 &&
            section < 2
        ) {
            red = intermediate;
            green = chroma;
        } else if (
            section >= 2 &&
            section < 3
        ) {
            green = chroma;
            blue = intermediate;
        } else if (
            section >= 3 &&
            section < 4
        ) {
            green = intermediate;
            blue = chroma;
        } else if (
            section >= 4 &&
            section < 5
        ) {
            red = intermediate;
            blue = chroma;
        } else {
            red = chroma;
            blue = intermediate;
        }

        const offset =
            lightness -
            chroma / 2;

        return {
            red: Math.round(
                (red + offset) * 255
            ),
            green: Math.round(
                (green + offset) * 255
            ),
            blue: Math.round(
                (blue + offset) * 255
            )
        };
    };

    const rgbToHex = ({
        red,
        green,
        blue
    }) => {
        const toHex = (component) => {
            return clamp(
                Math.round(component),
                0,
                255
            )
                .toString(16)
                .padStart(2, '0');
        };

        return (
            '#' +
            toHex(red) +
            toHex(green) +
            toHex(blue)
        );
    };

    /*
     * Les barres de fractions, de racines et les autres règles
     * typographiques sont souvent des <rect> placés dans le même
     * groupe que les éléments <text>.
     *
     * Elles ne doivent jamais être traitées comme des fonds.
     */
    const isMathRuleNode = (node) => {
        if (
            node?.tagName?.toLowerCase() !==
            'rect'
        ) {
            return false;
        }

        const parent = node.parentElement;

        if (!parent) {
            return false;
        }

        return Array
            .from(parent.children)
            .some((child) => {
                return isTextNode(child);
            });
    };

    const getAdaptiveDarkFill = (
        originalFill,
        adaptiveOptions
    ) => {
        const rgb =
            parseSvgColor(originalFill);

        if (!rgb) {
            return '';
        }

        const hsl = rgbToHsl(
            rgb.red,
            rgb.green,
            rgb.blue
        );

        const lightnessThreshold =
            clamp(
                Number(
                    adaptiveOptions
                        .lightnessThreshold ??
                    0.82
                ),
                0.5,
                1
            );

        /*
         * Seules les couleurs très claires sont adaptées.
         * Les couleurs normales, sombres ou fortement significatives
         * restent inchangées.
         */
        if (
            hsl.lightness <
            lightnessThreshold
        ) {
            return '';
        }

        const darkLightness =
            clamp(
                Number(
                    adaptiveOptions
                        .darkLightness ??
                    0.23
                ),
                0.1,
                0.45
            );

        const minimumSaturation =
            clamp(
                Number(
                    adaptiveOptions
                        .minimumSaturation ??
                    0.18
                ),
                0,
                0.7
            );

        const maximumSaturation =
            clamp(
                Number(
                    adaptiveOptions
                        .maximumSaturation ??
                    0.46
                ),
                minimumSaturation,
                0.9
            );

        const darkSaturation =
            hsl.saturation < 0.04
                ? 0
                : clamp(
                    hsl.saturation * 0.5,
                    minimumSaturation,
                    maximumSaturation
                );

        const adjustedLightness =
            clamp(
                darkLightness +
                Math.min(
                    hsl.saturation * 0.025,
                    0.025
                ),
                0.1,
                0.45
            );

        return rgbToHex(
            hslToRgb(
                hsl.hue,
                darkSaturation,
                adjustedLightness
            )
        );
    };

    const applyAdaptiveSvgFills = (
        svg,
        theme
    ) => {
        const themeOptions =
            getThemeOptions();

        const adaptiveOptions =
            isPlainObject(
                themeOptions.adaptiveFills
            )
                ? themeOptions.adaptiveFills
                : {};

        const enabled =
            parseBooleanOption(
                adaptiveOptions.enabled,
                true
            );

        svg
            .querySelectorAll(
                '[fill], [style*="fill"]'
            )
            .forEach((node) => {
                if (
                    isTextNode(node) ||
                    isMathRuleNode(node)
                ) {
                    return;
                }

                const currentFill =
                    getNodePresentationValue(
                        node,
                        'fill'
                    );

                if (
                    !node.dataset
                        .tikzjaxOriginalFill
                ) {
                    if (
                        !currentFill ||
                        isTransparentValue(
                            currentFill
                        ) ||
                        isNoneValue(
                            currentFill
                        ) ||
                        isCurrentColorValue(
                            currentFill
                        ) ||
                        isPaintServerValue(
                            currentFill
                        )
                    ) {
                        return;
                    }

                    node.dataset
                        .tikzjaxOriginalFill =
                        currentFill;
                }

                const originalFill =
                    node.dataset
                        .tikzjaxOriginalFill;

                let replacement =
                    originalFill;

                if (
                    enabled &&
                    theme === 'dark'
                ) {
                    replacement =
                        getAdaptiveDarkFill(
                            originalFill,
                            adaptiveOptions
                        ) ||
                        originalFill;
                }

                /*
                 * Le mode clair restaure toujours la couleur SVG
                 * originale.
                 */
                node.setAttribute(
                    'fill',
                    replacement
                );

                node.style.setProperty(
                    'fill',
                    replacement,
                    'important'
                );
            });
    };

    getTikzWrappers(root)
        .forEach((wrapper) => {
            const theme =
                getThemeForWrapper(wrapper);

            const palette =
                getThemePalette(theme);

            const backgroundColor =
                getEffectiveBackgroundColor(
                    wrapper,
                    theme
                );

            wrapper.style.color =
                palette.textColor;

            wrapper.style.setProperty(
                '--tikzjax-background-color',
                backgroundColor
            );

            wrapper
                .querySelectorAll('svg')
                .forEach((svg) => {
                    /*
                     * Cette normalisation n'est exécutée qu'une fois.
                     */
                    normalizeSvgForTheme(svg);

                    /*
                     * Cette adaptation est réexécutée à chaque
                     * changement de thème.
                     */
                    applyAdaptiveSvgFills(
                        svg,
                        theme
                    );
                });
        });
};

const scheduleThemeApply = () => {
    if (themeRaf !== null) return;

    themeRaf =
        window.requestAnimationFrame(() => {
            themeRaf = null;
            applyThemeToTikz(document);
        });
};

const observeTheme = () => {
    if (!document.body) return;

    const themeOptions =
        getThemeOptions();

    const configuredAttribute =
        themeOptions.attribute ||
        'data-theme';

    const attributeFilter = [
        'class',
        'data-theme',
        'data-bs-theme',
        'data-color-scheme',
        'data-md-color-scheme'
    ];

    if (
        configuredAttribute &&
        !attributeFilter.includes(
            configuredAttribute
        )
    ) {
        attributeFilter.push(
            configuredAttribute
        );
    }

    const observedTargets = new Set([
        document.body,
        document.documentElement,
        ...getConfiguredThemeTargets()
    ]);

    themeObserver =
        new MutationObserver(
            (mutations) => {
                for (
                    const mutation of mutations
                ) {
                    if (
                        mutation.type ===
                        'attributes' &&
                        attributeFilter.includes(
                            mutation.attributeName
                        )
                    ) {
                        scheduleThemeApply();
                        return;
                    }
                }
            }
        );

    observedTargets.forEach((target) => {
        if (!target) return;

        themeObserver.observe(target, {
            attributes: true,
            attributeFilter
        });
    });
};

// =================================================
// SPINNER
// =================================================
const createLoader = (dataset = {}) => {
    const width =
        parseFloat(dataset.width) ||
        75;

    const height =
        parseFloat(dataset.height) ||
        75;

    const radius =
        Math.min(width, height) *
        0.2;

    const frag = document
        .createRange()
        .createContextualFragment(
            '<svg class="tikzjax-loader" ' +
            'version="1.1" ' +
            'xmlns="http://www.w3.org/2000/svg" ' +
            'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
            `width="${width}pt" ` +
            `height="${height}pt" ` +
            `viewBox="0 0 ${width} ${height}">` +
            `<rect width="${width}" ` +
            `height="${height}" ` +
            'rx="5pt" ry="5pt" ' +
            'fill="#000" ' +
            'fill-opacity="0.2"/>' +
            `<circle cx="${width / 2}" ` +
            `cy="${height / 2}" ` +
            `r="${radius}" ` +
            'stroke="#f3f3f3" ' +
            'fill="none" ' +
            'stroke-width="3"/>' +
            `<circle cx="${width / 2}" ` +
            `cy="${height / 2}" ` +
            `r="${radius}" ` +
            'stroke="#3498db" ' +
            'fill="none" ' +
            'stroke-width="3" ' +
            'stroke-linecap="round">' +
            '<animate ' +
            'attributeName="stroke-dasharray" ' +
            'begin="0s" dur="2s" ' +
            'values="56.5 37.7;1 93.2;56.5 37.7" ' +
            'keyTimes="0;0.5;1" ' +
            'repeatCount="indefinite">' +
            '</animate>' +
            '<animate ' +
            'attributeName="stroke-dashoffset" ' +
            'begin="0s" dur="2s" ' +
            'from="0" to="188.5" ' +
            'repeatCount="indefinite">' +
            '</animate>' +
            '</circle>' +
            '</svg>'
        );

    return frag.firstChild;
};

// =================================================
// SOURCES
// =================================================
const isTikzPre = (node) => {
    if (
        !node ||
        node.nodeType !== 1
    ) {
        return false;
    }

    if (node.tagName !== 'PRE') {
        return false;
    }

    return (
        node.classList.contains(
            'language-tikzjax'
        ) ||
        node.classList.contains(
            'tikzjax'
        ) ||
        node.classList.contains(
            'language-tikz'
        ) ||
        node.classList.contains(
            'tikz'
        )
    );
};

// =================================================
// MKDOCS BROKEN MULTILINE TIKZ SCRIPT REPAIR
// =================================================

// Python-Markdown can break this syntax inside an admonition
// or a content tab:
//
//     <script
//     type="text/tikz"
//     data-tex-packages="tkz-tab"
//     >
//
// The isolated `>` can be interpreted as a blockquote marker.
// This repair is intentionally restricted to malformed TikZJax
// source blocks inside known MkDocs containers.

const BROKEN_MKDOCS_TIKZ_SELECTOR = [
    '.admonition > p:not(.admonition-title)',
    '.tabbed-content > p',
    '.tabbed-block > p'
].join(', ');

const parseBrokenMkDocsTikzOpening = (
    paragraph
) => {
    if (
        !paragraph ||
        paragraph.tagName !== 'P'
    ) {
        return null;
    }

    const openingText =
        String(paragraph.textContent || '')
            .replace(/\r\n?/g, '\n')
            .trim();

    if (
        !/^<script(?:\s|$)/i.test(openingText) ||
        openingText.includes('>') ||
        /<\/script/i.test(openingText)
    ) {
        return null;
    }

    const template =
        document.createElement('template');

    // Script elements parsed inside a template are inert.
    template.innerHTML =
        `${openingText}></script>`;

    const parsedScript =
        template.content.firstElementChild;

    if (
        !parsedScript ||
        parsedScript.tagName !== 'SCRIPT' ||
        String(
            parsedScript.getAttribute('type') || ''
        )
            .trim()
            .toLowerCase() !== 'text/tikz'
    ) {
        return null;
    }

    // Keep the recovery deliberately narrow. TikZJax source
    // elements need only `type` and `data-*` attributes here.
    const hasUnexpectedAttribute =
        Array.from(parsedScript.attributes)
            .some((attribute) => {
                return (
                    attribute.name !== 'type' &&
                    !attribute.name.startsWith('data-')
                );
            });

    if (hasUnexpectedAttribute) {
        return null;
    }

    return parsedScript;
};

const getBrokenMkDocsNodeText = (
    node
) => {
    if (!node) {
        return '';
    }

    if (node.tagName === 'PRE') {
        return (
            node.querySelector('code')
                ?.textContent ||
            node.textContent ||
            ''
        );
    }

    if (node.tagName === 'BLOCKQUOTE') {
        return Array
            .from(node.children)
            .map((child) =>
                getBrokenMkDocsNodeText(child)
            )
            .join('\n\n');
    }

    return node.textContent || '';
};

const isLikelyBrokenMkDocsTikzContinuationNode = (
    node
) => {
    if (
        !node ||
        !['P', 'PRE', 'BLOCKQUOTE'].includes(
            node.tagName
        )
    ) {
        return false;
    }

    const text = String(
        getBrokenMkDocsNodeText(node) || ''
    )
        .replace(/\r\n?/g, '\n')
        .trim();

    if (!text) {
        return false;
    }

    // If a parser preserved </script> as text,
    // this is definitely still part of the broken source.
    if (/<\/script\s*>/i.test(text)) {
        return true;
    }

    // Very common TeX/TikZ continuations.
    if (
        /^\\/.test(text) ||
        /^[{}[\]$%]/.test(text)
    ) {
        return true;
    }

    // Fallback: if the paragraph still contains TeX commands,
    // it is probably part of the same broken TikZ source.
    if (/\\[A-Za-z@]+/.test(text)) {
        return true;
    }

    return false;
};

const extractBrokenMkDocsTikzBody = (
    openingParagraph
) => {
    const consumedNodes = [];
    const sourceParts = [];

    const firstBodyNode =
        openingParagraph.nextElementSibling;

    // The exact Markdown failure starts by turning the isolated
    // `>` into a blockquote. We keep this requirement so that
    // ordinary HTML examples are not converted accidentally.
    if (
        !firstBodyNode ||
        firstBodyNode.tagName !== 'BLOCKQUOTE'
    ) {
        return null;
    }

    let currentNode = firstBodyNode;
    let consumedAtLeastOneNode = false;

    // Prevent accidental runaway scans.
    const maximumConsumedNodes = 64;

    while (
        currentNode &&
        consumedNodes.length < maximumConsumedNodes
    ) {
        // First node must be the initial blockquote.
        // Following nodes may be P / PRE / BLOCKQUOTE
        // if they still look like TeX/TikZ continuation.
        if (!consumedAtLeastOneNode) {
            if (currentNode.tagName !== 'BLOCKQUOTE') {
                return null;
            }
        } else if (
            !isLikelyBrokenMkDocsTikzContinuationNode(
                currentNode
            )
        ) {
            break;
        }

        if (
            !['P', 'PRE', 'BLOCKQUOTE'].includes(
                currentNode.tagName
            )
        ) {
            break;
        }

        const nodeText = getBrokenMkDocsNodeText(
            currentNode
        );

        const closingMatch =
            /<\/script\s*>/i.exec(nodeText);

        if (closingMatch) {
            const trailingText = nodeText.slice(
                closingMatch.index +
                closingMatch[0].length
            );

            // Do not consume unrelated content after </script>.
            if (trailingText.trim()) {
                return null;
            }

            sourceParts.push(
                nodeText.slice(0, closingMatch.index)
            );

            consumedNodes.push(currentNode);

            return {
                consumedNodes,
                sourceText: sourceParts
                    .join('\n\n')
                    .trim()
            };
        }

        sourceParts.push(nodeText);
        consumedNodes.push(currentNode);
        consumedAtLeastOneNode = true;

        currentNode = currentNode.nextElementSibling;
    }

    if (!sourceParts.length) {
        return null;
    }

    return {
        consumedNodes,
        sourceText: sourceParts
            .join('\n\n')
            .trim()
    };
};

const repairBrokenMkDocsTikzScripts = (
    root = document
) => {
    const candidates = [];

    if (
        root instanceof Element &&
        root.matches(
            BROKEN_MKDOCS_TIKZ_SELECTOR
        )
    ) {
        candidates.push(root);
    }

    root
        .querySelectorAll?.(
            BROKEN_MKDOCS_TIKZ_SELECTOR
        )
        ?.forEach((candidate) => {
            candidates.push(candidate);
        });

    const repairedSources = [];

    [...new Set(candidates)]
        .forEach((paragraph) => {
            if (!paragraph.isConnected) {
                return;
            }

            const parsedOpening =
                parseBrokenMkDocsTikzOpening(
                    paragraph
                );

            if (!parsedOpening) {
                return;
            }

            const extracted =
                extractBrokenMkDocsTikzBody(
                    paragraph
                );

            if (
                !extracted ||
                !extracted.sourceText
            ) {
                return;
            }

            const script =
                document.createElement('script');

            Array
                .from(parsedOpening.attributes)
                .forEach((attribute) => {
                    script.setAttribute(
                        attribute.name,
                        attribute.value
                    );
                });

            script.textContent =
                extracted.sourceText;

            paragraph.replaceWith(script);

            extracted.consumedNodes
                .forEach((node) => {
                    node.remove();
                });

            repairedSources.push(script);
        });

    return repairedSources;
};

const getTikzSources = (
    root = document
) => {
    const sources =
        repairBrokenMkDocsTikzScripts(
            root
        );

    if (
        root instanceof Element &&
        root.matches(
            'script[type="text/tikz"]'
        )
    ) {
        sources.push(root);
    }

    if (
        root instanceof Element &&
        isTikzPre(root)
    ) {
        sources.push(root);
    }

    root
        .querySelectorAll?.(
            'script[type="text/tikz"]'
        )
        ?.forEach((source) => {
            sources.push(source);
        });

    root
        .querySelectorAll?.(
            'pre.language-tikzjax, ' +
            'pre.tikzjax, ' +
            'pre.language-tikz, ' +
            'pre.tikz'
        )
        ?.forEach((source) => {
            sources.push(source);
        });

    return [...new Set(sources)]
        .filter(
            (element) =>
                !element.dataset
                    ?.tikzjaxProcessed
        );
};

// =================================================
// TEXT EXTRACTION
// =================================================
const decodeHtmlEntities = (text) => {
    let decoded =
        String(text || '');

    for (let i = 0; i < 3; i += 1) {
        if (!decoded.includes('&')) {
            return decoded;
        }

        const textarea =
            document.createElement(
                'textarea'
            );

        textarea.innerHTML = decoded;

        const next =
            textarea.value;

        if (next === decoded) {
            return decoded;
        }

        decoded = next;
    }

    return decoded;
};

const cleanMkDocsMaterialTextArtifacts = (
    text
) => {
    let cleaned =
        decodeHtmlEntities(text);

    cleaned = cleaned.replace(
        /<br\s*\/?>/gi,
        '\n'
    );

    cleaned = cleaned.replace(
        /<\/?p\b[^>]*>/gi,
        '\n'
    );

    cleaned = cleaned.replace(
        /<span\b[^>]*class=(["'])[^"']*\barithmatex\b[^"']*\1[^>]*>\s*\\\(([\s\S]*?)\\\)\s*<\/span>/gi,
        (_match, _quote, math) =>
            `$${math}$`
    );

    cleaned = cleaned.replace(
        /<span\b[^>]*class=(["'])[^"']*\barithmatex\b[^"']*\1[^>]*>\s*\\\[([\s\S]*?)\\\]\s*<\/span>/gi,
        (_match, _quote, math) =>
            `$$${math}$$`
    );

    cleaned = cleaned.replace(
        /<span\b[^>]*class=(["'])[^"']*\barithmatex\b[^"']*\1[^>]*>\s*([\s\S]*?)\s*<\/span>/gi,
        (_match, _quote, math) =>
            math
    );

    cleaned = cleaned.replace(
        /<\/?span\b[^>]*>/gi,
        ''
    );

    cleaned = cleaned.replace(
        /\\\(([\s\S]*?)\\\)/g,
        (_match, math) =>
            `$${math}$`
    );

    cleaned = cleaned.replace(
        /\\\[([\s\S]*?)\\\]/g,
        (_match, math) =>
            `$$${math}$$`
    );

    return decodeHtmlEntities(cleaned);
};

const normalizeTikzSourceText = (text) => {
    const raw = String(text || '')
        .replace(/\r\n?/g, '\n');

    const trimmed = raw.trim();

    if (!trimmed) return '';

    const lines = trimmed.split('\n');

    const indents = lines
        .filter((line) => line.trim())
        .map((line) => {
            const match =
                line.match(/^[ \t]*/);

            return match
                ? match[0].length
                : 0;
        });

    const minIndent =
        indents.length
            ? Math.min(...indents)
            : 0;

    return lines
        .map((line) =>
            line.slice(minIndent)
        )
        .join('\n')
        .trim();
};

const getTikzSourceText = (elt) => {
    if (!elt) return '';

    if (elt.tagName === 'SCRIPT') {
        return normalizeTikzSourceText(
            cleanMkDocsMaterialTextArtifacts(
                elt.textContent || ''
            )
        );
    }

    const code =
        elt.querySelector('code');

    return normalizeTikzSourceText(
        code
            ? code.textContent
            : elt.textContent || ''
    );
};

// =================================================
// MKDOCS MATERIAL CONTENT TABS SUPPORT
// =================================================
const isMkDocsTabbedElement = (node) => {
    if (
        !node ||
        node.nodeType !== 1
    ) {
        return false;
    }

    return (
        node.matches?.(
            '.tabbed-set, ' +
            '.tabbed-content, ' +
            '.tabbed-block'
        ) ||
        Boolean(
            node.closest?.(
                '.tabbed-set'
            )
        ) ||
        Boolean(
            node.querySelector?.(
                '.tabbed-set, ' +
                '.tabbed-content, ' +
                '.tabbed-block'
            )
        )
    );
};

const scheduleMkDocsTabsRescan = (
    delay = 80
) => {
    if (
        mkDocsTabsRescanTimer !== null
    ) {
        return;
    }

    mkDocsTabsRescanTimer =
        window.setTimeout(() => {
            mkDocsTabsRescanTimer = null;

            const sources =
                getTikzSources(document);

            if (sources.length) {
                processTikzSources(sources);
            }

            applyThemeToTikz(document);
        }, delay);
};

const handleMkDocsTabsInteraction = (
    event
) => {
    const target = event.target;

    if (
        target?.matches?.(
            '.tabbed-set ' +
            'input[type="radio"]'
        ) ||
        target?.closest?.(
            '.tabbed-set label, ' +
            '.tabbed-set [role="tab"], ' +
            '.tabbed-label'
        )
    ) {
        scheduleMkDocsTabsRescan();
    }
};

// =================================================
// SVG WRAPPER
// =================================================
const wrapSvg = (svg) => {
    const wrapper =
        document.createElement('span');

    wrapper.className =
        'tikzjax-wrapper mathjax_ignore';

    wrapper.appendChild(svg);

    applyThemeToTikz(wrapper);

    return wrapper;
};

// =================================================
// WORKER POOL
// =================================================
const getWorkerOptions = () => {
    const options = getOptions();
    const workerOptions =
        options.worker || {};

    const configuredWorkerUrl =
        options.workerUrl ||
        workerOptions.url ||
        'run-tex.js';

    const configuredWorkerMode =
        options.workerMode ||
        workerOptions.mode ||
        'auto';

    const workerMode =
        String(configuredWorkerMode)
            .toLowerCase();

    if (
        ![
            'auto',
            'direct',
            'blob'
        ].includes(workerMode)
    ) {
        console.warn(
            'TikZJax: invalid workerMode "' +
            configuredWorkerMode +
            '". Falling back to "auto".'
        );
    }

    return {
        workerUrl:
            resolveAssetUrl(
                configuredWorkerUrl
            ),

        workerMode:
            [
                'auto',
                'direct',
                'blob'
            ].includes(workerMode)
                ? workerMode
                : 'auto'
    };
};

const getWorkerPoolOptions = () => {
    const options = getOptions();

    const workerOptions =
        options.worker || {};

    const configuredPool =
        options.workerPool === false
            ? {
                enabled: false
            }
            : (
                isPlainObject(
                    options.workerPool
                )
                    ? options.workerPool
                    : (
                        isPlainObject(
                            workerOptions.pool
                        )
                            ? workerOptions.pool
                            : {}
                    )
            );

    return {
        enabled: parseBooleanOption(
            configuredPool.enabled,
            true
        ),

        maxWorkers: parseNumberOption(
            configuredPool.maxWorkers,
            3,
            1
        ),

        reserveCpuCores:
            parseNumberOption(
                configuredPool
                    .reserveCpuCores,
                1,
                0
            ),

        useDeviceMemory:
            parseBooleanOption(
                configuredPool
                    .useDeviceMemory,
                true
            ),

        initializationRetries:
            parseNumberOption(
                configuredPool
                    .initializationRetries,
                1,
                0
            )
    };
};

const getMemoryWorkerLimit = () => {
    const poolOptions =
        getWorkerPoolOptions();

    if (!poolOptions.useDeviceMemory) {
        return Number.POSITIVE_INFINITY;
    }

    const memoryGiB =
        Number(navigator.deviceMemory);

    if (!Number.isFinite(memoryGiB)) {
        return Number.POSITIVE_INFINITY;
    }

    if (memoryGiB <= 2) return 1;
    if (memoryGiB <= 4) return 2;
    if (memoryGiB <= 8) return 3;

    return 4;
};

const getDesiredWorkerCount = (
    workload
) => {
    if (workload <= 0) return 0;

    const poolOptions =
        getWorkerPoolOptions();

    if (!poolOptions.enabled) {
        return 1;
    }

    const cpuCount =
        parseNumberOption(
            navigator.hardwareConcurrency,
            4,
            1
        );

    const cpuLimit = Math.max(
        1,
        cpuCount -
        poolOptions.reserveCpuCores
    );

    const memoryLimit =
        getMemoryWorkerLimit();

    return Math.max(
        1,
        Math.min(
            workload,
            poolOptions.maxWorkers,
            cpuLimit,
            memoryLimit
        )
    );
};

const isSameOriginUrl = (value) =>
    new URL(
        value,
        document.baseURI
    ).origin === window.location.origin;

const createDirectWorker = (
    workerUrl
) => {
    return new Worker(workerUrl);
};

const getWorkerBlobUrl = async (
    workerUrl
) => {
    let pendingBlobUrl =
        workerBlobUrls.get(workerUrl);

    if (!pendingBlobUrl) {
        pendingBlobUrl = (
            async () => {
                const response =
                    await fetch(workerUrl);

                if (!response.ok) {
                    throw new Error(
                        'TikZJax: unable to load ' +
                        `worker ${workerUrl}: ` +
                        `${response.status} ` +
                        response.statusText
                    );
                }

                const workerSource =
                    await response.text();

                return URL.createObjectURL(
                    new Blob(
                        [workerSource],
                        {
                            type:
                                'application/javascript'
                        }
                    )
                );
            }
        )().catch((error) => {
            workerBlobUrls.delete(
                workerUrl
            );

            throw error;
        });

        workerBlobUrls.set(
            workerUrl,
            pendingBlobUrl
        );
    }

    return pendingBlobUrl;
};

const createBlobWorker = async (
    workerUrl
) => {
    const blobUrl =
        await getWorkerBlobUrl(
            workerUrl
        );

    return new Worker(blobUrl);
};

const createWorker = async () => {
    const {
        workerUrl,
        workerMode
    } = getWorkerOptions();

    if (workerMode === 'direct') {
        return createDirectWorker(
            workerUrl
        );
    }

    if (workerMode === 'blob') {
        return createBlobWorker(
            workerUrl
        );
    }

    if (isSameOriginUrl(workerUrl)) {
        return createDirectWorker(
            workerUrl
        );
    }

    return createBlobWorker(workerUrl);
};

const initializeWorkerProxy = async (
    workerId
) => {
    const root = assetBaseUrl;

    const tex = await spawn(
        await createWorker()
    );

    Thread.events(tex)
        .subscribe((event) => {
            if (
                event.type === 'message' &&
                typeof event.data === 'string'
            ) {
                console.log(
                    `[TikZJax worker ${workerId}] ` +
                    event.data
                );
            }
        });

    await tex.load(root);

    return tex;
};

const terminateWorkerProxy = async (
    proxy
) => {
    if (!proxy) return;

    try {
        await Thread.terminate(proxy);
    } catch (error) {
        console.warn(
            'TikZJax: unable to ' +
            'terminate worker:',
            error
        );
    }
};

const initializeWorkerSlot = async (
    slot,
    attempt = 0
) => {
    const poolOptions =
        getWorkerPoolOptions();

    slot.initializing = true;
    slot.ready = false;
    slot.failed = false;

    try {
        slot.proxy =
            await initializeWorkerProxy(
                slot.id
            );

        slot.ready = true;
        slot.initializing = false;

        scheduleDispatch();

        return slot;
    } catch (error) {
        slot.proxy = null;
        slot.ready = false;
        slot.initializing = false;

        if (
            attempt <
            poolOptions
                .initializationRetries &&
            !shuttingDown
        ) {
            await new Promise(
                (resolve) => {
                    window.setTimeout(
                        resolve,
                        250 * (attempt + 1)
                    );
                }
            );

            return initializeWorkerSlot(
                slot,
                attempt + 1
            );
        }

        slot.failed = true;

        console.warn(
            `TikZJax: worker ${slot.id} ` +
            'initialization failed:',
            error
        );

        const index =
            workerSlots.indexOf(slot);

        if (index >= 0) {
            workerSlots.splice(index, 1);
        }

        if (
            renderQueue.length &&
            !workerSlots.some(
                (worker) =>
                    worker.ready ||
                    worker.initializing
            )
        ) {
            failQueuedRenderGroups(error);
        }

        throw error;
    }
};

const createWorkerSlot = () => {
    const slot = {
        id: ++workerSequence,
        proxy: null,
        ready: false,
        initializing: true,
        busy: false,
        failed: false,
        restarting: null,
        activeGroup: null,
        dependencyKeys: new Set(),
        initializationPromise: null
    };

    workerSlots.push(slot);

    slot.initializationPromise =
        initializeWorkerSlot(slot)
            .catch(() => null);

    return slot;
};

const restartWorkerSlot = async (
    slot
) => {
    if (slot.restarting) {
        return slot.restarting;
    }

    slot.restarting = (
        async () => {
            const oldProxy =
                slot.proxy;

            slot.proxy = null;
            slot.ready = false;
            slot.initializing = true;

            slot.dependencyKeys.clear();

            await terminateWorkerProxy(
                oldProxy
            );

            if (shuttingDown) {
                return null;
            }

            await initializeWorkerSlot(slot);

            return slot.proxy;
        }
    )().finally(() => {
        slot.restarting = null;
    });

    return slot.restarting;
};

const terminateWorkerSlot = async (
    slot
) => {
    const proxy = slot.proxy;

    slot.proxy = null;
    slot.ready = false;
    slot.initializing = false;
    slot.busy = false;
    slot.failed = true;

    slot.dependencyKeys.clear();

    await terminateWorkerProxy(proxy);
};

const getDependencyKey = (
    dataset = {}
) => {
    return JSON.stringify({
        texPackages:
            dataset.texPackages || '',

        tikzLibraries:
            dataset.tikzLibraries || '',

        addToPreamble:
            dataset.addToPreamble || ''
    });
};

const getOutstandingWorkload = () => {
    const activeCount =
        workerSlots.filter(
            (slot) => slot.busy
        ).length;

    return (
        renderQueue.length +
        activeCount
    );
};

const ensureWorkerCapacity = () => {
    if (shuttingDown) return;

    const desiredCount =
        getDesiredWorkerCount(
            getOutstandingWorkload()
        );

    const usableCount =
        workerSlots.filter(
            (slot) => !slot.failed
        ).length;

    for (
        let i = usableCount;
        i < desiredCount;
        i += 1
    ) {
        createWorkerSlot();
    }
};

// =================================================
// RENDER QUEUE
// =================================================
const getViewportPriority = (element) => {
    if (!element?.isConnected) {
        return 3;
    }

    const explicitPriority =
        Number(
            element.dataset
                ?.renderPriority
        );

    if (
        Number.isFinite(
            explicitPriority
        )
    ) {
        return explicitPriority;
    }

    const style =
        window.getComputedStyle(
            element
        );

    if (
        style.display === 'none' ||
        style.visibility === 'hidden'
    ) {
        return 3;
    }

    const rect =
        element.getBoundingClientRect();

    const viewportHeight =
        window.innerHeight ||
        document.documentElement
            .clientHeight ||
        0;

    if (
        rect.bottom >= 0 &&
        rect.top <= viewportHeight
    ) {
        return 0;
    }

    if (
        rect.bottom >= -viewportHeight &&
        rect.top <= viewportHeight * 2
    ) {
        return 1;
    }

    return 2;
};

const getRenderCacheKey = (
    text,
    dataset
) => {
    return (
        JSON.stringify(dataset) +
        '\n' +
        text
    );
};

const createSvgFromHtml = (html) => {
    return document
        .createRange()
        .createContextualFragment(html)
        .firstChild;
};

const applyRenderedHtmlToTarget = (
    target,
    html
) => {
    const svg =
        createSvgFromHtml(html);

    if (!svg) {
        throw new Error(
            'TikZJax: texify returned ' +
            'empty output.'
        );
    }

    if (target.loader?.isConnected) {
        target.loader.replaceWith(
            wrapSvg(svg)
        );
    }

    applyThemeToTikz(document);

    svg.dispatchEvent(
        new Event(
            'tikzjax-load-finished',
            {
                bubbles: true
            }
        )
    );
};

const failRenderTarget = (
    target,
    error
) => {
    console.warn(
        'TikZJax rendering failed:',
        error
    );

    const brokenImage =
        createBrokenImage(
            target.dataset || {}
        );

    if (target.loader?.isConnected) {
        target.loader.replaceWith(
            brokenImage
        );
    }
};

const completeRenderGroup = (group) => {
    if (!group.disableCache) {
        pendingRenderGroups.delete(
            group.cacheKey
        );
    }

    group.completed = true;
};

const failRenderGroup = (
    group,
    error
) => {
    group.targets.forEach((target) => {
        failRenderTarget(
            target,
            error
        );
    });

    completeRenderGroup(group);
};

const failQueuedRenderGroups = (
    error
) => {
    const queued =
        renderQueue.splice(0);

    queued.forEach((group) => {
        failRenderGroup(group, error);
    });
};

const enqueueResolvedRenderGroup = (
    group
) => {
    if (
        group.completed ||
        group.queued
    ) {
        return;
    }

    group.queued = true;
    renderQueue.push(group);

    scheduleDispatch();
};

const resolveRenderGroupCache = async (
    group
) => {
    if (group.disableCache) {
        enqueueResolvedRenderGroup(group);
        return;
    }

    try {
        const cached =
            await getItem(
                group.cacheKey
            );

        if (cached) {
            try {
                group.targets.forEach(
                    (target) => {
                        applyRenderedHtmlToTarget(
                            target,
                            cached
                        );
                    }
                );

                completeRenderGroup(group);
                return;
            } catch (error) {
                console.warn(
                    'TikZJax: cached SVG ' +
                    'output was invalid; ' +
                    'recompiling.',
                    error
                );
            }
        }
    } catch (error) {
        console.warn(
            'TikZJax: unable to read ' +
            'the SVG cache:',
            error
        );
    }

    enqueueResolvedRenderGroup(group);
};

const addTargetToRenderQueue = (
    target
) => {
    const disableCache =
        parseBooleanOption(
            target.dataset.disableCache,
            false
        );

    const cacheKey =
        getRenderCacheKey(
            target.text,
            target.dataset
        );

    if (!disableCache) {
        const existingGroup =
            pendingRenderGroups.get(
                cacheKey
            );

        if (
            existingGroup &&
            !existingGroup.completed
        ) {
            existingGroup.targets.push(
                target
            );

            existingGroup.priority =
                Math.min(
                    existingGroup.priority,
                    target.priority
                );

            return existingGroup;
        }
    }

    const group = {
        id: ++renderSequence,
        text: target.text,
        dataset: target.dataset,
        cacheKey,
        disableCache,

        dependencyKey:
            getDependencyKey(
                target.dataset
            ),

        priority: target.priority,
        targets: [target],
        queued: false,
        completed: false
    };

    if (!disableCache) {
        pendingRenderGroups.set(
            cacheKey,
            group
        );
    }

    resolveRenderGroupCache(group);

    return group;
};

const takeNextRenderGroup = (slot) => {
    if (!renderQueue.length) {
        return null;
    }

    let bestPriority =
        Number.POSITIVE_INFINITY;

    renderQueue.forEach((group) => {
        if (
            group.priority <
            bestPriority
        ) {
            bestPriority =
                group.priority;
        }
    });

    const candidateIndexes = [];

    renderQueue.forEach(
        (group, index) => {
            if (
                group.priority ===
                bestPriority
            ) {
                candidateIndexes.push(
                    index
                );
            }
        }
    );

    let selectedIndex =
        candidateIndexes.find(
            (index) => {
                return slot
                    .dependencyKeys
                    .has(
                        renderQueue[index]
                            .dependencyKey
                    );
            }
        );

    if (selectedIndex === undefined) {
        selectedIndex =
            candidateIndexes[0];
    }

    return renderQueue.splice(
        selectedIndex,
        1
    )[0];
};

const isTimeoutError = (error) => {
    return String(
        error?.message ||
        error
    ).includes(
        'TikZJax render timeout after'
    );
};

const renderWithWorkerSafety = async (
    slot,
    group
) => {
    const timeout =
        getRenderTimeout(
            group.dataset
        );

    return withTimeout(
        slot.proxy.texify(
            group.text,
            group.dataset
        ),
        timeout
    );
};

const renderGroupOnWorker = async (
    slot,
    group
) => {
    let html;
    let lastError = null;

    const maxRetries =
        getMaxRetries(
            group.dataset
        );

    for (
        let attempt = 0;
        attempt <= maxRetries;
        attempt += 1
    ) {
        try {
            html =
                await renderWithWorkerSafety(
                    slot,
                    group
                );

            break;
        } catch (error) {
            lastError = error;

            const restartRequired =
                isTimeoutError(error) ||
                shouldRestartWorkerOnFail(
                    group.dataset
                );

            if (restartRequired) {
                try {
                    await restartWorkerSlot(
                        slot
                    );
                } catch (
                restartError
                ) {
                    lastError =
                        new Error(
                            'TikZJax: worker ' +
                            'restart failed.',
                            {
                                cause:
                                    restartError
                            }
                        );

                    break;
                }
            }
        }
    }

    if (!html) {
        throw (
            lastError ||
            new Error(
                'TikZJax rendering failed.'
            )
        );
    }

    slot.dependencyKeys.add(
        group.dependencyKey
    );

    if (!group.disableCache) {
        try {
            await setItem(
                group.cacheKey,
                html
            );
        } catch (error) {
            console.warn(
                'TikZJax: unable to ' +
                'write the SVG cache:',
                error
            );
        }
    }

    group.targets.forEach((target) => {
        applyRenderedHtmlToTarget(
            target,
            html
        );
    });

    completeRenderGroup(group);
};

const executeRenderGroup = async (
    slot,
    group
) => {
    slot.busy = true;
    slot.activeGroup = group;

    try {
        await renderGroupOnWorker(
            slot,
            group
        );
    } catch (error) {
        failRenderGroup(
            group,
            error
        );
    } finally {
        slot.busy = false;
        slot.activeGroup = null;

        scheduleDispatch();
    }
};

const dispatchRenderQueue = () => {
    if (shuttingDown) return;

    ensureWorkerCapacity();

    workerSlots.forEach((slot) => {
        if (
            slot.ready &&
            !slot.busy &&
            !slot.restarting &&
            renderQueue.length
        ) {
            const group =
                takeNextRenderGroup(slot);

            if (group) {
                executeRenderGroup(
                    slot,
                    group
                );
            }
        }
    });
};

function scheduleDispatch() {
    if (
        dispatchScheduled ||
        shuttingDown
    ) {
        return;
    }

    dispatchScheduled = true;

    queueMicrotask(() => {
        dispatchScheduled = false;
        dispatchRenderQueue();
    });
}

// =================================================
// ENGINE
// =================================================
const prepareTikzSource = (elt) => {
    if (
        !elt ||
        elt.dataset?.tikzjaxProcessed
    ) {
        return null;
    }

    const text =
        getTikzSourceText(elt);

    const dataset =
        getTikzDataset(elt);

    elt.dataset.tikzjaxProcessed =
        'true';

    const container =
        elt.closest(
            'pre.language-tikzjax'
        ) ||
        elt.closest(
            'pre.tikzjax'
        ) ||
        elt.closest(
            'pre.language-tikz'
        ) ||
        elt.closest(
            'pre.tikz'
        ) ||
        elt.closest('script') ||
        elt;

    const loaderSvg =
        createLoader(
            dataset ||
            elt.dataset ||
            {}
        );

    const wrapper =
        document.createElement('span');

    wrapper.className =
        'tikzjax-wrapper ' +
        'tikzjax-loading ' +
        'mathjax_ignore';

    wrapper.style.display =
        'inline-flex';

    wrapper.style.alignItems =
        'center';

    wrapper.style.justifyContent =
        'center';

    wrapper.style.verticalAlign =
        'middle';

    wrapper.style.minWidth =
        `${parseFloat(dataset?.width) ||
        75
        }pt`;

    wrapper.style.minHeight =
        `${parseFloat(dataset?.height) ||
        75
        }pt`;

    container.replaceWith(wrapper);
    wrapper.appendChild(loaderSvg);

    applyThemeToTikz(wrapper);

    return {
        element: elt,
        text,
        dataset,
        loader: wrapper,

        priority:
            getViewportPriority(
                wrapper
            )
    };
};

const processTikzSources = async (
    sources
) => {
    const uniqueSources =
        [...new Set(sources || [])];

    uniqueSources.forEach((source) => {
        try {
            const target =
                prepareTikzSource(
                    source
                );

            if (target) {
                addTargetToRenderQueue(
                    target
                );
            }
        } catch (error) {
            console.warn(
                'TikZJax: unable to ' +
                'prepare TikZ source:',
                error
            );
        }
    });
};

// =================================================
// INIT
// =================================================
const scheduleSourceProcess = (node) => {
    if (!node) return;

    scheduledSources.add(node);

    if (sourceRescanTimer !== null) {
        return;
    }

    sourceRescanTimer =
        window.setTimeout(() => {
            sourceRescanTimer = null;

            const sources =
                [...scheduledSources];

            scheduledSources.clear();

            processTikzSources(sources);
        }, 50);
};

const initialize = async () => {
    const boot = () => {
        const sources =
            getTikzSources(document);

        if (sources.length) {
            processTikzSources(sources);
        }

        applyThemeToTikz(document);
        scheduleMkDocsTabsRescan();
    };

    if (
        document.readyState ===
        'loading'
    ) {
        document.addEventListener(
            'DOMContentLoaded',
            boot,
            {
                once: true
            }
        );
    } else {
        boot();
    }

    observer = new MutationObserver(
        (mutations) => {
            const targets = [];

            for (
                const mutation of mutations
            ) {
                for (
                    const node of
                    mutation.addedNodes
                ) {
                    if (
                        !node ||
                        node.nodeType !== 1
                    ) {
                        continue;
                    }

                    const repairRoot =
                        node.parentElement || node;

                    repairBrokenMkDocsTikzScripts(
                        repairRoot
                    ).forEach((source) => {
                        targets.push(source);
                    });

                    if (
                        node.matches?.(
                            'script[type="text/tikz"]'
                        )
                    ) {
                        targets.push(node);
                    }

                    if (isTikzPre(node)) {
                        targets.push(node);
                    }

                    node
                        .querySelectorAll?.(
                            'script[type="text/tikz"]'
                        )
                        ?.forEach(
                            (child) => {
                                targets.push(
                                    child
                                );
                            }
                        );

                    node
                        .querySelectorAll?.(
                            'pre.language-tikzjax, ' +
                            'pre.tikzjax, ' +
                            'pre.language-tikz, ' +
                            'pre.tikz'
                        )
                        ?.forEach(
                            (child) => {
                                targets.push(
                                    child
                                );
                            }
                        );

                    if (
                        isMkDocsTabbedElement(
                            node
                        )
                    ) {
                        scheduleMkDocsTabsRescan();
                    }
                }
            }

            targets.forEach(
                scheduleSourceProcess
            );
        }
    );

    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

    document.addEventListener(
        'change',
        handleMkDocsTabsInteraction,
        true
    );

    document.addEventListener(
        'click',
        handleMkDocsTabsInteraction,
        true
    );

    observeTheme();
    applyThemeToTikz(document);

    window.setTimeout(() => {
        const sources =
            getTikzSources(document);

        if (sources.length) {
            processTikzSources(sources);
        }

        applyThemeToTikz(document);
        scheduleMkDocsTabsRescan();
    }, 300);
};

// =================================================
// SHUTDOWN
// =================================================
const shutdown = async () => {
    shuttingDown = true;

    if (observer) {
        observer.disconnect();
    }

    if (themeObserver) {
        themeObserver.disconnect();
    }

    if (themeRaf !== null) {
        window.cancelAnimationFrame(
            themeRaf
        );

        themeRaf = null;
    }

    if (
        mkDocsTabsRescanTimer !== null
    ) {
        window.clearTimeout(
            mkDocsTabsRescanTimer
        );

        mkDocsTabsRescanTimer = null;
    }

    if (sourceRescanTimer !== null) {
        window.clearTimeout(
            sourceRescanTimer
        );

        sourceRescanTimer = null;
    }

    document.removeEventListener(
        'change',
        handleMkDocsTabsInteraction,
        true
    );

    document.removeEventListener(
        'click',
        handleMkDocsTabsInteraction,
        true
    );

    const slots =
        workerSlots.splice(0);

    await Promise.allSettled(
        slots.map((slot) =>
            terminateWorkerSlot(slot)
        )
    );

    const blobUrlPromises =
        [...workerBlobUrls.values()];

    workerBlobUrls.clear();

    const blobUrls =
        await Promise.allSettled(
            blobUrlPromises
        );

    blobUrls.forEach((result) => {
        if (
            result.status ===
            'fulfilled'
        ) {
            URL.revokeObjectURL(
                result.value
            );
        }
    });
};

// =================================================
// BOOT
// =================================================
if (!window.TikzJax) {
    window.TikzJax = true;

    if (
        document.readyState ===
        'loading'
    ) {
        document.addEventListener(
            'DOMContentLoaded',
            initialize,
            {
                once: true
            }
        );
    } else {
        initialize();
    }

    window.addEventListener(
        'unload',
        shutdown
    );
}
