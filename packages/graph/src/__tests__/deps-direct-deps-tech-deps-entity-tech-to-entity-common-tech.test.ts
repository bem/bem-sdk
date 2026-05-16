import { expect } from 'chai';
import { BemGraph } from '../index.js';
import { depsMacro as macro } from '../test-utils.js';
import { findIndex } from '../test-utils.js';
import { findLastIndex } from '../test-utils.js';
describe('deps/direct-deps/tech-deps/entity-tech-to-entity-common-tech', () => {
    it('should resolve entity depending on another entity', () => {
        macro({
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod!]({ block: 'B' });  

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
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod!]({ block: 'B' })  
                    [linkMethod!]({ block: 'C' });  

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'B' }, tech: 'css' })
                    .to.deep.contain({ entity: { block: 'C' }, tech: 'css' });
            }
        });
    });

    it('should resolve multiple techs in entity depending on another entity', () => {
        macro({
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod!]({ block: 'B' });  

                graph
                    .vertex({ block: 'A' }, 'js')
                    [linkMethod!]({ block: 'B' });  

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'B' }, tech: 'css' });
            }
        });
    });

    it('should include entity to result once if multiple entities depend on this entity', () => {
        macro({
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod!]({ block: 'C' });  

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod!]({ block: 'C' });  

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'B' }], 'css'));

                const firstIndex = findIndex(decl, { entity: { block: 'C' }, tech: 'css' });
                const lastIndex = findLastIndex(decl, { entity: { block: 'C' }, tech: 'css' });

                expect(firstIndex).to.not.be.equal(-1);
                expect(firstIndex).to.be.equal(lastIndex);
            }
        });
    });
});
