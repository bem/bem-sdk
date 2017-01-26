'use strict';

const util = require('util');

const ExtendableError = require('es6-error');
const stringifyEntity = require('@bem/naming').stringify;
const deprecate = require('depd')(require('./package.json').name);

/**
 * Enum for types of BEM entities.
 *
 * @readonly
 * @enum {string}
 */
const TYPES = {
    BLOCK:     'block',
    BLOCK_MOD: 'blockMod',
    ELEM:      'elem',
    ELEM_MOD:  'elemMod'
};
/**
 * The EntityTypeError object represents an error when a value is not valid BEM entity.
 */
class EntityTypeError extends ExtendableError {
    /**
     * @param {object} obj — not valid object
     * @param {string} [reason] — human-readable reason why object is not valid
     */
    constructor(obj, reason) {
        const str = util.inspect(obj, { depth: 1 });
        const message = `the object \`${str}\` is not valid BEM entity`;

        super(reason ? `${message}, ${reason}` : message);
    }
}

class BemEntityName {
    /**
     * @param {BemSDK.EntityName.Options} obj — representation of entity name.
     */
    constructor(obj) {
        if (!obj.block) {
            throw new EntityTypeError(obj, 'the field `block` is undefined');
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
            throw new EntityTypeError(obj, 'the field `mod.name` is undefined');
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
     * @returns {?string} - name of entity element.
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
     * @returns {?BemSDK.EntityName.ModifierRepresentation} - entity modifier.
     */
    get mod() { return this._data.mod; }

    /**
     * Returns the modifier name of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {?string} - entity modifier name.
     * @deprecated use {@link BemEntityName#mod.name}
     */
    get modName() {
        deprecate(`modName is kept just for compatibility and can be dropped in the future. Use mod.name instead in ${this.inspect()} at`);

        return this.mod && this.mod.name;
    }

    /**
     * Returns the modifier value of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {?(string|true)} - entity modifier name.
     * @deprecated use {@link BemEntityName#mod.val}
     */
    get modVal() {
        deprecate(`modVal is kept just for compatibility and can be dropped in the future. Use mod.val instead in ${this.inspect()} at`);

        return this.mod && this.mod.val;
    }

    /**
     * Returns id for this entity.
     *
     * Important: should only be used to determine uniqueness of entity.
     *
     * If you want to get string representation in accordance with the provisions naming convention
     * you should use `@bem/naming` package.
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

        this._id = stringifyEntity(this._data);

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
     * @returns {(boolean|null)}
     */
    isSimpleMod() {
        return this.mod ? this.mod.val === true : null;
    }

    /**
     * Returns string representing the entity name.
     *
     * Important: If you want to get string representation in accordance with the provisions naming convention
     * you should use `@bem/naming` package.
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
     * @returns {BemSDK.EntityName.StrictRepresentation}
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
     * @returns {BemSDK.EntityName.StrictRepresentation}
     */
    toJSON() {
        return this._data;
    }

    /**
     * Determines whether specified entity is the deepEqual entity.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const inputName = new BemEntityName({ block: 'input' });
     * const buttonName = new BemEntityName({ block: 'button' });
     *
     * inputName.isEqual(buttonName); // false
     * buttonName.isEqual(buttonName); // true
     *
     * @param {BemEntityName} entityName - the entity to compare.
     * @returns {boolean} - A Boolean indicating whether or not specified entity is the deepEqual entity.
     */
    isEqual(entityName) {
        return entityName && (this.id === entityName.id);
    }

    /**
     * Determines whether specified entity belongs to this.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const buttonName = new BemEntityName({ block: 'button' });
     * const buttonTextName = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * buttonTextName.belongsTo(buttonName); // true
     * buttonName.belongsTo(buttonTextName); // false
     *
     * @param {BemEntityName} entityName - the entity to compare.
     *
     * @returns {boolean}
     */
    belongsTo(entityName) {
        return entityName && entityName.id !== this.id && this.id.startsWith(entityName.id) &&
            (entityName.type !== 'block' || this.type !== 'elemMod') &&
            (!entityName.elem || this.elem === entityName.elem) &&
            (!entityName.modName || this.modName === entityName.modName) &&
            (!entityName.modVal || entityName.modVal === true || this.modVal === entityName.modVal);
    }

    /**
     * Determines whether specified entity is instance of BemEntityName.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const entityName = new BemEntityName({ block: 'input' });
     *
     * BemEntityName.isBemEntityName(entityName); // true
     * BemEntityName.isBemEntityName({}); // false
     *
     * @param {*} entityName - the entity to check.
     * @returns {boolean} A Boolean indicating whether or not specified entity is instance of BemEntityName.
     */
    static isBemEntityName(entityName) {
        return entityName && entityName.__isBemEntityName__;
    }

    /**
     * Creates BemEntityName instance by any object representation.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * BemEntityName.create({ block: 'my-button', mod: 'theme', val: 'red' });
     * BemEntityName.create({ block: 'my-button', modName: 'theme', modVal: 'red' });
     * // → BemEntityName { block: 'my-button', mod: { name: 'theme', val: 'red' } }
     *
     * @param {(BemSDK.EntityName.NonStrictRepresentation|string)} obj — representation of entity name.
     * @returns {BemEntityName} An object representing entity name.
     */
    static create(obj) {
        if (BemEntityName.isBemEntityName(obj)) {
            return obj;
        }

        if (typeof obj === 'string') {
            obj = { block: obj };
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
}

module.exports = BemEntityName;

// TypeScript imports the `default` property for
// an ES2015 default import (`import BemEntityName from '@bem/entity-name'`)
// See: https://github.com/Microsoft/TypeScript/issues/2242#issuecomment-83694181
module.exports.default = BemEntityName;
