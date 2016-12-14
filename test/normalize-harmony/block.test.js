'use strict';

const test = require('ava');
const simplifyCell = require('../util').simplifyCell;

const normalize = require('../../lib/normalize/harmony');

test('should support block', t => {
    var block = { block: 'block' };

    t.deepEqual(normalize(block).map(simplifyCell), [{ entity: block, tech: null }]);
});

test('should support block as string', t => {
    t.deepEqual(normalize(['block']).map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
});
