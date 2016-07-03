'use strict';

const ExtendableError = require('es6-error');
const simplifyVertices = require('./test-utils').simplifyVertices;

/**
 * СircularDependencyError
 */
module.exports = class СircularDependencyError extends ExtendableError {
    constructor(loop) {
        loop = Array.from(loop || []);

        let message = 'dependency graph has circular dependencies';
        if (loop.length) {
            message = `${message} (${loop.join(' <- ')})`;
        }

        super(message);

        this._loop = loop;
    }
    get loop() {
        return simplifyVertices(this._loop);
    }
};
