'use strict';

const assert = require('assert');
const util = require('util');

const BemCell = require('@bem/sdk.cell');

class BemFile {
    /**
     * @param {Object} opts — representation of file.
     * @param {BemCell} opts.cell — representation of entity name.
     * @param {String} [opts.path] - path to file.
     * @param {String} [opts.level] - base level path.
     */
    constructor(opts) {
        assert(typeof opts === 'object' && opts.cell, '@bem/sdk.file: requires cell param');

        this._cell = BemCell.create(opts.cell);

        assert(opts.level == null || typeof opts.level === 'string',
            '@bem/sdk.file: level should be a string or null');
        assert(opts.path == null || typeof opts.path === 'string',
            '@bem/sdk.file: path should be a string or null');

        this._level = opts.level;
        this._path = opts.path;

        this.__isBemFile__ = true;
    }

    /**
     * Returns the cell of the file.
     *
     * @example
     * const BemFile = require('@bem/sdk.file');
     * const BemCell = require('@bem/sdk.cell');
     *
     * const file = new BemFile({
     *     cell: BemCell.create({ block: 'button', elem: 'text', tech: 'css' })
     * });
     *
     * file.cell; // ➜ BemCell { entity: BemEntityName { block: 'button', elem: 'text' }, tech: 'css' }
     *
     * @return {[type]} [description]
     */
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

    /**
     * Determines whether specified file is deep equal to another file or not
     *
     * @example
     * const BemFile = require('@bem/sdk.file');
     * const buttonFile1 = BemFile.create({ block: 'button', tech: 'css', layer: 'desktop', level: 'desktop.blocks' });
     * const buttonFile2 = BemFile.create({ block: 'button', tech: 'css', layer: 'desktop', level: 'desktop.blocks' });
     * const inputFile = BemFile.create({ block: 'input', tech: 'css', layer: 'common', level: 'common.blocks' });
     *
     * buttonFile1.isEqual(buttonFile2); // true
     * buttonFile1.isEqual(inputFile); // false
     *
     * @param {BemFile} file - the file to compare
     * @returns {Boolean}
     */
    isEqual(file) {
        return (file.path === this.path) && (file.level === this.level) && file.cell.isEqual(this.cell);
    }

    /**
     * Determines whether specified file is instance of BemFile.
     *
     * @example
     * const BemFile = require('@bem/sdk.file');
     * const BemCell = require('@bem/sdk.cell');
     *
     * const file = new BemFile({
     *     cell: new BemCell({ block: 'button', elem: 'text', tech: 'css' }),
     *     path: 'button__text.css'
     * });
     *
     * BemFile.isBemFile(file); // true
     * BemFile.isBemFile({}); // false
     *
     * @param {(BemFile|*)} file - the file to check.
     * @returns {boolean} A Boolean indicating whether or not specified entity is instance of BemFile.
     */
    static isBemFile(file) {
        return !!file && Boolean(file.__isBemFile__);
    }

    /**
     * Creates BemFile instance by any object representation.
     *
     * @example
     * const BemFile = require('@bem/sdk.file');
     *
     * BemFile.create({ block: 'my-button', mod: 'theme', val: 'red', tech: 'css' });
     * BemFile.create({ block: 'my-button', modName: 'theme', modVal: 'red', tech: 'css' });
     * BemFile.create({ entity: { block: 'my-button', modName: 'theme', modVal: 'red' }, tech: 'css' });
     * // BemFile { block: 'my-button', mod: { name: 'theme', val: 'red' }, tech: 'css' }
     *
     * @param {Object} obj — representation of file.
     * @param {string} obj.block — the block name of entity.
     * @param {string} [obj.elem] — the element name of entity.
     * @param {BemMod|string} [obj.mod] — the modifier of entity.
     * @param {string} [obj.val] — The modifier value of entity. Used if `mod` is a string.
     * @param {string} [obj.modName] — the modifier name of entity. Used if `mod.name` wasn't specified.
     * @param {string} [obj.modVal] — the modifier value of entity. Used if neither `mod.val` nor `val` were not specified.
     * @param {string} [obj.tech] — technology of file.
     * @param {string} [obj.layer] — layer of file.
     * @param {string} [obj.level] — base level path.
     * @param {string} [obj.path] — full path to file.
     * @returns {BemFile} An object representing file.
     */
    static create(obj) {
        if (BemFile.isBemFile(obj)) {
            return obj;
        }

        const file = {};
        obj.level && (file.level = obj.level);
        obj.path && (file.path = obj.path);
        file.cell = BemCell.create(obj);
        return new BemFile(file);
    }
}

module.exports = BemFile;
