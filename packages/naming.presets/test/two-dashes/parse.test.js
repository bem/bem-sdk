'use strict';

const assert = require('chai').assert;
const naming = require('@bem/sdk.naming.entity')('two-dashes');
const parse = naming.parse;

describe('two-dashes parse', () => {
    it('should not parse not valid string', () => {
        const obj = parse('(*)--(*)');

        assert.equal(obj, undefined);
    });

    it('should parse block', () => {
        const obj = parse('block');

        assert.equal(obj.block, 'block');
    });

    it('should parse mod of block', () => {
        const obj = parse('block--mod_val');

        assert.equal(obj.block, 'block');
        assert.equal(obj.mod && obj.mod.name, 'mod');
        assert.equal(obj.mod && obj.mod.val, 'val');
    });

    it('should parse boolean mod of block', () => {
        const obj = parse('block--mod');

        assert.equal(obj.block, 'block');
        assert.equal(obj.mod && obj.mod.name, 'mod');

        assert.ok(obj.mod && obj.mod.val);
    });

    it('should parse elem', () => {
        const obj = parse('block__elem');

        assert.equal(obj.block, 'block');
        assert.equal(obj.elem, 'elem');
    });

    it('should parse mod of elem', () => {
        const obj = parse('block__elem--mod_val');

        assert.equal(obj.block, 'block');
        assert.equal(obj.elem, 'elem');
        assert.equal(obj.mod && obj.mod.name, 'mod');
        assert.equal(obj.mod && obj.mod.val, 'val');
    });

    it('should parse boolean mod of elem', () => {
        const obj = parse('block__elem--mod');

        assert.equal(obj.block, 'block');
        assert.equal(obj.elem, 'elem');
        assert.equal(obj.mod && obj.mod.name, 'mod');

        assert.ok(obj.mod && obj.mod.val);
    });
});
