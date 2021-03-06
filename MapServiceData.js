(function () {
    var url = "http://js.arcgis.com/3.8/", scr1, colorhash = {};
    function getFullLink(link) {
        var newLink = '', wl = window.location;
        if (link.indexOf(wl.protocol) === 0) { return link; }
        newLink += wl.protocol + "//";
        if (link.indexOf(wl.hostname) === 0) { return newLink + link; }
        newLink += wl.hostname;
        if (link.indexOf(wl.pathname) === 0) { return newLink + link; }
        return newLink + wl.pathname + link;
    }
    function getColor(item) {
        if (colorhash[item]) { return colorhash[item]; }
        colorhash[item] = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
        return colorhash[item];
    }
    function getCompColor(item) {
        var col = colorhash[item],
            newcol = "",
            coltbl = "fedcba98".indexOf(col.substr(1,1)) > -1 ? { f: "7", e: "6", d: "5", c: "4", b: "3", a: "2", "9": "1", "8": "0", "7": "0", "6": "0", "5": "0", "4": "0", "3": "0", "2": "0", "1": "0", "0": "0" } :  { f: "f", e: "f", d: "f", c: "f", b: "f", a: "f", "9": "f", "8": "f", "7": "f", "6": "e", "5": "d", "4": "c", "3": "b", "2": "a", "1": "9", "0": "8" }, 
            c;
        for (c = 0; c < col.length; c++) {
            newcol += c % 2 === 1 ? coltbl[col.substr(c, 1)] : col.substr(c, 1);
        }
        return newcol;
    }
    function loadMe() {
        require([
            "dojo/query",
            "dojo/dom-construct",
            "dojo/dom-attr",
            "esri/request"
        ], function (dojoQuery, domConstruct, domAttr, esriRequest) {
            var review = function (list, index) {
                var jsonUrl, node;
                if (index < list.length) {
                    node = list[index];
                    jsonUrl = domAttr.get(node, "href");
                    jsonUrl = getFullLink(jsonUrl);
                    esriRequest({
                        url: jsonUrl,
                        handleAs: "json",
                        content:{f:"json"}
                    }).then(function (response) {
                        var wkid, sp;
                        if (!response.spatialReference) { return; }
                        sp = response.spatialReference; wkid = sp.latestWkid || sp.wkid || null;
                        if (wkid === null) {
                            domConstruct.create("span", {
                                innerHTML: "&nbsp;No valid wkid available &nbsp;"
                            }, node, "after");
                        }
                        else {
                            domConstruct.create("a", {
                                href: "http://spatialreference.org/ref/?search=" + wkid,
                                innerHTML: "WKID: " + wkid,
                                style:"background:" + getColor(wkid) + ";color:" + getCompColor(wkid) + ";"
                            }, node, "after");
                        }
                        domConstruct.create("span", {
                            innerHTML: "&nbsp;" + (response.singleFusedMapCache ? "tiled" : "dynamic") + "&nbsp;"
                        }, node, "after");

                        review(list, ++index);
                    });
                    
                }
            },
            linkList = dojoQuery('a[href$="MapServer"]');
            
            review(linkList, 0);
        });
    }
    function scriptLoaded(url) {
        var scripts = document.getElementsByTagName("script"), i;
        for (i = scripts.length - 1; i > -1; i--) {
            if (scripts[i].src === url) { return true; }
        }
        return false;
    }
    if (!scriptLoaded(url)) {
        scr1 = document.createElement("script");
        scr1.setAttribute("type", "text/javascript");
        scr1.onload = loadMe;
        scr1.setAttribute("src", url);
        document.body.appendChild(scr1);
    } else {
        loadMe();
    }
}());