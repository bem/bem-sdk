'use strict';

const test = require('ava');

const isRelationWithRequiredTech = require('../../lib/resolve/is-relation-with-required-tech');

test('should detect relation if required tech is not specified', t => {
    const relation = {
        entity: { block: 'A' },
        dependOn: {
            entity: { block: 'B' }
        }
    };

    t.true(isRelationWithRequiredTech(relation));
});

test('should detect relation if dependent has common dependency', t => {
    const relation = {
        entity: { block: 'A' },
        dependOn: {
            entity: { block: 'B' }
        }
    };

    t.true(isRelationWithRequiredTech(relation, 'css'));
});

test('should detect relation if required tech coincides with dependent tech', t => {
    const relation = {
        entity: { block: 'A' },
        tech: 'css',
        dependOn: {
            entity: { block: 'B' }
        }
    };

    t.true(isRelationWithRequiredTech(relation, 'css'));
});

test('should not detect relation if required tech not coincides with dependent tech', t => {
    const relation = {
        entity: { block: 'A' },
        tech: 'css',
        dependOn: {
            entity: { block: 'B' }
        }
    };

    t.false(isRelationWithRequiredTech(relation, 'js'));
});
