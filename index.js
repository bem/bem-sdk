'use strict';

const util = require('util');

const naming = require('bem-naming');

const stringifyEntity = naming.stringify;
const typeOfEntity = naming.typeOf;

module.exports = class BemEntityName {
    constructor(obj) {
        if (!obj.block) {
             throw new Error('This is not valid BEM entity: the field `block` is undefined.');
        }

        this._obj = { block: obj.block };
        obj.elem && (this._obj.elem = obj.elem);

        const modName = (typeof obj.mod === 'string' ? obj.mod : obj.mod && obj.mod.name) || obj.modName;

        if (modName) {
            const modVal = obj.hasOwnProperty('modVal') || obj.mod && obj.mod.hasOwnProperty('val')
                ? obj.mod && obj.mod.val || obj.modVal
                : true;

            this._obj.mod = {
                name: modName,
                val: modVal
            };
        }
    }
    /**
     * Returns the name of block to which this entity belongs.
     *
     * @returns {string} name of entity block.
     */
    get block() { return this._obj.block; }
    /**
     * Returns the element name of this entity.
     *
     * If entity is not element or modifier of element then returns empty string.
     *
     * @returns {string} name of entity element.
     */
    get elem() { return this._obj.elem; }
    /**
     * Returns the modifier of this entity.
     *
     * If entity is not modifier then returns empty object.
     *
     * @returns {object} entity modifier.
     */
    get mod() { return this._obj.mod || {}; }
    /**
     * Returns id for this entity.
     *
     * @returns {string} id of entity.
     */
    get id() {
        if (this._id) { return this._id; }

        const entity = { block: this._obj.block };

        this.elem && (entity.elem = this.elem);
        this.mod.name && (entity.modName = this.mod.name);
        this.mod.val && (entity.modVal = this.mod.val);

        this._id = stringifyEntity(entity);

        return this._id;
    }
    /**
     * Returns type for this entity.
     *
     * @returns {string} type of entity.
     */
    get type() {
        if (this._type) { return this._type; }

        const entity = { block: this._obj.block };

        this.elem && (entity.elem = this.elem);
        this.mod.name && (entity.modName = this.mod.name);
        this.mod.val && (entity.modVal = this.mod.val);

        this._type = typeOfEntity(entity);

        return this._type;
    }

    toString() { return this.id;  }
    valueOf()  { return this._obj; }
    /**
     * Returns object representing the entity name. Is needed for debug in Node.js.
     *
     * In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @param {integer} depth — tells inspect how many times to recurse while formatting the object.
     * @param {object} options — An optional `options` object may be passed
     *                         	 that alters certain aspects of the formatted string.
     *
     * @returns {object}
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(name); // { block: 'button' }
     */
    inspect(depth, options) {
        const stringRepresentation = util.inspect(this._obj, options);

        return `BemEntityName ${stringRepresentation}`;
    }
    /**
     * Determines whether specified entity is the deepEqual entity.
     *
     * @param {object} entity - the entity to compare.
     *
     * @returns {boolean} A Boolean indicating whether or not specified entity is the deepEqual entity.
     */
    isEqual(entity) {
        return entity && (this.id === entity.id);
    }
};
