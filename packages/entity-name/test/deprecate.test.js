'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const BemEntityName = require('..');

const deprecateSpy = sinon.spy();
const deprecate = proxyquire('../lib/deprecate', {
    'depd':() => deprecateSpy
});

describe('deprecate', () => {
    it('should deprecate object', () => {
        deprecate({ block: 'block' }, 'oldField', 'newField');

        const message = [
            "`oldField` is kept just for compatibility and can be dropped in the future.",
            "Use `newField` instead in `{ block: 'block' }` at"
        ].join(' ');

        expect(deprecateSpy.calledWith(message)).to.be.true;
    });

    it('should deprecate BemEntityName instance', () => {
        deprecate(new BemEntityName({ block: 'block' }), 'oldField', 'newField');

        const message = [
            "`oldField` is kept just for compatibility and can be dropped in the future.",
            "Use `newField` instead in `BemEntityName { block: 'block' }` at"
        ].join(' ');

        expect(deprecateSpy.calledWith(message)).to.be.true;
    });
});
