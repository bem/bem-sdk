'use strict';

const test = require('ava');
const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

test('should support mod', t => {
    const decl = {
        block: 'block',
        mod: 'm1',
        val: 'v1'
    }

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block', modName: 'm1', modVal: true }, tech: null },
        { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: null }
    ]);
});

test('should support mod with tech', t => {
    const decl = {
        block: 'block',
        mod: 'm1',
        val: 'v1',
        tech: 'js'
    }

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block', modName: 'm1', modVal: true }, tech: 'js' },
        { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: 'js' }
    ]);
});
