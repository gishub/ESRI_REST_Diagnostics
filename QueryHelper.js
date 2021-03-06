(function () {
    var url = "http://js.arcgis.com/3.8/",
    	d = document, scr1;
    function loadMe() {
        require(["dojo/ready", "dojo/dom-construct", "dojo/dom-attr", "dojo/on", "dojo/query", "esri/request", "dojo/_base/lang", "dojo/_base/array"
			], function (ready, domConstruct, domAttr, dojoOn, dojoQuery, esriRequest, lang, array) {
				var active = null;
			function build(fields) {
				var div = domConstruct.create("div", {
					style: "position:fixed;bottom:10%;top:10%;right:0;width:40%;border:1px solid #88F;padding:5px;background:#fff;overflow:auto;",
					innerHTML: "<button style='float:right;' onclick='this.parentNode.parentNode.removeChild(this.parentNode);'>Close</button><b>Query Builder</b><br />"
				}, d.body),
					listC = domConstruct.create("div", {
						style: "position:relative;height:35%;width: 90%;",
						innerHTML: "<ul style="list-style-type:none;margin:0;padding:0;border:0;">" + array.map(fields, function (field){
							return ["<li data-field='", field.name, "' style='margin:0;padding:5px;display:inline-block;'>", field.alias, "</li>"].join("");
						}).join("") + "</ul>"
					}, div),
					btns = domConstruct.create("div", {
						innerHTML: array.map([" = "," &lt;&gt; "," Like "," &gt; "," &gt;= "," AND "," &lt; "," &lt;= "," OR ","_","%","()","NOT "," IS "], function(txt) {
							return ["<button type='button' name='", txt, "'>", txt.replace(" ",""),"</button>"].join("");
						})
					}, div);
				return [listC, btns];
			}
			ready(function () {
				var wl = window.location, url = wl.href.replace(wl.search, "").replace(/\/query\/?$/i, "");
				dojoQuery("input[type='text']").on("blur", function () {active = this;});
				dojoQuery("textarea").on("blur", function (node) {active = this;});
                esriRequest({
                	url: url,
					handleAs: "json",
					content: {f: "json"}
				}).then(function (resp) {
					var nodes = build(resp.fields);
					dojoQuery("li", nodes[0]).on("click", function (evt){
						active.value += domAttr.get(evt.currentTarget, "data-field") + " ";
						active.focus();
					});
					dojoQuery("button", nodes[1]).on("click", function(evt){
						active.value += evt.currentTarget.name + " ";
						active.focus();
					});
				});
            });
        });
    }
    function scriptLoaded(url) {
        var scripts = d.getElementsByTagName("script"), i;
        for (i = scripts.length - 1; i > -1; i--) {
            if (scripts[i].src === url) { return true; }
        }
        return false;
    }
    if (!scriptLoaded(url)) {
        scr1 = d.createElement("script");
        scr1.setAttribute("type", "text/javascript");
        scr1.onload = loadMe;
        scr1.setAttribute("src", url);
        d.body.appendChild(scr1);
    } else {
        loadMe();
    }
}());