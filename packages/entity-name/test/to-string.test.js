import { expect } from 'chai';
import sinon from 'sinon';
import esmock from 'esmock';

describe('to-string', () => {
    let spy;
    let BemEntityName;

    before(async () => {
        spy = sinon.spy();
        BemEntityName = (await esmock('../lib/entity-name.js', {
            '@bem/sdk.naming.entity.stringify': { default: () => spy }
        })).default;
    });

    it('should use `naming.stringify()` for block', () => {
        const entityName = new BemEntityName({ block: 'block' });

        entityName.toString();

        expect(spy.calledWith({ block: 'block' })).to.be.true;
    });

    it('should use `naming.stringify()` for elem', () => {
        const entityName = new BemEntityName({ block: 'block', elem: 'elem' });

        entityName.toString();

        expect(spy.calledWith({ block: 'block', elem: 'elem' })).to.be.true;
    });

    it('should use `naming.stringify()` for block modifier', () => {
        const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

        entityName.toString();

        expect(spy.calledWith({ block: 'block', mod: { name: 'mod', val: 'val' } })).to.be.true;
    });

    it('should use naming.stringify() for element modifier', () => {
        const entityName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } });

        entityName.toString();

        expect(spy.calledWith({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } })).to.be.true;
    });

});
