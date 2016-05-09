'use strict';

const read = require('./read');
const parse = require('./parse');
const defaultFormat = require('./formats/deps.js');

module.exports = function (config, format) {
    format || (format = defaultFormat);

    return read(config, format.reader)
        .pipe(parse(format.parser));
};
