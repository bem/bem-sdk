'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;
const findIndex = require('../../../../lib/test-utils').findIndex;
const findLastIndex = require('../../../../lib/test-utils').findLastIndex;

describe('deps/transitive-deps/matching-deps/mismatching-tech-resolving-by-tech', () => {
    it('should not resolve transitive dependency', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' }, 'js');

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'C' }, 'js');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.not.deep.contain({ entity: { block: 'C' }, tech: 'js' });
            }
        });
    });

    it('should not resolve transitive entity depending on multiple dependencies', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' }, 'js');

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'C' }, 'js')
                    [linkMethod]({ block: 'D' }, 'js');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.not.deep.contain({ entity: { block: 'C' }, tech: 'js' })
                    .and.to.not.deep.contain({ entity: { block: 'D' }, tech: 'js' });
            }
        });
    });

    it('should resolve transitive depending by multiple techs on another entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' });

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'C' }, 'css')
                    [linkMethod]({ block: 'C' }, 'js');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'js' });
            }
        });
    });

    it('should resolve multiple tech dependencies depending on another tech different from resolving' +
        ' tech', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'C' }, 'css');

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'D' }, 'js');

                graph
                    .vertex({ block: 'C' })
                    [linkMethod]({ block: 'D' }, 'js');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                const firstIndex = findIndex(decl, { entity: { block: 'D' }, tech: 'js' });
                const lastIndex = findLastIndex(decl, { entity: { block: 'D' }, tech: 'js' });

                expect(decl).to.deep.contain({ entity: { block: 'D' }, tech: 'js' });
                expect(firstIndex).to.be.equal(lastIndex);
            }
        });
    });
});
