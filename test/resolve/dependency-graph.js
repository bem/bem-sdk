'use strict';

const expect = require('chai').expect;
const DependencyGraph = require('../../lib/resolve/dependency-graph');

describe('resolve::DependencyGraph()', function () {
    describe('addDependency', function () {
        it('should add dependency', function () {
            var dependencyGraph = new DependencyGraph();

            dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

            expect(Array.from(dependencyGraph.dependenciesOf({ block: 'A' }))).to.be.deep.equal([
                {
                    block: 'B',
                    id: 'B'
                }
            ]);
        });

        it('should add same dependency only once', function () {
            var dependencyGraph = new DependencyGraph();

            dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });
            dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

            expect(Array.from(dependencyGraph.dependenciesOf({ block: 'A' }))).to.be.deep.equal([
                {
                    block: 'B',
                    id: 'B'
                }
            ]);
        });

        it('should add another dependency to existing entity', function () {
            var dependencyGraph = new DependencyGraph();

            dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });
            dependencyGraph.addDependency({ block: 'A' }, { block: 'C' });

            expect(Array.from(dependencyGraph.dependenciesOf({ block: 'A' }))).to.be.deep.equal([
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
    });

    describe('dependenciesOf', function () {
        it('should return empty array if specified id is not exist', function () {
            var dependencyGraph = new DependencyGraph();

            expect(Array.from(dependencyGraph.dependenciesOf({ block: 'non-existing' }))).to.be.deep.equal([]);
        });

        it('should return empty array if entity with specified id not has dependencies', function () {
            var dependencyGraph = new DependencyGraph();

            dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

            expect(Array.from(dependencyGraph.dependenciesOf({ block: 'B' }))).to.be.deep.equal([]);
        });

        it('should return unordered dependencies', function () {
            var dependencyGraph = new DependencyGraph();

            dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

            expect(Array.from(dependencyGraph.dependenciesOf({ block: 'A' }))).to.be.deep.equal([
                {
                    block: 'B',
                    id: 'B'
                }
            ]);
        });

        it('should return ordered dependencies', function () {
            var dependencyGraph = new DependencyGraph();

            dependencyGraph.addDependency({ block: 'A' }, { block: 'B' }, { order: 'dependenceBeforeDependants' });

            expect(Array.from(dependencyGraph.dependenciesOf({ block: 'A' }))).to.be.deep.equal([
                {
                    block: 'B',
                    id: 'B'
                }
            ]);
        });
    });

    describe('unorderedDependenciesOf', function () {
        it('should not return ordered dependencies', function () {
            var dependencyGraph = new DependencyGraph();

            dependencyGraph.addDependency({ block: 'A' }, { block: 'B' }, { order: 'dependenceBeforeDependants' });

            expect(Array.from(dependencyGraph.unorderedDependenciesOf({ block: 'A' }))).to.be.deep.equal([]);
        });

        it('should return unordered dependencies', function () {
            var dependencyGraph = new DependencyGraph();

            dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

            expect(Array.from(dependencyGraph.unorderedDependenciesOf({ block: 'A' }))).to.be.deep.equal([
                {
                    block: 'B',
                    id: 'B'
                }
            ]);
        });
    });

    describe('orderedDependenciesOf', function () {
        it('should not return unordered dependencies', function () {
            var dependencyGraph = new DependencyGraph();

            dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

            expect(Array.from(dependencyGraph.orderedDependenciesOf({ block: 'A' }))).to.be.deep.equal([]);
        });

        it('should return ordered dependencies', function () {
            var dependencyGraph = new DependencyGraph();

            dependencyGraph.addDependency({ block: 'A' }, { block: 'B' }, { order: 'dependenceBeforeDependants' });

            expect(Array.from(dependencyGraph.orderedDependenciesOf({ block: 'A' }))).to.be.deep.equal([
                {
                    block: 'B',
                    id: 'B'
                }
            ]);
        });
    });
});
