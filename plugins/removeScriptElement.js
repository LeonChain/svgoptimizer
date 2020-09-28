"use strict";

exports.type = "perItem";

exports.active = false;

exports.description = "removes <script> elements (disabled by default)";

exports.fn = function (item) {
    return !item.isElem("script");
};
