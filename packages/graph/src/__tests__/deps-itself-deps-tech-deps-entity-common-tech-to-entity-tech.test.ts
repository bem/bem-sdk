import { expect } from 'chai';
import { BemGraph } from '../index.js';
import { depsMacro as macro } from '../test-utils.js';
describe('deps/itself-deps/tech-deps/entity-common-tech-to-entity-tech', () => {
    it('should include entity once if entity depends on a', () => {
        macro({
            graph: (linkMethod?: 'linkWith' | 'dependsOn') => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' })
                    [linkMethod!]({ block: 'A' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.be.eql([{ entity: { block: 'A' }, tech: 'css' }]);
            }
        });
    });
});
