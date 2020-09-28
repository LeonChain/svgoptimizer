"use strict";

var cssSelect = require("css-select");

var svgoCssSelectAdapter = require("./css-select-adapter");
var cssSelectOpts = {
    xmlMode: true,
    adapter: svgoCssSelectAdapter,
};

var JSAPI = (module.exports = function (data, parentNode) {
    Object.assign(this, data);
    if (parentNode) {
        Object.defineProperty(this, "parentNode", {
            writable: true,
            value: parentNode,
        });
    }
});

JSAPI.prototype.clone = function () {
    var node = this;
    var nodeData = {};

    Object.keys(node).forEach(function (key) {
        if (key !== "class" && key !== "style" && key !== "content") {
            nodeData[key] = node[key];
        }
    });

    // Deep-clone node data.
    nodeData = JSON.parse(JSON.stringify(nodeData));

    // parentNode gets set to a proper object by the parent clone,
    // but it needs to be true/false now to do the right thing
    // in the constructor.
    var clonedNode = new JSAPI(nodeData, !!node.parentNode);

    if (node.class) {
        clonedNode.class = node.class.clone(clonedNode);
    }
    if (node.style) {
        clonedNode.style = node.style.clone(clonedNode);
    }
    if (node.content) {
        clonedNode.content = node.content.map(function (childNode) {
            var clonedChild = childNode.clone();
            clonedChild.parentNode = clonedNode;
            return clonedChild;
        });
    }

    return clonedNode;
};

JSAPI.prototype.isElem = function (param) {
    if (!param) return !!this.elem;

    if (Array.isArray(param))
        return !!this.elem && param.indexOf(this.elem) > -1;

    return !!this.elem && this.elem === param;
};

JSAPI.prototype.renameElem = function (name) {
    if (name && typeof name === "string") this.elem = this.local = name;

    return this;
};

/**
 * Determine if element is empty.
 *
 * @return {Boolean}
 */
JSAPI.prototype.isEmpty = function () {
    return !this.content || !this.content.length;
};

JSAPI.prototype.closestElem = function (elemName) {
    var elem = this;

    while ((elem = elem.parentNode) && !elem.isElem(elemName));

    return elem;
};

JSAPI.prototype.spliceContent = function (start, n, insertion) {
    if (arguments.length < 2) return [];

    if (!Array.isArray(insertion))
        insertion = Array.apply(null, arguments).slice(2);

    insertion.forEach(function (inner) {
        inner.parentNode = this;
    }, this);

    return this.content.splice.apply(
        this.content,
        [start, n].concat(insertion)
    );
};

JSAPI.prototype.hasAttr = function (name, val) {
    if (!this.attrs || !Object.keys(this.attrs).length) return false;

    if (!arguments.length) return !!this.attrs;

    if (val !== undefined)
        return !!this.attrs[name] && this.attrs[name].value === val.toString();

    return !!this.attrs[name];
};

JSAPI.prototype.hasAttrLocal = function (localName, val) {
    if (!this.attrs || !Object.keys(this.attrs).length) return false;

    if (!arguments.length) return !!this.attrs;

    var callback;

    switch (val != null && val.constructor && val.constructor.name) {
        case "Number": // same as String
        case "String":
            callback = stringValueTest;
            break;
        case "RegExp":
            callback = regexpValueTest;
            break;
        case "Function":
            callback = funcValueTest;
            break;
        default:
            callback = nameTest;
    }
    return this.someAttr(callback);

    function nameTest(attr) {
        return attr.local === localName;
    }

    function stringValueTest(attr) {
        return attr.local === localName && val == attr.value;
    }

    function regexpValueTest(attr) {
        return attr.local === localName && val.test(attr.value);
    }

    function funcValueTest(attr) {
        return attr.local === localName && val(attr.value);
    }
};

JSAPI.prototype.attr = function (name, val) {
    if (!this.hasAttr() || !arguments.length) return undefined;

    if (val !== undefined)
        return this.hasAttr(name, val) ? this.attrs[name] : undefined;

    return this.attrs[name];
};

JSAPI.prototype.computedAttr = function (name, val) {
    /* jshint eqnull: true */
    if (!arguments.length) return;

    for (
        var elem = this;
        elem && (!elem.hasAttr(name) || !elem.attr(name).value);
        elem = elem.parentNode
    );

    if (val != null) {
        return elem ? elem.hasAttr(name, val) : false;
    } else if (elem && elem.hasAttr(name)) {
        return elem.attrs[name].value;
    }
};

JSAPI.prototype.removeAttr = function (name, val, recursive) {
    if (!arguments.length) return false;

    if (Array.isArray(name)) {
        name.forEach(this.removeAttr, this);
        return false;
    }

    if (!this.hasAttr(name)) return false;

    if (!recursive && val && this.attrs[name].value !== val) return false;

    delete this.attrs[name];

    if (!Object.keys(this.attrs).length) delete this.attrs;

    return true;
};

JSAPI.prototype.addAttr = function (attr) {
    attr = attr || {};

    if (
        attr.name === undefined ||
        attr.prefix === undefined ||
        attr.local === undefined
    )
        return false;

    this.attrs = this.attrs || {};
    this.attrs[attr.name] = attr;

    if (attr.name === "class") {
        // newly added class attribute
        this.class.hasClass();
    }

    if (attr.name === "style") {
        // newly added style attribute
        this.style.hasStyle();
    }

    return this.attrs[attr.name];
};

JSAPI.prototype.eachAttr = function (callback, context) {
    if (!this.hasAttr()) return false;

    for (var name in this.attrs) {
        callback.call(context, this.attrs[name]);
    }

    return true;
};

JSAPI.prototype.someAttr = function (callback, context) {
    if (!this.hasAttr()) return false;

    for (var name in this.attrs) {
        if (callback.call(context, this.attrs[name])) return true;
    }

    return false;
};

JSAPI.prototype.querySelectorAll = function (selectors) {
    var matchedEls = cssSelect(selectors, this, cssSelectOpts);

    return matchedEls.length > 0 ? matchedEls : null;
};

JSAPI.prototype.querySelector = function (selectors) {
    return cssSelect.selectOne(selectors, this, cssSelectOpts);
};

JSAPI.prototype.matches = function (selector) {
    return cssSelect.is(this, selector, cssSelectOpts);
};
