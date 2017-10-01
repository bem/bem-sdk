'use strict';

const assert = require('assert');
const util = require('util');

const BemCell = require('@bem/sdk.cell');

class BemFile {
    constructor(opts) {
        assert(typeof opts === 'object' && opts.cell, '@bem/sdk.file: requires cell param');

        this._cell = BemCell.create(opts.cell);

        assert(opts.level == null || typeof opts.level === 'string',
            '@bem/sdk.file: level should be a string or null');
        assert(opts.path == null || typeof opts.path === 'string',
            '@bem/sdk.file: path should be a string or null');

        this._level = opts.level;
        this._path = opts.path;
    }

    get cell() {
        return this._cell;
    }

    get level() {
        return this._level;
    }

    get path() {
        return this._path;
    }

    get entity() {
        return this._cell.entity;
    }

    get tech() {
        return this._cell.tech;
    }

    get layer() {
        return this._cell.layer;
    }

    valueOf() {
        const res = { cell: this._cell.valueOf() };
        this._path && (res.path = this._path);
        this._level && (res.level = this._level);
        return res;
    }

    inspect(depth, options) {
        const stringRepresentation = util.inspect(this.valueOf(), options);

        return `BemFile ${stringRepresentation}`;
    }

    toJSON() {
        return this.valueOf();
    }

    get id() {
        return (this._level ? (this._level + '/') : '') + this._cell.id;
    }
}

module.exports = BemFile;
