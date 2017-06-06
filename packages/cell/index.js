'use strict';

const assert = require('assert');
const util = require('util');

const deprecate = require('depd')(require('./package.json').name);

const BemEntityName = require('@bem/entity-name');

module.exports = class BemCell {
    /**
     * @param {Object} obj — representation of cell.
     * @param {BemEntityName} obj.entity — representation of entity name.
     * @param {String} [obj.tech] - tech of cell.
     * @param {String} [obj.layer] - layer of cell.
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
     * @returns {String} tech of cell.
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
     * @returns {String} layer of cell.
     */
    get layer() { return this._layer; }

    /**
     * Proxies `block` field from entity.
     *
     * @returns {String}
     */
    get block() { return this._entity.block; }

    /**
     * Proxies `elem` field from entity.
     *
     * @returns {String|undefined}
     */
    get elem() { return this._entity.elem; }

    /**
     * Proxies `mod` field from entity.
     *
     * @returns {Object|undefined} - field with `name` and `val`
     */
    get mod() { return this._entity.mod; }

    /**
     * Proxies `modVal` field from entity.
     *
     * @deprecated - just for compatibility. Use {@link BemCell#mod.name}
     * @returns {String|undefined} - modifier name
     */
    get modName() {
        deprecate('modName: just for compatibility and can be dropped in future. Instead use \'mod.name\'');
        return this._entity.modName;
    }

    /**
     * Proxies `modVal` field from entity.
     *
     * @deprecated - just for compatibility. Use {@link BemCell#mod.val}
     * @returns {String|true|undefined} - modifier value
     */
    get modVal() {
        deprecate('modVal: just for compatibility and can be dropped in future. Instead use \'mod.val\'');
        return this._entity.modVal;
    }

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
     * @returns {String} identifier of cell.
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
     * const BemEntityName§ = require('@bem/entity-name');
     * const cell = new BemCell({ entity: new BemEntityName({ block: 'button', mod: 'focused' }),
     *     tech: 'css', layer: 'desktop' });
     *
     * cell.toString(); // button_focused@desktop.css
     *
     * @returns {String}
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
     * @returns {{ entity: {block: String, elem: ?String, mod: ?{name: String, val: *}}, tech: *, layer: *}}
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
     * @param {Number} depth — tells inspect how many times to recurse while formatting the object.
     * @param {Object} [options] — An optional `options` object may be passed
     *                           that alters certain aspects of the formatted string.
     * @returns {String}
     */
    inspect(depth, options) {
        const stringRepresentation = util.inspect(this.valueOf(), options);

        return `BemCell ${stringRepresentation}`;
    }

    /**
     * Return raw data for `JSON.stringify()`.
     *
     * @returns {{ entity: {block: String, elem: ?String, mod: ?{name: String, val: *}}, tech: *, layer: *}}
     */
    toJSON() {
        return this.valueOf();
    }

    /**
     * Determines whether specified cell is deep equal to cell or not
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const buttonCell1 = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
     * const buttonCell2 = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
     * const inputCell = BemCell.create({ block: 'input', tech: 'css', layer: 'common' });
     *
     * buttonCell1.isEqual(buttonCell2); // true
     * buttonCell1.isEqual(inputCell); // false
     *
     * @param  {BemCell} cell - the cell to compare
     * @returns {Boolean}
     */
    isEqual(cell) {
        return (cell.tech === this.tech) && (cell.layer === this.layer) && cell.entity.isEqual(this.entity);
    }

    /**
     * Determines whether specified cell is instance of BemCell.
     *
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
     *
     * @param {BemCell} cell - the cell to check.
     * @returns {boolean} A Boolean indicating whether or not specified entity is instance of BemCell.
     */
    static isBemCell(cell) {
        return cell && this.name === cell.constructor.name;
    }

    /**
     * Creates BemCell instance by any object representation.
     *
     * @example
     * const BemCell = require('@bem/cell');
     *
     * BemCell.create({ block: 'my-button', mod: 'theme', val: 'red', tech: 'css' });
     * BemCell.create({ block: 'my-button', modName: 'theme', modVal: 'red', tech: 'css' });
     * BemCell.create({ entity: { block: 'my-button', modName: 'theme', modVal: 'red' }, tech: 'css' });
     * // BemCell { block: 'my-button', mod: { name: 'theme', val: 'red' }, tech: 'css' }
     *
     * @param {Object} obj — representation of cell.
     * @param {String} obj.block — the block name of entity.
     * @param {String} [obj.elem] — the element name of entity.
     * @param {Object|String} [obj.mod] — the modifier of entity.
     * @param {String} [obj.val] — The modifier value of entity. Used if `mod` is a string.
     * @param {String} obj.mod.name — the modifier name of entity.
     * @param {String} [obj.mod.val] — the modifier value of entity.
     * @param {String} [obj.modName] — the modifier name of entity. Used if `mod.name` wasn't specified.
     * @param {String} [obj.modVal] — the modifier value of entity. Used if neither `mod.val` nor `val` were not
     *   specified.
     * @param {String} [obj.tech] — technology of cell.
     * @param {String} [obj.layer] — layer of cell.
     * @returns {BemCell} An object representing cell.
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
