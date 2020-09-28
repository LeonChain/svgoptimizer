"use strict";

exports.type = "perItem";

exports.active = true;

exports.description = "converts non-eccentric <ellipse>s to <circle>s";

exports.fn = function (item) {
    if (item.isElem("ellipse")) {
        var rx = item.attr("rx").value || 0;
        var ry = item.attr("ry").value || 0;

        if (
            rx === ry ||
            rx === "auto" ||
            ry === "auto" // SVG2
        ) {
            var radius = rx !== "auto" ? rx : ry;
            item.renameElem("circle");
            item.removeAttr(["rx", "ry"]);
            item.addAttr({
                name: "r",
                value: radius,
                prefix: "",
                local: "r",
            });
        }
    }
    return;
};
