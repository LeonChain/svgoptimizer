"use strict";

exports.type = "perItem";

exports.active = false;

exports.description = "removes raster images (disabled by default)";

exports.fn = function (item) {
    if (
        item.isElem("image") &&
        item.hasAttrLocal("href", /(\.|image\/)(jpg|png|gif)/)
    ) {
        return false;
    }
};
