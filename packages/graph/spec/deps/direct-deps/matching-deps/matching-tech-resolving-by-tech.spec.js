'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;
const findIndex = require('../../../../lib/test-utils').findIndex;
const findLastIndex = require('../../../../lib/test-utils').findLastIndex;

describe('deps/direct-deps/matching-deps/matching-tech-resolving-by-tech', () => {
    it('should resolve entity depending on another entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'B' }, tech: 'css' });
            }
        });
    });

    it('should resolve entity depending by multiple techs on another entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'B' }, 'js');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'B' }, tech: 'css' });
            }
        });
    });

    it('should resolve entity depending on multiple entities', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'C' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'B' }, tech: 'css' })
                    .and.to.deep.contain({ entity: { block: 'C' }, tech: 'css' });
            }
        });
    });

    it('should include entity to result once if multiple entities depend on this entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'C' }, 'css');

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'C' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'B' }], 'css'));

                const firstIndex = findIndex(decl, { entity: { block: 'C' }, tech: 'css' });
                const lastIndex = findLastIndex(decl, { entity: { block: 'C' }, tech: 'css' });

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' });
                expect(firstIndex).to.be.equal(lastIndex);
            }
        });
    });
});
