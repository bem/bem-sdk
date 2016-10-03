'use strict';

const assert = require('assert');

const nodeEval = require('node-eval');

const detect = require('./detect');

/**
 * Parses BEMDECL file data
 *
 * @param {String|Object} bemdecl - string of bemdecl or object
 * @returns {Array<BemEntity>}      Array of normalized entities
 */
module.exports = function parse(bemdecl) {
    assert(typeof bemdecl === 'object' || typeof bemdecl === 'string', 'Bemdecl must be String or Object');

    const normalize = require('.').normalize;

    const declaration = (typeof bemdecl === 'string') ? nodeEval(bemdecl) : bemdecl;
    const hasOwn = Object.prototype.hasOwnProperty.bind(Object(declaration));
    const format = declaration.format || detect(declaration);

    let decl;

    switch (format) {
        case 'v1':
            assert(hasOwn('blocks'), 'Invalid declaration format');
            decl = declaration.blocks;
            break;
        case 'v2':
        case 'enb':
            assert(hasOwn('decl') || hasOwn('deps'), 'Invalid format of declaration.');
            decl = declaration.decl || declaration.deps;
            break;
        case 'harmony':
            assert(hasOwn('decl'), 'Invalid format of declaration.');
            decl = declaration.decl;
            break;
        default:
            throw new Error('Unknown BEMDECL format.');
    }

    return normalize(decl, { format: format });
};
