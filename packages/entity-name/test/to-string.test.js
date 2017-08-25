import test from 'ava';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

const spy = sinon.spy();
const BemEntityName = proxyquire('../lib/entity-name', {
    '@bem/sdk.naming.entity.stringify': () => spy
});

test('should use `naming.stringify()` for block', t => {
    const entityName = new BemEntityName({ block: 'block' });

    entityName.toString();

    t.true(spy.calledWith({ block: 'block' }));
});

test('should use `naming.stringify()` for elem', t => {
    const entityName = new BemEntityName({ block: 'block', elem: 'elem' });

    entityName.toString();

    t.true(spy.calledWith({ block: 'block', elem: 'elem' }));
});

test('should use `naming.stringify()` for block modifier', t => {
    const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

    entityName.toString();

    t.true(spy.calledWith({ block: 'block', mod: { name: 'mod', val: 'val' } }));
});

test('should use naming.stringify() for element modifier', t => {
    const entityName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } });

    entityName.toString();

    t.true(spy.calledWith({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } }));
});
