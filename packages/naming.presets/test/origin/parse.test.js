'use strict';

const assert = require('chai').assert;
const naming = require('@bem/sdk.naming.entity')('origin');
const parse = naming.parse;

describe('origin parse', () => {
    it('should not parse not valid string', () => {
        const obj = parse('(*)_(*)');

        assert.equal(obj, undefined);
    });

    it('should parse block', () => {
        const obj = parse('block');

        assert.equal(obj.block, 'block');
    });

    it('should parse mod of block', () => {
        const obj = parse('block_mod_val');

        assert.equal(obj.block, 'block');
        assert.equal(obj.mod.name, 'mod');
        assert.equal(obj.mod.val, 'val');
    });

    it('should parse boolean mod of block', () => {
        const obj = parse('block_mod');

        assert.equal(obj.block, 'block');
        assert.equal(obj.mod.name, 'mod');

        assert.ok(obj.mod.val);
    });

    it('should parse elem', () => {
        const obj = parse('block__elem');

        assert.equal(obj.block, 'block');
        assert.equal(obj.elem, 'elem');
    });

    it('should parse mod of elem', () => {
        const obj = parse('block__elem_mod_val');

        assert.equal(obj.block, 'block');
        assert.equal(obj.elem, 'elem');
        assert.equal(obj.mod.name, 'mod');
        assert.equal(obj.mod.val, 'val');
    });

    it('should parse boolean mod of elem', () => {
        const obj = parse('block__elem_mod');

        assert.equal(obj.block, 'block');
        assert.equal(obj.elem, 'elem');
        assert.equal(obj.mod.name, 'mod');

        assert.ok(obj.mod.val);
    });
});
