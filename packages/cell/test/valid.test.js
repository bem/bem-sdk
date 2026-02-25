import { expect } from 'chai';

import BemEntityName from '@bem/sdk.entity-name';

import BemCell from '../index.js';

describe('valid', () => {
    it('should throw error if not provide arguments', () => {
        expect(() => new BemCell()).to.throw(
            'Required `entity` field'
        );
    });

    it('should throw error if entity is undefined', () => {
        expect(() => new BemCell({})).to.throw(
            'Required `entity` field'
        );
    });

    it('should throw error for if entity is undefined', () => {
        expect(() => new BemCell({ entity: { block: 'block' } })).to.throw(
            'The `entity` field should be an instance of BemEntityName'
        );
    });

    it('should throw error for if entity is undefined', () => {
        expect(
            () => new BemCell({ entity: new BemEntityName({ block: 'block' }) })
        ).to.not.throw();
    });

});
