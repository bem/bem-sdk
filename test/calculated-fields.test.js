'use strict';

const assert = require('chai').assert;
const BemBundle = require('..');
const bemjsonToDecl = require('bemjson-to-decl');

describe('bemjson given:', function () {
    it('should generate bemdecl by given bemjson', function () {
        const bemjson = {
            block: 'block',
            content: {
                elem: 'elem'
            }
        };
        const bundle = new BemBundle({
            name: 'common',
            bemjson: bemjson
        });

        assert.deepEqual(bundle.decl, bemjsonToDecl.convert(bemjson));
    });
});

describe('path given: ', function () {
    it('should generate name by given path', function () {
        const bundle = new BemBundle({
            path: './desktop.bundles/index',
            bemjson: {
                block: 'block'
            }
        });

        assert.equal(bundle.name, 'index');
    });
});
