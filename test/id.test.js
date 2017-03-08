const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const BemEntityName = require('../index');

test('should build equal id for equal blocks', t => {
    const entity1 = new BemEntityName({ block: 'block' });
    const entity2 = new BemEntityName({ block: 'block' });

    t.is(entity1.id, entity2.id);
});

test('should build not equal id for not equal blocks', t => {
    const entity1 = new BemEntityName({ block: 'block1' });
    const entity2 = new BemEntityName({ block: 'block2' });

    t.not(entity1.id, entity2.id);
});

test('should cache id value', t => {
    const stub = sinon.stub().returns('id');
    const StubBemEntityName = proxyquire('../index', {
        '@bem/naming': {
            stringify: stub
        }
    });

    const entity = new StubBemEntityName({ block: 'block' });

    /*eslint no-unused-expressions: "off"*/
    entity.id;
    entity.id;

    t.is(stub.callCount, 1);
});
