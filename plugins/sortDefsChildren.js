"use strict";

exports.type = "perItem";

exports.active = true;

exports.description = "Sorts children of <defs> to improve compression";

exports.fn = function (item) {
    if (item.isElem("defs")) {
        if (item.content) {
            var frequency = item.content.reduce(function (frequency, child) {
                if (child.elem in frequency) {
                    frequency[child.elem]++;
                } else {
                    frequency[child.elem] = 1;
                }
                return frequency;
            }, {});
            item.content.sort(function (a, b) {
                var frequencyComparison = frequency[b.elem] - frequency[a.elem];
                if (frequencyComparison !== 0) {
                    return frequencyComparison;
                }
                var lengthComparison = b.elem.length - a.elem.length;
                if (lengthComparison !== 0) {
                    return lengthComparison;
                }
                return a.elem != b.elem ? (a.elem > b.elem ? -1 : 1) : 0;
            });
        }

        return true;
    }
};
