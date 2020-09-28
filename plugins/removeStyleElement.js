'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes <style> element (disabled by default)';

exports.fn = function(item) {

    return !item.isElem('style');

};
