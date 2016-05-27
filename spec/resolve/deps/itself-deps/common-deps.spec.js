'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;

const macro = require('../../../../lib/utils').depsMacro;

test('should include entity once if entity depends on a', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'A' },
            dependOn: [
                { entity: { block: 'A' } }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps);

        expect(resolved.entities).to.be.eql([{ block: 'A' }]);
    }
});
