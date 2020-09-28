"use strict";

exports.type = "perItem";

exports.active = false;

exports.description =
    "removes xmlns attribute (for inline svg, disabled by default)";

exports.fn = function (item) {
    if (item.isElem("svg") && item.hasAttr("xmlns")) {
        item.removeAttr("xmlns");
    }
};
