import { expect } from 'chai';

import BemEntityName from '../../index.js';

describe('constructor/errors', () => {
    it('should throw error if not `block` field', () => {
        expect(() => new BemEntityName({ elem: 'elem' })).to.throw(
            'the object `{ elem: \'elem\' }` is not valid BEM entity, the field `block` is undefined'
        );
    });

    it('should throw error if `mod` field is empty object', () => {
        expect(() => new BemEntityName({ block: 'block', mod: {} })).to.throw(
            'the object `{ block: \'block\', mod: {} }` is not valid BEM entity, the field `mod.name` is undefined'
        );
    });

    it('should throw error if `mod.name` field is undefined', () => {
        expect(() => new BemEntityName({ block: 'block', mod: { val: 'val' } })).to.throw(
            'the object `{ block: \'block\', mod: { val: \'val\' } }` is not valid BEM entity, the field `mod.name` is undefined'
        );
    });
});
