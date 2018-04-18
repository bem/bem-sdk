'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../../../lib').BemGraph;
const macro = require('../../../../lib/test-utils').depsMacro;

describe('deps/itself-deps/common-deps/resolve-tech-deps', () => {
    it('should include entity once if entity depends on a', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod]({ block: 'A' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));
                const decl2 = Array.from(graph.dependenciesOf({ block: 'A', tech: 'css' }));

                expect(decl).to.be.eql([{ entity: { block: 'A' }, tech: 'css' }], 'default tech');
                expect(decl2).to.be.eql([{ entity: { block: 'A' }, tech: 'css' }], 'cell-like object');
            }
        });
    });
});
