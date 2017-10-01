'use strict';

const util = require('util');

const describe = require('mocha').describe;
const it = require('mocha').it;
const beforeEach = require('mocha').beforeEach;
const afterEach = require('mocha').afterEach;

const expect = require('chai').expect;
const sinon = require('sinon');

const BemFile = require('..');

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
        const file = new BemFile({
            cell: { entity: { block: 'block' }, tech: 'css' },
            level: 'asd/qwe'
        });

        console.log(file);

        const message = `BemFile { cell: { entity: { block: 'block' }, tech: 'css' },${EOL}  level: 'asd/qwe' }${EOL}`;

        expect(stdoutWriteStub.calledWith(message)).to.equal(true, `expected: '${message}', but got: '${util.inspect(file)}'`);
    });
});
