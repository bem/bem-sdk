import { expect } from 'chai';
import { BemGraph } from '../index.js';
describe('loops/direct-loops', () => {
    it('should not throw error if detected unordered direct loop', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .linkWith({ block: 'B' });

        graph
            .vertex({ block: 'B' })
            .linkWith({ block: 'A' });

        expect(() => graph.dependenciesOf({ block: 'A' })).to.not.throw();
    });

    it('should not throw error if detected unordered direct loop with ordered part', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .linkWith({ block: 'B' });

        graph
            .vertex({ block: 'B' })
            .dependsOn({ block: 'A' });

        expect(() => graph.dependenciesOf({ block: 'A' })).to.not.throw();
    });

    it('should throw error if detected ordered direct loop', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'B' });

        graph
            .vertex({ block: 'B' })
            .dependsOn({ block: 'A' });

        const exceptionRun = () => graph.dependenciesOf({ block: 'A' });

        expect(exceptionRun).to.throw();

        try {
            graph.dependenciesOf({ block: 'A' });
        } catch (error) {
            expect((error as { loop: unknown[] }).loop).to.deep.equal([
                { entity: { block: 'A' } },
                { entity: { block: 'B' } },
                { entity: { block: 'A' } }
            ]);
        }
    });
});
