'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;
const findIndex = require('../../../../lib/test-utils').findIndex;
const findLastIndex = require('../../../../lib/test-utils').findLastIndex;

describe('deps/direct-deps/common-deps/resolve-tech-deps', () => {
    it('should resolve entity depending on another entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf([{ block: 'A' }], 'css'));
                const decl2 = Array.from(graph.dependenciesOf([{ block: 'A', tech: 'css' }]));

                expect(decl).to.deep.contain({ entity: { block: 'B' }, tech: 'css' }, 'default tech');
                expect(decl2).to.deep.contain({ entity: { block: 'B' }, tech: 'css' }, 'cell-like object');
            }
        });
    });

    it('should resolve entity depending on multiple entities', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' })
                    [linkMethod]({ block: 'C' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf([{ block: 'A' }], 'css'));
                const decl2 = Array.from(graph.dependenciesOf([{ block: 'A', tech: 'css' }]));

                expect(decl).to.deep.contain({ entity: { block: 'B' }, tech: 'css' }, 'default tech')
                    .and.to.deep.contain({ entity: { block: 'C' }, tech: 'css' }, 'default tech');

                expect(decl2).to.deep.contain({ entity: { block: 'B' }, tech: 'css' }, 'cell-like object')
                    .and.to.deep.contain({ entity: { block: 'C' }, tech: 'css' }, 'cell-like object');
            }
        });
    });

    it('should include entity to result once if multiple entities depend on this entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'C' });

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'C' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'B' }], 'css'));
                const decl2 = Array.from(graph.dependenciesOf([{ block: 'A', tech: 'css' }, { block: 'B', tech: 'css' }]));

                const firstIndex = findIndex(decl, { entity: { block: 'C' }, tech: 'css' });
                const lastIndex = findLastIndex(decl, { entity: { block: 'C' }, tech: 'css' });

                const firstIndex2 = findIndex(decl2, { entity: { block: 'C' }, tech: 'css' });
                const lastIndex2 = findLastIndex(decl2, { entity: { block: 'C' }, tech: 'css' });

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' });
                expect(decl2).to.deep.contain({ entity: { block: 'C' }, tech: 'css' });

                expect(firstIndex).to.be.equal(lastIndex);
                expect(firstIndex2).to.be.equal(lastIndex2);
            }
        });
    });
});
