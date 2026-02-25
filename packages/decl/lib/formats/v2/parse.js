import assert from 'node:assert';

import normalize from './normalize.js';

/**
 * Parses v2 declaration.
 *
 * @param {Object} data - Object with declaration
 * @returns {BemCell[]}
 */
export default (data) => {
    assert(Object.hasOwn(data, 'decl'), 'Invalid format of v2 declaration.');

    return normalize(data.decl);
};
