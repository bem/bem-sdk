import assert from 'node:assert';

import normalize from './normalize.js';

/**
 * Parses enb declaration.
 *
 * @param {Object} data - Object with declaration
 * @returns {BemCell[]}
 */
export default (data) => {
    assert(Object.hasOwn(data, 'deps') || Object.hasOwn(data, 'decl'), 'Invalid format of enb declaration.');

    return normalize(data.deps || data.decl);
};
