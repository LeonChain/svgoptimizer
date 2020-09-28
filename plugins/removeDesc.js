"use strict";

exports.type = "perItem";

exports.active = true;

exports.params = {
    removeAny: true,
};

exports.description = "removes <desc>";

var standardDescs = /^(Created with|Created using)/;

exports.fn = function (item, params) {
    return (
        !item.isElem("desc") ||
        !(
            params.removeAny ||
            item.isEmpty() ||
            standardDescs.test(item.content[0].text)
        )
    );
};
