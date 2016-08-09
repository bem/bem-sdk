'use strict';

const defaultParser = require('./formats/deps.js/parser');

module.exports = function parse(parser) {
    parser || (parser = defaultParser);

    return function (deps) {
        return new Promise(
            (resolve) => {
                resolve(parser(deps));
            }
        );
    };
};
