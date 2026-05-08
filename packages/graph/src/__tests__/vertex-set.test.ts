import { expect } from 'chai';
import { BemEntityName } from '@bem/sdk.entity-name';
import { BemCell } from '@bem/sdk.cell';
import { VertexSet } from '../vertex-set.js';
describe('vertex-set.test.js', () => {
    it('should add different vertices', () => {
        const set = new VertexSet();
        const vertex1 = new BemCell({ entity: new BemEntityName({ block: 'input' }) });
        const vertex2 = new BemCell({ entity: new BemEntityName({ block: 'button' }) });

        set.add(vertex1).add(vertex2);

        expect(set.size).to.equal(2);
    });

    it('should not add equal vertex', () => {
        const set = new VertexSet();
        const entity = new BemEntityName({ block: 'input' });
        const vertex1 = new BemCell({ entity });
        const vertex2 = new BemCell({ entity });

        set.add(vertex1).add(vertex2);

        expect(set.size).to.equal(1);
    });
});
