'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const beforeEach = require('mocha').beforeEach;
const afterEach = require('mocha').afterEach;

const expect = require('chai').expect;

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const mockFs = require('mock-fs');

const walkers = require('../../lib/walkers');

describe('core/defaults', () => {
    const context = {};

    beforeEach(() => {
        const flatStub = sinon.stub(walkers, 'flat').callsArg(2);
        const nestedStub = sinon.stub(walkers, 'nested').callsArg(2);

        const walk = proxyquire('../../lib/index', {
            './walkers': {
                'flat': flatStub,
                'nested': nestedStub
            }
        });

        context.walk = walk;
        context.flatStub = flatStub;
        context.nestedStub = nestedStub;
    });

    afterEach(() => {
        mockFs.restore();

        context.flatStub.restore();
        context.nestedStub.restore();
    });

    it('should run nested walker by default', done => {
        mockFs({
            blocks: {}
        });

        context.walk(['blocks'])
            .resume()
            .on('end', () => {
                expect(context.nestedStub.calledOnce).to.be.true;
                done();
            })
            .on('error', err => done(err));
    });

    it('should run walker for default scheme', done => {
        mockFs({
            blocks: {}
        });

        context.walk(['blocks'], { defaults: { scheme: 'flat' } })
            .resume()
            .on('end', () => {
                expect(context.flatStub.calledOnce).to.be.true;
                done();
            })
            .on('error', err => done(err));
    });

    it('should run walker with default naming', done => {
        mockFs({
            blocks: {}
        });

        context.walk(['blocks'], { defaults: { naming: 'two-dashes' } })
            .resume()
            .on('end', () => {
                expect(context.nestedStub.calledWith(sinon.match({ naming: 'two-dashes' }))).to.be.true;
                done();
            })
            .on('error', err => done(err));
    });
});
