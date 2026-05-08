import { expect } from 'chai';
import { BemGraph } from '../index.js';
import { depsMacro as macro } from '../test-utils.js';
describe('deps/transitive-deps/common-deps/resolve-common-deps', () => {
    it('should resolve transitive dependency', () => {
        macro({
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod!]({ block: 'B' });

                graph
                    .vertex({ block: 'B' })
                    [linkMethod!]({ block: 'C' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

                expect(decl).to.deep.contain({ entity: { block: 'C' } });
            }
        });
    });

    it('should resolve transitive entity depending on multiple dependencies', () => {
        macro({
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod!]({ block: 'B' });

                graph
                    .vertex({ block: 'B' })
                    [linkMethod!]({ block: 'C' })
                    [linkMethod!]({ block: 'D' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

                expect(decl).to.deep.contain({ entity: { block: 'C' } })
                    .and.to.deep.contain({ entity: { block: 'D' } });
            }
        });
    });
});
