'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;

test('should place block before its element', () => {
    const decl = [
        { block: 'A', elem: 'e' }
    ];
    const deps = [
        {
            entity: { block: 'A', elem: 'e' },
            dependOn: [
                {
                    entity: { block: 'A' }
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexBlock = findIndex(resolved.entities, { block: 'A' });
    const indexElem = findIndex(resolved.entities, { block: 'A', elem: 'e' });

    expect(indexBlock).to.be.below(indexElem);
});

test('should place block before its boolean modifier', () => {
    const decl = [
        { block: 'A', modName: 'm', modVal: true }
    ];
    const deps = [
        {
            entity: { block: 'A', modName: 'm', modVal: true },
            dependOn: [
                {
                    entity: { block: 'A' }
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexBlock = findIndex(resolved.entities, { block: 'A' });
    const indexModifier = findIndex(resolved.entities, { block: 'A', modName: 'm' });

    expect(indexBlock).to.be.below(indexModifier);
});

test('should place block before its key-value modifier', () => {
    const decl = [
        { block: 'A', modName: 'm', modVal: 'any' }
    ];
    const deps = [
        {
            entity: { block: 'A', modName: 'm', modVal: 'any' },
            dependOn: [
                {
                    entity: { block: 'A' }
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexBlock = findIndex(resolved.entities, { block: 'A' });
    const indexModifier = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'any' });

    expect(indexBlock).to.be.below(indexModifier);
});

test('should place block before its element with boolean modifier', () => {
    const decl = [
        { block: 'A', elem: 'e', modName: 'm', modVal: true }
    ];
    const deps = [
        {
            entity: { block: 'A', elem: 'e', modName: 'm', modVal: true },
            dependOn: [
                {
                    entity: { block: 'A' }
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexBlock = findIndex(resolved.entities, { block: 'A' });
    const indexElem = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: true });

    expect(indexBlock).to.be.below(indexElem);
});

test('should place block before its element with key-value modifier', () => {
    const decl = [
        { block: 'A', elem: 'e', modName: 'm', modVal: 'any' }
    ];
    const deps = [
        {
            entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
            dependOn: [
                {
                    entity: { block: 'A' }
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexBlock = findIndex(resolved.entities, { block: 'A' });
    const indexElem = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: 'any' });

    expect(indexBlock).to.be.below(indexElem);
});

test('should place block\'s boolean modifier before block key-value modifier', () => {
    const decl = [
        { block: 'A', modName: 'm', modVal: 'any' }
    ];
    const deps = [
        {
            entity: { block: 'A', modName: 'm', modVal: 'any' },
            dependOn: [
                {
                    entity: { block: 'A', modName: 'm', modVal: true }
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexBoolean = findIndex(resolved.entities, { block: 'A', modName: 'n', modVal: true });
    const indexKeyValue = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'any' });

    expect(indexBoolean).to.be.below(indexKeyValue);
});

test('should place elem before its boolean modifier', () => {
    const decl = [
        { block: 'A', elem: 'e', modName: 'm', modVal: true }
    ];
    const deps = [
        {
            entity: { block: 'A', elem: 'e', modName: 'm', modVal: true },
            dependOn: [
                {
                    entity: { block: 'A', elem: 'e' }
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexElem = findIndex(resolved.entities, { block: 'A', elem: 'e' });
    const indexModifier = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: true });

    expect(indexElem).to.be.below(indexModifier);
});

test('should place elem before its key-value modifier', () => {
    const decl = [
        { block: 'A', elem: 'e', modName: 'm', modVal: 'any' }
    ];
    const deps = [
        {
            entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
            dependOn: [
                {
                    entity: { block: 'A', elem: 'e' }
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexElem = findIndex(resolved.entities, { block: 'A', elem: 'e' });
    const indexModifier = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: 'any' });

    expect(indexElem).to.be.below(indexModifier);
});

test('should place elem\'s boolean modifier before elem key-value modifier', () => {
    const decl = [
        { block: 'A', elem: 'e', modName: 'm', modVal: 'any' }
    ];
    const deps = [
        {
            entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
            dependOn: [
                {
                    entity: { block: 'A', elem: 'e', modName: 'm', modVal: true }
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexBoolean = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: true });
    const indexKeyValue = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: 'any' });

    expect(indexBoolean).to.be.below(indexKeyValue);
});
