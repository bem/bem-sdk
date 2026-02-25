import { expect } from 'chai';

import BemEntityName from '@bem/sdk.entity-name';

import BemCell from '../index.js';

describe('to-string', () => {
    it('should return string', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' })
        });

        expect(cell.toString()).to.be.a('string');
        expect(cell.toString()).to.be.equal(cell.id);
    });
});
