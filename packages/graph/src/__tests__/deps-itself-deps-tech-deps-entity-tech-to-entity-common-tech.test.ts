import { expect } from 'chai';
import { BemGraph } from '../index.js';
import { depsMacro as macro } from '../test-utils.js';
describe('deps/itself-deps/tech-deps/entity-tech-to-entity-common-tech', () => {
    it('should include entity once if entity depends on a', () => {
        macro({
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod!]({ block: 'A' });

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.be.eql([{ entity: { block: 'A' }, tech: 'css' }]);
            }
        });
    });
});
