import { describe, it } from 'mocha';
import { expect } from 'chai';

import { BemGraph } from '../../lib/index.js';

describe('loops/itself-loops', () => {
    it('should not throw error if detected unordered loop on itself', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .linkWith({ block: 'A' });

        expect(() => graph.dependenciesOf({ block: 'A' })).to.not.throw();
    });

    it('should not throw error if detected ordered loop on itself', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'A' });

        expect(() => graph.dependenciesOf({ block: 'A' })).to.not.throw();
    });
});
