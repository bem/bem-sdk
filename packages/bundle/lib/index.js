'use strict';

const assert = require('assert');
const path = require('path');

const bemjsonToDecl = require('@bem/sdk.bemjson-to-decl');

module.exports = class BemBundle {
    /**
     * @constructor
     * @param {Object} opts - Params
     * @param {?(String[])} opts.levels - Additional levels used for bundle
     * @param {?String} opts.name - Bundle name (can be empty if path given)
     * @param {?String} opts.path - Bundle path (can be empty if name given)
     * @param {?BEMJSON} opts.bemjson - BEMJSON. It used to calculate decl.
     * @param {?(BemEntityName[])} opts.decl - BEMDecl. Must exist if no bemjson passed
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

        this._opts = opts;
        this._isBundle = true;
    }

    get name() {
        return this._opts.name || (this._opts.name = path.basename(this._opts.path).split('.')[0]);
    }

    get bemjson() {
        return this._opts.bemjson;
    }

    get decl() {
        return this._opts.decl || (this._opts.decl = bemjsonToDecl.convert(this._opts.bemjson));
    }

    get levels() {
        return this._opts.levels || [];
    }

    get path() {
        return this._opts.path || '.';
    }

    static isBundle(bundle) {
        return bundle._isBundle;
    }
}
