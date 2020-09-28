"use strict";

module.exports = function (data, info, plugins) {
    plugins.forEach(function (group) {
        switch (group[0].type) {
            case "perItem":
                data = perItem(data, info, group);
                break;
            case "perItemReverse":
                data = perItem(data, info, group, true);
                break;
            case "full":
                data = full(data, info, group);
                break;
        }
    });

    return data;
};

function perItem(data, info, plugins, reverse) {
    function monkeys(items) {
        items.content = items.content.filter(function (item) {
            // reverse pass
            if (reverse && item.content) {
                monkeys(item);
            }

            // main filter
            var filter = true;

            for (var i = 0; filter && i < plugins.length; i++) {
                var plugin = plugins[i];

                if (
                    plugin.active &&
                    plugin.fn(item, plugin.params, info) === false
                ) {
                    filter = false;
                }
            }

            // direct pass
            if (!reverse && item.content) {
                monkeys(item);
            }

            return filter;
        });

        return items;
    }

    return monkeys(data);
}

function full(data, info, plugins) {
    plugins.forEach(function (plugin) {
        if (plugin.active) {
            data = plugin.fn(data, plugin.params, info);
        }
    });

    return data;
}
