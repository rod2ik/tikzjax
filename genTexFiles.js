#!/usr/bin/env node

import fs from "fs";
import pako from "pako";
import { spawnSync } from "child_process";

const inputFile = "tex_files.json";
const outputDir = "./dist/tex_files";

fs.mkdirSync(outputDir, { recursive: true });

const processedFiles = new Set();

const files = JSON.parse(fs.readFileSync(inputFile, "utf8"));

for (const texFile of files) {
    if (!texFile || processedFiles.has(texFile)) continue;

    console.log(`\tAttempting to locate ${texFile}.`);

    const result = spawnSync("kpsewhich", [texFile], {
        encoding: "utf8"
    });

    const sysFile = result.stdout.trim();

    if (!sysFile) {
        console.log(`\t\x1b[31mUnable to locate ${texFile}.\x1b[0m`);
        continue;
    }

    processedFiles.add(texFile);

    console.log(`\tResolved ${texFile} to ${sysFile}`);

    const source = fs.readFileSync(sysFile);
    const gzipped = pako.gzip(source);

    fs.writeFileSync(`${outputDir}/${texFile}.gz`, gzipped);
}