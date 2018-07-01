'use strict';

const util = require('util');

const originNaming = require('@bem/sdk.naming.presets/origin');
const stringifyEntity = require('@bem/sdk.naming.entity.stringify')(originNaming);

const deprecate = require('./deprecate');
const EntityTypeError = require('./entity-type-error');

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

class BemEntityName {
    /**
     * @param {BEMSDK.EntityName.Options} obj — representation of entity name.
     */
    constructor(obj) {
        if (!obj.block) {
            throw new EntityTypeError(obj, 'the field `block` is undefined');
        }

        if (obj instanceof BemEntityName) {
            return obj;
        }

        const isBemEntityName = obj.__isBemEntityName__;

        if (!isBemEntityName) {
            obj.modName && deprecate(obj, 'modName', 'mod.name');
            obj.modVal && deprecate(obj, 'modVal', 'mod.val');
        }

        const data = this._data = { block: obj.block };

        obj.elem && (data.elem = obj.elem);

        const modObj = obj.mod;
        const modName = (typeof modObj === 'string' ? modObj : modObj && modObj.name) ||
            !isBemEntityName && obj.modName;
        const hasModVal = modObj && modObj.hasOwnProperty('val') || obj.hasOwnProperty('modVal');

        if (modName) {
            const normalizeValue = v => v === 0 ? '0' : v;
            const val = hasModVal ? modObj && normalizeValue(modObj.val) || normalizeValue(obj.modVal) : true;
            val && (data.mod = {
                name: modName,
                val
            });
        } else if (modObj || hasModVal) {
            throw new EntityTypeError(obj, 'the field `mod.name` is undefined');
        }

        this.__isBemEntityName__ = true;
    }

    /**
     * Returns the name of block to which this entity belongs.
     *
     * @example
     * const BemEntityName = require('@bem/sdk.entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * name.block; // button
     *
     * @returns {BEMSDK.EntityName.BlockName} name of entity block.
     */
    get block() { return this._data.block; }

    /**
     * Returns the element name of this entity.
     *
     * If entity is not element or modifier of element then returns empty string.
     *
     * @example
     * const BemEntityName = require('@bem/sdk.entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * name.elem; // text
     *
     * @returns {?BEMSDK.EntityName.ElementName} - name of entity element.
     */
    get elem() { return this._data.elem; }

    /**
     * Returns the modifier of this entity.
     *
     * Important: If entity is not a modifier then returns `undefined`.
     *
     * @example
     * const BemEntityName = require('@bem/sdk.entity-name');
     *
     * const blockName = new BemEntityName({ block: 'button' });
     * const modName = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * modName.mod;   // { name: 'disabled', val: true }
     * blockName.mod; // undefined
     *
     * @returns {?BEMSDK.EntityName.Modifier} - entity modifier.
     */
    get mod() { return this._data.mod; }

    /**
     * Returns the modifier name of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {?BEMSDK.EntityName.ModifierName} - entity modifier name.
     * @deprecated use {@link BemEntityName#mod.name}
     */
    get modName() {
        deprecate(this, 'modName', 'mod.name');

        return this.mod && this.mod.name;
    }

    /**
     * Returns the modifier value of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {?BEMSDK.EntityName.ModifierValue} - entity modifier name.
     * @deprecated use {@link BemEntityName#mod.val}
     */
    get modVal() {
        deprecate(this, 'modVal', 'mod.val');

        return this.mod && this.mod.val;
    }

