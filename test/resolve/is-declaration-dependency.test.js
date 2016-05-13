'use strict';

const test = require('ava');

const isDeclarationDependency = require('../../lib/resolve/is-declaration-dependency');

test('should not detect dependency if required tech is not specified', t => {
    const dependent = {
        entity: { block: 'A' },
        tech: 'css'
    };
    const dependency = {
        entity: { block: 'B' },
        tech: 'css'
    };

    t.false(isDeclarationDependency(dependent.tech, dependency.tech));
});

test('should not detect dependency if dependency tech is not specified', t => {
    const dependent = {
        entity: { block: 'A' },
        tech: 'css'
    };
    const dependency = {
        entity: { block: 'B' }
    };

    t.false(isDeclarationDependency(dependent.tech, dependency.tech, 'css'));
});

test('should detect dependency if dependant tech not coincides with dependency tech', t => {
    const dependent = {
        entity: { block: 'A' },
        tech: 'css'
    };
    const dependency = {
        entity: { block: 'B' },
        tech: 'js'
    };

    t.true(isDeclarationDependency(dependent.tech, dependency.tech, 'css'));
});

test('should detect dependency if dependancy tech not coincides with required tech', t => {
    const dependent = {
        entity: { block: 'A' }
    };
    const dependency = {
        entity: { block: 'B' },
        tech: 'js'
    };

    t.true(isDeclarationDependency(dependent.tech, dependency.tech, 'css'));
});
