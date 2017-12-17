'use strict';

module.exports = {
    format: require('./format'),
    parse: () => { throw new Error('Parse method is not implemented for v1 format') }
};