    /**
     * Returns type for this entity.
     *
     * @example <caption>type of element</caption>
     * const BemEntityName = require('@bem/sdk.entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * name.type; // elem
     *
     * @example <caption>type of element modifier</caption>
     * const BemEntityName = require('@bem/sdk.entity-name');
     * const name = new BemEntityName({ block: 'menu', elem: 'item', mod: 'current' });
     *
     * name.type; // elemMod
     *
     * @returns {BEMSDK.EntityName.Type} - type of entity.
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
     * Returns scope of this entity.
     *
     * Important: block-typed entities has no scope.
     *
     * @example
     * const BemEntityName = require('@bem/sdk.entity-name');
     *
     * const buttonName = new BemEntityName({ block: 'button' });
     * const buttonTextName = new BemEntityName({ block: 'button', elem: 'text' });
     * const buttonTextBoldName = new BemEntityName({ block: 'button', elem: 'text', mod: 'bold' });
     *
     * buttonName.scope;         // null
     * buttonTextName.scope;     // BemEntityName { block: 'button' }
     * buttonTextBoldName.scope; // BemEntityName { block: 'button', elem: 'elem' }
     *
     * @returns {(BemEntityName|null)} - scope entity name.
     */
    get scope() {
        if (this.type === TYPES.BLOCK) { return null; }
        if (this._scope) { return this._scope; }

        this._scope = new BemEntityName({
            block: this.block,
            elem: this.type === TYPES.ELEM_MOD && this.elem
        });

        return this._scope;
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
     * const BemEntityName = require('@bem/sdk.entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * name.id; // button_disabled
     *
     * @returns {BEMSDK.EntityName.Id} - id of entity.
     */
    get id() {
        if (this._id) { return this._id; }

        this._id = stringifyEntity(this._data);

        return this._id;
    }

    /**
     * Determines whether modifier simple or not
     *
     * @example <caption>simple mod</caption>
     * const BemEntityName = require('@bem/sdk.entity-name');
     * const name = new BemEntityName({ block: 'button', mod: { name: 'theme' } });
     *
     * name.isSimpleMod(); // true
     *
     * @example <caption>mod with value</caption>
     * const BemEntityName = require('@bem/sdk.entity-name');
     * const name = new BemEntityName({ block: 'button', mod: { name: 'theme', val: 'normal' } });
     *
     * name.isSimpleMod(); // false
     *
     * @example <caption>block</caption>
     * const BemEntityName = require('@bem/sdk.entity-name');
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
     * Determines whether specified entity is the deepEqual entity.
     *
     * @example
     * const BemEntityName = require('@bem/sdk.entity-name');
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
     * const BemEntityName = require('@bem/sdk.entity-name');
     *
     * const buttonName = new BemEntityName({ block: 'button' });
     * const buttonTextName = new BemEntityName({ block: 'button', elem: 'text' });
     * const buttonTextBoldName = new BemEntityName({ block: 'button', elem: 'text', mod: 'bold' });
     *
     * buttonTextName.belongsTo(buttonName); // true
     * buttonName.belongsTo(buttonTextName); // false
     *
     * buttonTextBoldName.belongsTo(buttonTextName); // true
     * buttonTextBoldName.belongsTo(buttonName); // false
     *
     * @param {BemEntityName} entityName - the entity to compare.
     *
     * @returns {boolean}
     */
    belongsTo(entityName) {
        if (entityName.block !== this.block) { return false; }

        return entityName.type === TYPES.BLOCK && (this.type === TYPES.BLOCK_MOD || this.type === TYPES.ELEM)
            || entityName.elem === this.elem && (entityName.type === TYPES.ELEM && this.type === TYPES.ELEM_MOD);
    }

    /**
     * Returns normalized object representing the entity name.
     *
     * In some browsers `console.log()` calls `valueOf()` on each argument.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @example
     * const BemEntityName = require('@bem/sdk.entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'focused' });
     *
     * name.valueOf();
     *
     * // ➜ { block: 'button', mod: { name: 'focused', value: true } }
     *
     * @returns {BEMSDK.EntityName.Representation}
     */
    valueOf() { return this._data; }

    /**
     * Returns raw data for `JSON.stringify()` purposes.
     *
     * @example
     * const BemEntityName = require('@bem/sdk.entity-name');
     *
     * const name = new BemEntityName({ block: 'input', mod: 'available' });
     *
     * JSON.stringify(name); // {"block":"input","mod":{"name":"available","val":true}}
     *
     * @returns {BEMSDK.EntityName.Representation}
     */
    toJSON() {
        return this._data;
    }

    /**
     * Returns string representing the entity name.
     *
     * Important: If you want to get string representation in accordance with the provisions naming convention
     * you should use `@bem/naming` package.
     *
     * @example
     * const BemEntityName = require('@bem/sdk.entity-name');
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
     * In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @example
     * const BemEntityName = require('@bem/sdk.entity-name');
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
     * Creates BemEntityName instance by any object representation.
     *
     * @example
     * const BemEntityName = require('@bem/sdk.entity-name');
     *
     * BemEntityName.create({ block: 'my-button', mod: 'theme', val: 'red' });
     * BemEntityName.create({ block: 'my-button', modName: 'theme', modVal: 'red' });
     * // → BemEntityName { block: 'my-button', mod: { name: 'theme', val: 'red' } }
     *
     * @param {(BEMSDK.EntityName.CreateOptions|string)} obj — representation of entity name.
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

            data.mod = {
                name: modName,
                val: modObj.val || modObj.val === 0 ? modObj.val :
                    obj.modVal || obj.modVal === 0 ? obj.modVal :
                    true
            };
        }

        return new BemEntityName(data);
    }

    /**
     * Determines whether specified entity is instance of BemEntityName.
     *
     * @example
     * const BemEntityName = require('@bem/sdk.entity-name');
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
        const C = entityName && entityName.constructor;
        return C === this || Boolean(C && entityName.__isBemEntityName__ && C !== Object);
    }
}

module.exports = BemEntityName;

// TypeScript imports the `default` property for
// an ES2015 default import (`import BemEntityName from '@bem/sdk.entity-name'`)
// See: https://github.com/Microsoft/TypeScript/issues/2242#issuecomment-83694181
module.exports.default = BemEntityName;
