const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const spy = sinon.spy();
const BemEntityName = proxyquire('../index', {
    'bem-naming': {
        stringify: spy
    }
});

test('should use `naming.stringify()` for block', t => {
    const entity = new BemEntityName({ block: 'block' });

    entity.toString();

    t.truthy(spy.calledWith({ block: 'block' }));
});

test('should use `naming.stringify()` for elem', t => {
    const entity = new BemEntityName({ block: 'block', elem: 'elem' });

    entity.toString();

    t.truthy(spy.calledWith({ block: 'block', elem: 'elem' }));
});

test('should use `naming.stringify()` for block modifier', t => {
    const entity = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

    entity.toString();

    t.truthy(spy.calledWith({ block: 'block', modName: 'mod', modVal: 'val' }));
});

test('should use naming.stringify() for element modifier', t => {
    const entity = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } });

    entity.toString();

    t.truthy(spy.calledWith({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }));
});
