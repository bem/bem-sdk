import { describe, it } from 'mocha';
import { expect } from 'chai';

import { BemGraph } from '../../lib/index.js';

describe('loops/broken-loops', () => {
    it('should not throw error if detected ordered loop broken in the middle by unordered dependency', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'B' });

        graph
            .vertex({ block: 'B' })
            .linkWith({ block: 'C' });

        graph
            .vertex({ block: 'C' })
            .dependsOn({ block: 'A' });

        expect(() => graph.dependenciesOf({ block: 'A' })).to.not.throw();
    });
});
