import { Worker, spawn, Thread } from 'threads';
import { openDB } from 'idb';
import '../css/container.css';

// document.currentScript polyfill
if (document.currentScript === undefined) {
    const scripts = document.getElementsByTagName('script');
    document.currentScript = scripts[scripts.length - 1];
}

// Determine where this script was loaded from. This is used to find the files to load.
const url = new URL(document.currentScript.src);

const dbPromise = openDB('TikzJax', 2, {
    upgrade(db) {
        db.createObjectStore('svgImages');
    }
});
const getItem = async (key) => (await dbPromise).get('svgImages', key);
const setItem = async (key, val) => (await dbPromise).put('svgImages', val, key);

const createHash = async (string) => {
    return Array.from(new Uint8Array(await window.crypto.subtle.digest('SHA-1', new TextEncoder().encode(string))))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
};

const processQueue = [];
let observer = null;
let texWorker;

const processTikzScripts = async (scripts) => {
    const currentProcessPromise = new Promise((resolve) => {
        const texQueue = [];

        const loadCachedOrSetupLoader = async (elt) => {
            elt.sourceHash = await createHash(JSON.stringify(elt.dataset) + elt.childNodes[0].nodeValue);

            const savedSVG = elt.dataset.disableCache ? undefined : await getItem(elt.sourceHash);

            if (savedSVG) {
                const svg = document.createRange().createContextualFragment(savedSVG).firstChild;
                elt.replaceWith(svg);

                // Emit a bubbling event that the svg is ready.
                const loadFinishedEvent = new Event('tikzjax-load-finished', { bubbles: true });
                svg.dispatchEvent(loadFinishedEvent);
            } else {
                texQueue.push(elt);

                const width = parseFloat(elt.dataset.width) || 75;
                const height = parseFloat(elt.dataset.height) || 75;

                // Replace the elt with a spinning loader.
                elt.loader = document
                    .createRange()
                    .createContextualFragment(
                        '<svg version="1.1" ' +
                            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
                            `width="${width}pt" height="${height}pt" viewBox="0 0 ${width} ${height}">` +
                            `<rect width="${width}" height="${height}" rx="5pt" ry="5pt" ` +
                            'fill="#000" fill-opacity="0.2"/>' +
                            `<circle cx="${width / 2}" cy="${height / 2}" r="15" stroke="#f3f3f3" ` +
                            'fill="none" stroke-width="3"/>' +
                            `<circle cx="${width / 2}" cy="${height / 2}" r="15" stroke="#3498db" ` +
                            'fill="none" stroke-width="3" stroke-linecap="round">' +
                            '<animate attributeName="stroke-dasharray" begin="0s" dur="2s" ' +
                            'values="56.5 37.7;1 93.2;56.5 37.7" keyTimes="0;0.5;1" repeatCount="indefinite">' +
                            '</animate>' +
                            '<animate attributeName="stroke-dashoffset" begin="0s" dur="2s" ' +
                            'from="0" to="188.5" repeatCount="indefinite"></animate></circle>' +
                            '</svg>'
                    ).firstChild;
                elt.replaceWith(elt.loader);
            }
        };

        const process = async (elt) => {
            const text = elt.childNodes[0].nodeValue;
            const loader = elt.loader;

            // Check for a saved svg again in case this script tag is a duplicate of another.
            const savedSVG = elt.dataset.disableCache ? undefined : await getItem(elt.sourceHash);

            if (savedSVG) {
                const svg = document.createRange().createContextualFragment(savedSVG).firstChild;
                loader.replaceWith(svg);

                // Emit a bubbling event that the svg is ready.
                const loadFinishedEvent = new Event('tikzjax-load-finished', { bubbles: true });
                svg.dispatchEvent(loadFinishedEvent);

                return;
            }

            let html = '';
            try {
                html = await texWorker.texify(text, Object.assign({}, elt.dataset));
            } catch (err) {
                console.log(err);
                // Show the browser's image not found icon.
                loader.outerHTML = '<img src="//invalid.site/img-not-found.png">';
                return;
            }

            const ids = html.match(/\bid="pgf[^"]*"/g);
            if (ids) {
                // Sort the ids from longest to shortest.
                ids.sort((a, b) => {
                    return b.length - a.length;
                });
                for (const id of ids) {
                    const pgfIdString = id.replace(/id="pgf(.*)"/, '$1');
                    html = html.replaceAll('pgf' + pgfIdString, `pgf${elt.sourceHash}${pgfIdString}`);
                }
            }

            const svg = document.createRange().createContextualFragment(html).firstChild;
            svg.role = 'img';
            svg.classList.add("tikz");
            svg.classList.add("tikzjax");

            if (elt.dataset.ariaLabel) {
                const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
                title.textContent = elt.dataset.ariaLabel;
                svg.prepend(title);
            }

            loader.replaceWith(svg);

            if (!elt.dataset.disableCache) {
                try {
                    await setItem(elt.sourceHash, svg.outerHTML);
                } catch (err) {
                    console.log(err);
                }
            }

            // Emit a bubbling event that the svg image generation is complete.
            const loadFinishedEvent = new Event('tikzjax-load-finished', { bubbles: true });
            svg.dispatchEvent(loadFinishedEvent);
        };

        (async () => {
            // First check the session storage to see if an image is already cached,
            // and if so load that.  Otherwise show a spinning loader, and push the
            // element onto the queue to run tex on.
            for (const element of scripts) {
                await loadCachedOrSetupLoader(element);
            }

            // End here if there is nothing to run tex on.
            if (!texQueue.length) return resolve();

            texWorker = await texWorker;

            processQueue.push(currentProcessPromise);
            if (processQueue.length > 1) await processQueue[processQueue.length - 2];

            // Run tex on the text in each of the scripts that wasn't cached.
            for (const element of texQueue) {
                await process(element);
            }

            processQueue.shift();

            return resolve();
        })();
    });
    return currentProcessPromise;
};

