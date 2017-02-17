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
     * @param {object} [obj.mod] — the modifier of entity.
     * @param {string} obj.mod.name — the modifier name of entity.
     * @param {string} [obj.mod.val] — the modifier value of entity.
     * @param {string} [obj.modName] — the modifier name of entity. Used if `mod.name` wasn't specified.
     * @param {string} [obj.modVal] — the modifier value of entity.
     *   Used if neither `mod.val` nor `val` were not specified.
     */
    constructor(obj) {
        if (!obj.block) {
             throw new Error('This is not valid BEM entity: the field `block` is undefined.');
        }

        const data = this._data = { block: obj.block };

        obj.elem && (data.elem = obj.elem);

        const modObj = obj.mod;
        const modName = (typeof modObj === 'string' ? modObj : modObj && modObj.name) || obj.modName;
        const hasModVal = modObj && modObj.hasOwnProperty('val') || obj.hasOwnProperty('modVal');

        if (modName) {
            data.mod = {
                name: modName,
                val: hasModVal ? modObj && modObj.val || obj.modVal : true
            };
        } else if (modObj || hasModVal) {
            throw new Error('This is not valid BEM entity: the field `mod.name` is undefined.');
        }

        this.__isBemEntityName__ = true;
    }

    /**
     * Returns the name of block to which this entity belongs.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * name.block; // button
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
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * name.elem; // text
     *
     * @returns {string|undefined} - name of entity element.
     */
    get elem() { return this._data.elem; }

    /**
     * Returns the modifier of this entity.
     *
     * Important: If entity is not a modifier then returns `undefined`.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const blockName = new BemEntityName({ block: 'button' });
     * const modName = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * modName.mod;   // { name: 'disabled', val: true }
     * blockName.mod; // undefined
     *
     * @returns {{mod: string, val: (string|true)}|undefined} - entity modifier.
     */
    get mod() { return this._data.mod; }

    /**
     * Returns the modifier name of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {string|undefined} - entity modifier name.
     * @deprecated - use `mod.name` instead.
     */
    get modName() { return this.mod && this.mod.name; }

    /**
     * Returns the modifier value of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {string|undefined} - entity modifier name.
     * @deprecated - use `mod.val` instead.
     */
    get modVal() { return this.mod && this.mod.val; }

    /**
     * Returns id for this entity.
     *
     * Important: should only be used to determine uniqueness of entity.
     *
     * If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * name.id; // button_disabled
     *
     * @returns {string} - id of entity.
     */
    get id() {
        if (this._id) { return this._id; }

        const entity = { block: this._data.block };

        this.elem && (entity.elem = this.elem);
        this.modName && (entity.modName = this.modName);
        this.modVal && (entity.modVal = this.modVal);

        this._id = stringifyEntity(entity);

        return this._id;
    }

    /**
     * Returns type for this entity.
     *
     * @example <caption>type of element</caption>
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * name.type; // elem
     *
     * @example <caption>type of element modifier</caption>
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'menu', elem: 'item', mod: 'current' });
     *
     * name.type; // elemMod
     *
     * @returns {string} - type of entity. One of 'block', 'elem', 'blockMod', 'elemMod'.
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
     * Determines whether modifier simple or not
     *
     * @example <caption>simple mod</caption>
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', mod: { name: 'theme' } });
     *
     * name.isSimpleMod(); // true
     *
     * @example <caption>mod with value</caption>
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', mod: { name: 'theme', val: 'normal' } });
     *
     * name.isSimpleMod(); // false
     *
     * @example <caption>block</caption>
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * name.isSimpleMod(); // null
     *
     * @returns {boolean|null}
     */
    isSimpleMod() {
        return this.mod ? this.mod.val === true : null;
    }

    /**
     * Returns string representing the entity name.
     *
     * Important: If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'focused' });
     *
     * name.toString(); // button_focused
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
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'focused' });
     *
     * name.valueOf();
     *
     * // ➜ { block: 'button', mod: { name: 'focused', value: true } }
     *
     * @returns {{block: string, elem: (string|undefined), mod: ({name: string, val: (string|true)}|undefined)}}
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
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(name); // BemEntityName { block: 'button' }
     *
     * @param {number} depth — tells inspect how many times to recurse while formatting the object.
     * @param {object} options — An optional `options` object may be passed
     *   that alters certain aspects of the formatted string.
     *
     * @returns {string}
     */
    inspect(depth, options) {
        const stringRepresentation = util.inspect(this._data, options);

        return `BemEntityName ${stringRepresentation}`;
    }

    /**
     * Return raw data for `JSON.stringify()`.
     *
     * @returns {{block: string, elem: (string|undefined),
     *   mod: ({name: string, val: (string|true|undefined)}|undefined)}}
     */
    toJSON() {
        return this._data;
    }

    /**
     * Determines whether specified entity is the deepEqual entity.
     *
     * @param {BemEntityName} entityName - the entity to compare.
     *
     * @returns {boolean} - A Boolean indicating whether or not specified entity is the deepEqual entity.
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const inputName = new BemEntityName({ block: 'input' });
     * const buttonName = new BemEntityName({ block: 'button' });
     *
     * inputName.isEqual(buttonName); // false
     * buttonName.isEqual(buttonName); // true
     */
    isEqual(entityName) {
        return entityName && (this.id === entityName.id);
    }

    /**
     * Determines whether specified entity is instance of BemEntityName.
     *
     * @param {BemEntityName} entityName - the entity to check.
     *
     * @returns {boolean} A Boolean indicating whether or not specified entity is instance of BemEntityName.
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const entityName = new BemEntityName({ block: 'input' });
     *
     * BemEntityName.isBemEntityName(entityName); // true
     * BemEntityName.isBemEntityName({}); // false
     */
    static isBemEntityName(entityName) {
        return entityName && entityName.__isBemEntityName__;
    }

    /**
     * Creates BemEntityName instance by any object representation.
     *
     * @param {object} obj — representation of entity name.
     * @param {string} obj.block  — the block name of entity.
     * @param {string} [obj.elem] — the element name of entity.
     * @param {object|string} [obj.mod]  — the modifier of entity.
     * @param {string} [obj.val] - the modifier value of entity. Used if `obj.mod` is a string.
     * @param {string} obj.mod.name — the modifier name of entity.
     * @param {string} [obj.mod.val]  — the modifier value of entity.
     * @param {string} [obj.modName] — the modifier name of entity. Used if `obj.mod.name` wasn't specified.
     * @param {string} [obj.modVal]  — the modifier value of entity.
     *   Used if neither `obj.mod.val` nor `obj.val` were not specified.
     *
     * @returns {BemEntityName} An object representing entity name.
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * BemEntityName.create('my-button_theme_red');
     * BemEntityName.create({ block: 'my-button', mod: 'theme', val: 'red' });
     * BemEntityName.create({ block: 'my-button', modName: 'theme', modVal: 'red' });
     * // → BemEntityName { block: 'my-button', mod: { name: 'theme', val: 'red' } }
     */
    static create(obj) {
        if (BemEntityName.isBemEntityName(obj)) {
            return obj;
        }

        const data = { block: obj.block };
        const mod = obj.mod;

        obj.elem && (data.elem = obj.elem);

        if (mod || obj.modName) {
            const isString = typeof mod === 'string';
            const modName = (isString ? mod : mod && mod.name) || obj.modName;
            const modObj = !isString && mod || obj;
            const hasModVal = modObj.hasOwnProperty('val') || obj.hasOwnProperty('modVal');

            data.mod = {
                name: modName,
                val: hasModVal ? modObj.val || obj.modVal : true
            };
        }

        return new BemEntityName(data);
    }
};
