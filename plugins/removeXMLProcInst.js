'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes XML processing instructions';

exports.fn = function(item) {

    return !(item.processinginstruction && item.processinginstruction.name === 'xml');

};
