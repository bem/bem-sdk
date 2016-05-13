'use strict';

const test = require('ava');

const DependencyGraph = require('../../../lib/resolve/dependency-graph');

test('should not return ordered dependencies', t => {
    var dependencyGraph = new DependencyGraph();

    dependencyGraph.addDependency({ block: 'A' }, { block: 'B' }, { order: 'dependenceBeforeDependants' });

    t.deepEqual(Array.from(dependencyGraph.unorderedDependenciesOf({ block: 'A' })), []);
});

test('should return unordered dependencies', t => {
    var dependencyGraph = new DependencyGraph();

    dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

    t.deepEqual(Array.from(dependencyGraph.unorderedDependenciesOf({ block: 'A' })), [
        {
            block: 'B',
            id: 'B'
        }
    ]);
});
