'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../../../util').simplifyCell;
const normalize = require('../../../../lib/formats/harmony/normalize');

describe('normalize-harmony.block', () => {
    it('should support block', () => {
        const block = { block: 'block' };

        expect(normalize(block).map(simplifyCell)).to.deep.equal([{ entity: block, tech: null }]);
    });

    it('should support block as string', () => {
        expect(normalize(['block']).map(simplifyCell)).to.deep.equal([{ entity: { block: 'block' }, tech: null }]);
    });
});
