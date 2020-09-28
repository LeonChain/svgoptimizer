"use strict";

var DEFAULT_SEPARATOR = ":";

exports.type = "perItem";

exports.active = false;

exports.description = "removes specified attributes";

exports.params = {
    elemSeparator: DEFAULT_SEPARATOR,
    preserveCurrentColor: false,
    attrs: [],
};

exports.fn = function (item, params) {
    // wrap into an array if params is not
    if (!Array.isArray(params.attrs)) {
        params.attrs = [params.attrs];
    }

    if (item.isElem()) {
        var elemSeparator =
            typeof params.elemSeparator == "string"
                ? params.elemSeparator
                : DEFAULT_SEPARATOR;
        var preserveCurrentColor =
            typeof params.preserveCurrentColor == "boolean"
                ? params.preserveCurrentColor
                : false;

        // prepare patterns
        var patterns = params.attrs.map(function (pattern) {
            // if no element separators (:), assume it's attribute name, and apply to all elements *regardless of value*
            if (pattern.indexOf(elemSeparator) === -1) {
                pattern = [
                    ".*",
                    elemSeparator,
                    pattern,
                    elemSeparator,
                    ".*",
                ].join("");

                // if only 1 separator, assume it's element and attribute name, and apply regardless of attribute value
            } else if (pattern.split(elemSeparator).length < 3) {
                pattern = [pattern, elemSeparator, ".*"].join("");
            }

            // create regexps for element, attribute name, and attribute value
            return pattern.split(elemSeparator).map(function (value) {
                // adjust single * to match anything
                if (value === "*") {
                    value = ".*";
                }

                return new RegExp(["^", value, "$"].join(""), "i");
            });
        });

        // loop patterns
        patterns.forEach(function (pattern) {
            // matches element
            if (pattern[0].test(item.elem)) {
                // loop attributes
                item.eachAttr(function (attr) {
                    var name = attr.name;
                    var value = attr.value;
                    var isFillCurrentColor =
                        preserveCurrentColor &&
                        name == "fill" &&
                        value == "currentColor";
                    var isStrokeCurrentColor =
                        preserveCurrentColor &&
                        name == "stroke" &&
                        value == "currentColor";

                    if (!(isFillCurrentColor || isStrokeCurrentColor)) {
                        // matches attribute name
                        if (pattern[1].test(name)) {
                            // matches attribute value
                            if (pattern[2].test(attr.value)) {
                                item.removeAttr(name);
                            }
                        }
                    }
                });
            }
        });
    }
};
