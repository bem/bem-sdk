'use strict';

const test = require('ava');
const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

test('should support block', t => {
    t.deepEqual(normalize({ block: 'block' }).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null }
    ]);
});

test('should support array of blocks', t => {
    t.deepEqual(normalize([{ block: 'block1' }, { block: 'block2' }]).map(simplifyCell), [
        { entity: { block: 'block1' }, tech: null },
        { entity: { block: 'block2' }, tech: null }
    ]);
});

test('should support block as string', t => {
    t.deepEqual(normalize(['block']).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null }
    ]);
});

test('should support array of blocks as strings', t => {
    t.deepEqual(normalize(['block1', 'block2']).map(simplifyCell), [
        { entity: { block: 'block1' }, tech: null },
        { entity: { block: 'block2' }, tech: null }
    ]);
});
