"use strict";

exports.type = "perItem";

exports.active = true;

exports.description = "removes comments";

exports.fn = function (item) {
    if (item.comment && item.comment.charAt(0) !== "!") {
        return false;
    }
};
