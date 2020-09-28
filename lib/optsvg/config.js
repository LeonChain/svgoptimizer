"use strict";

var FS = require("fs");
var PATH = require("path");
var yaml = require("js-yaml");

module.exports = function (config) {
    var defaults;
    config = (typeof config == "object" && config) || {};

    if (config.plugins && !Array.isArray(config.plugins)) {
        return {
            error:
                "Error: Invalid plugins list. Provided 'plugins' in config should be an array.",
        };
    }

    if (config.full) {
        defaults = config;

        if (Array.isArray(defaults.plugins)) {
            defaults.plugins = preparePluginsArray(config, defaults.plugins);
        }
    } else {
        defaults = Object.assign(
            {},
            yaml.safeLoad(
                FS.readFileSync(__dirname + "/../../.optsvg.yml", "utf8")
            )
        );
        defaults.plugins = preparePluginsArray(config, defaults.plugins || []);
        defaults = extendConfig(defaults, config);
    }

    if ("floatPrecision" in config && Array.isArray(defaults.plugins)) {
        defaults.plugins.forEach(function (plugin) {
            if (plugin.params && "floatPrecision" in plugin.params) {
                // Don't touch default plugin params
                plugin.params = Object.assign({}, plugin.params, {
                    floatPrecision: config.floatPrecision,
                });
            }
        });
    }

    if ("datauri" in config) {
        defaults.datauri = config.datauri;
    }

    if (Array.isArray(defaults.plugins)) {
        defaults.plugins = optimizePluginsArray(defaults.plugins);
    }

    return defaults;
};

function preparePluginsArray(config, plugins) {
    var plugin, key;

    return plugins.map(function (item) {
        // {}
        if (typeof item === "object") {
            key = Object.keys(item)[0];

            // custom
            if (
                typeof item[key] === "object" &&
                item[key].fn &&
                typeof item[key].fn === "function"
            ) {
                plugin = setupCustomPlugin(key, item[key]);
            } else {
                plugin = setPluginActiveState(
                    loadPlugin(config, key, item[key].path),
                    item,
                    key
                );
                plugin.name = key;
            }

            // name
        } else {
            plugin = loadPlugin(config, item);
            plugin.name = item;
            if (typeof plugin.params === "object") {
                plugin.params = Object.assign({}, plugin.params);
            }
        }

        return plugin;
    });
}

function extendConfig(defaults, config) {
    var key;

    // plugins
    if (config.plugins) {
        config.plugins.forEach(function (item) {
            // {}
            if (typeof item === "object") {
                key = Object.keys(item)[0];

                if (item[key] == null) {
                    console.error(
                        `Error: '${key}' plugin is misconfigured! Have you padded its content in YML properly?\n`
                    );
                }

                // custom
                if (
                    typeof item[key] === "object" &&
                    item[key].fn &&
                    typeof item[key].fn === "function"
                ) {
                    defaults.plugins.push(setupCustomPlugin(key, item[key]));

                    // plugin defined via path
                } else if (typeof item[key] === "object" && item[key].path) {
                    defaults.plugins.push(
                        setPluginActiveState(
                            loadPlugin(config, undefined, item[key].path),
                            item,
                            key
                        )
                    );
                } else {
                    defaults.plugins.forEach(function (plugin) {
                        if (plugin.name === key) {
                            plugin = setPluginActiveState(plugin, item, key);
                        }
                    });
                }
            }
        });
    }

    defaults.multipass = config.multipass;

    // svg2js
    if (config.svg2js) {
        defaults.svg2js = config.svg2js;
    }

    // js2svg
    if (config.js2svg) {
        defaults.js2svg = config.js2svg;
    }

    return defaults;
}

function setupCustomPlugin(name, plugin) {
    plugin.active = true;
    plugin.params = Object.assign({}, plugin.params || {});
    plugin.name = name;

    return plugin;
}

function optimizePluginsArray(plugins) {
    var prev;

    return plugins.reduce(function (plugins, item) {
        if (prev && item.type == prev[0].type) {
            prev.push(item);
        } else {
            plugins.push((prev = [item]));
        }
        return plugins;
    }, []);
}

function setPluginActiveState(plugin, item, key) {
    // name: {}
    if (typeof item[key] === "object") {
        plugin.params = Object.assign({}, plugin.params || {}, item[key]);
        plugin.active = true;

        // name: false
    } else if (item[key] === false) {
        plugin.active = false;

        // name: true
    } else if (item[key] === true) {
        plugin.active = true;
    }

    return plugin;
}

function loadPlugin(config, name, path) {
    var plugin;

    if (!path) {
        plugin = require("../../plugins/" + name);
    } else {
        plugin = require(PATH.resolve(config.__DIR, path));
    }

    return Object.assign({}, plugin);
}
