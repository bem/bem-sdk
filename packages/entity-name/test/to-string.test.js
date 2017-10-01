'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const spy = sinon.spy();
const BemEntityName = proxyquire('../lib/entity-name', {
    '@bem/sdk.naming.entity.stringify': () => spy
});

describe('to-string', () => {
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
