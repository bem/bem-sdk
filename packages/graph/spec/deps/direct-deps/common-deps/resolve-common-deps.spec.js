import { describe, it } from 'mocha';
import { expect } from 'chai';

import { BemGraph } from '../../../../lib/index.js';
import { depsMacro as macro, findIndex, findLastIndex } from '../../../../lib/test-utils.js';

describe('deps/direct-deps/common-deps/resolve-common-deps', () => {
    it('should resolve entity depending on another entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })[linkMethod]({ block: 'B' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

                expect(decl).to.deep.contain({ entity: { block: 'B' } });
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
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

                expect(decl).to.deep.contain({ entity: { block: 'B' } })
                    .and.to.deep.contain({ entity: { block: 'C' } });
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
                const decl = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]));

                const firstIndex = findIndex(decl, { entity: { block: 'C' } });
                const lastIndex = findLastIndex(decl, { entity: { block: 'C' } });

                expect(decl).to.deep.contain({ entity: { block: 'C' } });
                expect(firstIndex).to.be.equal(lastIndex);
            }
        });
    });
});
