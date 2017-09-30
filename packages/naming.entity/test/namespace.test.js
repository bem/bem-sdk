'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const bemNaming = require('../index');

describe('namespace.test.js', () => {
    it('should be a namespace', () => {
        const entities = ['block__elem'].map(bemNaming.parse);
        const entity = entities[0];

        expect(entity.valueOf()).to.deep.equal({ block: 'block', elem: 'elem' });
    });

    it('should be a original namespace', () => {
        const myNaming = bemNaming();
        const entities = ['block__elem'].map(myNaming.parse);
        const entity = entities[0];

        expect(entity.valueOf()).to.deep.equal({ block: 'block', elem: 'elem' });
    });

    it('should be a custom namespace', () => {
        const myNaming = bemNaming({ delims: { elem: '==' } });
        const entities = ['block==elem'].map(myNaming.parse);
        const entity = entities[0];

        expect(entity.valueOf()).to.deep.equal({ block: 'block', elem: 'elem' });
    });
});
