import assert from 'node:assert';
import vm from 'node:vm';

import formats from './formats/index.js';
import detect from './detect.js';

/**
 * Evaluate code string similar to node-eval.
 * Supports both module.exports style and expression style (e.g. `({ blocks: [...] })`).
 *
 * @param {String} code - code to evaluate
 * @returns {*} - evaluated result
 */
function nodeEval(code) {
    const m = { exports: {} };
    const wrapped = `(function(module, exports) { return ${code}\n})(m, m.exports)`;
    const result = vm.runInNewContext(wrapped, { m });
    // If the code is an expression (like `({ blocks: [...] })`), return the expression result.
    // If it uses module.exports, return m.exports.
    return result !== undefined ? result : m.exports;
}

/**
 * Parses BEMDECL file data
 *
 * @param {String|Object} bemdecl - string of bemdecl or object
 * @returns {Array<BemEntity>}      Array of normalized entities
 */
export default function parse(bemdecl) {
    assert(typeof bemdecl === 'object' || typeof bemdecl === 'string', 'Bemdecl must be String or Object');

    const data = (typeof bemdecl === 'string') ? nodeEval(bemdecl) : bemdecl;
    const formatName = data.format || detect(data);
    const format = formats[formatName];

    if (!format) {
        throw new Error('Unknown BEMDECL format.');
    }

    return format.parse(data);
}
