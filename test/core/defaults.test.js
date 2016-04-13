'use strict';

const test = require('ava');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const mockFs = require('mock-fs');

const walkers = require('../../lib/walkers');

test.beforeEach(t => {
    const flatStub = sinon.stub(walkers, 'flat').callsArg(2);
    const nestedStub = sinon.stub(walkers, 'nested').callsArg(2);

    const walk = proxyquire('../../lib/index', {
        './walkers': {
            'flat': flatStub,
            'nested': nestedStub
        }
    });

    t.context.walk = walk;
    t.context.flatStub = flatStub;
    t.context.nestedStub = nestedStub;
});

test.afterEach(t => {
    t.context.flatStub.restore();
    t.context.nestedStub.restore();
});

test.cb('should run nested walker by default', t => {
    mockFs({
        blocks: {}
    });

    t.context.walk(['blocks'])
        .resume()
        .on('end', () => {
            mockFs.restore();

            t.true(t.context.nestedStub.calledOnce);
            t.end();
        })
        .on('error', err => t.end(err));
});

test.cb('should run walker for default scheme', t => {
    mockFs({
        blocks: {}
    });

    t.context.walk(['blocks'], { defaults: { scheme: 'flat' } })
        .resume()
        .on('end', () => {
            mockFs.restore();

            t.true(t.context.flatStub.calledOnce);
            t.end();
        })
        .on('error', err => t.end(err));
});

test.cb('should run walker with default naming', t => {
    mockFs({
        blocks: {}
    });

    t.context.walk(['blocks'], { defaults: { naming: 'two-dashes' } })
        .resume()
        .on('end', () => {
            mockFs.restore();

            t.true(t.context.nestedStub.calledWith(sinon.match({ naming: 'two-dashes' })));
            t.end();
        })
        .on('error', err => t.end(err));
});
