"use strict";

exports.type = "perItem";

exports.active = true;

exports.description = "moves some group attributes to the content elements";

var collections = require("./_collections.js"),
    pathElems = collections.pathElems.concat(["g", "text"]),
    referencesProps = collections.referencesProps;

exports.fn = function (item) {
    // move group transform attr to content's pathElems
    if (
        item.isElem("g") &&
        item.hasAttr("transform") &&
        !item.isEmpty() &&
        !item.someAttr(function (attr) {
            return (
                ~referencesProps.indexOf(attr.name) &&
                ~attr.value.indexOf("url(")
            );
        }) &&
        item.content.every(function (inner) {
            return inner.isElem(pathElems) && !inner.hasAttr("id");
        })
    ) {
        item.content.forEach(function (inner) {
            var attr = item.attr("transform");
            if (inner.hasAttr("transform")) {
                inner.attr("transform").value =
                    attr.value + " " + inner.attr("transform").value;
            } else {
                inner.addAttr({
                    name: attr.name,
                    local: attr.local,
                    prefix: attr.prefix,
                    value: attr.value,
                });
            }
        });

        item.removeAttr("transform");
    }
};
