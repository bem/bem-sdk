'use strict';

const assert = require('chai').assert;
const BemBundle = require('..');

describe('throw exception', function () {
    it('should throw if no bemjson and bemdecl given', function () {
        assert.throws(function () {
            new BemBundle({}); // eslint-disable-line no-new
        }, Error, 'BEMJSON or BEMDECL must be present');
    });

    it('should throw if bemjson not an object', function () {
        assert.throws(function () {
            new BemBundle({ // eslint-disable-line no-new
                bemjson: 'bemjson'
            });
        }, Error, 'BEMJSON should be an object');
    });

    it('should throw if levels given but not an array', function () {
        assert.throws(function () {
            new BemBundle({ // eslint-disable-line no-new
                bemjson: {
                    block: 'block'
                },
                levels: 'desktop.blocks'
            });
        }, Error, 'Levels must be array of string');
    });

    it('should throw if no path and name given', function () {
        assert.throws(function () {
            new BemBundle({ // eslint-disable-line no-new
                bemjson: {
                    block: 'block'
                }
            });
        }, Error, 'Bundle name or path must be present');
    });

});
