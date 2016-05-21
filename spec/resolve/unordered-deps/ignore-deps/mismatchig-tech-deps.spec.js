'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;

test('should not add tech to dependOn if dependency matching resolving tech', () => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];
    const deps = [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'B' },
                    tech: 'css'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.dependOn).to.be.empty;
});

test('should not include entity if no entity from decl depends on it and this entity has dependency on entity' +
    ' listed in decl', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'B' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'A' },
                    tech: 'js'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.entities).not.to.contain({ block: 'B' });
});

test('should not include dependency if no entity from decl\'s dependencies depends on it', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'C' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'D' },
                    tech: 'js'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.entities).to.not.contain({ block: 'D' });
});
