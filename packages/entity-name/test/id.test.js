'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const BemEntityName = require('..');

describe('id', () => {
    it('should build equal id for equal blocks', () => {
        const entityName1 = new BemEntityName({ block: 'block' });
        const entityName2 = new BemEntityName({ block: 'block' });

        expect(entityName1.id).is.equal(entityName2.id);
    });

    it('should build not equal id for not equal blocks', () => {
        const entityName1 = new BemEntityName({ block: 'block1' });
        const entityName2 = new BemEntityName({ block: 'block2' });

        expect(entityName1.id).is.not.equal(entityName2.id);
    });

    it('should cache id value', () => {
        const stub = sinon.stub().returns('id');
        const StubBemEntityName = proxyquire('../lib/entity-name', {
            '@bem/sdk.naming.entity.stringify': () => stub
        });

        const entityName = new StubBemEntityName({ block: 'block' });

        /*eslint no-unused-expressions: "off"*/
        entityName.id;
        entityName.id;

        expect(stub.callCount).to.equal(1);
    });
});
