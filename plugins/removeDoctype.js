"use strict";

exports.type = "perItem";

exports.active = true;

exports.description = "removes doctype declaration";

exports.fn = function (item) {
    if (item.doctype) {
        return false;
    }
};
