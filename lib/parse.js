'use strict';

const assert = require('assert');

const nodeEval = require('node-eval');

const detect = require('./detect');
const normalize = require('./normalize');
const normalize2 = require('./normalize2');
const normalizeHarmony = require('./normalize-harmony');

const normalizers = {
    v1: normalize,
    v2: normalize2,
    harmony: normalizeHarmony
};

/**
 * Parses BEMDECL file data
 *
 * @param {String|Object} bemdecl - string of bemdecl or object
 * @returns {Array<BemEntity>}      Array of normalized entities
 */
module.exports = function parse(bemdecl) {
    assert(typeof bemdecl === 'object' || typeof bemdecl === 'string', 'Bemdecl must be String or Object');

    const declaration = (typeof bemdecl === 'string') ? nodeEval(bemdecl) : bemdecl;
    const hasOwn = Object.prototype.hasOwnProperty.bind(Object(declaration));
    const format = declaration.format || detect(declaration);

    switch (format) {
        case 'v1':
            assert(hasOwn('blocks'), 'Invalid declaration format');
            return normalizers.v1(declaration.blocks);
        case 'v2':
        case 'enb':
            assert(hasOwn('decl') || hasOwn('deps'), 'Invalid format of declaration.');
            return normalizers.v2(declaration.decl || declaration.deps);
        case 'harmony':
            assert(hasOwn('decl'), 'Invalid format of declaration.');
            return normalizers.harmony(declaration.decl);
        default:
            throw new Error('Unknown BEMDECL format.');
    }
};
