import { dvi2html } from '@rod2ik/dvi2html';
import { expose } from 'threads/worker';
import pako from 'pako';
import { Buffer } from 'buffer';
import { Writable } from 'stream-browserify';
import * as library from './library.js';

// =================================================
// ENGINE STATE
// =================================================
let coredump;
let wasmModule;
let urlRoot;

// Cache local au worker. Les fichiers TeX décompressés restent disponibles
// entre plusieurs compilations, même après le nettoyage du système de fichiers
// virtuel de TeX.
const decompressedFileCache = new Map();

// =================================================
// BYTE HELPERS
// =================================================
const toUint8Array = (value) => {
    if (value instanceof Uint8Array) {
        return value;
    }

    if (value instanceof ArrayBuffer) {
        return new Uint8Array(value);
    }

    if (ArrayBuffer.isView(value)) {
        return new Uint8Array(
            value.buffer,
            value.byteOffset,
            value.byteLength
        );
    }

    return Uint8Array.from(value || []);
};

const cloneBytes = (value) => {
    return toUint8Array(value).slice();
};

// =================================================
// URL HELPERS
// =================================================
const normalizeUrlRoot = (value) => {
    return String(value || '').replace(/\/+$/, '');
};

const resolveFileUrl = (file) => {
    if (!urlRoot) {
        throw new Error(
            'TikZJax: worker asset root has not been initialized.'
        );
    }

    const normalizedFile = String(file || '').replace(/^\/+/, '');

    return new URL(
        normalizedFile,
        `${urlRoot}/`
    ).href;
};

// =================================================
// OPTIONAL TIMINGS
// =================================================
const shouldLogTimings = (dataset = {}) => {
    return (
        dataset.debugTimings === true ||
        dataset.debugTimings === 'true' ||
        dataset.showTimings === true ||
        dataset.showTimings === 'true'
    );
};

const measure = async (label, enabled, callback) => {
    if (!enabled) {
        return callback();
    }

    const startedAt = performance.now();

    try {
        return await callback();
    } finally {
        const duration = performance.now() - startedAt;

        console.log(
            `[TikZJax timing] ${label}: ${duration.toFixed(1)} ms`
        );
    }
};

// =================================================
// DOWNLOAD + DECOMPRESSION
// =================================================
const decompressArrayBuffer = (arrayBuffer, file) => {
    try {
        return cloneBytes(
            pako.ungzip(
                new Uint8Array(arrayBuffer)
            )
        );
    } catch (error) {
        throw new Error(
            `Unable to decompress ${file}: ` +
            `${error.message || error}`,
            {
                cause: error
            }
        );
    }
};

