"use strict";

exports.type = "perItemReverse";

exports.active = true;

exports.description = "removes empty container elements";

var container = require("./_collections").elemsGroups.container;

exports.fn = function (item) {
    return !(
        item.isElem(container) &&
        !item.isElem("svg") &&
        item.isEmpty() &&
        (!item.isElem("pattern") || !item.hasAttrLocal("href"))
    );
};