const initializeWorker = async () => {
    const urlRoot = url.href.replace(/\/tikzjax\.js(?:\?.*)?$/, '');

    // Set up the worker thread.
    const tex = await spawn(new Worker(`${urlRoot}/run-tex.js`));
    Thread.events(tex).subscribe((e) => {
        if (e.type == 'message' && typeof e.data === 'string') console.log(e.data);
    });

    // Load the assembly and core dump.
    try {
        await tex.load(urlRoot);
    } catch (err) {
        console.log(err);
    }

    return tex;
};

const initialize = async () => {
    // Process any text/tikz scripts that are on the page initially.
    processTikzScripts(
        Array.prototype.slice
            .call(document.getElementsByTagName('script'))
            .filter((e) => e.getAttribute('type') === 'text/tikz')
    );

    // If a text/tikz script is added to the page later, then process those.
    observer = new MutationObserver((mutationsList) => {
        const newTikzScripts = [];
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.tagName && node.tagName.toLowerCase() == 'script' && node.type == 'text/tikz')
                    newTikzScripts.push(node);
                else if (node.getElementsByTagName)
                    newTikzScripts.push.apply(
                        newTikzScripts,
                        Array.prototype.slice
                            .call(node.getElementsByTagName('script'))
                            .filter((e) => e.getAttribute('type') === 'text/tikz')
                    );
            }
        }
        processTikzScripts(newTikzScripts);
    });
    observer.observe(document.getElementsByTagName('body')[0], { childList: true, subtree: true });
};

const shutdown = async () => {
    if (observer) observer.disconnect();
    await Thread.terminate(await texWorker);
};

if (!window.TikzJax) {
    window.TikzJax = true;

    texWorker = initializeWorker();

    if (document.readyState == 'complete') initialize();
    else window.addEventListener('load', initialize);

    // Stop the mutation observer and close the thread when the window is closed.
    window.addEventListener('unload', shutdown);
}
