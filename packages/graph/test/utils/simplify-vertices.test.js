'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyVertices = require('../../lib/test-utils').simplifyVertices;
const createVertex = require('../../lib/test-utils').createVertex;

describe('utils/simplify-vertices', () => {
    it('should simplify vertex', () => {
        expect(simplifyVertices([
            createVertex({ block: 'a' }),
            createVertex({ block: 'b', elem: 'e' }),
            createVertex({ block: 'c', modName: 'm', modVal: true })
        ])).to.deep.equal([
            { entity: { block: 'a' } },
            { entity: { block: 'b', elem: 'e' } },
            { entity: { block: 'c', mod: { name: 'm', val: true } } }
        ]);
    });
});
