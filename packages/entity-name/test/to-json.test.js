import { expect } from 'chai';

import BemEntityName from '../index.js';

describe('to-json', () => {
    it('should create stringified object', () => {
        const entityName = new BemEntityName({ block: 'button' });

        expect(JSON.stringify([entityName])).to.equal('[{"block":"button"}]');
    });

    it('should return normalized object', () => {
        const entityName = new BemEntityName({ block: 'button' });

        expect(entityName.toJSON()).to.deep.equal(entityName.valueOf());
    });
});
