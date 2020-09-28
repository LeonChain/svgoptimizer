"use strict";

exports.type = "perItem";

exports.active = false;

exports.description =
    "removes attributes of elements that match a css selector";

exports.fn = function (item, params) {
    var selectors = Array.isArray(params.selectors)
        ? params.selectors
        : [params];

    selectors.map(function (i) {
        if (item.matches(i.selector)) {
            item.removeAttr(i.attributes);
        }
    });
};
