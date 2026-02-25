import assert from 'node:assert';

import normalize from './normalize.js';

/**
 * Parses v1 declaration.
 *
 * @param {Object} data - Object with declaration
 * @returns {BemCell[]}
 */
export default (data) => {
    assert(data.hasOwnProperty('blocks'), 'Invalid format of v1 declaration.');

    return normalize(data.blocks);
};
