'use strict';

const read = require('./read');
const parse = require('./parse');
const gather = require('./gather');
const defaultFormat = require('./formats/deps.js');

module.exports = function (config, format) {
    format || (format = defaultFormat);

    return gather(config)
        .then(read(format.reader))
        .then(parse(format.parser));
};
