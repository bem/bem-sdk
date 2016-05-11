'use strict';

const normalize = require('./normalize');
const normalizeHarmony = require('./normalize-harmony');

const normalizers = {
    '1.0': normalize,
    next: normalizeHarmony
};

/**
 * Parses BEMDECL file data
 *
 * @param {{version: string, decl: BEMEntityPart[]}|{blocks: BEMEntityPart[]}} bemdecl [description]
 * @returns {[type]}        [description]
 */
module.exports = function parse(bemdecl) {
    const hasOwn = Object.prototype.hasOwnProperty.bind(Object(bemdecl));

    let version, decl;

    // Legacy 1.0 format
    if (hasOwn('blocks')) {
        version = '1.0';
        decl = bemdecl.blocks;
    } else if (hasOwn('version') && hasOwn('decl')) {
        version = bemdecl.version;
        decl = bemdecl.decl;
    }

    const normalizer = normalizers[version];

    if (!decl || !normalizer) {
        throw new Error('Unknown BEMDECL format.');
    }

    return normalizer(decl);
};
