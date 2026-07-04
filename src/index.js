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

const getOptionsStore = () => {
    if (!isPlainObject(window[TIKZJAX_OPTIONS_STORE_KEY])) {
        window[TIKZJAX_OPTIONS_STORE_KEY] = {};
    }

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

const parseNumberOption = (value, fallback, minimum = Number.NEGATIVE_INFINITY) => {
    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed >= minimum ? parsed : fallback;
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
        console.warn('TikZJax: unable to parse JSON option:', value, error);
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
// TKZ-TAB GLOBAL MACROS
// =================================================
const createTexMacro = (macroName, value) => {
    if (value === undefined || value === null || value === false) {
        return '';
    }

    return `\\def\\${macroName}{${String(value)}}\n`;
};

const getTkzTabPreamble = (options = getOptions()) => {
    const tkzTab = options.tkzTab || {};

    if (!tkzTab || typeof tkzTab !== 'object') {
        return '';
    }

    let preamble = '';

    preamble += '% TikZJax tkz-tab global options\n';

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
        tkzTab.firstColumnWidth ?? tkzTab.lgt
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

    return preamble;
};

const getTexDatasetFromOptions = (options = getOptions()) => {
    const tex = options.tex || {};
    const dataset = {};

    const texPackages = tex.texPackages || options.texPackages;
    const tikzLibraries = tex.tikzLibraries || options.tikzLibraries;
    const addToPreamble = tex.addToPreamble || options.addToPreamble;
    const tkzTabPreamble = getTkzTabPreamble(options);

    if (texPackages) {
        dataset.texPackages = stringifyTexPackages(texPackages);
    }

    if (tikzLibraries) {
        dataset.tikzLibraries = normalizeTikzLibraries(tikzLibraries);
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

    if (typeof value === 'string') {
        const parsed = parseJsonObject(value);

        return Object.keys(parsed).length ? parsed : value;
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

    mergeLocalOptions(parseJsonObject(dataset.options));
    mergeLocalOptions(parseJsonObject(dataset.tikzjaxOptions));

    const texOption = parseJsonObject(dataset.tex);

    if (Object.keys(texOption).length) {
        localOptions.tex = mergeTikzJaxOptions(
            localOptions.tex || {},
            texOption
        );
    }

    if (hasOwn(dataset, 'texPackages')) {
        localOptions.tex = mergeTikzJaxOptions(localOptions.tex || {}, {
            texPackages: normalizeTexPackagesOption(dataset.texPackages)
        });
    }

    if (hasOwn(dataset, 'tikzLibraries')) {
        localOptions.tex = mergeTikzJaxOptions(localOptions.tex || {}, {
            tikzLibraries: normalizeTikzLibrariesOption(dataset.tikzLibraries)
        });
    }

    if (hasOwn(dataset, 'addToPreamble')) {
        localOptions.tex = mergeTikzJaxOptions(localOptions.tex || {}, {
            addToPreamble: dataset.addToPreamble
        });
    }

    const tkzTabOption = parseJsonObject(dataset.tkzTab);

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
        'height'
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

const copyOptionToDataset = (dataset, options, key) => {
    if (hasOwn(options, key)) {
        dataset[key] = options[key];
    }
};

const copyRenderOptionsToDataset = (dataset, options) => {
    const texOptions = options.tex || {};

    if (hasOwn(options, 'renderTimeout')) {
        dataset.renderTimeout = options.renderTimeout;
    } else if (hasOwn(texOptions, 'renderTimeout')) {
        dataset.renderTimeout = texOptions.renderTimeout;
    }

    if (hasOwn(options, 'maxRetries')) {
        dataset.maxRetries = options.maxRetries;
    } else if (hasOwn(texOptions, 'maxRetries')) {
        dataset.maxRetries = texOptions.maxRetries;
    }

    if (hasOwn(options, 'restartWorkerOnFail')) {
        dataset.restartWorkerOnFail = options.restartWorkerOnFail;
    } else if (hasOwn(texOptions, 'restartWorkerOnFail')) {
        dataset.restartWorkerOnFail = texOptions.restartWorkerOnFail;
    }

    copyOptionToDataset(dataset, options, 'brokenImageSrc');
    copyOptionToDataset(dataset, options, 'disableCache');
    copyOptionToDataset(dataset, options, 'width');
    copyOptionToDataset(dataset, options, 'height');
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

    return cleaned;
};

const getTikzDataset = (elt) => {
    const localDataset = cleanInternalDataset(Object.assign({}, elt.dataset || {}));
    const mergedOptions = getMergedOptionsForDataset(localDataset);
    const texDataset = getTexDatasetFromOptions(mergedOptions);

    const dataset = {
        ...texDataset,
        ...cleanLocalDatasetForWorker(localDataset)
    };

    copyRenderOptionsToDataset(dataset, mergedOptions);

    return dataset;
};

// =================================================
// CACHE
// =================================================
const dbPromise = openDB('TikzJax', 2, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('svgImages')) {
            db.createObjectStore('svgImages');
        }
    }
});

const getItem = async (key) =>
    (await dbPromise).get('svgImages', key);

const setItem = async (key, val) =>
    (await dbPromise).put('svgImages', val, key);

// =================================================
// STATE
// =================================================
let texWorker;
let observer;
let themeObserver;
let themeRaf = null;
let mkDocsTabsRescanTimer = null;
let workerBlobUrl = null;

// =================================================
// TIMEOUT / FAILURE SAFETY
// =================================================
const withTimeout = (promise, ms) => {
    let timer;

    const timeout = new Promise((_, reject) => {
        timer = window.setTimeout(() => {
            reject(new Error(`TikZJax render timeout after ${ms}ms`));
        }, ms);
    });

    return Promise.race([promise, timeout]).finally(() => {
        window.clearTimeout(timer);
    });
};

const createDefaultBrokenImageSvg = () => {
    const frag = document.createRange().createContextualFragment(
        '<svg class="tikzjax-broken-image" ' +
        'xmlns="http://www.w3.org/2000/svg" ' +
        'width="75pt" height="75pt" viewBox="0 0 75 75" ' +
        'role="img" aria-label="TikZJax rendering error">' +
        '<path d="M14 10 H50 L63 23 V56 C63 61 60 64 55 64 H20 C16 64 12 61 12 56 V16 C12 13 14 10 18 10 Z" ' +
        'fill="none" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M50 10 V23 H63" ' +
        'fill="none" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round"/>' +
        '<circle cx="26" cy="27" r="6" ' +
        'fill="url(#tikzjax-broken-image-gradient-inline)" stroke="#3b82f6" stroke-width="3"/>' +
        '<path d="M14 56 L29 39 L39 49 L51 35 L63 49" ' +
        'fill="url(#tikzjax-broken-image-gradient-inline)" opacity="0.75" ' +
        'stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M52 50 L66 64 M66 50 L52 64" ' +
        'stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>' +
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

const createBrokenImageElement = (dataset = {}) => {
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
        const fallback = createDefaultBrokenImageSvg();

        fallback.style.marginLeft = 'auto';
        fallback.style.marginRight = 'auto';

        img.replaceWith(fallback);
    };

    return img;
};

const createBrokenImage = (dataset = {}) => {
    const wrapper = document.createElement('span');

    wrapper.className = 'tikzjax-wrapper tikzjax-broken-wrapper mathjax_ignore';

    wrapper.style.display = 'block';
    wrapper.style.width = '100%';
    wrapper.style.minWidth = '75pt';
    wrapper.style.minHeight = '75pt';
    wrapper.style.textAlign = 'center';
    wrapper.style.verticalAlign = 'middle';

    const img = createBrokenImageElement(dataset);

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

    const v = value.trim().toLowerCase();

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

    const v = value.trim().toLowerCase();

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

    const v = value.trim().toLowerCase();

    return (
        v === 'transparent' ||
        v === 'initial' ||
        v === 'inherit' ||
        /^rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0(?:\.0+)?\s*\)$/.test(v) ||
        /^rgba\(.*?,\s*0(?:\.0+)?\s*\)$/.test(v)
    );
};

const getEffectiveBackgroundColor = (element, fallbackTheme = 'light') => {
    let node = element;

    while (node) {
        const computed = window.getComputedStyle(node);
        const backgroundColor = computed.backgroundColor;

        if (backgroundColor && !isTransparentValue(backgroundColor)) {
            return backgroundColor;
        }

        node = node.parentElement;
    }

    return fallbackTheme === 'dark' ? '#000000' : '#ffffff';
};

const isTextNode = (node) => {
    const tag = node?.tagName?.toLowerCase();

    return tag === 'text' || tag === 'tspan';
};

const getTikzWrappers = (root = document) => {
    const wrappers = [];

    if (root instanceof Element && root.matches('.tikzjax-wrapper')) {
        wrappers.push(root);
    }

    root.querySelectorAll?.('.tikzjax-wrapper')
        ?.forEach((wrapper) => wrappers.push(wrapper));

    return [...new Set(wrappers)];
};

const normalizeStyleForTheme = (styleText, node) => {
    if (!styleText) return styleText;

    let result = styleText;

    result = result.replace(
        /fill\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))\b/gi,
        'fill: currentColor'
    );

    result = result.replace(
        /stroke\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))\b/gi,
        'stroke: currentColor'
    );

    result = result.replace(
        /color\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))\b/gi,
        'color: currentColor'
    );

    if (isTextNode(node)) {
        result = result.replace(
            /fill\s*:\s*(white|#ffffff|#fff|rgb\(255,\s*255,\s*255\))\b/gi,
            'fill: currentColor'
        );
    } else {
        result = result.replace(
            /fill\s*:\s*(white|#ffffff|#fff|rgb\(255,\s*255,\s*255\))\b/gi,
            'fill: transparent'
        );
    }

    result = result.replace(
        /stroke\s*:\s*(white|#ffffff|#fff|rgb\(255,\s*255,\s*255\))\b/gi,
        'stroke: var(--tikzjax-background-color)'
    );

    return result;
};

const normalizeSvgForTheme = (svg) => {
    if (!svg || svg.dataset.tikzjaxThemeNormalized === 'true') return;

    svg.dataset.tikzjaxThemeNormalized = 'true';

    svg.classList.add('tikzjax', 'tikz');
    svg.style.color = 'currentColor';

    svg.querySelectorAll('[fill], [stroke], [color], [style]')
        .forEach((node) => {
            if (node.hasAttribute('fill')) {
                const fill = node.getAttribute('fill');

                if (isTextNode(node)) {
                    node.setAttribute('fill', 'currentColor');
                    node.style.setProperty('fill', 'currentColor', 'important');
                } else if (isBlackValue(fill)) {
                    node.setAttribute('fill', 'currentColor');
                } else if (isWhiteValue(fill)) {
                    node.setAttribute('fill', 'transparent');
                }
            }

            if (node.hasAttribute('stroke')) {
                const stroke = node.getAttribute('stroke');

                if (isBlackValue(stroke)) {
                    node.setAttribute('stroke', 'currentColor');
                } else if (isWhiteValue(stroke)) {
                    node.setAttribute('stroke', 'var(--tikzjax-background-color)');
                }
            }

            if (node.hasAttribute('color')) {
                const color = node.getAttribute('color');

                if (isBlackValue(color)) {
                    node.setAttribute('color', 'currentColor');
                }
            }

            if (node.hasAttribute('style')) {
                node.setAttribute(
                    'style',
                    normalizeStyleForTheme(node.getAttribute('style'), node)
                );
            }
        });

    svg.querySelectorAll('text, tspan').forEach((node) => {
        node.setAttribute('fill', 'currentColor');
        node.style.setProperty('fill', 'currentColor', 'important');
        node.style.setProperty('opacity', '1', 'important');
    });
};

const getConfiguredThemeTargets = () => {
    const themeOptions = getThemeOptions();
    const selector = themeOptions.selector;

    if (!selector) return [];

    try {
        return Array.from(document.querySelectorAll(selector));
    } catch (error) {
        console.warn('TikZJax: invalid theme selector:', selector, error);
        return [];
    }
};

const getConfiguredThemeTarget = (wrapper) => {
    const targets = getConfiguredThemeTargets();

    for (const target of targets) {
        if (target === wrapper || target.contains(wrapper)) {
            return target;
        }
    }

    return null;
};

const getThemeFromElement = (element) => {
    if (!element) return null;

    const themeOptions = getThemeOptions();

    const darkClass = themeOptions.darkClass || 'dark';
    const lightClass = themeOptions.lightClass || 'light';

    const attribute = themeOptions.attribute || 'data-theme';
    const darkValue = themeOptions.darkValue || 'dark';
    const lightValue = themeOptions.lightValue || 'light';

    if (attribute && element.hasAttribute(attribute)) {
        const value = element.getAttribute(attribute);

        if (value === darkValue) return 'dark';
        if (value === lightValue) return 'light';
    }

    if (element.classList?.contains(darkClass)) return 'dark';
    if (element.classList?.contains(lightClass)) return 'light';

    if (element.hasAttribute('data-bs-theme')) {
        const value = element.getAttribute('data-bs-theme');

        if (value === 'dark') return 'dark';
        if (value === 'light') return 'light';
    }

    if (element.hasAttribute('data-color-scheme')) {
        const value = element.getAttribute('data-color-scheme');

        if (value === 'dark' || value === 'slate') return 'dark';
        if (value === 'light' || value === 'default') return 'light';
    }

    return null;
};

const getFallbackTheme = () => {
    const themeOptions = getThemeOptions();
    const fallbackTheme = themeOptions.fallbackTheme || themeOptions.defaultTheme;

    if (fallbackTheme === 'dark' || fallbackTheme === 'light') {
        return fallbackTheme;
    }

    if (
        themeOptions.followSystemTheme === true &&
        window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ) {
        return 'dark';
    }

    return 'light';
};

const getThemeForWrapper = (wrapper) => {
    const configuredTarget = getConfiguredThemeTarget(wrapper);
    const configuredTheme = getThemeFromElement(configuredTarget);

    if (configuredTheme) return configuredTheme;

    const themeOptions = getThemeOptions();
    const darkClass = themeOptions.darkClass || 'dark';
    const lightClass = themeOptions.lightClass || 'light';
    const attribute = themeOptions.attribute || 'data-theme';

    let localThemeElement;

    try {
        localThemeElement = wrapper.closest(
            `.${darkClass}, .${lightClass}, [${attribute}], [data-bs-theme], [data-color-scheme]`
        );
    } catch {
        localThemeElement = wrapper.closest(
            '.dark, .light, [data-theme], [data-bs-theme], [data-color-scheme]'
        );
    }

    const localTheme = getThemeFromElement(localThemeElement);

    if (localTheme) return localTheme;

    const bodyTheme = document.body?.getAttribute('data-md-color-scheme');

    if (bodyTheme === 'slate') return 'dark';
    if (bodyTheme) return 'light';

    const bodyClassTheme = getThemeFromElement(document.body);
    if (bodyClassTheme) return bodyClassTheme;

    const htmlClassTheme = getThemeFromElement(document.documentElement);
    if (htmlClassTheme) return htmlClassTheme;

    return getFallbackTheme();
};

const applyThemeToTikz = (root = document) => {
    getTikzWrappers(root).forEach((wrapper) => {
        const theme = getThemeForWrapper(wrapper);
        const isDark = theme === 'dark';
        const backgroundColor = getEffectiveBackgroundColor(wrapper, theme);

        wrapper.style.color = isDark ? '#ffffff' : '#000000';
        wrapper.style.setProperty('--tikzjax-background-color', backgroundColor);

        wrapper.querySelectorAll('svg').forEach((svg) => {
            normalizeSvgForTheme(svg);
        });
    });
};

const scheduleThemeApply = () => {
    if (themeRaf !== null) return;

    themeRaf = window.requestAnimationFrame(() => {
        themeRaf = null;
        applyThemeToTikz(document);
    });
};

const observeTheme = () => {
    if (!document.body) return;

    const themeOptions = getThemeOptions();
    const configuredAttribute = themeOptions.attribute || 'data-theme';

    const attributeFilter = [
        'class',
        'data-theme',
        'data-bs-theme',
        'data-color-scheme',
        'data-md-color-scheme'
    ];

    if (configuredAttribute && !attributeFilter.includes(configuredAttribute)) {
        attributeFilter.push(configuredAttribute);
    }

    const observedTargets = new Set([
        document.body,
        document.documentElement,
        ...getConfiguredThemeTargets()
    ]);

    themeObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (
                mutation.type === 'attributes' &&
                attributeFilter.includes(mutation.attributeName)
            ) {
                scheduleThemeApply();
                return;
            }
        }
    });

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
    const width = parseFloat(dataset.width) || 75;
    const height = parseFloat(dataset.height) || 75;
    const radius = Math.min(width, height) * 0.2;

    const frag = document.createRange().createContextualFragment(
        '<svg class="tikzjax-loader" version="1.1" ' +
        'xmlns="http://www.w3.org/2000/svg" ' +
        'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
        `width="${width}pt" height="${height}pt" viewBox="0 0 ${width} ${height}">` +
        `<rect width="${width}" height="${height}" rx="5pt" ry="5pt" ` +
        'fill="#000" fill-opacity="0.2"/>' +
        `<circle cx="${width / 2}" cy="${height / 2}" r="${radius}" ` +
        'stroke="#f3f3f3" fill="none" stroke-width="3"/>' +
        `<circle cx="${width / 2}" cy="${height / 2}" r="${radius}" ` +
        'stroke="#3498db" fill="none" stroke-width="3" stroke-linecap="round">' +
        '<animate attributeName="stroke-dasharray" begin="0s" dur="2s" ' +
        'values="56.5 37.7;1 93.2;56.5 37.7" keyTimes="0;0.5;1" repeatCount="indefinite">' +
        '</animate>' +
        '<animate attributeName="stroke-dashoffset" begin="0s" dur="2s" ' +
        'from="0" to="188.5" repeatCount="indefinite"></animate>' +
        '</circle>' +
        '</svg>'
    );

    return frag.firstChild;
};

