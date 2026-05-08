import { expect } from 'chai';
import { BemGraph } from '../index.js';
import { depsMacro as macro } from '../test-utils.js';
import { findIndex } from '../test-utils.js';
import { findLastIndex } from '../test-utils.js';
describe('deps/direct-deps/tech-deps/entity-common-tech-to-entity-tech', () => {
    it('should resolve entity depending on another entity', () => {
        macro({
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod!]({ block: 'B' }, 'css');  

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
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod!]({ block: 'B' }, 'css')  
                    [linkMethod!]({ block: 'B' }, 'js');  

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
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod!]({ block: 'B' }, 'css')  
                    [linkMethod!]({ block: 'C' }, 'css');  

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
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod!]({ block: 'C' }, 'css');  

                graph
                    .vertex({ block: 'B' })
                    [linkMethod!]({ block: 'C' }, 'css');  

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
