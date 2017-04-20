import {EOL} from 'os';

import test from 'ava';
import sinon from 'sinon';

import BemEntityName from '..';

test.beforeEach(t => {
    t.context.stdoutWriteStub = sinon.stub(process.stdout, 'write');
});

test.afterEach(t => {
    t.context.stdoutWriteStub.restore();
});

test('should return entity object', t => {
    const obj = { block: 'block' };
    const entityName = new BemEntityName(obj);

    console.log(entityName);

    const message = `BemEntityName { block: 'block' }${EOL}`;

    t.true(t.context.stdoutWriteStub.calledWith(message));
});
