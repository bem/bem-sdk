'use strict';

const assert = require('assert');

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
     * Determines whether specified cell is instance of BemCell.
     *
     * @param {BemCell} cell - the cell to check.
     *
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
};
