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

test.cb('should run walker for level', t => {
    mockFs({
        blocks: {}
    });

    const options = {
        levels: {
            blocks: { scheme: 'flat' }
        }
    };

    t.context.walk(['blocks'], options)
        .resume()
        .on('end', () => {
            mockFs.restore();

            t.true(t.context.flatStub.calledOnce);
            t.end();
        });
});

test.cb('should run walker with naming for level', t => {
    mockFs({
        blocks: {}
    });

    const options = {
        levels: {
            blocks: { naming: 'two-dashes' }
        }
    };

    t.context.walk(['blocks'], options)
        .resume()
        .on('end', () => {
            mockFs.restore();

            t.true(t.context.nestedStub.calledWith(sinon.match({ naming: 'two-dashes' })));
            t.end();
        });
});

test.cb('should run different walkers for different levels', t => {
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

    t.context.walk(['flat.blocks', 'nested.blocks'], options)
        .resume()
        .on('end', () => {
            mockFs.restore();

            t.true(t.context.flatStub.calledWith(sinon.match({ path: 'flat.blocks' })));
            t.true(t.context.nestedStub.calledWith(sinon.match({ path: 'nested.blocks' })));
            t.end();
        });
});

test.cb('should run walkers with different namings for different levels', t => {
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

    t.context.walk(['origin.blocks', 'two-dashes.blocks'], options)
        .resume()
        .on('end', () => {
            mockFs.restore();

            t.true(t.context.nestedStub.calledWith({ path: 'origin.blocks', naming: 'origin' }));
            t.true(t.context.nestedStub.calledWith({ path: 'two-dashes.blocks', naming: 'two-dashes' }));
            t.end();
        });
});
