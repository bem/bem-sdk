'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const beforeEach = require('mocha').beforeEach;
const afterEach = require('mocha').afterEach;

const expect = require('chai').expect;
const sinon = require('sinon');

const BemEntityName = require('@bem/sdk.entity-name');

const BemCell = require('../index');

const EOL = require('os').EOL;

describe('inspect', () => {
    let stdoutWriteStub;

    beforeEach(() => {
        stdoutWriteStub = sinon.stub(process.stdout, 'write');
    });

    afterEach(() => {
        stdoutWriteStub.restore();
    });

    it('should return entity object', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            tech: 'css'
        });

        console.log(cell);

        const message = `BemCell { entity: { block: 'block' }, tech: 'css' }${EOL}`;

        expect(stdoutWriteStub.calledWith(message)).to.equal(true);
    });
});
