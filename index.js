'use strict';

const util = require('util');

const stringifyEntity = require('bem-naming').stringify;

/**
 * Enum for types of BEM entities.
 *
 * @readonly
 * @enum {String}
 */
const TYPES = {
    BLOCK:     'block',
    BLOCK_MOD: 'blockMod',
    ELEM:      'elem',
    ELEM_MOD:  'elemMod'
};

module.exports = class BemEntityName {
    /**
     * @param {object} obj — representation of entity name.
     * @param {string} obj.block  — the block name of entity.
     * @param {string} [obj.elem] — the element name of entity.
     * @param {object} [obj.mod]  — the modifier of entity.
     * @param {string} [obj.mod.name] — the modifier name of entity.
     * @param {string} [obj.mod.val]  — the modifier value of entity.
     */
    constructor(obj) {
        if (!obj.block) {
             throw new Error('This is not valid BEM entity: the field `block` is undefined.');
        }

        const data = this._data = { block: obj.block };
        const modName = (typeof obj.mod === 'string' ? obj.mod : obj.mod && obj.mod.name) || obj.modName;

        obj.elem && (data.elem = obj.elem);

        if (modName) {
            const modVal = obj.hasOwnProperty('modVal') || obj.mod && obj.mod.hasOwnProperty('val')
                ? obj.mod && obj.mod.val || obj.modVal
                : true;

            data.mod = {
                name: modName,
                val: modVal
            };
        }
    }
    /**
     * Returns the name of block to which this entity belongs.
     *
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(name.block); // button
     *
     * @returns {string} name of entity block.
     */
    get block() { return this._data.block; }
    /**
     * Returns the element name of this entity.
     *
     * If entity is not element or modifier of element then returns empty string.
     *
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * console.log(name.elem); // text
     *
     * @returns {string} name of entity element.
     */
    get elem() { return this._data.elem; }
    /**
     * Returns the modifier of this entity.
     *
     * If entity is not modifier then returns empty object.
     *
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * console.log(name.mod); // { name: 'disabled', val: true }
     *
     * @returns {{mod: string, val: *}} entity modifier.
     */
    get mod() { return this._data.mod || {}; }
    /**
     * Returns the modifier name of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {string} entity modifier name.
     * @deprecated use `mod.name` instead.
     */
    get modName() { return this.mod.name; }
    /**
     * Returns the modifier value of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {string} entity modifier name.
     * @deprecated use `mod.val` instead.
     */
    get modVal() { return this.mod.val; }
    /**
     * Returns id for this entity.
     *
     * Important: should only be used to determine uniqueness of entity.
     *
     * If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * console.log(name.id); // button_disabled
     *
     * @returns {string} id of entity.
     */
    get id() {
        if (this._id) { return this._id; }

        const entity = { block: this._data.block };

        this.elem && (entity.elem = this.elem);
        this.mod.name && (entity.modName = this.mod.name);
        this.mod.val && (entity.modVal = this.mod.val);

        this._id = stringifyEntity(entity);

        return this._id;
    }
    /**
     * Returns type for this entity.
     *
     * @example <caption>type of element</caption>
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * console.log(name.type); // elem
     * @example <caption>type of element modifier</caption>
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'menu', elem: 'item', mod: 'current' });
     *
     * console.log(name.type); // elemMod
     *
     * @returns {string} type of entity.
     */
    get type() {
        if (this._type) { return this._type; }

        const data = this._data;
        const isMod = data.mod;

        this._type = data.elem
            ? isMod ? TYPES.ELEM_MOD : TYPES.ELEM
            : isMod ? TYPES.BLOCK_MOD : TYPES.BLOCK;

        return this._type;
    }
    /**
     * Returns string representing the entity name.
     *
     * Important: If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(`name: ${name}`); // name: button
     *
     * @returns {string}
     */
    toString() { return this.id; }
    /**
     * Returns object representing the entity name. Is needed for debug in Node.js.
     *
     * In some browsers `console.log()` calls `valueOf()` on each argument.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(name); // { block: 'button' }
     *
     * @returns {{block: string, elem: ?string, mod: ?{name: ?string, val: *}}}
     */
    valueOf() { return this._data; }
    /**
     * Returns object representing the entity name. Is needed for debug in Node.js.
     *
     * In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(name); // BemEntityName { block: 'button' }
     *
     * @param {integer} depth — tells inspect how many times to recurse while formatting the object.
     * @param {object} options — An optional `options` object may be passed
     *                         	 that alters certain aspects of the formatted string.
     *
     * @returns {string}
     */
    inspect(depth, options) {
        const stringRepresentation = util.inspect(this._data, options);

        return `BemEntityName ${stringRepresentation}`;
    }
    /**
     * Determines whether specified entity is the deepEqual entity.
     *
     * @param {BemEntityName} entityName - the entity to compare.
     *
     * @returns {boolean} A Boolean indicating whether or not specified entity is the deepEqual entity.
     * @example
     * const BemEntityName = require('bem-entity-name');
     *
     * const inputName = new BemEntityName({ block: 'input' });
     * const buttonName = new BemEntityName({ block: 'button' });
     *
     * console.log(inputName.isEqual(buttonName)); // false
     * console.log(buttonName.isEqual(buttonName)); // true
     */
    isEqual(entityName) {
        return entityName && (this.id === entityName.id);
    }
};
