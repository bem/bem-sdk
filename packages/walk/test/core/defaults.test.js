import { expect } from 'chai';

import esmock from 'esmock';
import sinon from 'sinon';
import mockFs from 'mock-fs';

import walkers from '../../lib/walkers/index.js';

describe('core/defaults', () => {
    const context = {};

    beforeEach(async () => {
        const flatStub = sinon.stub(walkers, 'flat').callsArg(2);
        const nestedStub = sinon.stub(walkers, 'nested').callsArg(2);
        const sdkStub = sinon.stub(walkers, 'sdk').callsArg(2);

        const walk = await esmock('../../lib/index.js', {
            '../../lib/walkers/index.js': {
                default: {
                    'flat': flatStub,
                    'nested': nestedStub,
                    'sdk': sdkStub,
                },
                'flat': flatStub,
                'nested': nestedStub,
                'sdk': sdkStub,
            }
        });

        context.walk = walk.default;
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

    it('should run nested walker by default', done => {
        mockFs({
            blocks: {}
        });

        context.walk(['blocks'])
            .resume()
            .on('end', () => {
                expect(context.sdkStub.calledOnce).to.be.true;
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
                expect(context.sdkStub.calledWith(sinon.match({ naming: { delims: { mod: { name: '--' } } } }))).to.be.true;
                done();
            })
            .on('error', err => done(err));
    });
});
