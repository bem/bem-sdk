import { expect } from 'chai';
import sinon from 'sinon';

import BemEntityName from '../index.js';

describe('deprecate', () => {
    let emitWarningSpy;

    beforeEach(async () => {
        emitWarningSpy = sinon.spy(process, 'emitWarning');
    });

    afterEach(() => {
        emitWarningSpy.restore();
    });

    it('should deprecate object', async () => {
        // Import a fresh deprecate module via esmock to reset its internal Set
        const esmock = (await import('esmock')).default;
        const { default: deprecate } = await esmock('../lib/deprecate.js', {});

        deprecate({ block: 'block' }, 'oldField', 'newField');

        const message = [
            "`oldField` is kept just for compatibility and can be dropped in the future.",
            "Use `newField` instead in `{ block: 'block' }` at"
        ].join(' ');

        expect(emitWarningSpy.calledWith(message, 'DeprecationWarning')).to.be.true;
    });

    it('should deprecate BemEntityName instance', async () => {
        const esmock = (await import('esmock')).default;
        const { default: deprecate } = await esmock('../lib/deprecate.js', {});

        deprecate(new BemEntityName({ block: 'block' }), 'oldField', 'newField');

        const message = [
            "`oldField` is kept just for compatibility and can be dropped in the future.",
            "Use `newField` instead in `BemEntityName { block: 'block' }` at"
        ].join(' ');

        expect(emitWarningSpy.calledWith(message, 'DeprecationWarning')).to.be.true;
    });
});
