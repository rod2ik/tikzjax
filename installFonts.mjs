#!/usr/bin/env node

import https from 'follow-redirects/https.js';
import fs from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import decompress from 'decompress';
import { Font, woff2 } from 'fonteditor-core';

await woff2.init();

const tmpDir = fs.mkdtempSync(path.join(tmpdir(), 'tmp-'));

// These are all of the valid glyphs in the cmex fonts.
const cmexGlyphs = [32];
for (let i = 61472; i < 61567; ++i) {
    cmexGlyphs.push(i);
}
for (let i = 61600; i < 61637; ++i) {
    cmexGlyphs.push(i);
}

const zipFile = path.join(tmpDir, 'bakoma.zip');
const file = fs.createWriteStream(zipFile);
https.get('https://us.mirrors.cicku.me/ctan/fonts/cm/ps-type1/bakoma.zip', (response) => {
    response.pipe(file);
    file.on('finish', async () => {
        file.close();
        const files = await decompress(zipFile, tmpDir, {
            filter: (file) => (path.extname(file.path) === '.ttf') | (path.extname(file.path) === '.otf')
        });
        fs.mkdirSync(path.join(import.meta.dirname, 'dist', 'fonts'), { recursive: true });
        for (const file of files) {
            const basename = path.basename(file.path);
            // The opentype cmex fonts need to be used because the glyph for angbracketleftbig is the unicode character
            // for a soft hyphen which is not displaed by browsers.  However, the otf fonts have invalid out of range
            // glyphs. So those glyphs need to be removed. The fonts are converted to woff2 fonts since this library
            // doesn't support writing opentype fonts.
            if (['cmex7.otf', 'cmex8.otf', 'cmex9.otf', 'cmex10.otf'].includes(basename)) {
                const buffer = await fs.promises.readFile(path.join(tmpDir, file.path));
                const font = Font.create(buffer, {
                    type: 'otf',
                    subset: cmexGlyphs,
                    hinting: true,
                    kerning: true
                });

                await fs.promises.writeFile(
                    path.join(import.meta.dirname, 'dist', 'fonts', basename.replace(/\.otf$/, '.woff2')),
                    font.write({
                        type: 'woff2',
                        hinting: true,
                        kerning: true
                    })
                );
            } else if (path.extname(file.path) !== '.ttf') {
                continue;
            } else {
                fs.copyFileSync(
                    path.join(tmpDir, file.path),
                    path.join(import.meta.dirname, 'dist', 'fonts', path.basename(file.path))
                );
            }
        }
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });
});
