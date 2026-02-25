import { inspect } from 'node:util';

/**
 * The EntityTypeError object represents an error when a value is not valid BEM entity.
 */
class EntityTypeError extends Error {
    /**
     * @param {*} obj — not valid object
     * @param {string} [reason] — human-readable reason why object is not valid
     */
    constructor(obj, reason) {
        const str = inspect(obj, { depth: 1 });
        const type = obj ? typeof obj : '';
        const message = `the ${type} \`${str}\` is not valid BEM entity`;

        super(reason ? `${message}, ${reason}` : message);
        this.name = this.constructor.name;
    }
}

export default EntityTypeError;
