const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

test.beforeEach(t => {
    const stringifyStub = sinon.stub();

    t.context = {
        stringifyStub: stringifyStub,
        save: proxyquire('../lib/save', {
            './stringify': stringifyStub,
            fs: { writeFile: sinon.stub() }
        })
    }
});

test('method save should be returns Promise', t => {
    const promise = t.context.save();

    t.true(promise instanceof Promise, 'not a Promise');
});

test('method save should be save file in cjs by default', t => {
    const save = t.context.save;
    const stringifyStub = t.context.stringifyStub;

    save('decl-test.js');

    t.true(stringifyStub.calledWith(undefined, { format: 'v2', exportType: 'cjs' }));
});

test('method save should be save file in custom format', t => {
    const save = t.context.save;
    const stringifyStub = t.context.stringifyStub;

    save('decl-test.js', null, { format: 'v5' });

    t.true(stringifyStub.calledWith(null, { format: 'v5', exportType: 'cjs' }));
});

test('method save should be save file in custom type', t => {
    const save = t.context.save;
    const stringifyStub = t.context.stringifyStub;

    save('decl-test.js', null, { exportType: 'txt' });

    t.true(stringifyStub.calledWith(null, { format: 'v2', exportType: 'txt' }));
});
