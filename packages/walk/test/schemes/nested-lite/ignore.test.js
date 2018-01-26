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
        blocks: { scheme: 'nested-lite' }
    }
};

describe('schemes/nested-lite/ignore', () => {
    afterEach('restore fs', () => {
        mockFs.restore();
    });

    it('should end if levels are not specified', () => {
        mockFs({ blocks : { block : { tech : '' } } });

        return toArray(walk([], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore empty level', () => {
        mockFs({
            blocks: {}
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore blocks without techs', () => {
        mockFs({
            blocks: {
                block: {}
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore bem parts in level dir', () => {
        mockFs({
            blocks: {
                block__elem: {
                    tech: ''
                },
                block_mod: {
                    tech: ''
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore files not included in the scheme block/__elem/_mod/_val', () => {
        mockFs({
            blocks: {
                block: {
                    _mod_val : {
                        tech : ''
                    },
                    __elem_mod: {
                        tech: ''
                    },
                    __elem : {
                        _mod_val: {
                            tech: ''
                        }
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore file in root of level', () => {
        mockFs({
            blocks: {
                'block.tech': ''
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

});
