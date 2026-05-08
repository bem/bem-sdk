import { expect } from 'chai';
import { BemGraph } from '../index.js';
import { depsMacro as macro } from '../test-utils.js';
describe('deps/ignore-deps/common-deps/resolve-common-deps', () => {
    it('should not include entity if no entity from decl depends on it', () => {
        macro({
            graph: () => {
                const graph = new BemGraph();

                graph.vertex({ block: 'B' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

                expect(decl).not.to.deep.contain({ entity: { block: 'B' } });
            }
        });
    });

    it('should not include entity if no entity from decl depends on it and this entity has dependency on entity' +
        ' listed in decl', () => {
        macro({
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'B' })
                    [linkMethod!]({ block: 'A' });  

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

                expect(decl).not.to.deep.contain({ entity: { block: 'B' } });
            }
        });
    });

    it('should not include dependency if no entity from decl\'s dependencies depends on it', () => {
        macro({
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'C' })
                    [linkMethod!]({ block: 'D' });  

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

                expect(decl).not.to.deep.contain({ entity: { block: 'D' } });
            }
        });
    });
});
