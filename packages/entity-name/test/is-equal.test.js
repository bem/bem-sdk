'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('..');

describe('is-equal', () => {
    it('should detect equal block', () => {
        const entityName1 = new BemEntityName({ block: 'block' });
        const entityName2 = new BemEntityName({ block: 'block' });

        expect(entityName1.isEqual(entityName2)).to.be.true;
    });

    it('should not detect another block', () => {
        const entityName1 = new BemEntityName({ block: 'block1' });
        const entityName2 = new BemEntityName({ block: 'block2' });

        expect(entityName1.isEqual(entityName2)).to.be.false;
    });
});
