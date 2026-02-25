import { describe, it, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
chai.use(chaiSubset);
const { expect } = chai;

import esmock from 'esmock';
import sinon from 'sinon';
import mockFs from 'mock-fs';

import walkers from '../../lib/walkers/index.js';

describe('core/walkers', () => {
    const context = {};

    beforeEach(async () => {
        const flatStub = sinon.stub(walkers, 'flat').callsArg(2);
        const nestedStub = sinon.stub(walkers, 'nested').callsArg(2);
        const sdkStub = sinon.stub(walkers, 'sdk').callsArg(2);

        const walkModule = await esmock('../../lib/index.js', {
            '../../lib/walkers/index.js': {
                default: {
                    'flat': flatStub,
                    'nested': nestedStub,
                },
                'flat': flatStub,
                'nested': nestedStub,
                'sdk': sdkStub,
            }
        });

        context.walk = walkModule.default;
        context.flatStub = flatStub;
        context.nestedStub = nestedStub;
        context.sdkStub = sdkStub;
    });

    afterEach(() => {
        mockFs.restore();

        context.flatStub.restore();
        context.nestedStub.restore();
        context.sdkStub.restore();
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
                expect(context.sdkStub.calledWith(sinon.match({ naming: { delims: { mod: { name: '--' } } } }))).to.be.true;
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
                const firstCallArg = context.flatStub.getCall(0).args[0];
                expect(firstCallArg.path).to.match(/flat.blocks$/);

                const secondCallArg = context.nestedStub.getCall(0).args[0];
                expect(secondCallArg.path).to.match(/nested.blocks$/);

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
                'origin.blocks': { scheme: 'nested', naming: 'origin' },
                'two-dashes.blocks': { scheme: 'nested', naming: 'two-dashes' }
            }
        };

        context.walk(['origin.blocks', 'two-dashes.blocks'], options)
            .resume()
            .on('end', () => {
                const firstCallArg = context.nestedStub.getCall(0).args[0];
                expect(firstCallArg).to.containSubset({ naming: { delims: { mod: { name: '_' } } } });
                expect(firstCallArg.path).to.match(/origin.blocks$/);

                const secondCallArg = context.nestedStub.getCall(1).args[0];
                expect(secondCallArg).to.containSubset({ naming: { delims: { mod: { name: '--' } } } });
                expect(secondCallArg.path).to.match(/two-dashes.blocks$/);

                done();
            });
    });
});
