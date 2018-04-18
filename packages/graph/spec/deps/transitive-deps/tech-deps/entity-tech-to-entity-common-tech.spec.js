'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;

describe('deps/transitive-deps/tech-deps/entity-tech-to-entity-common-tech', () => {
    it('should resolve transitive dependency', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' });

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'C' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' });
            }
        });
    });

    it('should resolve transitive entity depending on multiple dependencies', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' });

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'C' })
                    [linkMethod]({ block: 'D' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));
                const decl2 = Array.from(graph.dependenciesOf({ block: 'A', tech: 'css' }));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' })
                    .and.to.deep.contain({ entity: { block: 'D' }, tech: 'css' });

                expect(decl2).to.deep.contain({ entity: { block: 'C' }, tech: 'css' })
                    .and.to.deep.contain({ entity: { block: 'D' }, tech: 'css' });
            }
        });
    });

    it('should resolve few different techs with multiple transitive cell dependencies', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 't1')
                    [linkMethod]({ block: 'D' }, 'r1');

                graph
                    .vertex({ block: 'B' }, 't2')
                    [linkMethod]({ block: 'C' }, 't3');

                graph
                    .vertex({ block: 'C' }, 't3')
                    [linkMethod]({ block: 'D' }, 'r2');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf([
                    { block: 'A', tech: 't1' },
                    { block: 'B', tech: 't2' }
                ], 'wtf'));

                expect(decl).to.deep.contain({ entity: { block: 'D' }, tech: 'r1' })
                    .and.to.deep.contain({ entity: { block: 'D' }, tech: 'r2' });
            }
        });
    });
});
