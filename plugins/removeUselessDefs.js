"use strict";

exports.type = "perItem";

exports.active = true;

exports.description = "removes elements in <defs> without id";

var nonRendering = require("./_collections").elemsGroups.nonRendering;

exports.fn = function (item) {
    if (item.isElem("defs")) {
        if (item.content) {
            item.content = getUsefulItems(item, []);
        }

        if (item.isEmpty()) return false;
    } else if (item.isElem(nonRendering) && !item.hasAttr("id")) {
        return false;
    }
};

function getUsefulItems(item, usefulItems) {
    item.content.forEach(function (child) {
        if (child.hasAttr("id") || child.isElem("style")) {
            usefulItems.push(child);
            child.parentNode = item;
        } else if (!child.isEmpty()) {
            child.content = getUsefulItems(child, usefulItems);
        }
    });

    return usefulItems;
}
