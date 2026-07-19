console.log("[TIKZJAX.CONFIG] was loaded");

window.TikzJaxOptions = {
    renderTimeout: 10000,
    maxRetries: 0,
    restartWorkerOnFail: true,

    tex: {
        texPackages: {
            amsmath: "",
            "tkz-tab": ""
        }
    },

    tkzTab: {
        lineWidth: "1.2pt"
    }
};

console.log(
    "[TIKZJAX.CONFIG] tkzTab.lineWidth =",
    window.TikzJaxOptions.tkzTab.lineWidth
);