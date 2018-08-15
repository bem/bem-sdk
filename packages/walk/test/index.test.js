'use strict';

const { describe, it } = require('mocha');
const { expect, use } = require('chai');
use(require('chai-as-promised'));

const { asArray } = require('..');

describe('asArray', () => {
    it('should return an empty array', async () => {
        expect(await asArray(['.'])).to.eql([]);
    });

    it('should throw on incorrect', async () => {
        expect(asArray(['unknown-direction'])).to.be.rejectedWith(/ENOENT/);
    });
});