// =================================================
// SOURCES
// =================================================
const isTikzPre = (node) => {
    if (!node || node.nodeType !== 1) return false;

    if (node.tagName !== 'PRE') return false;

    return (
        node.classList.contains('language-tikzjax') ||
        node.classList.contains('tikzjax') ||
        node.classList.contains('language-tikz') ||
        node.classList.contains('tikz')
    );
};

const getTikzSources = (root = document) => {
    const sources = [];

    if (
        root instanceof Element &&
        root.matches('script[type="text/tikz"]')
    ) {
        sources.push(root);
    }

    if (
        root instanceof Element &&
        isTikzPre(root)
    ) {
        sources.push(root);
    }

    root.querySelectorAll?.('script[type="text/tikz"]')
        ?.forEach((source) => sources.push(source));

    root.querySelectorAll?.('pre.language-tikzjax, pre.tikzjax, pre.language-tikz, pre.tikz')
        ?.forEach((source) => sources.push(source));

    return [...new Set(sources)]
        .filter((el) => !el.dataset?.tikzjaxProcessed);
};

// =================================================
// TEXT EXTRACTION
// =================================================
const decodeHtmlEntities = (text) => {
    let decoded = String(text || '');

    for (let i = 0; i < 3; i += 1) {
        if (!decoded.includes('&')) {
            return decoded;
        }

        const textarea = document.createElement('textarea');

        textarea.innerHTML = decoded;

        const next = textarea.value;

        if (next === decoded) {
            return decoded;
        }

        decoded = next;
    }

    return decoded;

};

