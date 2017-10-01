'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;

describe('deps/ignore-deps/matching-deps/matching-tech-resolving-by-tech', () => {
    it('should not include entity if no entity from decl depends on it and this entity has dependency on entity' +
        ' listed in decl', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'A' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).not.to.contain({ entity: { block: 'B' }, tech: 'css' });
            }
        });
    });

    it('should not include dependency if no entity from decl\'s dependencies depends on it', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'C' }, 'css')
                    [linkMethod]({ block: 'D' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).not.to.contain({ entity: { block: 'D' }, tech: 'css' });
            }
        });
    });
});
