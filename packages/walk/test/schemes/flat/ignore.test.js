'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const afterEach = require('mocha').afterEach;

const expect = require('chai').expect;

const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../../lib/index');

const options = {
    levels: {
        blocks: { scheme: 'flat' }
    }
};

describe('schemes/flat/ignore', () => {
    afterEach('restore fs', () => {
        mockFs.restore();
    });

    it('should end if levels are not specified', () => {
        mockFs({});

        return toArray(walk([], options))
            .then(files => {
                expect(files).to.deep.equal([]);
            });
    });

    it('should ignore empty level', () => {
        mockFs({
            blocks: {}
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                expect(files).to.deep.equal([]);
            });
    });

    it('should ignore files without extension', () => {
        mockFs({
            blocks: {
                block: ''
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                expect(files).to.deep.equal([]);
            });
    });

    it('should ignore files with no BEM basename', () => {
        mockFs({
            blocks: {
                '^_^.ext': ''
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                expect(files).to.deep.equal([]);
            });
    });
});
