"use strict";

exports.type = "perItem";

exports.active = true;

exports.description = "removes <metadata>";

exports.fn = function (item) {
    return !item.isElem("metadata");
};
