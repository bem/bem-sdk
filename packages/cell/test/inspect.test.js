import util from 'node:util';

import { expect } from 'chai';

import BemEntityName from '@bem/sdk.entity-name';
import BemCell from '../index.js';

describe('inspect', () => {
    it('should return entity object', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            tech: 'css'
        });

        const message = `BemCell { entity: { block: 'block' }, tech: 'css' }`;
        expect(util.inspect(cell)).to.equal(message);
    });
});
