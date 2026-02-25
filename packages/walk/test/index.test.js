import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);

import { asArray } from '../lib/index.js';

describe('asArray', () => {
    it('should return an empty array', async () => {
        expect(await asArray(['.'])).to.eql([]);
    });

    it('should throw on incorrect', async () => {
        expect(asArray(['unknown-direction'])).to.be.rejectedWith(/ENOENT/);
    });
});
