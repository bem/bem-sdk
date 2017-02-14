'use strict';

const assert = require('assert');
const util = require('util');

const BemEntityName = require('@bem/entity-name');

module.exports = class BemCell {
    /**
     * @param {object} obj — representation of cell.
     * @param {BemEntityName} obj.entity — representation of entity name.
     * @param {string} [obj.tech] - tech of cell.
     * @param {string} [obj.layer] - layer of cell.
     */
    constructor(obj) {
        assert(obj && obj.entity, 'Required `entity` field');
        assert(BemEntityName.isBemEntityName(obj.entity), 'The `entity` field should be an instance of BemEntityName');

        this._entity = obj.entity;
        this._layer = obj.layer;
        this._tech = obj.tech;
    }

    /**
     * Returns the name of entity.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     *
     * const cell = new BemCell({
     *     entity: new BemEntityName({ block: 'button', elem: 'text' })
     * });
     *
     * cell.entity; // ➜ BemEntityName { block: 'button', elem: 'text' }
     *
     * @returns {BemEntityName} name of entity.
     */
    get entity() { return this._entity; }

    /**
     * Returns the tech of cell.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     *
     * const cell = new BemCell({
     *     entity: new BemEntityName({ block: 'button', elem: 'text' }),
     *     tech: 'css'
     * });
     *
     * cell.tech; // ➜ css
     *
     * @returns {string} tech of cell.
     */
    get tech() { return this._tech; }

    /**
     * Returns the layer of this cell.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     *
     * const cell = new BemCell({
     *     entity: new BemEntityName({ block: 'button', elem: 'text' }),
     *     layer: 'desktop'
     * });
     *
     * cell.layer; // ➜ desktop
     *
     * @returns {string} layer of cell.
     */
    get layer() { return this._layer; }

    /**
     * Proxies `block` field from entity.
     *
     * @returns {string}
     */
    get block() { return this._entity.block; }

    /**
     * Proxies `elem` field from entity.
     *
     * @returns {string|undefined}
     */
    get elem() { return this._entity.elem; }

    /**
     * Proxies `mod` field from entity.
     *
     * @returns {object|undefined} - field with `name` and `val`
     */
    get mod() { return this._entity.mod; }

    /**
     * Proxies `modVal` field from entity.
     *
     * @deprecated - just for compatibility and can be dropped in future
     * @returns {string|undefined} - modifier name
     */
    get modName() { return this._entity.modName; }

    /**
     * Proxies `modName` field from entity.
     *
     * @deprecated - just for compatibility and can be dropped in future
     * @returns {string|true|undefined} - modifier value
     */
    get modVal() { return this._entity.modVal; }

    /**
     * Returns the identifier of this cell.
     *
     * Important: should only be used to determine uniqueness of cell.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     *
     * const cell = new BemCell({
     *     entity: new BemEntityName({ block: 'button', elem: 'text' }),
     *     tech: 'css',
     *     layer: 'desktop'
     * });
     *
     * cell.id; // ➜ "button__text@desktop.css"
     *
     * @returns {string} identifier of cell.
     */
    get id() {
        if (this._id) {
            return this._id;
        }

        const layer = this._layer ? `@${this._layer}` : '';
        const tech = this._tech ? `.${this._tech}` : '';

        this._id = `${this._entity}${layer}${tech}`;

        return this._id;
    }

    /**
     * Returns string representing the bem cell.
     *
     * Important: If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     * const cell = new BemCell({ entity: new BemEntityName({ block: 'button', mod: 'focused' }),
     *     tech: 'css', layer: 'desktop' });
     *
     * cell.toString(); // button_focused@desktop.css
     *
     * @returns {string}
     */
    toString() { return this.id; }

    /**
     * Returns object representing the bem cell. Is needed for debug in Node.js.
     *
     * In some browsers `console.log()` calls `valueOf()` on each argument.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `entity`, `tech` and `layer`
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     * const cell = new BemCell({ entity: new BemEntityName({ block: 'button', mod: 'focused' }),
     *     tech: 'css', layer: 'desktop' });
     *
     * cell.valueOf();
     *
     * // ➜ { entity: { block: 'button', mod: { name: 'focused', value: true } },
     * //     tech: 'css',
     * //     layer: 'desktop' }
     *
     * @returns {{ entity: {block: string, elem: ?string, mod: ?{name: string, val: *}}, tech: *, layer: *}}
     */
    valueOf() {
        const res = { entity: this._entity.valueOf() };
        this._tech && (res.tech = this._tech);
        this._layer && (res.layer = this._layer);
        return res;
    }

    /**
     * Returns object representing the bem cell. Is needed for debug in Node.js.
     *
     * In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `entity`, `tech` and `layer` fields
     * without private fields.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     * const cell = new BemCell({ entity: new BemEntityName({ block: 'button' }), tech: 'css', layer: 'desktop' });
     *
     * console.log(cell); // BemCell { entity: { block: 'button' }, tech: 'css', layer: 'desktop' }
     *
     * @param {integer} depth — tells inspect how many times to recurse while formatting the object.
     * @param {object} options — An optional `options` object may be passed
     *                           that alters certain aspects of the formatted string.
     * @returns {string}
     */
    inspect(depth, options) {
        const stringRepresentation = util.inspect(this.valueOf(), options);

        return `BemCell ${stringRepresentation}`;
    }

    /**
     * Return raw data for `JSON.stringify()`.
     *
     * @returns {{ entity: {block: string, elem: ?string, mod: ?{name: string, val: *}}, tech: *, layer: *}}
     */
    toJSON() {
        return this.valueOf();
    }

    /**
     * Determines whether specified cell is deep equal to cell or not
     *
     * @param  {BemCell} cell - the cell to compare
     * @returns {Boolean}
     * @example
     * const BemCell = require('@bem/cell');
     * const buttonCell1 = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
     * const buttonCell2 = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
     * const inputCell = BemCell.create({ block: 'input', tech: 'css', layer: 'common' });
     *
     * buttonCell1.isEqual(buttonCell2); // true
     * buttonCell1.isEqual(inputCell); // false
     */
    isEqual(cell) {
        return (cell.tech === this.tech) && (cell.layer === this.layer) && cell.entity.isEqual(this.entity);
    }

    /**
     * Determines whether specified cell is instance of BemCell.
     *
     * @param {BemCell} cell - the cell to check.
     * @returns {boolean} A Boolean indicating whether or not specified entity is instance of BemCell.
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     *
     * const cell = new BemCell({
     *     entity: new BemEntityName({ block: 'button', elem: 'text' })
     * });
     *
     * BemCell.isBemCell(cell); // true
     * BemCell.isBemCell({}); // false
     */
    static isBemCell(cell) {
        return cell && this.name === cell.constructor.name;
    }

    /**
     * Creates BemCell instance by any object representation.
     *
     * @param {object} obj  — representation of cell.
     * @param {string} obj.block — the block name of entity.
     * @param {string} [obj.elem] — the element name of entity.
     * @param {object|string} [obj.mod]   — the modifier of entity.
     * @param {string} [obj.val] — The modifier value of entity. Used if `mod` is a string.
     * @param {string} obj.mod.name — the modifier name of entity.
     * @param {string} [obj.mod.val] — the modifier value of entity.
     * @param {string} [obj.modName] — the modifier name of entity. Used if `mod.name` wasn't specified.
     * @param {string} [obj.modVal] — the modifier value of entity. Used if neither `mod.val` nor `val` were not specified.
     * @param {string} [obj.tech] — technology of cell.
     * @param {string} [obj.layer] — layer of cell.
     * @returns {BemCell} An object representing cell.
     * @example
     * const BemCell = require('@bem/cell');
     *
     * BemCell.create({ block: 'my-button', mod: 'theme', val: 'red', tech: 'css' });
     * BemCell.create({ block: 'my-button', modName: 'theme', modVal: 'red', tech: 'css' });
     * BemCell.create({ entity: { block: 'my-button', modName: 'theme', modVal: 'red' }, tech: 'css' });
     * // BemCell { block: 'my-button', mod: { name: 'theme', val: 'red' }, tech: 'css' }
     */
    static create(obj) {
        if (BemEntityName.isBemEntityName(obj)) {
            return new BemCell({ entity: obj });
        }

        if (BemCell.isBemCell(obj)) {
            return obj;
        }

        const data = {};

        data.entity = BemEntityName.create(obj.entity || obj);

        obj.tech && (data.tech = obj.tech);
        obj.layer && (data.layer = obj.layer);

        return new BemCell(data);
    }
};
