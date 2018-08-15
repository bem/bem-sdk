'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;
const path = require('path');

const walk = require('../../../lib/index');

describe('schemes/flat/error', () => {
    it('should throw error if level is not found', done => {
        const levelpath = path.resolve('./not-existing-level');
        const options = {
            defaults: { scheme: 'flat' }
        };

        walk([levelpath], options)
            .resume()
            .on('error', err => {
                expect(err.code).to.equal('ENOENT', 'err code is wrong');
                expect(err.path).to.equal(levelpath, 'level path is wrong');
                done();
            });
    });
});
