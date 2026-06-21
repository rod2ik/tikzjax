window.TikzJaxOptions = {
    renderTimeout: 10000,
    brokenImageSrc: "https://rod2ik.github.io/cdn/tikzjax/assets/broken-image-esquisse.svg",

    theme: {
        selector: "body",
        attribute: "data-md-color-scheme",
        darkValue: "slate",
        lightValue: "default"
    },

    tex: {
        texPackages: {
            amsmath: "",
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
        firstColumnWidth: 10,
        espcl: 3.2,
        variableRowHeight: 1.5,
        signRowHeight: 2.5,
        variationRowHeight: 2.5,
        imageRowHeight: 2.5,
        antecedentRowHeight: 2.5
    }
};