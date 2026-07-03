import { dvi2html } from '@rod2ik/dvi2html';
import { expose } from 'threads/worker';
import pako from 'pako';
import { Buffer } from 'buffer';
import { Writable } from 'stream-browserify';
import * as library from './library.js';

let coredump;
let code;
let urlRoot;

const loadDecompress = async (file) => {
    const url = `${urlRoot}/${file}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Unable to load ${file} from ${url}. File not available.`);
    }

    const reader = response.body.getReader();
    const inflate = new pako.Inflate();

    while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        inflate.push(value);
    }

    reader.releaseLock();

    if (inflate.err) {
        throw new Error(`Unable to decompress ${file}: ${inflate.msg || inflate.err}`);
    }

    return inflate.result;
};

const readTexLog = () => {
    try {
        return Buffer.from(library.readFileSync('input.log')).toString();
    } catch {
        return 'No TeX log file was available.';
    }
};

expose({
    async load(_urlRoot) {
        urlRoot = _urlRoot;
        code = await loadDecompress('tex.wasm.gz');
        coredump = new Uint8Array(await loadDecompress('core.dump.gz'), 0, library.pages * 65536);
    },

    async texify(input, dataset) {
        const texPackages = {
            ...(dataset.texPackages ? JSON.parse(dataset.texPackages) : {})
        };

        input =
            Object.entries(texPackages).reduce((usePackageString, thisPackage) => {
                usePackageString +=
                    '\\usepackage' + (thisPackage[1] ? `[${thisPackage[1]}]` : '') + `{${thisPackage[0]}}`;

                return usePackageString;
            }, '') +
            (dataset.tikzLibraries ? `\\usetikzlibrary{${dataset.tikzLibraries}}` : '') +
            (dataset.addToPreamble || '') +
            `\\begin{document}\n${input}\n\\end{document}\n`;

        if (dataset.showConsole) library.setShowConsole();

        library.writeFileSync('input.tex', Buffer.from(input));

        const memory = new WebAssembly.Memory({
            initial: library.pages,
            maximum: library.pages
        });

        const buffer = new Uint8Array(memory.buffer, 0, library.pages * 65536);
        buffer.set(coredump.slice(0));

        library.setMemory(memory.buffer);
        library.setInput('input.tex\n\\end\n');
        library.setFileLoader(loadDecompress);

        const wasm = await WebAssembly.instantiate(code, {
            library,
            env: {
                memory
            }
        });

        await library.executeAsync(wasm.instance.exports);

        let dvi;

        try {
            dvi = library.readFileSync('input.dvi').buffer;
        } catch (error) {
            throw new Error(
                'TikZJax: TeX did not produce input.dvi.\n\n' + readTexLog(),
                { cause: error }
            );
        }

        library.deleteEverything();

        let html = '';

        const page = new Writable({
            write(chunk, _encoding, callback) {
                html = html + chunk.toString();
                callback();
            }
        });

        async function* streamBuffer() {
            yield Buffer.from(dvi);
            return;
        }

        await dvi2html(streamBuffer(), page);

        return html;
    }
});