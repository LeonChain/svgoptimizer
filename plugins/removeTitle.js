'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes <title>';

exports.fn = function(item) {

    return !item.isElem('title');

};
