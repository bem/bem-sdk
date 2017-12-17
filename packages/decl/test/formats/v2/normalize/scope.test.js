'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../../../util').simplifyCell;
const normalize = require('../../../../lib/formats/v2/normalize');

describe('normalize2.scope', () => {
    it('should consider block scope', () => {
        const decl = {};
        const scope = simplifyCell({ entity: { block: 'block' } });

        expect(normalize(decl, scope).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null }
        ]);
    });

    it('should consider scope for object with tech field', () => {
        const decl = { tech: 'js' };
        const scope = simplifyCell({ entity: { block: 'block' } });

        expect(normalize(decl, scope).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: 'js' }
        ]);
    });
});
