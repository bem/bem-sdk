import test from 'ava';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

import BemEntityName from '..';

test('should build equal id for equal blocks', t => {
    const entityName1 = new BemEntityName({ block: 'block' });
    const entityName2 = new BemEntityName({ block: 'block' });

    t.is(entityName1.id, entityName2.id);
});

test('should build not equal id for not equal blocks', t => {
    const entityName1 = new BemEntityName({ block: 'block1' });
    const entityName2 = new BemEntityName({ block: 'block2' });

    t.not(entityName1.id, entityName2.id);
});

test('should cache id value', t => {
    const stub = sinon.stub().returns('id');
    const StubBemEntityName = proxyquire('../lib/entity-name', {
        '@bem/naming': {
            stringify: stub
        }
    });

    const entityName = new StubBemEntityName({ block: 'block' });

    /*eslint no-unused-expressions: "off"*/
    entityName.id;
    entityName.id;

    t.is(stub.callCount, 1);
});
