'use strict';

const b_ = require('@bem/sdk.entity-name').create;
const util = require('util');

module.exports = function bemeql(chai) {
    var Assertion = chai.Assertion;

    Assertion.addMethod('bemeql', function (obj) {

        if (Array.isArray(obj) && Array.isArray(this._obj)) {
            if (obj.length !== this._obj.length) {
                this.assert(false,
                    'expected #{act} to deeply equal #{exp}',
                    'expected #{act} to not deeply equal #{exp}',
                    obj.map(inspect),
                    this._obj.map(inspect),
                    true
                );
            }

            const bemObj = obj.map(b_);
            this.assert(
                bemObj.every((e, i) => e.isEqual ? e.isEqual(this._obj[i]) : false),
                'expected #{act} to deeply equal #{exp}',
                'expected #{act} to not deeply equal #{exp}',
                bemObj.map(inspect),
                this._obj.map(inspect),
                true
            );
        }

        function inspect(el) {
            return util.inspect(el, { breakLength: Infinity, maxArrayLength: null, depth: null });
        }

    });
};
