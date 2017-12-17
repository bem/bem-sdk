'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../../../util').simplifyCell;
const normalize = require('../../../../lib/formats/v2/normalize');

describe('normalize2.block', () => {
    it('should support block', () => {
        expect(normalize({ block: 'block' }).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null }
        ]);
    });

    it('should support array of blocks', () => {
        expect(normalize([{ block: 'block1' }, { block: 'block2' }]).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block1' }, tech: null },
            { entity: { block: 'block2' }, tech: null }
        ]);
    });

    it('should support block as string', () => {
        expect(normalize(['block']).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null }
        ]);
    });

    it('should support array of blocks as strings', () => {
        expect(normalize(['block1', 'block2']).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block1' }, tech: null },
            { entity: { block: 'block2' }, tech: null }
        ]);
    });
});
