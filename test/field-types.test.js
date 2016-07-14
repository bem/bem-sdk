'use strict';

const assert = require('chai').assert;
const BemBundle = require('..');

describe('Result object fields', function () {
    var bundle;

    before(function () {
        bundle = new BemBundle({
            name: 'common',
            bemjson: {
                block: 'block'
            },
            data: {
                recursive: true
            }
        });
    });

    it('name should be a string', function () {
        assert.isString(bundle.name);
    });

    it('bemdecl should be an array', function () {
        assert.isArray(bundle.decl);
    });

    it('bemjson should be an object', function () {
        assert.isObject(bundle.bemjson);
    });

    it('path should be a string', function () {
        assert.isString(bundle.path);
    });

    it('levels should be an array', function () {
        assert.isArray(bundle.levels);
    });

});
