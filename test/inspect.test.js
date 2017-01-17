const test = require('ava');
const sinon = require('sinon');
const BemEntityName = require('@bem/entity-name');

const BemCell = require('../index');

const EOL = require('os').EOL;

test.beforeEach(t => {
    t.context.stdoutWriteStub = sinon.stub(process.stdout, 'write');
});

test.afterEach(t => {
    t.context.stdoutWriteStub.restore();
});

test('should return entity object', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' }),
        tech: 'css'
    });

    console.log(cell);

    const message = `BemCell { entity: { block: 'block' }, tech: 'css' }${EOL}`;

    t.true(t.context.stdoutWriteStub.calledWith(message));
});
