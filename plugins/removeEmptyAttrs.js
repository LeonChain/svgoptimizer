"use strict";

exports.type = "perItem";

exports.active = true;

exports.description = "removes empty attributes";

exports.fn = function (item) {
    if (item.elem) {
        item.eachAttr(function (attr) {
            if (attr.value === "") {
                item.removeAttr(attr.name);
            }
        });
    }
};
