import { assert } from 'chai';
import naming from '@bem/sdk.naming.entity';
const stringify = naming('origin').stringify;

describe('origin stringify', () => {
    it('should stringify block', () => {
        const str = stringify({ block: 'block' });

        assert.equal(str, 'block');
    });

    it('should stringify modifier of block', () => {
        const str = stringify({
            block: 'block',
            mod: { name: 'mod', val: 'val' }
        });

        assert.equal(str, 'block_mod_val');
    });

    it('should stringify simple modifier of block', () => {
        const str = stringify({
            block: 'block',
            mod: 'mod'
        });

        assert.equal(str, 'block_mod');
    });

    it('should stringify boolean modifier of block', () => {
        const str = stringify({
            block: 'block',
            mod: { name: 'mod', val: true },
        });

        assert.equal(str, 'block_mod');
    });

    it('should stringify block if modifier value is `undefined`', () => {
        const str = stringify({
            block: 'block',
            mod: { name: 'mod', val: undefined }
        });

        assert.equal(str, 'block');
    });

    it('should stringify element', () => {
        const str = stringify({
            block: 'block',
            elem: 'elem'
        });

        assert.equal(str, 'block__elem');
    });

    it('should stringify modifier of element', () => {
        const str = stringify({
            block: 'block',
            elem: 'elem',
            mod: { name: 'mod', val: 'val' }
        });

        assert.equal(str, 'block__elem_mod_val');
    });

    it('should stringify simple modifier of element', () => {
        const str = stringify({
            block: 'block',
            elem: 'elem',
            mod: 'mod'
        });

        assert.equal(str, 'block__elem_mod');
    });

    it('should stringify boolean modifier of element', () => {
        const str = stringify({
            block: 'block',
            elem: 'elem',
            mod: { name: 'mod', val: true }
        });

        assert.equal(str, 'block__elem_mod');
    });

    it('should stringify element if modifier value is `undefined`', () => {
        const str = stringify({
            block: 'block',
            elem: 'elem',
            mod: { name: 'mod', val: undefined }
        });

        assert.equal(str, 'block__elem');
    });
});