const fetchAndDecompress = async (file) => {
    const url = resolveFileUrl(file);
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Unable to load ${file} from ${url}. ` +
            `HTTP ${response.status} ` +
            `${response.statusText || ''}`.trim()
        );
    }

    if (!response.body) {
        return decompressArrayBuffer(
            await response.arrayBuffer(),
            file
        );
    }

    const reader = response.body.getReader();
    const inflate = new pako.Inflate();

    try {
        while (true) {
            const {
                done,
                value
            } = await reader.read();

            if (done) {
                break;
            }

            inflate.push(value, false);

            if (inflate.err) {
                throw new Error(
                    inflate.msg ||
                    String(inflate.err)
                );
            }
        }

        if (!inflate.ended) {
            inflate.push(
                new Uint8Array(0),
                true
            );
        }

        if (inflate.err) {
            throw new Error(
                inflate.msg ||
                String(inflate.err)
            );
        }

        if (!inflate.result) {
            throw new Error(
                'The decompressor returned no data.'
            );
        }

        return cloneBytes(inflate.result);
    } catch (error) {
        try {
            await reader.cancel(error);
        } catch {
            // Ignore errors raised while cancelling the stream.
        }

        throw new Error(
            `Unable to decompress ${file} from ${url}: ` +
            `${error.message || error}`,
            {
                cause: error
            }
        );
    } finally {
        try {
            reader.releaseLock();
        } catch {
            // The reader may already have been released.
        }
    }
};

// =================================================
// RUNTIME TEX FILE CACHE
// =================================================
const loadDecompress = async (file) => {
    const url = resolveFileUrl(file);

    let pending =
        decompressedFileCache.get(url);

    if (!pending) {
        pending = fetchAndDecompress(file)
            .catch((error) => {
                decompressedFileCache.delete(url);
                throw error;
            });

        decompressedFileCache.set(
            url,
            pending
        );
    }

    const cachedBytes = await pending;

    // Une copie est retournée afin que le système de fichiers virtuel puisse
    // modifier ses octets sans altérer le cache conservé par le worker.
    return cachedBytes.slice();
};

// =================================================
// TEX LOG
// =================================================
const readTexLog = () => {
    try {
        return Buffer
            .from(
                library.readFileSync(
                    'input.log'
                )
            )
            .toString();
    } catch {
        return 'No TeX log file was available.';
    }
};

// =================================================
// VIRTUAL FILESYSTEM CLEANUP
// =================================================
const cleanVirtualFileSystem = () => {
    try {
        library.deleteEverything();
    } catch (error) {
        console.warn(
            'TikZJax: unable to clean the TeX virtual filesystem.',
            error
        );
    }
};

// =================================================
// TEX PACKAGE OPTIONS
// =================================================
const isPlainObject = (value) => {
    return Object.prototype
        .toString
        .call(value) === '[object Object]';
};

const parseTexPackages = (value) => {
    if (!value) {
        return {};
    }

    if (isPlainObject(value)) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.reduce(
            (result, packageName) => {
                const name =
                    String(
                        packageName || ''
                    ).trim();

                if (name) {
                    result[name] = '';
                }

                return result;
            },
            {}
        );
    }

    if (typeof value === 'string') {
        try {
            const parsed =
                JSON.parse(value);

            if (isPlainObject(parsed)) {
                return parsed;
            }

            if (Array.isArray(parsed)) {
                return parseTexPackages(
                    parsed
                );
            }
        } catch {
            // Allow simple data-tex-packages="physics,tkz-tab" syntax.
        }

        return value
            .split(',')
            .map((packageName) =>
                packageName.trim()
            )
            .filter(Boolean)
            .reduce(
                (
                    result,
                    packageName
                ) => {
                    result[packageName] = '';
                    return result;
                },
                {}
            );
    }

    return {};
};

const buildUsePackagePreamble = (
    texPackages = {}
) => {
    return Object
        .entries(texPackages)
        .map(
            (
                [
                    packageName,
                    options
                ]
            ) => {
                const normalizedName =
                    String(
                        packageName || ''
                    ).trim();

                if (!normalizedName) {
                    return '';
                }

                const normalizedOptions =
                    options === undefined ||
                        options === null ||
                        options === false
                        ? ''
                        : String(
                            options
                        ).trim();

                return (
                    '\\usepackage' +
                    (
                        normalizedOptions
                            ? `[${normalizedOptions}]`
                            : ''
                    ) +
                    `{${normalizedName}}\n`
                );
            }
        )
        .join('');
};

// =================================================
// TEX INPUT
// =================================================
const buildTexInput = (
    input,
    dataset = {}
) => {
    const texPackages =
        parseTexPackages(
            dataset.texPackages
        );

    return (
        buildUsePackagePreamble(
            texPackages
        ) +
        (
            dataset.tikzLibraries
                ? `\\usetikzlibrary{${dataset.tikzLibraries}}\n`
                : ''
        ) +
        (dataset.addToPreamble || '') +
        '\\begin{document}\n' +
        String(input || '') +
        '\n\\end{document}\n'
    );
};

// =================================================
// WASM MEMORY
// =================================================
const createTexMemory = () => {
    if (!coredump) {
        throw new Error(
            'TikZJax: core.dump has not been loaded.'
        );
    }

    const expectedLength =
        library.pages * 65536;

    if (
        coredump.byteLength !==
        expectedLength
    ) {
        throw new Error(
            'TikZJax: invalid core.dump size. ' +
            `Expected ${expectedLength} bytes, ` +
            `received ${coredump.byteLength} bytes.`
        );
    }

    const memory =
        new WebAssembly.Memory({
            initial: library.pages,
            maximum: library.pages
        });

    const buffer =
        new Uint8Array(
            memory.buffer,
            0,
            expectedLength
        );

    buffer.set(coredump);

    return memory;
};

// =================================================
// TEX COMPILATION
// =================================================
const compileToDvi = async (
    input,
    dataset = {}
) => {
    if (!wasmModule) {
        throw new Error(
            'TikZJax: tex.wasm has not been loaded.'
        );
    }

    cleanVirtualFileSystem();

    try {
        if (dataset.showConsole) {
            library.setShowConsole();
        }

        library.writeFileSync(
            'input.tex',
            Buffer.from(input)
        );

        const memory =
            createTexMemory();

        library.setMemory(
            memory.buffer
        );

        library.setInput(
            'input.tex\n\\end\n'
        );

        library.setFileLoader(
            loadDecompress
        );

        const wasmInstance =
            await WebAssembly.instantiate(
                wasmModule,
                {
                    library,
                    env: {
                        memory
                    }
                }
            );

        await library.executeAsync(
            wasmInstance.exports
        );

        let dviFile;

        try {
            dviFile =
                library.readFileSync(
                    'input.dvi'
                );
        } catch (error) {
            const texLog =
                readTexLog();

            throw new Error(
                'TikZJax: TeX did not produce input.dvi.\n\n' +
                texLog,
                {
                    cause: error
                }
            );
        }

        return Buffer.from(
            cloneBytes(dviFile)
        );
    } finally {
        cleanVirtualFileSystem();
    }
};

// =================================================
// DVI TO HTML
// =================================================
const convertDviToHtml = async (dvi) => {
    const chunks = [];

    const page = new Writable({
        write(
            chunk,
            _encoding,
            callback
        ) {
            try {
                chunks.push(
                    Buffer.from(chunk)
                );

                callback();
            } catch (error) {
                callback(error);
            }
        }
    });

    async function* streamBuffer() {
        yield Buffer.from(dvi);
    }

    await dvi2html(
        streamBuffer(),
        page
    );

    return Buffer
        .concat(chunks)
        .toString();
};

// =================================================
// WORKER API
// =================================================
expose({
    async load(_urlRoot) {
        const nextUrlRoot =
            normalizeUrlRoot(_urlRoot);

        if (!nextUrlRoot) {
            throw new Error(
                'TikZJax: no asset root URL was provided.'
            );
        }

        if (
            urlRoot &&
            urlRoot !== nextUrlRoot
        ) {
            decompressedFileCache.clear();
            wasmModule = undefined;
            coredump = undefined;
        }

        urlRoot = nextUrlRoot;

        if (wasmModule && coredump) {
            return;
        }

        const [
            wasmBytes,
            loadedCoredump
        ] = await Promise.all([
            fetchAndDecompress(
                'tex.wasm.gz'
            ),
            fetchAndDecompress(
                'core.dump.gz'
            )
        ]);

        const expectedCoreDumpLength =
            library.pages * 65536;

        if (
            loadedCoredump.byteLength <
            expectedCoreDumpLength
        ) {
            throw new Error(
                'TikZJax: core.dump is too small. ' +
                `Expected at least ${expectedCoreDumpLength} bytes, ` +
                `received ${loadedCoredump.byteLength} bytes.`
            );
        }

        coredump =
            loadedCoredump.byteLength ===
                expectedCoreDumpLength
                ? loadedCoredump
                : loadedCoredump.slice(
                    0,
                    expectedCoreDumpLength
                );

        wasmModule =
            await WebAssembly.compile(
                wasmBytes
            );
    },

    async texify(
        input,
        dataset = {}
    ) {
        const timingsEnabled =
            shouldLogTimings(dataset);

        const texInput =
            buildTexInput(
                input,
                dataset
            );

        const dvi = await measure(
            'TeX compilation',
            timingsEnabled,
            () => compileToDvi(
                texInput,
                dataset
            )
        );

        return measure(
            'DVI to HTML',
            timingsEnabled,
            () => convertDviToHtml(dvi)
        );
    }
});
