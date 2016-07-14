'use strict';

const bemjsonToDecl = require('bemjson-to-decl');
const assert = require('assert');
const path = require('path');

module.exports = class BemBundle {
    /**
     * @constructor
     * @param {Object} opts - Params
     * @param {?(String[])} opts.levels - Additional levels used for bundle
     * @param {?String} opts.name - Bundle name (can be empty if path given)
     * @param {?String} opts.path - Bundle path (can be empty if name given)
     * @param {?BEMJSON} opts.bemjson - BEMJSON. It used to calculate decl.
     * @param {?BEMDecl} opts.decl - BEMDecl. Must exist if no bemjson passed
     */
    constructor(opts) {
        assert(opts.bemjson || opts.decl, 'BEMJSON or BEMDECL must be present');
        assert(!opts.bemjson || typeof opts.bemjson === 'object',
            'BEMJSON should be an object'
        );
        assert(!opts.levels || Array.isArray(opts.levels),
            'Levels must be array of string'
        );
        assert(opts.name || opts.path, 'Bundle name or path must be present');
        assert(!opts.path || typeof opts.path === 'string',
            'Path must be a string'
        );
        this.name = opts.name || path.basename(opts.path).split('.')[0];
        this.bemjson = opts.bemjson;
        this.decl = opts.decl || bemjsonToDecl.convert(opts.bemjson);
        this.levels = opts.levels || [];
        this.path = opts.path || '.';
    }
}
