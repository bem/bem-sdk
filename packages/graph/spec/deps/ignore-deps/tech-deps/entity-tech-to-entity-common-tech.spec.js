'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;

describe('deps/ignore-deps/tech-deps/entity-tech-to-entity-common-tech', () => {
    it('should not include entity if no entity from decl depends on it and this entity has dependency on entity' +
        ' listed in decl', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'A' }); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.not.deep.contain({ entity: { block: 'B' }, tech: 'css' });
            }
        });
    });

    it('should not include dependency if no entity from decl\'s dependencies depends on it', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'C' }, 'css')
                    [linkMethod]({ block: 'D' }); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));
                const decl2 = Array.from(graph.dependenciesOf({ block: 'A', tech: 'css' }));

                expect(decl).to.not.deep.contain({ entity: { block: 'D' }, tech: 'css' });
                expect(decl2).to.not.deep.contain({ entity: { block: 'D' }, tech: 'css' });
            }
        });
    });

    it('should not include dependency if no cell from decl\'s dependencies depends on it', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 't1')
                    [linkMethod]({ block: 'D' }, 'r1'); // eslint-disable-line no-unexpected-multiline

                graph
                    .vertex({ block: 'B' }, 't2')
                    [linkMethod]({ block: 'D' }, 'r2'); // eslint-disable-line no-unexpected-multiline

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf([
                    { block: 'A', tech: 't2' },
                    { block: 'B', tech: 't1' }
                ], 'wtf'));

                expect(decl).to.not.deep.contain({ entity: { block: 'D' }, tech: 'r1' })
                    .and.to.not.deep.contain({ entity: { block: 'D' }, tech: 'r2' });
            }
        });
    });
});
