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
};
