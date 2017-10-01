'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('..');

describe('is-simple-mod', () => {
    it('should be true for simple modifiers', () => {
        const entityName = new BemEntityName({ block: 'block', mod: 'mod' });

        expect(entityName.isSimpleMod()).to.be.true;
    });

    it('should be false for complex modifiers', () => {
        const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

        expect(entityName.isSimpleMod()).to.be.false;
    });

    it('should be null for block', () => {
        const entityName = BemEntityName.create({ block: 'button2' });

        expect(entityName.isSimpleMod()).to.equal(null);
    });

    it('should be null for element', () => {
        const entityName = BemEntityName.create({ block: 'button2', elem: 'text' });

        expect(entityName.isSimpleMod()).to.equal(null);
    });
});
