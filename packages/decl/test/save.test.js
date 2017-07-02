'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const beforeEach = require('mocha').beforeEach;

const expect = require('chai').expect;

const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('save', () => {
    let context;

    beforeEach(() => {
        const stringifyStub = sinon.stub();

        context = {
            stringifyStub: stringifyStub,
            save: proxyquire('../lib/save', {
                './stringify': stringifyStub,
                fs: { writeFile: sinon.stub() }
            })
        };
    });

    it('method save should be returns Promise', () => {
        const promise = context.save();

        expect(promise).to.be.instanceOf(Promise, 'not a Promise');
    });

    it('method save should be save file in cjs by default', () => {
        const save = context.save;
        const stringifyStub = context.stringifyStub;

        save('decl-test.js');

        expect(stringifyStub.calledWith(undefined, { format: 'v2', exportType: 'cjs' })).to.equal(true);
    });

    it('method save should be save file in custom format', () => {
        const save = context.save;
        const stringifyStub = context.stringifyStub;

        save('decl-test.js', null, { format: 'v5' });

        expect(stringifyStub.calledWith(null, { format: 'v5', exportType: 'cjs' })).to.equal(true);
    });

    it('method save should be save file in custom type', () => {
        const save = context.save;
        const stringifyStub = context.stringifyStub;

        save('decl-test.js', null, { exportType: 'txt' });

        expect(stringifyStub.calledWith(null, { format: 'v2', exportType: 'txt' })).to.equal(true);
    });
});
