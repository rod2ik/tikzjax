#!/usr/bin/env node

import fs from "fs";
import path from "path";

const DIST = path.resolve("dist");

const REQUIRED = [
    "tikzjax.js",
    "tex_files/tikzlibraryarrows.code.tex.gz",
    "tex_files/pgflibraryarrows.code.tex.gz",
    "tex_files/pgflibraryarrows.meta.code.tex.gz",
    "tex_files/tikzlibrarycalc.code.tex.gz",
    "tex_files/tikzlibrarypositioning.code.tex.gz"
];

console.log("🔍 validating dist...\n");

let ok = true;

for (const file of REQUIRED) {
    const full = path.join(DIST, file);

    if (fs.existsSync(full)) {
        console.log("✔", file);
    } else {
        console.log("❌ missing:", file);
        ok = false;
    }
}

console.log("\n----------------");

if (!ok) {
    console.log("💥 DIST INVALID");
    process.exit(1);
}

console.log("✅ DIST OK");