"use strict";

exports.type = "full";

exports.active = true;

exports.description =
    "remove or cleanup enable-background attribute when possible";

exports.fn = function (data) {
    var regEnableBackground = /^new\s0\s0\s([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)\s([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)$/,
        hasFilter = false,
        elems = ["svg", "mask", "pattern"];

    function checkEnableBackground(item) {
        if (
            item.isElem(elems) &&
            item.hasAttr("enable-background") &&
            item.hasAttr("width") &&
            item.hasAttr("height")
        ) {
            var match = item
                .attr("enable-background")
                .value.match(regEnableBackground);

            if (match) {
                if (
                    item.attr("width").value === match[1] &&
                    item.attr("height").value === match[3]
                ) {
                    if (item.isElem("svg")) {
                        item.removeAttr("enable-background");
                    } else {
                        item.attr("enable-background").value = "new";
                    }
                }
            }
        }
    }

    function checkForFilter(item) {
        if (item.isElem("filter")) {
            hasFilter = true;
        }
    }

    function monkeys(items, fn) {
        items.content.forEach(function (item) {
            fn(item);

            if (item.content) {
                monkeys(item, fn);
            }
        });
        return items;
    }

    var firstStep = monkeys(data, function (item) {
        checkEnableBackground(item);
        if (!hasFilter) {
            checkForFilter(item);
        }
    });

    return hasFilter
        ? firstStep
        : monkeys(firstStep, function (item) {
              //we don't need 'enable-background' if we have no filters
              item.removeAttr("enable-background");
          });
};
