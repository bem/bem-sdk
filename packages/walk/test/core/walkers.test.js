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

describe('core/walkers', () => {
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

    it('should run walker for level', done => {
        mockFs({
            blocks: {}
        });

        const options = {
            levels: {
                blocks: { scheme: 'flat' }
            }
        };

        context.walk(['blocks'], options)
            .resume()
            .on('end', () => {
                expect(context.flatStub.calledOnce).to.be.true;
                done();
            });
    });

    it('should run walker with naming for level', done => {
        mockFs({
            blocks: {}
        });

        const options = {
            levels: {
                blocks: { naming: 'two-dashes' }
            }
        };

        context.walk(['blocks'], options)
            .resume()
            .on('end', () => {
                expect(context.nestedStub.calledWith(sinon.match({ naming: 'two-dashes' }))).to.be.true;
                done();
            });
    });

    it('should run different walkers for different levels', done => {
        mockFs({
            'flat.blocks': {},
            'nested.blocks': {}
        });

        const options = {
            levels: {
                'flat.blocks': { scheme: 'flat' },
                'nested.blocks': { scheme: 'nested' }
            }
        };

        context.walk(['flat.blocks', 'nested.blocks'], options)
            .resume()
            .on('end', () => {
                expect(context.flatStub.calledWith(sinon.match({ path: 'flat.blocks' }))).to.be.true;
                expect(context.nestedStub.calledWith(sinon.match({ path: 'nested.blocks' }))).to.be.true;
                done();
            });
    });

    it('should run walkers with different namings for different levels', done => {
        mockFs({
            'origin.blocks': {},
            'two-dashes.blocks': {}
        });

        const options = {
            levels: {
                'origin.blocks': { naming: 'origin' },
                'two-dashes.blocks': { naming: 'two-dashes' }
            }
        };

        context.walk(['origin.blocks', 'two-dashes.blocks'], options)
            .resume()
            .on('end', () => {
                expect(context.nestedStub.calledWith({ path: 'origin.blocks', naming: 'origin' })).to.be.true;
                expect(context.nestedStub.calledWith({ path: 'two-dashes.blocks', naming: 'two-dashes' })).to.be.true;
                done();
            });
    });
});
