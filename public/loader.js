(() => {
    const texPackages = document.getElementsByName('tex-packages')[0];
    const texPreamble = document.getElementsByName('tex-preamble')[0];
    const tikzLibraries = document.getElementsByName('tikz-libraries')[0];
    const tikzSource = document.getElementsByName('tikz-source')[0];
    const tikzjaxContent = document.querySelector('.tikzjax-content');
    if (!texPackages || !texPreamble || !tikzSource || !(tikzjaxContent instanceof HTMLElement)) return;

    if (!tikzSource.value)
        tikzSource.value = '\\begin{tikzpicture}\n\\draw (0, 0) circle[radius = 1];\n\\end{tikzpicture}';

    const loadSource = () => {
        while (tikzjaxContent.firstChild) tikzjaxContent.firstChild.remove();

        const script = document.createElement('script');
        script.type = 'text/tikz';
        script.dataset.disableCache = 'true';
        script.dataset.showConsole = 'true';
        script.dataset.texPackages = texPackages.value;
        script.dataset.addToPreamble = texPreamble.value;
        script.dataset.tikzLibraries = tikzLibraries.value;
        script.textContent = tikzSource.value;
        tikzjaxContent.append(script);
    };

    loadSource();
    document.getElementById('load-source')?.addEventListener('click', loadSource);
})();
