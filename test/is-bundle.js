'use strict';

const assert = require('chai').assert;
const BemBundle = require('..');

describe('isBundle', function () {

    it('should validate bemBundle', function () {
        var bundle = new BemBundle({
            name: 'common',
            bemjson: {
                block: 'block'
            }
        });

        assert.isTrue(BemBundle.isBundle(bundle));
    });

    it('you should not pass!!1', function () {
        assert.isNotTrue(BemBundle.isBundle({}));
    });

});
