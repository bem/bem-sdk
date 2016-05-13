'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../utils').findIndex;

test('should prioritise block-element natural ordering over recommended decl ordering', () => {
    var decl = [
            { block: 'A', elem: 'e' },
            { block: 'A' }
        ],
        deps = [],
        resolved = resolve(decl, deps),
        indexBlock = findIndex(resolved.entities, { block: 'A' }),
        indexElement = findIndex(resolved.entities, { block: 'A', elem: 'e' });

    expect(indexBlock).to.be.below(indexElement);
});

test('should prioritise block - boolean modifier natural ordering over recommended decl ordering', () => {
    var decl = [
            { block: 'A', modName: 'm', modVal: true },
            { block: 'A' }
        ],
        deps = [],
        resolved = resolve(decl, deps),
        indexBlock = findIndex(resolved.entities, { block: 'A' }),
        indexModifier = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: true });

    expect(indexBlock).to.be.below(indexModifier);
});

test('should prioritise key-value modifier natural ordering over recommended decl ordering', () => {
    var decl = [
            { block: 'A', modName: 'm', modVal: 'val' },
            { block: 'A' }
        ],
        deps = [],
        resolved = resolve(decl, deps),
        indexBlock = findIndex(resolved.entities, { block: 'A' }),
        indexModifier = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'val' });

    expect(indexBlock).to.be.below(indexModifier);
});

test('should prioritise element - element boolean modifier natural ordering over recommended decl ' +
    'ordering', () => {
    var decl = [
            { block: 'A', elem: 'e', modName: 'm', modVal: true },
            { block: 'A', elem: 'e' }
        ],
        deps = [],
        resolved = resolve(decl, deps),
        indexElement = findIndex(resolved.entities, { block: 'A', elem: 'e' }),
        indexModifier = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: true });

    expect(indexElement).to.be.below(indexModifier);
});

test('should prioritise element - element key-value modifier natural ordering over recommended decl ' +
    'ordering', () => {
    var decl = [
            { block: 'A', elem: 'e', modName: 'm', modVal: 'val' },
            { block: 'A', elem: 'e' }
        ],
        deps = [],
        resolved = resolve(decl, deps),
        indexElement = findIndex(resolved.entities, { block: 'A', elem: 'e' }),
        indexModifier = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: 'val' });

    expect(indexElement).to.be.below(indexModifier);
});

test('should prioritise boolean modifier - key-value modifier natural ordering over recommended decl ' +
    'ordering', () => {
    var decl = [
            { block: 'A', modName: 'm', modVal: 'val' },
            { block: 'A', modName: 'm', modVal: true }
        ],
        deps = [],
        resolved = resolve(decl, deps),
        indexBoolean = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: true }),
        indexKeyValue = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'val' });

    expect(indexBoolean).to.be.below(indexKeyValue);
});
