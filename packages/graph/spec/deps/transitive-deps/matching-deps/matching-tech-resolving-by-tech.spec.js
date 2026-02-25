import { describe, it } from 'mocha';
import { expect } from 'chai';

import { BemGraph } from '../../../../lib/index.js';
import { depsMacro as macro } from '../../../../lib/test-utils.js';

describe('deps/transitive-deps/matching-deps/matching-tech-resolving-by-tech', () => {
    it('should resolve transitive dependency', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' }, 'css');

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'C' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' });
            }
        });
    });

    it('should resolve transitive entity depending on multiple dependencies', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' }, 'css');

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'C' }, 'css')
                    [linkMethod]({ block: 'D' }, 'css');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' })
                    .and.to.deep.contain({ entity: { block: 'D' }, tech: 'css' });
            }
        });
    });

    it('should resolve transitive depending by multiple techs on another entity', () => {
        macro({
            graph: (linkMethod) => {
                const graph = new BemGraph();

                graph
                    .vertex({ block: 'A' }, 'css')
                    [linkMethod]({ block: 'B' });

                graph
                    .vertex({ block: 'B' }, 'css')
                    [linkMethod]({ block: 'C' }, 'css')
                    [linkMethod]({ block: 'C' }, 'js');

                return graph;
            },
            test: (graph) => {
                const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

                expect(decl).to.deep.contain({ entity: { block: 'C' }, tech: 'css' });
            }
        });
    });
});
