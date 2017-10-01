'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('..');

describe('type', () => {
    it('should determine block', () => {
        const entityName = new BemEntityName({ block: 'block' });

        expect(entityName.type).to.equal('block');
    });

    it('should determine modifier of block', () => {
        const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod' } });

        expect(entityName.type).to.equal('blockMod');
    });

    it('should determine elem', () => {
        const entityName = new BemEntityName({ block: 'block', elem: 'elem' });

        expect(entityName.type).to.equal('elem');
    });

    it('should determine modifier of element', () => {
        const entityName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod' } });

        expect(entityName.type).to.equal('elemMod');
    });

    it('should cache type value', () => {
        const entity = new BemEntityName({ block: 'block' });

        entity.type; // eslint-disable-line no-unused-expressions

        expect(entity._type).to.equal('block');
    });

    it('should get type from cache', () => {
        const entity = new BemEntityName({ block: 'block' });

        entity._type = 'fake';

        expect(entity.type).to.equal('fake');
    });

});
