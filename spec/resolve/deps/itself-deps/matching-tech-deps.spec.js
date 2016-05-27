'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;

const macro = require('../../../../lib/utils').depsMacro;

test('should include entity once if entity depends on a', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            tech: 'css',
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'A' },
                    tech: 'css'
                }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps, { tech: 'css' });

        expect(resolved.entities).to.be.eql([{ block: 'A' }]);
    }
});
