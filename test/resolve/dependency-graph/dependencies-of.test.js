'use strict';

const test = require('ava');

const DependencyGraph = require('../../../lib/resolve/dependency-graph');

test('should return empty array if specified id is not exist', t => {
    var dependencyGraph = new DependencyGraph();

    t.deepEqual(Array.from(dependencyGraph.dependenciesOf({ block: 'non-existing' })), []);
});

test('should return empty array if entity with specified id not has dependencies', t => {
    var dependencyGraph = new DependencyGraph();

    dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

    t.deepEqual(Array.from(dependencyGraph.dependenciesOf({ block: 'B' })), []);
});

test('should return unordered dependencies', t => {
    var dependencyGraph = new DependencyGraph();

    dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

    t.deepEqual(Array.from(dependencyGraph.dependenciesOf({ block: 'A' })), [
        {
            block: 'B',
            id: 'B'
        }
    ]);
});

test('should return ordered dependencies', t => {
    var dependencyGraph = new DependencyGraph();

    dependencyGraph.addDependency({ block: 'A' }, { block: 'B' }, { order: 'dependenceBeforeDependants' });

    t.deepEqual(Array.from(dependencyGraph.dependenciesOf({ block: 'A' })), [
        {
            block: 'B',
            id: 'B'
        }
    ]);
});
