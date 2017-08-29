(function() {
    "use strict";

    function copyCSS(source, target) {
        var ignore = ["g", "defs", "animate"];
        if(ignore.indexOf(source.tagName) > -1) {
            return;
        }
        // Note: get cs.cssText does not work in firefox
	var cs = window.getComputedStyle(source),
            cssText = '';
        for(var i = 0; i < cs.length; i++) {
            var style = cs[i];
            cssText += style + ':' + cs.getPropertyValue(style) + ';';
        }
        target.style.cssText = cssText;
    }

    /**
     * @class DomScreenshot
     * @constructor
     */
    function DomScreenshot(sourceNode) {

        var node = sourceNode.cloneNode(true),
            children = node.querySelectorAll('*'),
            sourceChildren = sourceNode.querySelectorAll('*');

        var i;
        for(i = 0; i < children.length; i++) {
            copyCSS(sourceChildren[i], children[i]);
        }

        for(i = 0; i < children.length; i++) {
            var child = children[i];
            if(child.tagName === "SCRIPT" ||
               child.style.display === "none") {
                child.remove();
            }
        }

        copyCSS(sourceNode, node);
        // reset root's margin
        ["margin", "marginLeft", "marginTop", "marginBottom", "marginRight"].forEach(function(k) {
            node.style[k] = '';
        });


        node.setAttribute("xmlns", "http://www.w3.org/1999/xhtml"); // SVG can only eat well formed XHTML
        var xml = new XMLSerializer().serializeToString(node);
        var width = sourceNode.offsetWidth,
            height = sourceNode.offsetHeight;
        this.svg = "<?xml version='1.0' encoding='UTF-8' ?><svg xmlns='http://www.w3.org/2000/svg' width='" + width + "' height='" + height + "'><foreignObject width='100%' height='100%' x='0' y='0'>" + xml + "</foreignObject></svg>";
    }

    /**
     * Convert to Base64 Data URI
     *
     * @method toDataURI
     */
    DomScreenshot.prototype.toDataURI = function() {
        return "data:image/svg+xml;charset=utf-8;base64," +  window.btoa(unescape(encodeURIComponent(this.svg)));
    }

    window.DomScreenshot = DomScreenshot;

})();
