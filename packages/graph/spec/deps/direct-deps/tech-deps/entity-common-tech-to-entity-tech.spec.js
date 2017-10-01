'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;
const findIndex = require('../../../../lib/test-utils').findIndex;
const findLastIndex = require('../../../../lib/test-utils').findLastIndex;

describe('deps/direct-deps/tech-deps/entity-common-tech-to-entity-tech', () => {
    it('should resolve entity depending on another entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' }, 'css'); // eslint-disable-line no-unexpected-multiline

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
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' }, 'css') // eslint-disable-line no-unexpected-multiline
                    [linkMethod]({ block: 'B' }, 'js'); // eslint-disable-line no-unexpected-multiline

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
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' }, 'css') // eslint-disable-line no-unexpected-multiline
                    [linkMethod]({ block: 'C' }, 'css'); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' });
            }
        });
    });

    it('should include entity to result once if multiple entities depend on this entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'C' }, 'css'); // eslint-disable-line no-unexpected-multiline

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'C' }, 'css'); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const resolved = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'B' }], 'css'));

                const firstIndex = findIndex(resolved, { entity: { block: 'C' }, tech: 'css' });
                const lastIndex = findLastIndex(resolved, { entity: { block: 'C' }, tech: 'css' });

                expect(firstIndex).to.not.equal(-1);
                expect(firstIndex).to.be.equal(lastIndex);
            }
        });
    });
});
