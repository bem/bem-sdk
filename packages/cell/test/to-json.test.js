import { expect } from 'chai';

import BemEntityName from '@bem/sdk.entity-name';

import BemCell from '../index.js';

describe('to-json', () => {
    it('should return stringified cell', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'button' }),
            tech: 'olala'
        });

        expect(JSON.stringify([cell])).to.equal('[{"entity":{"block":"button"},"tech":"olala"}]');
    });
});
