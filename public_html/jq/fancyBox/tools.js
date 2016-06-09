var includes = {
    path: "",
    link: "",
    buildCSSLink: function () {
        var head = document.$("head").get();
        if (head.length == 0) {
            window.alert("no head tag.");
            return;
        }
        head = head[0];
        this.buildLink(head, "css");
    },
    buildJSLink: function () {
        var head = document.$("head").get();
        if (head.length == 0) {
            window.alert("no head tag.");
            return;
        }
        head = head[0];

        this.buildLink(head, "js");
    },
    buildLink: function (targetNode, linkType) {
        var docPath = document.filePath;
        var relPath = io.relPath(docPath, this.path);
        var link;
        if(linkType === "js"){
            link = html.jsLink(relPath);
        } else if(linkType === "css"){
            link = html.cssLink(relPath);
        }
        targetNode.appendChild(link);
    },
    buildCSSLinkTo: function (path) {
        this.path = path;
        this.buildCSSLink();
    },
    buildJSLinkTo: function (path) {
        this.path = path;
        this.buildJSSLink();
    }

};


