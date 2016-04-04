import test from 'ava';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

const spy = sinon.spy();
const BemEntity = proxyquire('../index', {
    'bem-naming': {
        typeOf: spy
    }
});

test('should use `naming.typeOf()` for block', t => {
    const entity = new BemEntity({ block: 'block' });

    /*eslint no-unused-expressions: "off"*/
    entity.type;

    t.ok(spy.calledWith({ block: 'block' }));
});

test('should use `naming.typeOf()` for elem', t => {
    const entity = new BemEntity({ block: 'block', elem: 'elem' });

    /*eslint no-unused-expressions: "off"*/
    entity.type;

    t.ok(spy.calledWith({ block: 'block', elem: 'elem' }));
});

test('should use `naming.typeOf()` for block modifier', t => {
    const entity = new BemEntity({ block: 'block', modName: 'mod', modVal: 'val' });

    /*eslint no-unused-expressions: "off"*/
    entity.type;

    t.ok(spy.calledWith({ block: 'block', modName: 'mod', modVal: 'val' }));
});

test('should use naming.typeOf() for element modifier', t => {
    const entity = new BemEntity({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' });

    /*eslint no-unused-expressions: "off"*/
    entity.type;

    t.ok(spy.calledWith({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }));
});
