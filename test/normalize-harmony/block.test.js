'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize-harmony');

test('should support block', t => {
    var block = { block: 'block' };

    t.deepEqual(normalize(block), [{ entity: block, tech: null }]);
});

test('should support block as string', t => {
    t.deepEqual(normalize(['block']), [{ entity: { block: 'block' }, tech: null }]);
});
