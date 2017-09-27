'use strict';

const assert = require('chai').assert;
const naming = require('@bem/sdk.naming.entity')('react');
const parse = naming.parse;

describe('react parse', () => {
    it('should not parse not valid string', () => {
        const obj = parse('(*)(*)');

        assert.equal(obj, undefined);
    });

    it('should parse block', () => {
        const obj = parse('Block');

        assert.equal(obj.block, 'Block');
    });

    it('should parse mod of block', () => {
        const obj = parse('Block_mod_val');

        assert.equal(obj.block, 'Block');
        assert.equal(obj.mod && obj.mod.name, 'mod');
        assert.equal(obj.mod && obj.mod.val, 'val');
    });

    it('should parse boolean mod of block', () => {
        const obj = parse('block_mod');

        assert.equal(obj.block, 'block');
        assert.equal(obj.mod && obj.mod.name, 'mod');

        assert.ok(obj.mod && obj.mod.val);
    });

    it('should parse elem', () => {
        const obj = parse('Block-Elem');

        assert.equal(obj.block, 'Block');
        assert.equal(obj.elem, 'Elem');
    });

    it('should parse mod of elem', () => {
        const obj = parse('block-elem_mod_val');

        assert.equal(obj.block, 'block');
        assert.equal(obj.elem, 'elem');
        assert.equal(obj.mod && obj.mod.name, 'mod');
        assert.equal(obj.mod && obj.mod.val, 'val');
    });

    it('should parse boolean mod of elem', () => {
        const obj = parse('block-elem_mod');

        assert.equal(obj.block, 'block');
        assert.equal(obj.elem, 'elem');
        assert.equal(obj.mod && obj.mod.name, 'mod');

        assert.ok(obj.mod && obj.mod.val);
    });
});
