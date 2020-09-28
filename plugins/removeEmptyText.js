"use strict";

exports.type = "perItem";

exports.active = true;

exports.description = "removes empty <text> elements";

exports.params = {
    text: true,
    tspan: true,
    tref: true,
};

exports.fn = function (item, params) {
    // Remove empty text element
    if (params.text && item.isElem("text") && item.isEmpty()) return false;

    // Remove empty tspan element
    if (params.tspan && item.isElem("tspan") && item.isEmpty()) return false;

    // Remove tref with empty xlink:href attribute
    if (params.tref && item.isElem("tref") && !item.hasAttrLocal("href"))
        return false;
};
