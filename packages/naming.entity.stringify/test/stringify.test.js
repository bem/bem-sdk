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
        const obj = { block: 'block' };
        const entityName = new BemEntityName(obj);

        expect(stringify(obj)).to.eql(stringify(entityName));
    });

    it('should support modifier instance of BemEntityName', () => {
        const obj = { block: 'block', mod: 'mod' };
        const entityName = new BemEntityName(obj);

        expect(stringify(obj)).to.eql(stringify(entityName));
    });

    it('should support element instance of BemEntityName', () => {
        const obj = { block: 'block', elem: 'elem' };
        const entityName = new BemEntityName(obj);

        expect(stringify(obj)).to.eql(stringify(entityName));
    });

    it('should support element modifier instance of BemEntityName', () => {
        const obj = { block: 'block', mod: 'mod' };
        const entityName = new BemEntityName(obj);

        expect(stringify(obj)).to.eql(stringify(entityName));
    });
});
