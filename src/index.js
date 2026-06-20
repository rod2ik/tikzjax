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

const url = new URL(document.currentScript.src);

// =================================================
// OPTIONS
// =================================================
const getOptions = () => window.TikzJaxOptions || {};

const getThemeOptions = () => {
    const options = getOptions();

    return options.theme || {};
};

const parseJsonObject = (value) => {
    if (!value) return {};

    if (typeof value === 'object') return value;

    try {
        return JSON.parse(value);
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

const getGlobalTexDataset = () => {
    const options = getOptions();
    const tex = options.tex || {};
    const dataset = {};

    const texPackages = tex.texPackages || options.texPackages;
    const tikzLibraries = tex.tikzLibraries || options.tikzLibraries;
    const addToPreamble = tex.addToPreamble || options.addToPreamble;

    if (texPackages) {
        dataset.texPackages = stringifyTexPackages(texPackages);
    }

    if (tikzLibraries) {
        dataset.tikzLibraries = normalizeTikzLibraries(tikzLibraries);
    }

    if (addToPreamble) {
        dataset.addToPreamble = addToPreamble;
    }

    return dataset;
};

const mergeTexPackages = (globalPackages, localPackages) => {
    const globalObject = parseJsonObject(globalPackages);
    const localObject = parseJsonObject(localPackages);

    const merged = {
        ...globalObject,
        ...localObject
    };

    return Object.keys(merged).length ? JSON.stringify(merged) : undefined;
};

const mergeTikzLibraries = (globalLibraries, localLibraries) => {
    const libraries = [];

    const appendLibraries = (value) => {
        if (!value) return;

        String(value)
            .split(',')
            .map((library) => library.trim())
            .filter(Boolean)
            .forEach((library) => {
                if (!libraries.includes(library)) {
                    libraries.push(library);
                }
            });
    };

    appendLibraries(globalLibraries);
    appendLibraries(localLibraries);

    return libraries.length ? libraries.join(',') : undefined;
};

const cleanInternalDataset = (dataset) => {
    const cleaned = { ...dataset };

    delete cleaned.tikzjaxProcessed;

    return cleaned;
};

const getTikzDataset = (elt) => {
    const globalDataset = getGlobalTexDataset();
    const localDataset = cleanInternalDataset(Object.assign({}, elt.dataset || {}));

    const dataset = {
        ...globalDataset,
        ...localDataset
    };

    const texPackages = mergeTexPackages(
        globalDataset.texPackages,
        localDataset.texPackages
    );

    if (texPackages) {
        dataset.texPackages = texPackages;
    }

    const tikzLibraries = mergeTikzLibraries(
        globalDataset.tikzLibraries,
        localDataset.tikzLibraries
    );

    if (tikzLibraries) {
        dataset.tikzLibraries = tikzLibraries;
    }

    if (globalDataset.addToPreamble || localDataset.addToPreamble) {
        dataset.addToPreamble =
            (globalDataset.addToPreamble || '') +
            (localDataset.addToPreamble || '');
    }

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

const getThemeForWrapper = (wrapper) => {
    const configuredTarget = getConfiguredThemeTarget(wrapper);
    const configuredTheme = getThemeFromElement(configuredTarget);

    if (configuredTheme) return configuredTheme;

    const themeOptions = getThemeOptions();
    const darkClass = themeOptions.darkClass || 'dark';
    const lightClass = themeOptions.lightClass || 'light';
    const attribute = themeOptions.attribute || 'data-theme';

    let localThemeElement = null;

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

    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
};

const applyThemeToTikz = (root = document) => {
    getTikzWrappers(root).forEach((wrapper) => {
        const isDark = getThemeForWrapper(wrapper) === 'dark';

        wrapper.style.color = isDark ? '#ffffff' : '#000000';

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

    const observedTargets = new Set([
        document.body,
        document.documentElement,
        ...getConfiguredThemeTargets()
    ]);

    themeObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (
                mutation.type === 'attributes' &&
                (
                    mutation.attributeName === 'class' ||
                    mutation.attributeName === 'data-theme' ||
                    mutation.attributeName === 'data-bs-theme' ||
                    mutation.attributeName === 'data-color-scheme' ||
                    mutation.attributeName === 'data-md-color-scheme'
                )
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
            attributeFilter: [
                'class',
                'data-theme',
                'data-bs-theme',
                'data-color-scheme',
                'data-md-color-scheme'
            ]
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
const getTikzSourceText = (elt) => {
    if (!elt) return '';

    if (elt.tagName === 'SCRIPT') {
        return elt.textContent || '';
    }

    const code = elt.querySelector('code');

    return (code ? code.textContent : elt.textContent || '').trim();
};

// =================================================
// SVG WRAPPER
// =================================================
const wrapSvg = (svg) => {
    const wrapper = document.createElement('span');
    wrapper.className = 'tikzjax-wrapper';

    wrapper.appendChild(svg);

    applyThemeToTikz(wrapper);

    return wrapper;
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

        const loader = createLoader(elt.dataset || {});

        const wrapper = document.createElement('span');
        wrapper.className = 'tikzjax-wrapper tikzjax-loading';
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.verticalAlign = 'middle';
        wrapper.style.minWidth = `${parseFloat(elt.dataset.width) || 75}pt`;
        wrapper.style.minHeight = `${parseFloat(elt.dataset.height) || 75}pt`;

        container.replaceWith(wrapper);
        wrapper.appendChild(loader);

        applyThemeToTikz(wrapper);

        elt.tikzjaxLoader = wrapper;

        queue.push(elt);
    };

    const process = async (elt) => {
        const text = elt.tikzjaxText;
        const dataset = elt.tikzjaxDataset || {};
        const cacheKey = JSON.stringify(dataset) + '\n' + text;

        const cached = dataset.disableCache ? undefined : await getItem(cacheKey);

        let html;

        if (cached) {
            html = cached;
        } else {
            html = await texWorker.texify(text, dataset);

            if (!dataset.disableCache) {
                await setItem(cacheKey, html);
            }
        }

        const svg = document
            .createRange()
            .createContextualFragment(html)
            .firstChild;

        elt.tikzjaxLoader.replaceWith(wrapSvg(svg));

        applyThemeToTikz(document);

        svg.dispatchEvent(
            new Event('tikzjax-load-finished', { bubbles: true })
        );
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
// WORKER
// =================================================
const initializeWorker = async () => {
    const root = url.href.replace(/\/tikzjax\.js(?:\?.*)?$/, '');

    const tex = await spawn(new Worker(`${root}/run-tex.js`));

    Thread.events(tex).subscribe((event) => {
        if (event.type === 'message' && typeof event.data === 'string') {
            console.log(event.data);
        }
    });

    await tex.load(root);

    return tex;
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

    observeTheme();
    applyThemeToTikz(document);

    setTimeout(() => {
        processTikzSources(getTikzSources(document));
        applyThemeToTikz(document);
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

    if (texWorker) {
        await Thread.terminate(await texWorker);
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