"use strict";

exports.type = "perItem";

exports.active = true;

exports.description = "converts colors: rgb() to #rrggbb and #rrggbb to #rgb";

exports.params = {
    currentColor: false,
    names2hex: true,
    rgb2hex: true,
    shorthex: true,
    shortname: true,
};

var collections = require("./_collections"),
    rNumber = "([+-]?(?:\\d*\\.\\d+|\\d+\\.?)%?)",
    rComma = "\\s*,\\s*",
    regRGB = new RegExp(
        "^rgb\\(\\s*" +
            rNumber +
            rComma +
            rNumber +
            rComma +
            rNumber +
            "\\s*\\)$"
    ),
    regHEX = /^\#(([a-fA-F0-9])\2){3}$/,
    none = /\bnone\b/i;

exports.fn = function (item, params) {
    if (item.elem) {
        item.eachAttr(function (attr) {
            if (collections.colorsProps.indexOf(attr.name) > -1) {
                var val = attr.value,
                    match;

                // Convert colors to currentColor
                if (params.currentColor) {
                    if (typeof params.currentColor === "string") {
                        match = val === params.currentColor;
                    } else if (params.currentColor.exec) {
                        match = params.currentColor.exec(val);
                    } else {
                        match = !val.match(none);
                    }
                    if (match) {
                        val = "currentColor";
                    }
                }

                // Convert color name keyword to long hex
                if (
                    params.names2hex &&
                    val.toLowerCase() in collections.colorsNames
                ) {
                    val = collections.colorsNames[val.toLowerCase()];
                }

                // Convert rgb() to long hex
                if (params.rgb2hex && (match = val.match(regRGB))) {
                    match = match.slice(1, 4).map(function (m) {
                        if (m.indexOf("%") > -1)
                            m = Math.round(parseFloat(m) * 2.55);

                        return Math.max(0, Math.min(m, 255));
                    });

                    val = rgb2hex(match);
                }

                // Convert long hex to short hex
                if (params.shorthex && (match = val.match(regHEX))) {
                    val = "#" + match[0][1] + match[0][3] + match[0][5];
                }

                // Convert hex to short name
                if (params.shortname) {
                    var lowerVal = val.toLowerCase();
                    if (lowerVal in collections.colorsShortNames) {
                        val = collections.colorsShortNames[lowerVal];
                    }
                }

                attr.value = val;
            }
        });
    }
};

function rgb2hex(rgb) {
    return (
        "#" +
        ("00000" + ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16))
            .slice(-6)
            .toUpperCase()
    );
}
