'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;

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
                    order: 'dependenceBeforeDependants'
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
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.entities).to.not.contain({ block: 'D' });
});
