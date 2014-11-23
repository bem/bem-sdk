var normalize1 = require('./normalize-v1'),
    normalize2 = require('./normalize-v2');

exports.normalize = function (entities, version) {
    return version === '1.0' ? normalize1(entities) : normalize2(entities);
};
