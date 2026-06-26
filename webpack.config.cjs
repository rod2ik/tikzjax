const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = (_env, argv = {}) => {
const mode = argv.mode || "development";

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
                    to: path.resolve(__dirname, "dist")
                },
                {
                    from: "./core.dump.gz",
                    to: path.resolve(__dirname, "dist"),
                    noErrorOnMissing: true
                },
                {
                    from: "./tex.wasm.gz",
                    to: path.resolve(__dirname, "dist"),
                    noErrorOnMissing: true
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
        })
    ]
};
};
