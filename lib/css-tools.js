"use strict";

var csstree = require("css-tree"),
    List = csstree.List,
    stable = require("stable"),
    specificity = require("csso/lib/restructure/prepare/specificity");

function flattenToSelectors(cssAst) {
    var selectors = [];

    csstree.walk(cssAst, {
        visit: "Rule",
        enter: function (node) {
            if (node.type !== "Rule") {
                return;
            }

            var atrule = this.atrule;
            var rule = node;

            node.prelude.children.each(function (selectorNode, selectorItem) {
                var selector = {
                    item: selectorItem,
                    atrule: atrule,
                    rule: rule,
                    pseudos: [],
                };

                selectorNode.children.each(function (
                    selectorChildNode,
                    selectorChildItem,
                    selectorChildList
                ) {
                    if (
                        selectorChildNode.type === "PseudoClassSelector" ||
                        selectorChildNode.type === "PseudoElementSelector"
                    ) {
                        selector.pseudos.push({
                            item: selectorChildItem,
                            list: selectorChildList,
                        });
                    }
                });

                selectors.push(selector);
            });
        },
    });

    return selectors;
}

function filterByMqs(selectors, useMqs) {
    return selectors.filter(function (selector) {
        if (selector.atrule === null) {
            return ~useMqs.indexOf("");
        }

        var mqName = selector.atrule.name;
        var mqStr = mqName;
        if (
            selector.atrule.expression &&
            selector.atrule.expression.children.first().type ===
                "MediaQueryList"
        ) {
            var mqExpr = csstree.generate(selector.atrule.expression);
            mqStr = [mqName, mqExpr].join(" ");
        }

        return ~useMqs.indexOf(mqStr);
    });
}

function filterByPseudos(selectors, usePseudos) {
    return selectors.filter(function (selector) {
        var pseudoSelectorsStr = csstree.generate({
            type: "Selector",
            children: new List().fromArray(
                selector.pseudos.map(function (pseudo) {
                    return pseudo.item.data;
                })
            ),
        });
        return ~usePseudos.indexOf(pseudoSelectorsStr);
    });
}

function cleanPseudos(selectors) {
    selectors.forEach(function (selector) {
        selector.pseudos.forEach(function (pseudo) {
            pseudo.list.remove(pseudo.item);
        });
    });
}

function compareSpecificity(aSpecificity, bSpecificity) {
    for (var i = 0; i < 4; i += 1) {
        if (aSpecificity[i] < bSpecificity[i]) {
            return -1;
        } else if (aSpecificity[i] > bSpecificity[i]) {
            return 1;
        }
    }

    return 0;
}

function compareSimpleSelectorNode(aSimpleSelectorNode, bSimpleSelectorNode) {
    var aSpecificity = specificity(aSimpleSelectorNode),
        bSpecificity = specificity(bSimpleSelectorNode);
    return compareSpecificity(aSpecificity, bSpecificity);
}

function _bySelectorSpecificity(selectorA, selectorB) {
    return compareSimpleSelectorNode(selectorA.item.data, selectorB.item.data);
}

function sortSelectors(selectors) {
    return stable(selectors, _bySelectorSpecificity);
}

function csstreeToStyleDeclaration(declaration) {
    var propertyName = declaration.property,
        propertyValue = csstree.generate(declaration.value),
        propertyPriority = declaration.important ? "important" : "";
    return {
        name: propertyName,
        value: propertyValue,
        priority: propertyPriority,
    };
}

function getCssStr(elem) {
    return elem.content[0].text || elem.content[0].cdata || [];
}

function setCssStr(elem, css) {
    // in case of cdata field
    if (elem.content[0].cdata) {
        elem.content[0].cdata = css;
        return elem.content[0].cdata;
    }

    // in case of text field + if nothing was set yet
    elem.content[0].text = css;
    return elem.content[0].text;
}

module.exports.flattenToSelectors = flattenToSelectors;

module.exports.filterByMqs = filterByMqs;
module.exports.filterByPseudos = filterByPseudos;
module.exports.cleanPseudos = cleanPseudos;

module.exports.compareSpecificity = compareSpecificity;
module.exports.compareSimpleSelectorNode = compareSimpleSelectorNode;

module.exports.sortSelectors = sortSelectors;

module.exports.csstreeToStyleDeclaration = csstreeToStyleDeclaration;

module.exports.getCssStr = getCssStr;
module.exports.setCssStr = setCssStr;
