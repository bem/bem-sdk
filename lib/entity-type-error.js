'use strict';

const util = require('util');

const ExtendableError = require('es6-error');

/**
 * The EntityTypeError object represents an error when a value is not valid BEM entity.
 */
module.exports = class EntityTypeError extends ExtendableError {
    /**
     * @param {*} obj — not valid object
     * @param {string} [reason] — human-readable reason why object is not valid
     */
    constructor(obj, reason) {
        const str = util.inspect(obj, { depth: 1 });
        const type = obj ? typeof obj : '';
        const message = `the ${type} \`${str}\` is not valid BEM entity`;

        super(reason ? `${message}, ${reason}` : message);
    }
};
