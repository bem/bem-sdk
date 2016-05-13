'use strict';

const test = require('ava');

const isRelation = require('../../lib/resolve/is-relation');

const relation = {
    entity: { block: 'A' },
    dependOn: {
        entity: { block: 'B' }
    }
};

test('should detect relation', t => {
    t.true(isRelation(relation));
});

test('should not detect relation on array', t => {
    t.false(isRelation([relation]));
});