const cleanMkDocsMaterialTextArtifacts = (text) => {
    let cleaned = decodeHtmlEntities(text);

    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    cleaned = cleaned.replace(/<\/?p\b[^>]*>/gi, '\n');

    cleaned = cleaned.replace(
        /<span\b[^>]*class=(["'])[^"']*\barithmatex\b[^"']*\1[^>]*>\s*\\\(([\s\S]*?)\\\)\s*<\/span>/gi,
        (_match, _quote, math) => `$${math}$`
    );

    cleaned = cleaned.replace(
        /<span\b[^>]*class=(["'])[^"']*\barithmatex\b[^"']*\1[^>]*>\s*\\\[([\s\S]*?)\\\]\s*<\/span>/gi,
        (_match, _quote, math) => `$$${math}$$`
    );

    cleaned = cleaned.replace(
        /<span\b[^>]*class=(["'])[^"']*\barithmatex\b[^"']*\1[^>]*>\s*([\s\S]*?)\s*<\/span>/gi,
        (_match, _quote, math) => math
    );

    cleaned = cleaned.replace(/<\/?span\b[^>]*>/gi, '');

    cleaned = cleaned.replace(
        /\\\(([\s\S]*?)\\\)/g,
        (_match, math) => `$${math}$`
    );

    cleaned = cleaned.replace(
        /\\\[([\s\S]*?)\\\]/g,
        (_match, math) => `$$${math}$$`
    );

    return decodeHtmlEntities(cleaned);

};

const normalizeTikzSourceText = (text) => {
    const raw = String(text || '').replace(/\r\n?/g, '\n');
    const trimmed = raw.trim();

    if (!trimmed) return '';

    const lines = trimmed.split('\n');

    const indents = lines
        .filter((line) => line.trim())
        .map((line) => {
            const match = line.match(/^[ \t]*/);
            return match ? match[0].length : 0;
        });

    const minIndent = indents.length ? Math.min(...indents) : 0;

    return lines
        .map((line) => line.slice(minIndent))
        .join('\n')
        .trim();
};

const getTikzSourceText = (elt) => {
    if (!elt) return '';

    if (elt.tagName === 'SCRIPT') {
        return normalizeTikzSourceText(
            cleanMkDocsMaterialTextArtifacts(elt.textContent || '')
        );
    }

    const code = elt.querySelector('code');

    return normalizeTikzSourceText(code ? code.textContent : elt.textContent || '');

};

// =================================================
// MKDOCS MATERIAL CONTENT TABS SUPPORT
// =================================================
const isMkDocsTabbedElement = (node) => {
    if (!node || node.nodeType !== 1) return false;

    return (
        node.matches?.('.tabbed-set, .tabbed-content, .tabbed-block') ||
        Boolean(node.closest?.('.tabbed-set')) ||
        Boolean(node.querySelector?.('.tabbed-set, .tabbed-content, .tabbed-block'))
    );
};

const scheduleMkDocsTabsRescan = (delay = 80) => {
    if (mkDocsTabsRescanTimer !== null) return;

    mkDocsTabsRescanTimer = window.setTimeout(() => {
        mkDocsTabsRescanTimer = null;

        const sources = getTikzSources(document);

        if (sources.length) {
            processTikzSources(sources);
        }

        applyThemeToTikz(document);
    }, delay);
};

const handleMkDocsTabsInteraction = (event) => {
    const target = event.target;

    if (
        target?.matches?.('.tabbed-set input[type="radio"]') ||
        target?.closest?.('.tabbed-set label, .tabbed-set [role="tab"], .tabbed-label')
    ) {
        scheduleMkDocsTabsRescan();
    }
};

// =================================================
// SVG WRAPPER
// =================================================
const wrapSvg = (svg) => {
    const wrapper = document.createElement('span');
    wrapper.className = 'tikzjax-wrapper mathjax_ignore';

    wrapper.appendChild(svg);

    applyThemeToTikz(wrapper);

    return wrapper;
};

// =================================================
// WORKER
// =================================================
const getWorkerOptions = () => {
    const options = getOptions();
    const workerOptions = options.worker || {};

    const configuredWorkerUrl =
        options.workerUrl ||
        workerOptions.url ||
        'run-tex.js';

    const configuredWorkerMode =
        options.workerMode ||
        workerOptions.mode ||
        'auto';

    const workerMode = String(configuredWorkerMode).toLowerCase();

    if (!['auto', 'direct', 'blob'].includes(workerMode)) {
        console.warn(
            `TikZJax: invalid workerMode "${configuredWorkerMode}". Falling back to "auto".`
        );
    }

    return {
        workerUrl: resolveAssetUrl(configuredWorkerUrl),
        workerMode: ['auto', 'direct', 'blob'].includes(workerMode) ? workerMode : 'auto'
    };
};

const isSameOriginUrl = (value) =>
    new URL(value, document.baseURI).origin === window.location.origin;

const createDirectWorker = (workerUrl) =>
    new Worker(workerUrl);

const createBlobWorker = async (workerUrl) => {
    const response = await fetch(workerUrl);

    if (!response.ok) {
        throw new Error(
            `TikZJax: unable to load worker ${workerUrl}: ${response.status} ${response.statusText}`
        );
    }

    const workerSource = await response.text();

    if (workerBlobUrl) {
        URL.revokeObjectURL(workerBlobUrl);
    }

    workerBlobUrl = URL.createObjectURL(
        new Blob([workerSource], { type: 'application/javascript' })
    );

    return new Worker(workerBlobUrl);
};

const createWorker = async () => {
    const { workerUrl, workerMode } = getWorkerOptions();

    if (workerMode === 'direct') {
        return createDirectWorker(workerUrl);
    }

    if (workerMode === 'blob') {
        return createBlobWorker(workerUrl);
    }

    if (isSameOriginUrl(workerUrl)) {
        return createDirectWorker(workerUrl);
    }

    return createBlobWorker(workerUrl);
};

const initializeWorker = async () => {
    const root = assetBaseUrl;

    const tex = await spawn(await createWorker());

    Thread.events(tex).subscribe((event) => {
        if (event.type === 'message' && typeof event.data === 'string') {
            console.log(event.data);
        }
    });

    await tex.load(root);

    return tex;
};

const restartWorker = async () => {
    const oldWorker = texWorker;

    texWorker = initializeWorker();

    try {
        if (oldWorker) {
            await Thread.terminate(await oldWorker);
        }
    } catch (error) {
        console.warn('TikZJax: unable to terminate failed worker:', error);
    }

    texWorker = await texWorker;

    return texWorker;
};

// =================================================
// ENGINE
// =================================================
const processTikzSources = async (sources) => {
    const queue = [];

    const load = async (elt) => {
        const text = getTikzSourceText(elt);

        elt.tikzjaxText = text;
        elt.tikzjaxDataset = getTikzDataset(elt);
        elt.dataset.tikzjaxProcessed = 'true';

        const container =
            elt.closest('pre.language-tikzjax') ||
            elt.closest('pre.tikzjax') ||
            elt.closest('pre.language-tikz') ||
            elt.closest('pre.tikz') ||
            elt.closest('script') ||
            elt;

        const loader = createLoader(elt.tikzjaxDataset || elt.dataset || {});

        const wrapper = document.createElement('span');
        wrapper.className = 'tikzjax-wrapper tikzjax-loading mathjax_ignore';
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.verticalAlign = 'middle';
        wrapper.style.minWidth = `${parseFloat(elt.tikzjaxDataset?.width) || 75}pt`;
        wrapper.style.minHeight = `${parseFloat(elt.tikzjaxDataset?.height) || 75}pt`;

        container.replaceWith(wrapper);
        wrapper.appendChild(loader);

        applyThemeToTikz(wrapper);

        elt.tikzjaxLoader = wrapper;

        queue.push(elt);
    };

    const failRender = async (elt, error) => {
        console.warn('TikZJax rendering failed:', error);

        const brokenImage = createBrokenImage(elt.tikzjaxDataset || {});

        if (elt.tikzjaxLoader) {
            elt.tikzjaxLoader.replaceWith(brokenImage);
        }

        if (shouldRestartWorkerOnFail(elt.tikzjaxDataset || {})) {
            await restartWorker();
        }
    };

    const renderWithSafety = async (text, dataset) => {
        const timeout = getRenderTimeout(dataset);

        return withTimeout(
            texWorker.texify(text, dataset),
            timeout
        );
    };

    const process = async (elt) => {
        const text = elt.tikzjaxText;
        const dataset = elt.tikzjaxDataset || {};
        const cacheKey = JSON.stringify(dataset) + '\n' + text;

        try {
            const cached = parseBooleanOption(dataset.disableCache, false) ? undefined : await getItem(cacheKey);

            let html;

            if (cached) {
                html = cached;
            } else {
                let lastError = null;
                const maxRetries = getMaxRetries(dataset);

                for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
                    try {
                        html = await renderWithSafety(text, dataset);
                        break;
                    } catch (error) {
                        lastError = error;

                        if (attempt < maxRetries && shouldRestartWorkerOnFail(dataset)) {
                            await restartWorker();
                        }
                    }
                }

                if (!html) {
                    throw lastError || new Error('TikZJax rendering failed.');
                }

                if (!parseBooleanOption(dataset.disableCache, false)) {
                    await setItem(cacheKey, html);
                }
            }

            const svg = document
                .createRange()
                .createContextualFragment(html)
                .firstChild;

            if (!svg) {
                throw new Error('TikZJax: texify returned empty output.');
            }

            elt.tikzjaxLoader.replaceWith(wrapSvg(svg));

            applyThemeToTikz(document);

            svg.dispatchEvent(
                new Event('tikzjax-load-finished', { bubbles: true })
            );
        } catch (error) {
            await failRender(elt, error);
        }
    };

    for (const source of sources) {
        await load(source);
    }

    if (!queue.length) return;

    texWorker = await texWorker;

    for (const elt of queue) {
        await process(elt);
    }
};

// =================================================
// INIT
// =================================================
const initialize = async () => {
    texWorker = texWorker || initializeWorker();

    const schedule = new Set();

    const scheduleProcess = (node) => {
        schedule.add(node);

        setTimeout(() => {
            processTikzSources([...schedule]);
            schedule.clear();
        }, 50);
    };

    const boot = () => {
        processTikzSources(getTikzSources(document));
        applyThemeToTikz(document);
        scheduleMkDocsTabsRescan();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    observer = new MutationObserver((mutations) => {
        const targets = [];

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!node || node.nodeType !== 1) continue;

                if (node.matches?.('script[type="text/tikz"]')) {
                    targets.push(node);
                }

                if (isTikzPre(node)) {
                    targets.push(node);
                }

                node.querySelectorAll?.('script[type="text/tikz"]')
                    ?.forEach((child) => targets.push(child));

                node.querySelectorAll?.('pre.language-tikzjax, pre.tikzjax, pre.language-tikz, pre.tikz')
                    ?.forEach((child) => targets.push(child));

                if (isMkDocsTabbedElement(node)) {
                    scheduleMkDocsTabsRescan();
                }
            }
        }

        if (targets.length) {
            targets.forEach(scheduleProcess);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.addEventListener('change', handleMkDocsTabsInteraction, true);
    document.addEventListener('click', handleMkDocsTabsInteraction, true);

    observeTheme();
    applyThemeToTikz(document);

    setTimeout(() => {
        processTikzSources(getTikzSources(document));
        applyThemeToTikz(document);
        scheduleMkDocsTabsRescan();
    }, 300);
};

// =================================================
// SHUTDOWN
// =================================================
const shutdown = async () => {
    if (observer) {
        observer.disconnect();
    }

    if (themeObserver) {
        themeObserver.disconnect();
    }

    if (themeRaf !== null) {
        window.cancelAnimationFrame(themeRaf);
        themeRaf = null;
    }

    if (mkDocsTabsRescanTimer !== null) {
        window.clearTimeout(mkDocsTabsRescanTimer);
        mkDocsTabsRescanTimer = null;
    }

    document.removeEventListener('change', handleMkDocsTabsInteraction, true);
    document.removeEventListener('click', handleMkDocsTabsInteraction, true);

    if (texWorker) {
        await Thread.terminate(await texWorker);
    }

    if (workerBlobUrl) {
        URL.revokeObjectURL(workerBlobUrl);
        workerBlobUrl = null;
    }
};

// =================================================
// BOOT
// =================================================
if (!window.TikzJax) {
    window.TikzJax = true;

    texWorker = initializeWorker();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    window.addEventListener('unload', shutdown);
}