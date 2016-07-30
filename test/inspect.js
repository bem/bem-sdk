const test = require('ava');
const sinon = require('sinon');

const BemEntityName = require('../index');

const EOL = require('os').EOL;

test.beforeEach(t => {
    t.context.stdoutWriteStub = sinon.stub(process.stdout, 'write');
});

test.afterEach(t => {
    t.context.stdoutWriteStub.restore();
});

test('should return entity object', t => {
    const obj = { block: 'block' };
    const entity = new BemEntityName(obj);

    console.log(entity);

    const message = `BemEntityName { block: 'block' }${EOL}`;

    t.true(t.context.stdoutWriteStub.calledWith(message));
});
