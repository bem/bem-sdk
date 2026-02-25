import { describe, it } from 'mocha';
import { expect } from 'chai';
import path from 'node:path';

import walk from '../../../lib/index.js';

describe('schemes/nested/error', () => {
    it('should throw error if level is not found', done => {
        const levelpath = path.resolve('./not-existing-level');
        const options = {
            defaults: { scheme: 'nested' }
        };

        walk([levelpath], options)
            .resume()
            .on('error', err => {
                expect(err.code).to.equal('ENOENT');
                expect(err.path).to.equal(levelpath);
                done();
            });
    });
});
