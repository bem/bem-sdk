'use strict';

const assert = require('assert');

const BemEntityName = require('bem-entity-name');

module.exports = class Vertex {
    constructor(entity, tech) {
        assert(entity instanceof BemEntityName, 'The `entity` is not `BemEntityName`');

        this.entity = entity;
        this.tech = tech;
        this.id = tech ? `${entity.id}.${tech}` : entity.id;
    }
    toString() {
        return this.id;
    }
};
