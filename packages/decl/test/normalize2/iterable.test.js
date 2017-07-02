'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

describe('normalize2.iterable', () => {
    it('should support iterable set', () => {
        const decl = new Set();

        decl.add({
            block: 'block'
        });
        decl.add({
            block: 'block1',
            elem: 'elem'
        });

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block1', elem: 'elem' }, tech: null }
        ]);
    });
});
