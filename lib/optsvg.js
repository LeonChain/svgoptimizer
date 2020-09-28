"use strict";

var CONFIG = require("./optsvg/config.js"),
    SVG2JS = require("./optsvg/svg2js.js"),
    PLUGINS = require("./optsvg/plugins.js"),
    JSAPI = require("./optsvg/jsAPI.js"),
    encodeSVGDatauri = require("./optsvg/tools.js").encodeSVGDatauri,
    JS2SVG = require("./optsvg/js2svg.js");

var OPTSVG = function (config) {
    this.config = CONFIG(config);
};

OPTSVG.prototype.optimize = function (svgstr, info) {
    info = info || {};
    return new Promise((resolve, reject) => {
        if (this.config.error) {
            reject(this.config.error);
            return;
        }

        var config = this.config,
            maxPassCount = config.multipass ? 10 : 1,
            counter = 0,
            prevResultSize = Number.POSITIVE_INFINITY,
            optimizeOnceCallback = (svgjs) => {
                if (svgjs.error) {
                    reject(svgjs.error);
                    return;
                }

                info.multipassCount = counter;
                if (
                    ++counter < maxPassCount &&
                    svgjs.data.length < prevResultSize
                ) {
                    prevResultSize = svgjs.data.length;
                    this._optimizeOnce(svgjs.data, info, optimizeOnceCallback);
                } else {
                    if (config.datauri) {
                        svgjs.data = encodeSVGDatauri(
                            svgjs.data,
                            config.datauri
                        );
                    }
                    if (info && info.path) {
                        svgjs.path = info.path;
                    }
                    resolve(svgjs);
                }
            };

        this._optimizeOnce(svgstr, info, optimizeOnceCallback);
    });
};

OPTSVG.prototype._optimizeOnce = function (svgstr, info, callback) {
    var config = this.config;

    SVG2JS(svgstr, function (svgjs) {
        if (svgjs.error) {
            callback(svgjs);
            return;
        }

        svgjs = PLUGINS(svgjs, info, config.plugins);

        callback(JS2SVG(svgjs, config.js2svg));
    });
};

OPTSVG.prototype.createContentItem = function (data) {
    return new JSAPI(data);
};

OPTSVG.Config = CONFIG;

module.exports = OPTSVG;
// Offer ES module interop compatibility.
module.exports.default = OPTSVG;
