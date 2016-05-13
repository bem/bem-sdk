'use strict';

const test = require('ava');

const DependencyGraph = require('../../../lib/resolve/dependency-graph');

test('should add dependency', t => {
    var dependencyGraph = new DependencyGraph();

    dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

    t.deepEqual(Array.from(dependencyGraph.dependenciesOf({ block: 'A' })), [
        {
            block: 'B',
            id: 'B'
        }
    ]);
});

test('should add same dependency only once', t => {
    var dependencyGraph = new DependencyGraph();

    dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });
    dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

    t.deepEqual(Array.from(dependencyGraph.dependenciesOf({ block: 'A' })), [
        {
            block: 'B',
            id: 'B'
        }
    ]);
});

test('should add another dependency to existing entity', t => {
    var dependencyGraph = new DependencyGraph();

    dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });
    dependencyGraph.addDependency({ block: 'A' }, { block: 'C' });

    t.deepEqual(Array.from(dependencyGraph.dependenciesOf({ block: 'A' })), [
        {
            block: 'B',
            id: 'B'
        },
        {
            block: 'C',
            id: 'C'
        }
    ]);
});
