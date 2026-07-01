const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const minifyCss = (content) =>
    content
        .toString()
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{}:;,>])\s*/g, "$1")
        .replace(/;}/g, "}")
        .trim();

module.exports = (_env, argv = {}) => {
    const mode = argv.mode || "development";
    const isProduction = mode === "production";

    process.env.NODE_ENV = mode;

    return {
        entry: {
            tikzjax: "./src/index.js",
            "run-tex": "./src/run-tex.js"
        },

        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].js"
        },

        devServer: {
            static: path.join(__dirname, "./public"),
            port: 9090
        },

        devtool: mode === "development" ? "source-map" : false,

        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                }
            ]
        },

        performance: {
            hints: false
        },

        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: "./css/fonts.css",
                        to: path.resolve(__dirname, "dist", "fonts.css")
                    },
                    {
                        from: "./css/fonts.css",
                        to: path.resolve(__dirname, "dist", "fonts.min.css"),
                        transform(content) {
                            return Buffer.from(minifyCss(content));
                        }
                    },
                    {
                        from: "./core.dump.gz",
                        to: path.resolve(__dirname, "dist")
                    },
                    {
                        from: "./tex.wasm.gz",
                        to: path.resolve(__dirname, "dist")
                    },
                    {
                        from: "./assets/*.svg",
                        to: path.resolve(__dirname, "dist", "assets", "[name][ext]"),
                        noErrorOnMissing: true
                    }
                ]
            }),

            new webpack.ProvidePlugin({
                process: "process/browser"
            }),

            new ESLintPlugin({
                configType: "flat"
            }),

            {
                apply(compiler) {
                    compiler.hooks.afterEmit.tap("CopyMinifiedJavaScriptFiles", () => {
                        if (!isProduction) return;

                        const dist = path.resolve(__dirname, "dist");

                        const copies = [
                            ["tikzjax.js", "tikzjax.min.js"],
                            ["run-tex.js", "run-tex.min.js"]
                        ];

                        for (const [source, target] of copies) {
                            const sourcePath = path.join(dist, source);
                            const targetPath = path.join(dist, target);

                            if (fs.existsSync(sourcePath)) {
                                fs.copyFileSync(sourcePath, targetPath);
                            }
                        }
                    });
                }
            }
        ]
    };
};