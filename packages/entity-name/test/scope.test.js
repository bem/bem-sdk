'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('..');

describe('scope', () => {
    it('should return scope of block', () => {
        const entityName = new BemEntityName({ block: 'block' });

        expect(entityName.scope).to.equal(null);
    });

    it('should return scope of block modifier', () => {
        const entityName = new BemEntityName({ block: 'block', mod: 'mod' });

        expect(entityName.scope.valueOf()).to.deep.equal({ block: 'block' });
    });

    it('should return same scope for simple and complex mod', () => {
        const simpleModName = new BemEntityName({ block: 'block', mod: 'mod' });
        const complexModName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

        expect(simpleModName.scope).to.deep.equal(complexModName.scope);
    });

    it('should return scope of element', () => {
        const entityName = new BemEntityName({ block: 'block', elem: 'elem' });

        expect(entityName.scope.valueOf()).to.deep.equal({ block: 'block' });
    });

    it('should return scope of element modifier', () => {
        const entityName = new BemEntityName({ block: 'block', elem: 'elem', mod: 'mod' });

        expect(entityName.scope.valueOf()).to.deep.equal({ block: 'block', elem: 'elem' });
    });

    it('should cache scope value', () => {
        const entity = new BemEntityName({ block: 'block', elem: 'elem' });

        entity.scope; // eslint-disable-line no-unused-expressions

        expect(entity._scope.valueOf()).to.deep.equal({ block: 'block' });
    });

    it('should get scope from cache', () => {
        const entity = new BemEntityName({ block: 'block', elem: 'elem' });

        entity._scope = 'fake';

        expect(entity.scope).to.equal('fake');
    });
});
