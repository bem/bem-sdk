'use strict';

const expect = require('chai').expect;
const BemEntityName = require('@bem/sdk.entity-name');

const originNaming = require('@bem/sdk.naming.presets/origin');
const stringify = require('..')(originNaming);

describe('naming.entity.stringify', () => {
    it('should not stringify not valid notation', () => {
        const str = stringify({});

        expect(str).to.eql('');
    });

    it('should support block instance of BemEntityName', () => {
        const entityName = new BemEntityName({ block: 'block' });
        const obj = { block: 'block' };

        expect(stringify(entityName)).to.eql('block');
        expect(stringify(obj)).to.eql('block');
    });

    it('should support modifier instance of BemEntityName', () => {
        const entityName = new BemEntityName({ block: 'block', mod: 'mod' });
        const obj = { block: 'block', mod: 'mod' };

        expect(stringify(entityName)).to.eql('block_mod');
        expect(stringify(obj)).to.eql('block_mod');
    });

    it('should support modifier with name instance of BemEntityName', () => {
        const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod' } });
        const obj = { block: 'block', mod: { name: 'mod' } };

        expect(stringify(entityName)).to.eql('block_mod');
        expect(stringify(obj)).to.eql('block_mod');
    });

    it('should support modifier with val instance of BemEntityName', () => {
        const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });
        const obj = { block: 'block', mod: { name: 'mod', val: 'val' } };

        expect(stringify(entityName)).to.eql('block_mod_val');
        expect(stringify(obj)).to.eql('block_mod_val');
    });

    it('should support modifier with false val instance of BemEntityName', () => {
        const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: false } });
        const obj = { block: 'block', mod: { name: 'mod', val: false } };

        expect(stringify(entityName)).to.eql('block');
        expect(stringify(obj)).to.eql('block');
    });

    it('should support modifier with empty string val instance of BemEntityName', () => {
        const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: ''} });
        const obj = { block: 'block', mod: { name: 'mod', val: ''} };

        expect(stringify(entityName)).to.eql('block');
        expect(stringify(obj)).to.eql('block');
    });

    it('should support element instance of BemEntityName', () => {
        const entityName = new BemEntityName({ block: 'block', elem: 'elem' });
        const obj = { block: 'block', elem: 'elem' };

        expect(stringify(entityName)).to.eql('block__elem');
        expect(stringify(obj)).to.eql('block__elem');
    });

    it('should support element modifier instance of BemEntityName', () => {
        const entityName = new BemEntityName({ block: 'block', elem: 'elem', mod: 'mod' });
        const obj = { block: 'block', elem: 'elem', mod: 'mod' };

        expect(stringify(entityName)).to.eql('block__elem_mod');
        expect(stringify(obj)).to.eql('block__elem_mod');
    });
});
