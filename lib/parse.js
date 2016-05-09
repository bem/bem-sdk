'use strict';

const stream = require('stream');
const defaultParser = require('./formats/deps.js/parser');

module.exports = function parse(parser) {
    parser || (parser = defaultParser);

    var transform = new stream.Transform({ objectMode: true });

    transform._transform = function (entityDeps, encoding, done) {
        this.push(parser(entityDeps));
        done();
    };

    return transform;
};
