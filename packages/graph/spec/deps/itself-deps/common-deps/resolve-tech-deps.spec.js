import { expect } from 'chai';

import { BemGraph } from '../../../../lib/index.js';
import { depsMacro as macro } from '../../../../lib/test-utils.js';

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
