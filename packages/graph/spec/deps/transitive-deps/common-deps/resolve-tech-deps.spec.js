'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;

describe('deps/transitive-deps/common-deps/resolve-tech-deps', () => {
    it('should resolve transitive dependency', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' });

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'C' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));
                const decl2 = Array.from(graph.dependenciesOf({ block: 'A', tech: 'css' }));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' }, 'default tech');
                expect(decl2).to.deep.contain({ entity: { block: 'C' }, tech: 'css' }, 'cell-like object');
            }
        });
    });

    it('should resolve transitive entity depending on multiple dependencies', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' });

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'C' })
                    [linkMethod]({ block: 'D' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));
                const decl2 = Array.from(graph.dependenciesOf({ block: 'A', tech: 'css' }));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' }, 'default tech')
                    .and.to.deep.contain({ entity: { block: 'D' }, tech: 'css' }, 'default tech');

                expect(decl2).to.deep.contain({ entity: { block: 'C' }, tech: 'css' }, 'cell-like object')
                    .and.to.deep.contain({ entity: { block: 'D' }, tech: 'css' }, 'cell-like object');
            }
        });
    });
});
