var cs = cs || {};
cs.jq = cs.jq || {};
cs.jq.cycle = cs.jq.cycle || {};

var cycle = {
    jquery: 'js/jquery-1.6.1.min.js',
    cycleJS: 'js/jquery.cycle.all-2.72.js',
    cycleInitJS: 'js/initCycle.js',
    cycleCSS: 'css/jquery.cycle-2.72.css',
    cycleHeight: 'auto',
    cycleWidth: 'auto',
    imageNodes: [],
    doc: {},
    cycleID: "",
    cycleTimeout: "",
    cycleSpeed: "",
    cycleFX: "",
    build: function () {
        if(project.activeImage == null){
            window.error("Opened image and layer selections are necessary.");
            return;
        }
        
        this.doc = project.activeHTMLDocument;
        if (window.getSelections(project.activeImage.filePath).length == 0) {
            window.alert("Error: You need to select some layers to make this work.");
            return;
        }
        this.userConfig();
        this.generateAll();

        window.applyModelChanges(project.activeHTMLPath);
    },
    userConfig: function () {
        this.cycleID = window.input("input a name for the cycler.", "insert an ID for cycler parent node (without '#')", "myCycle");
        this.cycleFX = this.chooseFX();
        this.cycleTimeout = window.input("Please set the cycle timeout.", "Set cycle tiemout", "50");
        this.cycleSpeed = window.input("Please set the cycle Speed.", "Set cycle speed", "1000");
    },
    generateAll: function () {
        var head = this.doc.$("head").get(0);
        if (head === 'undefined') {
            window.alert("ERROR: no html file opened. please open one and try again.");
            return;
        }
        var docPath = this.doc.filePath;
        //create html struct for cycle
        this.createCycleStructure();

        //copy images and link them in the cycle container
        var links = this.createImagesFromLayers();
        this.cycleContainer.appendChild(this.prettyPrint(links));
        window.findNodeUnderCaret().appendChild(this.cycleContainer);

        //copy css files and include them in html
        links = cs.util.dependencies.copyAssetFiles([this.cycleCSS], project.defaultCSSPath, docPath);
        head.appendChild(this.prettyPrint(links));

        //copy js files and include them too
        links = cs.util.dependencies.copyAssetFiles([this.jquery, this.cycleJS, this.cycleInitJS], project.defaultJSPath, docPath);
        head.appendChild(this.prettyPrint(links));

        //create js file to initializes cycler
        var cycleInitCode = this.createCycleLoadingCode();
        io.write(project.defaultJSPath + "/initCycle.js", cycleInitCode);

        this.initCycleCSSCode();

        var mergedLayer = project.activeImage.merge(window.getSelections(project.activeImage.filePath), "cycleMerge");
        this.cycleHeight = mergedLayer.height + "px";
        this.cycleWidth = mergedLayer.width + "px";
    },
    createCycleStructure: function () {
        var wrapperCode = io.loadFile("assets/html/wrapper.html");
        this.cycleContainer = fileManager.parseHTML(wrapperCode);
        this.cycleContainer.setAttribute("id", this.cycleID);
    },
    createImagesFromLayers: function () {
        var imageNodes = [];
        var layers = window.getSelections(project.activeImage.filePath);
        for (var i in layers) {
            var layer = layers[i];
            this.imagePath = project.defaultImagePath + "/" + layer.nameAsFileName + ".png";
            this.imageAltText = layer.name;

            layer.writeTo(this.imagePath);

            imageNodes[i] = fileManager.parseHTML("<img></img>");
            imageNodes[i].setAttribute("src", io.relPath(this.doc.filePath, this.imagePath));
            imageNodes[i].setAttribute("width", layer.width);
            imageNodes[i].setAttribute("height", layer.height);
        }
        return imageNodes;
    },
    prettyPrint: function (links) {
        var pretty = [];
        for (var i = 0; i < links.length; i++) {
            //TODO check if link is already in html and do not add another one
            pretty[i * 2] = links[i];
            pretty[i * 2 + 1] = fileManager.createTextNode("\n");
        }
        return pretty;
    },
    createCycleLoadingCode: function () {
        var jsPath = project.defaultJSPath + (new String(this.cycleInitJS).replace(/js/, ""));
        var jsCode = io.loadFile(jsPath);
        var replaced = new String(jsCode)        
                .replace(/\$\{cycleID\}/g, this.cycleID)
                .replace(/\$\{cycleFX\}/g, this.cycleFX)
                .replace(/\$\{cycleTimeout\}/g, this.cycleTimeout)
                .replace(/\$\{cycleSpeed\}/g, this.cycleSpeed);
        io.write(jsPath, replaced);
        return replaced;
    },
    initCycleCSSCode: function () {
        var cssPath = project.defaultCSSPath + (new String(this.cycleCSS).replace(/css/, ""));
        var cssCode = io.loadFile(cssPath);
        var replaced = new String(cssCode)
                .replace(/\$\{cycleID\}/g, this.cycleID)
                .replace(/\$\{cycleHeight\}/g, this.cycleHeight)
                .replace(/\$\{cycleWidth\}/g, this.cycleWidth);
        io.write(cssPath, replaced);
        return cssPath;
    },
    chooseFX: function () {
        var fxOptions = ["none",
            "fade",
            "blindY",
            "blindZ",
            "cover",
            "curtainX",
            "curtainY",
            "fade",
            "fadeZoom",
            "growX",
            "growY",
            "scrollUp",
            "scrollDown",
            "scrollLeft",
            "scrollRight",
            "scrollHorz",
            "scrollVert",
            "shuffle",
            "slideX",
            "slideY",
            "toss",
            "turnUp",
            "turnDown",
            "turnLeft",
            "turnRight",
            "uncover",
            "wipe",
            "zoom"];
        var fx = window.dropDownDialog("please choose an effect:", fxOptions);
        return fx;
    }
};