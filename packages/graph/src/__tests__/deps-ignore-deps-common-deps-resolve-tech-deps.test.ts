import { expect } from 'chai';
import { BemGraph } from '../index.js';
import { depsMacro as macro } from '../test-utils.js';
describe('deps/ignore-deps/common-deps/resolve-tech-deps', () => {
    it('should not include entity if no entity from decl depends on it', () => {
        macro({
            graph: () => {
                const graph = new BemGraph();

                graph.vertex({ block: 'B' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));
                const decl2 = Array.from(graph.dependenciesOf({ block: 'A', tech: 'css' }));

                expect(decl).to.not.deep.contain({ entity: { block: 'B' }, tech: 'css' }, 'deafult tech');
                expect(decl2).to.not.deep.contain({ entity: { block: 'B' }, tech: 'css' }, 'cell-like object');
            }
        });
    });

    it('should not include entity if no entity from decl depends on it and this entity has dependency on entity' +
        ' listed in decl', () => {
        macro({
            graph: () => {
                const graph = new BemGraph();

                graph.vertex({ block: 'B' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));
                const decl2 = Array.from(graph.dependenciesOf({ block: 'A', tech: 'css' }));

                expect(decl).to.not.deep.contain({ entity: { block: 'B' }, tech: 'css' }, 'default tech');
                expect(decl2).to.not.deep.contain({ entity: { block: 'B' }, tech: 'css' }, 'cell-like object');
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
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));
                const decl2 = Array.from(graph.dependenciesOf({ block: 'A', tech: 'css' }));

                expect(decl).to.not.deep.contain({ entity: { block: 'D' }, tech: 'css' }, 'default tech');
                expect(decl2).to.not.deep.contain({ entity: { block: 'D' }, tech: 'css' }, 'cell-like object');
            }
        });
    });
});
