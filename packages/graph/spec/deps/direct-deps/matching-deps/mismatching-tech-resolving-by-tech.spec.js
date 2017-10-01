'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;
const findIndex = require('../../../../lib/test-utils').findIndex;
const findLastIndex = require('../../../../lib/test-utils').findLastIndex;

describe('deps/direct-deps/matching-deps/mismatching-tech-resolving-by-tech', () => {
    it('should resolve entity depending on another entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' }, 'js'); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf([{ block: 'A' }], 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'B' }, tech: 'js' });
            }
        });
    });

    it('should resolve tech depending on multiple techs', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' }, 'js') // eslint-disable-line no-unexpected-multiline
                    [linkMethod]({ block: 'B' }, 'bemhtml'); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf([{ block: 'A' }], 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'B' }, tech: 'bemhtml' })
                    .and.to.deep.contain({ entity: { block: 'B' }, tech: 'js' });
            }
        });
    });

    // TODO: move to transitive
    it('should resolve tech dependency depending on tech different with resolving in another entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' }, 'css'); // eslint-disable-line no-unexpected-multiline

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'C' }, 'js'); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf([{ block: 'A' }], 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'js' });
            }
        });
    });

    it('should resolve tech dependency depending on tech different from resolving tech', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'B' }, 'css'); // eslint-disable-line no-unexpected-multiline

                graph
                    .vertex({ block: 'B' })
                    [linkMethod]({ block: 'C' }, 'bemhtml') // eslint-disable-line no-unexpected-multiline
                    [linkMethod]({ block: 'D' }, 'js'); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'bemhtml' })
                    .to.deep.contain({ entity: { block: 'D' }, tech: 'js' });
            }
        });
    });

    it('should include tech to result once if tech of multiple entities depends on this tech and this tech is' +
        ' not matching with resolving tech', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'C' }, 'js'); // eslint-disable-line no-unexpected-multiline

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'C' }, 'js'); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'B' }], 'css'));

                const firstIndex = findIndex(decl, { entity: { block: 'C' }, tech: 'js' });
                const lastIndex = findLastIndex(decl, { entity: { block: 'C' }, tech: 'js' });

                expect(firstIndex).to.not.be.equal(-1);
                expect(firstIndex).to.be.equal(lastIndex);
            }
        });
    });
});
