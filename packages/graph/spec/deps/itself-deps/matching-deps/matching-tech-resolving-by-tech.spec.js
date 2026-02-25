import { describe, it } from 'mocha';
import { expect } from 'chai';

import { BemGraph } from '../../../../lib/index.js';
import { depsMacro as macro } from '../../../../lib/test-utils.js';

describe('deps/itself-deps/matching-deps/matching-tech-resolving-by-tech', () => {
    it('should include entity once if entity depends on a', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'A' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.be.eql([{ entity: { block: 'A' }, tech: 'css' }]);
            }
        });
    });
});
