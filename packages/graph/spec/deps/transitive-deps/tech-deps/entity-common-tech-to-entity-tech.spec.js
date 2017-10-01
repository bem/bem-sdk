'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;

describe('deps/transitive-deps/tech-deps/entity-common-tech-to-entity-tech', () => {
    it('should resolve transitive dependency', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' }, 'css');

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'C' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' });
            }
        });
    });

    it('should resolve transitive depending on multiple dependencies', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' }, 'css');

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'C' }, 'css')
                    [linkMethod]({ block: 'D' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' })
                    .and.to.deep.contain({ entity: { block: 'D' }, tech: 'css' });
            }
        });
    });

    it('should resolve transitive depending by multiple techs on another entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' });

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'C' }, 'css')
                    [linkMethod]({ block: 'C' }, 'js');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' });
            }
        });
    });
});
