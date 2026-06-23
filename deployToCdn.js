#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const message = process.argv.slice(2).join(" ").trim() || "update tikzjax";

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, "dist");
const cdnRepo = path.resolve(projectRoot, "../cdn");
const cdnTikzjaxDir = path.join(cdnRepo, "tikzjax");

function run(command, args, options = {}) {
    console.log(`\n$ ${command} ${args.join(" ")}`);

    const result = spawnSync(command, args, {
        stdio: "inherit",
        shell: false,
        ...options
    });

    if (result.status !== 0) {
        process.exit(result.status || 1);
    }
}

console.log("📦 building + deploying CDN...");
console.log("📝 commit message:", message);

run("yarn", ["build:full:check"]);

if (!fs.existsSync(distDir)) {
    console.error("❌ dist/ does not exist.");
    process.exit(1);
}

if (!fs.existsSync(cdnRepo)) {
    console.error(`❌ CDN repo not found: ${cdnRepo}`);
    process.exit(1);
}

fs.rmSync(cdnTikzjaxDir, { recursive: true, force: true });
fs.mkdirSync(cdnTikzjaxDir, { recursive: true });
fs.cpSync(distDir, cdnTikzjaxDir, { recursive: true });

console.log(`\n✅ Copied ${distDir} -> ${cdnTikzjaxDir}`);

run("git", ["add", "tikzjax"], { cwd: cdnRepo });

const diff = spawnSync("git", ["diff", "--cached", "--quiet"], {
    cwd: cdnRepo,
    stdio: "inherit",
    shell: false
});

if (diff.status === 0) {
    console.log("\n✅ No CDN changes to commit.");
    process.exit(0);
}

run("git", ["commit", "-m", message], { cwd: cdnRepo });
run("git", ["push"], { cwd: cdnRepo });

console.log("\n🚀 deploy done");