#!/usr/bin/env node

import https from "follow-redirects/https.js";
import fs from "fs";
import { tmpdir } from "os";
import path from "path";
import decompress from "decompress";
import { Font, woff2 } from "fonteditor-core";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await woff2.init();

const tmpDir = fs.mkdtempSync(path.join(tmpdir(), "tmp-"));

const zipFile = path.join(tmpDir, "bakoma.zip");
const file = fs.createWriteStream(zipFile);

https.get("https://us.mirrors.cicku.me/ctan/fonts/cm/ps-type1/bakoma.zip", (response) => {
    response.pipe(file);

    file.on("finish", async () => {
        file.close();

        const files = await decompress(zipFile, tmpDir, {
            filter: (file) => path.extname(file.path) === ".otf"
        });

        fs.mkdirSync(path.join(__dirname, "dist", "fonts"), {
            recursive: true
        });

        for (const file of files) {
            const basename = path.basename(file.path);

            const buffer = await fs.promises.readFile(path.join(tmpDir, file.path));

            const font = Font.create(buffer, {
                type: "otf",
                hinting: true,
                kerning: true
            });

            await fs.promises.writeFile(
                path.join(__dirname, "dist", "fonts", basename.replace(/\.otf$/, ".woff2")),
                font.write({
                    type: "woff2",
                    hinting: true,
                    kerning: true
                })
            );
        }

        fs.rmSync(tmpDir, {
            recursive: true,
            force: true
        });
    });
});