import { expect } from 'chai';
import sinon from 'sinon';
import esmock from 'esmock';

describe('save', () => {
    let context;

    beforeEach(async () => {
        const stringifyStub = sinon.stub();

        const save = await esmock('../lib/save.js', {
            '../lib/stringify.js': { default: stringifyStub },
            'node:fs/promises': { writeFile: sinon.stub().resolves() }
        });

        context = {
            stringifyStub: stringifyStub,
            save: save.default || save
        };
    });

    it('method save should be returns Promise', () => {
        const promise = context.save();

        expect(promise).to.be.instanceOf(Promise, 'not a Promise');
    });

    it('method save should be save file in cjs by default', () => {
        const save = context.save;
        const stringifyStub = context.stringifyStub;

        save('decl-test.js');

        expect(stringifyStub.calledWith(undefined, { format: 'v2', exportType: 'cjs' })).to.equal(true);
    });

    it('method save should be save file in custom format', () => {
        const save = context.save;
        const stringifyStub = context.stringifyStub;

        save('decl-test.js', null, { format: 'v5' });

        expect(stringifyStub.calledWith(null, { format: 'v5', exportType: 'cjs' })).to.equal(true);
    });

    it('method save should be save file in custom type', () => {
        const save = context.save;
        const stringifyStub = context.stringifyStub;

        save('decl-test.js', null, { exportType: 'txt' });

        expect(stringifyStub.calledWith(null, { format: 'v2', exportType: 'txt' })).to.equal(true);
    });
});
