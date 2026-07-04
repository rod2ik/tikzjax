console.log("[TIKZJAX.CONFIG] was loaded");

window.TikzJaxOptions = {
    renderTimeout: 10000,

    brokenImageSrc: "https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@__TIKZJAX_VERSION__/dist/assets/broken-image.svg",

    tex: {
        texPackages: {
            amsmath: "",
            amsfonts: "",
            amssymb: "",
            "tkz-tab": ""
        },
        tikzLibraries: [
            "arrows.meta",
            "calc",
            "positioning"
        ]
    },

    tkzTab: {
        lineWidth: "1.2pt",
        font: "\\Large",

        lgt: 10,
        espcl: 3.2,

        variableRowHeight: 1.2,
        signRowHeight: 2.2,
        variationRowHeight: 2.2,

        imageRowHeight: 2.2,
        antecedentRowHeight: 2.2
    }
};