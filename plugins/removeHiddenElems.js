"use strict";

exports.type = "perItem";

exports.active = true;

exports.description =
    "removes hidden elements (zero sized, with absent attributes)";

exports.params = {
    isHidden: true,
    displayNone: true,
    opacity0: true,
    circleR0: true,
    ellipseRX0: true,
    ellipseRY0: true,
    rectWidth0: true,
    rectHeight0: true,
    patternWidth0: true,
    patternHeight0: true,
    imageWidth0: true,
    imageHeight0: true,
    pathEmptyD: true,
    polylineEmptyPoints: true,
    polygonEmptyPoints: true,
};

var regValidPath = /M\s*(?:[-+]?(?:\d*\.\d+|\d+(?:\.|(?!\.)))([eE][-+]?\d+)?(?!\d)\s*,?\s*){2}\D*\d/i;

exports.fn = function (item, params) {
    if (item.elem) {
        if (params.isHidden && item.hasAttr("visibility", "hidden"))
            return false;
        if (params.displayNone && item.hasAttr("display", "none")) return false;

        if (params.opacity0 && item.hasAttr("opacity", "0")) return false;
        if (
            params.circleR0 &&
            item.isElem("circle") &&
            item.isEmpty() &&
            item.hasAttr("r", "0")
        )
            return false;

        if (
            params.ellipseRX0 &&
            item.isElem("ellipse") &&
            item.isEmpty() &&
            item.hasAttr("rx", "0")
        )
            return false;
        if (
            params.ellipseRY0 &&
            item.isElem("ellipse") &&
            item.isEmpty() &&
            item.hasAttr("ry", "0")
        )
            return false;
        if (
            params.rectWidth0 &&
            item.isElem("rect") &&
            item.isEmpty() &&
            item.hasAttr("width", "0")
        )
            return false;
        if (
            params.rectHeight0 &&
            params.rectWidth0 &&
            item.isElem("rect") &&
            item.isEmpty() &&
            item.hasAttr("height", "0")
        )
            return false;
        if (
            params.patternWidth0 &&
            item.isElem("pattern") &&
            item.hasAttr("width", "0")
        )
            return false;
        if (
            params.patternHeight0 &&
            item.isElem("pattern") &&
            item.hasAttr("height", "0")
        )
            return false;
        if (
            params.imageWidth0 &&
            item.isElem("image") &&
            item.hasAttr("width", "0")
        )
            return false;
        if (
            params.imageHeight0 &&
            item.isElem("image") &&
            item.hasAttr("height", "0")
        )
            return false;
        if (
            params.pathEmptyD &&
            item.isElem("path") &&
            (!item.hasAttr("d") || !regValidPath.test(item.attr("d").value))
        )
            return false;
        if (
            params.polylineEmptyPoints &&
            item.isElem("polyline") &&
            !item.hasAttr("points")
        )
            return false;
        if (
            params.polygonEmptyPoints &&
            item.isElem("polygon") &&
            !item.hasAttr("points")
        )
            return false;
    }
};
