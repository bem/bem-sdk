import { expect } from 'chai';
import path from 'node:path';

import walk from '../../../lib/index.js';

describe('schemes/flat/error', () => {
    it('should throw error if level is not found', done => {
        const levelpath = path.resolve('./not-existing-level');
        const options = {
            defaults: { scheme: 'flat' }
        };

        walk(levelpath ? [levelpath] : [], options)
            .resume()
            .on('error', err => {
                expect(err.code).to.equal('ENOENT', 'err code is wrong');
                expect(err.path).to.equal(levelpath, 'level path is wrong');
                done();
            });
    });
});
