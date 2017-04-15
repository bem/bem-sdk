const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const BemEntityName = require('../lib/entity-name');

const deprecateSpy = sinon.spy();
const deprecate = proxyquire('../lib/deprecate', {
    'depd':() => deprecateSpy
});

test('should deprecate object', t => {
    deprecate({ block: 'block' }, 'oldField', 'newField');

    const message = [
        "`oldField` is kept just for compatibility and can be dropped in the future.",
        "Use `newField` instead in `{ block: 'block' }` at"
    ].join(' ');

    t.true(deprecateSpy.calledWith(message));
});

test('should deprecate BemEntityName instance', t => {
    deprecate(new BemEntityName({ block: 'block' }), 'oldField', 'newField');

    const message = [
        "`oldField` is kept just for compatibility and can be dropped in the future.",
        "Use `newField` instead in `BemEntityName { block: 'block' }` at"
    ].join(' ');

    t.true(deprecateSpy.calledWith(message));
});
