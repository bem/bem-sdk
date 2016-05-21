'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;

test('should place block before its element', () => {
    const decl = [
        { block: 'block', elem: 'elem' },
        { block: 'block' }
    ];
    const resolved = resolve(decl);
    const indexBlock = findIndex(resolved.entities, { block: 'block' });
    const indexElem = findIndex(resolved.entities, { block: 'block', elem: 'elem' });

    expect(indexBlock).to.be.below(indexElem);
});

test('should place block before its boolean modifier', () => {
    const decl = [
        { block: 'block', modName: 'mod', modVal: true },
        { block: 'block' }
    ];
    const resolved = resolve(decl);
    const indexBlock = findIndex(resolved.entities, { block: 'block' });
    const indexModifier = findIndex(resolved.entities, { block: 'block', modName: 'mod' });

    expect(indexBlock).to.be.below(indexModifier);
});

test('should place block before its key-value modifier', () => {
    const decl = [
        { block: 'block', modName: 'mod', modVal: 'val' },
        { block: 'block' }
    ];
    const resolved = resolve(decl);
    const indexBlock = findIndex(resolved.entities, { block: 'block' });
    const indexModifier = findIndex(resolved.entities, { block: 'block', modName: 'mod', modVal: 'val' });

    expect(indexBlock).to.be.below(indexModifier);
});

test('should place block before its element with boolean modifier', () => {
    const decl = [
        { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
        { block: 'block' }
    ];
    const resolved = resolve(decl);
    const indexBlock = findIndex(resolved.entities, { block: 'block' });
    const indexElem = findIndex(resolved.entities, { block: 'block', elem: 'elem', modName: 'mod', modVal: true });

    expect(indexBlock).to.be.below(indexElem);
});

test('should place block before its element with key-value modifier', () => {
    const decl = [
        { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
        { block: 'block' }
    ];
    const resolved = resolve(decl);
    const indexBlock = findIndex(resolved.entities, { block: 'block' });
    const indexElem = findIndex(resolved.entities, { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' });

    expect(indexBlock).to.be.below(indexElem);
});

test('should place block\'s boolean modifier before block\' key-value modifier', () => {
    const decl = [
        { block: 'block', modName: 'mod', modVal: 'val' },
        { block: 'block', modName: 'mod', modVal: true }
    ];
    const resolved = resolve(decl);
    const indexBoolean = findIndex(resolved.entities, { block: 'block', modName: 'n', modVal: true });
    const indexKeyValue = findIndex(resolved.entities, { block: 'block', modName: 'mod', modVal: 'val' });

    expect(indexBoolean).to.be.below(indexKeyValue);
});

test('should place elem before its boolean modifier', () => {
    const decl = [
        { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
        { block: 'block', elem: 'elem' }
    ];
    const resolved = resolve(decl);
    const indexElem = findIndex(resolved.entities, { block: 'block', elem: 'elem' });
    const indexModifier = findIndex(resolved.entities, { block: 'block', elem: 'elem', modName: 'mod', modVal: true });

    expect(indexElem).to.be.below(indexModifier);
});

test('should place elem before its key-value modifier', () => {
    const decl = [
        { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
        { block: 'block', elem: 'elem' }
    ];
    const resolved = resolve(decl);
    const indexElem = findIndex(resolved.entities, { block: 'block', elem: 'elem' });
    const indexModifier = findIndex(resolved.entities, { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' });

    expect(indexElem).to.be.below(indexModifier);
});

test('should place elem\'s boolean modifier before elem\' key-value modifier', () => {
    const decl = [
        { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
        { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
    ];
    const resolved = resolve(decl);
    const indexBoolean = findIndex(resolved.entities, { block: 'block', elem: 'elem', modName: 'n', modVal: true });
    const indexKeyValue = findIndex(resolved.entities, { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' });

    expect(indexBoolean).to.be.below(indexKeyValue);
});
