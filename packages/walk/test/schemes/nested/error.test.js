'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;
const path = require('path');

const walk = require('../../../lib/index');

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
