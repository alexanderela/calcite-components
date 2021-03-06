(function () {
    var DEMO_ROOT = "demos";
    var ASSETS_PATH = "demos/_assets";
    var CSS = [ASSETS_PATH + "/demos.css", "build/calcite.css"];
    var SCRIPTS = [
        {
            src: "build/calcite.esm.js",
            type: "module"
        },
        {
            src: "build/calcite.js",
            noModule: true
        },
        {
            src: "vendor/dedent/dedent.js"
        }
    ];
    // Assume server is running in a development environment if there is a port present in the URL and reload demo pages.
    if (location.port) {
        SCRIPTS.push({
            src: ASSETS_PATH + "/demoPageReloader.js"
        });
    }
    var ROOT = window.location.pathname.split(DEMO_ROOT).shift();
    function loadCss(url) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = ROOT + url;
        document.head.appendChild(link);
    }
    function loadScript(script) {
        var scriptElement = document.createElement("script");
        Object.keys(script).forEach(function (key) {
            scriptElement[key] = key === "src" ? ROOT + script[key] : script[key];
        });
        document.head.appendChild(scriptElement);
    }
    CSS.forEach(loadCss);
    SCRIPTS.forEach(loadScript);
})();
