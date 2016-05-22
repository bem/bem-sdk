'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;

test('should include entity once if entity depends on a', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            tech: 'css',
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'A' },
                    order: 'dependenceBeforeDependants',
                    tech: 'css'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.entities).to.be.eql([{ block: 'A' }]);
});
