import test from 'ava';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

import BemEntity from '../index';

test('should build equal id for equal blocks', t => {
    const entity1 = new BemEntity({ block: 'block' });
    const entity2 = new BemEntity({ block: 'block' });

    t.is(entity1.id, entity2.id);
});

test('should build not equal id for not equal blocks', t => {
    const entity1 = new BemEntity({ block: 'block1' });
    const entity2 = new BemEntity({ block: 'block2' });

    t.not(entity1.id, entity2.id);
});

test('should cache id value', t => {
    const stub = sinon.stub().returns('id');
    const StubBemEntity = proxyquire('../index', {
        'bem-naming': {
            stringify: stub
        }
    });

    const entity = new StubBemEntity({ block: 'block' });

    /*eslint no-unused-expressions: "off"*/
    entity.id;
    entity.id;

    t.is(stub.callCount, 1);
});
