import assert from 'node:assert';

import normalize from './normalize.js';

/**
 * Parses harmony declaration.
 *
 * @param {Object} data - Object with declaration
 * @returns {BemCell[]}
 */
export default (data) => {
    assert(data.hasOwnProperty('decl'), 'Invalid format of harmony declaration.');

    return normalize(data.decl);
};
